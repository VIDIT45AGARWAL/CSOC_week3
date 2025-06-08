from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SnippetViewSet, GoogleAuthView

router = DefaultRouter()
router.register(r'snippets', SnippetViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/google/', GoogleAuthView.as_view(), name='google-auth'),
]