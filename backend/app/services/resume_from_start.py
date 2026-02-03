import os
import json
import glob

from fastapi import FastAPI, HTTPException, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel

from jinja2 import Environment, FileSystemLoader
from weasyprint import HTML

import google.generativeai as genai
from dotenv import load_dotenv



load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.5-flash")



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



router = APIRouter(prefix="/resume", tags=["Resume"])



class ResumeRequest(BaseModel):
    template_name: str
    user_description: str


def get_ai_data(description: str):
    prompt = f"""
    Create a professional resume JSON based on this user description: "{description}".

    Strict Schema required:
    {{
        "name": "String",
        "email": "String",
        "phone": "String",
        "location": "String",
        "summary": "String",
        "skills": ["String"],
        "experience": [
            {{
                "title": "String",
                "company": "String",
                "dates": "String",
                "description": "String"
            }}
        ],
        "education": [
            {{
                "degree": "String",
                "school": "String",
                "year": "String"
            }}
        ]
    }}

    Return ONLY raw JSON. No markdown. No explanation.
    """

    try:
        response = model.generate_content(prompt)
        text = response.text.replace("```json", "").replace("```", "").strip()
        return json.loads(text)
    except Exception as e:
        print("Gemini Error:", e)
        return None



@router.get("/templates")
def get_templates():
    files = glob.glob("backend/app/templates/*.html")
    return [
        {
            "id": os.path.basename(f),
            "name": os.path.basename(f).replace(".html", "").title()
        }
        for f in files
    ]


@router.post("/generate-pdf")
def generate_pdf(request: ResumeRequest):
    data = get_ai_data(request.user_description)
    if not data:
        raise HTTPException(status_code=500, detail="AI generation failed")

    try:
        env = Environment(loader=FileSystemLoader("backend/app/templates"))
        template = env.get_template(request.template_name)
        rendered_html = template.render(data)

        pdf_bytes = HTML(string=rendered_html).write_pdf()
        return Response(content=pdf_bytes, media_type="application/pdf")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))




