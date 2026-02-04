from fastapi import APIRouter, UploadFile,File, Form, HTTPException
from pydantic import BaseModel
from  backend.app.services.resume_generator import tailor_resume
import os
from fastapi.responses import FileResponse
from backend.app.services.pdf_json import pdf_to_text
import glob
from fastapi import APIRouter, Body
from fastapi.responses import HTMLResponse
from jinja2 import Template
import os

import json
import shutil
from jinja2 import Template 
from backend.schemas.schemas import ResumeRequest
from backend.app.services.ai_service import get_resume_json
from backend.app.services.pdf_service import create_pdf_bytes
router = APIRouter()

from fastapi import Response
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
    
    return json.loads(response.text)


class TailorRequest(BaseModel):
    job_description: str

api_key = os.getenv("GEMINI_API_KEY") 
if not api_key:
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



@router.get("/templates")
def list_templates():
    files = glob.glob("backend/app/templates/*.html")
    return [{"id": os.path.basename(f), "name": os.path.basename(f).replace(".html", "").title()} for f in files]

@router.post("/generate")
def generate_resume(request: ResumeRequest):
    print("Generating resume with template:", request.template_name)
    data = get_resume_json(request.user_description)
    
    if not data:
        raise HTTPException(status_code=500, detail="AI generation failed")
    
    try:
        pdf_bytes = create_pdf_bytes(request.template_name, data)
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=resume.pdf"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from fastapi.responses import FileResponse, HTMLResponse
import os



@router.get("/templates/{template_name}/preview", response_class=HTMLResponse)
def preview_template(template_name: str):
    template_path = os.path.join("backend/app/templates", template_name)

    if not os.path.exists(template_path):
        return HTMLResponse(content=f"<h1>Template not found at: {template_path}</h1>", status_code=404)

    dummy_data = {
        "name": "Alex Morgan",
        "email": "alex.morgan@example.com",
        "phone": "+1 (555) 123-4567",
        "linkedin": "linkedin.com/in/alexmorgan",
        "github": "github.com/alexmorgan",
        "city": "San Francisco, CA",
        "job_title": "Senior Software Engineer",
        "summary": "Passionate software engineer with 5+ years of experience in building scalable web applications. Proficient in Python, JavaScript, and cloud architecture.",
        
        "skills": ["Python", "FastAPI", "React", "AWS", "Docker", "Machine Learning", "PostgreSQL"],
        
        "experience": [
            {
                "company": "Tech Solutions Inc.",
                "role": "Senior Developer",
                "date": "2021 - Present",
                "description": "Led a team of 5 engineers to rebuild the core payment infrastructure. Improved system latency by 40%."
            },
            {
                "company": "WebCorp Startups",
                "role": "Junior Developer",
                "date": "2018 - 2021",
                "description": "Developed RESTful APIs and frontend components using React. Collaborated with UX designers to improve accessibility."
            }
        ],
        
        "education": [
            {
                "school": "University of Technology",
                "degree": "B.S. Computer Science",
                "date": "2014 - 2018",
                "grade": "3.8 GPA"
            }
        ],
        
        "projects": [
            {
                "name": "AI Resume Builder",
                "description": "An automated tool to tailor resumes based on job descriptions using LLMs."
            }
        ]
    }

    try:
        with open(template_path, "r", encoding="utf-8") as f:
            html_content = f.read()
        
        template = Template(html_content)
        rendered_html = template.render(**dummy_data)
        
        return HTMLResponse(content=rendered_html)
        
    except Exception as e:
        return HTMLResponse(content=f"<h1>Error rendering template: {str(e)}</h1>", status_code=500)


@router.post("/render-preview", response_class=HTMLResponse)
def render_preview(
    template_name: str = Body(...), 
    resume_data: dict = Body(...)
):
    try:
        template_dir = os.path.abspath("templates") 
        template_path = os.path.join(template_dir, template_name)

        if not os.path.exists(template_path):
            return HTMLResponse(content="<h1>Template not found</h1>", status_code=404)

        with open(template_path, "r", encoding="utf-8") as f:
            html_template = f.read()

        jinja_template = Template(html_template)
        rendered_html = jinja_template.render(**resume_data)

        return HTMLResponse(content=rendered_html)

    except Exception as e:
        return HTMLResponse(content=f"Error: {str(e)}", status_code=500)


@router.get("/templates")
def list_templates():
    template_dir = os.path.abspath("templates")
    if not os.path.exists(template_dir): return []
    files = [f for f in os.listdir(template_dir) if f.endswith(".html")]
    return [{"id": f, "name": f.replace(".html", "").title()} for f in files]

@router.get("/templates/{template_name}/raw", response_class=HTMLResponse)
def get_raw_template(template_name: str):
    path = os.path.join("backend/app/templates", template_name)
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f: return f.read()
    return "Not Found"

from pydantic import BaseModel
from pathlib import Path
from fastapi.responses import HTMLResponse
from jinja2 import Template

