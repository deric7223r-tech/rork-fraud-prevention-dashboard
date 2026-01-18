import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Save, Send } from 'lucide-react-native';
import Colors from '@/constants/colors';
import FormInput from '@/components/FormInput';
import FormPicker from '@/components/FormPicker';
import FormDatePicker from '@/components/FormDatePicker';
import FormFileUpload from '@/components/FormFileUpload';
import { useForms } from '@/contexts/FormsContext';

interface FileAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
}

interface FormData {
  policyReference: string;
  complianceStatus: string;
  auditFindings: string;
  correctiveActions: string;
  evidenceDocs: FileAttachment[];
  deadline: Date | null;
}

export default function ComplianceUpdateForm() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { submitForm } = useForms();
  const [formData, setFormData] = useState<FormData>({
    policyReference: '',
    complianceStatus: '',
    auditFindings: '',
    correctiveActions: '',
    evidenceDocs: [],
    deadline: null,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const statusOptions = [
    { label: 'Compliant', value: 'compliant' },
    { label: 'Non-Compliant', value: 'non-compliant' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'Under Review', value: 'under-review' },
  ];

  const validate = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    if (!formData.policyReference.trim()) newErrors.policyReference = 'Policy reference is required';
    if (!formData.complianceStatus) newErrors.complianceStatus = 'Status is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (isDraft = false) => {
    if (!isDraft && !validate()) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    try {
      const submission = await submitForm('compliance', formData, isDraft);
      Alert.alert(
        'Success',
        isDraft 
          ? 'Draft saved successfully' 
          : `Compliance update submitted\nReference: ${submission.referenceId}`,
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
          Log compliance status changes, audit results, and supporting evidence
        </Text>

        <FormInput
          label="Policy/Regulation Reference"
          value={formData.policyReference}
          onChangeText={(text) => setFormData({ ...formData, policyReference: text })}
          placeholder="e.g., GovS-013, Section 3"
          required
          error={errors.policyReference}
        />

        <FormPicker
          label="Compliance Status"
          value={formData.complianceStatus}
          options={statusOptions}
          onValueChange={(value) => setFormData({ ...formData, complianceStatus: value })}
          required
          error={errors.complianceStatus}
        />

        <FormInput
          label="Audit Findings"
          value={formData.auditFindings}
          onChangeText={(text) => setFormData({ ...formData, auditFindings: text })}
          placeholder="Summary of audit findings"
          multiline
          rows={4}
        />

        <FormInput
          label="Corrective Actions Taken"
          value={formData.correctiveActions}
          onChangeText={(text) => setFormData({ ...formData, correctiveActions: text })}
          placeholder="Actions taken to address issues"
          multiline
          rows={4}
        />

        <FormFileUpload
          label="Evidence Documents"
          files={formData.evidenceDocs}
          onFilesChange={(files) => setFormData({ ...formData, evidenceDocs: files })}
        />

        <FormDatePicker
          label="Deadline for Resolution"
          value={formData.deadline}
          onChange={(date) => setFormData({ ...formData, deadline: date })}
          minimumDate={new Date()}
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
