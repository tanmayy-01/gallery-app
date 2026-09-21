import { SortOptionItem } from "../types";

export const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const SCENE_PREVIEWS = [
  {
    uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
    title: 'Yosemite Alpine Valley',
  },
  {
    uri: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1000&q=80',
    title: 'Starry Mountain Night',
  },
  {
    uri: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1000&q=80',
    title: 'Golden Sunset Mist',
  },
  {
    uri: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1000&q=80',
    title: 'Lake Reflection & Canoes',
  },
  {
    uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80',
    title: 'Outdoor Sunny Portrait',
  },
];

export const SORT_OPTIONS: SortOptionItem[] = [
  {
    key: 'date-desc',
    title: 'Date: Newest First',
    subtitle: 'Recent media appears at top',
    category: 'Date',
  },
  {
    key: 'date-asc',
    title: 'Date: Oldest First',
    subtitle: 'Oldest media appears first',
    category: 'Date',
  },
  {
    key: 'size-desc',
    title: 'Size: Largest First',
    subtitle: 'High capacity media first',
    category: 'Size',
  },
  {
    key: 'size-asc',
    title: 'Size: Smallest First',
    subtitle: 'Low capacity media first',
    category: 'Size',
  },
];
