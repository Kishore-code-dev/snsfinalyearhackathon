# XYLO AI Invoice Backend - Tesseract OCR Setup

## Quick Install (Windows)

### Option 1: Chocolatey (Recommended)
```powershell
choco install tesseract
```

### Option 2: Manual Download
1. Download: https://github.com/UB-Mannheim/tesseract/wiki
2. Run installer (tesseract-ocr-w64-setup-5.x.x.exe)
3. Install to: `C:\Program Files\Tesseract-OCR`
4. **IMPORTANT**: Check "Add to PATH" during installation

### Option 3: Scoop
```powershell
scoop install tesseract
```

---

## Verify Installation

```powershell
tesseract --version
```

Should output: `tesseract 5.x.x`

---

## If Tesseract is NOT in PATH

Add this line to your `.env` file or set manually:

```python
# In backend/app/core/config.py
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
```

---

## Test OCR

After installing, restart the backend:

```bash
c:\Users\kisho\sly\.venv\Scripts\python.exe -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

Upload a scanned PDF → should now work!

---

## What We Have Now

✅ **Text-based PDFs**: Extracted via PyPDF2  
✅ **Scanned PDFs**: Extracted via Tesseract OCR (after you install it)  
✅ **Automatic fallback**: Tries PyPDF2 first, then OCR if needed  
✅ **Detailed logging**: See exactly what's happening in PowerShell  

---

**Install Tesseract now and your scanned invoices will work!**
