import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Save, Send } from 'lucide-react-native';
import Colors from '@/constants/colors';
import FormInput from '@/components/FormInput';
import FormPicker from '@/components/FormPicker';
import { useForms } from '@/contexts/FormsContext';

interface FormData {
  technologyName: string;
  issueDescription: string;
  impact: string;
  stepsTaken: string;
  currentStatus: string;
}

export default function TechIssueForm() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { submitForm } = useForms();
  const [formData, setFormData] = useState<FormData>({
    technologyName: '',
    issueDescription: '',
    impact: '',
    stepsTaken: '',
    currentStatus: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const technologyOptions = [
    { label: 'Transaction Monitoring', value: 'transaction-monitoring' },
    { label: 'Anomaly Detection', value: 'anomaly-detection' },
    { label: 'Duplicate Payment Check', value: 'duplicate-payment' },
    { label: 'Supplier Verification', value: 'supplier-verification' },
    { label: 'Other System', value: 'other' },
  ];

  const statusOptions = [
    { label: 'Reported', value: 'reported' },
    { label: 'Under Investigation', value: 'investigating' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'Resolved', value: 'resolved' },
  ];

  const validate = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    if (!formData.technologyName) newErrors.technologyName = 'Technology name is required';
    if (!formData.issueDescription.trim()) newErrors.issueDescription = 'Issue description is required';
    if (!formData.currentStatus) newErrors.currentStatus = 'Status is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (isDraft = false) => {
    if (!isDraft && !validate()) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    try {
      const submission = await submitForm('tech-issue', formData, isDraft);
      Alert.alert(
        'Success',
        isDraft 
          ? 'Draft saved successfully' 
          : `Technology issue submitted\nReference: ${submission.referenceId}`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch {
      Alert.alert('Error', 'Failed to submit form');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.description}>
          Log and track issues with deployed fraud prevention technologies
        </Text>

        <FormPicker
          label="Technology Solution"
          value={formData.technologyName}
          options={technologyOptions}
          onValueChange={(value) => setFormData({ ...formData, technologyName: value })}
          required
          error={errors.technologyName}
        />

        <FormInput
          label="Issue Description"
          value={formData.issueDescription}
          onChangeText={(text) => setFormData({ ...formData, issueDescription: text })}
          placeholder="Describe the technical issue"
          multiline
          rows={5}
          required
          error={errors.issueDescription}
        />

        <FormInput
          label="Impact on Fraud Prevention"
          value={formData.impact}
          onChangeText={(text) => setFormData({ ...formData, impact: text })}
          placeholder="How does this impact fraud prevention processes?"
          multiline
          rows={4}
        />

        <FormInput
          label="Steps Taken to Resolve"
          value={formData.stepsTaken}
          onChangeText={(text) => setFormData({ ...formData, stepsTaken: text })}
          placeholder="What has been done so far?"
          multiline
          rows={4}
        />

        <FormPicker
          label="Current Status"
          value={formData.currentStatus}
          options={statusOptions}
          onValueChange={(value) => setFormData({ ...formData, currentStatus: value })}
          required
          error={errors.currentStatus}
        />
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          style={styles.draftButton}
          onPress={() => handleSubmit(true)}
          activeOpacity={0.7}
        >
          <Save size={18} color={Colors.textSecondary} />
          <Text style={styles.draftButtonText}>Save Draft</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => handleSubmit(false)}
          activeOpacity={0.7}
        >
          <Send size={18} color={Colors.surface} />
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
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
  description: {
    fontSize: 14,
    color: Colors.textMuted,
    marginBottom: 24,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  draftButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceElevated,
  },
  draftButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  submitButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: Colors.primary,
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.surface,
  },
});
