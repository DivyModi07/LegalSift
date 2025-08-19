from rest_framework import serializers
from .models import Complaint

class ComplaintSerializer(serializers.ModelSerializer):
    """
    Serializer for the ComplaintHistory model.
    """
    class Meta:
        model = Complaint
        # The JSONField is handled automatically by DRF
        fields = [
            'id',
            'state',
            'city',
            'date_of_incident',
            'complaint_text',
            'predicted_urgency',
            'predicted_category',
            'recommended_sections',
            'created_at'
        ]