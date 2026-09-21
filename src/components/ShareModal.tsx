import React from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import RNShare, { Social } from 'react-native-share';
import { MediaItem } from '../types';
import { CloseIcon, ShareIcon } from './Icons';

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
  social?: string;
  packageName?: string;
}

const DESTINATIONS: ShareDestination[] = [
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    color: '#25D366',
    iconText: 'WA',
    social: Social.Whatsapp,
    packageName: 'com.whatsapp',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    color: '#E1306C',
    iconText: 'IG',
    social: Social.Instagram,
    packageName: 'com.instagram.android',
  },
  {
    id: 'telegram',
    name: 'Telegram',
    color: '#2AABEE',
    iconText: 'TG',
    social: Social.Telegram,
    packageName: 'org.telegram.messenger',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    color: '#1877F2',
    iconText: 'FB',
    social: Social.Facebook,
    packageName: 'com.facebook.katana',
  },
  {
    id: 'twitter',
    name: 'X / Twitter',
    color: '#000000',
    iconText: '𝕏',
    social: Social.Twitter,
    packageName: 'com.twitter.android',
  },
  {
    id: 'email',
    name: 'Email',
    color: '#EA4335',
    iconText: '✉',
    social: Social.Email,
  },
  {
    id: 'sms',
    name: 'Messages',
    color: '#34C759',
    iconText: 'SMS',
    social: Social.Sms,
  },
  {
    id: 'system',
    name: 'More',
    color: '#3E4330',
    iconText: '•••',
  },
];

export const ShareModal: React.FC<ShareModalProps> = ({
  visible,
  items,
  onClose,
}) => {
  if (!visible || items.length === 0) return null;

  const handleShareToDestination = async (dest: ShareDestination) => {
    onClose();

    // Small delay to allow modal dismiss animation before launching intent chooser
    setTimeout(async () => {
      try {
        const hasVideos = items.some((i) => i.type === 'video');
        const hasPhotos = items.some((i) => i.type === 'photo');
        const mimeType = hasVideos && hasPhotos ? '*/*' : hasVideos ? 'video/*' : 'image/*';
        const isMulti = items.length > 1;

        // 1. System / More Apps
        if (dest.id === 'system' || !dest.social) {
          if (isMulti) {
            await RNShare.open({
              urls: items.map((i) => i.uri),
              type: mimeType,
              title: `Share ${items.length} items`,
              failOnCancel: false,
            });
          } else {
            await RNShare.open({
              url: items[0].uri,
              type: mimeType,
              title: items[0].title || 'Share Media',
              filename: items[0].title,
              failOnCancel: false,
            });
          }
          return;
        }

        // 2. Multi-item sharing: individual apps don't support multi via shareSingle, use open()
        if (isMulti) {
          await RNShare.open({
            urls: items.map((i) => i.uri),
            type: mimeType,
            title: `Share ${items.length} items to ${dest.name}`,
            failOnCancel: false,
          });
          return;
        }

        // 3. Single-item direct social app sharing
        if (Platform.OS === 'android' && dest.packageName) {
          try {
            const check = await RNShare.isPackageInstalled(dest.packageName);
            if (check && check.isInstalled === false) {
              // App not installed on device, fallback to system share sheet
              await RNShare.open({
                url: items[0].uri,
                type: mimeType,
                title: items[0].title || 'Share Media',
                filename: items[0].title,
                failOnCancel: false,
              });
              return;
            }
          } catch {
            // If package check fails, attempt shareSingle anyway
          }
        }

        try {
          await RNShare.shareSingle({
            social: dest.social as any,
            url: items[0].uri,
            type: mimeType,
            filename: items[0].title,
          });
        } catch (singleErr: any) {
          console.log(`${dest.name} share fallback to system open:`, singleErr?.message);
          await RNShare.open({
            url: items[0].uri,
            type: mimeType,
            title: items[0].title || 'Share Media',
            filename: items[0].title,
            failOnCancel: false,
          });
        }
      } catch (error: any) {
        if (
          error &&
          error.message &&
          !error.message.includes('dismissed') &&
          !error.message.includes('cancel') &&
          !error.message.includes('User did not share') &&
          !error.message.includes('CANCELLED')
        ) {
          Alert.alert('Share', error?.message || 'Could not share file.');
        }
      }
    }, 150);
  };

  const handleShareViaSystem = () => {
    handleShareToDestination({
      id: 'system',
      name: 'System Share',
      color: '#3E4330',
      iconText: '•••',
    });
  };

  const totalSizeBytes = items.reduce((sum, item) => sum + item.sizeBytes, 0);
  const formattedTotalSize =
    totalSizeBytes > 1024 * 1024 * 1024
      ? (totalSizeBytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB'
      : totalSizeBytes > 0
      ? (totalSizeBytes / (1024 * 1024)).toFixed(1) + ' MB'
      : '';

  const shareTitle =
    items.length === 1
      ? items[0].type === 'video'
        ? 'Share Video'
        : 'Share Photo'
      : `Share ${items.length} Items`;

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
                  <Text style={styles.headerTitle}>{shareTitle}</Text>
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
                        <Text style={styles.videoBadgeText}>
                          {item.duration || 'VIDEO'}
                        </Text>
                      </View>
                    )}
                  </View>
                ))}
              </ScrollView>

              <Text style={styles.sectionHeader}>Share to</Text>

              {/* Destinations Grid */}
              <View style={styles.destinationsGrid}>
                {DESTINATIONS.map((dest) => (
                  <TouchableOpacity
                    key={dest.id}
                    style={styles.destItem}
                    onPress={() => handleShareToDestination(dest)}
                    activeOpacity={0.75}
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

              {/* Primary System Share Action Button */}
              <TouchableOpacity
                style={styles.systemShareButton}
                onPress={handleShareViaSystem}
                activeOpacity={0.85}
              >
                <ShareIcon size={18} color="#1A1C16" />
                <Text style={styles.systemShareButtonText}>Share via Other Apps</Text>
              </TouchableOpacity>
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
    paddingBottom: 22,
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
    fontSize: 8,
    fontWeight: '800',
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ACB299',
    marginTop: 2,
    marginBottom: 14,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  destinationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 16,
    marginBottom: 18,
  },
  destItem: {
    width: '23%',
    alignItems: 'center',
  },
  destIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
    fontSize: 14,
    fontWeight: '800',
  },
  destName: {
    color: '#DCE0D0',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  systemShareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9DA74E',
    borderRadius: 14,
    paddingVertical: 13,
    gap: 8,
    marginTop: 4,
  },
  systemShareButtonText: {
    color: '#1A1C16',
    fontSize: 14,
    fontWeight: '700',
  },
});
