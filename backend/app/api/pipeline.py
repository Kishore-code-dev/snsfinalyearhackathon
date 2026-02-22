from fastapi import APIRouter, UploadFile, File, HTTPException
from backend.app.schemas.ai import InvoiceAnalysisRequest, AIAnalysisResult, db
from backend.app.agents.extractor import InvoiceParserAgent
from backend.app.agents.security import SecurityAgent
from backend.app.agents.decision import DecisionAgent
from backend.app.agents.vision import vision_engine
from typing import List, Dict, Any
import PyPDF2
import io
import logging
import base64
import csv

# --- File Handling Imports ---
try:
    from PIL import Image
    import pytesseract
    from pdf2image import convert_from_bytes
    import openpyxl
    from docx import Document
    OCR_AVAILABLE = True
except ImportError:
    OCR_AVAILABLE = False
    pytesseract = None

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/v1", tags=["Autonomous Pipeline"])

extractor = InvoiceParserAgent()
security = SecurityAgent()
decision_engine = DecisionAgent()

def extract_text_from_file(file_contents: bytes, filename: str) -> str:
    """
    Universal Text Extractor for PDF, Images, Excel, Word, and Text.
    """
    ext = filename.lower().split('.')[-1]
    logger.info(f"📂 Extracting text from .{ext} file")
    
    # ── 1. PDF HANDLING ──────────────────────────────────────────────────────
    if ext == 'pdf':
        text = ""
        # Try PyPDF2 first
        try:
            pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_contents))
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
        except Exception as e:
            logger.warning(f"PyPDF2 failed: {e}")
            
        # If PyPDF2 failed or returned little text, use OCR
        if len(text.strip()) < 50 and OCR_AVAILABLE:
            logger.info("🔍 PDF text scanty - switching to OCR")
            try:
                images = convert_from_bytes(file_contents)
                text = ""
                for img in images:
                    text += pytesseract.image_to_string(img) + "\n"
            except Exception as e:
                logger.error(f"OCR failed: {e}")
                
        return text

    # ── 2. IMAGE HANDLING (JPG, PNG, WEBP) ───────────────────────────────────
    elif ext in ['jpg', 'jpeg', 'png', 'webp', 'bmp', 'tiff']:
        if not OCR_AVAILABLE:
            raise HTTPException(400, "OCR libraries not installed. Cannot process images.")
        try:
            image = Image.open(io.BytesIO(file_contents))
            return pytesseract.image_to_string(image)
        except Exception as e:
            raise HTTPException(400, f"Image OCR failed: {str(e)}")

    # ── 3. WORD DOCUMENTS (DOCX) ─────────────────────────────────────────────
    elif ext == 'docx':
        try:
            doc = Document(io.BytesIO(file_contents))
            return "\n".join([p.text for p in doc.paragraphs])
        except Exception as e:
            raise HTTPException(400, f"DOCX read failed: {str(e)}")

    # ── 4. EXCEL SPREADSHEETS (XLSX) ─────────────────────────────────────────
    elif ext == 'xlsx':
        try:
            wb = openpyxl.load_workbook(io.BytesIO(file_contents), data_only=True)
            text = ""
            for sheet in wb.sheetnames:
                ws = wb[sheet]
                for row in ws.values:
                    # Convert row cells to string and join
                    row_text = " ".join([str(cell) for cell in row if cell is not None])
                    text += row_text + "\n"
            return text
        except Exception as e:
            raise HTTPException(400, f"Excel read failed: {str(e)}")

    # ── 5. PLAIN TEXT / CSV ──────────────────────────────────────────────────
    elif ext in ['txt', 'csv', 'md', 'log']:
        try:
            return file_contents.decode('utf-8', errors='ignore')
        except Exception as e:
            raise HTTPException(400, f"Text read failed: {str(e)}")

    else:
        raise HTTPException(400, f"Unsupported file extension: .{ext}")

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
    AI Pipeline with Universal File Support
    Handles PDF, Images, Excel, Word, Text, CSV
    """
    
    if not file.filename:
        raise HTTPException(400, "No filename provided")
    
    logger.info(f"📄 Processing file: {file.filename}")
    
    try:
        contents = await file.read()
        logger.info(f"📦 File size: {len(contents)} bytes")
        
        # Universal Text Extraction
        raw_text = extract_text_from_file(contents, file.filename)
        
        logger.info(f"📝 Extracted {len(raw_text)} chars")
        logger.info(f"📝 Preview: {raw_text[:200]}")
        
        # Extract invoice data
        extracted_data = extractor.extract(raw_text)
        logger.info(f"💾 Extracted: {extracted_data}")
        
        if extracted_data.get('amount', 0) == 0:
            logger.warning("⚠️ Amount = 0 (unusual format)")
        
        from backend.app.services.erp_mock import erp_system
        
        # Extract Metadata for Forensics
        file_metadata = {}
        try:
            pdf_reader = PyPDF2.PdfReader(io.BytesIO(contents))
            file_metadata = {key.strip('/'): value for key, value in pdf_reader.metadata.items()} if pdf_reader.metadata else {}
        except:
            pass
            
        # Security & ERP pipeline
        fingerprint = security.fingerprint(
            vendor=extracted_data.get('vendor_name', ''),
            inv_id=extracted_data.get('invoice_number', ''),
            amount=extracted_data.get('amount', 0)
        )
        is_duplicate = security.check_duplicate(fingerprint)
        vendor_trust = security.verify_vendor(extracted_data.get('vendor_name', ''))
        
        # New Validations
        gst_validation = security.verify_gstin(extracted_data.get('gstin', ''))
        digital_forensics = security.analyze_digital_footprint(file_metadata)
        
        # Bank Verification (3-Way Match critical step)
        bank_validation = security.verify_bank_details(vendor_trust.get('data'), extracted_data)
        
        # ERP Validation
        erp_check = {"valid": False, "message": "No PO found"}
        if extracted_data.get('po_number'):
            erp_check = erp_system.check_po(extracted_data.get('po_number'))
        
        security_context = {
            "is_duplicate": is_duplicate,
            "vendor_status": vendor_trust.get('status'),
            "vendor_score": vendor_trust.get('score'),
            "fingerprint": fingerprint,
            "erp_validation": erp_check,
            "gst_validation": gst_validation,
            "digital_forensics": digital_forensics,
            "bank_validation": bank_validation
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

# --- VISION AI ENDPOINTS (Advanced Visual Control) ---

@router.post("/vision/analyze-frame")
async def analyze_frame(file: UploadFile = File(...)):
    """
    Real-Time Vision Analysis Endpoint.
    Accepts raw video frame -> Runs YOLOv8 -> Returns analysis + annotated image.
    """
    try:
        contents = await file.read()
        
        # Run Vision Agent
        analysis_data, annotated_image = vision_engine.detect_objects(contents)
        
        # Determine safety status (example: Person detected = Alert)
        is_safe = not analysis_data.get("safety_alert", False)
        
        return {
            "analysis": analysis_data,
            "annotated_frame_base64": base64.b64encode(annotated_image).decode('utf-8'),
            "system_status": "MONITORING" if is_safe else "ALERT",
            "threat_level": "LOW" if is_safe else "HIGH"
        }
        
    except Exception as e:
        logger.error(f"Vision Error: {e}")
        raise HTTPException(500, f"Vision AI Failed: {str(e)}")

