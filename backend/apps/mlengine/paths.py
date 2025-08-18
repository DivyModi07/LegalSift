from pathlib import Path

# Base: .../backend
BACKEND_DIR = Path(__file__).resolve().parents[2]

# rag_data base
RAG_DIR     = BACKEND_DIR / "rag_data"
CORPUS_DIR  = RAG_DIR / "corpus"
EMBED_DIR   = RAG_DIR / "embeddings"

# Ensure embeddings folder exists
EMBED_DIR.mkdir(parents=True, exist_ok=True)
