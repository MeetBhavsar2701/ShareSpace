# import pandas as pd
# import numpy as np
# from sklearn.preprocessing import MinMaxScaler

# # --- Configuration ---
# NUM_PROFILES = 5000

# # --- Define the building blocks for our synthetic data ---

# # Lifestyle and Habits Options
# CLEANLINESS_RANGE = [1, 2, 3, 4, 5]
# SLEEP_SCHEDULE_OPTIONS = ["Early Bird", "Night Owl", "Flexible"]
# NOISE_LEVEL_RANGE = [1, 2, 3, 4, 5]
# GUEST_FREQUENCY_OPTIONS = ["Rarely", "Occasionally", "Frequently"]
# SOCIAL_LEVEL_OPTIONS = ["Keep to self", "Friendly but independent", "Very social / Friends"]

# # Essential Preferences Options
# SMOKING_OPTIONS = ["Non-Smoker", "Smokes Outside", "Smokes Inside"]
# GENDER_PREFERENCE_OPTIONS = ["Male", "Female", "No Preference"]

# # Professional & Daily Life Options
# WORK_SCHEDULE_OPTIONS = ["9-to-5", "Shift Work", "Remote / WFH", "Student"]
# OCCUPATION_OPTIONS = ["Tech", "Healthcare", "Creative", "Retail", "Education", "Finance", "Other"]

# # Personality Profile Options (MBTI Types with corrected distribution)
# MBTI_TYPES = {
#     "ISTJ": 0.12, "ISFJ": 0.14, "INFJ": 0.02, "INTJ": 0.02, # Corrected ISFJ from 0.13 to 0.14
#     "ISTP": 0.05, "ISFP": 0.09, "INFP": 0.04, "INTP": 0.03,
#     "ESTP": 0.04, "ESFP": 0.09, "ENFP": 0.08, "ENTP": 0.03,
#     "ESTJ": 0.09, "ESFJ": 0.12, "ENFJ": 0.02, "ENTJ": 0.02
# }

# # Financial Options
# ROLES = ["Seeker", "Lister"]
# BUDGET_RANGE = (500, 2500) # Min and max rent/budget

# # --- Main Data Generation Function ---

# def generate_profiles(num_records):
#     """Generates a DataFrame of synthetic user profiles."""
#     data = {
#         'cleanliness': np.random.choice(CLEANLINESS_RANGE, num_records, p=[0.1, 0.2, 0.4, 0.2, 0.1]),
#         'sleep_schedule': np.random.choice(SLEEP_SCHEDULE_OPTIONS, num_records, p=[0.4, 0.3, 0.3]),
#         'noise_level': np.random.choice(NOISE_LEVEL_RANGE, num_records, p=[0.3, 0.3, 0.2, 0.1, 0.1]),
#         'guest_frequency': np.random.choice(GUEST_FREQUENCY_OPTIONS, num_records, p=[0.5, 0.4, 0.1]),
#         'social_level': np.random.choice(SOCIAL_LEVEL_OPTIONS, num_records, p=[0.2, 0.5, 0.3]),
#         'smoking': np.random.choice(SMOKING_OPTIONS, num_records, p=[0.7, 0.2, 0.1]),
#         'has_pets': np.random.choice([True, False], num_records, p=[0.2, 0.8]),
#         'gender_preference': np.random.choice(GENDER_PREFERENCE_OPTIONS, num_records, p=[0.3, 0.3, 0.4]),
#         'work_schedule': np.random.choice(WORK_SCHEDULE_OPTIONS, num_records, p=[0.4, 0.1, 0.3, 0.2]),
#         'occupation': np.random.choice(OCCUPATION_OPTIONS, num_records, p=[0.25, 0.15, 0.15, 0.1, 0.1, 0.1, 0.15]),
#         'mbti_type': np.random.choice(list(MBTI_TYPES.keys()), num_records, p=list(MBTI_TYPES.values())),
#         'role': np.random.choice(ROLES, num_records, p=[0.6, 0.4]),
#         'budget': np.random.randint(BUDGET_RANGE[0], BUDGET_RANGE[1], num_records)
#     }
#     return pd.DataFrame(data)

# # --- Generate and Save the Dataset ---

# if __name__ == "__main__":
#     print(f"Generating {NUM_PROFILES} synthetic user profiles...")
    
#     profiles_df = generate_profiles(NUM_PROFILES)
    
#     # Save the dataset to a CSV file
#     output_filename = "sharespace_profiles.csv"
#     profiles_df.to_csv(output_filename, index=False)
    
#     print(f"\n✅ Successfully created the dataset!")
#     print(f"   Saved {len(profiles_df)} records to '{output_filename}'")
#     print("\nHere's a preview of your data:")
#     print(profiles_df.head())

