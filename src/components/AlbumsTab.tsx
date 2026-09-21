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
import { Album, AlbumsTabProps } from '../types';
import { AddIcon, StarIcon } from './Icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HORIZONTAL_PADDING = 20;
const GAP = 14;
const NUM_COLUMNS = 2;
const CARD_WIDTH = (SCREEN_WIDTH - HORIZONTAL_PADDING * 2 - GAP) / NUM_COLUMNS;
const CARD_HEIGHT = CARD_WIDTH * 1.25;


export const AlbumsTab: React.FC<AlbumsTabProps> = ({
  albums,
  onSelectAlbum,
  onToggleFavoriteAlbum,
  onPressCreateAlbum,
}) => {
  const renderAlbumCard = ({ item }: { item: Album }) => {
    return (
      <TouchableOpacity
        style={styles.cardContainer}
        onPress={() => onSelectAlbum(item)}
        activeOpacity={0.9}
      >
        <Image
          source={{ uri: item.coverUri }}
          style={styles.cardCover}
          resizeMode="cover"
        />

        {/* Favorite Star Badge */}
        <TouchableOpacity
          style={styles.starBadgeContainer}
          onPress={() => onToggleFavoriteAlbum?.(item.id)}
          activeOpacity={0.7}
        >
          <StarIcon size={16} filled={item.isFavorite} />
        </TouchableOpacity>

        {/* Bottom Frosted Info Overlay */}
        <View style={styles.bottomOverlay}>
          <Text style={styles.albumTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.albumCount}>
            {item.count}{' '}
            {item.mediaType === 'video'
              ? 'Videos'
              : item.mediaType === 'photo'
              ? 'Photos'
              : 'Items'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={albums}
        renderItem={renderAlbumCard}
        keyExtractor={(item) => item.id}
        numColumns={NUM_COLUMNS}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={albums.length > 0 ? styles.columnWrapper : undefined}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No Albums Found</Text>
            <Text style={styles.emptySubtitle}>
              Tap the + button below to create your first album or take photos with the camera.
            </Text>
          </View>
        }
      />

      {/* Floating Add Album Icon Button */}
      <TouchableOpacity
        style={styles.floatingAddBtn}
        onPress={onPressCreateAlbum}
        activeOpacity={0.85}
        accessibilityLabel="Create New Album"
      >
        <AddIcon size={28} color="#1A1C16" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  listContent: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingBottom: 90,
    paddingTop: 8,
  },
  columnWrapper: {
    gap: GAP,
    marginBottom: GAP,
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#1E201B',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  cardCover: {
    width: '100%',
    height: '100%',
  },
  starBadgeContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 2,
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(28, 29, 24, 0.75)',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  albumTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 2,
  },
  albumCount: {
    color: '#CBD0BA',
    fontSize: 12,
    fontWeight: '500',
  },
  floatingAddBtn: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#9DA74E',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  plusIcon: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '300',
    marginTop: -2,
    lineHeight: 34,
  },
  emptyContainer: {
    paddingVertical: 80,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
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
