import React, { useState } from 'react';
import { Plus, Video, Link as LinkIcon } from 'lucide-react';
import { Playlist, VideoItem } from '../types';
import { extractYouTubeVideoId, fetchVideoInfo } from '../utils/youtube';

interface AddVideoSectionProps {
  playlists: Playlist[];
  onAddVideo: (video: VideoItem, playlistId: string) => void;
  onCreatePlaylist: (name: string) => string;
}

const AddVideoSection: React.FC<AddVideoSectionProps> = ({
  playlists,
  onAddVideo,
  onCreatePlaylist,
}) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState('');
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      setNewPlaylistName('');
      setIsCreatingPlaylist(false);
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
      setVideoUrl('');
      setSelectedPlaylistId('');
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
          <Video className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Add Video</h2>
          <p className="text-sm text-gray-500">Paste a YouTube link and choose a playlist</p>
        </div>
      </div>

      <div className="space-y-4">
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
            />
          </div>
        </div>

        {/* Playlist Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Playlist
            </label>
            <select
              value={selectedPlaylistId}
              onChange={(e) => {
                setSelectedPlaylistId(e.target.value);
                setIsCreatingPlaylist(false);
              }}
              className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isCreatingPlaylist}
            >
              <option value="">Choose existing playlist...</option>
              {playlists.map((playlist) => (
                <option key={playlist.id} value={playlist.id}>
                  {playlist.name} ({playlist.videos.length} videos)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Or Create New
            </label>
            {isCreatingPlaylist ? (
              <input
                type="text"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter playlist name..."
                className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
            ) : (
              <button
                onClick={() => {
                  setIsCreatingPlaylist(true);
                  setSelectedPlaylistId('');
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Playlist
              </button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Add Button */}
        <button
          onClick={handleAddVideo}
          disabled={loading || !videoUrl.trim()}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Adding Video...' : 'Add to Playlist'}
        </button>
      </div>
    </div>
  );
};

export default AddVideoSection;