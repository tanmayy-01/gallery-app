import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Album, CreateAlbumModalProps, MediaItem } from '../types';
import { CheckIcon, CloseIcon } from './Icons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');


export const CreateAlbumModal: React.FC<CreateAlbumModalProps> = ({
  visible,
  availableMedia,
  onClose,
  onCreateAlbum,
}) => {
  const [albumName, setAlbumName] = useState('');
  const [selectedCoverIndex, setSelectedCoverIndex] = useState(0);
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<Set<string>>(new Set());

  const handleTogglePhoto = (id: string) => {
    setSelectedPhotoIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleCreate = () => {
    if (!albumName.trim()) return;

    const coverItem = availableMedia[selectedCoverIndex] || availableMedia[0];
    const coverUri = coverItem ? coverItem.uri : '';

    const newAlbum: Album = {
      id: 'album_' + Date.now(),
      title: albumName.trim(),
      coverUri,
      count: selectedPhotoIds.size,
      mediaType: 'all',
      isFavorite: false,
      accentColor: '#9DA74E',
    };

    onCreateAlbum(newAlbum, Array.from(selectedPhotoIds));
    setAlbumName('');
    setSelectedPhotoIds(new Set());
    Keyboard.dismiss();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
          onClose();
        }}
      >
        <View style={styles.backdrop}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.keyboardAvoidingView}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.dialogCard}>
                {/* Header */}
                <View style={styles.header}>
                  <Text style={styles.headerTitle}>Create New Album</Text>
                  <TouchableOpacity
                    onPress={() => {
                      Keyboard.dismiss();
                      onClose();
                    }}
                    style={styles.closeBtn}
                    activeOpacity={0.7}
                  >
                    <CloseIcon size={18} color="#A0A58E" />
                  </TouchableOpacity>
                </View>

                <ScrollView
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={styles.scrollContent}
                >
                  <Text style={styles.inputLabel}>Album Name</Text>
                  <TextInput
                    style={styles.nameInput}
                    placeholder="e.g. Vacation, Family, Favorites..."
                    placeholderTextColor="#7F846B"
                    value={albumName}
                    onChangeText={setAlbumName}
                    returnKeyType="done"
                    onSubmitEditing={Keyboard.dismiss}
                  />

                  {availableMedia.length > 0 && (
                    <>
                      <Text style={styles.inputLabel}>
                        Select Photos ({selectedPhotoIds.size} selected)
                      </Text>

                      <FlatList
                        data={availableMedia}
                        keyExtractor={(item) => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.mediaList}
                        keyboardShouldPersistTaps="handled"
                        renderItem={({ item, index }) => {
                          const isSelected = selectedPhotoIds.has(item.id);
                          const isCover = selectedCoverIndex === index;

                          return (
                            <TouchableOpacity
                              style={[
                                styles.mediaThumbWrapper,
                                isSelected && styles.mediaThumbSelected,
                              ]}
                              onPress={() => {
                                handleTogglePhoto(item.id);
                                if (!isSelected) {
                                  setSelectedCoverIndex(index);
                                }
                              }}
                              activeOpacity={0.8}
                            >
                              <Image source={{ uri: item.uri }} style={styles.mediaThumb} />
                              {isSelected && (
                                <View style={styles.checkBadge}>
                                  <CheckIcon size={18} color="#FFFFFF" />
                                </View>
                              )}
                              {isCover && (
                                <View style={styles.coverPill}>
                                  <Text style={styles.coverPillText}>Cover</Text>
                                </View>
                              )}
                            </TouchableOpacity>
                          );
                        }}
                      />
                    </>
                  )}

                  <TouchableOpacity
                    style={[
                      styles.createButton,
                      !albumName.trim() && styles.createButtonDisabled,
                    ]}
                    onPress={handleCreate}
                    disabled={!albumName.trim()}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.createButtonText}>Create Album</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  keyboardAvoidingView: {
    width: '100%',
    maxWidth: 420,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogCard: {
    width: '100%',
    backgroundColor: '#191B15',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 22,
    borderWidth: 1,
    borderColor: '#2F3323',
    maxHeight: SCREEN_HEIGHT * 0.75,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  scrollContent: {
    paddingBottom: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  closeBtn: {
    padding: 6,
  },
  inputLabel: {
    color: '#ACB199',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  nameInput: {
    backgroundColor: '#23251E',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#363B2B',
    marginBottom: 18,
  },
  mediaList: {
    gap: 10,
    paddingBottom: 20,
  },
  mediaThumbWrapper: {
    width: 76,
    height: 76,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#26291F',
    position: 'relative',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  mediaThumbSelected: {
    borderColor: '#9DA74E',
  },
  mediaThumb: {
    width: '100%',
    height: '100%',
  },
  checkBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  coverPill: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  coverPillText: {
    color: '#DCE49B',
    fontSize: 9,
    fontWeight: '700',
  },
  createButton: {
    backgroundColor: '#9DA74E',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  createButtonDisabled: {
    backgroundColor: '#383C2A',
    opacity: 0.6,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
