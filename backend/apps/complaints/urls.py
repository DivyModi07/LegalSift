from django.urls import path
from .views import ComplaintAnalysisView, ComplaintHistoryView

urlpatterns = [
    path('analyze/', ComplaintAnalysisView.as_view(), name='analyze-complaint'),
    path('history/', ComplaintHistoryView.as_view(), name='complaint-history'),
]