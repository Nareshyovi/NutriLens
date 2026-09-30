import { View, Text, ActivityIndicator, FlatList } from 'react-native';
import { theme } from '../../src/theme/theme';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../src/lib/supabase';

export default function DiaryScreen() {
  const { data: diaryEntries, isLoading, error } = useQuery({
    queryKey: ['diary'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('meal_logs')
        .select('*, meal_items(*)')
        .eq('user_id', user.id)
        .order('logged_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.surfaceCanvas, padding: theme.spacing.lg }}>
      <Text style={{ fontFamily: theme.typography.fontFamilies.heading, fontSize: theme.typography.sizes.xl, color: theme.colors.neutralDark, marginBottom: theme.spacing.lg }}>Food Diary</Text>
      
      {isLoading && <ActivityIndicator color={theme.colors.primary} size="large" />}
      
      {error && (
        <View style={{ padding: theme.spacing.md, backgroundColor: theme.colors.error, borderRadius: theme.radius.md }}>
          <Text style={{ color: theme.colors.onError }}>{error.message}</Text>
        </View>
      )}

      {!isLoading && !error && diaryEntries?.length === 0 && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: theme.colors.neutralDark }}>No entries in your diary.</Text>
        </View>
      )}

      {!isLoading && !error && diaryEntries && diaryEntries.length > 0 && (
        <FlatList
          data={diaryEntries}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ backgroundColor: theme.colors.surfaceCard, padding: theme.spacing.md, borderRadius: theme.radius.md, marginBottom: theme.spacing.md }}>
              <Text style={{ fontFamily: theme.typography.fontFamilies.heading, color: theme.colors.neutralDark }}>{item.meal_type}</Text>
              <Text style={{ color: theme.colors.secondary }}>{item.total_calories} kcal</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}
