import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';

export { Ionicons };

export interface IconProps {
  size?: number;
  color?: string;
}

export const CameraIcon = ({ size = 22, color = '#FFFFFF' }: IconProps) => (
  <Ionicons name="camera-outline" size={size} color={color} />
);

export const StarIcon = ({
  size = 18,
  color = '#FFFFFF',
  filled = false,
}: IconProps & { filled?: boolean }) => (
  <View
    style={[
      styles.starCircle,
      {
        width: size + 8,
        height: size + 8,
        borderRadius: (size + 8) / 2,
      },
    ]}
  >
    <Ionicons
      name={filled ? 'star' : 'star-outline'}
      size={size}
      color={filled ? '#E8C547' : '#777777'}
    />
  </View>
);

export const CheckIcon = ({ size = 20, color = '#FFFFFF' }: IconProps) => (
  <View
    style={[
      styles.checkCircle,
      {
        width: size,
        height: size,
        borderRadius: size / 2,
      },
    ]}
  >
    <Ionicons name="checkmark-sharp" size={size * 0.72} color={color} />
  </View>
);

export const PlayIcon = ({ size = 20, color = '#FFFFFF' }: IconProps) => (
  <Ionicons name="play" size={size} color={color} />
);

export const SortIcon = ({ size = 20, color = '#FFFFFF' }: IconProps) => (
  <Ionicons name="swap-vertical" size={size} color={color} />
);

export const ShareIcon = ({ size = 20, color = '#FFFFFF' }: IconProps) => (
  <Ionicons name="share-social-outline" size={size} color={color} />
);

export const TrashIcon = ({ size = 20, color = '#FF453A' }: IconProps) => (
  <Ionicons name="trash-outline" size={size} color={color} />
);

export const CloseIcon = ({ size = 22, color = '#FFFFFF' }: IconProps) => (
  <Ionicons name="close" size={size} color={color} />
);

export const BackIcon = ({ size = 24, color = '#FFFFFF' }: IconProps) => (
  <Ionicons name="chevron-back" size={size} color={color} />
);

export const AddIcon = ({ size = 24, color = '#FFFFFF' }: IconProps) => (
  <Ionicons name="add" size={size} color={color} />
);

const styles = StyleSheet.create({
  starCircle: {
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  checkCircle: {
    backgroundColor: '#9DA74E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
});
