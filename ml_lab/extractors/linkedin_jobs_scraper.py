
import requests
from bs4 import BeautifulSoup
import pandas as pd
import time

def scrape_jobs_guest(keyword="Developer", location="Goa", max_jobs=20):
    """
    LinkedIn ke guest view se jobs scrape kare aur DataFrame me return kare.
    """
    jobs = []  # Saari jobs store karne ke liye list
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36"
    }
    base_url = "https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search"
    params = {"keywords": keyword, "location": location, "start": 0}

    while len(jobs) < max_jobs:
        resp = requests.get(base_url, headers=headers, params=params)  # Request bhejna
        if resp.status_code != 200:
            break

        soup = BeautifulSoup(resp.text, "html.parser")
        job_cards = soup.find_all("li")  # Job cards find karna
        if not job_cards:
            break

        for card in job_cards:
            if len(jobs) >= max_jobs:
                break

            # Important info extract karna
            title = card.find("h3").get_text(strip=True) if card.find("h3") else ""
            company = card.find("h4").get_text(strip=True) if card.find("h4") else ""

         
            location_tag = card.find("span", class_="job-result-card__location")
            if not location_tag:
                location_tag = card.find(lambda tag: tag.name=="span" and "location" in tag.get_text(strip=True).lower())
            location = location_tag.get_text(strip=True) if location_tag else "Not Specified"

            link = card.find("a", href=True)['href'] if card.find("a", href=True) else ""
            description = card.find("p").get_text(strip=True) if card.find("p") else ""
            date_posted = card.find("time").get_text(strip=True) if card.find("time") else ""

            # Job dictionary
            jobs.append({
                "title": title,
                "company": company,
                "location": location,
                "link": link,
                "description": description,
                "date_posted": date_posted
            })

        params["start"] += 25
        time.sleep(1)           
    return pd.DataFrame(jobs)  
