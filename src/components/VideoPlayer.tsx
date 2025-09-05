import React, { useEffect } from 'react';
import { X, SkipForward, SkipBack } from 'lucide-react';
import { VideoItem } from '../types';

interface VideoPlayerProps {
  video: VideoItem;
  onVideoEnd: () => void;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, onVideoEnd, onClose }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Video Info */}
        <div className="absolute -top-12 left-0 text-white">
          <h3 className="text-lg font-semibold line-clamp-1">{video.title}</h3>
        </div>

        {/* YouTube Embed */}
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          <iframe
            src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0&modestbranding=1`}
            title={video.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={() => {
              // Listen for video end - this is simplified since we can't access iframe content
              // In a production app, you'd use YouTube Player API
              setTimeout(() => {
                // Auto-advance after estimated video duration (placeholder)
              }, 30000);
            }}
          />
        </div>

        {/* Player Controls */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <SkipBack className="w-4 h-4" />
            Previous
          </button>
          <button
            onClick={onVideoEnd}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Next
            <SkipForward className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;