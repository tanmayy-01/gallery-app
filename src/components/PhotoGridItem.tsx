import React, { memo } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MediaItem } from '../types';
import { CheckIcon, PlayIcon } from './Icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
export const HORIZONTAL_PADDING = 16;
export const GAP = 8;
export const NUM_COLUMNS = 4;
export const ITEM_SIZE = Math.floor(
  (SCREEN_WIDTH - HORIZONTAL_PADDING * 2 - GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS
);

export interface PhotoGridItemProps {
  item: MediaItem;
  isSelected: boolean;
  isSelectionMode: boolean;
  onPress: (item: MediaItem) => void;
  onLongPress: (item: MediaItem) => void;
}

export const PhotoGridItem = memo<PhotoGridItemProps>(
  ({ item, isSelected, isSelectionMode, onPress, onLongPress }) => {
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => onPress(item)}
        onLongPress={() => onLongPress(item)}
        delayLongPress={180}
        activeOpacity={0.7}
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
          <View style={styles.videoBadge} pointerEvents="none">
            <PlayIcon size={12} color="#FFFFFF" />
            {item.duration && (
              <Text style={styles.durationText}>{item.duration}</Text>
            )}
          </View>
        )}

        {/* Selection Indicator */}
        {isSelectionMode && (
          <View style={styles.selectionOverlay} pointerEvents="none">
            {isSelected ? (
              <CheckIcon size={22} color="#FFFFFF" />
            ) : (
              <View style={styles.unselectedCircle} />
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.isSelected === nextProps.isSelected &&
      prevProps.isSelectionMode === nextProps.isSelectionMode &&
      prevProps.item.id === nextProps.item.id &&
      prevProps.item.uri === nextProps.item.uri &&
      prevProps.onPress === nextProps.onPress &&
      prevProps.onLongPress === nextProps.onLongPress
    );
  }
);

const styles = StyleSheet.create({
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
    backgroundColor: 'rgba(157, 167, 78, 0.22)',
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
});
