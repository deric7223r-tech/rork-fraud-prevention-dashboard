import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '@/constants/colors';
import { RAGStatus } from '@/mocks/dashboardData';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  status?: RAGStatus;
  icon?: React.ReactNode;
  onPress?: () => void;
  compact?: boolean;
}

export default function MetricCard({ 
  title, 
  value, 
  subtitle, 
  status, 
  icon,
  onPress,
  compact = false,
}: MetricCardProps) {
  const getStatusBg = () => {
    if (!status) return Colors.surface;
    switch (status) {
      case 'green': return Colors.successBg;
      case 'amber': return Colors.warningBg;
      case 'red': return Colors.dangerBg;
    }
  };

  const getStatusAccent = () => {
    if (!status) return Colors.primary;
    switch (status) {
      case 'green': return Colors.success;
      case 'amber': return Colors.warning;
      case 'red': return Colors.danger;
    }
  };

  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container 
      style={[
        styles.card, 
        compact && styles.cardCompact,
        { backgroundColor: getStatusBg() }
      ]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.accent, { backgroundColor: getStatusAccent() }]} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          {icon && <View style={styles.icon}>{icon}</View>}
        </View>
        <Text style={[styles.value, compact && styles.valueCompact]}>{value}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  cardCompact: {
    flex: 1,
  },
  accent: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
    flex: 1,
  },
  icon: {
    marginLeft: 8,
  },
  value: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  valueCompact: {
    fontSize: 22,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
  },
});
