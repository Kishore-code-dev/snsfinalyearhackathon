from fastapi import APIRouter, UploadFile, File, HTTPException
from backend.app.schemas.ai import InvoiceAnalysisRequest, AIAnalysisResult, db
from backend.app.agents.extractor import InvoiceParserAgent
from backend.app.agents.security import SecurityAgent
from backend.app.agents.decision import DecisionAgent
from typing import List
import PyPDF2
import io
import logging
import base64

# OCR imports (with multiple fallback options)
try:
    import pytesseract
    from pdf2image import convert_from_bytes
    from PIL import Image
    OCR_AVAILABLE = True
except ImportError:
    OCR_AVAILABLE = False
    pytesseract = None
    convert_from_bytes = None

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/v1", tags=["Autonomous Pipeline"])

extractor = InvoiceParserAgent()
security = SecurityAgent()
decision_engine = DecisionAgent()

def extract_text_with_ocr_fallback(pdf_contents: bytes) -> str:
    """
    Intelligent text extraction with multiple fallback strategies.
    Returns extracted text or raises helpful error.
    """
    raw_text = ""
    
    # === STRATEGY 1: PyPDF2 (Fast, but only works for text-based PDFs) ===
    try:
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(pdf_contents))
        num_pages = len(pdf_reader.pages)
        logger.info(f"📑 PDF has {num_pages} pages")
        
        for page_num, page in enumerate(pdf_reader.pages):
            page_text = page.extract_text()
            logger.info(f"   Page {page_num + 1}: {len(page_text)} chars")
            raw_text += page_text + "\n"
        
        logger.info(f"✅ PyPDF2 total: {len(raw_text)} chars")
        
    except Exception as pdf_error:
        logger.error(f"❌ PyPDF2 failed: {str(pdf_error)}")
        raise HTTPException(400, f"PDF reading error: {str(pdf_error)}")
    
    # === STRATEGY 2: Check if we got enough text ===
    if raw_text.strip() and len(raw_text.strip()) >= 50:
        logger.info("✅ Sufficient text extracted via PyPDF2")
        return raw_text
    
    # === STRATEGY 3: OCR Required ===
    logger.warning(f"⚠️ Only {len(raw_text.strip())} chars - PDF is likely scanned/image-based")
    
    if not OCR_AVAILABLE:
        raise HTTPException(
            400,
            detail="This PDF is scanned (image-based). OCR libraries missing. For full support: 1) Install Tesseract from https://github.com/UB-Mannheim/tesseract/wiki or 2) Use 'Paste Text' tab instead."
        )
    
    # === STRATEGY 4: Tesseract OCR ===
    logger.info("🔍 Attempting Tesseract OCR...")
    
    try:
        # Check if Tesseract is actually installed
        tesseract_test = pytesseract.get_tesseract_version()
        logger.info(f"✅ Tesseract version: {tesseract_test}")
        
    except Exception as tess_check:
        logger.error(f"❌ Tesseract not found: {str(tess_check)}")
        
        raise HTTPException(
            500,
            detail=f"Scanned PDF detected, but Tesseract OCR not installed. Download from: https://github.com/UB-Mannheim/tesseract/wiki (Windows installer). Add to PATH, then restart backend. OR use 'Paste Text' tab."
        )
    
    try:
        # Convert PDF to images
        images = convert_from_bytes(pdf_contents, dpi=300)
        logger.info(f"🖼️ Converted {len(images)} pages to images")
        
        raw_text = ""
        for page_num, image in enumerate(images):
            logger.info(f"   OCR processing page {page_num + 1}...")
            page_text = pytesseract.image_to_string(image, lang='eng')
            raw_text += page_text + "\n"
            logger.info(f"   ✅ Page {page_num + 1}: {len(page_text)} chars via OCR")
        
        logger.info(f"✅ OCR total: {len(raw_text)} chars")
        
        if not raw_text.strip():
            raise HTTPException(
                400,
                "OCR extracted no text. PDF may be encrypted, extremely low quality, or in unsupported language."
            )
        
        return raw_text
        
    except HTTPException:
        raise
    except Exception as ocr_error:
        logger.error(f"❌ OCR failed: {str(ocr_error)}", exc_info=True)
        raise HTTPException(500, f"OCR processing error: {str(ocr_error)}")

