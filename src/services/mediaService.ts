import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { PermissionsAndroid, Platform } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Album, MediaItem } from '../types';

/**
 * Request required storage and camera permissions on Android
 */
export async function requestMediaPermissions(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return true;
  }

  try {
    const androidVersion = Platform.Version as number;

    if (androidVersion >= 33) {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
      ]);

      return (
        granted[PermissionsAndroid.PERMISSIONS.CAMERA] === PermissionsAndroid.RESULTS.GRANTED &&
        (granted[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] === PermissionsAndroid.RESULTS.GRANTED ||
          granted[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] === PermissionsAndroid.RESULTS.GRANTED)
      );
    } else {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);

      return (
        granted[PermissionsAndroid.PERMISSIONS.CAMERA] === PermissionsAndroid.RESULTS.GRANTED &&
        granted[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED
      );
    }
  } catch (err) {
    console.warn('Error requesting permissions:', err);
    return false;
  }
}

/**
 * Format bytes to readable size
 */
export function formatBytes(bytes: number): string {
  if (!bytes || bytes === 0) return '0 B';
  if (bytes > 1024 * 1024 * 1024) {
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  }
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

/**
 * Get Month and Year from ISO date string or timestamp
 */
export function getMonthSection(timestampSecOrMs: number): { month: string; year: number; sectionKey: string } {
  const date = new Date(timestampSecOrMs > 10000000000 ? timestampSecOrMs : timestampSecOrMs * 1000);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  return {
    month,
    year,
    sectionKey: `${month} ${year}`,
  };
}

/**
 * Extract distinct real mobile gallery album names (Screenshots, WhatsApp, Instagram, Downloads, Camera, etc.)
 */
function extractAlbumName(groupNameRaw: any, uri: string, filename?: string): { albumId: string; albumTitle: string } {
  const uriLower = (uri || '').toLowerCase();
  const fileLower = (filename || '').toLowerCase();

  // 1. Check for specific application/folder markers in URI or filename
  if (uriLower.includes('screenshot') || fileLower.includes('screenshot')) {
    return { albumId: 'screenshots', albumTitle: 'Screenshots' };
  }
  if (uriLower.includes('whatsapp') || fileLower.includes('whatsapp')) {
    return { albumId: 'whatsapp', albumTitle: 'WhatsApp' };
  }
  if (uriLower.includes('instagram') || fileLower.includes('instagram')) {
    return { albumId: 'instagram', albumTitle: 'Instagram' };
  }
  if (uriLower.includes('download') || fileLower.includes('download')) {
    return { albumId: 'downloads', albumTitle: 'Downloads' };
  }
  if (uriLower.includes('snapchat') || fileLower.includes('snapchat')) {
    return { albumId: 'snapchat', albumTitle: 'Snapchat' };
  }
  if (uriLower.includes('telegram') || fileLower.includes('telegram')) {
    return { albumId: 'telegram', albumTitle: 'Telegram' };
  }
  if (uriLower.includes('twitter') || uriLower.includes('/x/') || fileLower.includes('twitter')) {
    return { albumId: 'twitter', albumTitle: 'Twitter' };
  }
  if (uriLower.includes('facebook') || fileLower.includes('facebook')) {
    return { albumId: 'facebook', albumTitle: 'Facebook' };
  }
  if (uriLower.includes('dcim/camera') || uriLower.includes('/camera/')) {
    return { albumId: 'camera', albumTitle: 'Camera' };
  }
  if (uriLower.includes('screen_recorder') || uriLower.includes('screenrecorder') || uriLower.includes('/movies/')) {
    return { albumId: 'screen_recordings', albumTitle: 'Screen Recordings' };
  }

  // 2. Check group_name array or string
  if (Array.isArray(groupNameRaw) && groupNameRaw.length > 0) {
    // Look for the most specific non-generic folder in the array
    for (const group of groupNameRaw) {
      if (typeof group === 'string') {
        const gLower = group.toLowerCase().trim();
        if (gLower.includes('screenshot')) return { albumId: 'screenshots', albumTitle: 'Screenshots' };
        if (gLower.includes('whatsapp')) return { albumId: 'whatsapp', albumTitle: 'WhatsApp' };
        if (gLower.includes('instagram')) return { albumId: 'instagram', albumTitle: 'Instagram' };
        if (gLower.includes('download')) return { albumId: 'downloads', albumTitle: 'Downloads' };
        if (gLower.includes('snapchat')) return { albumId: 'snapchat', albumTitle: 'Snapchat' };
        if (gLower.includes('telegram')) return { albumId: 'telegram', albumTitle: 'Telegram' };
        if (gLower.includes('camera')) return { albumId: 'camera', albumTitle: 'Camera' };
      }
    }
    // If no specific match, pick the last non-empty element (most specific subfolder)
    const specificGroup = groupNameRaw.filter((g) => typeof g === 'string' && g !== 'DCIM' && g !== 'Pictures' && g !== 'External').pop();
    if (specificGroup) {
      const cleanTitle = specificGroup.charAt(0).toUpperCase() + specificGroup.slice(1);
      return { albumId: cleanTitle.toLowerCase().replace(/[^a-z0-9]/g, '_'), albumTitle: cleanTitle };
    }
  } else if (typeof groupNameRaw === 'string' && groupNameRaw.trim().length > 0) {
    const rawTrimmed = groupNameRaw.trim();
    const gLower = rawTrimmed.toLowerCase();
    if (gLower.includes('screenshot')) return { albumId: 'screenshots', albumTitle: 'Screenshots' };
    if (gLower.includes('whatsapp')) return { albumId: 'whatsapp', albumTitle: 'WhatsApp' };
    if (gLower.includes('instagram')) return { albumId: 'instagram', albumTitle: 'Instagram' };
    if (gLower.includes('download')) return { albumId: 'downloads', albumTitle: 'Downloads' };
    if (gLower.includes('snapchat')) return { albumId: 'snapchat', albumTitle: 'Snapchat' };
    if (gLower.includes('telegram')) return { albumId: 'telegram', albumTitle: 'Telegram' };
    if (gLower !== 'dcim' && gLower !== 'pictures' && gLower !== 'external') {
      const cleanTitle = rawTrimmed.charAt(0).toUpperCase() + rawTrimmed.slice(1);
      return { albumId: cleanTitle.toLowerCase().replace(/[^a-z0-9]/g, '_'), albumTitle: cleanTitle };
    }
  }

  // 3. Fallback default
  return { albumId: 'camera', albumTitle: 'Camera' };
}

/**
 * Fetch real media from device CameraRoll and group into real device albums
 */
export async function loadDeviceMediaAndAlbums(): Promise<{
  media: MediaItem[];
  albums: Album[];
}> {
  try {
    const hasPermission = await requestMediaPermissions();
    if (!hasPermission) {
      return { media: [], albums: [] };
    }

    // Fetch photos & videos directly from real device
    const photosResult = await CameraRoll.getPhotos({
      first: 500,
      assetType: 'All',
      include: ['fileSize', 'playableDuration', 'filename'],
    });

    if (photosResult && photosResult.edges.length > 0) {
      const deviceMedia: MediaItem[] = photosResult.edges.map((edge, idx) => {
        const node = edge.node;
        const timestampMs = node.timestamp ? node.timestamp * 1000 : Date.now();
        const { sectionKey, year } = getMonthSection(timestampMs);
        const size = node.image.fileSize || 0;
        const isVideo = node.type?.includes('video') || !!node.image.playableDuration;

        let durationStr: string | undefined;
        if (node.image.playableDuration) {
          const totalSec = Math.round(node.image.playableDuration);
          const mins = Math.floor(totalSec / 60);
          const secs = totalSec % 60;
          durationStr = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        }

        const { albumId } = extractAlbumName(node.group_name, node.image.uri, node.image.filename || undefined);

        return {
          id: 'dev_' + idx + '_' + (node.timestamp || Date.now()),
          uri: node.image.uri,
          type: isVideo ? 'video' : 'photo',
          title: node.image.filename || (isVideo ? 'Video' : 'Photo') + ` ${idx + 1}`,
          date: new Date(timestampMs).toISOString(),
          monthSection: sectionKey, // "April 2026", "December 2025", etc.
          year,
          sizeBytes: size,
          sizeFormatted: formatBytes(size),
          duration: durationStr,
          albumId: albumId,
          width: node.image.width,
          height: node.image.height,
          isFavorite: false,
        };
      });

      // Group all media into real device albums (Screenshots, WhatsApp, Instagram, Camera, Downloads, etc.)
      const albumMap = new Map<
        string,
        { title: string; count: number; coverUri: string; hasVideosOnly: boolean; hasPhotosOnly: boolean }
      >();

      deviceMedia.forEach((m) => {
        const { albumId, albumTitle } = extractAlbumName(m.albumId, m.uri, m.title);

        if (!albumMap.has(albumId)) {
          albumMap.set(albumId, {
            title: albumTitle,
            count: 0,
            coverUri: m.uri,
            hasVideosOnly: m.type === 'video',
            hasPhotosOnly: m.type === 'photo',
          });
        }

        const entry = albumMap.get(albumId)!;
        entry.count += 1;
        if (m.type !== 'video') entry.hasVideosOnly = false;
        if (m.type !== 'photo') entry.hasPhotosOnly = false;
      });

      // If videos exist on device, add a dedicated "Videos" album
      const videoItems = deviceMedia.filter((m) => m.type === 'video');
      if (videoItems.length > 0 && !albumMap.has('videos')) {
        albumMap.set('videos', {
          title: 'Videos',
          count: videoItems.length,
          coverUri: videoItems[0].uri,
          hasVideosOnly: true,
          hasPhotosOnly: false,
        });
      }

      // Convert map to Album array
      const deviceAlbums: Album[] = Array.from(albumMap.entries()).map(([id, info]) => ({
        id,
        title: info.title,
        count: info.count,
        coverUri: info.coverUri,
        mediaType: info.hasVideosOnly ? 'video' : info.hasPhotosOnly ? 'photo' : 'all',
        isFavorite: id === 'camera' || id === 'screenshots' || id === 'whatsapp' || id === 'videos',
      }));

      return {
        media: deviceMedia,
        albums: deviceAlbums,
      };
    }

    return { media: [], albums: [] };
  } catch (error) {
    console.warn('Error loading real device media:', error);
    return { media: [], albums: [] };
  }
}

/**
 * Open real native camera, click photo, save to device storage, and return as MediaItem
 */
export async function openRealDeviceCamera(): Promise<MediaItem | null> {
  try {
    await requestMediaPermissions();

    const result = await launchCamera({
      mediaType: 'photo',
      saveToPhotos: true, // Saves directly to device gallery/camera roll
      quality: 1,
      includeExtra: true,
    });

    if (result.didCancel || !result.assets || result.assets.length === 0) {
      return null;
    }

    const asset = result.assets[0];
    if (!asset.uri) return null;

    const now = new Date();
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear();
    const size = asset.fileSize || 0;

    const newMedia: MediaItem = {
      id: 'cam_' + Date.now(),
      uri: asset.uri,
      type: 'photo',
      title: asset.fileName || `Photo ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      date: now.toISOString(),
      monthSection: `${month} ${year}`,
      year,
      sizeBytes: size,
      sizeFormatted: formatBytes(size),
      albumId: 'camera',
      width: asset.width,
      height: asset.height,
      isFavorite: false,
    };

    return newMedia;
  } catch (error) {
    console.warn('Error launching camera:', error);
    return null;
  }
}

/**
 * Pick real photos/videos from device library
 */
export async function importFromDeviceLibrary(): Promise<MediaItem[]> {
  try {
    await requestMediaPermissions();

    const result = await launchImageLibrary({
      mediaType: 'mixed',
      selectionLimit: 0,
      includeExtra: true,
    });

    if (result.didCancel || !result.assets || result.assets.length === 0) {
      return [];
    }

    const now = new Date();
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear();

    return result.assets
      .filter((asset) => !!asset.uri)
      .map((asset, idx) => {
        const isVideo = asset.type?.includes('video') || !!asset.duration;
        const size = asset.fileSize || 0;

        let durationStr: string | undefined;
        if (asset.duration) {
          const totalSec = Math.round(asset.duration);
          const mins = Math.floor(totalSec / 60);
          const secs = totalSec % 60;
          durationStr = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        }

        const { albumId } = extractAlbumName(undefined, asset.uri || '', asset.fileName);

        return {
          id: 'imported_' + Date.now() + '_' + idx,
          uri: asset.uri!,
          type: isVideo ? 'video' : 'photo',
          title: asset.fileName || (isVideo ? 'Imported Video' : 'Imported Photo') + ` ${idx + 1}`,
          date: now.toISOString(),
          monthSection: `${month} ${year}`,
          year,
          sizeBytes: size,
          sizeFormatted: formatBytes(size),
          duration: durationStr,
          albumId: albumId,
          width: asset.width,
          height: asset.height,
          isFavorite: false,
        };
      });
  } catch (error) {
    console.warn('Error importing from library:', error);
    return [];
  }
}
