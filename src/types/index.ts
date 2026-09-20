export type MediaType = 'photo' | 'video';

export interface MediaItem {
  id: string;
  uri: string;
  type: MediaType;
  title: string;
  date: string; // ISO format e.g. '2026-04-14T10:30:00Z'
  monthSection: string; // e.g. 'April', 'March', 'February', 'December'
  year: number;
  sizeBytes: number; // in bytes e.g. 3500000 (3.5MB)
  sizeFormatted: string; // e.g. '3.5 MB'
  duration?: string; // for videos, e.g. '0:45'
  albumId: string;
  width?: number;
  height?: number;
  isFavorite?: boolean;
}

export interface Album {
  id: string;
  title: string;
  coverUri: string;
  count: number;
  mediaType: MediaType | 'all';
  isFavorite?: boolean;
  accentColor?: string;
}

export type SortType = 'date-desc' | 'date-asc' | 'size-desc' | 'size-asc';

export type ActiveTab = 'photos' | 'albums';
