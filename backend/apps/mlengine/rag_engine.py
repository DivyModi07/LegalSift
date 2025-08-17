# backend/apps/mlengine/rag_engine.py
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

from langchain_core.prompts import PromptTemplate
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_openai import ChatOpenAI
from langchain.chains import RetrievalQA

# --- Paths --------------------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent.parent  # …/backend
DATA_DIR = BASE_DIR / "rag_data"
INDEX_DIR = DATA_DIR / "embeddings"  # contains index.faiss / index.pkl

if not INDEX_DIR.exists():
    raise RuntimeError(
        f"FAISS index not found at {INDEX_DIR}. "
        f"Run the index builder (rag_generate.py) first."
    )

# --- Embeddings (must match what you used to build the index) -----------------
model_name = os.getenv("EMBED_MODEL", "sentence-transformers/all-mpnet-base-v2")
embeddings = HuggingFaceEmbeddings(model_name=model_name)

# Load FAISS
vectordb = FAISS.load_local(
    str(INDEX_DIR),
    embeddings=embeddings,
    allow_dangerous_deserialization=True,  # required by langchain_community FAISS
)

# --- Retrieval config: MMR for diverse, relevant chunks -----------------------
retriever = vectordb.as_retriever(
    search_type="mmr",
    search_kwargs={
        "k": 6,         # return top-6 final chunks to the LLM
        "fetch_k": 20,  # sample a larger pool for MMR to pick diverse results
    },
)

# --- Grounding prompt (small, strict, citation-friendly) ----------------------
prompt = PromptTemplate.from_template(
    """You are a legal assistant. Answer **only** using the provided context.
If the answer is not present, reply exactly: "I don’t see that section in the provided IPC data."

Requirements:
- Be concise and specific.
- Quote section numbers if present.
- Do not invent facts.

<context>
{context}
</context>

Question: {question}
Answer:"""
)

# --- LLM (OpenRouter via ChatOpenAI wrapper) ----------------------------------
# You can override via env: LLM_MODEL, OPENAI_API_KEY, OPENAI_API_BASE
llm = ChatOpenAI(
    model="mistralai/mistral-7b-instruct",
    openai_api_key=os.getenv("OPENAI_API_KEY"),
    openai_api_base=os.getenv("OPENAI_API_BASE"),
    temperature=0.2,
)



# --- Chain --------------------------------------------------------------------
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",  # with short, well-chosen chunks, "stuff" is effective
    retriever=retriever,
    chain_type_kwargs={"prompt": prompt},
    return_source_documents=True,
)

# --- Public entrypoint --------------------------------------------------------
def ask(query: str) -> dict:
    """
    Returns:
      {
        'answer': str,
        'sources': [
            {'source': 'file.pdf', 'page': 3, 'snippet': '...'}
        ]
      }
    """
    result = qa_chain(query)
    answer = (result.get("result") or "").strip()

    # Collect clean citations/snippets
    sources = []
    for doc in result.get("source_documents", []):
        meta = doc.metadata or {}
        src = {
            "source": meta.get("source", "unknown"),
            "page": int(meta.get("page", -1)),
            "snippet": (doc.page_content or "")[:500],  # trim for payload
        }
        sources.append(src)

    return {"answer": answer, "sources": sources}
