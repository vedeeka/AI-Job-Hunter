from fastapi import FastAPI, APIRouter, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
import os
import traceback
import pandas as pd

from ml_lab.extractors.maps_email_scraper import RobustScraper

app = FastAPI()
router = APIRouter()

OUTPUT_FILE = "final_leads_detailed.csv"

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------- POST endpoint -------------------
@router.post("/email-map-search")
def run_search(query: str = Query(..., description="Search query")):
    try:
        # Pass the query to the scraper
        bot = RobustScraper(search_query=query)

        # Stage 1
        maps_data = bot.scrape_google_maps()

        # Stage 2
        final_data = bot.run_stage_2_enrichment(maps_data)

        # Sanitize all data to avoid NaN/None
        results = []
        for row in final_data:
            clean_row = {}
            for k, v in row.items():
                if v is None or (isinstance(v, float) and pd.isna(v)):
                    clean_row[k] = ""
                else:
                    clean_row[k] = str(v) if isinstance(v, (int, float)) else v

            results.append({
                "Name": clean_row.get("Name", ""),
                "Website": clean_row.get("Website", ""),
                "Emails": clean_row.get("Emails", ""),
                "description": clean_row.get("Site_Description", ""),
                "LinkedIn": clean_row.get("LinkedIn", ""),
                "Facebook": clean_row.get("Facebook", ""),
                "Twitter": clean_row.get("Twitter", ""),
                "Instagram": clean_row.get("Instagram", ""),
                "Status": "Complete"
            })

        return {
            "status": "success",
            "total": len(results),
            "data": results,
            "file_url": "http://localhost:8000/download"
        }

    except Exception as e:
        print("SCRAPER ERROR:\n", traceback.format_exc())
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": str(e)}
        )

# ------------------- File download -------------------
@app.get("/download")
def download():
    if os.path.exists(OUTPUT_FILE):
        return FileResponse(OUTPUT_FILE, filename="leads.csv")
    return JSONResponse(status_code=404, content={"error": "File not found"})


@router.get("/email_des")
def generate_email(job_description: str, company_name: str):
    from backend.app.services.email_sender import generate_cold_email

    try:
        email_content = generate_cold_email(job_description, company_name)
        return JSONResponse(status_code=200, content=email_content)
    except Exception as e:
        print("EMAIL GENERATION ERROR:\n", traceback.format_exc())
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": str(e)}
        )


app.include_router(router)

# ------------------- Run -------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
