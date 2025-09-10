from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from core.models import User, Playlist, Video
from .serializers import UserSerializer, PlaylistSerializer, VideoSerializer
from utils.youtube import YouTubeAPI

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.action == 'list':
            return User.objects.filter(id=self.request.user.id)
        return super().get_queryset()

class PlaylistViewSet(viewsets.ModelViewSet):
    serializer_class = PlaylistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Playlist.objects.filter(
            owner=self.request.user
        ) | Playlist.objects.filter(
            collaborators=self.request.user
        ) | Playlist.objects.filter(
            is_public=True
        ).distinct()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=['post'])
    def add_video(self, request, pk=None):
        playlist = self.get_object()
        youtube_id = request.data.get('youtube_id')
        
        if not youtube_id:
            return Response(
                {'error': 'YouTube video ID is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get video details from YouTube API
        youtube_api = YouTubeAPI()
        video_data = youtube_api.get_video_details(youtube_id)
        
        if not video_data:
            return Response(
                {'error': 'Invalid YouTube video ID'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create video
        position = playlist.videos.count() + 1
        video = Video.objects.create(
            playlist=playlist,
            youtube_id=youtube_id,
            title=video_data['title'],
            description=video_data['description'],
            thumbnail_url=video_data['thumbnail_url'],
            position=position,
            duration=video_data['duration']
        )

        return Response(
            VideoSerializer(video).data, 
            status=status.HTTP_201_CREATED
        )
