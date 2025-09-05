import React, { useState } from 'react';
import { Play, Trash2, Edit2, Video, Calendar } from 'lucide-react';
import { Playlist } from '../types';

interface PlaylistGridProps {
  playlists: Playlist[];
  onOpenPlaylist: (id: string) => void;
  onDeletePlaylist: (id: string) => void;
  onRenamePlaylist: (id: string, newName: string) => void;
}

const PlaylistGrid: React.FC<PlaylistGridProps> = ({
  playlists,
  onOpenPlaylist,
  onDeletePlaylist,
  onRenamePlaylist,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const startEditing = (playlist: Playlist) => {
    setEditingId(playlist.id);
    setEditName(playlist.name);
  };

  const saveEdit = () => {
    if (editingId && editName.trim()) {
      onRenamePlaylist(editingId, editName.trim());
    }
    setEditingId(null);
    setEditName('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  if (playlists.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Video className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No playlists yet</h3>
        <p className="text-gray-500">Add your first YouTube video to get started</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Your Playlists</h2>
        <span className="text-sm text-gray-500">{playlists.length} playlist{playlists.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden group"
          >
            {/* Thumbnail Section */}
            <div className="relative h-32 bg-gradient-to-br from-blue-50 to-indigo-100">
              {playlist.videos.length > 0 ? (
                <img
                  src={playlist.videos[0].thumbnail}
                  alt={playlist.videos[0].title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Video className="w-8 h-8 text-gray-400" />
                </div>
              )}
              
              {/* Play Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                <button
                  onClick={() => onOpenPlaylist(playlist.id)}
                  className="w-12 h-12 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                >
                  <Play className="w-5 h-5 text-gray-800 fill-gray-800 ml-0.5" />
                </button>
              </div>

              {/* Video Count Badge */}
              <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full">
                {playlist.videos.length} videos
              </div>
            </div>

            {/* Content Section */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                {editingId === playlist.id ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                    onBlur={saveEdit}
                    className="flex-1 text-base font-semibold bg-transparent border-b border-blue-500 focus:outline-none mr-2"
                    autoFocus
                  />
                ) : (
                  <h3
                    onClick={() => onOpenPlaylist(playlist.id)}
                    className="text-base font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors flex-1 line-clamp-2"
                  >
                    {playlist.name}
                  </h3>
                )}

                {/* Action Buttons */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => startEditing(playlist)}
                    className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                    title="Rename playlist"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-gray-500" />
                  </button>
                  <button
                    onClick={() => onDeletePlaylist(playlist.id)}
                    className="p-1.5 hover:bg-red-50 rounded-md transition-colors"
                    title="Delete playlist"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                  </button>
                </div>
              </div>

              {/* Metadata */}
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>Updated {formatDate(playlist.updatedAt)}</span>
                </div>
              </div>

              {/* Latest Videos Preview */}
              {playlist.videos.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Latest:</p>
                  <p className="text-sm text-gray-700 line-clamp-1">
                    {playlist.videos[playlist.videos.length - 1].title}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaylistGrid;