from django.db import models

class Category(models.Model):
    content_type = models.CharField(
        max_length=20,
        choices=[('CODE', 'Code'), ('LINKS', 'Links'), ('NOTES', 'Notes'), ('FILES', 'Files')],
        unique=True
    )

    def __str__(self):
        return self.content_type

class Snippet(models.Model):
    CONTENT_TYPE_CHOICES = [
        ('CODE', 'Code'),
        ('LINKS', 'Links'),
        ('NOTES', 'Notes'),
        ('FILES', 'Files'),
    ]
    title = models.CharField(max_length=200)
    content = models.TextField(blank=True, null=True)
    content_type = models.CharField(max_length=10, choices=CONTENT_TYPE_CHOICES)
    language = models.CharField(max_length=50, blank=True, null=True)
    link_title = models.CharField(max_length=200, blank=True, null=True)
    link_url = models.URLField(blank=True, null=True)
    file = models.FileField(upload_to='snippets/files/', blank=True, null=True)
    date = models.DateTimeField(auto_now_add=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, null=True, blank=True)
    is_public = models.BooleanField(default=False)
    is_starred = models.BooleanField(default=False)

    def __str__(self):
        return self.title

    class Meta:
        indexes = [
            models.Index(fields=['category']),
        ]