from rest_framework import serializers
from core.models import User, Playlist, Video

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'avatar', 'bio')
        read_only_fields = ('id',)

class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ('id', 'youtube_id', 'title', 'description', 'thumbnail_url', 
                 'position', 'duration', 'added_at')
        read_only_fields = ('id', 'added_at')

class PlaylistSerializer(serializers.ModelSerializer):
    videos = VideoSerializer(many=True, read_only=True)
    owner = UserSerializer(read_only=True)
    
    class Meta:
        model = Playlist
        fields = ('id', 'title', 'description', 'owner', 'videos', 'created_at', 
                 'updated_at', 'is_public', 'collaborators')
        read_only_fields = ('id', 'created_at', 'updated_at')
