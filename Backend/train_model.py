# import pandas as pd
# import numpy as np
# import xgboost as xgb
# import pickle
# from sklearn.model_selection import train_test_split

# # --- Configuration ---
# DATASET_PATH = "sharespace_profiles.csv"
# MODEL_OUTPUT_PATH = "roommate_matcher.pkl"
# COLUMNS_OUTPUT_PATH = "model_columns.pkl"

# # --- 1. Load the Data ---
# print(f"Loading dataset from '{DATASET_PATH}'...")
# df = pd.read_csv(DATASET_PATH)

# # --- 2. Feature Engineering: Create a Target Variable ---

# def calculate_compatibility_score(row):
#     """
#     Calculates a 'compatibility_score' based on a combination of factors
#     from a combined seeker and lister row.
#     """
#     score = 100
    
#     # Penalize for differences in core habits
#     score -= abs(row['cleanliness_seeker'] - row['cleanliness_lister']) * 5
#     score -= abs(row['noise_level_seeker'] - row['noise_level_lister']) * 5
    
#     # Penalize for mismatches in categorical habits
#     if row['sleep_schedule_seeker'] != row['sleep_schedule_lister']:
#         score -= 15
#     if row['smoking_seeker'] != row['smoking_lister']:
#         score -= 20  # Smoking is a bigger deal
        
#     # Reward for similar social levels
#     if row['social_level_seeker'] == row['social_level_lister']:
#         score += 10
        
#     # Budget compatibility
#     budget_diff = abs(row['budget_seeker'] - row['budget_lister'])
#     score -= (budget_diff / 500) * 10  # Penalize by $10 for every $500 difference

#     return max(0, min(100, score)) # Ensure score is between 0 and 100

# print("Engineering features and creating compatibility scores...")
# seekers = df[df['role'] == 'Seeker'].copy().reset_index(drop=True)
# listers = df[df['role'] == 'Lister'].copy().reset_index(drop=True)

# # Rename columns for clarity before merging
# seekers.columns = [f"{col}_seeker" for col in seekers.columns]
# listers.columns = [f"{col}_lister" for col in listers.columns]

# # Create pairs of seekers and listers to form a training dataset
# num_pairs = min(len(seekers), len(listers))
# paired_data = pd.concat([seekers.iloc[:num_pairs], listers.iloc[:num_pairs]], axis=1)


# # Calculate the compatibility score for each pair
# paired_data['compatibility_score'] = paired_data.apply(calculate_compatibility_score, axis=1)


# # --- 3. Preprocess the Paired Data for ML ---

# print("Preprocessing paired data for machine learning...")
# # Drop original role columns as they are redundant now
# paired_data = paired_data.drop(columns=['role_seeker', 'role_lister'])

# # Convert boolean 'has_pets' columns to integers
# paired_data['has_pets_seeker'] = paired_data['has_pets_seeker'].astype(int)
# paired_data['has_pets_lister'] = paired_data['has_pets_lister'].astype(int)

# # Identify categorical columns to be encoded
# categorical_cols = [col for col in paired_data.columns if paired_data[col].dtype == 'object']

# # Apply one-hot encoding
# df_processed = pd.get_dummies(paired_data, columns=categorical_cols, drop_first=True)


# # --- 4. Train the Machine Learning Model ---

# # Define features (X) and target (y)
# X = df_processed.drop('compatibility_score', axis=1)
# y = df_processed['compatibility_score']

# # Save the column order for later use in the API
# model_columns = X.columns
# with open(COLUMNS_OUTPUT_PATH, 'wb') as f:
#     pickle.dump(model_columns, f)

# # Split data into training and testing sets
# X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# # Initialize and train the XGBoost Regressor model
# print("Training the XGBoost model...")
# xgbr = xgb.XGBRegressor(objective='reg:squarederror', n_estimators=100, learning_rate=0.1, max_depth=5, random_state=42)
# xgbr.fit(X_train, y_train)

# # Evaluate the model
# score = xgbr.score(X_test, y_test)
# print(f"\nModel training complete. R^2 Score: {score:.4f}")


# # --- 5. Save the Trained Model ---

# print(f"Saving trained model to '{MODEL_OUTPUT_PATH}'...")
# with open(MODEL_OUTPUT_PATH, 'wb') as f:
#     pickle.dump(xgbr, f)

# print(f"Saving model columns to '{COLUMNS_OUTPUT_PATH}'...")

# print("\n✅ Successfully trained and saved the model!")



# train_model.py
import os
import math
import pickle
import random
from typing import List

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, KFold, cross_val_score
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OneHotEncoder
from sklearn.metrics import r2_score, mean_absolute_error
import xgboost as xgb
import joblib

