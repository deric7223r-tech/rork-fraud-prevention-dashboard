import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GraduationCap, TrendingUp, Clock } from 'lucide-react-native';
import Colors from '@/constants/colors';
import ProgressBar from '@/components/ProgressBar';
import StatusBadge from '@/components/StatusBadge';
import { departmentTraining, executiveSummary, techImplementation } from '@/mocks/dashboardData';

export default function TrainingScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.overviewCard}>
          <View style={styles.overviewHeader}>
            <GraduationCap size={24} color={Colors.primary} />
            <Text style={styles.overviewTitle}>Training Completion</Text>
          </View>
          <View style={styles.overviewStats}>
            <View style={styles.mainStat}>
              <Text style={styles.mainStatValue}>{executiveSummary.staffTrainingCompletion}%</Text>
              <Text style={styles.mainStatLabel}>Overall Complete</Text>
            </View>
            <View style={styles.overviewProgress}>
              <ProgressBar 
                progress={executiveSummary.staffTrainingCompletion} 
                status="amber"
                showLabel={false}
                height={8}
              />
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Departmental Progress</Text>
        <View style={styles.departmentList}>
          {departmentTraining.map((dept, index) => (
            <View 
              key={dept.id} 
              style={[
                styles.departmentRow,
                index === 0 && styles.firstRow
              ]}
            >
              <View style={styles.deptInfo}>
                <StatusBadge status={dept.status} size="small" />
                <Text style={styles.deptName}>{dept.department}</Text>
              </View>
              <View style={styles.deptProgress}>
                <ProgressBar 
                  progress={dept.progress} 
                  status={dept.status}
                  height={6}
                />
              </View>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Technology Implementation</Text>
        <View style={styles.techCard}>
          <View style={styles.techHeader}>
            <TrendingUp size={18} color={Colors.info} />
            <Text style={styles.techTitle}>Monitoring Systems Deployment</Text>
          </View>
          
          {techImplementation.map((tech) => (
            <View key={tech.id} style={styles.techRow}>
              <View style={styles.techInfo}>
                <StatusBadge status={tech.status} size="small" />
                <Text style={styles.techName}>{tech.name}</Text>
              </View>
              <View style={styles.techStatus}>
                <Text style={[
                  styles.techDetail,
                  { color: tech.status === 'green' ? Colors.success : 
                           tech.status === 'amber' ? Colors.warning : Colors.danger }
                ]}>
                  {tech.detail}
                </Text>
                <Text style={styles.techPercent}>{tech.progress}%</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.timelineCard}>
          <View style={styles.timelineHeader}>
            <Clock size={18} color={Colors.purple} />
            <Text style={styles.timelineTitle}>Implementation Timeline</Text>
          </View>
          
          <View style={styles.timeline}>
            <TimelineItem 
              quarter="Q1 2024" 
              items={['Fraud Response Plan ✓', 'Whistleblowing Policy ✓']} 
              status="completed" 
            />
            <TimelineItem 
              quarter="Q2 2024" 
              items={['Procurement Policy', 'Expense Policy']} 
              status="in_progress" 
            />
            <TimelineItem 
              quarter="Q3 2024" 
              items={['All Policies Complete']} 
              status="pending" 
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function TimelineItem({ quarter, items, status }: { 
  quarter: string; 
  items: string[]; 
  status: 'completed' | 'in_progress' | 'pending' 
}) {
  const getColor = () => {
    switch (status) {
      case 'completed': return Colors.success;
      case 'in_progress': return Colors.warning;
      case 'pending': return Colors.textMuted;
    }
  };

  return (
    <View style={styles.timelineItem}>
      <View style={styles.timelineDotContainer}>
        <View style={[styles.timelineDot, { backgroundColor: getColor() }]} />
        <View style={[styles.timelineLine, { backgroundColor: Colors.border }]} />
      </View>
      <View style={styles.timelineContent}>
        <Text style={[styles.timelineQuarter, { color: getColor() }]}>{quarter}</Text>
        {items.map((item, idx) => (
          <Text key={idx} style={styles.timelineText}>{item}</Text>
        ))}
      </View>
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
  overviewCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  overviewTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  overviewStats: {
    gap: 12,
  },
  mainStat: {
    alignItems: 'center',
  },
  mainStatValue: {
    fontSize: 48,
    fontWeight: '800' as const,
    color: Colors.warning,
  },
  mainStatLabel: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  overviewProgress: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
    marginTop: 24,
    marginBottom: 12,
  },
  departmentList: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  departmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  firstRow: {
    borderTopWidth: 0,
  },
  deptInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: 140,
  },
  deptName: {
    fontSize: 13,
    color: Colors.text,
    fontWeight: '500' as const,
  },
  deptProgress: {
    flex: 1,
  },
  techCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  techHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  techTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  techRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  techInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  techName: {
    fontSize: 13,
    color: Colors.text,
  },
  techStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  techDetail: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
  techPercent: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '600' as const,
    width: 40,
    textAlign: 'right' as const,
  },
  timelineCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  timelineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  timeline: {
    gap: 0,
  },
  timelineItem: {
    flexDirection: 'row',
    minHeight: 70,
  },
  timelineDotContainer: {
    alignItems: 'center',
    width: 24,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
    paddingLeft: 12,
    paddingBottom: 16,
  },
  timelineQuarter: {
    fontSize: 13,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  timelineText: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});
