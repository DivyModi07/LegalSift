# location: backend/apps/users/urls.py

from django.urls import path
from .views import (UserRegistrationView, UserLoginView, send_otp_email, verify_otp, reset_password,check_email_phone) 
from rest_framework_simplejwt.views import TokenRefreshView

# This list MUST be named 'urlpatterns'
urlpatterns = [
    # Core Authentication Routes
    path('register/', UserRegistrationView.as_view(), name='user-register'),
    path('login/', UserLoginView.as_view(), name='user-login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),

    # Utility and Password Reset Routes
    path('check-email-phone/', check_email_phone, name='check-email-phone'),
    path('send-otp/', send_otp_email, name='send-otp'),
    path('verify-otp/', verify_otp, name='verify-otp'),
    path('reset-password/', reset_password, name='reset-password'),
]