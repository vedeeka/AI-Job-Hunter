import requests
from bs4 import BeautifulSoup
import pandas as pd
import time

def scrape_jobs_guest(keyword="Developer", location="Goa", max_jobs=20):
    jobs = []
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36"
    }
    
    base_url = "https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search"
    params = {"keywords": keyword, "location": location, "start": 0}

    while len(jobs) < max_jobs:
        resp = requests.get(base_url, headers=headers, params=params)
        if resp.status_code != 200:
            break

        soup = BeautifulSoup(resp.text, "html.parser")
        job_cards = soup.find_all("li")

        if not job_cards:
            break

        for card in job_cards:
            if len(jobs) >= max_jobs:
                break


            title_tag = card.find("h3")
            title = title_tag.get_text(strip=True) if title_tag else ""

   
            company_tag = card.find("h4")
            company = company_tag.get_text(strip=True) if company_tag else ""

            
            location_tag = card.find("span", class_="job-search-card__location")
            location_val = location_tag.get_text(strip=True) if location_tag else "Not Specified"

    
            link_tag = card.find("a", href=True)
            link = link_tag["href"] if link_tag else ""

 
            date_tag = card.find("time")
            date_posted = date_tag.get_text(strip=True) if date_tag else ""

        
            description = ""
            if link:
                try:
                    job_page = requests.get(link, headers=headers, timeout=5)
                    job_soup = BeautifulSoup(job_page.text, "html.parser")
                    desc_div = job_soup.find("div", class_="show-more-less-html__markup")
                    if desc_div:
                        description = desc_div.get_text(strip=True)
                except:
                    description = ""

      
            jobs.append({
                "title": title,
                "company": company,
                "location": location_val,
                "link": link,
                "description": description,
                "date_posted": date_posted
            })

        params["start"] += 25
        time.sleep(1)  
    return pd.DataFrame(jobs)
