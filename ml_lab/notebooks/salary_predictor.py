import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import Ridge
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import numpy as np
import os



DATA_PATH = "/Users/vedeekaparab/Desktop/AI-Job-Hunter/data/training_dataset.csv"
MODEL_PATH = "/Users/vedeekaparab/Desktop/AI-Job-Hunter/backend/app/models/salary_model.pkl"


df = pd.read_csv(DATA_PATH)
X = df[['Rating','Company Name','Job Title','Location','Employment Status','Job Roles','Salaries Reported']]
y = df['Salary']


preprocessor = ColumnTransformer(
    transformers=[
        ('job_title', TfidfVectorizer(max_features=200), 'Job Title'),
        ('job_roles', TfidfVectorizer(max_features=200), 'Job Roles'),
        ('categorical', OneHotEncoder(handle_unknown='ignore'),
         ['Company Name','Location','Employment Status']),
        ('rating', 'passthrough', ['Rating'])
    ]
)


model_pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('regressor', Ridge())
])


X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)


print("Training Salary Model...")
model_pipeline.fit(X_train, y_train)


predictions = model_pipeline.predict(X_test)


mae = mean_absolute_error(y_test, predictions)
rmse = np.sqrt(mean_squared_error(y_test, predictions))
r2 = r2_score(y_test, predictions)

print("📊 Model Evaluation:")
print(f"MAE  : ${mae:,.2f}")
print(f"RMSE : ${rmse:,.2f}")
print(f"R2   : {r2:.4f}")


os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
joblib.dump(model_pipeline, MODEL_PATH)
print(f"✅ Model saved to {MODEL_PATH}")

