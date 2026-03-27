import { useState, useCallback } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type FormStatus = 'draft' | 'submitted' | 'in_review' | 'approved' | 'rejected';

export interface FormSubmission {
  id: string;
  formType: string;
  status: FormStatus;
  data: any;
  createdAt: string;
  updatedAt: string;
  submittedBy?: string;
  referenceId?: string;
}

const STORAGE_KEY = '@form_submissions';

export const [FormsProvider, useForms] = createContextHook(() => {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [drafts, setDrafts] = useState<FormSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadForms = useCallback(async () => {
    try {
      setIsLoading(true);
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const allForms = JSON.parse(stored) as FormSubmission[];
        setSubmissions(allForms.filter(f => f.status !== 'draft'));
        setDrafts(allForms.filter(f => f.status === 'draft'));
      }
    } catch (error) {
      console.error('Failed to load forms:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveForms = useCallback(async (allForms: FormSubmission[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(allForms));
    } catch (error) {
      console.error('Failed to save forms:', error);
    }
  }, []);

  const submitForm = useCallback(async (formType: string, data: any, isDraft = false) => {
    const submission: FormSubmission = {
      id: Date.now().toString(),
      formType,
      status: isDraft ? 'draft' : 'submitted',
      data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      referenceId: isDraft ? undefined : `REF-${Date.now()}`,
    };

    const allForms = [...submissions, ...drafts, submission];
    
    if (isDraft) {
      setDrafts([...drafts, submission]);
    } else {
      setSubmissions([...submissions, submission]);
    }

    await saveForms(allForms);
    return submission;
  }, [submissions, drafts, saveForms]);

  const updateFormStatus = useCallback(async (id: string, status: FormStatus) => {
    const allForms = [...submissions, ...drafts];
    const formIndex = allForms.findIndex(f => f.id === id);
    
    if (formIndex !== -1) {
      allForms[formIndex] = {
        ...allForms[formIndex],
        status,
        updatedAt: new Date().toISOString(),
      };

      setSubmissions(allForms.filter(f => f.status !== 'draft'));
      setDrafts(allForms.filter(f => f.status === 'draft'));
      await saveForms(allForms);
    }
  }, [submissions, drafts, saveForms]);

  const deleteDraft = useCallback(async (id: string) => {
    const allForms = [...submissions, ...drafts].filter(f => f.id !== id);
    setDrafts(allForms.filter(f => f.status === 'draft'));
    await saveForms(allForms);
  }, [submissions, drafts, saveForms]);

  const getFormsByType = useCallback((formType: string) => {
    return [...submissions, ...drafts].filter(f => f.formType === formType);
  }, [submissions, drafts]);

  return {
    submissions,
    drafts,
    isLoading,
    loadForms,
    submitForm,
    updateFormStatus,
    deleteDraft,
    getFormsByType,
  };
});
