import { View, Text, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import { theme } from '../../src/theme/theme';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../src/lib/supabase';
import { useRouter } from 'expo-router';

export default function DashboardScreen() {
  const router = useRouter();
  
  const { data: meals, isLoading, error } = useQuery({
    queryKey: ['meals'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('meal_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('logged_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.surfaceCanvas, padding: theme.spacing.lg }}>
      <Text style={{ fontFamily: theme.typography.fontFamilies.heading, fontSize: theme.typography.sizes.xl, color: theme.colors.neutralDark, marginBottom: theme.spacing.lg }}>Dashboard</Text>
      
      {isLoading && <ActivityIndicator color={theme.colors.primary} size="large" />}
      
      {error && (
        <View style={{ padding: theme.spacing.md, backgroundColor: theme.colors.error, borderRadius: theme.radius.md }}>
          <Text style={{ color: theme.colors.onError }}>{error.message}</Text>
        </View>
      )}

      {!isLoading && !error && meals?.length === 0 && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: theme.colors.neutralDark }}>No meals logged today.</Text>
        </View>
      )}

      {!isLoading && !error && meals && meals.length > 0 && (
        <FlatList
          data={meals}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ backgroundColor: theme.colors.surfaceCard, padding: theme.spacing.md, borderRadius: theme.radius.md, marginBottom: theme.spacing.md }}>
              <Text style={{ fontFamily: theme.typography.fontFamilies.heading }}>{item.meal_type}</Text>
              <Text style={{ color: theme.colors.secondary }}>{item.total_calories} kcal</Text>
            </View>
          )}
        />
      )}

      <TouchableOpacity 
        style={{ position: 'absolute', bottom: 20, right: 20, backgroundColor: theme.colors.primary, width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 4 }}
        onPress={() => router.push('/add-meal')}
      >
        <Text style={{ color: theme.colors.surfaceCard, fontSize: 24 }}>+</Text>
      </TouchableOpacity>
    </View>
  );
}
