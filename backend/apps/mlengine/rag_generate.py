import os
import pandas as pd
from langchain_community.document_loaders import PyPDFLoader, DataFrameLoader, TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from .paths import CORPUS_DIR, EMBED_DIR

# ==============================================================================
# PART 1: LOAD DATA FROM ALL SOURCES IN THE CORPUS DIRECTORY
# ==============================================================================
all_docs = []
supported_files = ['.pdf', '.csv', '.txt']

print(f"📚 Loading all supported documents from: {CORPUS_DIR}")

# --- Iterate through all files in the corpus directory ---
for filename in os.listdir(CORPUS_DIR):
    file_path = os.path.join(CORPUS_DIR, filename)
    
    try:
        if filename.endswith('.pdf'):
            print(f"  📄 Loading PDF: {filename}")
            loader = PyPDFLoader(file_path)
            docs = loader.load()
            all_docs.extend(docs)
            print(f"     - Loaded {len(docs)} pages.")

        elif filename.endswith('.csv'):
            print(f"  📄 Loading CSV: {filename}")
            df = pd.read_csv(file_path)
            # Use the 'full_legal_text' as the main content for the RAG model
            # This can be changed to whatever column is most relevant in your CSVs
            loader = DataFrameLoader(df, page_content_column="full_legal_text")
            docs = loader.load()
            all_docs.extend(docs)
            print(f"     - Loaded {len(docs)} documents.")

    except Exception as e:
        print(f"  - ❌ Error loading {filename}: {e}")

if not all_docs:
    print("\n❌ No documents were successfully loaded. Please check the files in the corpus directory.")
    exit()

print(f"\n✅ Total documents loaded: {len(all_docs)}")

# ==============================================================================
# PART 2: PROCESS AND EMBED THE COMBINED DATA
# ==============================================================================

# --- Split into chunks ---
splitter = RecursiveCharacterTextSplitter(chunk_size=1024, chunk_overlap=200)
chunks = splitter.split_documents(all_docs)
print(f"✂️  Split into {len(chunks)} chunks.")

# --- Create Embeddings ---
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

# --- Build and Save FAISS Index ---
print("🧠 Building new, combined FAISS index...")
vectordb = FAISS.from_documents(chunks, embeddings)
vectordb.save_local(str(EMBED_DIR))
print(f"✅✅✅ Perfect RAG knowledge base saved to {EMBED_DIR}")
