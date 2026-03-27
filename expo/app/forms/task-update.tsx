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
  taskId: string;
  progress: string;
  status: string;
  notes: string;
  dependencies: string;
  issues: string;
}

export default function TaskUpdateForm() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { submitForm } = useForms();
  const [formData, setFormData] = useState<FormData>({
    taskId: '',
    progress: '',
    status: '',
    notes: '',
    dependencies: '',
    issues: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const statusOptions = [
    { label: 'Not Started', value: 'not-started' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'Blocked', value: 'blocked' },
    { label: 'Completed', value: 'completed' },
  ];

  const progressOptions = Array.from({ length: 11 }, (_, i) => ({
    label: `${i * 10}%`,
    value: `${i * 10}`,
  }));

  const validate = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    if (!formData.taskId.trim()) newErrors.taskId = 'Task ID is required';
    if (!formData.status) newErrors.status = 'Status is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (isDraft = false) => {
    if (!isDraft && !validate()) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    try {
      const submission = await submitForm('task', formData, isDraft);
      Alert.alert(
        'Success',
        isDraft 
          ? 'Draft saved successfully' 
          : `Task update submitted\nReference: ${submission.referenceId}`,
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
          Update task progress and flag any issues or blockers
        </Text>

        <FormInput
          label="Task ID"
          value={formData.taskId}
          onChangeText={(text) => setFormData({ ...formData, taskId: text })}
          placeholder="e.g., TASK-123"
          required
          error={errors.taskId}
        />

        <FormPicker
          label="Progress Percentage"
          value={formData.progress}
          options={progressOptions}
          onValueChange={(value) => setFormData({ ...formData, progress: value })}
          placeholder="Select progress"
        />

        <FormPicker
          label="Status"
          value={formData.status}
          options={statusOptions}
          onValueChange={(value) => setFormData({ ...formData, status: value })}
          required
          error={errors.status}
        />

        <FormInput
          label="Update Notes"
          value={formData.notes}
          onChangeText={(text) => setFormData({ ...formData, notes: text })}
          placeholder="Describe what has been completed and next steps"
          multiline
          rows={4}
        />

        <FormInput
          label="Dependency Updates"
          value={formData.dependencies}
          onChangeText={(text) => setFormData({ ...formData, dependencies: text })}
          placeholder="Any changes to task dependencies"
          multiline
          rows={3}
        />

        <FormInput
          label="Issues or Bottlenecks"
          value={formData.issues}
          onChangeText={(text) => setFormData({ ...formData, issues: text })}
          placeholder="Describe any blockers or challenges"
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
