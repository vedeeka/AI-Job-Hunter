import spacy
import json

# Load your spaCy model
# If using pretrained:
# nlp = spacy.load("en_core_web_sm")

# If using your fine-tuned model later:
nlp = spacy.load("en_core_web_sm")


with open("profile_data.json", "r", encoding="utf-8") as f:
    data = json.load(f)
    text = data["about_raw"] + "\n" + data["experience_raw"]


doc = nlp(text)

entities = []
for ent in doc.ents:
    entities.append({
        "text": ent.text,
        "label": ent.label_
    })

# Store as JSON
result = {
    "text": text,
    "entities": entities
}

with open("ner_output.json", "w", encoding="utf-8") as f:
    json.dump(result, f, indent=4)

print("Saved to ner_output.json")
