import React, { memo, useCallback } from 'react';
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MediaItem, MonthSectionData, PhotosTabProps, SectionBlockProps } from '../types';
import { GAP, HORIZONTAL_PADDING, PhotoGridItem } from './PhotoGridItem';


const SectionBlock = memo<SectionBlockProps>(
  ({ section, selectedIds, isSelectionMode, onPressItem, onLongPressItem }) => {
    return (
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <Text style={styles.sectionCount}>{section.data.length} items</Text>
        </View>

        <View style={styles.gridContainer}>
          {section.data.map((item) => (
            <PhotoGridItem
              key={item.id}
              item={item}
              isSelected={selectedIds.has(item.id)}
              isSelectionMode={isSelectionMode}
              onPress={onPressItem}
              onLongPress={onLongPressItem}
            />
          ))}
        </View>
      </View>
    );
  }
);

export const PhotosTab: React.FC<PhotosTabProps> = ({
  sections,
  selectedIds,
  isSelectionMode,
  onPressItem,
  onLongPressItem,
  activeAlbumTitle,
  onClearAlbumFilter,
}) => {
  const renderSection = useCallback(
    ({ item: section }: { item: MonthSectionData }) => (
      <SectionBlock
        section={section}
        selectedIds={selectedIds}
        isSelectionMode={isSelectionMode}
        onPressItem={onPressItem}
        onLongPressItem={onLongPressItem}
      />
    ),
    [selectedIds, isSelectionMode, onPressItem, onLongPressItem]
  );

  const keyExtractor = useCallback((item: MonthSectionData) => item.title, []);

  return (
    <FlatList
      data={sections}
      renderItem={renderSection}
      keyExtractor={keyExtractor}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      initialNumToRender={3}
      maxToRenderPerBatch={4}
      windowSize={7}
      removeClippedSubviews={Platform.OS === 'android'}
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
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
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
