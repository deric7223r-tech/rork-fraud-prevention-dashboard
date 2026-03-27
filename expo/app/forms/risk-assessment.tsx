import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Save, Send } from 'lucide-react-native';
import Colors from '@/constants/colors';
import FormInput from '@/components/FormInput';
import FormPicker from '@/components/FormPicker';
import FormFileUpload from '@/components/FormFileUpload';
import { useForms } from '@/contexts/FormsContext';

interface FileAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
}

interface FormData {
  riskCategory: string;
  description: string;
  likelihood: string;
  impact: string;
  mitigationPlan: string;
  owner: string;
  evidence: FileAttachment[];
}

const initialFormData: FormData = {
  riskCategory: '',
  description: '',
  likelihood: '',
  impact: '',
  mitigationPlan: '',
  owner: '',
  evidence: [],
};

export default function RiskAssessmentForm() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { submitForm } = useForms();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const categoryOptions = [
    { label: 'Procurement Risks', value: 'procurement' },
    { label: 'Payroll Risks', value: 'payroll' },
    { label: 'Digital Systems', value: 'digital' },
    { label: 'Financial Controls', value: 'financial' },
    { label: 'Operational', value: 'operational' },
  ];

  const ratingOptions = [
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
    { label: 'Critical', value: 'critical' },
  ];

  const validate = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    if (!formData.riskCategory) newErrors.riskCategory = 'Category is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.likelihood) newErrors.likelihood = 'Likelihood rating is required';
    if (!formData.impact) newErrors.impact = 'Impact rating is required';
    if (!formData.owner.trim()) newErrors.owner = 'Owner is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (isDraft = false) => {
    if (!isDraft && !validate()) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    try {
      const submission = await submitForm('risk', formData, isDraft);
      Alert.alert(
        'Success',
        isDraft 
          ? 'Draft saved successfully' 
          : `Risk assessment submitted\nReference: ${submission.referenceId}`,
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
          Document new or updated fraud risks for inclusion in the Risk Heat Map
        </Text>

        <FormPicker
          label="Risk Category"
          value={formData.riskCategory}
          options={categoryOptions}
          onValueChange={(value) => setFormData({ ...formData, riskCategory: value })}
          required
          error={errors.riskCategory}
        />

        <FormInput
          label="Risk Description"
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
          placeholder="Detailed description of the risk"
          multiline
          rows={4}
          required
          error={errors.description}
        />

        <FormPicker
          label="Likelihood Rating"
          value={formData.likelihood}
          options={ratingOptions}
          onValueChange={(value) => setFormData({ ...formData, likelihood: value })}
          required
          error={errors.likelihood}
        />

        <FormPicker
          label="Impact Rating"
          value={formData.impact}
          options={ratingOptions}
          onValueChange={(value) => setFormData({ ...formData, impact: value })}
          required
          error={errors.impact}
        />

        <FormInput
          label="Proposed Mitigation Plan"
          value={formData.mitigationPlan}
          onChangeText={(text) => setFormData({ ...formData, mitigationPlan: text })}
          placeholder="Describe how to mitigate this risk"
          multiline
          rows={4}
        />

        <FormInput
          label="Risk Owner"
          value={formData.owner}
          onChangeText={(text) => setFormData({ ...formData, owner: text })}
          placeholder="Name or department"
          required
          error={errors.owner}
        />

        <FormFileUpload
          label="Supporting Evidence"
          files={formData.evidence}
          onFilesChange={(files) => setFormData({ ...formData, evidence: files })}
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
