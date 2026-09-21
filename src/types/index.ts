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

export interface AlbumDetailViewProps {
  album: Album;
  mediaItems: MediaItem[];
  selectedIds: Set<string>;
  isSelectionMode: boolean;
  onBack: () => void;
  onPressItem: (item: MediaItem) => void;
  onLongPressItem: (item: MediaItem) => void;
  onToggleFavoriteAlbum?: (albumId: string) => void;
  onShareSelected?: () => void;
  onDeleteSelected?: () => void;
  onExitSelection?: () => void;
}

export interface AlbumsTabProps {
  albums: Album[];
  onSelectAlbum: (album: Album) => void;
  onToggleFavoriteAlbum?: (albumId: string) => void;
  onPressCreateAlbum: () => void;
}

export interface CreateAlbumModalProps {
  visible: boolean;
  availableMedia: MediaItem[];
  onClose: () => void;
  onCreateAlbum: (newAlbum: Album, selectedMediaIds: string[]) => void;
}

export interface HeaderProps {
  isSelectionMode: boolean;
  selectedCount: number;
  totalCount: number;
  onExitSelection: () => void;
  onSelectAll: () => void;
  onShareSelected: () => void;
  onDeleteSelected: () => void;
  onOpenSort: () => void;
  onPressCamera: () => void;
  activeSortLabel: string;
}

export interface MediaViewerModalProps {
  visible: boolean;
  initialItem: MediaItem | null;
  allItems: MediaItem[];
  onClose: () => void;
  onShare: (item: MediaItem) => void;
  onDelete: (item: MediaItem) => void;
  onToggleFavorite?: (itemId: string) => void;
}

export interface PhotoGridItemProps {
  item: MediaItem;
  isSelected: boolean;
  isSelectionMode: boolean;
  onPress: (item: MediaItem) => void;
  onLongPress: (item: MediaItem) => void;
}

export interface MonthSectionData {
  title: string;
  data: MediaItem[];
}

export interface PhotosTabProps {
  sections: MonthSectionData[];
  selectedIds: Set<string>;
  isSelectionMode: boolean;
  onPressItem: (item: MediaItem) => void;
  onLongPressItem: (item: MediaItem) => void;
  activeAlbumTitle?: string | null;
  onClearAlbumFilter?: () => void;
}

export interface SectionBlockProps {
  section: MonthSectionData;
  selectedIds: Set<string>;
  isSelectionMode: boolean;
  onPressItem: (item: MediaItem) => void;
  onLongPressItem: (item: MediaItem) => void;
}

export interface ShareModalProps {
  visible: boolean;
  items: MediaItem[];
  onClose: () => void;
}

export interface ShareDestination {
  id: string;
  name: string;
  color: string;
  iconName: string;
  social?: string;
  packageName?: string;
}

export interface SortModalProps {
  visible: boolean;
  activeSort: SortType;
  onSelectSort: (sort: SortType) => void;
  onClose: () => void;
}

export interface SortOptionItem {
  key: SortType;
  title: string;
  subtitle: string;
  category: 'Date' | 'Size';
}

export interface TabSelectorProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
}
