import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestRegressor
from sklearn.feature_extraction.text import TfidfVectorizer
import joblib
from sklearn.compose import ColumnTransformer
import os
from sklearn.preprocessing import OneHotEncoder
df = pd.read_csv("/Users/vedeekaparab/Desktop/AI-Job-Hunter/data/training_dataset.csv")


#left feature liye aur right bhi
x=df[['Rating','Company Name','Job Title','Location','Employment Status','Job Roles']]
y=df['Salary']

#convert kiya numbers me
preprocessor = ColumnTransformer(
    transformers=[
        ('job_title', TfidfVectorizer(max_features=200), 'Job Title'),
        ('job_roles', TfidfVectorizer(max_features=200), 'Job Roles'),
        ('categorical', OneHotEncoder(handle_unknown='ignore'),
         ['Company Name','Location','Employment Status']),
        ('rating', 'passthrough', ['Rating'])
    ]
)

model_pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('regressor', RandomForestRegressor(n_estimators=100, random_state=42))
])


print("Training Salary Model...")
X_train, X_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=42)
model_pipeline.fit(X_train, y_train)


predictions = model_pipeline.predict(X_test)
print(f"📉 Mean Absolute Error: ${mean_absolute_error(y_test, predictions):,.2f}")

# 7. Save the Brain
joblib.dump(model_pipeline, '../../backend/app/ml_inference/models/salary_model.pkl')
print("✅ Model saved to backend/app/ml_inference/models/salary_model.pkl")