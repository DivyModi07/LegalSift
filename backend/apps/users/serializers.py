from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.utils import timezone

# Get the CustomUser model you defined in models.py
User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'phone_number', 'password')

    def create(self, validated_data):
        # This now correctly calls your new CustomUserManager
        user = User.objects.create_user(**validated_data)
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Customizes the JWT token response to include last login time.
    """
    def validate(self, attrs):
        # The parent class's validate method handles the authentication
        data = super().validate(attrs)

        # Update the last_login timestamp for the user
        self.user.last_login = timezone.now()
        self.user.save(update_fields=["last_login"])

        return data