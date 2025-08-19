import joblib
from django.conf import settings

def load_pipeline():
    try:
        model_path = settings.BASE_DIR / 'roommate_matcher_pipeline.pkl'
        return joblib.load(model_path)
    except FileNotFoundError:
        return None

pipeline = load_pipeline()
