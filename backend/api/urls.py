from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, PlaylistViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'playlists', PlaylistViewSet, basename='playlist')

urlpatterns = [
    path('', include(router.urls)),
]
