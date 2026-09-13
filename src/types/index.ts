export interface Track {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration: string;
  durationSeconds: number;
  album?: string;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  tracks: Track[];
  coverColor?: string;
  createdAt: number;
}

export type RepeatMode = 'off' | 'all' | 'one';

export interface BrowseCategory {
  id: string;
  name: string;
  color: string;
  searchQuery: string;
}

export type ActiveTab = 'home' | 'search' | 'library';
