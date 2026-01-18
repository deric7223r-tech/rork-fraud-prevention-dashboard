import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Shield, AlertTriangle, Users, Clock, CheckCircle, TrendingUp } from 'lucide-react-native';
import Colors from '@/constants/colors';
import MetricCard from '@/components/MetricCard';
import SectionHeader from '@/components/SectionHeader';
import ProgressBar from '@/components/ProgressBar';
import StatusBadge from '@/components/StatusBadge';
import { 
  executiveSummary, 
  initiatives, 
  whistleblowingStats,
  upcomingDeadlines,
} from '@/mocks/dashboardData';

export default function OverviewScreen() {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const completedInitiatives = initiatives.filter(i => i.percentComplete === 100).length;
  const criticalInitiatives = initiatives.filter(i => i.status === 'red').length;

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
      >
        <View style={styles.statusBanner}>
          <View style={styles.statusHeader}>
            <Shield size={20} color={Colors.warning} />
            <Text style={styles.statusTitle}>Overall Implementation Status</Text>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.statusValue}>{executiveSummary.implementationProgress}%</Text>
            <StatusBadge status={executiveSummary.overallStatus} showLabel size="large" />
          </View>
          <ProgressBar 
            progress={executiveSummary.implementationProgress} 
            status={executiveSummary.overallStatus}
            showLabel={false}
            height={8}
          />
          <Text style={styles.statusSubtext}>
            Day {executiveSummary.daysSinceLaunch} of {executiveSummary.totalDays}
          </Text>
        </View>

        <View style={styles.metricsGrid}>
          <MetricCard
            title="Critical Risks"
            value={executiveSummary.criticalRisks}
            status="red"
            compact
            icon={<AlertTriangle size={18} color={Colors.danger} />}
          />
          <MetricCard
            title="Controls Active"
            value={`${executiveSummary.controlsImplemented}/${executiveSummary.totalControls}`}
            status="amber"
            compact
            icon={<CheckCircle size={18} color={Colors.warning} />}
          />
        </View>

        <View style={styles.metricsGrid}>
          <MetricCard
            title="Training"
            value={`${executiveSummary.staffTrainingCompletion}%`}
            status="amber"
            compact
            icon={<Users size={18} color={Colors.warning} />}
          />
          <MetricCard
            title="GovS-013"
            value={`${executiveSummary.govS013Compliance}%`}
            status="green"
            compact
            icon={<TrendingUp size={18} color={Colors.success} />}
          />
        </View>

        <SectionHeader title="Initiative Summary" />
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>{initiatives.length}</Text>
              <Text style={styles.summaryLabel}>Total</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryNumber, { color: Colors.success }]}>{completedInitiatives}</Text>
              <Text style={styles.summaryLabel}>Complete</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryNumber, { color: Colors.danger }]}>{criticalInitiatives}</Text>
              <Text style={styles.summaryLabel}>Critical</Text>
            </View>
          </View>
        </View>

        <SectionHeader title="Whistleblowing Activity" />
        <View style={styles.whistleCard}>
          <View style={styles.whistleRow}>
            <View style={styles.whistleStat}>
              <Text style={styles.whistleValue}>{whistleblowingStats.totalReports}</Text>
              <Text style={styles.whistleLabel}>Total Reports</Text>
            </View>
            <View style={styles.whistleStat}>
              <Text style={styles.whistleValue}>{whistleblowingStats.anonymousPercent}%</Text>
              <Text style={styles.whistleLabel}>Anonymous</Text>
            </View>
            <View style={styles.whistleStat}>
              <Text style={styles.whistleValue}>{whistleblowingStats.avgResolutionDays}d</Text>
              <Text style={styles.whistleLabel}>Avg Resolution</Text>
            </View>
          </View>
        </View>

        <SectionHeader title="Upcoming Deadlines" />
        {upcomingDeadlines.map((month) => (
          <View key={month.month} style={styles.deadlineSection}>
            <Text style={styles.monthTitle}>{month.month}</Text>
            {month.items.map((item) => (
              <View key={item.id} style={styles.deadlineItem}>
                <Clock size={14} color={Colors.textMuted} />
                <Text style={styles.deadlineDate}>{item.date}</Text>
                <Text style={styles.deadlineTitle} numberOfLines={1}>{item.title}</Text>
              </View>
            ))}
          </View>
        ))}
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
  statusBanner: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  statusTitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statusValue: {
    fontSize: 48,
    fontWeight: '800' as const,
    color: Colors.text,
  },
  statusSubtext: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 12,
    textAlign: 'center' as const,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  summaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.border,
  },
  summaryNumber: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  summaryLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
  },
  whistleCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  whistleRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  whistleStat: {
    alignItems: 'center',
  },
  whistleValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.info,
  },
  whistleLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 4,
  },
  deadlineSection: {
    marginBottom: 16,
  },
  monthTitle: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.primary,
    marginBottom: 10,
  },
  deadlineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: Colors.surface,
    borderRadius: 8,
    marginBottom: 6,
  },
  deadlineDate: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600' as const,
    width: 50,
  },
  deadlineTitle: {
    fontSize: 13,
    color: Colors.text,
    flex: 1,
  },
});
