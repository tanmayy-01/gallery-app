import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SortType } from '../types';
import { CheckIcon, CloseIcon } from './Icons';

interface SortModalProps {
  visible: boolean;
  activeSort: SortType;
  onSelectSort: (sort: SortType) => void;
  onClose: () => void;
}

interface SortOptionItem {
  key: SortType;
  title: string;
  subtitle: string;
  category: 'Date' | 'Size';
}

const SORT_OPTIONS: SortOptionItem[] = [
  {
    key: 'date-desc',
    title: 'Date: Newest First',
    subtitle: 'Recent media appears at top',
    category: 'Date',
  },
  {
    key: 'date-asc',
    title: 'Date: Oldest First',
    subtitle: 'Oldest media appears first',
    category: 'Date',
  },
  {
    key: 'size-desc',
    title: 'Size: Largest First',
    subtitle: 'High capacity media first',
    category: 'Size',
  },
  {
    key: 'size-asc',
    title: 'Size: Smallest First',
    subtitle: 'Low capacity media first',
    category: 'Size',
  },
];

export const SortModal: React.FC<SortModalProps> = ({
  visible,
  activeSort,
  onSelectSort,
  onClose,
}) => {
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
                <Text style={styles.headerTitle}>Sort Media</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
                  <CloseIcon size={18} color="#A0A58E" />
                </TouchableOpacity>
              </View>

              <View style={styles.optionsList}>
                {SORT_OPTIONS.map((option) => {
                  const isSelected = activeSort === option.key;
                  return (
                    <TouchableOpacity
                      key={option.key}
                      style={[
                        styles.optionRow,
                        isSelected && styles.optionRowActive,
                      ]}
                      onPress={() => {
                        onSelectSort(option.key);
                        onClose();
                      }}
                      activeOpacity={0.8}
                    >
                      <View style={styles.optionTextContainer}>
                        <Text
                          style={[
                            styles.optionTitle,
                            isSelected && styles.optionTitleActive,
                          ]}
                        >
                          {option.title}
                        </Text>
                        <Text style={styles.optionSubtitle}>
                          {option.subtitle}
                        </Text>
                      </View>

                      {isSelected && <CheckIcon size={22} color="#FFFFFF" />}
                    </TouchableOpacity>
                  );
                })}
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
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#1B1C17',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 36,
    borderWidth: 1,
    borderColor: '#2F3224',
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#444835',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
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
  optionsList: {
    gap: 10,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#24261E',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#343828',
  },
  optionRowActive: {
    backgroundColor: '#2D3121',
    borderColor: '#9DA74E',
  },
  optionTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E0E5D0',
    marginBottom: 2,
  },
  optionTitleActive: {
    color: '#FFFFFF',
  },
  optionSubtitle: {
    fontSize: 12,
    color: '#868B74',
  },
});
