from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.mail import send_mail
from django.conf import settings
from .models import CustomUser, PersonalInfo, ContactInfo, CompanyInfo, ProfessionalSummaryInfo, FinancialIdentityDetailsInfo
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.exceptions import AuthenticationFailed
from .serializers import UserSerializer, PersonalInfoSerializer, ContactInfoSerializer, CompanyInfoSerializer, ProfessionalSummaryInfoSerializer, FinancialIdentityDetailsSerializer
from django.contrib.auth import authenticate, get_user_model
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import redirect
import uuid
import requests
import logging
logger = logging.getLogger(__name__)

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
            user.is_email_verified = True
            user.email_verification_code = verification_code  # Clear verification code after activation

            user.save()
            return Response({"message": "Email verification successful!"}, status=status.HTTP_200_OK)
        except CustomUser.DoesNotExist:
            return Response({"error": "Invalid or expired verification code."}, status=status.HTTP_400_BAD_REQUEST)

class LoginAPIView(APIView):
    permission_classes = []
    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({"error": "Email and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, username=email, password=password)

        if user:
            if user.is_active:
                refresh = RefreshToken.for_user(user)
                response = Response({
                    "useremail": user.email,
                    "message": "Login successful."
                }, status=status.HTTP_200_OK)
                response.set_cookie("access", str(refresh.access_token), httponly=True, secure=True, samesite="Strict")
                response.set_cookie("refresh", str(refresh), httponly=True, secure=True, samesite="Strict")
                return response
            else:
                return Response({"error": "Account is inactive. Please verify your email."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"error": "Invalid email or password."}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutAPIView(APIView):
    def post(self, request, *args, **kwargs):
        response = Response({"message": "Logged out successfully"})
        response.delete_cookie("access")
        response.delete_cookie("refresh")
        return response

class RefreshTokenAPIView(APIView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get("refresh")
        if not refresh_token:
            return Response({"error": "Refresh token is missing"}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            refresh = RefreshToken(refresh_token)
            access_token = refresh.access_token
            response = Response({"message": "Token refreshed successfully"})
            response.set_cookie("access", str(access_token), httponly=True, secure=True, samesite="Strict")
            return response
        except Exception as e:
            return Response({"error": "Invalid or expired refresh token"}, status=status.HTTP_401_UNAUTHORIZED)

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
        logger.info(f'token response data: {token_response_data}')

        if "error" in token_response_data:
            return Response({"error": token_response_data.get("error")}, status=status.HTTP_400_BAD_REQUEST)

        access_token = token_response_data.get("access_token")
        logger.info(f'access token: {access_token}')

        # Retrieve user information from Google
        user_info_url = "https://www.googleapis.com/oauth2/v1/userinfo"
        user_info_params = {"alt": "json", "access_token": access_token}
        user_info_response = requests.get(user_info_url, params=user_info_params)
        user_data = user_info_response.json()
        logger.info(f'user data: {user_data}')

        user_email = user_data.get("email")
        user_name = user_data.get("name")

        if not user_email:
            return Response({"error": "Unable to retrieve email from Google."}, status=status.HTTP_400_BAD_REQUEST)

        # Check if user exists, if not, create a new user
        user, created = User.objects.get_or_create(email=user_email, defaults={"email": user_email, "is_active": True})

        if created:
            user.set_unusable_password()  # Prevent logging in with a password
            user.save()
        
        refresh = RefreshToken.for_user(user)
        response = redirect("http://localhost:3000")
        response.set_cookie("access", str(refresh.access_token), httponly=True, secure=True, samesite="Strict")
        response.set_cookie("refresh", str(refresh), httponly=True, secure=True, samesite="Strict")
        return response
    
class PersonalInfoView(APIView):
    permission_classes = [IsAuthenticated]

    @csrf_exempt  # Disable CSRF checks for this view
    def get(self, request):
        personal_info = PersonalInfo.objects.filter(user=request.user).first()
        if personal_info:   
            serializer = PersonalInfoSerializer(personal_info)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"message": "No personal information found"}, status=status.HTTP_204_NO_CONTENT)
    
class ContactInfoView(APIView):
    permission_classes = [IsAuthenticated]

    @csrf_exempt  # Disable CSRF checks for this view
    def get(self, request):
        contact_info = ContactInfo.objects.filter(user=request.user).first()
        if contact_info:   
            serializer = ContactInfoSerializer(contact_info)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"message": "No contact information found"}, status=status.HTTP_204_NO_CONTENT)
    
    def post(self, request):
        logger.info(f"request user: {request.user}")
        # Check if the user already has personal information
        contact_info = ContactInfo.objects.filter(user=request.user).first()
        # If personal information already exists for the user, update it
        if contact_info:
            serializer = ContactInfoSerializer(contact_info, data=request.data, partial=True)
            logger.info(f"Updating existing contact information: {serializer.initial_data}")
        else:
            serializer = ContactInfoSerializer(data=request.data)
            # Log initial data before validation
            logger.info(f"Creating new contact information: {serializer.initial_data}")
        logger.info(f"Initial serialized data: {serializer.initial_data}")
        if serializer.is_valid():
            serializer.save(user=request.user)
            # Log the validated data
            logger.info(f"Validated serialized data: {serializer.data}")
            return Response(serializer.data, status=status.HTTP_201_CREATED if not contact_info else status.HTTP_200_OK)
        logger.error(f"Serializer errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class CompanyInfoView(APIView):
    permission_classes = [IsAuthenticated]

    @csrf_exempt  # Disable CSRF checks for this view
    def get(self, request):
        company_info = CompanyInfo.objects.filter(user=request.user).first()
        if company_info:   
            serializer = CompanyInfoSerializer(company_info)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"message": "No company information found"}, status=status.HTTP_204_NO_CONTENT)
    
    def post(self, request):
        logger.info(f"request user: {request.user}")
        # Check if the user already has personal information
        company_info = CompanyInfo.objects.filter(user=request.user).first()
        # If personal information already exists for the user, update it
        if company_info:
            serializer = CompanyInfoSerializer(company_info, data=request.data, partial=True)
            logger.info(f"Updating existing company information: {serializer.initial_data}")
        else:
            serializer = CompanyInfoSerializer(data=request.data)
            # Log initial data before validation
            logger.info(f"Creating new company information: {serializer.initial_data}")
        logger.info(f"Initial serialized data: {serializer.initial_data}")
        if serializer.is_valid():
            serializer.save(user=request.user)
            # Log the validated data
            logger.info(f"Validated serialized data: {serializer.data}")
            return Response(serializer.data, status=status.HTTP_201_CREATED if not company_info else status.HTTP_200_OK)
        logger.error(f"Serializer errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ProfessionalSummaryInfoView(APIView):
    permission_classes = [IsAuthenticated]

    @csrf_exempt  # Disable CSRF checks for this view
    def get(self, request):
        professional_summary_info = ProfessionalSummaryInfo.objects.filter(user=request.user).first()
        if professional_summary_info:   
            serializer = ProfessionalSummaryInfoSerializer(professional_summary_info)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"message": "No professional summary information found"}, status=status.HTTP_204_NO_CONTENT)
    
    def post(self, request):
        logger.info(f"request user: {request.user}")
        # Check if the user already has personal information
        professional_summary_info = ProfessionalSummaryInfo.objects.filter(user=request.user).first()
        # If personal information already exists for the user, update it
        if professional_summary_info:
            serializer = ProfessionalSummaryInfoSerializer(professional_summary_info, data=request.data, partial=True)
            logger.info(f"Updating existing professional summary information: {serializer.initial_data}")
        else:
            serializer = ProfessionalSummaryInfoSerializer(data=request.data)
            # Log initial data before validation
            logger.info(f"Creating new professional summary information: {serializer.initial_data}")
        logger.info(f"Initial serialized data: {serializer.initial_data}")
        if serializer.is_valid():
            serializer.save(user=request.user)
            # Log the validated data
            logger.info(f"Validated serialized data: {serializer.data}")
            return Response(serializer.data, status=status.HTTP_201_CREATED if not professional_summary_info else status.HTTP_200_OK)
        logger.error(f"Serializer errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class FinancialIdentityDetailsInfoView(APIView):
    permission_classes = [IsAuthenticated]

    @csrf_exempt  # Disable CSRF checks for this view
    def get(self, request):
        financial_identity_details_info = FinancialIdentityDetailsInfo.objects.filter(user=request.user).first()
        if financial_identity_details_info:   
            serializer = FinancialIdentityDetailsSerializer(financial_identity_details_info)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"message": "No financial and identity information found"}, status=status.HTTP_204_NO_CONTENT)
    
    def post(self, request):
        logger.info(f"request user: {request.user}")
        # Check if the user already has personal information
        financial_identity_details_info = FinancialIdentityDetailsInfo.objects.filter(user=request.user).first()
        # If personal information already exists for the user, update it
        if financial_identity_details_info:
            serializer = FinancialIdentityDetailsSerializer(financial_identity_details_info, data=request.data, partial=True)
            logger.info(f"Updating existing financial and identity information: {serializer.initial_data}")
        else:
            serializer = FinancialIdentityDetailsSerializer(data=request.data)
            # Log initial data before validation
            logger.info(f"Creating new financial and identity information: {serializer.initial_data}")
        logger.info(f"Initial serialized data: {serializer.initial_data}")
        if serializer.is_valid():
            serializer.save(user=request.user)
            # Log the validated data
            logger.info(f"Validated serialized data: {serializer.data}")
            return Response(serializer.data, status=status.HTTP_201_CREATED if not financial_identity_details_info else status.HTTP_200_OK)
        logger.error(f"Serializer errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyTokenView(APIView):
    def get(self, request):
        token = request.COOKIES.get('access')
        try:
            AccessToken(token)  # Validate the token
            return Response({"valid": True}, status=200)
        except Exception:
            raise AuthenticationFailed("Invalid token")
