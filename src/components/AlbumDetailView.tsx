import React from 'react';
import {
  Dimensions,
  FlatList,
  Image,

  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Album, MediaItem } from '../types';
import { BackIcon, CheckIcon, PlayIcon, ShareIcon, StarIcon, TrashIcon } from './Icons';
import { SafeAreaView } from 'react-native-safe-area-context';
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HORIZONTAL_PADDING = 16;
const GAP = 8;
const NUM_COLUMNS = 4;
const ITEM_SIZE = (SCREEN_WIDTH - HORIZONTAL_PADDING * 2 - GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS;

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
  const renderItem = ({ item }: { item: MediaItem }) => {
    const isSelected = selectedIds.has(item.id);

    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => onPressItem(item)}
        onLongPress={() => onLongPressItem(item)}
        delayLongPress={300}
        activeOpacity={0.85}
      >
        <Image source={{ uri: item.uri }} style={styles.thumbnail} resizeMode="cover" />

        {/* Selected Highlight Overlay */}
        {isSelected && (
          <View style={styles.selectedBorderOverlay} pointerEvents="none" />
        )}

        {item.type === 'video' && (
          <View style={styles.videoBadge}>
            <PlayIcon size={12} color="#FFFFFF" />
            {item.duration && <Text style={styles.durationText}>{item.duration}</Text>}
          </View>
        )}

        {isSelectionMode && (
          <View style={styles.selectionOverlay}>
            {isSelected ? (
              <CheckIcon size={22} color="#FFFFFF" />
            ) : (
              <View style={styles.unselectedCircle} />
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

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
        keyExtractor={(item) => item.id}
        numColumns={NUM_COLUMNS}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        extraData={selectedIds.size + '_' + (isSelectionMode ? '1' : '0')}
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
  itemContainer: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#1E201B',
    position: 'relative',
  },
  selectedBorderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 2.5,
    borderColor: '#9DA74E',
    borderRadius: 10,
    backgroundColor: 'rgba(157, 167, 78, 0.15)',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  videoBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '600',
  },
  selectionOverlay: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  unselectedCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
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
