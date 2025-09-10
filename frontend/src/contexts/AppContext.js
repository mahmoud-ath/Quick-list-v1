import React, { createContext, useReducer, useEffect, useContext } from 'react';
import { fetchPlaylists, createPlaylist, addVideoToPlaylist } from '../utils/api'; // corrected path
import toast from 'react-hot-toast';
import { ActionTypes, initialState, reducer } from './AppReducer';

export const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // 1. Action to load playlists from the backend
  const loadPlaylists = async () => {
    dispatch({ type: ActionTypes.SET_LOADING });
    try {
      const response = await fetchPlaylists();
      dispatch({ type: ActionTypes.PLAYLISTS_LOADED, payload: response.data });
    } catch (error) {
      dispatch({ type: ActionTypes.API_REQUEST_FAILED, payload: error.message });
      toast.error('Failed to load playlists');
    }
  };

  // 2. Action to create a new playlist via API
  const addPlaylist = async (name) => {
    dispatch({ type: ActionTypes.SET_LOADING });
    try {
      const response = await createPlaylist({ name: name }); // Send data in the format your API expects
      dispatch({ type: ActionTypes.PLAYLIST_ADDED, payload: response.data });
      toast.success(`Playlist "${name}" created!`);
    } catch (error) {
      dispatch({ type: ActionTypes.API_REQUEST_FAILED, payload: error.message });
      toast.error('Failed to create playlist');
    }
  };

  // 3. Action to add a video via API
  const addVideo = async (playlistId, url) => {
    dispatch({ type: ActionTypes.SET_LOADING });
    try {
      // This endpoint might need to be created in your Django view
      const response = await addVideoToPlaylist(playlistId, { url: url });
      // Option 1 (Simple): Refetch the entire playlist list to get the updated data
      await loadPlaylists();
      // Option 2 (Complex): Update the state optimistically without refetching
      // dispatch({ type: ActionTypes.VIDEO_ADDED, payload: { playlistId, video: response.data } });
      toast.success('Video added!');
    } catch (error) {
      dispatch({ type: ActionTypes.API_REQUEST_FAILED, payload: error.message });
      toast.error('Failed to add video. Check the URL.');
    }
  };

  // useEffect to load playlists when the app starts
  useEffect(() => {
    loadPlaylists();
  }, []);

  return (
    <AppContext.Provider value={{ ...state, addPlaylist, addVideo, loadPlaylists }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};

export default AppProvider;