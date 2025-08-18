# import pandas as pd
# from rest_framework import status
# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from rest_framework.generics import ListAPIView
# from rest_framework.filters import SearchFilter
# from django.db.models import Q
# from .serializers import IPCSectionSerializer
# from .models import IPCSectionDB

# from .rag_engine import ask

# # Rag Chat API View
# @api_view(["POST"])
# def chat(request):
#     query = request.data.get("query", "")
#     if not query:
#         return Response({"error": "query field required"}, status=status.HTTP_400_BAD_REQUEST)
#     return Response(ask(query))


# # IPC Explorer API View 
# class IPCSectionListView(ListAPIView):
#     """
#     API view to list and search all IPC sections from the database.
#     """
#     queryset = IPCSectionDB.objects.all()
#     serializer_class = IPCSectionSerializer
#     filter_backends = [SearchFilter]
#     search_fields = ['section_number', 'title', 'short_description', 'mapped_category', 'full_legal_text']

#     def get_queryset(self):
#         # Allow filtering by category and search term
#         queryset = super().get_queryset()
#         category = self.request.query_params.get('category')
#         search_term = self.request.query_params.get('search')
        
#         if category and category != 'all':
#             queryset = queryset.filter(mapped_category__iexact=category)
        
#         if search_term:
#             queryset = queryset.filter(Q(section_number__icontains=search_term) | Q(title__icontains=search_term) | 
#             Q(short_description__icontains=search_term) | Q(mapped_category__icontains=search_term)
#             )

#         return queryset

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.filters import SearchFilter
from django.db.models import Q
from .serializers import IPCSectionSerializer
from .models import IPCSectionDB

# Import the new, memory-enabled RAG function
from .rag_engine import ask_with_memory

# ==============================================================================
# UPDATED: RAG Chatbot API View with Memory
# ==============================================================================
class RAGChatbotView(APIView):
    """
    An API endpoint for the conversational RAG chatbot.
    It uses the user's session to maintain chat history.
    """
    def post(self, request, *args, **kwargs):
        query = request.data.get('query', None)
        if not query:
            return Response(
                {"error": "The 'query' field is required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # 1. Get the chat history from the user's session, or start a new one
            chat_history = request.session.get('rag_chat_history', [])

            # 2. Call the new RAG function with the query and history
            result = ask_with_memory(query, chat_history)
            
            # 3. Update the chat history with the new question and answer
            chat_history.append((query, result["answer"]))
            
            # 4. Save the updated history back to the session
            request.session['rag_chat_history'] = chat_history
            
            return Response(result, status=status.HTTP_200_OK)
        
        except Exception as e:
            # Add more detailed error logging for debugging
            print(f"RAG Chatbot Error: {e}")
            return Response(
                {"error": "An error occurred while processing your request."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# ==============================================================================
# UNCHANGED: IPC Explorer API View 
# ==============================================================================
class IPCSectionListView(ListAPIView):
    """
    API view to list and search all IPC sections from the database.
    """
    queryset = IPCSectionDB.objects.all()
    serializer_class = IPCSectionSerializer
    filter_backends = [SearchFilter]
    search_fields = ['section_number', 'title', 'short_description', 'mapped_category', 'full_legal_text']

    def get_queryset(self):
        queryset = super().get_queryset()
        category = self.request.query_params.get('category')
        search_term = self.request.query_params.get('search')
        
        if category and category != 'all':
            queryset = queryset.filter(mapped_category__iexact=category)
        
        if search_term:
            queryset = queryset.filter(
                Q(section_number__icontains=search_term) | 
                Q(title__icontains=search_term) | 
                Q(short_description__icontains=search_term) | 
                Q(mapped_category__icontains=search_term)
            )

        return queryset