import React , { useState, useEffect } from 'react';
import { Plus, Play, Trash2, Edit2, Video, List, Home, Search, User, Clock, Music, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import AddVideoModal from './components/AddVideoModal';
import { Playlist, VideoItem } from './types';

function App() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [currentView, setCurrentView] = useState<'dashboard' | 'playlist'>('dashboard');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPlayerMode, setIsPlayerMode] = useState(false);

  // Load playlists from localStorage on mount
  useEffect(() => {
    const savedPlaylists = localStorage.getItem('quicklist-playlists');
    if (savedPlaylists) {
      setPlaylists(JSON.parse(savedPlaylists));
    }
  }, []);

  // Save playlists to localStorage whenever playlists change
  useEffect(() => {
    localStorage.setItem('quicklist-playlists', JSON.stringify(playlists));
  }, [playlists]);

  const addVideoToPlaylist = (video: VideoItem, playlistId: string) => {
    setPlaylists(prev => prev.map(playlist => 
      playlist.id === playlistId 
        ? { ...playlist, videos: [...playlist.videos, video], updatedAt: new Date().toISOString() }
        : playlist
    ));
  };

  const createPlaylist = (name: string): string => {
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name,
      videos: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setPlaylists(prev => [...prev, newPlaylist]);
    return newPlaylist.id;
  };

  const deletePlaylist = (id: string) => {
    setPlaylists(prev => prev.filter(playlist => playlist.id !== id));
    if (selectedPlaylistId === id) {
      setCurrentView('home');
      setSelectedPlaylistId(null);
    }
  };

  const renamePlaylist = (id: string, newName: string) => {
    setPlaylists(prev => prev.map(playlist =>
      playlist.id === id
        ? { ...playlist, name: newName, updatedAt: new Date().toISOString() }
        : playlist
    ));
  };

  const removeVideoFromPlaylist = (playlistId: string, videoId: string) => {
    setPlaylists(prev => prev.map(playlist =>
      playlist.id === playlistId
        ? { ...playlist, videos: playlist.videos.filter(video => video.id !== videoId), updatedAt: new Date().toISOString() }
        : playlist
    ));
  };

  const reorderVideos = (playlistId: string, videos: VideoItem[]) => {
    setPlaylists(prev => prev.map(playlist =>
      playlist.id === playlistId
        ? { ...playlist, videos, updatedAt: new Date().toISOString() }
        : playlist
    ));
  };

  const openPlaylist = (id: string) => {
    setSelectedPlaylistId(id);
    setCurrentView('playlist');
    setIsPlayerMode(false);
  };

  const goHome = () => {
    setCurrentView('dashboard');
    setSelectedPlaylistId(null);
    setIsPlayerMode(false);
  };

  const filteredPlaylists = playlists.filter(playlist =>
    playlist.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedPlaylist = playlists.find(p => p.id === selectedPlaylistId);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar
        playlists={playlists}
        selectedPlaylistId={selectedPlaylistId}
        collapsed={sidebarCollapsed || isPlayerMode}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onSelectPlaylist={openPlaylist}
        onCreatePlaylist={() => setShowAddModal(true)}
        onGoHome={goHome}
        currentView={currentView}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-gray-900">
                {currentView === 'dashboard' ? 'Dashboard' : selectedPlaylist?.name}
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search playlists..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {/* User Icon */}
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <MainContent
            currentView={currentView}
            playlists={filteredPlaylists}
            selectedPlaylist={selectedPlaylist}
            onOpenPlaylist={openPlaylist}
            onDeletePlaylist={deletePlaylist}
            onRenamePlaylist={renamePlaylist}
            onRemoveVideo={removeVideoFromPlaylist}
            onReorderVideos={reorderVideos}
            onShowAddModal={() => setShowAddModal(true)}
            onGoBack={goHome}
          />
        </main>
      </div>

      {/* Add Video Modal */}
      {showAddModal && (
        <AddVideoModal
          playlists={playlists}
          onAddVideo={addVideoToPlaylist}
          onCreatePlaylist={createPlaylist}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}

export default App;