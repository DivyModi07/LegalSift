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
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
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
    phone = request.data.get('phone_number') # Ensure frontend sends 'phone_number'

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

    # Check if user exists
    user_exists = User.objects.filter(email=email).exists()

    # Generate OTP always (don’t leak existence info)
    otp = random.randint(100000, 999999)
    request.session['otp'] = str(otp)
    request.session['otp_email'] = email
    request.session['otp_time'] = timezone.now().isoformat()

    subject = "Your OTP for Password Reset"
    message = f"Your OTP is {otp}. It will expire in 10 minutes."

    print("DEBUG email received from request:", email)
    print("DEBUG sending FROM:", settings.DEFAULT_FROM_EMAIL)
    print("DEBUG sending TO:", [email])

    try:
        send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [email])
    except Exception as e:
        print(f"Email sending failed: {e}")
        return Response({"error": "Failed to send email due to a server error."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    response_data = {"message": "If an account with this email exists, an OTP has been sent."}
    if settings.DEBUG:
        response_data["dev_otp"] = otp  # only for dev testing
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
        # Clear expired OTP from session
        request.session.flush()
        return Response({"error": "OTP has expired. Please request a new one."}, status=status.HTTP_400_BAD_REQUEST)

    if email != stored_email or str(otp_entered) != str(stored_otp):
        return Response({"error": "Invalid OTP."}, status=status.HTTP_400_BAD_REQUEST)
    
    # Mark OTP as verified for the next step (password reset)
    request.session['otp_verified'] = True
    
    return Response({"message": "OTP verified successfully. You can now reset your password."})


@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request):
    """
    Resets the user's password after a successful OTP verification.
    """
    email = request.data.get("email")
    new_password = request.data.get("new_password")
    
    # Check if the OTP was actually verified in this session
    if not request.session.get('otp_verified') or request.session.get('otp_email') != email:
        return Response({"error": "Please verify your OTP before resetting the password."}, status=status.HTTP_403_FORBIDDEN)

    if not new_password:
        return Response({"error": "New password is required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)
        user.set_password(new_password)
        user.save()
        
        # Clear the session after successful password reset
        request.session.flush()
        
        return Response({"message": "Password reset successful."}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)