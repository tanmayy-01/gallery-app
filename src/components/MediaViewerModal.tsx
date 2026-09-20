import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { MediaItem } from '../types';
import { BackIcon, PlayIcon, ShareIcon, StarIcon, TrashIcon } from './Icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface MediaViewerModalProps {
  visible: boolean;
  initialItem: MediaItem | null;
  allItems: MediaItem[];
  onClose: () => void;
  onShare: (item: MediaItem) => void;
  onDelete: (item: MediaItem) => void;
  onToggleFavorite?: (itemId: string) => void;
}

export const MediaViewerModal: React.FC<MediaViewerModalProps> = ({
  visible,
  initialItem,
  allItems,
  onClose,
  onShare,
  onDelete,
  onToggleFavorite,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  // Sync index when initialItem changes
  React.useEffect(() => {
    if (initialItem && allItems.length > 0) {
      const idx = allItems.findIndex((i) => i.id === initialItem.id);
      if (idx !== -1) {
        setCurrentIndex(idx);
      }
    }
  }, [initialItem, allItems]);

  if (!initialItem || allItems.length === 0) return null;

  const currentItem = allItems[currentIndex] || initialItem;

  const formattedDate = new Date(currentItem.date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleNext = () => {
    if (currentIndex < allItems.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsPlaying(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsPlaying(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Top Floating Action Bar */}
        {showControls && (
          <SafeAreaView style={styles.topSafeArea}>
            <View style={styles.topBar}>
              <TouchableOpacity onPress={onClose} style={styles.iconCircle} activeOpacity={0.7}>
                <BackIcon size={24} color="#FFFFFF" />
              </TouchableOpacity>

              <View style={styles.topTitleWrapper}>
                <Text style={styles.topTitle} numberOfLines={1}>
                  {currentItem.title}
                </Text>
                <Text style={styles.topSubtitle}>
                  {currentIndex + 1} of {allItems.length} • {currentItem.monthSection}
                </Text>
              </View>

              <View style={styles.topActions}>
                <TouchableOpacity
                  onPress={() => onToggleFavorite?.(currentItem.id)}
                  style={styles.iconCircle}
                  activeOpacity={0.7}
                >
                  <StarIcon size={18} filled={currentItem.isFavorite} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onShare(currentItem)}
                  style={styles.iconCircle}
                  activeOpacity={0.7}
                >
                  <ShareIcon size={18} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        )}

        {/* Center Media View with tap to toggle controls */}
        <TouchableWithoutFeedback onPress={() => setShowControls((prev) => !prev)}>
          <View style={styles.mediaContainer}>
            <Image
              source={{ uri: currentItem.uri }}
              style={styles.fullImage}
              resizeMode="contain"
            />

            {/* Previous Arrow Navigation */}
            {currentIndex > 0 && showControls && (
              <TouchableOpacity style={styles.navArrowLeft} onPress={handlePrev} activeOpacity={0.8}>
                <Text style={styles.navArrowText}>‹</Text>
              </TouchableOpacity>
            )}

            {/* Next Arrow Navigation */}
            {currentIndex < allItems.length - 1 && showControls && (
              <TouchableOpacity style={styles.navArrowRight} onPress={handleNext} activeOpacity={0.8}>
                <Text style={styles.navArrowText}>›</Text>
              </TouchableOpacity>
            )}

            {/* Video Play Overlay */}
            {currentItem.type === 'video' && (
              <TouchableOpacity
                style={styles.videoOverlayPlay}
                onPress={() => setIsPlaying(!isPlaying)}
                activeOpacity={0.8}
              >
                <PlayIcon size={44} color="#FFFFFF" />
                <Text style={styles.videoPlayStatus}>
                  {isPlaying ? 'Playing • ' + currentItem.duration : 'Tap to Play • ' + currentItem.duration}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableWithoutFeedback>

        {/* Bottom Details Bar */}
        {showControls && (
          <SafeAreaView style={styles.bottomSafeArea}>
            <View style={styles.bottomDetailsCard}>
              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Date Taken</Text>
                  <Text style={styles.metaValue}>{formattedDate}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>File Size</Text>
                  <Text style={styles.metaValue}>{currentItem.sizeFormatted}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Type</Text>
                  <Text style={styles.metaValue}>{currentItem.type.toUpperCase()}</Text>
                </View>
              </View>

              <View style={styles.bottomActionsRow}>
                <TouchableOpacity
                  style={styles.primaryActionBtn}
                  onPress={() => onShare(currentItem)}
                  activeOpacity={0.8}
                >
                  <ShareIcon size={16} color="#FFFFFF" />
                  <Text style={styles.primaryActionBtnText}>Share Media</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteActionBtn}
                  onPress={() => {
                    onDelete(currentItem);
                  }}
                  activeOpacity={0.8}
                >
                  <TrashIcon size={16} color="#FF453A" />
                  <Text style={styles.deleteActionBtnText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A08',
    justifyContent: 'space-between',
  },
  topSafeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: 'rgba(10, 10, 8, 0.85)',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#20221A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#343828',
  },
  topTitleWrapper: {
    flex: 1,
    marginHorizontal: 12,
    alignItems: 'center',
  },
  topTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  topSubtitle: {
    color: '#8A9076',
    fontSize: 11,
    marginTop: 2,
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mediaContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  fullImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  navArrowLeft: {
    position: 'absolute',
    left: 12,
    top: '50%',
    marginTop: -24,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(28,30,22,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  navArrowRight: {
    position: 'absolute',
    right: 12,
    top: '50%',
    marginTop: -24,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(28,30,22,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  navArrowText: {
    color: '#FFFFFF',
    fontSize: 28,
    lineHeight: 30,
    fontWeight: '600',
  },
  videoOverlayPlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 22,
    paddingVertical: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  videoPlayStatus: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 6,
  },
  bottomSafeArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(10, 10, 8, 0.95)',
  },
  bottomDetailsCard: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#24271C',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metaItem: {
    alignItems: 'center',
  },
  metaLabel: {
    color: '#7F846B',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  metaValue: {
    color: '#E0E5D0',
    fontSize: 13,
    fontWeight: '700',
  },
  bottomActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  primaryActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#9DA74E',
    paddingVertical: 12,
    borderRadius: 12,
  },
  primaryActionBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  deleteActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#2E1919',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4A2323',
  },
  deleteActionBtnText: {
    color: '#FF453A',
    fontSize: 14,
    fontWeight: '700',
  },
});
