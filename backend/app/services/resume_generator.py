import json
import os
from jinja2 import Environment, FileSystemLoader
from weasyprint import HTML
import google.generativeai as genai

# SECURE YOUR KEY: Use environment variables instead of hardcoding
# Run this in your terminal before running the script: export GEMINI_API_KEY="your_new_key_here"
api_key = os.getenv("AIzaSyAt90h4UkN7tuj95HGeFOjaNdS3eRb5nk4") 

genai.configure(api_key="AIzaSyAt90h4UkN7tuj95HGeFOjaNdS3eRb5nk4")

# CORRECTED MODEL NAME
model = genai.GenerativeModel(
    model_name="gemini-2.5-flash",  # Changed from 'gemini-1.5-flash-latest'
    generation_config={
        "temperature": 0.2,
        "response_mime_type": "application/json"
    }
)

def tailor_resume(master_json_path, job_description_text, output_pdf_path):
    with open(master_json_path, 'r') as f:
        resume_data = json.load(f)

    print("🤖 AI is rewriting your resume...")

    prompt = f"""
    You are an expert Resume Writer. 
    Here is my resume JSON: {json.dumps(resume_data)}
    
    Here is the Job Description:
    "{job_description_text}"
    
    Task 1: Rewrite the "summary" to include keywords from the Job Description. Keep it under 50 words.
    Task 2: Select the top 5 skills from my resume that match this job.
    
    Return ONLY valid JSON:
    {{
        "new_summary": "...",
        "highlighted_skills": ["Skill1", "Skill2"]
    }}
    """

    response = model.generate_content(prompt)
    
    # Clean up potential markdown formatting in response
    raw_text = response.text.strip()
    if raw_text.startswith("```"):
        # Remove ```json and ``` lines
        lines = raw_text.splitlines()
        if lines[0].startswith("```"):
            lines = lines[1:]
        if lines[-1].startswith("```"):
            lines = lines[:-1]
        raw_text = "\n".join(lines)

    ai_response = json.loads(raw_text)

    resume_data['skills'] = ai_response['highlighted_skills']
    generated_summary = ai_response['new_summary']

    # Ensure the templates directory exists
    env = Environment(loader=FileSystemLoader('backend/app/templates/'))
    template = env.get_template('resume_template.html')

    html_content = template.render(
        resume=resume_data,
        generated_summary=generated_summary
    )

    print("📄 Generating PDF...")
    HTML(string=html_content).write_pdf(output_pdf_path)
    print(f"✅ Tailored Resume saved to: {output_pdf_path}")

    return output_pdf_path