import os
import shutil
from fastapi import APIRouter, UploadFile, File
from app.utils.pdf_parser import extract_text_from_pdf, extract_topics_from_text

router = APIRouter()

@router.post("/upload-syllabus")
async def analyze_input(file: UploadFile = File(...)):
    """
    Endpoint to upload a PDF (syllabus/notes) and extract text.
    """
    temp_file_path = f"temp_{file.filename}"
    
    with open(temp_file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    extracted_text = extract_text_from_pdf(temp_file_path)
    detected_topics = extract_topics_from_text(extracted_text)
    
    # Clean up temp file
    if os.path.exists(temp_file_path):
        os.remove(temp_file_path)
        
    return {
        "filename": file.filename,
        "extracted_text_preview": extracted_text[:200] + "..." if len(extracted_text) > 200 else extracted_text,
        "detectedTopics": detected_topics
    }
