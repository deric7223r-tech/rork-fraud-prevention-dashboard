import { Stack } from 'expo-router';
import Colors from '@/constants/colors';

export default function FormsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.surface,
        },
        headerTintColor: Colors.primary,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen 
        name="initiative-submission" 
        options={{ title: 'Initiative Submission' }} 
      />
      <Stack.Screen 
        name="risk-assessment" 
        options={{ title: 'Risk Assessment' }} 
      />
      <Stack.Screen 
        name="compliance-update" 
        options={{ title: 'Compliance Update' }} 
      />
      <Stack.Screen 
        name="task-update" 
        options={{ title: 'Task Update' }} 
      />
      <Stack.Screen 
        name="fraud-report" 
        options={{ title: 'Fraud Report' }} 
      />
      <Stack.Screen 
        name="training-feedback" 
        options={{ title: 'Training Feedback' }} 
      />
      <Stack.Screen 
        name="quarterly-review" 
        options={{ title: 'Quarterly Review' }} 
      />
      <Stack.Screen 
        name="tech-issue" 
        options={{ title: 'Technology Issue' }} 
      />
    </Stack>
  );
}
