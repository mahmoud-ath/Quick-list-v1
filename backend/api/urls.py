from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, PlaylistViewSet
from .views import add_video_to_playlist

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'playlists', PlaylistViewSet, basename='playlist')

urlpatterns = [
    path('', include(router.urls)),
    path('playlists/', PlaylistList.as_view()),
    path('playlists/<uuid:pk>/', PlaylistDetail.as_view()),
    path('playlists/<uuid:pk>/add_video/', add_video_to_playlist), # Add this line
    path('videos/', VideoList.as_view()),
]