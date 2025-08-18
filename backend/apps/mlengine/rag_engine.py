# from .paths import EMBED_DIR
# from langchain_community.vectorstores import FAISS
# from langchain_community.embeddings import HuggingFaceEmbeddings
# from langchain_openai.chat_models import ChatOpenAI
# from langchain.chains import RetrievalQA
# from langchain.prompts import PromptTemplate


# embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

# vectordb = FAISS.load_local(
#     str(EMBED_DIR),
#     embeddings=embedding_model,
#     allow_dangerous_deserialization=True,
# )

# prompt = PromptTemplate.from_template(
#     """
#     You are an assistant for Indian Penal Code (IPC) legal queries.
#     Use ONLY the following context to answer.

#     If the exact section is found, extract:
#     - Section Number
#     - Title
#     - Short Description
#     - Punishment
#     - Bailability
#     - Jurisdiction
#     - Summary (from full text)

#     If the section is not present in context, answer:
#     "This section is not available in the dataset."

#     Context:
#     {context}

#     Question: {question}
#     Answer:
#     """
# )


# retriever = vectordb.as_retriever(search_kwargs={"k": 4})

# # ✅ Use mistral-7b-instruct from OpenRouter
# llm = ChatOpenAI(
#     model="mistralai/mistral-7b-instruct",
#     temperature=0.1
# )

# qa_chain = RetrievalQA.from_chain_type(
#     llm=llm,
#     chain_type="stuff",
#     retriever=retriever,
#     chain_type_kwargs={"prompt": prompt},
# )

# def ask(query: str) -> dict:
#     return qa_chain({"query": query})


from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_openai import ChatOpenAI
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
from langchain.prompts import PromptTemplate
from .paths import EMBED_DIR

# --- LAZY LOADING SETUP ---
# We will load the models only when they are first needed.
rag_components = {
    "llm": None,
    "retriever": None,
    "memory": None
}

def _initialize_rag():
    """Loads and initializes all RAG components."""
    global rag_components
    print("🧠 Initializing RAG Chatbot Engine for the first time...")
    
    # 1. Load the Embedding Model and Vector Database
    embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    vectordb = FAISS.load_local(
        str(EMBED_DIR),
        embeddings=embedding_model,
        allow_dangerous_deserialization=True,
    )
    rag_components["retriever"] = vectordb.as_retriever(search_kwargs={"k": 5})

    # 2. Initialize the Language Model (LLM)
    rag_components["llm"] = ChatOpenAI(
        model="mistralai/mistral-7b-instruct",
        temperature=0.1
    )
    
    # 3. Initialize a new conversation memory
    # This will store the chat history.
    rag_components["memory"] = ConversationBufferMemory(
        memory_key="chat_history",
        return_messages=True,
        output_key='answer' # Specify the output key for the chain
    )
    print("✅ RAG Chatbot Engine initialized.")


# --- THE MAIN CHATBOT FUNCTION ---
def ask_with_memory(query: str, chat_history: list = []):
    """
    Answers a query using the RAG model, considering the chat history.
    """
    # Initialize the RAG components if they haven't been already
    if not rag_components["llm"]:
        _initialize_rag()

    # Create a new memory instance for each request, seeded with the provided history
    memory = ConversationBufferMemory(
        memory_key="chat_history",
        return_messages=True,
        output_key='answer'
    )
    for user_msg, ai_msg in chat_history:
        memory.chat_memory.add_user_message(user_msg)
        memory.chat_memory.add_ai_message(ai_msg)

    # Define the prompt for the LLM
    prompt = PromptTemplate.from_template(
        """
        You are an assistant for Indian Penal Code (IPC) legal queries.
        Use the following pieces of retrieved context and the chat history to answer the question.
        If you don't know the answer, just say that you don't know. Don't try to make up an answer.
        Keep the answer concise.

        CONTEXT: {context}
        CHAT HISTORY: {chat_history}
        QUESTION: {question}
        ANSWER:
        """
    )
    
    # Create the conversational chain
    qa_chain = ConversationalRetrievalChain.from_llm(
        llm=rag_components["llm"],
        retriever=rag_components["retriever"],
        memory=memory,
        return_source_documents=True,
        combine_docs_chain_kwargs={"prompt": prompt}
    )

    # Get the answer
    result = qa_chain({"question": query})
    
    # Format the response
    response = {
        "answer": result["answer"],
        "source_documents": [doc.metadata for doc in result["source_documents"]]
    }
    
    return response