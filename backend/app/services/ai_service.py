import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.5-flash")

def get_resume_json(description: str):
    prompt = f"""
    Create a professional resume JSON based on: "{description}".
    Strict Schema:
    {{
        "name": "String", "email": "String", "phone": "String", "location": "String",
        "summary": "String",
        "skills": ["String"],
        "experience": [{{"title": "String", "company": "String", "dates": "String", "description": "String"}}],
        "education": [{{"degree": "String", "school": "String", "year": "String"}}]
    }}
    Return ONLY JSON.
    """
    try:
        response = model.generate_content(prompt)
        text = response.text.replace("```json", "").replace("```", "").strip()
        return json.loads(text)
    except Exception as e:
        print(f"AI Error: {e}")
        return None