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

    # Define the improved prompt for the LLM
    prompt = PromptTemplate.from_template(
        """
        You are LegalSift, a specialized AI assistant expert in the Indian Penal Code (IPC). 
        Your sole purpose is to provide information based ONLY on the provided legal context about Indian law.

        **CRITICAL INSTRUCTIONS:**
        1. **Strictly On-Topic:** Analyze the user's 'QUESTION'. If it is NOT related to the Indian Penal Code or Indian law, you MUST decline to answer.
        2. **Mandatory Response for Off-Topic Questions:** For any off-topic question (e.g., about nutrition, sports, history, etc.), respond ONLY with: "I am a legal assistant focused on the Indian Penal Code and cannot answer questions outside of this scope."
        3. **Use Context Only:** If the question is on-topic, you MUST base your answer exclusively on the legal text provided in the 'CONTEXT' section below. Do not use any external knowledge.
        4. **Acknowledge Limits:** If the provided 'CONTEXT' does not contain the answer to a legal question, state that you do not have enough information in the provided documents to answer. Do not guess.
        5. **Be Concise:** Keep your answers direct and to the point.

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