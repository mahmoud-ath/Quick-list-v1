import React, { useState } from 'react';
import { Play, Trash2, GripVertical, ArrowLeft, Shuffle, SkipBack, SkipForward, Pause } from 'lucide-react';
import { Playlist, VideoItem } from '../types';

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
  const [isPlayerMode, setIsPlayerMode] = useState(false);

  const handleVideoEnd = () => {
    if (currentVideoIndex < playlist.videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    } else {
      setIsPlaying(false);
      setIsPlayerMode(false);
    }
  };

  const playVideo = (index: number) => {
    setCurrentVideoIndex(index);
    setIsPlaying(true);
    if (!isPlayerMode) {
      setIsPlayerMode(true);
    }
  };

  const playAll = () => {
    setCurrentVideoIndex(0);
    setIsPlaying(true);
    setIsPlayerMode(true);
  };

  const exitPlayerMode = () => {
    setIsPlayerMode(false);
    setIsPlaying(false);
  };

  const nextVideo = () => {
    if (currentVideoIndex < playlist.videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    }
  };

  const previousVideo = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
    }
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

  // Player Mode Layout
  if (isPlayerMode) {
    return (
      <div className="h-full flex flex-col">
        {/* Back Button */}
        <div className="mb-4">
          <button
            onClick={exitPlayerMode}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Library
          </button>
        </div>

        {/* Player Layout */}
        <div className="flex-1 flex gap-6 min-h-0">
          {/* Playlist Queue - Left Side */}
          <div className="w-80 flex-shrink-0 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Playlist Queue</h3>
              <p className="text-sm text-gray-500">{playlist.videos.length} videos</p>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {playlist.videos.map((video, index) => (
                <div
                  key={video.id}
                  className={`p-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${
                    currentVideoIndex === index ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                  }`}
                  onClick={() => playVideo(index)}
                >
                  <div className="flex items-center gap-3">
                    {/* Play Indicator */}
                    <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                      {currentVideoIndex === index && isPlaying ? (
                        <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
                      ) : (
                        <span className="text-xs text-gray-500">{index + 1}</span>
                      )}
                    </div>

                    {/* Video Thumbnail */}
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-16 h-10 object-cover rounded flex-shrink-0"
                    />

                    {/* Video Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                        {video.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Added {new Date(video.addedAt).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Menu */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveVideo(playlist.id, video.id);
                      }}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      title="Remove from playlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Video Player - Right Side */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Video Player */}
            <div className="bg-black rounded-xl overflow-hidden mb-4 aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${playlist.videos[currentVideoIndex].videoId}?autoplay=1&rel=0&modestbranding=1`}
                title={playlist.videos[currentVideoIndex].title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Player Controls */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 line-clamp-1">
                    {playlist.videos[currentVideoIndex].title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Video {currentVideoIndex + 1} of {playlist.videos.length}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={previousVideo}
                  disabled={currentVideoIndex === 0}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <SkipBack className="w-5 h-5 text-gray-700" />
                </button>

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6 fill-white" />
                  )}
                </button>

                <button
                  onClick={nextVideo}
                  disabled={currentVideoIndex === playlist.videos.length - 1}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <SkipForward className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Standard Playlist View
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
            onClick={playAll}
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