export const initialState = {
  playlists: [],
  currentVideo: null,
  loading: false,
  error: null,
};

export const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  API_REQUEST_FAILED: 'API_REQUEST_FAILED',
  PLAYLISTS_LOADED: 'PLAYLISTS_LOADED',
  PLAYLIST_ADDED: 'PLAYLIST_ADDED',
  PLAYLIST_DELETED: 'PLAYLIST_DELETED',
  VIDEO_ADDED: 'VIDEO_ADDED',
};

export const reducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return { ...state, loading: true, error: null };

    case ActionTypes.API_REQUEST_FAILED:
      return { ...state, loading: false, error: action.payload };

    case ActionTypes.PLAYLISTS_LOADED:
      return { ...state, loading: false, playlists: action.payload };

    case ActionTypes.PLAYLIST_ADDED:
      return {
        ...state,
        loading: false,
        playlists: [...state.playlists, action.payload],
      };

    case ActionTypes.PLAYLIST_DELETED:
      return {
        ...state,
        loading: false,
        playlists: state.playlists.filter((p) => p.id !== action.payload),
      };

    case ActionTypes.VIDEO_ADDED:
      return {
        ...state,
        loading: false,
        playlists: state.playlists.map((p) =>
          p.id === action.payload.playlistId
            ? { ...p, videos: [...p.videos, action.payload.video] }
            : p
        ),
      };

    default:
      return state;
  }
};