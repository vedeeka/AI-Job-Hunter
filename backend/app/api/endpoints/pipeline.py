from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import pandas as pd
import os
import json


from ml_lab.extractors.linkedin_jobs_scraper import scrape_jobs_guest
from ml_lab.extractors.my_data_linkdin import scrape_my_profile
from ml_lab.pipelines.profile_ner_pipeline import run_profile_ner
from ml_lab.pipelines.jobs_ner_pipeline import run_jobs_ner

router = APIRouter()

class SearchRequest(BaseModel):
    keyword: str
    location: str
    max_jobs: int = 10

@router.post("/run-search")
async def run_search_pipeline(request: SearchRequest):
    try:
        os.makedirs("data", exist_ok=True)
        print(f"🚀 API Triggered: Searching for {request.keyword} in {request.location}")

        # --- Step 1: Scrape Jobs ---
        jobs_df = scrape_jobs_guest(
            keyword=request.keyword, 
            location=request.location, 
            max_jobs=request.max_jobs
        )
        # Save raw backup
        jobs_df.to_csv("data/linkedin_jobs.csv", index=False)
        
       
        if not os.path.exists("data/profile_data.json"):
            print("👤 Scraping Profile...")
            scrape_my_profile("https://www.linkedin.com/in/vedeeka-parab-7a5174270/")
        
        # --- Step 3: Run NER Pipelines ---
        print("🧠 Running NER Analysis...")
        
        # Process Profile
        run_profile_ner("data/profile_data.json")
        
        jobs_df.to_csv("data/final_processed_jobs_normal.csv", index=False)
        final_jobs_df = run_jobs_ner(jobs_df, profile_json="data/profile_ner.json")
        
        # Save final result
        final_jobs_df.to_csv("data/final_processed_jobs_ner.csv", index=False)

        
        final_jobs_df = final_jobs_df.fillna("")
        
        # Convert DataFrame to list of dicts: [{'title': '...', 'score': 90}, ...]
        results = jobs_df.to_dict(orient="records")

        return {
            "status": "success",
            "count": len(results),
            "data": results
        }

    except Exception as e:
        print(f"❌ Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))