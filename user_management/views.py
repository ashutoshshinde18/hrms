from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
from django.conf import settings
from .models import CustomUser
from .serializers import UserSerializer
from django.contrib.auth import authenticate, get_user_model
from django.shortcuts import redirect
import uuid
import requests

User = get_user_model()

class SignUpAPIView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            # Create the user but set them as inactive initially
            user = serializer.save(is_active=False, email_verification_code=uuid.uuid4())
            
            # Send verification email
            verification_link = f"{settings.FRONTEND_URL}/verify-email/{user.email_verification_code}/"
            send_mail(
                'Verify your email',
                f"Click the link to verify your email: {verification_link}",
                settings.EMAIL_HOST_USER,
                [user.email],
                fail_silently=False,
            )
            
            return Response({"message": "Signup successful. Please check your email to verify your account."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyEmailView(APIView):
    def get(self, request, verification_code, *args, **kwargs):
        try:
            user = CustomUser.objects.get(email_verification_code=verification_code)
            if user.is_active:
                return Response({"message": "Your email is already verified."}, status=status.HTTP_200_OK)
            
            user.is_active = True
            user.verification_code = None  # Clear verification code after activation
            user.save()
            return Response({"message": "Email verification successful!"}, status=status.HTTP_200_OK)
        except CustomUser.DoesNotExist:
            return Response({"error": "Invalid or expired verification code."}, status=status.HTTP_400_BAD_REQUEST)

class LoginAPIView(APIView):
    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({"error": "Email and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, username=email, password=password)

        if user:
            if user.is_active:
                # Return a successful login response along with the user email
                return Response({
                    "message": "Login successful.",
                    "useremail": user.email
                }, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Account is inactive. Please verify your email."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"error": "Invalid email or password."}, status=status.HTTP_401_UNAUTHORIZED)

class GoogleAuthCallbackAPIView(APIView):
    def get(self, request, *args, **kwargs):
        code = request.GET.get("code")
        if not code:
            return Response({"error": "No code provided"}, status=status.HTTP_400_BAD_REQUEST)

        token_url = "https://oauth2.googleapis.com/token"
        token_data = {
            "code": code,
            "client_id": settings.SOCIAL_AUTH_GOOGLE_OAUTH2_KEY,
            "client_secret": settings.SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET,
            "redirect_uri": "http://localhost:8000/user-management/api/auth/google/callback",
            "grant_type": "authorization_code",
        }
        token_headers = {"Content-Type": "application/x-www-form-urlencoded"}

        # Exchange authorization code for access token
        token_response = requests.post(token_url, data=token_data, headers=token_headers)
        token_response_data = token_response.json()
        print('token response data: ',token_response_data)

        if "error" in token_response_data:
            return Response({"error": token_response_data.get("error")}, status=status.HTTP_400_BAD_REQUEST)

        access_token = token_response_data.get("access_token")
        print('access token: ',access_token)

        # Retrieve user information from Google
        user_info_url = "https://www.googleapis.com/oauth2/v1/userinfo"
        user_info_params = {"alt": "json", "access_token": access_token}
        user_info_response = requests.get(user_info_url, params=user_info_params)
        user_data = user_info_response.json()
        print('user data: ',user_data)

        user_email = user_data.get("email")
        user_name = user_data.get("name")

        if not user_email:
            return Response({"error": "Unable to retrieve email from Google."}, status=status.HTTP_400_BAD_REQUEST)

        # Check if user exists, if not, create a new user
        user, created = User.objects.get_or_create(email=user_email, defaults={"email": user_email, "is_active": True})
        print('user: ',user)

        if created:
            user.set_unusable_password()  # Prevent logging in with a password
            user.save()

        # # Optionally, generate a session or JWT token for the user
        # return Response(
        #     {
        #         "message": "Login successful.",
        #         "useremail": user.email,
        #         "new_user": created,
        #     },
        #     status=status.HTTP_200_OK,
        # )
        return redirect(f"http://localhost:3000/dashboard")