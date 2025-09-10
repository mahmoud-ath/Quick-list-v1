import React from 'react';
import { Plus, Video, Play } from 'lucide-react';
import { Playlist, VideoItem } from '../types';
import PlaylistGrid from './PlaylistGrid';
import PlaylistView from './PlaylistView';

interface MainContentProps {
  currentView: 'dashboard' | 'playlist';
  playlists: Playlist[];
  selectedPlaylist: Playlist | undefined;
  onOpenPlaylist: (id: string) => void;
  onDeletePlaylist: (id: string) => void;
  onRenamePlaylist: (id: string, newName: string) => void;
  onRemoveVideo: (playlistId: string, videoId: string) => void;
  onReorderVideos: (playlistId: string, videos: VideoItem[]) => void;
  onShowAddModal: () => void;
  onGoBack: () => void;
}

const MainContent: React.FC<MainContentProps> = ({
  currentView,
  playlists,
  selectedPlaylist,
  onOpenPlaylist,
  onDeletePlaylist,
  onRenamePlaylist,
  onRemoveVideo,
  onReorderVideos,
  onShowAddModal,
  onGoBack,
}) => {
  if (currentView === 'playlist' && selectedPlaylist) {
    return (
      <PlaylistView
        playlist={selectedPlaylist}
        onRemoveVideo={onRemoveVideo}
        onReorderVideos={onReorderVideos}
        onGoBack={onGoBack}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Quick Add Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Video className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Add YouTube Video</h2>
          <p className="text-gray-500 mb-6">Paste a YouTube link to quickly add it to your playlists</p>
          
          <button
            onClick={onShowAddModal}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Video
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      {playlists.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Playlists</h3>
            <span className="text-sm text-gray-500">{playlists.length} total</span>
          </div>
          
          <PlaylistGrid
            playlists={playlists.slice(0, 6)}
            onOpenPlaylist={onOpenPlaylist}
            onDeletePlaylist={onDeletePlaylist}
            onRenamePlaylist={onRenamePlaylist}
          />
        </div>
      )}

      {/* Empty State */}
      {playlists.length === 0 && (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Play className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome to QuickList</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Start building your YouTube playlists by adding your first video. 
            Organize, manage, and play your favorite content all in one place.
          </p>
          <button
            onClick={onShowAddModal}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Your First Video
          </button>
        </div>
      )}
    </div>
  );
};

export default MainContent;