import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FileCheck, CheckCircle, AlertCircle, XCircle } from 'lucide-react-native';
import Colors from '@/constants/colors';
import ProgressBar from '@/components/ProgressBar';
import { complianceSections, executiveSummary, teamMembers } from '@/mocks/dashboardData';

export default function ComplianceScreen() {
  const insets = useSafeAreaInsets();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'green': return <CheckCircle size={18} color={Colors.success} />;
      case 'amber': return <AlertCircle size={18} color={Colors.warning} />;
      case 'red': return <XCircle size={18} color={Colors.danger} />;
      default: return null;
    }
  };

  const compliantCount = complianceSections.filter(s => s.status === 'green').length;

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerCard}>
          <FileCheck size={28} color={Colors.primary} />
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>GovS-013 Alignment</Text>
            <Text style={styles.headerSubtitle}>Public Sector Fraud Standard</Text>
          </View>
          <View style={styles.complianceScore}>
            <Text style={styles.scoreValue}>{executiveSummary.govS013Compliance}%</Text>
            <Text style={styles.scoreLabel}>Compliant</Text>
          </View>
        </View>

        <View style={styles.progressSection}>
          <ProgressBar 
            progress={executiveSummary.govS013Compliance} 
            status="green"
            height={10}
          />
          <Text style={styles.progressText}>
            {compliantCount} of {complianceSections.length} sections fully compliant
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Compliance Status by Section</Text>

        {complianceSections.map((section) => (
          <View key={section.id} style={styles.complianceRow}>
            <View style={styles.rowHeader}>
              {getStatusIcon(section.status)}
              <Text style={styles.sectionName}>{section.section}</Text>
            </View>
            <View style={styles.rowDetails}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Evidence</Text>
                <Text style={styles.detailValue}>{section.evidence}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Gap</Text>
                <Text style={[
                  styles.detailValue,
                  section.gap !== 'None' && styles.gapHighlight
                ]}>
                  {section.gap}
                </Text>
              </View>
            </View>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Team Accountability</Text>
        <View style={styles.teamCard}>
          <Text style={styles.teamSubtitle}>Cross-Functional Team ({teamMembers.length} Members)</Text>
          
          {teamMembers.map((member) => (
            <View key={member.id} style={styles.memberRow}>
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{member.name}</Text>
                <Text style={styles.memberDept}>{member.department}</Text>
              </View>
              <View style={styles.memberStats}>
                <Text style={styles.tasksCount}>{member.assignedTasks} tasks</Text>
                <View style={styles.memberProgress}>
                  <ProgressBar 
                    progress={member.completion} 
                    showLabel={true}
                    height={4}
                    animated={false}
                  />
                </View>
              </View>
            </View>
          ))}
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
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 14,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  complianceScore: {
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: Colors.success,
  },
  scoreLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  progressSection: {
    marginTop: 16,
    marginBottom: 24,
  },
  progressText: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 8,
    textAlign: 'center' as const,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 12,
    marginTop: 8,
  },
  complianceRow: {
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  sectionName: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  rowDetails: {
    flexDirection: 'row',
    gap: 20,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 2,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.3,
  },
  detailValue: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  gapHighlight: {
    color: Colors.warning,
    fontWeight: '500' as const,
  },
  teamCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  teamSubtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    marginBottom: 16,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  memberInfo: {
    width: 120,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.text,
  },
  memberDept: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  memberStats: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tasksCount: {
    fontSize: 12,
    color: Colors.textSecondary,
    width: 55,
  },
  memberProgress: {
    flex: 1,
  },
});
