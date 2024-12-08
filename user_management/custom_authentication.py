from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed
import logging
logger = logging.getLogger(__name__)

class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        access_token = request.COOKIES.get('access')
        logger.info(f"access_token: {access_token}")
        if not access_token:
            return None
        try:
            validated_token = self.get_validated_token(access_token)
            logger.info(f"Validated Token: {validated_token}")
            return self.get_user(validated_token), validated_token
        except AuthenticationFailed as e:
            logger.error(f"Authentication failed: {e}")
            return None
