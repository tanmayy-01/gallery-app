import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ActiveTab } from '../types';

interface TabSelectorProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
}

export const TabSelector: React.FC<TabSelectorProps> = ({
  activeTab,
  onSelectTab,
}) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.pillContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'photos' && styles.activeTabButton,
          ]}
          onPress={() => onSelectTab('photos')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'photos' ? styles.activeTabText : styles.inactiveTabText,
            ]}
          >
            Photo
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'albums' && styles.activeTabButton,
          ]}
          onPress={() => onSelectTab('albums')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'albums' ? styles.activeTabText : styles.inactiveTabText,
            ]}
          >
            Album
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#0F100D',
  },
  pillContainer: {
    flexDirection: 'row',
    backgroundColor: '#23251E',
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    borderColor: '#303429',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  activeTabButton: {
    backgroundColor: '#9DA74E',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  inactiveTabText: {
    color: '#8A8F74',
  },
});
