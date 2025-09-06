import React, { useState } from 'react';
import { Play, Trash2, GripVertical, ArrowLeft, Shuffle } from 'lucide-react';
import { Playlist, VideoItem } from '../types';
import VideoPlayer from './VideoPlayer';

interface PlaylistViewProps {
  playlist: Playlist;
  onRemoveVideo: (playlistId: string, videoId: string) => void;
  onReorderVideos: (playlistId: string, videos: VideoItem[]) => void;
  onGoBack: () => void;
}

const PlaylistView: React.FC<PlaylistViewProps> = ({
  playlist,
  onRemoveVideo,
  onReorderVideos,
  onGoBack,
}) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleVideoEnd = () => {
    if (currentVideoIndex < playlist.videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    } else {
      setIsPlaying(false);
    }
  };

  const playVideo = (index: number) => {
    setCurrentVideoIndex(index);
    setIsPlaying(true);
  };

  const formatDuration = (seconds: string) => {
    const num = parseInt(seconds);
    const hours = Math.floor(num / 3600);
    const minutes = Math.floor((num % 3600) / 60);
    const secs = num % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const shufflePlaylist = () => {
    const shuffled = [...playlist.videos].sort(() => Math.random() - 0.5);
    onReorderVideos(playlist.id, shuffled);
    setCurrentVideoIndex(0);
  };

  if (playlist.videos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Play className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Empty Playlist</h3>
        <p className="text-gray-500">This playlist doesn't have any videos yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Playlist Header */}
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-3">
          <button
            onClick={shufflePlaylist}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
          >
            <Shuffle className="w-4 h-4" />
            Shuffle
          </button>
          <span className="text-sm text-gray-500">{playlist.videos.length} videos</span>
        </div>
      </div>

      {/* Video Player */}
      {isPlaying && playlist.videos[currentVideoIndex] && (
        <VideoPlayer
          video={playlist.videos[currentVideoIndex]}
          onVideoEnd={handleVideoEnd}
          onClose={() => setIsPlaying(false)}
        />
      )}

      {/* Play All Button */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center">
              <Play className="w-6 h-6 text-white fill-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{playlist.name}</h2>
              <p className="text-gray-500">{playlist.videos.length} videos</p>
            </div>
          </div>
          <button
            onClick={() => playVideo(0)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Play className="w-5 h-5 fill-white" />
            Play All
          </button>
        </div>
      </div>

      {/* Video List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Videos</h3>
        </div>

        <div className="divide-y divide-gray-100">
          {playlist.videos.map((video, index) => (
            <div
              key={video.id}
              className={`p-4 hover:bg-gray-50 transition-colors ${
                isPlaying && currentVideoIndex === index ? 'bg-blue-50 border-l-4 border-blue-600' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Drag Handle */}
                <div className="flex-shrink-0 cursor-move text-gray-400 hover:text-gray-600">
                  <GripVertical className="w-4 h-4" />
                </div>

                {/* Video Thumbnail */}
                <div className="relative flex-shrink-0">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-24 h-16 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => playVideo(index)}
                    className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-40 rounded-lg flex items-center justify-center transition-all duration-200 group"
                  >
                    <Play className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity fill-white" />
                  </button>
                </div>

                {/* Video Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                    {video.title}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>#{index + 1}</span>
                    {video.duration && <span>{formatDuration(video.duration)}</span>}
                    <span>Added {new Date(video.addedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {isPlaying && currentVideoIndex === index && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                  )}
                  <button
                    onClick={() => onRemoveVideo(playlist.id, video.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove video"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlaylistView;