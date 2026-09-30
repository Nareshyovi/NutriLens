import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { theme } from '../src/theme/theme';
import { supabase } from '../src/lib/supabase';
import { useRouter } from 'expo-router';

export default function OnboardingScreen() {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState('');
  const [bodyDetails, setBodyDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function completeOnboarding() {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.replace('/login');
      return;
    }

    // In a real app, update profile logic and calculate targets
    // For now, we simulate success
    Alert.alert('Success', 'Onboarding Complete!');
    router.replace('/');
    setLoading(false);
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.surfaceCanvas, justifyContent: 'center', padding: theme.spacing.lg }}>
      <Text style={{ fontFamily: theme.typography.fontFamilies.heading, fontSize: theme.typography.sizes.xl, color: theme.colors.neutralDark, marginBottom: theme.spacing.xl }}>
        {step === 1 ? 'What is your goal?' : 'Enter Body Details'}
      </Text>
      
      {step === 1 ? (
        <TextInput
          style={{ backgroundColor: theme.colors.surfaceCard, padding: theme.spacing.md, borderRadius: theme.radius.md, marginBottom: theme.spacing.lg, borderColor: theme.colors.borderSubtle, borderWidth: 1 }}
          onChangeText={setGoal}
          value={goal}
          placeholder="E.g., Lose weight, build muscle..."
        />
      ) : (
        <TextInput
          style={{ backgroundColor: theme.colors.surfaceCard, padding: theme.spacing.md, borderRadius: theme.radius.md, marginBottom: theme.spacing.lg, borderColor: theme.colors.borderSubtle, borderWidth: 1 }}
          onChangeText={setBodyDetails}
          value={bodyDetails}
          placeholder="Age, Weight, Height..."
        />
      )}
      
      <TouchableOpacity 
        style={{ backgroundColor: theme.colors.primary, padding: theme.spacing.md, borderRadius: theme.radius.pill, alignItems: 'center' }}
        disabled={loading}
        onPress={() => {
          if (step === 1) setStep(2);
          else completeOnboarding();
        }}>
        <Text style={{ color: theme.colors.surfaceCard, fontFamily: theme.typography.fontFamilies.heading, fontWeight: '600' }}>
          {step === 1 ? 'Next' : 'Complete'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
