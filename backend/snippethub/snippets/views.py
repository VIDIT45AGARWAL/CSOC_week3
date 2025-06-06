from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from django.core.files.storage import default_storage
from .models import Category, Snippet
from .serializers import CategorySerializer, SnippetSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

class SnippetViewSet(viewsets.ModelViewSet):
    queryset = Snippet.objects.all()
    serializer_class = SnippetSerializer
    permission_classes = [AllowAny]

    def perform_destroy(self, instance):
        if instance.file:
            try:
                default_storage.delete(instance.file.name)
            except FileNotFoundError:
                pass
        instance.delete()