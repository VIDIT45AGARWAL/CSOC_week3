from rest_framework import serializers
from .models import Snippet


class SnippetSerializer(serializers.ModelSerializer):
    category = serializers.ChoiceField(choices=Snippet.CATEGORY_CHOICES, required=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Snippet
        fields = [
            'id', 'title', 'content', 'category', 'language',
            'link_title', 'link_url', 'file', 'date',
            'is_public', 'is_starred', 'user',
        ]

    def validate_file(self, value):
        if value:
            if value.size > 5 * 1024 * 1024:  # 5MB limit
                raise serializers.ValidationError("File size exceeds 5MB")
            valid_types = ['application/pdf', 'image/jpeg', 'image/png']
            if value.content_type not in valid_types:
                raise serializers.ValidationError("Invalid file type")
        return value