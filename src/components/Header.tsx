import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CameraIcon, CloseIcon, ShareIcon, SortIcon, TrashIcon } from './Icons';

interface HeaderProps {
  isSelectionMode: boolean;
  selectedCount: number;
  totalCount: number;
  onExitSelection: () => void;
  onSelectAll: () => void;
  onShareSelected: () => void;
  onDeleteSelected: () => void;
  onOpenSort: () => void;
  onPressCamera: () => void;
  activeSortLabel: string;
}

export const Header: React.FC<HeaderProps> = ({
  isSelectionMode,
  selectedCount,
  totalCount,
  onExitSelection,
  onSelectAll,
  onShareSelected,
  onDeleteSelected,
  onOpenSort,
  onPressCamera,
  activeSortLabel,
}) => {
  if (isSelectionMode) {
    const isAllSelected = selectedCount === totalCount && totalCount > 0;
    return (
      <View style={styles.selectionContainer}>
        <View style={styles.selectionLeft}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={onExitSelection}
            activeOpacity={0.7}
            accessibilityLabel="Cancel selection"
          >
            <CloseIcon size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.selectionTitle}>
            {selectedCount} selected
          </Text>
        </View>

        <View style={styles.selectionRight}>
          <TouchableOpacity
            style={styles.pillActionBtn}
            onPress={onSelectAll}
            activeOpacity={0.7}
          >
            <Text style={styles.pillActionText}>
              {isAllSelected ? 'Deselect' : 'Select All'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionIconBtn, selectedCount === 0 && styles.disabledBtn]}
            onPress={onShareSelected}
            disabled={selectedCount === 0}
            activeOpacity={0.7}
            accessibilityLabel="Share selected media"
          >
            <ShareIcon size={18} color={selectedCount > 0 ? '#FFFFFF' : '#666666'} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionIconBtn, styles.deleteBtn, selectedCount === 0 && styles.disabledBtn]}
            onPress={onDeleteSelected}
            disabled={selectedCount === 0}
            activeOpacity={0.7}
            accessibilityLabel="Delete selected media"
          >
            <TrashIcon size={18} color={selectedCount > 0 ? '#FF453A' : '#666666'} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logoText}>PICTORIA</Text>

      <View style={styles.actionsRight}>
        <TouchableOpacity
          style={styles.sortPill}
          onPress={onOpenSort}
          activeOpacity={0.7}
          accessibilityLabel="Sort media"
        >
          <SortIcon size={14} color="#9DA74E" />
          <Text style={styles.sortPillText}>{activeSortLabel}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cameraBtn}
          onPress={onPressCamera}
          activeOpacity={0.7}
          accessibilityLabel="Open camera"
        >
          <CameraIcon size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 10,
    backgroundColor: '#0F100D',
  },
  logoText: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.2,
  },
  actionsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sortPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1D18',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: '#2A2C23',
  },
  sortPillText: {
    color: '#C7CCA2',
    fontSize: 12,
    fontWeight: '600',
  },
  cameraBtn: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1E2017',
    borderBottomWidth: 1,
    borderBottomColor: '#303324',
  },
  selectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  selectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  selectionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pillActionBtn: {
    backgroundColor: '#2C2F20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#42472E',
  },
  pillActionText: {
    color: '#DCE49B',
    fontSize: 13,
    fontWeight: '600',
  },
  actionIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2C2F20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtn: {
    backgroundColor: '#381E1E',
  },
  disabledBtn: {
    opacity: 0.4,
  },
  iconBtn: {
    padding: 6,
  },
});
