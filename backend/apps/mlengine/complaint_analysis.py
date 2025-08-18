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
    """
    Loads all ML models into the global ml_models dictionary.
    This is done once, on the first API request, for efficiency.
    """
    global ml_models
    print("🧠 Loading the definitive, high-accuracy model set...")
    try:
        # Load the classifier pipelines
        ml_models["urgency_pipeline"] = joblib.load(os.path.join(MODELS_DIR, 'urgency_classifier.joblib'))
        ml_models["category_pipeline"] = joblib.load(os.path.join(MODELS_DIR, 'category_classifier.joblib'))
        
        # Load the recommendation engine models
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
    Orchestrates the entire ML pipeline to analyze a user's complaint,
    providing predictions for urgency, category, and relevant IPC sections.
    """
    with model_lock:
        if ml_models["urgency_pipeline"] is None:
            load_models()
    
    if ml_models["urgency_pipeline"] is None:
        return {"error": "ML models could not be loaded. Please check server logs."}

    # Part 1: Robust Classifiers
    # The pipelines take raw, uncleaned text and handle all preprocessing.
    predicted_urgency = ml_models["urgency_pipeline"].predict([complaint_text])[0]
    predicted_category = ml_models["category_pipeline"].predict([complaint_text])[0]

    # Part 2: High-Confidence Semantic Recommendation
    cleaned_complaint = clean_text(complaint_text)
    complaint_embedding = ml_models["semantic_model"].encode(cleaned_complaint).reshape(1, -1)
    
    # Search for more initial candidates (k=10) to filter from
    distances, indices = ml_models["faiss_index"].search(complaint_embedding.astype('float32'), k=10)
    
    # Convert distances to a more intuitive similarity score (0 to 1)
    similarity_scores = 1 / (1 + distances[0])
    
    # ** THE CONFIDENCE FILTER **
    CONFIDENCE_THRESHOLD = 0.6 # Only show results that are at least 60% similar
    
    high_confidence_indices = []
    for i, idx in enumerate(indices[0]):
        if similarity_scores[i] >= CONFIDENCE_THRESHOLD:
            high_confidence_indices.append(idx)

    # If no results meet the threshold, return the top 2 as a fallback
    if not high_confidence_indices:
        high_confidence_indices = indices[0][:10]
        
    recommendations = ml_models["df_lookup"].iloc[high_confidence_indices]
    
    # Part 3: Format Output
    analysis_result = {
        "predicted_urgency": predicted_urgency,
        "predicted_category": predicted_category,
        "recommended_sections": recommendations[['section_number', 'title', 'short_description']].to_dict(orient='records')
    }
    
    return analysis_result