from django.urls import path
from django.views.generic import TemplateView
from . import views
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('login/', TemplateView.as_view(template_name="index.html"), name="login"), 
    path('api/signup/', views.SignUpAPIView.as_view(), name="signup_api"),  # API endpoint for signup
    path('api/verify-email/<uuid:verification_code>/', views.VerifyEmailView.as_view(), name="verify_email"),
    path('api/login/', views.LoginAPIView.as_view(), name="login_api"),  # API endpoint for login
    path('api/auth/google/callback', views.GoogleAuthCallbackAPIView.as_view(), name="google_callback"),
    path('api/token/refresh/', views.RefreshTokenAPIView.as_view(), name='token_refresh'),
    path("api/logout/", views.LogoutAPIView.as_view(), name="logout"),
    path("api/verify-token/", views.VerifyTokenView.as_view(), name="verify_token"),
    path("api/profile/personalInfo/", views.PersonalInfoView.as_view(), name="personal"),
    path("api/profile/contactInfo/", views.ContactInfoView.as_view(), name="contact"),
    path("api/profile/companyInfo/", views.CompanyInfoView.as_view(), name="company"),
    path("api/profile/professionalSummaryInfo/", views.ProfessionalSummaryInfoView.as_view(), name="professional_summary"),
    path("api/profile/financialDetailsInfo/", views.FinancialIdentityDetailsInfoView.as_view(), name="financial_identity_details"),
]