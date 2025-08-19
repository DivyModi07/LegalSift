from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView

# Import the ML analysis function
from apps.mlengine.complaint_analysis import analyze_complaint

# Import your new model and serializer
from .models import Complaint
from .serializers import ComplaintSerializer

class ComplaintAnalysisView(APIView):
    """
    An API endpoint that accepts complaint details, analyzes them,
    and saves the complaint and its analysis to the database.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        """
        Handles the POST request with the complaint details.
        """
        # 1. Get data from the request
        data = request.data
        user = request.user

        # 2. Basic validation
        required_fields = ['state', 'city', 'dateOfIncident', 'complaint_text']
        if not all(field in data for field in required_fields):
            return Response(
                {"error": "Missing one or more required fields."},
                status=status.HTTP_400_BAD_REQUEST
            )

        complaint_text = data['complaint_text']

        try:
            # 3. Call the analysis function from the mlengine
            analysis_result = analyze_complaint(complaint_text)
            if "error" in analysis_result:
                return Response(analysis_result, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # 4. Create and save the Complaint instance
            Complaint.objects.create(
                user=user,
                state=data['state'],
                city=data['city'],
                date_of_incident=data['dateOfIncident'],
                complaint_text=complaint_text,
                predicted_urgency=analysis_result.get('predicted_urgency'),
                predicted_category=analysis_result.get('predicted_category'),
                # The JSONField handles the dictionary list directly
                recommended_sections=analysis_result.get('recommended_sections', [])
            )

            # 5. Return the analysis result to the frontend
            return Response(analysis_result, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Error during complaint analysis or saving: {e}") # For logging
            return Response(
                {"error": "An unexpected error occurred."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ComplaintHistoryView(ListAPIView):
    """
    An API endpoint that returns the complaint history for the authenticated user.
    """
    serializer_class = ComplaintSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        This view returns a list of all complaints filed by the
        currently authenticated user, ordered by the newest first.
        """
        return Complaint.objects.filter(user=self.request.user).order_by('-created_at')