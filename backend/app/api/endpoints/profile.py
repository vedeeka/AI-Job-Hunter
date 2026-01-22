from fastapi import APIRouter, Query
import json, os
from pathlib import Path
from ml_lab.extractors.linkedin_jobs_scraper import scrape_jobs_guest
from ml_lab.extractors.my_data_linkdin import scrape_my_profile
from ml_lab.pipelines.profile_ner_pipeline import run_profile_ner
from ml_lab.pipelines.jobs_ner_pipeline import run_jobs_ner
from playwright.sync_api import sync_playwright

router = APIRouter()

DATA_DIR = Path("data")
DATA_DIR.mkdir(exist_ok=True)
COOKIE_FILE = "cookies.json"

def ensure_linkedin_cookies():
    if os.path.exists(COOKIE_FILE):
        return
    with sync_playwright() as p:

        browser = p.chromium.launch(headless=False)
        context = browser.new_context()
        page = context.new_page()

        page.goto("https://www.linkedin.com/login")

        print("👉 Please login manually within 2 minutes...")

        # Wait for ANY successful login indicator
        page.wait_for_function(
            "() => window.location.href.includes('linkedin.com') && "
            "!window.location.href.includes('login')",
            timeout=120000
        )

        cookies = context.cookies()

        with open(COOKIE_FILE, "w") as f:
            json.dump(cookies, f)

        browser.close()
        print("✅ Cookies saved")


@router.get("/profile")
def get_profile(linkedin_url: str = Query(...)):
    ensure_linkedin_cookies()
    username = linkedin_url.rstrip("/").split("/")[-1]
    file_path = DATA_DIR / f"{username}_profile.json"

    if not file_path.exists():
        scrape_my_profile(linkedin_url, str(file_path))

    run_profile_ner(str(file_path))

    with open(file_path, "r") as f:
        return json.load(f)



DATA_DIR = "data"  # Path to your data folder

@router.get("/profile/skills")
def get_profile_skills(linkedin_url: str = Query(...)):
    # Extract username from LinkedIn URL
    username = linkedin_url.rstrip("/").split("/")[-1]
    file_path = os.path.join(DATA_DIR, f"{username}_profile.json")
    print(file_path)

    if not os.path.exists(file_path):
        print("No skills data found.")
        return {"skills": []}

    skills = []
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)
        # If JSON directly contains fields like "name", "about_raw", "experience_raw"
        skills.append({
            "name": data.get("name", ""),
            "about_raw": data.get("about_raw", ""),
            "experience_raw": data.get("experience_raw", "")
        })

    print(f"Extracted {len(skills)} skill entries.")
    return {"skills": skills}
