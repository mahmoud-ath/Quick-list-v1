import React, { useState, useEffect } from 'react';
import { Plus, Play, Trash2, Edit2, Video, List, Home } from 'lucide-react';
import Header from './components/Header';
import AddVideoSection from './components/AddVideoSection';
import PlaylistGrid from './components/PlaylistGrid';
import PlaylistView from './components/PlaylistView';
import { Playlist, VideoItem } from './types';

function App() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [currentView, setCurrentView] = useState<'home' | 'playlist'>('home');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);

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
  };

  const goHome = () => {
    setCurrentView('home');
    setSelectedPlaylistId(null);
  };

  const selectedPlaylist = playlists.find(p => p.id === selectedPlaylistId);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        currentView={currentView}
        onGoHome={goHome}
        playlistName={selectedPlaylist?.name}
      />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {currentView === 'home' ? (
          <>
            <AddVideoSection 
              playlists={playlists}
              onAddVideo={addVideoToPlaylist}
              onCreatePlaylist={createPlaylist}
            />
            <PlaylistGrid
              playlists={playlists}
              onOpenPlaylist={openPlaylist}
              onDeletePlaylist={deletePlaylist}
              onRenamePlaylist={renamePlaylist}
            />
          </>
        ) : selectedPlaylist && (
          <PlaylistView
            playlist={selectedPlaylist}
            onRemoveVideo={removeVideoFromPlaylist}
            onReorderVideos={reorderVideos}
            onGoBack={goHome}
          />
        )}
      </main>
    </div>
  );
}

export default App;