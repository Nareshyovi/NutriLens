import { View, Text, ActivityIndicator, FlatList } from 'react-native';
import { theme } from '../../src/theme/theme';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../src/lib/supabase';

export default function ProgressScreen() {
  const { data: weightLogs, isLoading, error } = useQuery({
    queryKey: ['weight'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('weight_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('logged_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.surfaceCanvas, padding: theme.spacing.lg }}>
      <Text style={{ fontFamily: theme.typography.fontFamilies.heading, fontSize: theme.typography.sizes.xl, color: theme.colors.neutralDark, marginBottom: theme.spacing.lg }}>Progress</Text>
      
      {isLoading && <ActivityIndicator color={theme.colors.primary} size="large" />}
      
      {error && (
        <View style={{ padding: theme.spacing.md, backgroundColor: theme.colors.error, borderRadius: theme.radius.md }}>
          <Text style={{ color: theme.colors.onError }}>{error.message}</Text>
        </View>
      )}

      {!isLoading && !error && weightLogs?.length === 0 && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: theme.colors.neutralDark }}>No weight data logged yet.</Text>
        </View>
      )}

      {!isLoading && !error && weightLogs && weightLogs.length > 0 && (
        <View style={{ flex: 1 }}>
          <Text style={{ color: theme.colors.secondary, marginBottom: theme.spacing.md }}>[Chart Placeholder: weight over time]</Text>
          <FlatList
            data={weightLogs}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={{ backgroundColor: theme.colors.surfaceCard, padding: theme.spacing.md, borderRadius: theme.radius.md, marginBottom: theme.spacing.md, flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontFamily: theme.typography.fontFamilies.heading, color: theme.colors.neutralDark }}>{new Date(item.logged_at).toLocaleDateString()}</Text>
                <Text style={{ color: theme.colors.primary }}>{item.weight_kg} kg</Text>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
}
