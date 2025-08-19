import joblib
import faiss
import pandas as pd
from sentence_transformers import SentenceTransformer
import os
import re
import threading

# --- CONFIGURATION ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, 'saved_models')

# --- LAZY LOADING SETUP ---
ml_models = {
    "urgency_pipeline": None,
    "category_pipeline": None,
    "faiss_index": None,
    "df_lookup": None,
    "semantic_model": None
}
model_lock = threading.Lock()

def load_models():
    """Loads all ML models into memory once, on the first request."""
    global ml_models
    print("🧠 Loading the definitive, high-accuracy model set...")
    try:
        ml_models["urgency_pipeline"] = joblib.load(os.path.join(MODELS_DIR, 'urgency_classifier.joblib'))
        ml_models["category_pipeline"] = joblib.load(os.path.join(MODELS_DIR, 'category_classifier.joblib'))
        ml_models["faiss_index"] = faiss.read_index(os.path.join(MODELS_DIR, 'faiss_index.index'))
        ml_models["df_lookup"] = pd.read_pickle(os.path.join(MODELS_DIR, 'ipc_data_for_index.pkl'))
        ml_models["semantic_model"] = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
        print("✅ Definitive model set loaded and ready.")
    except Exception as e:
        print(f"❌ Error loading models: {e}")
        ml_models = {key: None for key in ml_models}

def clean_text(text):
    """A robust function to clean raw text for semantic analysis."""
    if not isinstance(text, str):
        return ""
    text = text.replace('\\n', ' ').replace('\r', ' ')
    text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text.lower()

# --- THE MASTER ANALYSIS FUNCTION ---
def analyze_complaint(complaint_text: str):
    """
    Orchestrates the entire ML pipeline to analyze a user's complaint.
    """
    with model_lock:
        if ml_models["urgency_pipeline"] is None:
            load_models()
    
    if ml_models["urgency_pipeline"] is None:
        return {"error": "ML models could not be loaded. Please check server logs."}

    predicted_urgency = ml_models["urgency_pipeline"].predict([complaint_text])[0]
    predicted_category = ml_models["category_pipeline"].predict([complaint_text])[0]

    cleaned_complaint = clean_text(complaint_text)
    complaint_embedding = ml_models["semantic_model"].encode(cleaned_complaint).reshape(1, -1)
    
    distances, indices = ml_models["faiss_index"].search(complaint_embedding.astype('float32'), k=10)
    
    similarity_scores = 1 / (1 + distances[0])
    
    CONFIDENCE_THRESHOLD = 0.6
    
    high_confidence_indices = [idx for i, idx in enumerate(indices[0]) if similarity_scores[i] >= CONFIDENCE_THRESHOLD]

    if not high_confidence_indices:
        high_confidence_indices = indices[0][:5]
        
    recommendations = ml_models["df_lookup"].iloc[high_confidence_indices]
    
    # ** THE CHANGE IS HERE **
    # Instead of selecting specific columns, we now convert the entire DataFrame to a dictionary.
    analysis_result = {
        "predicted_urgency": predicted_urgency,
        "predicted_category": predicted_category,
        "recommended_sections": recommendations.to_dict(orient='records')
    }
    
    return analysis_result