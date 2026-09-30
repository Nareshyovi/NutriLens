import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { theme } from '../src/theme/theme';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../src/lib/supabase';
import { useRouter } from 'expo-router';

export default function AddMealScreen() {
  const [mealDescription, setMealDescription] = useState('');
  const router = useRouter();
  const queryClient = useQueryClient();

  const addMealMutation = useMutation({
    mutationFn: async (description: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Create meal log
      const { data: mealLog, error: logError } = await supabase.from('meal_logs').insert({
        user_id: user.id,
        meal_type: 'snack', // Hardcoded for skeletal flow
        total_calories: 250, // Placeholder
      }).select().single();

      if (logError) throw logError;
      return mealLog;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
      router.back();
    },
    onError: (error) => {
      Alert.alert('Error', error.message);
    }
  });

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.surfaceCanvas, padding: theme.spacing.lg }}>
      <Text style={{ fontFamily: theme.typography.fontFamilies.heading, fontSize: theme.typography.sizes.xl, color: theme.colors.neutralDark, marginBottom: theme.spacing.lg }}>Add Meal</Text>
      
      <TextInput
        style={{ backgroundColor: theme.colors.surfaceCard, padding: theme.spacing.md, borderRadius: theme.radius.md, marginBottom: theme.spacing.lg, borderColor: theme.colors.borderSubtle, borderWidth: 1, minHeight: 100 }}
        onChangeText={setMealDescription}
        value={mealDescription}
        placeholder="Describe what you ate (e.g. 2 slices of pizza)..."
        multiline
      />

      <TouchableOpacity 
        style={{ backgroundColor: theme.colors.primary, padding: theme.spacing.md, borderRadius: theme.radius.pill, alignItems: 'center' }}
        disabled={addMealMutation.isPending || !mealDescription.trim()}
        onPress={() => addMealMutation.mutate(mealDescription)}>
        {addMealMutation.isPending ? <ActivityIndicator color={theme.colors.surfaceCard} /> : <Text style={{ color: theme.colors.surfaceCard, fontFamily: theme.typography.fontFamilies.heading, fontWeight: '600' }}>Save Meal</Text>}
      </TouchableOpacity>
    </View>
  );
}
