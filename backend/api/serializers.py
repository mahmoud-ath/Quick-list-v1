from rest_framework import serializers
from core.models import User, Playlist, Video

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'avatar', 'bio')
        read_only_fields = ('id',)

class PlaylistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Playlist
        fields = ['id', 'name', 'videos'] # Make sure 'id' is here
        read_only_fields = ['id'] # It should be read-only

class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ['id', 'title', 'video_id', 'thumbnail', 'playlist'] # Include 'id'
        read_only_fields = ['id', 'title', 'thumbnail'] # These are set by the backend, not the frontend