# -----------------------------
# Config
# -----------------------------
DATASET_PATH = "sharespace_profiles.csv"
PIPELINE_OUTPUT_PATH = "roommate_matcher_pipeline.pkl"   # saves preproc + model together
META_OUTPUT_PATH = "roommate_matcher_meta.pkl"           # saves column lists & info
TOPN_SAMPLE_OUTPUT = "sample_top_matches.csv"

RANDOM_STATE = 42
MAX_PAIRS = 200_000   # safety cap for training size; tweak based on your RAM/CPU
BUDGET_TOLERANCE = 0.35  # allow ~35% mismatch before hard-filtering a candidate
PRINT_TOP_FEATURES = 30

random.seed(RANDOM_STATE)
np.random.seed(RANDOM_STATE)


# -----------------------------
# Utility: validations
# -----------------------------
REQUIRED_COLUMNS = [
    # identifiers & role
    "user_id", "role",
    # location
    "city",
    # budgets (int)
    "budget",
    # core numerics (scale 1..5 or 1..3 etc.)
    "cleanliness", "noise_level",
    # categoricals (string/enums)
    "sleep_schedule", "smoking", "social_level",
    # booleans
    "has_pets",
    # optional but helpful
    "gender_preference", "work_schedule", "occupation", "mbti_type"
]

def ensure_columns(df: pd.DataFrame, cols: List[str]):
    missing = [c for c in cols if c not in df.columns]
    if missing:
        raise ValueError(f"Missing required columns in CSV: {missing}")


# -----------------------------
# Load
# -----------------------------
print(f"Loading dataset from '{DATASET_PATH}'...")
df = pd.read_csv(DATASET_PATH)
ensure_columns(df, REQUIRED_COLUMNS)

# Basic type hygiene
if df["has_pets"].dtype != np.int64 and df["has_pets"].dtype != np.int32 and df["has_pets"].dtype != np.int8:
    # accept True/False or 'yes'/'no'
    df["has_pets"] = df["has_pets"].map({True: 1, False: 0, "yes": 1, "no": 0, "Yes": 1, "No": 0}).fillna(df["has_pets"])
    df["has_pets"] = df["has_pets"].astype("float").round().astype(int)

# Keep only needed columns to avoid accidental leakage
df = df[[c for c in REQUIRED_COLUMNS if c in df.columns]].copy()

# Split roles
seekers = df[df["role"].str.lower() == "seeker"].copy().reset_index(drop=True)
listers = df[df["role"].str.lower() == "lister"].copy().reset_index(drop=True)

if seekers.empty or listers.empty:
    raise ValueError("Need at least one Seeker and one Lister row to build pairs.")

# -----------------------------
# Candidate pairing (efficient)
#   - Same city
#   - Budget overlap / tolerance
#   - Sample if too large
# -----------------------------
def budget_overlap_ok(b1, b2, tol=BUDGET_TOLERANCE):
    # Accept if budgets within tol proportion (e.g., 35%) or min/max cross each other
    if pd.isna(b1) or pd.isna(b2):
        return True
    b1 = float(b1); b2 = float(b2)
    denom = max(1.0, (b1 + b2) / 2.0)
    return abs(b1 - b2) / denom <= tol

print("Building candidate pairs (same city + budget tolerance)...")
seekers_small = seekers.rename(columns={c: f"{c}_seeker" for c in seekers.columns})
listers_small = listers.rename(columns={c: f"{c}_lister" for c in listers.columns})

# Fast filter: inner join on city to avoid full cartesian
seekers_small["key_city"] = seekers_small["city_seeker"].fillna("__NA__").astype(str).str.strip().str.lower()
listers_small["key_city"] = listers_small["city_lister"].fillna("__NA__").astype(str).str.strip().str.lower()

pairs = seekers_small.merge(
    listers_small[["user_id_lister", "budget_lister", "has_pets_lister", "cleanliness_lister",
                   "noise_level_lister", "sleep_schedule_lister", "smoking_lister",
                   "social_level_lister", "gender_preference_lister", "work_schedule_lister",
                   "occupation_lister", "mbti_type_lister", "key_city"]],
    on="key_city",
    how="inner",
    suffixes=("_seeker", "_lister")
)

# Apply budget overlap filter
pairs = pairs[pairs.apply(lambda r: budget_overlap_ok(r["budget_seeker"], r["budget_lister"], BUDGET_TOLERANCE), axis=1)]

