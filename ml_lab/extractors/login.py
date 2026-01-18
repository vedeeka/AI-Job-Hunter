from playwright.sync_api import sync_playwright
import json

COOKIE_FILE = "cookies.json"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)
    context = browser.new_context()
    page = context.new_page()
    
    page.goto("https://www.linkedin.com/login")
    print("➡️ Log in manually in the browser...")
    
    page.wait_for_url("https://www.linkedin.com/feed/", timeout=120000)
    
    cookies = context.cookies()
    with open(COOKIE_FILE, "w") as f:
        json.dump(cookies, f)
    
    print("✅ Cookies saved to cookies.json")
    browser.close()