@router.post("/process-invoice", response_model=AIAnalysisResult)
async def process_invoice(payload: InvoiceAnalysisRequest):
    """Core AI Pipeline (Text Input)"""
    
    logger.info(f"📝 Processing text invoice ({len(payload.raw_text)} chars)")
    
    try:
        extracted_data = extractor.extract(payload.raw_text)
        logger.info(f"💾 Extracted: {extracted_data}")
        
        fingerprint = security.fingerprint(
            vendor=extracted_data.get('vendor_name', ''),
            inv_id=extracted_data.get('invoice_number', ''),
            amount=extracted_data.get('amount', 0)
        )
        is_duplicate = security.check_duplicate(fingerprint)
        vendor_trust = security.verify_vendor(extracted_data.get('vendor_name', ''))
        
        security_context = {
            "is_duplicate": is_duplicate,
            "vendor_status": vendor_trust.get('status'),
            "vendor_score": vendor_trust.get('score'),
            "fingerprint": fingerprint
        }

        analysis_result = decision_engine.evaluate(extracted_data, security_context)
        
        db.save_decision(
            invoice_id=extracted_data.get('invoice_number', 'UNK'),
            payload=analysis_result.dict()
        )
        
        logger.info(f"✅ Decision: {analysis_result.decision} ({analysis_result.confidence_score})")
        return analysis_result
        
    except Exception as e:
        logger.error(f"❌ Error: {str(e)}")
        raise HTTPException(500, f"Processing failed: {str(e)}")

@router.post("/process-invoice-file", response_model=AIAnalysisResult)
async def process_invoice_file(file: UploadFile = File(...)):
    """
    AI Pipeline with Smart Text Extraction
    Handles both text-based and scanned PDFs
    """
    
    if not file.filename:
        raise HTTPException(400, "No filename provided")
    
    file_ext = file.filename.lower().split('.')[-1]
    logger.info(f"📄 Processing: {file.filename}")
    
    if file_ext != 'pdf':
        raise HTTPException(400, f"Only PDF supported. Got: {file_ext}")
    
    try:
        contents = await file.read()
        logger.info(f"📦 File size: {len(contents)} bytes")
        
        # Extract text (with OCR if needed)
        raw_text = extract_text_with_ocr_fallback(contents)
        
        logger.info(f"📝 Preview (200 chars): {raw_text[:200]}")
        
        # Extract invoice data
        extracted_data = extractor.extract(raw_text)
        logger.info(f"💾 Extracted: {extracted_data}")
        
        if extracted_data.get('amount', 0) == 0:
            logger.warning("⚠️ Amount = 0 (unusual format)")
        
        # Security pipeline
        fingerprint = security.fingerprint(
            vendor=extracted_data.get('vendor_name', ''),
            inv_id=extracted_data.get('invoice_number', ''),
            amount=extracted_data.get('amount', 0)
        )
        is_duplicate = security.check_duplicate(fingerprint)
        vendor_trust = security.verify_vendor(extracted_data.get('vendor_name', ''))
        
        security_context = {
            "is_duplicate": is_duplicate,
            "vendor_status": vendor_trust.get('status'),
            "vendor_score": vendor_trust.get('score'),
            "fingerprint": fingerprint
        }

        analysis_result = decision_engine.evaluate(extracted_data, security_context)
        
        db.save_decision(
            invoice_id=extracted_data.get('invoice_number', 'UNK'),
            payload=analysis_result.dict()
        )
        
        logger.info(f"✅ Decision: {analysis_result.decision} (confidence: {analysis_result.confidence_score})")
        return analysis_result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error: {str(e)}", exc_info=True)
        raise HTTPException(500, f"Processing failed: {str(e)}")

@router.get("/decision-logs", response_model=List[dict])
async def get_logs():
    """Return all decision logs"""
    log_data = db.get_logs()
    logger.info(f"📊 Returning {len(log_data)} logs")
    return log_data

@router.get("/health")
def health_check():
    """System status"""
    tesseract_installed = False
    tesseract_version = "Not installed"
    
    if OCR_AVAILABLE:
        try:
            tesseract_version = str(pytesseract.get_tesseract_version())
            tesseract_installed = True
        except:
            tesseract_version = "Libraries installed, but Tesseract.exe not found"
    
    return {
        "status": "running",
        "ocr_libraries_installed": OCR_AVAILABLE,
        "tesseract_installed": tesseract_installed,
        "tesseract_version": tesseract_version,
        "capabilities": {
            "text_pdf": True,
            "scanned_pdf": tesseract_installed
        }
    }

@router.get("/debug/extract-text")
async def debug_extract(file: UploadFile = File(...)):
    """Debug: See exact extracted text"""
    contents = await file.read()
    
    try:
        raw_text = extract_text_with_ocr_fallback(contents)
        return {
            "filename": file.filename,
            "total_chars": len(raw_text),
            "extracted_text": raw_text,
            "method_used": "OCR" if len(raw_text) > 100 else "PyPDF2"
        }
    except HTTPException as e:
        return {
            "filename": file.filename,
            "error": e.detail,
            "status_code": e.status_code
        }
