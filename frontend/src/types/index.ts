export interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
  videoId: string;
  duration?: string;
  addedAt: string;
}

export interface Playlist {
  id: string;
  name: string;
  videos: VideoItem[];
  createdAt: string;
  updatedAt: string;
}