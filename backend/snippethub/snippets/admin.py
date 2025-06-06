from django.contrib import admin
from .models import Category, Snippet

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['content_type']
    list_filter = ['content_type']

@admin.register(Snippet)
class SnippetAdmin(admin.ModelAdmin):
    list_display = ['title', 'content_type', 'date', 'category', 'is_public']
    list_filter = ['content_type', 'category', 'is_public']
    search_fields = ['title', 'content']