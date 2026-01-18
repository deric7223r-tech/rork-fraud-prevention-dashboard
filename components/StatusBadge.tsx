import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';
import { RAGStatus } from '@/mocks/dashboardData';

interface StatusBadgeProps {
  status: RAGStatus;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

export default function StatusBadge({ status, size = 'medium', showLabel = false }: StatusBadgeProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'green': return Colors.success;
      case 'amber': return Colors.warning;
      case 'red': return Colors.danger;
      default: return Colors.textMuted;
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'green': return 'On Track';
      case 'amber': return 'At Risk';
      case 'red': return 'Critical';
      default: return 'Unknown';
    }
  };

  const dotSize = size === 'small' ? 8 : size === 'medium' ? 10 : 14;

  return (
    <View style={styles.container}>
      <View style={[styles.dot, { width: dotSize, height: dotSize, backgroundColor: getStatusColor() }]} />
      {showLabel && <Text style={[styles.label, { color: getStatusColor() }]}>{getStatusLabel()}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    borderRadius: 50,
  },
  label: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
});
