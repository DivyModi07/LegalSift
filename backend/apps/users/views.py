from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.utils import timezone
import random

from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer
from django.conf import settings

# Get your custom user model
User = get_user_model()

# --- Core Authentication Views (Class-Based) ---

class UserRegistrationView(generics.CreateAPIView):
    """
    Handles new user registration.
    Uses the UserSerializer to create a user with a hashed password.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny] # Anyone can access this view to register

    def create(self, request, *args, **kwargs):
        # Check if OTP was verified for this email
        email = request.data.get('email')
        if not request.session.get('otp_verified') or request.session.get('registration_email') != email:
            return Response(
                {"error": "Please verify your OTP before registration."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Proceed with registration
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        # Clear OTP session data after successful registration
        request.session.pop('otp_verified', None)
        request.session.pop('registration_email', None)
        request.session.pop('otp', None)
        request.session.pop('otp_email', None)
        request.session.pop('otp_time', None)
        
        # Return response with tokens and user data
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'phone_number': user.phone_number,
                'role': 'user',  # New registrations are always regular users
            }
        }, status=status.HTTP_201_CREATED)

class UserLoginView(APIView):
    """
    Handles user login and returns JWT tokens.
    """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({"error": "Email and password are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        if user.check_password(password):
            # Update last login time
            user.last_login = timezone.now()
            user.save(update_fields=["last_login"])

            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            
            # SIMPLIFIED: Every logged-in user is now considered a 'user'
            role = 'user'
            
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'phone_number': user.phone_number,
                    'role': role,
                }
            }, status=status.HTTP_200_OK)
        
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


# --- Utility Views (Function-Based) ---

@api_view(['POST'])
@permission_classes([AllowAny])
def check_email_phone(request):
    """
    Checks if an email or phone number already exists in the database.
    """
    email = request.data.get('email')
    phone = request.data.get('phone_number')

    errors = {}
    if email and User.objects.filter(email=email).exists():
        errors['email'] = "Email already exists."
    if phone and User.objects.filter(phone_number=phone).exists():
        errors['phone'] = "Phone number already exists."

    if errors:
        return Response(errors, status=status.HTTP_400_BAD_REQUEST)
    return Response({"message": "Available"}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def send_otp_email(request):
    email = request.data.get("email")
    if not email:
        return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

    otp = random.randint(100000, 999999)
    request.session['otp'] = str(otp)
    request.session['otp_email'] = email
    request.session['otp_time'] = timezone.now().isoformat()

    # --- UPDATED MESSAGE ---
    subject = f"Your Verification Code for LegalSift: {otp}"
    message = f"""
Hello,

Your One-Time Password (OTP) for LegalSift is:

{otp}

This code is valid for 10 minutes. Please use it to complete your verification process.

If you did not request this code, please ignore this email for your security.

Thank you,
The LegalSift Team
"""

    try:
        send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [email])
    except Exception as e:
        print(f"Email sending failed: {e}")
        return Response({"error": "Failed to send email due to a server error."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    response_data = {"message": "An OTP has been sent to your email address."}
    if settings.DEBUG:
        response_data["dev_otp"] = otp
    return Response(response_data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp(request):
    """
    Verifies the OTP submitted by the user.
    """
    email = request.data.get("email")
    otp_entered = request.data.get("otp")

    stored_email = request.session.get('otp_email')
    stored_otp = request.session.get('otp')
    stored_otp_time = request.session.get('otp_time')

    if not all([stored_email, stored_otp, stored_otp_time]):
        return Response({"error": "Session expired or OTP not sent. Please request a new one."}, status=status.HTTP_400_BAD_REQUEST)

    # Check OTP expiry (10 minutes)
    otp_time = timezone.datetime.fromisoformat(stored_otp_time)
    if (timezone.now() - otp_time).total_seconds() > 600:
        request.session.flush()
        return Response({"error": "OTP has expired. Please request a new one."}, status=status.HTTP_400_BAD_REQUEST)

    if email != stored_email or str(otp_entered) != str(stored_otp):
        return Response({"error": "Invalid OTP."}, status=status.HTTP_400_BAD_REQUEST)
    
    request.session['otp_verified'] = True
    request.session['registration_email'] = email
    
    return Response({"message": "OTP verified successfully."})


@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request):
    """
    Resets the user's password after a successful OTP verification.
    """
    email = request.data.get("email")
    new_password = request.data.get("new_password")
    
    if not request.session.get('otp_verified') or request.session.get('otp_email') != email:
        return Response({"error": "Please verify your OTP before resetting the password."}, status=status.HTTP_403_FORBIDDEN)

    if not new_password:
        return Response({"error": "New password is required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)
        user.set_password(new_password)
        user.save()
        
        request.session.flush()
        
        return Response({"message": "Password reset successful."}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