import pandas as pd
import numpy as np
import uuid

# --- Configuration ---
NUM_PROFILES = 5000

# --- Define the building blocks ---
CITIES = ["Metro City", "Suburbia", "Coastal Town", "Mountain Village"]
CLEANLINESS_RANGE = [1, 2, 3, 4, 5]
SLEEP_SCHEDULE_OPTIONS = ["Early Bird", "Night Owl", "Flexible"]
NOISE_LEVEL_RANGE = [1, 2, 3, 4, 5]
GUEST_FREQUENCY_OPTIONS = ["Rarely", "Occasionally", "Frequently"] # <-- THIS WAS MISSING
SOCIAL_LEVEL_OPTIONS = ["Keep to self", "Friendly but independent", "Very social / Friends"]
SMOKING_OPTIONS = ["Non-Smoker", "Smokes Outside", "Smokes Inside"]
GENDER_PREFERENCE_OPTIONS = ["Male", "Female", "No Preference"]
WORK_SCHEDULE_OPTIONS = ["9-to-5", "Shift Work", "Remote / WFH", "Student"]
OCCUPATION_OPTIONS = ["Tech", "Healthcare", "Creative", "Retail", "Education", "Finance", "Other"]
MBTI_TYPES = {
    "ISTJ": 0.12, "ISFJ": 0.14, "INFJ": 0.02, "INTJ": 0.02,
    "ISTP": 0.05, "ISFP": 0.09, "INFP": 0.04, "INTP": 0.03,
    "ESTP": 0.04, "ESFP": 0.09, "ENFP": 0.08, "ENTP": 0.03,
    "ESTJ": 0.09, "ESFJ": 0.12, "ENFJ": 0.02, "ENTJ": 0.02
}
ROLES = ["Seeker", "Lister"]
BUDGET_RANGE = (500, 2500)

def generate_profiles(num_records):
    data = {
        'user_id': [str(uuid.uuid4()) for _ in range(num_records)],
        'city': np.random.choice(CITIES, num_records, p=[0.5, 0.25, 0.15, 0.1]),
        'cleanliness': np.random.choice(CLEANLINESS_RANGE, num_records, p=[0.1, 0.2, 0.4, 0.2, 0.1]),
        'sleep_schedule': np.random.choice(SLEEP_SCHEDULE_OPTIONS, num_records, p=[0.4, 0.3, 0.3]),
        'noise_level': np.random.choice(NOISE_LEVEL_RANGE, num_records, p=[0.3, 0.3, 0.2, 0.1, 0.1]),
        'guest_frequency': np.random.choice(GUEST_FREQUENCY_OPTIONS, num_records, p=[0.5, 0.4, 0.1]), # <-- ADDED BACK
        'social_level': np.random.choice(SOCIAL_LEVEL_OPTIONS, num_records, p=[0.2, 0.5, 0.3]),
        'smoking': np.random.choice(SMOKING_OPTIONS, num_records, p=[0.7, 0.2, 0.1]),
        'has_pets': np.random.choice([True, False], num_records, p=[0.2, 0.8]),
        'gender_preference': np.random.choice(GENDER_PREFERENCE_OPTIONS, num_records, p=[0.3, 0.3, 0.4]),
        'work_schedule': np.random.choice(WORK_SCHEDULE_OPTIONS, num_records, p=[0.4, 0.1, 0.3, 0.2]),
        'occupation': np.random.choice(OCCUPATION_OPTIONS, num_records, p=[0.25, 0.15, 0.15, 0.1, 0.1, 0.1, 0.15]),
        'mbti_type': np.random.choice(list(MBTI_TYPES.keys()), num_records, p=list(MBTI_TYPES.values())),
        'role': np.random.choice(ROLES, num_records, p=[0.6, 0.4]),
        'budget': np.random.randint(BUDGET_RANGE[0], BUDGET_RANGE[1], num_records)
    }
    return pd.DataFrame(data)

if __name__ == "__main__":
    print(f"Generating {NUM_PROFILES} synthetic user profiles...")
    profiles_df = generate_profiles(NUM_PROFILES)
    
    # Define the final, full column order
    column_order = [
        "user_id", "role", "city", "budget", "cleanliness", "noise_level",
        "sleep_schedule", "guest_frequency", "smoking", "social_level", "has_pets", # <-- guest_frequency included
        "gender_preference", "work_schedule", "occupation", "mbti_type"
    ]
    profiles_df = profiles_df[column_order]

    output_filename = "sharespace_profiles.csv"
    profiles_df.to_csv(output_filename, index=False)
    
    print(f"\n✅ Successfully created the dataset with all 15 columns!")
    print(f"   Saved {len(profiles_df)} records to '{output_filename}'")
    print("\nHere's a preview of your final data:")
    print(profiles_df.head())