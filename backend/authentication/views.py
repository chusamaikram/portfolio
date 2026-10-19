from django.conf import settings
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.serializers import TokenRefreshSerializer

from .serializers import CustomTokenObtainPairSerializer, UserSerializer


def set_refresh_cookie(response, refresh_token):
    """
    Sets a secure, HttpOnly cookie containing the SimpleJWT refresh token
    """
    cookie_name = settings.SIMPLE_JWT.get('AUTH_COOKIE', 'refresh_token')
    max_age = int(settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds())
    secure = settings.SIMPLE_JWT.get('AUTH_COOKIE_SECURE', not settings.DEBUG)
    samesite = settings.SIMPLE_JWT.get('AUTH_COOKIE_SAMESITE', 'Lax')
    path = settings.SIMPLE_JWT.get('AUTH_COOKIE_PATH', '/')

    response.set_cookie(
        key=cookie_name,
        value=str(refresh_token),
        max_age=max_age,
        httponly=True,
        secure=secure,
        samesite=samesite,
        path=path,
    )


class CookieTokenObtainPairView(TokenObtainPairView):
    """
    Enterprise Login Endpoint:
    POST /api/v1/auth/login/
    Returns:
      - JSON Body: { access: str, user: dict }
      - Cookie: HttpOnly 'refresh_token' with 7-day lifespan
    """
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        data = serializer.validated_data
        refresh_token = data.get('refresh')

        # Clean response payload: return short-lived access token and user info
        response_data = {
            'access': data.get('access'),
            'user': data.get('user'),
        }

        response = Response(response_data, status=status.HTTP_200_OK)
        if refresh_token:
            set_refresh_cookie(response, refresh_token)

        return response


class CookieTokenRefreshView(TokenRefreshView):
    """
    Enterprise Token Refresh Endpoint:
    POST /api/v1/auth/refresh/
    Reads refresh token from HttpOnly cookie (with request.data fallback).
    Rotates the refresh token and returns a new access token.
    """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        cookie_name = settings.SIMPLE_JWT.get('AUTH_COOKIE', 'refresh_token')
        raw_refresh = request.COOKIES.get(cookie_name) or request.data.get('refresh')

        if not raw_refresh:
            return Response(
                {'detail': 'Authentication refresh token cookie was not provided.'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        serializer = TokenRefreshSerializer(data={'refresh': raw_refresh})
        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        new_access = serializer.validated_data.get('access')
        new_refresh = serializer.validated_data.get('refresh')

        response = Response({'access': new_access}, status=status.HTTP_200_OK)

        # If token rotation is active, set the newly generated refresh token cookie
        if new_refresh:
            set_refresh_cookie(response, new_refresh)

        return response


class LogoutView(APIView):
    """
    Enterprise Logout Endpoint:
    POST /api/v1/auth/logout/
    Blacklists the active refresh token and clears the HttpOnly cookie.
    """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        cookie_name = settings.SIMPLE_JWT.get('AUTH_COOKIE', 'refresh_token')
        refresh_token = request.COOKIES.get(cookie_name) or request.data.get('refresh')

        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
            except Exception:
                # Token may already be blacklisted or invalid
                pass

        response = Response(
            {'detail': 'Successfully logged out and session terminated.'},
            status=status.HTTP_200_OK
        )

        response.delete_cookie(
            key=cookie_name,
            path=settings.SIMPLE_JWT.get('AUTH_COOKIE_PATH', '/'),
            samesite=settings.SIMPLE_JWT.get('AUTH_COOKIE_SAMESITE', 'Lax')
        )

        return response


class MeView(APIView):
    """
    Authenticated Profile Endpoint:
    GET /api/v1/auth/me/
    Returns authenticated user profile metadata.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)
