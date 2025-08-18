from .paths import EMBED_DIR
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_openai.chat_models import ChatOpenAI
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate


embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

vectordb = FAISS.load_local(
    str(EMBED_DIR),
    embeddings=embedding_model,
    allow_dangerous_deserialization=True,
)

prompt = PromptTemplate.from_template(
    """
    You are an assistant for Indian Penal Code (IPC) legal queries.
    Use ONLY the following context to answer.

    If the exact section is found, extract:
    - Section Number
    - Title
    - Short Description
    - Punishment
    - Bailability
    - Jurisdiction
    - Summary (from full text)

    If the section is not present in context, answer:
    "This section is not available in the dataset."

    Context:
    {context}

    Question: {question}
    Answer:
    """
)


retriever = vectordb.as_retriever(search_kwargs={"k": 4})

# ✅ Use mistral-7b-instruct from OpenRouter
llm = ChatOpenAI(
    model="mistralai/mistral-7b-instruct",
    temperature=0.1
)

qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=retriever,
    chain_type_kwargs={"prompt": prompt},
)

def ask(query: str) -> dict:
    return qa_chain({"query": query})
