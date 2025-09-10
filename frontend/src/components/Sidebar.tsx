import React from 'react';
import { Plus, Play, List, Home, Clock, Music, BookOpen, ChevronLeft, ChevronRight, Video } from 'lucide-react';
import { Playlist } from '../types';

interface SidebarProps {
  playlists: Playlist[];
  selectedPlaylistId: string | null;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onSelectPlaylist: (id: string) => void;
  onCreatePlaylist: () => void;
  onGoHome: () => void;
  currentView: 'dashboard' | 'playlist';
}

const Sidebar: React.FC<SidebarProps> = ({
  playlists,
  selectedPlaylistId,
  collapsed,
  onToggleCollapse,
  onSelectPlaylist,
  onCreatePlaylist,
  onGoHome,
  currentView,
}) => {
  const recentPlaylists = playlists
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const categories = [
    { id: 'all', name: 'All Playlists', icon: List, count: playlists.length },
    { id: 'recent', name: 'Recent', icon: Clock, count: recentPlaylists.length },
  ];

  return (
    <div className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Play className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="font-semibold text-gray-900">QuickList</span>
            </div>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-500" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {/* Dashboard */}
          <button
            onClick={onGoHome}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              currentView === 'dashboard'
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Home className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span className="font-medium">Dashboard</span>}
          </button>

          {/* Categories */}
          {!collapsed && (
            <div className="mt-6">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Categories
              </h3>
              {categories.map((category) => (
                <button
                  key={category.id}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <category.icon className="w-4 h-4" />
                    <span>{category.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">{category.count}</span>
                </button>
              ))}
            </div>
          )}

          {/* Playlists */}
          <div className="mt-6">
            {!collapsed && (
              <div className="flex items-center justify-between px-3 mb-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Playlists
                </h3>
                <button
                  onClick={onCreatePlaylist}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  title="Create playlist"
                >
                  <Plus className="w-3 h-3 text-gray-500" />
                </button>
              </div>
            )}

            <div className="space-y-1">
              {playlists.slice(0, collapsed ? 5 : 10).map((playlist) => (
                <button
                  key={playlist.id}
                  onClick={() => onSelectPlaylist(playlist.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    selectedPlaylistId === playlist.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  title={collapsed ? playlist.name : undefined}
                >
                  <div className="w-4 h-4 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center">
                    <Video className="w-2.5 h-2.5 text-gray-500" />
                  </div>
                  {!collapsed && (
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{playlist.name}</div>
                      <div className="text-xs text-gray-500">
                        {playlist.videos.length} videos
                      </div>
                    </div>
                  )}
                </button>
              ))}

              {collapsed && (
                <button
                  onClick={onCreatePlaylist}
                  className="w-full flex items-center justify-center p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
                  title="Create playlist"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Playlist Button (when not collapsed) */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onCreatePlaylist}
            className="w-full flex items-center gap-2 px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Playlist</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