class PreviewRequest(BaseModel):
    template_name: str
    resume_data: dict

@router.post("/templates/render-preview", response_class=HTMLResponse)
def render_preview(payload: PreviewRequest):

    templates_dir = Path("backend/app/templates")
    file_path = templates_dir / payload.template_name

    if not file_path.exists():
        return HTMLResponse("<h1>Template not found</h1>", status_code=404)

    html = file_path.read_text(encoding="utf-8")
    return HTMLResponse(Template(html).render(**payload.resume_data))




api_key = os.getenv("GEMINI_API_KEY") or "AIzaSy..." 

genai.configure(api_key=api_key)

model = genai.GenerativeModel(
    model_name="gemini-2.5-flash", 
    generation_config={
        "temperature": 0.4, 
        "response_mime_type": "application/json"
    }
)

class EditResumeRequest(BaseModel):
    current_data: dict
    user_input: str

class PreviewRequest(BaseModel):
    template_name: str
    resume_data: dict

def pdf_to_text(path): return "Extracted text placeholder"
def tailor_resume(path, desc, out): pass 

@router.post("/ai/edit-resume")
async def ai_edit_resume(payload: EditResumeRequest):
    prompt = f"""
    You are a professional Resume Editor.
    
    Current Data JSON: {json.dumps(payload.current_data)}
    User Command: "{payload.user_input}"
    
    INSTRUCTIONS:
    1. Update the JSON strictly based on the User Command.

    2. The JSON schema must strictly follow these keys:
       - name, email, phone, linkedin (Strings)
       - summary (String)
       - skills (Array of Strings)
       - experience (Array of Objects: {{role, company, date, description}})
       - projects (Array of Objects: {{name, technologies, description}})
       - education (Array of Objects: {{school, degree, date}})
       - achievements (Array of Strings)
       -ask questions everytime and shoul in ur response
    
    3. If the user says "Add project X", add a new object to the 'projects' array.
    4. Return ONLY the valid JSON data. No markdown, no explanations.
    5. the most important point is to ask questions in every reponse.
    """
    
    try:
        response = model.generate_content(prompt)
        return json.loads(response.text)
    except Exception as e:
        print(f"AI Error: {e}")
        raise HTTPException(status_code=500, detail="AI processing failed")

@router.get("/templates")
def list_templates():
    template_dir = Path("app/templates")
    if not template_dir.exists():
        return []
    
    files = [f.name for f in template_dir.glob("*.html")]
    return [{"id": f, "name": f.replace(".html", "").title()} for f in files]

@router.get("/templates/{template_name}/raw", response_class=HTMLResponse)
def get_raw_template(template_name: str):
    path = Path(f"app/templates/{template_name}")
    if path.exists():
        return path.read_text(encoding="utf-8")
    return "<h1>Template Not Found</h1>"

@router.post("/templates/render-preview", response_class=HTMLResponse)
def render_preview(payload: PreviewRequest):
    path = Path(f"app/templates/{payload.template_name}")
    if not path.exists():
        return HTMLResponse("<h1>Template not found</h1>", status_code=404)
        
    try:
        html_content = path.read_text(encoding="utf-8")
        rendered = Template(html_content).render(**payload.resume_data)
        return HTMLResponse(rendered)
    except Exception as e:
        return HTMLResponse(f"Render Error: {e}", status_code=500)

@router.post("/generate-resume")
async def generate_tailored_resume(
    job_description: str = Form(...),
    resume_pdf: UploadFile = File(...)
):
    os.makedirs("data", exist_ok=True)
    upload_path = "data/uploaded_resume.pdf"
    
    with open(upload_path, "wb") as buffer:
        shutil.copyfileobj(resume_pdf.file, buffer)
        
    resume_text = pdf_to_text(upload_path)
    
    json_prompt = f"Convert this resume text to strict JSON schema: {resume_text}"
    ai_res = model.generate_content(json_prompt)
    resume_json = json.loads(ai_res.text)
    
    with open("data/master_resume.json", "w") as f:
        json.dump(resume_json, f)
        
    return {"status": "success", "data": resume_json}

from fastapi.responses import Response
from weasyprint import HTML
import io

@router.post("/download-pdf")
def download_pdf(payload: PreviewRequest):
    template_path = Path(f"backend/app/templates/{payload.template_name}")
    
    if not template_path.exists():
        template_path = Path(f"templates/{payload.template_name}")
    
    if not template_path.exists():
        raise HTTPException(status_code=404, detail="Template not found")

    try:
        html_content = template_path.read_text(encoding="utf-8")
        rendered_html = Template(html_content).render(**payload.resume_data)

        pdf_bytes = HTML(string=rendered_html).write_pdf()

        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=resume_{payload.resume_data.get('name', 'user')}.pdf"
            }
        )
    except Exception as e:
        print(f"PDF Gen Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
