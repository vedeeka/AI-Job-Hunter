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

def run_profile_ner(profile_file="data/profile_data.json",
                    output_json="data/profile_ner.json",
                    output_csv="data/profile_ner.csv"):
  
   # LinkedIn profile ke text pe NER run kare aur JSON + CSV me save kare
   
    if not os.path.exists(profile_file):
        print(f"❌ Profile file not found: {profile_file}")
        return

    nlp = spacy.load("en_core_web_sm") 

    # Profile ke about + experience text combine aur clean
    with open(profile_file, "r", encoding="utf-8") as f:
        data = json.load(f)
        profile_text = clean_text(data.get("about_raw", "") + " " + data.get("experience_raw", ""))

    doc = nlp(profile_text)  
    entities = [{"text": ent.text, "label": ent.label_} for ent in doc.ents]  # Entities extract

    # JSON me save
    os.makedirs(os.path.dirname(output_json), exist_ok=True)
    with open(output_json, "w", encoding="utf-8") as f:
        json.dump({"text": profile_text, "entities": entities}, f, indent=4)

    # CSV me save
    df = pd.DataFrame(entities)
    df.to_csv(output_csv, index=False)

    print(f"✅ Profile NER saved to {output_json} and {output_csv}")
    return df, entities, profile_text


if __name__ == "__main__":
    run_profile_ner() 
