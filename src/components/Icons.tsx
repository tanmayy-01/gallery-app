import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface IconProps {
  size?: number;
  color?: string;
}

export const CameraIcon = ({ size = 22, color = '#FFFFFF' }: IconProps) => (
  <View style={[styles.center, { width: size, height: size }]}>
    <View
      style={{
        width: size * 0.9,
        height: size * 0.7,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: color,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View
        style={{
          width: size * 0.35,
          height: size * 0.35,
          borderRadius: size * 0.2,
          borderWidth: 1.8,
          borderColor: color,
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: -3,
          right: 2,
          width: 3,
          height: 2,
          backgroundColor: color,
          borderRadius: 1,
        }}
      />
    </View>
  </View>
);

export const StarIcon = ({ size = 18, color = '#FFFFFF', filled = false }: IconProps & { filled?: boolean }) => (
  <View
    style={[
      styles.starCircle,
      {
        width: size + 6,
        height: size + 6,
        borderRadius: (size + 6) / 2,
      },
    ]}
  >
    <Text style={{ fontSize: size * 0.75, color: filled ? '#E8C547' : '#555555', textAlign: 'center' }}>
      ★
    </Text>
  </View>
);

export const CheckIcon = ({ size = 20, color = '#FFFFFF' }: IconProps) => (
  <View
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: '#9DA74E',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: '#FFFFFF',
    }}
  >
    <Text style={{ color: '#FFFFFF', fontSize: size * 0.65, fontWeight: '900', lineHeight: size * 0.8 }}>
      ✓
    </Text>
  </View>
);

export const PlayIcon = ({ size = 20, color = '#FFFFFF' }: IconProps) => (
  <View
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: 'rgba(0,0,0,0.6)',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Text style={{ color, fontSize: size * 0.5, marginLeft: 2 }}>▶</Text>
  </View>
);

export const SortIcon = ({ size = 20, color = '#FFFFFF' }: IconProps) => (
  <View style={[styles.center, { width: size, height: size }]}>
    <View style={{ width: size * 0.8, height: 2, backgroundColor: color, marginBottom: 3, borderRadius: 1 }} />
    <View style={{ width: size * 0.6, height: 2, backgroundColor: color, marginBottom: 3, borderRadius: 1 }} />
    <View style={{ width: size * 0.35, height: 2, backgroundColor: color, borderRadius: 1 }} />
  </View>
);

export const ShareIcon = ({ size = 20, color = '#FFFFFF' }: IconProps) => (
  <View style={[styles.center, { width: size, height: size }]}>
    <Text style={{ color, fontSize: size * 0.9, fontWeight: '700' }}>↗</Text>
  </View>
);

export const TrashIcon = ({ size = 20, color = '#FF453A' }: IconProps) => (
  <View style={[styles.center, { width: size, height: size }]}>
    <Text style={{ color, fontSize: size * 0.85 }}>🗑</Text>
  </View>
);

export const CloseIcon = ({ size = 22, color = '#FFFFFF' }: IconProps) => (
  <View style={[styles.center, { width: size, height: size }]}>
    <Text style={{ color, fontSize: size * 0.9, fontWeight: '600' }}>✕</Text>
  </View>
);

export const BackIcon = ({ size = 22, color = '#FFFFFF' }: IconProps) => (
  <View style={[styles.center, { width: size, height: size }]}>
    <Text style={{ color, fontSize: size * 1.1, fontWeight: '600' }}>‹</Text>
  </View>
);

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  starCircle: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});
