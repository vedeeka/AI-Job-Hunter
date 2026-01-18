import json
from playwright.sync_api import sync_playwright

COOKIE_FILE = "cookies.json"

def scrape_my_profile(profile_url):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        context = browser.new_context()

        # Load cookies
        try:
            with open(COOKIE_FILE, "r") as f:
                context.add_cookies(json.load(f))
        except:
            print("❌ Cookies missing. Run login script first.")
            return None

        page = context.new_page()

        # Step 1: Open feed to confirm login session
        page.goto("https://www.linkedin.com/feed/")
        page.wait_for_load_state("domcontentloaded")

        # If redirected to login, cookies are invalid
        if "login" in page.url:
            print("❌ Cookies expired or invalid. Re-run login script.")
            return None

        # Step 2: Go to target profile
        page.goto(profile_url)
        page.wait_for_load_state("domcontentloaded")

        # Wait until profile name appears
        page.wait_for_selector("h1", timeout=10000)

        # Scroll to trigger lazy loading
        page.mouse.wheel(0, 2000)
        page.wait_for_timeout(2000)

        # Extract Name
        try:
            name = page.locator("h1").first.inner_text()
        except:
            name = ""

        # Extract About Section
        # About text
        try:
            about = page.locator("#about").locator("xpath=..").inner_text()
        except:
            about = ""

        # Experience list
        try:
            experience = page.locator("#experience").locator("xpath=..").inner_text()
        except:
            experience = ""


        data = {
            "name": name.strip(),
            "about_raw": about.strip(),
            "experience_raw": experience.strip()
        }

        with open("profile_data.json", "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4)

        browser.close()
        return data


if __name__ == "__main__":
    data = scrape_my_profile("https://www.linkedin.com/in/vedeeka-parab-7a5174270/")
    print(json.dumps(data, indent=2))
