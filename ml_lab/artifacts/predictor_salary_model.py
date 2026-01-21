import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import numpy as np
from sklearn.pipeline import Pipeline

from sklearn.metrics import accuracy_score, classification_report
MODEL_PATH = "/Users/vedeekaparab/Desktop/AI-Job-Hunter/backend/app/models/salary_model_structured.pkl"
DATA_PATH  = "/Users/vedeekaparab/Desktop/AI-Job-Hunter/data/training_dataset.csv"
import os







salary_model = joblib.load(MODEL_PATH)
print("✅ Salary Model Loaded")
def predict_salary(job_state, same_state, age, python_yn, R_yn, spark, aws, excel,
                   job_simp, seniority, desc_len, num_comp):

    input_data = pd.DataFrame({
        'job_state': [job_state],
        'same_state': [same_state],
        'age': [age],
        'python_yn': [1 if python_yn == 'Y' else 0],
        'R_yn': [1 if R_yn == 'Y' else 0],
        'spark': [1 if spark == 'Y' else 0],
        'aws': [1 if aws == 'Y' else 0],
        'excel': [1 if excel == 'Y' else 0],
        'job_simp': [job_simp],
        'seniority': [seniority],
        'desc_len': [desc_len],
        'num_comp': [num_comp]
    })

    pred_log = salary_model.predict(input_data)
    return int(np.expm1(pred_log[0]))



result = predict_salary(
    job_state="NM",
    same_state="N",
    age=47,
    python_yn="Y",
    R_yn="N",
    spark="N",
    aws="N",
    excel="Y",
    job_simp="Data Scientist",
    seniority="Unknown",
    desc_len=2536,
    num_comp=0
)
print("💰 Predicted Salary:", result)