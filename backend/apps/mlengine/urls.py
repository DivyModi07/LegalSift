from django.urls import path
from .views import RAGChatbotView, IPCSectionListView

urlpatterns = [
    # This URL now points to the new RAGChatbotView
    path('chat/', RAGChatbotView.as_view(), name='rag-chatbot'),
    
    # This URL for the IPC Explorer remains unchanged
    path('ipc/', IPCSectionListView.as_view(), name='ipc-section-list'),
]