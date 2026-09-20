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
import { MediaItem } from '../types';
import { CheckIcon, PlayIcon } from './Icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HORIZONTAL_PADDING = 16;
const GAP = 8;
const NUM_COLUMNS = 4;
const ITEM_SIZE = (SCREEN_WIDTH - HORIZONTAL_PADDING * 2 - GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS;

interface MonthSectionData {
  title: string;
  data: MediaItem[];
}

interface PhotosTabProps {
  sections: MonthSectionData[];
  selectedIds: Set<string>;
  isSelectionMode: boolean;
  onPressItem: (item: MediaItem) => void;
  onLongPressItem: (item: MediaItem) => void;
  activeAlbumTitle?: string | null;
  onClearAlbumFilter?: () => void;
}

export const PhotosTab: React.FC<PhotosTabProps> = ({
  sections,
  selectedIds,
  isSelectionMode,
  onPressItem,
  onLongPressItem,
  activeAlbumTitle,
  onClearAlbumFilter,
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
        <Image
          source={{ uri: item.uri }}
          style={styles.thumbnail}
          resizeMode="cover"
        />

        {/* Selected Highlight Overlay */}
        {isSelected && (
          <View style={styles.selectedBorderOverlay} pointerEvents="none" />
        )}

        {/* Video Duration Badge */}
        {item.type === 'video' && (
          <View style={styles.videoBadge}>
            <PlayIcon size={12} color="#FFFFFF" />
            {item.duration && (
              <Text style={styles.durationText}>{item.duration}</Text>
            )}
          </View>
        )}

        {/* Selection Indicator */}
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

  const renderSection = ({ item: section }: { item: MonthSectionData }) => {
    return (
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <Text style={styles.sectionCount}>{section.data.length} items</Text>
        </View>

        <FlatList
          data={section.data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={NUM_COLUMNS}
          scrollEnabled={false}
          columnWrapperStyle={styles.columnWrapper}
          extraData={selectedIds.size + '_' + (isSelectionMode ? '1' : '0')}
        />
      </View>
    );
  };

  return (
    <FlatList
      data={sections}
      renderItem={renderSection}
      keyExtractor={(item) => item.title}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      extraData={selectedIds.size + '_' + (isSelectionMode ? '1' : '0')}
      ListHeaderComponent={
        activeAlbumTitle ? (
          <View style={styles.filterBanner}>
            <Text style={styles.filterBannerText}>
              Viewing Album: <Text style={styles.filterAlbumName}>{activeAlbumTitle}</Text>
            </Text>
            <TouchableOpacity
              onPress={onClearAlbumFilter}
              style={styles.clearFilterBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.clearFilterText}>Show All</Text>
            </TouchableOpacity>
          </View>
        ) : undefined
      }
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No Media Found</Text>
          <Text style={styles.emptySubtitle}>
            There are no photos or videos to display in this view.
          </Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingBottom: 40,
  },
  filterBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#20221A',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#383C2A',
  },
  filterBannerText: {
    color: '#D4DAC2',
    fontSize: 14,
  },
  filterAlbumName: {
    fontWeight: '700',
    color: '#9DA74E',
  },
  clearFilterBtn: {
    backgroundColor: '#333722',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  clearFilterText: {
    color: '#EBF4A8',
    fontSize: 12,
    fontWeight: '600',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  sectionCount: {
    fontSize: 13,
    color: '#7F846B',
    fontWeight: '500',
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
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#808080',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
