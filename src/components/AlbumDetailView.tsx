import React, { useCallback } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Album, MediaItem } from '../types';
import { BackIcon, ShareIcon, StarIcon, TrashIcon } from './Icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GAP, HORIZONTAL_PADDING, NUM_COLUMNS, PhotoGridItem } from './PhotoGridItem';

interface AlbumDetailViewProps {
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

export const AlbumDetailView: React.FC<AlbumDetailViewProps> = ({
  album,
  mediaItems,
  selectedIds,
  isSelectionMode,
  onBack,
  onPressItem,
  onLongPressItem,
  onToggleFavoriteAlbum,
  onShareSelected,
  onDeleteSelected,
  onExitSelection,
}) => {
  const renderItem = useCallback(
    ({ item }: { item: MediaItem }) => (
      <PhotoGridItem
        item={item}
        isSelected={selectedIds.has(item.id)}
        isSelectionMode={isSelectionMode}
        onPress={onPressItem}
        onLongPress={onLongPressItem}
      />
    ),
    [selectedIds, isSelectionMode, onPressItem, onLongPressItem]
  );

  const keyExtractor = useCallback((item: MediaItem) => item.id, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
          <BackIcon size={26} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {album.title}
          </Text>
          <Text style={styles.headerSubtitle}>
            {mediaItems.length}{' '}
            {album.mediaType === 'video'
              ? 'Videos'
              : album.mediaType === 'photo'
              ? 'Photos'
              : 'Items'}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => onToggleFavoriteAlbum?.(album.id)}
          style={styles.favBtn}
          activeOpacity={0.7}
        >
          <StarIcon size={18} filled={album.isFavorite} />
        </TouchableOpacity>
      </View>

      {/* Selection toolbar within album if active */}
      {isSelectionMode && (
        <View style={styles.selectionToolbar}>
          <Text style={styles.selectionCount}>{selectedIds.size} selected</Text>
          <View style={styles.selectionActions}>
            <TouchableOpacity
              onPress={onShareSelected}
              disabled={selectedIds.size === 0}
              style={[styles.actionBtn, selectedIds.size === 0 && styles.btnDisabled]}
            >
              <ShareIcon size={16} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onDeleteSelected}
              disabled={selectedIds.size === 0}
              style={[styles.actionBtn, styles.deleteBtn, selectedIds.size === 0 && styles.btnDisabled]}
            >
              <TrashIcon size={16} color="#FF453A" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onExitSelection} style={styles.cancelBtn}>
              <Text style={styles.cancelBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Media Grid */}
      <FlatList
        data={mediaItems}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={NUM_COLUMNS}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={16}
        maxToRenderPerBatch={16}
        windowSize={7}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>This Album is Empty</Text>
            <Text style={styles.emptySubtitle}>
              Take photos with the camera or add media to this album.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F100D',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#20221A',
  },
  backBtn: {
    padding: 6,
  },
  headerTitleContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#8A9076',
    marginTop: 1,
  },
  favBtn: {
    padding: 6,
  },
  selectionToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#1C1E16',
    borderBottomWidth: 1,
    borderBottomColor: '#2E3223',
  },
  selectionCount: {
    fontSize: 15,
    fontWeight: '700',
    color: '#DCE49B',
  },
  selectionActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2A2E20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtn: {
    backgroundColor: '#381E1E',
  },
  btnDisabled: {
    opacity: 0.4,
  },
  cancelBtn: {
    backgroundColor: '#9DA74E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  cancelBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 16,
    paddingBottom: 40,
  },
  columnWrapper: {
    gap: GAP,
    marginBottom: GAP,
  },
  emptyContainer: {
    paddingVertical: 80,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#8A9076',
    textAlign: 'center',
  },
});