# If too large, sample down deterministically
if len(pairs) > MAX_PAIRS:
    pairs = pairs.sample(n=MAX_PAIRS, random_state=RANDOM_STATE).reset_index(drop=True)

print(f"Candidate pairs: {len(pairs):,}")

# -----------------------------
# Target: rule-based compatibility on RAW cols
# -----------------------------
def calculate_compatibility_score(row):
    score = 100.0

    # Numeric distances (assume scales 1..5)
    if not pd.isna(row["cleanliness_seeker"]) and not pd.isna(row["cleanliness_lister"]):
        score -= abs(float(row["cleanliness_seeker"]) - float(row["cleanliness_lister"])) * 5.0

    if not pd.isna(row["noise_level_seeker"]) and not pd.isna(row["noise_level_lister"]):
        score -= abs(float(row["noise_level_seeker"]) - float(row["noise_level_lister"])) * 5.0

    # Categorical alignment
    if pd.notna(row["sleep_schedule_seeker"]) and pd.notna(row["sleep_schedule_lister"]):
        if str(row["sleep_schedule_seeker"]).strip().lower() != str(row["sleep_schedule_lister"]).strip().lower():
            score -= 15.0

    if pd.notna(row["smoking_seeker"]) and pd.notna(row["smoking_lister"]):
        if str(row["smoking_seeker"]).strip().lower() != str(row["smoking_lister"]).strip().lower():
            score -= 20.0  # bigger penalty

    if pd.notna(row["social_level_seeker"]) and pd.notna(row["social_level_lister"]):
        if str(row["social_level_seeker"]).strip().lower() == str(row["social_level_lister"]).strip().lower():
            score += 10.0

    # Budget difference penalty (~₹ or $ agnostic)
    if pd.notna(row["budget_seeker"]) and pd.notna(row["budget_lister"]):
        budget_diff = abs(float(row["budget_seeker"]) - float(row["budget_lister"]))
        score -= (budget_diff / 500.0) * 10.0  # tune later

    # Pets hard rule (optional; comment if not needed)
    # If lister disallows pets but seeker has pets, drop score
    # You could carry a lister.allows_pets field; here we only compare ownership.
    # If you want strict rule, uncomment below:
    # if row.get("has_pets_seeker", 0) == 1 and row.get("has_pets_lister", 0) == 0:
    #     score -= 10.0

    return max(0.0, min(100.0, score))

print("Computing compatibility scores...")
pairs["compatibility_score"] = pairs.apply(calculate_compatibility_score, axis=1)

# Drop helper key
pairs = pairs.drop(columns=["key_city"])

# -----------------------------
# Preprocess (impute + one-hot)
#   - Build list of model features
# -----------------------------
TARGET_COL = "compatibility_score"

# Columns that belong to a pair (exclude IDs and obvious non-features)
exclude_cols_prefixes = ["user_id_"]
exclude_cols = [c for c in pairs.columns if any(c.startswith(p) for p in exclude_cols_prefixes)]
feature_cols = [c for c in pairs.columns if c not in exclude_cols + [TARGET_COL]]

# Separate numeric / categorical
numeric_cols = []
categorical_cols = []
for c in feature_cols:
    if pd.api.types.is_numeric_dtype(pairs[c]):
        numeric_cols.append(c)
    else:
        categorical_cols.append(c)

print(f"Features -> numeric: {len(numeric_cols)}, categorical: {len(categorical_cols)}")

preprocessor = ColumnTransformer(
    transformers=[
        ("num", SimpleImputer(strategy="median"), numeric_cols),
        ("cat", Pipeline(steps=[
            ("imputer", SimpleImputer(strategy="most_frequent")),
            ("ohe", OneHotEncoder(handle_unknown="ignore", sparse_output=False))
        ]), categorical_cols),
    ],
    remainder="drop"
)

model = xgb.XGBRegressor(
    objective="reg:squarederror",
    n_estimators=400,
    learning_rate=0.05,
    max_depth=6,
    subsample=0.85,
    colsample_bytree=0.85,
    random_state=RANDOM_STATE,
    n_jobs=-1
)

pipe = Pipeline(steps=[("prep", preprocessor), ("model", model)])

# -----------------------------
# Train / Eval
# -----------------------------
X = pairs[feature_cols]
y = pairs[TARGET_COL].astype(float)

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.20, random_state=RANDOM_STATE
)

print("Training the XGBoost pipeline...")
pipe.fit(X_train, y_train)

y_pred = pipe.predict(X_test)
r2 = r2_score(y_test, y_pred)
mae = mean_absolute_error(y_test, y_pred)
print(f"\nModel training complete. R^2: {r2:.4f} | MAE: {mae:.2f}")

