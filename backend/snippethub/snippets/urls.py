from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, SnippetViewSet

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'snippets', SnippetViewSet)

urlpatterns = [
    path('', include(router.urls)),
]