import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import numpy as np
from sklearn.metrics import accuracy_score, classification_report
MODEL_PATH = "/Users/vedeekaparab/Desktop/AI-Job-Hunter/backend/app/models/salary_model.pkl"
DATA_PATH  = "/Users/vedeekaparab/Desktop/AI-Job-Hunter/data/training_dataset.csv"
import os
from sklearn.pipeline import Pipeline

salary_model = joblib.load(MODEL_PATH)
print("✅ Salary Model Loaded")

def predict_salary(job_title, job_roles, company, location, employment_status, rating, salaries_reported):
    input_data = pd.DataFrame({
        "Job Title": [job_title],
        "Job Roles": [job_roles],
        "Company Name": [company],
        "Location": [location],
        "Employment Status": [employment_status],
        "Rating": [rating],
        "Salaries Reported": [salaries_reported]
    })
    pred = salary_model.predict(input_data)
    return int(pred[0])


# Test
result = predict_salary(
    job_title="Android Developer",
    job_roles="Android",
    company="Appoids Tech Solutions",
    location="Bangalore",
    employment_status="Full time",
    rating=3.8,
    salaries_reported=3
)
print("💰 Predicted Salary:", result)
