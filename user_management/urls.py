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
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]