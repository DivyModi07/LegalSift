from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .rag_engine import ask

@api_view(["POST"])
def chat(request):
    query = request.data.get("query", "")
    if not query:
        return Response({"error": "query field required"}, status=status.HTTP_400_BAD_REQUEST)
    return Response(ask(query))
