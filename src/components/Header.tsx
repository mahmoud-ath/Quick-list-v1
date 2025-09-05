import React from 'react';
import { Home, List, Play } from 'lucide-react';

interface HeaderProps {
  currentView: 'home' | 'playlist';
  onGoHome: () => void;
  playlistName?: string;
}

const Header: React.FC<HeaderProps> = ({ currentView, onGoHome, playlistName }) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {currentView === 'playlist' && (
              <button
                onClick={onGoHome}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Back to Home"
              >
                <Home className="w-5 h-5 text-gray-600" />
              </button>
            )}
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Play className="w-5 h-5 text-white fill-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">QuickList Web</h1>
                {currentView === 'playlist' && playlistName && (
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <List className="w-4 h-4" />
                    {playlistName}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Saved locally
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;