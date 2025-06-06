from rest_framework import serializers
from .models import Category, Snippet

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'content_type']

class SnippetSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), required=True)

    class Meta:
        model = Snippet
        fields = [
            'id', 'title', 'content', 'content_type', 'language',
            'link_title', 'link_url', 'file', 'date',
            'category', 'is_public', 'is_starred'
        ]

    def validate_file(self, value):
        if value:
            if value.size > 5 * 1024 * 1024:  # 5MB limit
                raise serializers.ValidationError("File size exceeds 5MB")
            valid_types = ['application/pdf', 'image/jpeg', 'image/png']
            if value.content_type not in valid_types:
                raise serializers.ValidationError("Invalid file type")
        return value