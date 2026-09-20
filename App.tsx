import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AlbumDetailView } from './src/components/AlbumDetailView';
import { AlbumsTab } from './src/components/AlbumsTab';
import { CameraModal } from './src/components/CameraModal';
import { CreateAlbumModal } from './src/components/CreateAlbumModal';
import { Header } from './src/components/Header';
import { MediaViewerModal } from './src/components/MediaViewerModal';
import { PhotosTab } from './src/components/PhotosTab';
import { ShareModal } from './src/components/ShareModal';
import { SortModal } from './src/components/SortModal';
import { TabSelector } from './src/components/TabSelector';
import {
  loadDeviceMediaAndAlbums,
  openRealDeviceCamera,
} from './src/services/mediaService';
import { ActiveTab, Album, MediaItem, SortType } from './src/types';

function AppContent() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('photos');
  const [activeDetailedAlbum, setActiveDetailedAlbum] = useState<Album | null>(null);

  // Selection Mode State
  const [isSelectionMode, setIsSelectionMode] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Sorting State
  const [sortType, setSortType] = useState<SortType>('date-desc');
  const [isSortModalOpen, setIsSortModalOpen] = useState<boolean>(false);

  // Modals
  const [viewingItem, setViewingItem] = useState<MediaItem | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [shareableItems, setShareableItems] = useState<MediaItem[]>([]);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState<boolean>(false);
  const [isCreateAlbumOpen, setIsCreateAlbumOpen] = useState<boolean>(false);

  // Loading States
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSavingPhoto, setIsSavingPhoto] = useState<boolean>(false);

  // Physical Back Press Handler
  useEffect(() => {
    const onBackPress = () => {
      // 1. Close Fullscreen Media Viewer
      if (viewingItem !== null) {
        setViewingItem(null);
        return true;
      }

      // 2. Close Camera Modal
      if (isCameraModalOpen) {
        setIsCameraModalOpen(false);
        return true;
      }

      // 3. Close Create Album Modal
      if (isCreateAlbumOpen) {
        setIsCreateAlbumOpen(false);
        return true;
      }

      // 4. Close Share Modal
      if (isShareModalOpen) {
        setIsShareModalOpen(false);
        return true;
      }

      // 5. Close Sort Modal
      if (isSortModalOpen) {
        setIsSortModalOpen(false);
        return true;
      }

      // 6. Exit Multi-Selection Mode
      if (isSelectionMode) {
        setIsSelectionMode(false);
        setSelectedIds(new Set());
        return true;
      }

      // 7. Exit Album Detail View back to Albums list
      if (activeDetailedAlbum !== null) {
        setActiveDetailedAlbum(null);
        return true;
      }

      // 8. If on Albums tab, return to Photos tab
      if (activeTab === 'albums') {
        setActiveTab('photos');
        return true;
      }

      // 9. Allow default behavior (minimize / exit app)
      return false;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [
    viewingItem,
    isCameraModalOpen,
    isCreateAlbumOpen,
    isShareModalOpen,
    isSortModalOpen,
    isSelectionMode,
    activeDetailedAlbum,
    activeTab,
  ]);

  // Load real device photos and albums on app start
  useEffect(() => {
    async function initDeviceMedia() {
      try {
        setIsLoading(true);
        const { media, albums: deviceAlbums } = await loadDeviceMediaAndAlbums();
        if (media && media.length > 0) {
          setMediaItems(media);
        }
        if (deviceAlbums && deviceAlbums.length > 0) {
          setAlbums(deviceAlbums);
        }
      } catch (err) {
        console.warn('Could not load device media:', err);
      } finally {
        setIsLoading(false);
      }
    }
    initDeviceMedia();
  }, []);

  // Sorted media items
  const sortedMedia = useMemo(() => {
    const list = [...mediaItems];
    switch (sortType) {
      case 'date-desc':
        return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      case 'date-asc':
        return list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      case 'size-desc':
        return list.sort((a, b) => b.sizeBytes - a.sizeBytes);
      case 'size-asc':
        return list.sort((a, b) => a.sizeBytes - b.sizeBytes);
      default:
        return list;
    }
  }, [mediaItems, sortType]);

  // Group into Month sections for the Photos tab
  const monthSections = useMemo(() => {
    const map = new Map<string, MediaItem[]>();

    sortedMedia.forEach((item) => {
      const sectionKey = item.monthSection;
      if (!map.has(sectionKey)) {
        map.set(sectionKey, []);
      }
      map.get(sectionKey)!.push(item);
    });

    return Array.from(map.entries()).map(([title, data]) => ({
      title,
      data,
    }));
  }, [sortedMedia]);

  // Media inside the currently open detailed album
  const detailedAlbumMedia = useMemo(() => {
    if (!activeDetailedAlbum) return [];
    if (activeDetailedAlbum.id === 'videos' || activeDetailedAlbum.id === 'video') {
      return sortedMedia.filter((item) => item.type === 'video');
    }
    return sortedMedia.filter((item) => item.albumId === activeDetailedAlbum.id);
  }, [activeDetailedAlbum, sortedMedia]);

  // Launch Real Camera
  const handlePressCamera = async () => {
    try {
      const capturedMedia = await openRealDeviceCamera();
      if (capturedMedia) {
        setIsSavingPhoto(true);
        // Automatically save and display immediately in the application
        setMediaItems((prev) => [capturedMedia, ...prev]);
        setAlbums((prev) => {
          const cameraAlbumExists = prev.some((a) => a.id === 'camera');
          if (cameraAlbumExists) {
            return prev.map((alb) =>
              alb.id === 'camera'
                ? { ...alb, count: alb.count + 1, coverUri: capturedMedia.uri }
                : alb
            );
          } else {
            const newCamAlbum: Album = {
              id: 'camera',
              title: 'Camera',
              coverUri: capturedMedia.uri,
              count: 1,
              mediaType: 'photo',
            };
            return [newCamAlbum, ...prev];
          }
        });

        // Clear saving indicator after brief saving feedback
        setTimeout(() => {
          setIsSavingPhoto(false);
        }, 500);
      }
    } catch (err) {
      setIsSavingPhoto(false);
      // Fallback to interactive camera modal if native camera isn't available
      setIsCameraModalOpen(true);
    }
  };

  // Selection handlers
  const handleItemPress = (item: MediaItem) => {
    if (isSelectionMode) {
      toggleItemSelection(item.id);
    } else {
      setViewingItem(item);
    }
  };

  const handleItemLongPress = (item: MediaItem) => {
    if (!isSelectionMode) {
      setIsSelectionMode(true);
      setSelectedIds(new Set([item.id]));
    } else {
      toggleItemSelection(item.id);
    }
  };

  const toggleItemSelection = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      if (next.size === 0) {
        setIsSelectionMode(false);
      }
      return next;
    });
  };

  const handleExitSelection = () => {
    setIsSelectionMode(false);
    setSelectedIds(new Set());
  };

  const handleSelectAll = () => {
    const targetPool = activeDetailedAlbum ? detailedAlbumMedia : sortedMedia;
    if (selectedIds.size === targetPool.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(targetPool.map((i) => i.id)));
    }
  };

  // Share handlers
  const handleShareSelected = () => {
    const selectedList = mediaItems.filter((i) => selectedIds.has(i.id));
    if (selectedList.length > 0) {
      setShareableItems(selectedList);
      setIsShareModalOpen(true);
    }
  };

  const handleShareSingle = (item: MediaItem) => {
    setShareableItems([item]);
    setIsShareModalOpen(true);
  };

  // Delete handlers
  const handleDeleteSelected = () => {
    const count = selectedIds.size;
    Alert.alert(
      'Delete Media',
      `Are you sure you want to delete ${count} ${count === 1 ? 'item' : 'items'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const remaining = mediaItems.filter((i) => !selectedIds.has(i.id));
            setMediaItems(remaining);

            // Update albums and automatically delete any album that has 0 items
            setAlbums((prev) =>
              prev
                .map((alb) => {
                  const albumMedia = remaining.filter((i) => {
                    if (alb.id === 'videos' || alb.id === 'video') return i.type === 'video';
                    return i.albumId === alb.id;
                  });
                  return {
                    ...alb,
                    count: albumMedia.length,
                    coverUri: albumMedia[0]?.uri || alb.coverUri,
                  };
                })
                .filter((alb) => alb.count > 0)
            );

            // If the active open album became empty, exit detail view
            if (activeDetailedAlbum) {
              const remainingInActive = remaining.filter((i) => {
                if (activeDetailedAlbum.id === 'videos' || activeDetailedAlbum.id === 'video') return i.type === 'video';
                return i.albumId === activeDetailedAlbum.id;
              });
              if (remainingInActive.length === 0) {
                setActiveDetailedAlbum(null);
              }
            }

            handleExitSelection();
          },
        },
      ]
    );
  };

  const handleDeleteSingle = (item: MediaItem) => {
    Alert.alert('Delete Media', `Are you sure you want to delete "${item.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          const remaining = mediaItems.filter((i) => i.id !== item.id);
          setMediaItems(remaining);

          // Update albums and automatically delete any album that has 0 items
          setAlbums((prev) =>
            prev
              .map((alb) => {
                const albumMedia = remaining.filter((i) => {
                  if (alb.id === 'videos' || alb.id === 'video') return i.type === 'video';
                  return i.albumId === alb.id;
                });
                return {
                  ...alb,
                  count: albumMedia.length,
                  coverUri: albumMedia[0]?.uri || alb.coverUri,
                };
              })
              .filter((alb) => alb.count > 0)
          );

          // If the active open album became empty, exit detail view
          if (activeDetailedAlbum) {
            const remainingInActive = remaining.filter((i) => {
              if (activeDetailedAlbum.id === 'videos' || activeDetailedAlbum.id === 'video') return i.type === 'video';
              return i.albumId === activeDetailedAlbum.id;
            });
            if (remainingInActive.length === 0) {
              setActiveDetailedAlbum(null);
            }
          }

          setViewingItem(null);
        },
      },
    ]);
  };

  const handleToggleFavoriteMedia = (itemId: string) => {
    setMediaItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
    if (viewingItem && viewingItem.id === itemId) {
      setViewingItem((prev) => (prev ? { ...prev, isFavorite: !prev.isFavorite } : null));
    }
  };

  const handleToggleFavoriteAlbum = (albumId: string) => {
    setAlbums((prev) =>
      prev.map((alb) =>
        alb.id === albumId ? { ...alb, isFavorite: !alb.isFavorite } : alb
      )
    );
    if (activeDetailedAlbum && activeDetailedAlbum.id === albumId) {
      setActiveDetailedAlbum((prev) =>
        prev ? { ...prev, isFavorite: !prev.isFavorite } : null
      );
    }
  };

  const handleSelectAlbum = (album: Album) => {
    setActiveDetailedAlbum(album);
  };

  const handleCreateAlbum = (newAlbum: Album, assignedMediaIds: string[]) => {
    if (assignedMediaIds.length > 0) {
      const assignedSet = new Set(assignedMediaIds);
      setMediaItems((prev) =>
        prev.map((item) =>
          assignedSet.has(item.id) ? { ...item, albumId: newAlbum.id } : item
        )
      );
    }
    setAlbums((prev) => [newAlbum, ...prev]);
  };

  const handleAddMediaFromCamera = (newMedia: MediaItem) => {
    setMediaItems((prev) => [newMedia, ...prev]);
    setAlbums((prev) => {
      const cameraAlbumExists = prev.some((a) => a.id === 'camera');
      if (cameraAlbumExists) {
        return prev.map((alb) =>
          alb.id === 'camera'
            ? { ...alb, count: alb.count + 1, coverUri: newMedia.uri }
            : alb
        );
      } else {
        const newCamAlbum: Album = {
          id: 'camera',
          title: 'Camera',
          coverUri: newMedia.uri,
          count: 1,
          mediaType: 'photo',
        };
        return [newCamAlbum, ...prev];
      }
    });
  };

  const activeSortLabel = useMemo(() => {
    switch (sortType) {
      case 'date-desc':
        return 'Date ↓';
      case 'date-asc':
        return 'Date ↑';
      case 'size-desc':
        return 'Size ↓';
      case 'size-asc':
        return 'Size ↑';
      default:
        return 'Sort';
    }
  }, [sortType]);

  // If inside an album detail view, render that view
  if (activeDetailedAlbum) {
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" />
        <AlbumDetailView
          album={activeDetailedAlbum}
          mediaItems={detailedAlbumMedia}
          selectedIds={selectedIds}
          isSelectionMode={isSelectionMode}
          onBack={() => {
            if (isSelectionMode) handleExitSelection();
            setActiveDetailedAlbum(null);
          }}
          onPressItem={handleItemPress}
          onLongPressItem={handleItemLongPress}
          onToggleFavoriteAlbum={handleToggleFavoriteAlbum}
          onShareSelected={handleShareSelected}
          onDeleteSelected={handleDeleteSelected}
          onExitSelection={handleExitSelection}
        />

        {/* Modals inside Album view */}
        <MediaViewerModal
          visible={!!viewingItem}
          initialItem={viewingItem}
          allItems={detailedAlbumMedia}
          onClose={() => setViewingItem(null)}
          onShare={handleShareSingle}
          onDelete={handleDeleteSingle}
          onToggleFavorite={handleToggleFavoriteMedia}
        />

        <ShareModal
          visible={isShareModalOpen}
          items={shareableItems}
          onClose={() => setIsShareModalOpen(false)}
        />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      {/* Top Header */}
      <Header
        isSelectionMode={isSelectionMode}
        selectedCount={selectedIds.size}
        totalCount={sortedMedia.length}
        onExitSelection={handleExitSelection}
        onSelectAll={handleSelectAll}
        onShareSelected={handleShareSelected}
        onDeleteSelected={handleDeleteSelected}
        onOpenSort={() => setIsSortModalOpen(true)}
        onPressCamera={handlePressCamera}
        activeSortLabel={activeSortLabel}
      />

      {/* Segmented Dual Tab: Photos / Albums */}
      <TabSelector
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (isSelectionMode) handleExitSelection();
          setActiveTab(tab);
        }}
      />

      {/* Content Area */}
      <View style={styles.mainContainer}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#9DA74E" />
            <Text style={styles.loadingText}>Accessing device media...</Text>
          </View>
        ) : activeTab === 'photos' ? (
          <PhotosTab
            sections={monthSections}
            selectedIds={selectedIds}
            isSelectionMode={isSelectionMode}
            onPressItem={handleItemPress}
            onLongPressItem={handleItemLongPress}
          />
        ) : (
          <AlbumsTab
            albums={albums}
            onSelectAlbum={handleSelectAlbum}
            onToggleFavoriteAlbum={handleToggleFavoriteAlbum}
            onPressCreateAlbum={() => setIsCreateAlbumOpen(true)}
          />
        )}
      </View>

      {/* Sort Sheet Modal */}
      <SortModal
        visible={isSortModalOpen}
        activeSort={sortType}
        onSelectSort={setSortType}
        onClose={() => setIsSortModalOpen(false)}
      />

      {/* Share Sheet Modal */}
      <ShareModal
        visible={isShareModalOpen}
        items={shareableItems}
        onClose={() => setIsShareModalOpen(false)}
      />

      {/* Fullscreen Media Viewer Modal with Carousel Navigation */}
      <MediaViewerModal
        visible={!!viewingItem}
        initialItem={viewingItem}
        allItems={sortedMedia}
        onClose={() => setViewingItem(null)}
        onShare={handleShareSingle}
        onDelete={handleDeleteSingle}
        onToggleFavorite={handleToggleFavoriteMedia}
      />

      {/* Interactive Camera Modal */}
      <CameraModal
        visible={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onAddMedia={handleAddMediaFromCamera}
      />

      {/* Create New Album Modal */}
      <CreateAlbumModal
        visible={isCreateAlbumOpen}
        availableMedia={mediaItems}
        onClose={() => setIsCreateAlbumOpen(false)}
        onCreateAlbum={handleCreateAlbum}
      />

      {/* Saving Photo Loading Overlay */}
      {isSavingPhoto && (
        <Modal transparent animationType="fade" visible={isSavingPhoto}>
          <View style={styles.savingOverlay}>
            <View style={styles.savingCard}>
              <ActivityIndicator size="large" color="#9DA74E" />
              <Text style={styles.savingText}>Saving photo to gallery...</Text>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F100D',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#0F100D',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    gap: 16,
  },
  loadingText: {
    color: '#ACB299',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  savingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  savingCard: {
    backgroundColor: '#1C1D17',
    paddingHorizontal: 28,
    paddingVertical: 22,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: '#303425',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  savingText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
