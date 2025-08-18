import pandas as pd
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.generics import ListAPIView
from rest_framework.filters import SearchFilter
from django.db.models import Q
from .serializers import IPCSectionSerializer
from .models import IPCSectionDB

from .rag_engine import ask

# Rag Chat API View
@api_view(["POST"])
def chat(request):
    query = request.data.get("query", "")
    if not query:
        return Response({"error": "query field required"}, status=status.HTTP_400_BAD_REQUEST)
    return Response(ask(query))


# IPC Explorer API View 
class IPCSectionListView(ListAPIView):
    """
    API view to list and search all IPC sections from the database.
    """
    queryset = IPCSectionDB.objects.all()
    serializer_class = IPCSectionSerializer
    filter_backends = [SearchFilter]
    search_fields = ['section_number', 'title', 'short_description', 'mapped_category', 'full_legal_text']

    def get_queryset(self):
        # Allow filtering by category and search term
        queryset = super().get_queryset()
        category = self.request.query_params.get('category')
        search_term = self.request.query_params.get('search')
        
        if category and category != 'all':
            queryset = queryset.filter(mapped_category__iexact=category)
        
        if search_term:
            queryset = queryset.filter(Q(section_number__icontains=search_term) | Q(title__icontains=search_term) | 
            Q(short_description__icontains=search_term) | Q(mapped_category__icontains=search_term)
            )

        return queryset