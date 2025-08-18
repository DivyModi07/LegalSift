from rest_framework import serializers
from .models import IPCSectionDB

class IPCSectionSerializer(serializers.ModelSerializer):
    """
    Serializer for the IPCSectionDB model to convert it to JSON format.
    """
    class Meta:
        model = IPCSectionDB
        fields = '__all__'