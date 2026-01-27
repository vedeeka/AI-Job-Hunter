import google.generativeai as genai
import json
import os
import smtplib
from dotenv import load_dotenv
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders

# Load .env
load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.5-flash")

# 1. Generate Email using Gemini
def generate_cold_email(job_desc, company_name):
    prompt = f"""
Write a cold email to a recruiter at {company_name}.

Job description:
{job_desc}

Rules:
- Keep under 100 words
- Professional and enthusiastic
- Mention one specific skill from job description
- Return ONLY valid JSON:
{{"subject":"...","body":"..."}}
"""
    response = model.generate_content(prompt)

    text = response.text.strip()
    text = text.replace("```json","").replace("```","").strip()

    return json.loads(text)

# 2. SMTP Email Sender
def send_email_with_attachment(from_email,to_email, subject, body, pdf_path):
   
    password = "ubfy bequ drds nsfd" 

    msg = MIMEMultipart()
    msg["From"] = from_email
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))

    # Attach Resume
    with open(pdf_path, "rb") as attachment:
        part = MIMEBase("application", "octet-stream")
        part.set_payload(attachment.read())
        encoders.encode_base64(part)
        part.add_header(
            "Content-Disposition",
            f"attachment; filename={os.path.basename(pdf_path)}"
        )
        msg.attach(part)

    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(from_email, password)
        server.send_message(msg)
        server.quit()
        print("✅ Email sent successfully")
    except Exception as e:
        print("❌ Email failed:", e)

# 3. Run
if __name__ == "__main__":
    job_desc = "Looking for a Computer Vision engineer with experience in OpenCV and MediaPipe."
    company = "VisionTech"

    email_data = generate_cold_email(job_desc, company)

    
    

    BASE_DIR = os.path.dirname(os.path.abspath(__file__))

    pdf_path = os.path.join(BASE_DIR, "test.pdf")

    send_email_with_attachment(
        from_email="vedeekaparab9999@gmail.com",
        to_email="vedeekaparab9999@gmail.com",
        subject=email_data["subject"],
        body=email_data["body"],
        pdf_path=pdf_path
    )
