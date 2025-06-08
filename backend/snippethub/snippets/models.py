from django.db import models
from django.contrib.auth.models import User

class Snippet(models.Model):
    CATEGORY_CHOICES = [
        ('CODE', 'Code'),
        ('LINKS', 'Links'),
        ('NOTES', 'Notes'),
        ('FILES', 'Files'),
    ]
    title = models.CharField(max_length=200)
    content = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='CODE')
    language = models.CharField(max_length=50, blank=True, null=True)
    link_title = models.CharField(max_length=200, blank=True, null=True)
    link_url = models.URLField(blank=True, null=True)
    file = models.FileField(upload_to='snippets/files/', blank=True, null=True)
    date = models.DateTimeField(auto_now_add=True)
    is_public = models.BooleanField(default=False)
    is_starred = models.BooleanField(default=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return self.title

    class Meta:
        indexes = [
            models.Index(fields=['category']),
        ]