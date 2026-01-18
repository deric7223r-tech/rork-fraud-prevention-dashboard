import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { ChevronDown, User, Calendar, Target } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Initiative } from '@/mocks/dashboardData';
import StatusBadge from './StatusBadge';
import ProgressBar from './ProgressBar';

interface InitiativeCardProps {
  initiative: Initiative;
}

export default function InitiativeCard({ initiative }: InitiativeCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <StatusBadge status={initiative.status} size="medium" />
          <Text style={styles.name} numberOfLines={1}>{initiative.name}</Text>
        </View>
        <ChevronDown 
          size={20} 
          color={Colors.textSecondary} 
          style={{ transform: [{ rotate: expanded ? '180deg' : '0deg' }] }}
        />
      </View>

      <View style={styles.progressContainer}>
        <ProgressBar progress={initiative.percentComplete} status={initiative.status} />
      </View>

      {expanded && (
        <Animated.View style={styles.details}>
          <View style={styles.detailRow}>
            <User size={14} color={Colors.textMuted} />
            <Text style={styles.detailLabel}>Owner:</Text>
            <Text style={styles.detailValue}>{initiative.owner}</Text>
          </View>
          <View style={styles.detailRow}>
            <Calendar size={14} color={Colors.textMuted} />
            <Text style={styles.detailLabel}>Last Update:</Text>
            <Text style={styles.detailValue}>{initiative.lastUpdate}</Text>
          </View>
          <View style={styles.detailRow}>
            <Target size={14} color={Colors.textMuted} />
            <Text style={styles.detailLabel}>Next Milestone:</Text>
            <Text style={styles.detailValue}>{initiative.nextMilestone}</Text>
          </View>
        </Animated.View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
    flex: 1,
  },
  progressContainer: {
    marginTop: 12,
  },
  details: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailLabel: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  detailValue: {
    fontSize: 13,
    color: Colors.text,
    fontWeight: '500' as const,
  },
});
