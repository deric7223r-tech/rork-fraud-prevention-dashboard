import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  ClipboardList, 
  Flag, 
  Users, 
  Calendar, 
  Wrench,
  ChevronRight,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useForms } from '@/contexts/FormsContext';

interface FormType {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  route: string;
}

const formTypes: FormType[] = [
  {
    id: 'initiative',
    title: 'Initiative Submission',
    description: 'Submit new fraud prevention initiatives',
    icon: <FileText size={24} color={Colors.primary} />,
    color: Colors.primary,
    route: '/forms/initiative-submission',
  },
  {
    id: 'risk',
    title: 'Risk Assessment',
    description: 'Document new or updated fraud risks',
    icon: <AlertTriangle size={24} color={Colors.danger} />,
    color: Colors.danger,
    route: '/forms/risk-assessment',
  },
  {
    id: 'compliance',
    title: 'Compliance Update',
    description: 'Log compliance status and audit results',
    icon: <CheckCircle size={24} color={Colors.success} />,
    color: Colors.success,
    route: '/forms/compliance-update',
  },
  {
    id: 'task',
    title: 'Task Update',
    description: 'Update task progress and flag issues',
    icon: <ClipboardList size={24} color={Colors.warning} />,
    color: Colors.warning,
    route: '/forms/task-update',
  },
  {
    id: 'fraud-report',
    title: 'Fraud Report',
    description: 'Submit fraud reports via official channels',
    icon: <Flag size={24} color={Colors.danger} />,
    color: Colors.danger,
    route: '/forms/fraud-report',
  },
  {
    id: 'training',
    title: 'Training Feedback',
    description: 'Record training completion and feedback',
    icon: <Users size={24} color={Colors.info} />,
    color: Colors.info,
    route: '/forms/training-feedback',
  },
  {
    id: 'quarterly',
    title: 'Quarterly Review',
    description: 'Collect input for quarterly reviews',
    icon: <Calendar size={24} color={Colors.primary} />,
    color: Colors.primary,
    route: '/forms/quarterly-review',
  },
  {
    id: 'tech-issue',
    title: 'Technology Issue',
    description: 'Report technology-related issues',
    icon: <Wrench size={24} color={Colors.warning} />,
    color: Colors.warning,
    route: '/forms/tech-issue',
  },
];

export default function FormsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { submissions, drafts, loadForms } = useForms();
  const [filter, setFilter] = useState<'all' | 'drafts' | 'submitted'>('all');

  useEffect(() => {
    loadForms();
  }, [loadForms]);

  const filterOptions = [
    { key: 'all' as const, label: 'All Forms', count: formTypes.length },
    { key: 'drafts' as const, label: 'Drafts', count: drafts.length },
    { key: 'submitted' as const, label: 'Submitted', count: submissions.length },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.filterBar}>
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
                filter === option.key && { backgroundColor: Colors.primary + '20', borderColor: Colors.primary }
              ]}
              onPress={() => setFilter(option.key)}
            >
              <Text style={[
                styles.filterText,
                filter === option.key && { color: Colors.primary }
              ]}>
                {option.label}
              </Text>
              {option.count > 0 && (
                <View style={[
                  styles.badge,
                  filter === option.key && { backgroundColor: Colors.primary }
                ]}>
                  <Text style={[
                    styles.badgeText,
                    filter === option.key && { color: Colors.surface }
                  ]}>
                    {option.count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {filter === 'all' && (
          <>
            <Text style={styles.sectionTitle}>Available Forms</Text>
            {formTypes.map((form) => (
              <TouchableOpacity
                key={form.id}
                style={styles.formCard}
                onPress={() => router.push(form.route as any)}
                activeOpacity={0.7}
              >
                <View style={[styles.iconContainer, { backgroundColor: form.color + '15' }]}>
                  {form.icon}
                </View>
                <View style={styles.formInfo}>
                  <Text style={styles.formTitle}>{form.title}</Text>
                  <Text style={styles.formDescription}>{form.description}</Text>
                </View>
                <ChevronRight size={20} color={Colors.textMuted} />
              </TouchableOpacity>
            ))}
          </>
        )}

        {filter === 'drafts' && (
          <>
            <Text style={styles.sectionTitle}>Draft Forms ({drafts.length})</Text>
            {drafts.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No draft forms</Text>
              </View>
            ) : (
              drafts.map((draft) => {
                const formType = formTypes.find(f => f.id === draft.formType);
                return (
                  <TouchableOpacity
                    key={draft.id}
                    style={styles.submissionCard}
                    onPress={() => formType && router.push(formType.route as any)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.submissionHeader}>
                      <Text style={styles.submissionTitle}>{formType?.title || 'Unknown Form'}</Text>
                      <View style={styles.draftBadge}>
                        <Text style={styles.draftBadgeText}>Draft</Text>
                      </View>
                    </View>
                    <Text style={styles.submissionDate}>
                      Last updated: {new Date(draft.updatedAt).toLocaleDateString()}
                    </Text>
                  </TouchableOpacity>
                );
              })
            )}
          </>
        )}

        {filter === 'submitted' && (
          <>
            <Text style={styles.sectionTitle}>Submitted Forms ({submissions.length})</Text>
            {submissions.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No submitted forms</Text>
              </View>
            ) : (
              submissions.map((submission) => {
                const formType = formTypes.find(f => f.id === submission.formType);
                const statusColors: Record<string, string> = {
                  submitted: Colors.info,
                  in_review: Colors.warning,
                  approved: Colors.success,
                  rejected: Colors.danger,
                };
                return (
                  <View key={submission.id} style={styles.submissionCard}>
                    <View style={styles.submissionHeader}>
                      <Text style={styles.submissionTitle}>{formType?.title || 'Unknown Form'}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: statusColors[submission.status] + '20' }]}>
                        <Text style={[styles.statusBadgeText, { color: statusColors[submission.status] }]}>
                          {submission.status.replace('_', ' ')}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.submissionDate}>
                      Submitted: {new Date(submission.createdAt).toLocaleDateString()}
                    </Text>
                    {submission.referenceId && (
                      <Text style={styles.referenceId}>Ref: {submission.referenceId}</Text>
                    )}
                  </View>
                );
              })
            )}
          </>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surface,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
  },
  badge: {
    backgroundColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.textMuted,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  formCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formInfo: {
    flex: 1,
  },
  formTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 2,
  },
  formDescription: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  submissionCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  submissionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  submissionTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
    flex: 1,
  },
  draftBadge: {
    backgroundColor: Colors.textMuted + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  draftBadgeText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.textMuted,
    textTransform: 'uppercase',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '600' as const,
    textTransform: 'capitalize',
  },
  submissionDate: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  referenceId: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
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
