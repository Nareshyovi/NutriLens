import { View, Text, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { theme } from '../../src/theme/theme';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../src/lib/supabase';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const router = useRouter();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return { ...data, email: user.email };
    }
  });

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) Alert.alert('Error', error.message);
    else router.replace('/login');
  }

  function confirmAction(title: string, message: string, onConfirm: () => void) {
    Alert.alert(title, message, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Confirm', style: 'destructive', onPress: onConfirm }
    ]);
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.surfaceCanvas, padding: theme.spacing.lg }}>
      <Text style={{ fontFamily: theme.typography.fontFamilies.heading, fontSize: theme.typography.sizes.xl, color: theme.colors.neutralDark, marginBottom: theme.spacing.lg }}>Settings</Text>
      
      {isLoading && <ActivityIndicator color={theme.colors.primary} size="large" />}
      
      {error && (
        <View style={{ padding: theme.spacing.md, backgroundColor: theme.colors.error, borderRadius: theme.radius.md }}>
          <Text style={{ color: theme.colors.onError }}>{error.message}</Text>
        </View>
      )}

      {!isLoading && !error && profile && (
        <View style={{ backgroundColor: theme.colors.surfaceCard, padding: theme.spacing.md, borderRadius: theme.radius.md, marginBottom: theme.spacing.lg }}>
          <Text style={{ fontFamily: theme.typography.fontFamilies.heading, color: theme.colors.neutralDark }}>Profile</Text>
          <Text style={{ color: theme.colors.onSurfaceVariant, marginTop: theme.spacing.xs }}>Email: {profile.email}</Text>
        </View>
      )}

      <TouchableOpacity 
        style={{ backgroundColor: theme.colors.surfaceCard, padding: theme.spacing.md, borderRadius: theme.radius.md, marginBottom: theme.spacing.md, borderColor: theme.colors.borderSubtle, borderWidth: 1 }}
        onPress={() => confirmAction('Export Data', 'Are you sure you want to request a data export?', () => console.log('Call edge function'))}>
        <Text style={{ color: theme.colors.primary, fontFamily: theme.typography.fontFamilies.heading }}>Export My Data</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={{ backgroundColor: theme.colors.surfaceCard, padding: theme.spacing.md, borderRadius: theme.radius.md, marginBottom: theme.spacing.md, borderColor: theme.colors.borderSubtle, borderWidth: 1 }}
        onPress={() => router.push('/(admin)')}>
        <Text style={{ color: theme.colors.neutralDark, fontFamily: theme.typography.fontFamilies.heading }}>Admin Portal</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={{ backgroundColor: theme.colors.surfaceCard, padding: theme.spacing.md, borderRadius: theme.radius.md, marginBottom: theme.spacing.xl, borderColor: theme.colors.error, borderWidth: 1 }}
        onPress={() => confirmAction('Delete Account', 'This action is irreversible. All your data will be permanently deleted.', () => console.log('Call edge function'))}>
        <Text style={{ color: theme.colors.error, fontFamily: theme.typography.fontFamilies.heading }}>Delete Account</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={{ backgroundColor: theme.colors.borderSubtle, padding: theme.spacing.md, borderRadius: theme.radius.pill, alignItems: 'center' }}
        onPress={handleLogout}>
        <Text style={{ color: theme.colors.neutralDark, fontFamily: theme.typography.fontFamilies.heading, fontWeight: '600' }}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}
