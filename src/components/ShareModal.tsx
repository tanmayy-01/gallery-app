import React from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import RNShare, { Social } from 'react-native-share';
import { MediaItem } from '../types';
import { CloseIcon } from './Icons';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ShareModalProps {
  visible: boolean;
  items: MediaItem[];
  onClose: () => void;
}

interface ShareDestination {
  id: string;
  name: string;
  color: string;
  iconText: string;
}

const DESTINATIONS: ShareDestination[] = [
  { id: 'whatsapp', name: 'WhatsApp', color: '#25D366', iconText: 'WA' },
  { id: 'instagram', name: 'Instagram', color: '#E1306C', iconText: 'IG' },
  { id: 'telegram', name: 'Telegram', color: '#0088CC', iconText: 'TG' },
  { id: 'messages', name: 'Messages', color: '#007AFF', iconText: 'SMS' },
  { id: 'system', name: 'More Apps', color: '#9DA74E', iconText: '•••' },
];

export const ShareModal: React.FC<ShareModalProps> = ({
  visible,
  items,
  onClose,
}) => {
  if (items.length === 0) return null;

  const handleShareToDestination = async (dest: ShareDestination) => {
    try {
      const isVideo = items.some((i) => i.type === 'video');
      const mimeType = isVideo ? 'video/*' : 'image/*';
      const isMulti = items.length > 1;

      if (dest.id === 'whatsapp') {
        try {
          if (!isMulti) {
            await RNShare.shareSingle({
              social: Social.Whatsapp,
              url: items[0].uri,
              type: mimeType,
              filename: items[0].title,
            });
            onClose();
            return;
          } else {
            await RNShare.open({
              urls: items.map((i) => i.uri),
              type: mimeType,
            });
            onClose();
            return;
          }
        } catch (singleErr: any) {
          console.log('WhatsApp share fallback to system open:', singleErr?.message);
          await RNShare.open({
            urls: items.map((i) => i.uri),
            type: mimeType,
          });
          onClose();
          return;
        }
      }

      if (dest.id === 'instagram') {
        try {
          if (!isMulti) {
            await RNShare.shareSingle({
              social: Social.Instagram,
              url: items[0].uri,
              type: mimeType,
            });
            onClose();
            return;
          } else {
            await RNShare.open({
              urls: items.map((i) => i.uri),
              type: mimeType,
            });
            onClose();
            return;
          }
        } catch (singleErr: any) {
          console.log('Instagram share fallback to system open:', singleErr?.message);
          await RNShare.open({
            urls: items.map((i) => i.uri),
            type: mimeType,
          });
          onClose();
          return;
        }
      }

      if (dest.id === 'telegram') {
        try {
          if (!isMulti) {
            await RNShare.shareSingle({
              social: Social.Telegram,
              url: items[0].uri,
              type: mimeType,
            });
            onClose();
            return;
          }
        } catch (singleErr: any) {
          console.log('Telegram share fallback:', singleErr?.message);
        }
        await RNShare.open({
          urls: items.map((i) => i.uri),
          type: mimeType,
        });
        onClose();
        return;
      }

      if (dest.id === 'messages') {
        try {
          if (!isMulti) {
            await RNShare.shareSingle({
              social: Social.Sms,
              url: items[0].uri,
              type: mimeType,
            });
            onClose();
            return;
          }
        } catch (singleErr: any) {
          console.log('Messages share fallback:', singleErr?.message);
        }
        await RNShare.open({
          urls: items.map((i) => i.uri),
          type: mimeType,
        });
        onClose();
        return;
      }

      // Default: Native System Share Sheet sending actual binary image/video file(s)
      if (isMulti) {
        await RNShare.open({
          urls: items.map((i) => i.uri),
          type: mimeType,
        });
      } else {
        await RNShare.open({
          url: items[0].uri,
          type: mimeType,
        });
      }
      onClose();
    } catch (error: any) {
      if (
        error &&
        error.message &&
        !error.message.includes('dismissed') &&
        !error.message.includes('cancel') &&
        !error.message.includes('User did not share')
      ) {
        Alert.alert('Share', error?.message || 'Could not share file.');
      }
    }
  };

  const totalSizeBytes = items.reduce((sum, item) => sum + item.sizeBytes, 0);
  const formattedTotalSize =
    totalSizeBytes > 1024 * 1024 * 1024
      ? (totalSizeBytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB'
      : totalSizeBytes > 0
      ? (totalSizeBytes / (1024 * 1024)).toFixed(1) + ' MB'
      : '';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.sheetContainer}>
              <View style={styles.dragHandle} />

              <View style={styles.header}>
                <View>
                  <Text style={styles.headerTitle}>
                    Share {items.length} {items.length === 1 ? 'Media' : 'Items'}
                  </Text>
                  {formattedTotalSize ? (
                    <Text style={styles.headerSubtitle}>
                      Total size: {formattedTotalSize}
                    </Text>
                  ) : null}
                </View>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
                  <CloseIcon size={18} color="#A0A58E" />
                </TouchableOpacity>
              </View>

              {/* Preview thumbnails preview row */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.previewsRow}
              >
                {items.map((item) => (
                  <View key={item.id} style={styles.previewThumbWrapper}>
                    <Image source={{ uri: item.uri }} style={styles.previewThumb} />
                    {item.type === 'video' && (
                      <View style={styles.videoBadge}>
                        <Text style={styles.videoBadgeText}>VIDEO</Text>
                      </View>
                    )}
                  </View>
                ))}
              </ScrollView>

              <Text style={styles.sectionHeader}>Share to</Text>

              <View style={styles.destinationsGrid}>
                {DESTINATIONS.map((dest) => (
                  <TouchableOpacity
                    key={dest.id}
                    style={styles.destItem}
                    onPress={() => handleShareToDestination(dest)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.destIconWrapper, { backgroundColor: dest.color }]}>
                      <Text style={styles.destIconText}>{dest.iconText}</Text>
                    </View>
                    <Text style={styles.destName} numberOfLines={1}>
                      {dest.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  sheetContainer: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#1A1C16',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    borderWidth: 1,
    borderColor: '#2F3323',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  dragHandle: {
    width: 36,
    height: 4,
    backgroundColor: '#444835',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#8A9076',
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
  },
  previewsRow: {
    gap: 10,
    paddingBottom: 16,
  },
  previewThumbWrapper: {
    width: 64,
    height: 64,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#26291F',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#3D422E',
  },
  previewThumb: {
    width: '100%',
    height: '100%',
  },
  videoBadge: {
    position: 'absolute',
    bottom: 2,
    left: 2,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 3,
    paddingVertical: 1,
    borderRadius: 3,
  },
  videoBadgeText: {
    color: '#FFFFFF',
    fontSize: 7,
    fontWeight: '800',
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ACB299',
    marginTop: 6,
    marginBottom: 16,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  destinationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 18,
  },
  destItem: {
    width: '30%',
    alignItems: 'center',
  },
  destIconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  destIconText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  destName: {
    color: '#DCE0D0',
    fontSize: 12,
    fontWeight: '600',
  },
});
