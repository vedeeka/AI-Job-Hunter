
import pandas as pd
from ml_lab.extractors.linkedin_jobs_scraper import scrape_jobs_guest
from ml_lab.extractors.my_data_linkdin import scrape_my_profile
from ml_lab.pipelines.profile_ner_pipeline import run_profile_ner
from ml_lab.pipelines.jobs_ner_pipeline import run_jobs_ner
import os

os.makedirs("data", exist_ok=True)  

print("Step 1: Scraping jobs")
jobs_df = scrape_jobs_guest(keyword="intern", location="Goa", max_jobs=20)
jobs_df.to_csv("data/linkedin_jobs.csv", index=False)
print("Jobs saved to data/linkedin_jobs.csv")


print("Step 2: Scraping my profile")
profile_data = scrape_my_profile("https://www.linkedin.com/in/vedeeka-parab-7a5174270/")


print("Step 2.1: Running Profile NER")
profile_df, profile_entities, profile_text = run_profile_ner("data/profile_data.json")


print("Step 3: Running NER on jobs")
run_jobs_ner(jobs_df, profile_json="data/profile_ner.json")
