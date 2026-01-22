from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd

import os
from backend.app.api.endpoints import pipeline
from backend.app.api.endpoints import profile


app = FastAPI(title="AI Job Hunter API", version="1.0")


app.add_middleware(
    CORSMiddleware,
   
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(pipeline.router)
app.include_router(profile.router)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "models/salary_model_structured.pkl")

try:
    model = joblib.load(MODEL_PATH)
    print(f"✅ Model loaded from: {MODEL_PATH}")
except FileNotFoundError:
    print(f"❌ CRITICAL ERROR: Model not found at {MODEL_PATH}")
    model = None


class SalaryInput(BaseModel):
    job_state: str      
    same_state: int       
    age: int             
    python_yn: str        
    R_yn: str     
    spark: str           
    aws: str          
    excel: str         
    job_simp: str       
    seniority: str        
    desc_len: int        
    num_comp: int        


@app.post("/predict-salary")
def predict_salary(data: SalaryInput):
    if not model:
        raise HTTPException(status_code=500, detail="Model is not loaded.")

    try:
      
        input_dict = data.dict()

        
        binary_cols = ['python_yn', 'R_yn', 'spark', 'aws', 'excel']
        for col in binary_cols:
            val = input_dict[col]
            input_dict[col] = 1 if str(val).upper() == 'Y' else 0

       
        df_input = pd.DataFrame([input_dict])
        
      
        expected_cols = ['job_state', 'same_state', 'age', 'python_yn', 'R_yn', 
                         'spark', 'aws', 'excel', 'job_simp', 'seniority', 
                         'desc_len', 'num_comp']
        
        df_input = df_input[expected_cols]


        pred_log = model.predict(df_input)
        
        
        predicted_salary = np.expm1(pred_log[0])

        return {
            "predicted_salary": int(predicted_salary),
            "currency": "INR",
            "status": "success",
            "input_received": input_dict
        }

    except Exception as e:
        return {"error": str(e), "status": "failed"}


@app.get("/")
def home():
    return {"message": "AI Job Hunter Backend is Running! "}