# 5-fold CV (quick sanity check)
print("Running 5-fold CV R^2 (this may take a bit)...")
cv = KFold(n_splits=5, shuffle=True, random_state=RANDOM_STATE)
cv_scores = cross_val_score(pipe, X, y, scoring="r2", cv=cv, n_jobs=-1)
print(f"CV R^2: mean={cv_scores.mean():.4f} | std={cv_scores.std():.4f}")

# -----------------------------
# Inspect top features (approx)
# -----------------------------
# To get feature names after OHE, fit a tiny copy and fetch names
pipe.fit(X_train[:200], y_train[:200])  # small fit for names only
prep = pipe.named_steps["prep"]
model_fitted = pipe.named_steps["model"]

num_names = numeric_cols
ohe = prep.named_transformers_["cat"].named_steps["ohe"]
cat_names = []
if categorical_cols:
    cat_names = list(ohe.get_feature_names_out(categorical_cols))
feature_names = num_names + cat_names

importances = getattr(model_fitted, "feature_importances_", np.array([]))
if importances.size == len(feature_names):
    top_idx = np.argsort(importances)[::-1][:PRINT_TOP_FEATURES]
    print("\nTop features:")
    for rank, i in enumerate(top_idx, 1):
        print(f"{rank:>2}. {feature_names[i]}  —  {importances[i]:.5f}")
else:
    print("\n(Skipping feature importance print — length mismatch; harmless.)")

# -----------------------------
# Save pipeline + meta
# -----------------------------
print(f"\nSaving full pipeline to '{PIPELINE_OUTPUT_PATH}'...")
joblib.dump(pipe, PIPELINE_OUTPUT_PATH)

meta = {
    "feature_cols": feature_cols,
    "numeric_cols": numeric_cols,
    "categorical_cols": categorical_cols,
    "random_state": RANDOM_STATE,
    "budget_tolerance": BUDGET_TOLERANCE,
    "max_pairs": MAX_PAIRS
}
with open(META_OUTPUT_PATH, "wb") as f:
    pickle.dump(meta, f)

print("Artifacts saved.")

# -----------------------------
# Helper: Top-N recommendations for a sample seeker
# -----------------------------
def recommend_top_n_for_seeker(sample_seeker: pd.Series, listers_df: pd.DataFrame, n=10) -> pd.DataFrame:
    # Build candidate pairs (same city + budget tol)
    s = sample_seeker.copy()
    s.index = [f"{c}_seeker" for c in s.index]

    cand = listers_df.copy()
    cand = cand.rename(columns={c: f"{c}_lister" for c in cand.columns})
    cand["key_city"] = cand["city_lister"].fillna("__NA__").astype(str).str.strip().str.lower()

    key_city = str(sample_seeker["city"]).strip().lower() if pd.notna(sample_seeker["city"]) else "__NA__"
    cand = cand[cand["key_city"] == key_city].drop(columns=["key_city"], errors="ignore")

    if cand.empty:
        return pd.DataFrame(columns=["user_id_lister", "predicted_score"])

    # combine with seeker row
    s_df = pd.DataFrame([s])
    pairs_local = s_df.assign(key=1).merge(cand.assign(key=1), on="key").drop(columns=["key"])

    # filter budgets
    pairs_local = pairs_local[pairs_local.apply(lambda r: budget_overlap_ok(r["budget_seeker"], r["budget_lister"], BUDGET_TOLERANCE), axis=1)]
    if pairs_local.empty:
        return pd.DataFrame(columns=["user_id_lister", "predicted_score"])

    # Predict using the trained pipeline
    # Align with training features
    X_local = pairs_local[feature_cols]
    scores = pipe.predict(X_local)
    out = pairs_local[["user_id_lister"]].copy()
    out["predicted_score"] = scores
    out = out.sort_values("predicted_score", ascending=False).head(n).reset_index(drop=True)
    return out

# Generate a small sample Top-N CSV (for sanity check)
try:
    if not seekers.empty and not listers.empty:
        sample_seeker_row = seekers.iloc[0]
        topn = recommend_top_n_for_seeker(sample_seeker_row, listers, n=10)
        topn.to_csv(TOPN_SAMPLE_OUTPUT, index=False)
        print(f"\nSaved sample top matches for seeker_id={sample_seeker_row['user_id']} -> '{TOPN_SAMPLE_OUTPUT}'")
except Exception as e:
    print(f"(Non-fatal) Could not generate sample Top-N CSV: {e}")

print("\n✅ Successfully trained and saved the upgraded model & pipeline!")
