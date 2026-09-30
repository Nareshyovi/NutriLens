import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { theme } from '../../src/theme/theme';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../src/lib/supabase';

export default function AdminUsersScreen() {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['admin_users'],
    queryFn: async () => {
      // In a real app, you might want to call a server function to list auth users + profiles safely.
      // Here we query profiles directly assuming admin has RLS permission to select all.
      const { data, error } = await supabase.from('profiles').select('id, email, first_name, last_name, created_at');
      if (error) throw error;
      return data;
    }
  });

  const confirmAction = (action: string, callback: () => void) => {
    Alert.alert(`Confirm ${action}`, `Are you sure you want to ${action.toLowerCase()} this user?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Confirm', style: 'destructive', onPress: callback }
    ]);
  };

  const suspendUser = async (userId: string) => {
    // In reality, call the admin-suspend-user edge function via supabase.functions.invoke()
    Alert.alert('Simulated', `Called admin-suspend-user for ${userId}`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.surfaceCanvas, padding: theme.spacing.lg }}>
      {isLoading && <ActivityIndicator color={theme.colors.primary} size="large" />}
      
      {error && (
        <View style={{ padding: theme.spacing.md, backgroundColor: theme.colors.error, borderRadius: theme.radius.md }}>
          <Text style={{ color: theme.colors.onError }}>{error.message}</Text>
        </View>
      )}

      {!isLoading && !error && users && (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ backgroundColor: theme.colors.surfaceCard, padding: theme.spacing.md, borderRadius: theme.radius.md, marginBottom: theme.spacing.md }}>
              <Text style={{ fontFamily: theme.typography.fontFamilies.heading, color: theme.colors.neutralDark }}>
                {item.email}
              </Text>
              <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: theme.typography.sizes.sm }}>
                ID: {item.id.split('-')[0]}...
              </Text>
              <View style={{ flexDirection: 'row', marginTop: theme.spacing.sm }}>
                <TouchableOpacity onPress={() => confirmAction('Suspend User', () => suspendUser(item.id))} style={{ marginRight: theme.spacing.md }}>
                  <Text style={{ color: theme.colors.error, fontWeight: 'bold' }}>Suspend</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}
