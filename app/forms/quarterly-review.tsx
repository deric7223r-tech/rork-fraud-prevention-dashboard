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
  reviewPeriod: string;
  dataUpdates: string;
  agendaItems: string;
  findings: string;
  performanceFeedback: string;
}

export default function QuarterlyReviewForm() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { submitForm } = useForms();
  const [formData, setFormData] = useState<FormData>({
    reviewPeriod: '',
    dataUpdates: '',
    agendaItems: '',
    findings: '',
    performanceFeedback: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const periodOptions = [
    { label: 'Q1 2024', value: 'q1-2024' },
    { label: 'Q2 2024', value: 'q2-2024' },
    { label: 'Q3 2024', value: 'q3-2024' },
    { label: 'Q4 2024', value: 'q4-2024' },
  ];

  const validate = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    if (!formData.reviewPeriod) newErrors.reviewPeriod = 'Review period is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (isDraft = false) => {
    if (!isDraft && !validate()) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    try {
      const submission = await submitForm('quarterly', formData, isDraft);
      Alert.alert(
        'Success',
        isDraft 
          ? 'Draft saved successfully' 
          : `Review input submitted\nReference: ${submission.referenceId}`,
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
          Collect input from attendees prior to quarterly reviews
        </Text>

        <FormPicker
          label="Review Period"
          value={formData.reviewPeriod}
          options={periodOptions}
          onValueChange={(value) => setFormData({ ...formData, reviewPeriod: value })}
          required
          error={errors.reviewPeriod}
        />

        <FormInput
          label="Pre-Meeting Data Updates"
          value={formData.dataUpdates}
          onChangeText={(text) => setFormData({ ...formData, dataUpdates: text })}
          placeholder="Any data updates or corrections needed"
          multiline
          rows={4}
        />

        <FormInput
          label="Agenda Item Suggestions"
          value={formData.agendaItems}
          onChangeText={(text) => setFormData({ ...formData, agendaItems: text })}
          placeholder="Topics you'd like to discuss"
          multiline
          rows={4}
        />

        <FormInput
          label="Preliminary Findings"
          value={formData.findings}
          onChangeText={(text) => setFormData({ ...formData, findings: text })}
          placeholder="Key observations from your area"
          multiline
          rows={4}
        />

        <FormInput
          label="Program Performance Feedback"
          value={formData.performanceFeedback}
          onChangeText={(text) => setFormData({ ...formData, performanceFeedback: text })}
          placeholder="Overall assessment of program effectiveness"
          multiline
          rows={4}
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
