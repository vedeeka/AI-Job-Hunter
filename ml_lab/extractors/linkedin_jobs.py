from playwright.sync_api import sync_playwright
import pandas as pd

def scrape_jobs_guest(keyword="Machine Learning", location="India", limit=10):
    url = f"https://www.linkedin.com/jobs/search?keywords={keyword}&location={location}"
    jobs_data = []

    with sync_playwright() as p:
        # Headless=False because LinkedIn blocks headless faster
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()

        # Load page
        page.goto(url)
        page.wait_for_selector("ul.jobs-search__results-list", timeout=10000)

        # Scroll to load more results
        scrolls = (limit // 5) + 1
        for _ in range(scrolls):
            page.mouse.wheel(0, 2500)
            page.wait_for_timeout(1500)

        # Grab all list items
        cards = page.locator("ul.jobs-search__results-list > li")
        total_cards = cards.count()
        print(f"Found {total_cards} list items")

        for i in range(total_cards):
            card = cards.nth(i)

            # Skip non-job cards (ads, spacers, etc.)
            link_locator = card.locator("a.base-card__full-link")
            if link_locator.count() == 0:
                continue

            # Extract fields safely
            try:
                title = card.locator("h3.base-search-card__title").inner_text().strip()
            except:
                title = ""

            try:
                company = card.locator("h4.base-search-card__subtitle").inner_text().strip()
            except:
                company = ""

            try:
                loc = card.locator(".job-search-card__location").inner_text().strip()
            except:
                loc = ""

            link = link_locator.get_attribute("href")
            link = link.split("?")[0]  # remove tracking params

            jobs_data.append({
                "title": title,
                "company": company,
                "location": loc,
                "link": link
            })

            # Stop once limit reached
            if len(jobs_data) >= limit:
                break

        browser.close()

    return pd.DataFrame(jobs_data)


# ---------------- USAGE ----------------

if __name__ == "__main__":
    df = scrape_jobs_guest("Developer", "Goa", 20)
    df.to_csv("data/linkedin_jobs.csv", index=False)
    print(df)
