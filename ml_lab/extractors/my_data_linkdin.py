import json
from playwright.sync_api import sync_playwright

COOKIE_FILE = "cookies.json" 

def scrape_my_profile(url: str, output_path: str):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)  # Browser open (headless=False for debug)
        context = browser.new_context()

        # Cookies load kar liya taaki login maintain rahe
        try:
            with open(COOKIE_FILE, "r") as f:
                context.add_cookies(json.load(f))
        except:
            print("Cookies missing. Run login script first.")
            return None

        page = context.new_page()

        # Step 1: Feed open karo taaki login session confirm ho
        page.goto("https://www.linkedin.com/feed/")
        page.wait_for_load_state("domcontentloaded")

  
        if "login" in page.url:
            print("❌ Cookies expired or invalid. Re-run login script.")
            return None

        # Step 2: Target profile page open karo
        page.goto(url)
        page.wait_for_load_state("domcontentloaded")

       
        page.wait_for_selector("h1", timeout=10000)

        # Lazy loaded sections ke liye scroll karo
        page.mouse.wheel(0, 2000)
        page.wait_for_timeout(2000)


        try:
            name = page.locator("h1").first.inner_text()
        except:
            name = ""


        try:
            about = page.locator("#about").locator("xpath=..").inner_text()
        except:
            about = ""


        try:
            experience = page.locator("#experience").locator("xpath=..").inner_text()
        except:
            experience = ""

  
        data = {
            "name": name.strip(),
            "about_raw": about.strip(),
            "experience_raw": experience.strip()
        }

        # JSON me save 
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4)

        browser.close()
        return data


if __name__ == "__main__":
    data = scrape_my_profile("https://www.linkedin.com/in/vedeeka-parab-7a5174270/")
    print(json.dumps(data, indent=2))  
