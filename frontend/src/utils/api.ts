import axios from 'axios';

// Create an axios instance with a base URL
const API = axios.create({
  baseURL: 'http://localhost:8000/api', // Your Django server
  headers: {
    'Content-Type': 'application/json',
  },
});

// Playlists API calls
export const fetchPlaylists = () => API.get('/playlists/');
export const createPlaylist = (newPlaylist) => API.post('/playlists/', newPlaylist);
export const updatePlaylist = (id, updatedPlaylist) => API.put(`/playlists/${id}/`, updatedPlaylist);
export const deletePlaylist = (id) => API.delete(`/playlists/${id}/`);

// Videos API calls
export const addVideoToPlaylist = (playlistId, videoData) => API.post(`/playlists/${playlistId}/add_video/`, videoData);
export const removeVideoFromPlaylist = (playlistId, videoId) => API.delete(`/playlists/${playlistId}/videos/${videoId}/`);

// Handle API errors consistently (optional but recommended)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response);
    return Promise.reject(error);
  }
);

export default API;