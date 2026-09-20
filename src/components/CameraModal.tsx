import React, { useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { MediaItem } from '../types';
import { CameraIcon, CloseIcon } from './Icons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
import { SafeAreaView } from 'react-native-safe-area-context';

interface CameraModalProps {
  visible: boolean;
  onClose: () => void;
  onAddMedia: (newMedia: MediaItem) => void;
}

const SCENE_PREVIEWS = [
  {
    uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
    title: 'Yosemite Alpine Valley',
  },
  {
    uri: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1000&q=80',
    title: 'Starry Mountain Night',
  },
  {
    uri: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1000&q=80',
    title: 'Golden Sunset Mist',
  },
  {
    uri: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1000&q=80',
    title: 'Lake Reflection & Canoes',
  },
  {
    uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80',
    title: 'Outdoor Sunny Portrait',
  },
];

export const CameraModal: React.FC<CameraModalProps> = ({
  visible,
  onClose,
  onAddMedia,
}) => {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [flashMode, setFlashMode] = useState<'off' | 'on' | 'auto'>('auto');
  const [customTitle, setCustomTitle] = useState('');
  const [isFlashing, setIsFlashing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedCount, setSavedCount] = useState(0);

  const currentScene = SCENE_PREVIEWS[sceneIndex % SCENE_PREVIEWS.length];

  const handleCapture = () => {
    if (isSaving) return;

    // Shutter flash effect
    setIsFlashing(true);
    setIsSaving(true);
    setTimeout(() => setIsFlashing(false), 150);

    const now = new Date();
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    const currentMonth = monthNames[now.getMonth()];
    const sizeBytes = Math.floor(Math.random() * 3500000) + 2500000;

    const newMedia: MediaItem = {
      id: 'capture_' + Date.now(),
      uri: currentScene.uri,
      type: 'photo',
      title: customTitle.trim() || currentScene.title,
      date: now.toISOString(),
      monthSection: `${currentMonth} ${now.getFullYear()}`,
      year: now.getFullYear(),
      sizeBytes,
      sizeFormatted: (sizeBytes / (1024 * 1024)).toFixed(1) + ' MB',
      albumId: 'camera',
      isFavorite: false,
    };

    setTimeout(() => {
      onAddMedia(newMedia);
      setSavedCount((prev) => prev + 1);
      setCustomTitle('');
      setIsSaving(false);
      // Advance scene
      setSceneIndex((prev) => prev + 1);
    }, 400);
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        {/* Top Camera Controls */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.controlPill}
            onPress={() =>
              setFlashMode((prev) => (prev === 'auto' ? 'on' : prev === 'on' ? 'off' : 'auto'))
            }
          >
            <Text style={styles.controlPillText}>⚡ Flash: {flashMode.toUpperCase()}</Text>
          </TouchableOpacity>

          {savedCount > 0 && (
            <View style={styles.savedBadge}>
              <Text style={styles.savedBadgeText}>✓ {savedCount} Saved</Text>
            </View>
          )}

          <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
            <CloseIcon size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Viewfinder simulation */}
        <View style={styles.viewfinder}>
          <Image source={{ uri: currentScene.uri }} style={styles.previewImage} resizeMode="cover" />

          {/* Flash screen overlay animation */}
          {isFlashing && <View style={styles.flashOverlay} />}

          {/* Saving Loading Indicator */}
          {isSaving && (
            <View style={styles.savingViewfinderOverlay}>
              <ActivityIndicator size="large" color="#9DA74E" />
              <Text style={styles.savingViewfinderText}>Saving photo...</Text>
            </View>
          )}

          {/* Camera Grid Lines */}
          <View style={styles.gridOverlay}>
            <View style={styles.gridLineH1} />
            <View style={styles.gridLineH2} />
            <View style={styles.gridLineV1} />
            <View style={styles.gridLineV2} />
          </View>

          {/* Focus indicator */}
          <View style={styles.focusBox} />
        </View>

        {/* Bottom Shutter Controls */}
        <View style={styles.controls}>
          <TextInput
            style={styles.titleInput}
            value={customTitle}
            onChangeText={setCustomTitle}
            placeholder={`Tag name: ${currentScene.title}`}
            placeholderTextColor="#7F846B"
          />

          <View style={styles.shutterRow}>
            {/* Switch Scene Button */}
            <TouchableOpacity
              style={styles.switchSceneBtn}
              onPress={() => setSceneIndex((prev) => prev + 1)}
              activeOpacity={0.7}
            >
              <Text style={styles.switchSceneText}>Switch Scene ↻</Text>
            </TouchableOpacity>

            {/* Shutter Button */}
            <TouchableOpacity
              style={styles.shutterOuter}
              onPress={handleCapture}
              activeOpacity={0.75}
            >
              <View style={styles.shutterInner}>
                <CameraIcon size={26} color="#22241A" />
              </View>
            </TouchableOpacity>

            {/* Done / Gallery Button */}
            <TouchableOpacity
              style={styles.doneBtn}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.doneBtnText}>View Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A08',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  controlPill: {
    backgroundColor: '#20221A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#343828',
  },
  controlPillText: {
    color: '#DCE49B',
    fontSize: 12,
    fontWeight: '700',
  },
  savedBadge: {
    backgroundColor: '#303B1C',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#9DA74E',
  },
  savedBadgeText: {
    color: '#EAF4A8',
    fontSize: 12,
    fontWeight: '800',
  },
  closeBtn: {
    padding: 6,
  },
  viewfinder: {
    flex: 1,
    marginHorizontal: 12,
    borderRadius: 22,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#151612',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  flashOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#FFFFFF',
    zIndex: 10,
  },
  gridOverlay: {
    ...StyleSheet.absoluteFill,
  },
  gridLineH1: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    top: '33%',
  },
  gridLineH2: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    top: '66%',
  },
  gridLineV1: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    left: '33%',
  },
  gridLineV2: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    left: '66%',
  },
  focusBox: {
    position: 'absolute',
    top: '42%',
    left: '42%',
    width: 60,
    height: 60,
    borderWidth: 1.5,
    borderColor: '#9DA74E',
    borderRadius: 8,
  },
  controls: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    alignItems: 'center',
  },
  titleInput: {
    width: '100%',
    backgroundColor: '#1E2018',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#323625',
  },
  shutterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  switchSceneBtn: {
    backgroundColor: '#20221A',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#343828',
    width: 105,
    alignItems: 'center',
  },
  switchSceneText: {
    color: '#DCE49B',
    fontSize: 11,
    fontWeight: '700',
  },
  shutterOuter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: '#9DA74E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#9DA74E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  doneBtn: {
    backgroundColor: '#2D3021',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#454B30',
    width: 105,
    alignItems: 'center',
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  savingViewfinderOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 15,
    gap: 12,
  },
  savingViewfinderText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
