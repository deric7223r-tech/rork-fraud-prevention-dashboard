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
  trainingModuleId: string;
  assessmentScore: string;
  effectiveness: string;
  feedback: string;
  improvements: string;
}

export default function TrainingFeedbackForm() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { submitForm } = useForms();
  const [formData, setFormData] = useState<FormData>({
    trainingModuleId: '',
    assessmentScore: '',
    effectiveness: '',
    feedback: '',
    improvements: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const effectivenessOptions = [
    { label: 'Excellent', value: '5' },
    { label: 'Very Good', value: '4' },
    { label: 'Good', value: '3' },
    { label: 'Fair', value: '2' },
    { label: 'Poor', value: '1' },
  ];

  const validate = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    if (!formData.trainingModuleId.trim()) newErrors.trainingModuleId = 'Module ID is required';
    if (!formData.effectiveness) newErrors.effectiveness = 'Rating is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (isDraft = false) => {
    if (!isDraft && !validate()) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    try {
      const submission = await submitForm('training', formData, isDraft);
      Alert.alert(
        'Success',
        isDraft 
          ? 'Draft saved successfully' 
          : `Training feedback submitted\nReference: ${submission.referenceId}`,
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
          Record training completion and provide feedback to improve programs
        </Text>

        <FormInput
          label="Training Module ID"
          value={formData.trainingModuleId}
          onChangeText={(text) => setFormData({ ...formData, trainingModuleId: text })}
          placeholder="e.g., FP-101"
          required
          error={errors.trainingModuleId}
        />

        <FormInput
          label="Assessment Score"
          value={formData.assessmentScore}
          onChangeText={(text) => setFormData({ ...formData, assessmentScore: text })}
          placeholder="Enter your score (e.g., 85%)"
          keyboardType="numeric"
        />

        <FormPicker
          label="Training Effectiveness Rating"
          value={formData.effectiveness}
          options={effectivenessOptions}
          onValueChange={(value) => setFormData({ ...formData, effectiveness: value })}
          required
          error={errors.effectiveness}
        />

        <FormInput
          label="General Feedback"
          value={formData.feedback}
          onChangeText={(text) => setFormData({ ...formData, feedback: text })}
          placeholder="What did you find most valuable?"
          multiline
          rows={4}
        />

        <FormInput
          label="Suggested Improvements"
          value={formData.improvements}
          onChangeText={(text) => setFormData({ ...formData, improvements: text })}
          placeholder="How could this training be improved?"
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
