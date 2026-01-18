from ml_lab.extractors.linkedin_jobs_scraper import scrape_jobs_guest
from ml_lab.pipelines.profile_ner_pipeline import run_ner_on_jobs
import pandas as pd

if __name__ == "__main__":
    print("🚀 Step 1: Scraping jobs")
    jobs_df = scrape_jobs_guest("Developer", "Goa", 20)
    jobs_df.to_csv("data/linkedin_jobs.csv", index=False)
    print("✅ Jobs saved to data/linkedin_jobs.csv")

    print("🚀 Step 2: Running NER on jobs using profile")
    annotated_df = run_ner_on_jobs(jobs_df, profile_file="data/profile_data.json")
    annotated_df.to_csv("data/linkedin_jobs_ner.csv", index=False)
    print("✅ Annotated jobs saved to data/linkedin_jobs_ner.csv")
