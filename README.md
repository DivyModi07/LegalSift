# ⚖️ LegalSift - AI-Powered Legal Assistant

<div align="center">

[![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Django](https://img.shields.io/badge/Django-5.2.3-092E20?style=for-the-badge&logo=django&logoColor=white)](https://djangoproject.com/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![LangChain](https://img.shields.io/badge/LangChain-0.3.27-1C3C3C?style=for-the-badge&logo=langchain&logoColor=white)](https://langchain.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13+-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![FAISS](https://img.shields.io/badge/FAISS-Vector-00D4AA?style=for-the-badge&logo=vector-database&logoColor=white)](https://faiss.ai/)
[![HuggingFace](https://img.shields.io/badge/HuggingFace-Transformers-FF6B6B?style=for-the-badge&logo=huggingface&logoColor=white)](https://huggingface.co/)
[![Mistral](https://img.shields.io/badge/Mistral-7B-FF6B35?style=for-the-badge&logo=openai&logoColor=white)](https://mistral.ai/)


</div>

---


## 🎯 Overview

**LegalSift** is a cutting-edge AI-powered legal assistance platform designed specifically for Indian law. It combines the power of modern web technologies with advanced AI to provide citizens with accessible, accurate, and instant legal guidance.

### 🎯 Mission
To democratize legal knowledge and make Indian law accessible to every citizen through intelligent AI assistance.

### 🎯 Vision
Become the go-to platform for legal guidance, complaint analysis, and IPC exploration in India.

---

## ✨ Features

### 🔍 **AI-Powered Complaint Analysis**
- **Instant Legal Analysis**: Upload your complaint and get immediate AI-powered analysis
- **IPC Section Identification**: Automatically identifies relevant Indian Penal Code sections
- **Urgency Assessment**: Determines the priority level of your legal matter
- **Actionable Recommendations**: Provides clear next steps and legal guidance

### 📚 **Comprehensive IPC Explorer**
- **Complete IPC Database**: Access to the entire Indian Penal Code
- **Intelligent Search**: Find relevant sections using natural language queries
- **Categorized Sections**: Organized by crime types and severity
- **Detailed Explanations**: Plain-language explanations of complex legal terms

### 🤖 **Legal Assistant Chatbot**
- **24/7 Availability**: Get instant answers to legal questions anytime
- **Context-Aware Responses**: Understands conversation history for better assistance
- **Source Citations**: Always provides references to relevant legal documents
- **Multi-language Support**: Available in English and Hindi

### 👥 **User Management System**
- **Secure Authentication**: JWT-based authentication for secure access
- **Multi-step Registration**: Email verification with OTP for enhanced security
- **Password Recovery**: Secure password reset functionality
- **Profile Management**: Comprehensive user profile and settings
- **Complaint History**: Track and manage your submitted complaints
- **Personal Dashboard**: View your legal journey and AI analysis results

---

## 🖼️ Screenshots

### 🏠 Landing Page
![Landing Page](assets/readme/LandingPage.png)

*Clean, modern interface showcasing AI-powered legal assistance*

### 🔐 Authentication
![Login Page](assets/readme/LoginPage.png)

*Secure login with email verification and password recovery*

### 📊 User Dashboard
![User Dashboard](assets/readme/UserDashboard.png)

*Personal dashboard for managing your legal complaints and AI analysis*

### 📝 Complaint Submission
![Complaint Form](assets/readme/SubmitComplaint.png)

*Intuitive complaint submission with real-time AI analysis*

### 🤖 AI Chatbot
![Chatbot Interface](assets/readme/Chatbot.png)

*Interactive chatbot providing instant legal guidance*

---

## 🏗️ Architecture

```mermaid
graph TB
    subgraph "Frontend (React + Vite)"
        A[Landing Page] --> B[Authentication]
        B --> C[User Dashboard]
        C --> D[Complaint Submission]
        C --> E[IPC Explorer]
        C --> F[AI Chatbot]
        C --> G[Profile Management]
    end
    
    subgraph "Backend (Django REST)"
        H[User Management] --> I[Authentication API]
        J[Complaint API] --> K[AI Analysis Engine]
        L[IPC API] --> M[Search Engine]
        N[Chatbot API] --> O[RAG Engine]
        P[Profile API] --> Q[User Data Management]
    end
    
    subgraph "AI Components"
        R[LangChain] --> S[FAISS Vector Store]
        T[HuggingFace Embeddings] --> S
        U[Mistral 7B] --> V[Conversational AI]
        W[PDF Processing] --> X[Knowledge Base]
    end
    
    subgraph "Database"
        Y[PostgreSQL] --> Z[User Data]
        Y --> AA[Complaint Records]
        Y --> BB[System Logs]
    end
    
    A --> H
    D --> J
    E --> L
    F --> N
    K --> R
    M --> T
    O --> U
    H --> Y
```

---

## 🛠️ Installation

### Prerequisites

- **Python 3.11+**
- **Node.js 18+**
- **PostgreSQL 13+**
- **Git**

### 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/DivyModi07/LegalSift.git
   cd LegalSift
   ```

2. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py createsuperuser
   python manage.py runserver
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the Application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:8000`

### 🔧 Environment Configuration

Create a `.env` file in the backend directory:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/legalsift

# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# AI Model Configuration
OPENAI_API_KEY=your-openai-api-key
HUGGINGFACE_API_KEY=your-huggingface-api-key

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

---

## 🚀 Usage

### 👤 For Users

1. **Registration**: Create an account with email verification
2. **Submit Complaint**: Describe your legal issue for AI analysis
3. **Explore IPC**: Search and browse Indian Penal Code sections
4. **Chat with AI**: Get instant answers to legal questions
5. **Track Progress**: Monitor your complaints and legal journey
6. **Personal Dashboard**: View your complaint history and AI analysis results
7. **Profile Management**: Update your personal information and settings

---

## 🔧 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/users/register/` | User registration |
| `POST` | `/api/users/login/` | User login |
| `POST` | `/api/users/send-otp/` | Send OTP for verification |
| `POST` | `/api/users/verify-otp/` | Verify OTP |
| `POST` | `/api/users/reset-password/` | Reset password |

### Complaint Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/complaints/` | Submit new complaint |
| `GET` | `/api/complaints/` | List user complaints |
| `GET` | `/api/complaints/{id}/` | Get complaint details |

### AI Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/mlengine/chat/` | Chat with AI assistant |
| `POST` | `/api/mlengine/analyze/` | Analyze complaint |
| `GET` | `/api/mlengine/ipc-search/` | Search IPC sections |

---

## 🤖 AI Components

### 🧠 RAG (Retrieval-Augmented Generation) System

- **Vector Database**: FAISS for efficient similarity search
- **Embeddings**: HuggingFace sentence-transformers for text encoding
- **Language Model**: Mistral 7B for generating responses
- **Knowledge Base**: Indian Penal Code and legal documents

### 🔍 Document Processing

- **PDF Parsing**: Extract text from legal documents
- **Text Chunking**: Split documents into manageable segments
- **Embedding Generation**: Create vector representations
- **Index Building**: Build searchable vector indices

### 💬 Conversational AI

- **Context Awareness**: Maintains conversation history
- **Source Attribution**: Provides references to legal sources
- **Response Validation**: Ensures accuracy and relevance
- **Multi-turn Support**: Handles complex, multi-part questions

---

## 📁 Project Structure

```
LegalSift/
├── 📁 backend/                    # Django Backend
│   ├── 📁 apps/
│   │   ├── 📁 users/             # User management
│   │   ├── 📁 complaints/        # Complaint handling
│   │   └── 📁 mlengine/          # AI/ML components
│   ├── 📁 backend/               # Django settings
│   └── 📁 rag_data/              # AI knowledge base
├── 📁 frontend/                   # React Frontend
│   ├── 📁 src/
│   │   ├── 📁 components/        # Reusable components
│   │   ├── 📁 pages/             # Page components
│   │   ├── 📁 services/          # API services
│   │   └── 📁 store/             # State management
│   └── 📁 public/                # Static assets
├── 📁 ml_workspace/              # ML development
└── 📄 requirements.txt           # Python dependencies
