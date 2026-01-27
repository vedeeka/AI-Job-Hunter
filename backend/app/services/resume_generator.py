import json
import os
from jinja2 import Environment, FileSystemLoader
from weasyprint import HTML
import google.generativeai as genai


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

def tailor_resume(master_json_path, job_description_text, output_pdf_path):
    # 1. Load Master Data
    with open(master_json_path, 'r') as f:
        master_data = json.load(f)

    print("🤖 AI is reading your resume and the Job Description...")
    print("🔄 Rewriting ALL bullet points and summaries...")

    # 2. THE PROMPT (The most important part)
    prompt = f"""
    You are an expert ATS Resume Writer and Career Coach.
    
    INPUT DATA:
    1. My Master Resume JSON: {json.dumps(master_data)}
    2. Target Job Description: "{job_description_text}"

    YOUR TASK:
    Rewrite the ENTRIE resume content to target this specific job. 
    
    GUIDELINES:
    1. **Personal Info & Education:** Keep exactly as is. Do not change dates or degrees.
    2. **Summary:** Write a powerful, keyword-rich professional summary (max 4 lines) tailored to the JD.
    3. **Experience:** REWRITE the bullet points ('responsibilities'). 
       - Use keywords from the Job Description.
       - Use strong action verbs (Architected, Engineered, Optimized).
       - Focus on achievements relevant to the JD.
    4. **Projects:** REWRITE the 'description' bullet points to highlight the specific tech stack requested in the JD.
    5. **Skills:** Reorder the 'technical_skills' so the most relevant matching skills appear first.
    
    OUTPUT FORMAT:
    Return a SINGLE valid JSON object with the exact same structure as the input (personal_info, summary, education, experience, projects, technical_skills, achievements).
    """

    # 3. Generate Content
    try:
        response = model.generate_content(prompt)
        
        # Clean response string
        raw_text = response.text.strip()
        if raw_text.startswith("```json"):
            raw_text = raw_text[7:-3] # Remove markdown code blocks
        elif raw_text.startswith("```"):
            raw_text = raw_text[3:-3]

        # Parse the NEW fully tailored resume
        tailored_data = json.loads(raw_text)
        
        print("✅ AI has successfully rewritten the resume.")

        # 4. Render HTML
        # Point this to where your template file is located
        env = Environment(loader=FileSystemLoader('.')) 
        template = env.get_template('backend/app/templates/resume_template.html')

        # Pass the WHOLE tailored_data object as 'resume'
        html_content = template.render(resume=tailored_data)

        # 5. Generate PDF
        print("📄 Generating PDF...")
        HTML(string=html_content).write_pdf(output_pdf_path)
        print(f"🎉 Tailored Resume saved to: {output_pdf_path}")
        return output_pdf_path

    except Exception as e:
        print(f"❌ Error occurred: {e}")
        return None

# --- EXECUTION ---
if __name__ == "__main__":
    
    # Define paths
    json_file = "resume_data.json"
    
    # Paste the Job Description here
    target_job_description = """
    We are looking for a Python Backend Developer. 
    Must have experience with AI integration, Flask/Django, and PostgreSQL.
    Experience with Computer Vision (OpenCV) is a huge plus.
    """

    tailor_resume(json_file, target_job_description, "Vedeeka_Tailored_Resume.pdf")