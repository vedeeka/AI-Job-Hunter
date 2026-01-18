from playwright.sync_api import sync_playwright
import pandas as pd

def scrape_jobs_guest(keyword="Machine Learning", location="India", limit=10):
    url = f"https://www.linkedin.com/jobs/search?keywords={keyword}&location={location}"
    jobs_data = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        page.goto(url)
        page.wait_for_selector("ul.jobs-search__results-list", timeout=10000)

        scrolls = (limit // 5) + 1
        for _ in range(scrolls):
            page.mouse.wheel(0, 3000)
            page.wait_for_timeout(1500)

        cards = page.locator("ul.jobs-search__results-list > li")
        total_cards = cards.count()
        print(f"Found {total_cards} list items")

        collected = 0

        for i in range(total_cards):
            if collected >= limit:
                break

            card = cards.nth(i)
            link_locator = card.locator("a.base-card__full-link")
            if link_locator.count() == 0:
                continue

            title = card.locator("h3.base-search-card__title").inner_text().strip()
            company = card.locator("h4.base-search-card__subtitle").inner_text().strip()
            loc = card.locator(".job-search-card__location").inner_text().strip()
            link = link_locator.get_attribute("href").split("?")[0]

            detail_page = browser.new_page()
            detail_page.goto(link)
            detail_page.wait_for_load_state("domcontentloaded")

            try:
                detail_page.wait_for_selector("div.show-more-less-html__markup", timeout=8000)
                description = detail_page.locator("div.show-more-less-html__markup").inner_text()
            except:
                description = ""
            detail_page.close()

            jobs_data.append({
                "title": title,
                "company": company,
                "location": loc,
                "link": link,
                "description": description.strip()
            })

            collected += 1
            print(f"Collected {collected} jobs")

        browser.close()

    return pd.DataFrame(jobs_data)

if __name__ == "__main__":
    df = scrape_jobs_guest("Developer", "Goa", 20)
    df.to_csv("data/linkedin_jobs.csv", index=False)
    print("✅ Jobs saved to data/linkedin_jobs.csv")
