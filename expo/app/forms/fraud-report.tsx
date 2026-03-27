import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Switch } from 'react-native';
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
  reportType: string;
  incidentDescription: string;
  incidentDate: Date | null;
  affectedSystems: string;
  evidenceAttachments: FileAttachment[];
  reporterName: string;
  reporterContact: string;
  isAnonymous: boolean;
}

export default function FraudReportForm() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { submitForm } = useForms();
  const [formData, setFormData] = useState<FormData>({
    reportType: '',
    incidentDescription: '',
    incidentDate: null,
    affectedSystems: '',
    evidenceAttachments: [],
    reporterName: '',
    reporterContact: '',
    isAnonymous: false,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const reportTypeOptions = [
    { label: 'Financial Fraud', value: 'financial' },
    { label: 'Procurement Fraud', value: 'procurement' },
    { label: 'Payroll Fraud', value: 'payroll' },
    { label: 'Cyber Fraud', value: 'cyber' },
    { label: 'Other', value: 'other' },
  ];

  const validate = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    if (!formData.reportType) newErrors.reportType = 'Report type is required';
    if (!formData.incidentDescription.trim()) newErrors.incidentDescription = 'Description is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (isDraft = false) => {
    if (!isDraft && !validate()) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    try {
      const submission = await submitForm('fraud-report', formData, isDraft);
      Alert.alert(
        'Success',
        isDraft 
          ? 'Draft saved successfully' 
          : `Fraud report submitted confidentially\nReference: ${submission.referenceId}`,
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
          Submit fraud reports via official channels. All reports are handled confidentially.
        </Text>

        <View style={styles.anonymousToggle}>
          <View style={styles.anonymousInfo}>
            <Text style={styles.anonymousLabel}>Submit Anonymously</Text>
            <Text style={styles.anonymousSubtext}>Your identity will not be recorded</Text>
          </View>
          <Switch
            value={formData.isAnonymous}
            onValueChange={(value) => setFormData({ ...formData, isAnonymous: value })}
            trackColor={{ false: Colors.border, true: Colors.primary + '40' }}
            thumbColor={formData.isAnonymous ? Colors.primary : Colors.textMuted}
          />
        </View>

        <FormPicker
          label="Report Type"
          value={formData.reportType}
          options={reportTypeOptions}
          onValueChange={(value) => setFormData({ ...formData, reportType: value })}
          required
          error={errors.reportType}
        />

        <FormInput
          label="Incident Description"
          value={formData.incidentDescription}
          onChangeText={(text) => setFormData({ ...formData, incidentDescription: text })}
          placeholder="Provide detailed description of the incident"
          multiline
          rows={5}
          required
          error={errors.incidentDescription}
        />

        <FormDatePicker
          label="Date/Time of Occurrence"
          value={formData.incidentDate}
          onChange={(date) => setFormData({ ...formData, incidentDate: date })}
          maximumDate={new Date()}
        />

        <FormInput
          label="Affected Systems or Departments"
          value={formData.affectedSystems}
          onChangeText={(text) => setFormData({ ...formData, affectedSystems: text })}
          placeholder="Which systems or departments are affected?"
          multiline
          rows={3}
        />

        <FormFileUpload
          label="Evidence Attachments"
          files={formData.evidenceAttachments}
          onFilesChange={(files) => setFormData({ ...formData, evidenceAttachments: files })}
        />

        {!formData.isAnonymous && (
          <>
            <FormInput
              label="Your Name"
              value={formData.reporterName}
              onChangeText={(text) => setFormData({ ...formData, reporterName: text })}
              placeholder="Full name"
            />

            <FormInput
              label="Contact Details"
              value={formData.reporterContact}
              onChangeText={(text) => setFormData({ ...formData, reporterContact: text })}
              placeholder="Email or phone number"
            />
          </>
        )}
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
  anonymousToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  anonymousInfo: {
    flex: 1,
  },
  anonymousLabel: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 2,
  },
  anonymousSubtext: {
    fontSize: 12,
    color: Colors.textMuted,
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
