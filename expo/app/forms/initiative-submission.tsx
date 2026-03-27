import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Save, Send } from 'lucide-react-native';
import Colors from '@/constants/colors';
import FormInput from '@/components/FormInput';
import FormPicker from '@/components/FormPicker';
import FormDatePicker from '@/components/FormDatePicker';
import { useForms } from '@/contexts/FormsContext';

interface FormData {
  initiativeName: string;
  category: string;
  description: string;
  riskReduction: string;
  budget: string;
  startDate: Date | null;
  endDate: Date | null;
  owner: string;
  milestones: string;
  dependencies: string;
}

const initialFormData: FormData = {
  initiativeName: '',
  category: '',
  description: '',
  riskReduction: '',
  budget: '',
  startDate: null,
  endDate: null,
  owner: '',
  milestones: '',
  dependencies: '',
};

export default function InitiativeSubmissionForm() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { submitForm } = useForms();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const categoryOptions = [
    { label: 'Risk Assessment', value: 'risk-assessment' },
    { label: 'Compliance', value: 'compliance' },
    { label: 'Technology', value: 'technology' },
    { label: 'Training', value: 'training' },
    { label: 'Policy', value: 'policy' },
    { label: 'Monitoring', value: 'monitoring' },
  ];

  const validate = () => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.initiativeName.trim()) {
      newErrors.initiativeName = 'Initiative name is required';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.owner.trim()) {
      newErrors.owner = 'Owner is required';
    }
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required' as any;
    }
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required' as any;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (isDraft = false) => {
    if (!isDraft && !validate()) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    try {
      const submission = await submitForm('initiative', formData, isDraft);
      Alert.alert(
        'Success',
        isDraft 
          ? 'Draft saved successfully' 
          : `Initiative submitted successfully\nReference: ${submission.referenceId}`,
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
          Submit new fraud prevention initiatives for approval and tracking
        </Text>

        <FormInput
          label="Initiative Name"
          value={formData.initiativeName}
          onChangeText={(text) => setFormData({ ...formData, initiativeName: text })}
          placeholder="Enter initiative name"
          required
          error={errors.initiativeName}
        />

        <FormPicker
          label="Category"
          value={formData.category}
          options={categoryOptions}
          onValueChange={(value) => setFormData({ ...formData, category: value })}
          required
          error={errors.category}
        />

        <FormInput
          label="Description"
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
          placeholder="Detailed description of the initiative"
          multiline
          rows={4}
          required
          error={errors.description}
        />

        <FormInput
          label="Expected Risk Reduction"
          value={formData.riskReduction}
          onChangeText={(text) => setFormData({ ...formData, riskReduction: text })}
          placeholder="Describe the expected impact on risk reduction"
          multiline
          rows={3}
        />

        <FormInput
          label="Budget Estimate"
          value={formData.budget}
          onChangeText={(text) => setFormData({ ...formData, budget: text })}
          placeholder="$0.00"
          keyboardType="numeric"
        />

        <FormDatePicker
          label="Start Date"
          value={formData.startDate}
          onChange={(date) => setFormData({ ...formData, startDate: date })}
          required
          error={errors.startDate as unknown as string}
          minimumDate={new Date()}
        />

        <FormDatePicker
          label="End Date"
          value={formData.endDate}
          onChange={(date) => setFormData({ ...formData, endDate: date })}
          required
          error={errors.endDate as unknown as string}
          minimumDate={formData.startDate || new Date()}
        />

        <FormInput
          label="Proposed Owner"
          value={formData.owner}
          onChangeText={(text) => setFormData({ ...formData, owner: text })}
          placeholder="Name or department"
          required
          error={errors.owner}
        />

        <FormInput
          label="Key Milestones"
          value={formData.milestones}
          onChangeText={(text) => setFormData({ ...formData, milestones: text })}
          placeholder="List major milestones"
          multiline
          rows={4}
        />

        <FormInput
          label="Dependencies"
          value={formData.dependencies}
          onChangeText={(text) => setFormData({ ...formData, dependencies: text })}
          placeholder="Other initiatives or resources this depends on"
          multiline
          rows={3}
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
