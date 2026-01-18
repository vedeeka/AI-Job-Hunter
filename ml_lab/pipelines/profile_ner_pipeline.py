import spacy
import json
import pandas as pd
import os
import re

def clean_text(text):
    if not text:
        return ""
    text = re.sub(r'\n+', ' ', text)        # Replace newlines with space
    text = re.sub(r'\s+', ' ', text)        # Remove extra spaces
    return text.strip()

def run_ner_on_jobs(jobs_input, profile_file="data/profile_data.json", output_file="data/linkedin_jobs_ner.json"):
    """
    jobs_input: can be a DataFrame OR path to CSV
    profile_file: path to profile JSON
    output_file: path to store JSON with NER
    """
    nlp = spacy.load("en_core_web_sm")

    # Load profile data
    if not os.path.exists(profile_file):
        print(f"❌ Profile file not found: {profile_file}")
        return

    with open(profile_file, "r", encoding="utf-8") as f:
        profile_data = json.load(f)
        profile_text = clean_text(profile_data.get("about_raw", "") + " " + profile_data.get("experience_raw", ""))

    profile_doc = nlp(profile_text)
    profile_entities = [{"text": ent.text, "label": ent.label_} for ent in profile_doc.ents]

    # Load jobs DataFrame
    if isinstance(jobs_input, str):
        if not os.path.exists(jobs_input):
            print(f"❌ Jobs CSV not found: {jobs_input}")
            return
        jobs_df = pd.read_csv(jobs_input)
    elif isinstance(jobs_input, pd.DataFrame):
        jobs_df = jobs_input.copy()
    else:
        print("❌ jobs_input must be a file path or a DataFrame")
        return

    # Annotate each job description
    jobs_ner = []
    for _, row in jobs_df.iterrows():
        job_desc = clean_text(row.get("description", ""))
        job_doc = nlp(job_desc)
        job_entities = [{"text": ent.text, "label": ent.label_} for ent in job_doc.ents]
        matched_entities = [ent for ent in job_entities if ent["text"] in [pe["text"] for pe in profile_entities]]

        jobs_ner.append({
            "title": row.get("title", ""),
            "company": row.get("company", ""),
            "location": row.get("location", ""),
            "link": row.get("link", ""),
            "description": job_desc,
            "entities_in_job": job_entities,
            "matched_profile_entities": matched_entities,
            "profile_text": profile_text
        })

    # Save to JSON
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(jobs_ner, f, indent=4)

    print(f"✅ NER-annotated jobs saved to {output_file}")
    return pd.DataFrame(jobs_ner)
