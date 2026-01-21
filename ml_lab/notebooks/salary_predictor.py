import pandas as pd
import numpy as np
import joblib
import os
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.metrics import mean_absolute_error, r2_score
import xgboost as xgb


DATA_PATH = "/Users/vedeekaparab/Desktop/AI-Job-Hunter/data/eda_data.csv"
MODEL_PATH = "/Users/vedeekaparab/Desktop/AI-Job-Hunter/backend/app/models/salary_model_structured.pkl"


df = pd.read_csv(DATA_PATH)


binary_cols = ['python_yn', 'R_yn', 'spark', 'aws', 'excel']
for col in binary_cols:
    df[col] = df[col].map({'Y': 1, 'N': 0}).fillna(0)


categorical_cols = ['job_state', 'same_state', 'job_simp', 'seniority']
for col in categorical_cols:
    df[col] = df[col].fillna('Unknown')

numeric_cols = ['age', 'desc_len', 'num_comp']
for col in numeric_cols:
    df[col] = df[col].fillna(df[col].median())


X = df[binary_cols + numeric_cols + categorical_cols]
y = np.log1p(df['avg_salary'])

preprocessor = ColumnTransformer(
    transformers=[
        ('categorical', OneHotEncoder(handle_unknown='ignore', sparse_output=False), categorical_cols),
        ('numeric', StandardScaler(), numeric_cols + binary_cols)
    ],
    remainder='drop'
)


xgb_model = xgb.XGBRegressor(
    n_estimators=500,
    learning_rate=0.05,
    max_depth=6,
    subsample=0.8,
    colsample_bytree=0.8,
    random_state=42,
    n_jobs=-1
)

model_pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('regressor', xgb_model)
])


X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print(" Training Model...")
model_pipeline.fit(X_train, y_train)


predictions = np.expm1(model_pipeline.predict(X_test))
y_test_exp = np.expm1(y_test)

mae = mean_absolute_error(y_test_exp, predictions)
r2 = r2_score(y_test_exp, predictions)

print("\n Model Performance:")
print(f"   MAE: ₹{mae:,.0f}")
print(f"   R2 Score: {r2:.4f}")


comparison = pd.DataFrame({'Actual': y_test_exp, 'Predicted': predictions}).head(5)
print("\n Prediction Check:")
print(comparison)


os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
joblib.dump(model_pipeline, MODEL_PATH)
print(f"\n Model saved to {MODEL_PATH}")





