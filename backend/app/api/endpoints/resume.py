from fastapi import APIRouter, UploadFile
from pydantic import BaseModel
from  backend.app.services.resume_generator import tailor_resume
import os
from fastapi.responses import FileResponse

router = APIRouter()

class TailorRequest(BaseModel):
    job_description: str

@router.post("/generate-resume")
async def generate_tailored_resume(request: TailorRequest):
    
    master_resume_path = "data/master_resume.json"
    output_path = "data/generated_resume.pdf"
    
    tailor_resume(master_resume_path, request.job_description, output_path)
    
    return {"status": "success", "download_url": "http://localhost:8000/download/generated_resume.pdf"}

@router.get("/download/{filename}")
async def download_file(filename: str):
    file_path = f"data/{filename}"
    
    # Check if file exists to prevent crashing
    if not os.path.exists(file_path):
        return {"error": "File not found. Did you generate it first?"}

    return FileResponse(
        path=file_path, 
        filename=filename, 
        media_type='application/pdf'
    )