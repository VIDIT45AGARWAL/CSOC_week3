from django.contrib import admin
from .models import Snippet

@admin.register(Snippet)
class SnippetAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'date', 'is_public', 'is_starred', 'user']
    list_filter = ['category', 'is_public', 'is_starred', 'user']
    search_fields = ['title', 'content', 'link_title', 'link_url']
    readonly_fields = ['date', 'user']
    list_per_page = 25

    def get_queryset(self, request):
        
        return super().get_queryset(request).select_related('user')