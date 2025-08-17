from django.urls import path
from .views import ComplaintAnalysisView

urlpatterns = [
    # This creates the URL: /api/complaints/analyze/
    path('analyze/', ComplaintAnalysisView.as_view(), name='analyze-complaint'),
]