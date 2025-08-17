from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

# Import our master analysis function from the mlengine app
from apps.mlengine.complaint_analysis import analyze_complaint

class ComplaintAnalysisView(APIView):
    """
    An API endpoint that accepts a complaint text via a POST request,
    analyzes it using the ML pipeline, and returns the analysis.
    """
    # Ensure that only authenticated (logged-in) users can access this endpoint
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        """
        Handles the POST request containing the complaint text.
        """
        # 1. Get the complaint text from the request data
        complaint_text = request.data.get('complaint_text', None)

        # 2. Validate the input
        if not complaint_text:
            return Response(
                {"error": "The 'complaint_text' field is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 3. Call the analysis function
        # This is where the magic happens! We pass the text to our ML pipeline.
        try:
            analysis_result = analyze_complaint(complaint_text)
            
            # Check if the ML models loaded correctly
            if "error" in analysis_result:
                 return Response(analysis_result, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # 4. Return the successful result
            return Response(analysis_result, status=status.HTTP_200_OK)

        except Exception as e:
            # Handle any unexpected errors during analysis
            print(f"Error during complaint analysis: {e}") # For logging
            return Response(
                {"error": "An unexpected error occurred during analysis."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )