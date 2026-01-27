from fastapi import APIRouter, UploadFile,File, Form
from pydantic import BaseModel
from  backend.app.services.resume_generator import tailor_resume
import os
from fastapi.responses import FileResponse
from backend.app.services.pdf_json import pdf_to_text
router = APIRouter()
import json
import shutil

import google.generativeai as genai

def resume_text_to_json(resume_text: str):
    prompt = f"""
You are a resume parser. 
Convert the following resume text into STRICT JSON.

Fields required:
personal_info
summary
education
experience
projects
technical_skills
achievements

Rules:
- Return ONLY valid JSON.
- If a field is missing, use an empty list or empty string.
- Do NOT add explanations.

Resume Text:
{resume_text}
"""

    response = model.generate_content(prompt)
    
    # Gemini returns JSON string because we set response_mime_type
    return json.loads(response.text)


class TailorRequest(BaseModel):
    job_description: str

api_key = os.getenv("GEMINI_API_KEY") 
if not api_key:
    # Fallback for testing (REMOVE before sharing)
    api_key = "AIzaSyCaYlNtnX706ua-ASEGuK2d9_P6qQoq0Zg"

genai.configure(api_key=api_key)


model = genai.GenerativeModel(
    model_name="gemini-2.5-flash", 
    generation_config={
        "temperature": 0.4, 
        "response_mime_type": "application/json"
    }
)
@router.post("/generate-resume")
async def generate_tailored_resume(
    job_description: str = Form(...),
    resume_pdf: UploadFile = File(...)
):

    upload_path = "data/uploaded_resume.pdf"
    with open(upload_path, "wb") as buffer:
        shutil.copyfileobj(resume_pdf.file, buffer)
    resume_text = pdf_to_text(upload_path)
    resume_json = resume_text_to_json(resume_text)

    with open("data/master_resume.json", "w") as f:
        json.dump(resume_json, f, indent=4)

    
    master_resume_path = "data/master_resume.json"
    output_path = "data/generated_resume.pdf"

   
    tailor_resume(master_resume_path, job_description, output_path)

    return {
        "status": "success",
        "download_url": "http://localhost:8000/download/generated_resume.pdf"
    }

@router.get("/download/{filename}")
async def download_file(filename: str):
    file_path = f"data/{filename}"
    

    if not os.path.exists(file_path):
        return {"error": "File not found. Did you generate it first?"}

    return FileResponse(
        path=file_path, 
        filename=filename, 
        media_type='application/pdf'
    )