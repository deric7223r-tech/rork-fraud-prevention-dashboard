import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Filter } from 'lucide-react-native';
import Colors from '@/constants/colors';
import InitiativeCard from '@/components/InitiativeCard';
import { initiatives, RAGStatus } from '@/mocks/dashboardData';

type FilterType = 'all' | RAGStatus;

export default function InitiativesScreen() {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredInitiatives = filter === 'all' 
    ? initiatives 
    : initiatives.filter(i => i.status === filter);

  const filterOptions: { key: FilterType; label: string; color: string }[] = [
    { key: 'all', label: 'All', color: Colors.primary },
    { key: 'green', label: 'On Track', color: Colors.success },
    { key: 'amber', label: 'At Risk', color: Colors.warning },
    { key: 'red', label: 'Critical', color: Colors.danger },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.filterBar}>
        <Filter size={16} color={Colors.textMuted} />
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {filterOptions.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.filterButton,
                filter === option.key && { backgroundColor: option.color + '20', borderColor: option.color }
              ]}
              onPress={() => setFilter(option.key)}
            >
              <Text style={[
                styles.filterText,
                filter === option.key && { color: option.color }
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.countText}>
          {filteredInitiatives.length} initiative{filteredInitiatives.length !== 1 ? 's' : ''}
        </Text>

        {filteredInitiatives.map((initiative) => (
          <InitiativeCard key={initiative.id} initiative={initiative} />
        ))}

        {filteredInitiatives.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No initiatives match this filter</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surface,
    gap: 12,
  },
  filterScroll: {
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceElevated,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  countText: {
    fontSize: 13,
    color: Colors.textMuted,
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textMuted,
  },
});
