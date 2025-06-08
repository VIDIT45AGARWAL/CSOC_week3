from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from django.core.files.storage import default_storage
from .models import Snippet
from .serializers import SnippetSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import os
from rest_framework.permissions import IsAuthenticated
from google_auth_oauthlib.flow import Flow
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class SnippetViewSet(viewsets.ModelViewSet):
    queryset = Snippet.objects.all()
    serializer_class = SnippetSerializer
    permission_classes = [IsAuthenticated]

    def perform_destroy(self, instance):
        if instance.file:
            try:
                default_storage.delete(instance.file.name)
            except FileNotFoundError:
                pass
        instance.delete()

    def get_queryset(self):
        return Snippet.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        logger.info(f'Creating snippet with data: {serializer.validated_data}')
        serializer.save(user=self.request.user)

class GoogleAuthView(APIView):
    def post(self, request):
        code = request.data.get('code')
        if not code:
            return Response({'error': 'Code is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            
            flow = Flow.from_client_config(
                client_config={
                    "web": {
                        "client_id": settings.GOOGLE_CLIENT_ID,
                        "client_secret": settings.GOOGLE_CLIENT_SECRET,
                        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                        "token_uri": "https://oauth2.googleapis.com/token",
                    }
                },
                scopes=[
                    'openid',
                    'https://www.googleapis.com/auth/userinfo.email',
                    'https://www.googleapis.com/auth/userinfo.profile',
                ],
            )

            
            flow.redirect_uri = 'http://localhost:5173'

            
            flow.fetch_token(code=code)
            credentials = flow.credentials

            
            idinfo = id_token.verify_oauth2_token(
                credentials.id_token,
                google_requests.Request(),
                settings.GOOGLE_CLIENT_ID,
            )

            
            email = idinfo.get('email')
            if not email:
                return Response({'error': 'Email not found in token'}, status=status.HTTP_400_BAD_REQUEST)

            
            user, created = User.objects.get_or_create(
                username=email,
                defaults={'email': email}
            )

            
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': {
                    'id': user.id,
                    'email': user.email
                }
            })

        except ValueError as e:
            logger.error(f'Token validation error: {str(e)}')
            return Response({'error': f'Token validation error: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f'Authentication failed: {str(e)}')
            return Response({'error': f'Authentication failed: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)