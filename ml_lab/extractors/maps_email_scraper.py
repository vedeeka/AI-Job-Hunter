import re
import time
import random
import pandas as pd
import os
from playwright.sync_api import sync_playwright


OUTPUT_FILE = "data/final_leads_detailed.csv"
TEMP_FILE = "temp_maps_data.csv"

EMAIL_REGEX = re.compile(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+")
IGNORE_EXTENSIONS = ('.png', '.jpg', '.jpeg', '.gif', '.svg', '.css', '.js', '.woff', '.mp4', '.webp')

class RobustScraper:
    def __init__(self, search_query: str):
        self.search_query = search_query
        self.user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"

    def clean_email(self, email):
        email = email.lower()
        if email.endswith(IGNORE_EXTENSIONS): return False
        if len(email) < 5 or len(email) > 50: return False
        return True

    def extract_page_details(self, page):
        details = {
            "Title": "",
            "Description": "",
            "LinkedIn": "",
            "Facebook": "",
            "Twitter": "",
            "Instagram": ""
        }
        
        try:
            details["Title"] = page.title()
            meta_desc = page.locator('meta[name="description"]').first
            if meta_desc.count() > 0:
                details["Description"] = meta_desc.get_attribute("content")

            links = page.evaluate("""() => {
                return Array.from(document.querySelectorAll('a')).map(a => a.href);
            }""")
            
            for link in links:
                l_lower = link.lower()
                if "linkedin.com/company" in l_lower or "linkedin.com/in" in l_lower:
                    details["LinkedIn"] = link
                elif "facebook.com" in l_lower and "sharer" not in l_lower:
                    details["Facebook"] = link
                elif "twitter.com" in l_lower or "x.com" in l_lower:
                    details["Twitter"] = link
                elif "instagram.com" in l_lower:
                    details["Instagram"] = link
                    
        except Exception:
            pass
        
        return details

    def scan_website_enriched(self, url):
        result = {
            "Emails": "",
            "Site_Title": "",
            "Site_Description": "",
            "LinkedIn": "",
            "Facebook": "",
            "Twitter": "",
            "Instagram": ""
        }
        
        if not url or not isinstance(url, str): 
            return result
        
        if "google.com" in url:
            return result
        
        print(f"   --> Scanning Website: {url}")
        emails = set()
        
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(user_agent=self.user_agent)
            page = context.new_page()
            
            page.route("**/*", lambda route: route.abort() 
                       if route.request.resource_type in ["image", "media", "font", "stylesheet"] 
                       else route.continue_())

            try:
                page.goto(url, timeout=15000, wait_until="domcontentloaded")
                content = page.content()
                for e in EMAIL_REGEX.findall(content):
                    if self.clean_email(e): emails.add(e)
                
                home_details = self.extract_page_details(page)
                result["Site_Title"] = home_details["Title"]
                result["Site_Description"] = home_details["Description"]
                result["LinkedIn"] = home_details["LinkedIn"]
                result["Facebook"] = home_details["Facebook"]
                result["Twitter"] = home_details["Twitter"]
                result["Instagram"] = home_details["Instagram"]

                if not emails or not result["LinkedIn"]:
                    for path in ["/contact", "/contact-us", "/about", "/about-us"]:
                        try:
                            target = url.rstrip('/') + path
                            page.goto(target, timeout=10000, wait_until="domcontentloaded")
                            content = page.content()
                            for e in EMAIL_REGEX.findall(content):
                                if self.clean_email(e): emails.add(e)
                            
                            inner_details = self.extract_page_details(page)
                            if not result["LinkedIn"] and inner_details["LinkedIn"]:
                                result["LinkedIn"] = inner_details["LinkedIn"]
                                
                            if emails and result["LinkedIn"]: break
                        except: continue

            except Exception:
                pass
            finally:
                browser.close()

        result["Emails"] = ", ".join(list(emails))
        return result

    def scrape_google_maps(self):
        print(f"🚀 Starting Google Maps Scraping for: {self.search_query}")
        
        collected_data = []
        if os.path.exists(TEMP_FILE):
            print("   -> Loading existing temp data...")
            collected_data = pd.read_csv(TEMP_FILE).to_dict('records')
        
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=False, args=["--start-maximized"])
            context = browser.new_context(viewport={"width": 1920, "height": 1080}, user_agent=self.user_agent)
            page = context.new_page()

            page.goto(f"https://www.google.com/maps/search/{self.search_query.replace(' ', '+')}", timeout=60000)
            try: page.locator("text=Accept all").click(timeout=3000)
            except: pass

            try:
                page.wait_for_selector('div[role="feed"]', timeout=15000)
            except:
                print("❌ Could not find results feed.")
                return collected_data

            feed = page.locator('div[role="feed"]')
            no_change_count = 0
            prev_count = 0
            
            while True:
                feed.evaluate("node => node.scrollTo(0, node.scrollHeight)")
                page.wait_for_timeout(2000)
                listings = page.locator('a[href^="https://www.google.com/maps/place/"]').all()
                count = len(listings)
                print(f"   Loaded {count} items...")
                
                if page.locator("text=You've reached the end of the list").is_visible(): break
                if count == prev_count:
                    no_change_count += 1
                    if no_change_count > 3: break
                else: no_change_count = 0
                prev_count = count

            final_listings = page.locator('a[href^="https://www.google.com/maps/place/"]').all()
            print(f"🎉 Processing {len(final_listings)} businesses...")

            for i, listing_element in enumerate(final_listings):
                if i < len(collected_data): continue
                try:
                    listing_element.click()
                    page.wait_for_selector('div[role="main"]', timeout=5000)
                    time.sleep(1) 

                    name = "Unknown"
                    if page.locator("h1.DUwDvf").count() > 0:
                        name = page.locator("h1.DUwDvf").first.inner_text()
                    else:
                        h1s = page.locator('div[role="main"] h1')
                        if h1s.count() > 0: name = h1s.last.inner_text()
                    
                    website = ""
                    website_btn = page.locator('a[data-item-id="authority"]')
                    if website_btn.count() > 0:
                        website = website_btn.first.get_attribute("href")

                    print(f"[{i+1}] {name} | {website}")
                    collected_data.append({"Name": name, "Website": website, "MapsURL": page.url})

                    if i % 5 == 0: pd.DataFrame(collected_data).to_csv(TEMP_FILE, index=False)
                except Exception: continue
            
            browser.close()
        pd.DataFrame(collected_data).to_csv(TEMP_FILE, index=False)
        return collected_data

    def run_stage_2_enrichment(self, data):
        print("\n" + "="*50)
        print("📨 STAGE 2: WEBSITE SCANNING & ENRICHMENT")
        print("="*50)
        
        enriched_data = []
        processed_urls = set()

        if os.path.exists(OUTPUT_FILE):
            print(f"   -> Resuming from {OUTPUT_FILE}...")
            existing_df = pd.read_csv(OUTPUT_FILE)
            enriched_data = existing_df.to_dict('records')
            processed_urls = set(existing_df['MapsURL'].astype(str).tolist())
        
        for i, row in enumerate(data):
            if str(row.get('MapsURL')) in processed_urls:
                continue

            print(f"Processing [{i+1}/{len(data)}]: {row['Name']}")
            
            if row.get('Website'):
                site_data = self.scan_website_enriched(row['Website'])
                row.update(site_data)
            else:
                row.update({
                    "Emails": "", "Site_Title": "", "Site_Description": "",
                    "LinkedIn": "", "Facebook": "", "Twitter": "", "Instagram": ""
                })
            
            enriched_data.append(row)
            pd.DataFrame(enriched_data).to_csv(OUTPUT_FILE, index=False)

        return enriched_data


if __name__ == "__main__":
    bot = RobustScraper("Software Companies in ponda goa")
    maps_data = bot.scrape_google_maps()
    final_data = bot.run_stage_2_enrichment(maps_data)
    print(f"\nPipeline Complete. Data saved to {OUTPUT_FILE}")
