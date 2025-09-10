from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Playlist, Video

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'username', 'is_staff', 'is_active')
    search_fields = ('email', 'username')
    ordering = ('email',)

@admin.register(Playlist)
class PlaylistAdmin(admin.ModelAdmin):
    list_display = ('title', 'owner', 'created_at', 'is_public')
    list_filter = ('is_public', 'created_at')
    search_fields = ('title', 'description', 'owner__email')
    raw_id_fields = ('owner', 'collaborators')

@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = ('title', 'youtube_id', 'playlist', 'position', 'added_at')
    list_filter = ('added_at',)
    search_fields = ('title', 'youtube_id', 'playlist__title')
    raw_id_fields = ('playlist',)
