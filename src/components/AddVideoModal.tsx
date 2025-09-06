import React, { useState, useEffect } from 'react';
import { X, Link as LinkIcon, Plus, Video } from 'lucide-react';
import { Playlist, VideoItem } from '../types';
import { extractYouTubeVideoId, fetchVideoInfo } from '../utils/youtube';

interface AddVideoModalProps {
  playlists: Playlist[];
  onAddVideo: (video: VideoItem, playlistId: string) => void;
  onCreatePlaylist: (name: string) => string;
  onClose: () => void;
}

const AddVideoModal: React.FC<AddVideoModalProps> = ({
  playlists,
  onAddVideo,
  onCreatePlaylist,
  onClose,
}) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState('');
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleAddVideo = async () => {
    if (!videoUrl.trim()) {
      setError('Please enter a YouTube video URL');
      return;
    }

    const videoId = extractYouTubeVideoId(videoUrl);
    if (!videoId) {
      setError('Invalid YouTube URL');
      return;
    }

    let playlistId = selectedPlaylistId;

    // Create new playlist if needed
    if (isCreatingPlaylist && newPlaylistName.trim()) {
      playlistId = onCreatePlaylist(newPlaylistName.trim());
    }

    if (!playlistId) {
      setError('Please select or create a playlist');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const videoInfo = await fetchVideoInfo(videoId);
      const video: VideoItem = {
        id: Date.now().toString(),
        title: videoInfo.title,
        thumbnail: videoInfo.thumbnail,
        videoId,
        addedAt: new Date().toISOString(),
      };

      onAddVideo(video, playlistId);
      onClose();
    } catch (err) {
      setError('Failed to fetch video information');
    }

    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleAddVideo();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Video className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Add Video</h2>
              <p className="text-sm text-gray-500">Add a YouTube video to your playlist</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Video URL Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              YouTube Video URL
            </label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
            </div>
          </div>

          {/* Playlist Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Playlist
            </label>
            {!isCreatingPlaylist ? (
              <div className="space-y-2">
                <select
                  value={selectedPlaylistId}
                  onChange={(e) => setSelectedPlaylistId(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Choose existing playlist...</option>
                  {playlists.map((playlist) => (
                    <option key={playlist.id} value={playlist.id}>
                      {playlist.name} ({playlist.videos.length} videos)
                    </option>
                  ))}
                </select>
                
                <button
                  onClick={() => setIsCreatingPlaylist(true)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Create New Playlist
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter playlist name..."
                  className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={() => {
                    setIsCreatingPlaylist(false);
                    setNewPlaylistName('');
                  }}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Cancel - Choose existing playlist
                </button>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAddVideo}
            disabled={loading || !videoUrl.trim()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Adding...' : 'Add Video'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddVideoModal;