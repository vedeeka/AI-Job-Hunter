# ml_lab/pipelines/jobs_ner_pipeline.py
import spacy
import json
import pandas as pd
import os
import re

def clean_text(text):
    if not text:
        return ""
    text = re.sub(r'\n+', ' ', text) 
    text = re.sub(r'\s+', ' ', text) 
    return text.strip()

def run_jobs_ner(jobs_df, profile_json="data/profile_ner.json",
                 output_json="data/jobs_ner.json", output_csv="data/jobs_ner.csv"):
    """
    Jobs ke saare fields pe NER run kare aur profile entities ke saath match kare.
    """
    nlp = spacy.load("en_core_web_sm") 

    if not os.path.exists(profile_json):
        print(f"❌ Profile NER file not found: {profile_json}")
        return

    # Profile entities load
    with open(profile_json, "r", encoding="utf-8") as f:
        profile_data = json.load(f)
        profile_entities_text = [ent["text"] for ent in profile_data.get("entities", [])]

    jobs_ner = []

    for _, row in jobs_df.iterrows():
        # Saare relevant fields combine karke text banaya
        combined_text = " ".join([str(row.get(col, "")) for col in ["title","company","location","description","date_posted"]])
        combined_text = clean_text(combined_text)

        doc = nlp(combined_text)  
        job_entities = [{"text": ent.text, "label": ent.label_} for ent in doc.ents]  # Entities extract

        # Profile entities ke saath match
        matched = [ent for ent in job_entities if ent["text"] in profile_entities_text]

        # Row ko dictionary me save aur extra fields add
        job_record = row.to_dict()
        job_record["entities_in_job"] = job_entities
        job_record["matched_profile_entities"] = matched
        jobs_ner.append(job_record)

    # JSON me save
    os.makedirs(os.path.dirname(output_json), exist_ok=True)
    with open(output_json, "w", encoding="utf-8") as f:
        json.dump(jobs_ner, f, indent=4)

    # CSV me save
    df = pd.DataFrame(jobs_ner)
    df.to_csv(output_csv, index=False)

    print(f"Jobs NER saved to {output_json} and {output_csv}")
    return df
