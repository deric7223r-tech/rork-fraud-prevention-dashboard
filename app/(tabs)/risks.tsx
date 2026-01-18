import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AlertOctagon, ChevronRight, ShieldAlert, Briefcase, Laptop } from 'lucide-react-native';
import Colors from '@/constants/colors';
import StatusBadge from '@/components/StatusBadge';
import { riskCategories } from '@/mocks/dashboardData';

const categoryIcons: Record<string, React.ReactNode> = {
  'Procurement Risks': <Briefcase size={20} color={Colors.danger} />,
  'Payroll Risks': <ShieldAlert size={20} color={Colors.warning} />,
  'Digital Systems': <Laptop size={20} color={Colors.danger} />,
};

export default function RisksScreen() {
  const insets = useSafeAreaInsets();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(riskCategories[0].name);

  const getLevelColor = (level: string) => {
    return level === 'High' ? Colors.danger : Colors.warning;
  };

  const totalCritical = riskCategories.reduce(
    (acc, cat) => acc + cat.risks.filter(r => r.severity === 'red').length, 
    0
  );

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryBanner}>
          <AlertOctagon size={24} color={Colors.danger} />
          <View style={styles.summaryText}>
            <Text style={styles.summaryTitle}>Risk Heat Map</Text>
            <Text style={styles.summarySubtitle}>
              {totalCritical} critical risks identified across {riskCategories.length} categories
            </Text>
          </View>
        </View>

        {riskCategories.map((category) => (
          <View key={category.name} style={styles.categoryCard}>
            <TouchableOpacity 
              style={styles.categoryHeader}
              onPress={() => setExpandedCategory(
                expandedCategory === category.name ? null : category.name
              )}
              activeOpacity={0.7}
            >
              <View style={styles.categoryTitleRow}>
                {categoryIcons[category.name]}
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <View style={[styles.levelBadge, { backgroundColor: getLevelColor(category.level) + '20' }]}>
                    <Text style={[styles.levelText, { color: getLevelColor(category.level) }]}>
                      {category.level} Risk
                    </Text>
                  </View>
                </View>
              </View>
              <ChevronRight 
                size={20} 
                color={Colors.textSecondary}
                style={{ transform: [{ rotate: expandedCategory === category.name ? '90deg' : '0deg' }] }}
              />
            </TouchableOpacity>

            {expandedCategory === category.name && (
              <View style={styles.risksList}>
                {category.risks.map((risk) => (
                  <View key={risk.id} style={styles.riskItem}>
                    <StatusBadge status={risk.severity} size="medium" />
                    <Text style={styles.riskName}>{risk.name}</Text>
                    <Text style={[
                      styles.riskSeverity,
                      { color: risk.severity === 'red' ? Colors.danger : 
                              risk.severity === 'amber' ? Colors.warning : Colors.success }
                    ]}>
                      {risk.severity === 'red' ? 'Critical' : 
                       risk.severity === 'amber' ? 'Medium' : 'Low'}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}

        <View style={styles.legendCard}>
          <Text style={styles.legendTitle}>Risk Severity Legend</Text>
          <View style={styles.legendItems}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.danger }]} />
              <Text style={styles.legendLabel}>Critical - Immediate action required</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.warning }]} />
              <Text style={styles.legendLabel}>Medium - Monitor closely</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.success }]} />
              <Text style={styles.legendLabel}>Low - Under control</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  summaryBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: Colors.dangerBg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.danger + '30',
  },
  summaryText: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  summarySubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  categoryCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  categoryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  levelBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  levelText: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  risksList: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingVertical: 8,
  },
  riskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  riskName: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
  },
  riskSeverity: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  legendCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  legendTitle: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  legendItems: {
    gap: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLabel: {
    fontSize: 12,
    color: Colors.textMuted,
  },
});
