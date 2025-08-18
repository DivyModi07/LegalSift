# # rag_generate.py
# import os
# import re
# from pathlib import Path

# import torch
# from langchain_huggingface import HuggingFaceEmbeddings
# from langchain_community.vectorstores import FAISS
# from langchain.text_splitter import RecursiveCharacterTextSplitter

# # Prefer PyMuPDFLoader, fallback to PyPDFLoader
# try:
#     from langchain_community.document_loaders import PyMuPDFLoader as PDFLoader
# except ImportError:
#     from langchain_community.document_loaders import PyPDFLoader as PDFLoader

# print("— RAG: Building FAISS index —")

# # --- Paths ---
# BASE_DIR = Path(__file__).resolve().parent.parent.parent
# DATA_DIR = BASE_DIR / "rag_data"
# CORPUS_DIR = DATA_DIR / "corpus"        # Place PDFs here
# EMBEDDINGS_DIR = DATA_DIR / "embeddings"
# EMBEDDINGS_DIR.mkdir(parents=True, exist_ok=True)

# # --- Load PDFs ---
# pdf_files = sorted(CORPUS_DIR.glob("*.pdf"))
# if not pdf_files:
#     raise SystemExit(f"[ERROR] No PDFs found in {CORPUS_DIR}")

# all_docs = []
# for pdf in pdf_files:
#     loader = PDFLoader(str(pdf))
#     docs = loader.load()
#     for i, d in enumerate(docs):
#         d.metadata = {"source": pdf.name, "page": d.metadata.get("page", i)}
#     all_docs.extend(docs)

# print(f"Loaded {len(all_docs)} pages from {len(pdf_files)} PDFs.")

# # --- Clean text ---
# def clean_text(text: str) -> str:
#     text = text.replace("\x00", " ").replace("\u200b", " ")
#     text = text.replace("\n", " ").strip()
#     text = re.sub(r'Page \d+\s*(of\s*\d+)?', ' ', text, flags=re.IGNORECASE)
#     text = re.sub(r'^\s*\d+\s*$', ' ', text, flags=re.MULTILINE)
#     text = re.sub(r'\s+', ' ', text)
#     return text.strip()

# for d in all_docs:
#     d.page_content = clean_text(d.page_content or "")

# # --- Split into legal-friendly chunks ---
# splitter = RecursiveCharacterTextSplitter(
#     chunk_size=1000,      # ~200 tokens per chunk
#     chunk_overlap=150,    # overlap ensures context continuity
# )
# chunks = splitter.split_documents(all_docs)
# print(f"Created {len(chunks)} chunks.")

# # --- Embeddings ---
# device = "cuda" if torch.cuda.is_available() else "cpu"
# print(f"Using device: {device}")

# model_name = os.getenv("EMBED_MODEL", "sentence-transformers/all-mpnet-base-v2")
# embeddings = HuggingFaceEmbeddings(
#     model_name=model_name,
#     model_kwargs={"device": device}
# )

# # --- Build and save FAISS ---
# print("Building FAISS index…")
# vectordb = FAISS.from_documents(chunks, embedding=embeddings)
# vectordb.save_local(str(EMBEDDINGS_DIR))
# print("✅ FAISS index saved to:", EMBEDDINGS_DIR)



from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from paths import CORPUS_DIR, EMBED_DIR

pdf_path = CORPUS_DIR / "IPC_Section.pdf"
print(f"📄 Loading {pdf_path.name}")
loader   = PyPDFLoader(str(pdf_path))
pages    = loader.load()

splitter = RecursiveCharacterTextSplitter(chunk_size=1024, chunk_overlap=200)
docs     = splitter.split_documents(pages)
print(f"✂️  {len(docs)} chunks")

embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
vectordb   = FAISS.from_documents(docs, embeddings)

vectordb.save_local(str(EMBED_DIR))
print(f"✅ Saved FAISS index to {EMBED_DIR}")
