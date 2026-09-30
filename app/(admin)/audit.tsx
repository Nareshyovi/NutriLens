import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { theme } from '../../src/theme/theme';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../src/lib/supabase';

export default function AdminAuditScreen() {
  const { data: logs, isLoading, error } = useQuery({
    queryKey: ['admin_audit_logs'],
    queryFn: async () => {
      const { data, error } = await supabase.from('audit_logs').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.surfaceCanvas, padding: theme.spacing.lg }}>
      {isLoading && <ActivityIndicator color={theme.colors.primary} size="large" />}
      
      {error && (
        <View style={{ padding: theme.spacing.md, backgroundColor: theme.colors.error, borderRadius: theme.radius.md }}>
          <Text style={{ color: theme.colors.onError }}>{error.message}</Text>
        </View>
      )}

      {!isLoading && !error && logs && (
        <FlatList
          data={logs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ backgroundColor: theme.colors.surfaceCard, padding: theme.spacing.md, borderRadius: theme.radius.md, marginBottom: theme.spacing.md }}>
              <Text style={{ fontFamily: theme.typography.fontFamilies.heading, color: theme.colors.primary }}>
                {item.action}
              </Text>
              <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: theme.typography.sizes.sm }}>
                Target: {item.target_resource}
              </Text>
              <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: theme.typography.sizes.xs, marginTop: theme.spacing.xs }}>
                {new Date(item.created_at).toLocaleString()}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}
