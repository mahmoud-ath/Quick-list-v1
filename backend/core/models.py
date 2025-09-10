from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

class User(AbstractUser):
    """Custom user model"""
    email = models.EmailField(_('email address'), unique=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    bio = models.TextField(max_length=500, blank=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

class Playlist(models.Model):
    """Playlist model"""
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='playlists')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_public = models.BooleanField(default=False)
    collaborators = models.ManyToManyField(User, related_name='collaborative_playlists', blank=True)
    
    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

class Video(models.Model):
    """Video model"""
    youtube_id = models.CharField(max_length=20)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    thumbnail_url = models.URLField()
    playlist = models.ForeignKey(Playlist, on_delete=models.CASCADE, related_name='videos')
    position = models.PositiveIntegerField()
    duration = models.CharField(max_length=10, blank=True)  # Format: "HH:MM:SS"
    added_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['position']
        unique_together = ['playlist', 'position']

    def __str__(self):
        return self.title
