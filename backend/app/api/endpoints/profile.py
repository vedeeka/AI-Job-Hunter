from fastapi import APIRouter, Query
import json, os, re
from pathlib import Path
from ml_lab.extractors.my_data_linkdin import scrape_my_profile
from ml_lab.pipelines.profile_ner_pipeline import run_profile_ner
from playwright.sync_api import sync_playwright
import google.generativeai as genai

# --- Gemini setup ---
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.5-flash")

# --- Router & Paths ---
router = APIRouter()
DATA_DIR = Path("data")
DATA_DIR.mkdir(exist_ok=True)
COOKIE_FILE = "cookies.json"


# --- Utility: Ensure LinkedIn cookies exist ---
def ensure_linkedin_cookies():
    if os.path.exists(COOKIE_FILE):
        return
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        context = browser.new_context()
        page = context.new_page()
        page.goto("https://www.linkedin.com/login")
        print("👉 Please login manually within 2 minutes...")
        page.wait_for_function(
            "() => window.location.href.includes('linkedin.com') && !window.location.href.includes('login')",
            timeout=120000
        )
        cookies = context.cookies()
        with open(COOKIE_FILE, "w") as f:
            json.dump(cookies, f)
        browser.close()
        print("✅ Cookies saved")


# --- Utility: Extract skills via Gemini ---
def extract_skills_with_gemini(about, experience):
    prompt = f"""
Extract professional skills from the text.
Return ONLY raw JSON in this format:

{{ "skills": [{{"name":"","category":"","proficiency":""}}] }}

TEXT:
{about}
{experience}
"""
    response = model.generate_content(prompt)
    text = response.text.strip()
    text = re.sub(r"```json|```", "", text).strip()
    try:
        return json.loads(text)
    except Exception as e:
        print("⚠️ Gemini JSON parsing failed:", e)
        return {"skills": []}


# --- Main endpoint: Full profile ---
@router.get("/profile/full")
def get_full_profile(linkedin_url: str = Query(...)):
    ensure_linkedin_cookies()
    username = linkedin_url.rstrip("/").split("/")[-1]
    file_path = DATA_DIR / f"{username}_profile.json"

    # --- Scrape profile if missing ---
    if not file_path.exists():
        scrape_my_profile(linkedin_url, str(file_path))

    # --- Run NER pipeline ---
    run_profile_ner(str(file_path))

    # --- Load profile data ---
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    about_raw = data.get("about_raw", "")
    experience_raw = data.get("experience_raw", "")

    # --- Extract skills via Gemini (cache if missing) ---
    if "skills" not in data or not data["skills"]:
        structured = extract_skills_with_gemini(about_raw, experience_raw)
        data["skills"] = structured["skills"]
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

    # --- Optional analysis placeholder ---
    analysis = data.get("analysis", {"match_score": 0, "missing_skills": []})

    # --- Return full structured profile ---
    return {
        "name": data.get("name", ""),
        "linkedin": linkedin_url,
        "about_raw": about_raw,
        "experience_raw": experience_raw,
        "skills": data.get("skills", []),
        "analysis": analysis
    }
