import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { theme } from '../../src/theme/theme';
import { supabase } from '../../src/lib/supabase';
import { useRouter } from 'expo-router';

export default function ResetScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function resetPassword() {
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'nutrilens://reset-callback',
    });

    if (error) Alert.alert('Error', error.message);
    else Alert.alert('Success', 'Check your email for the password reset link!');
    setLoading(false);
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.surfaceCanvas, justifyContent: 'center', padding: theme.spacing.lg }}>
      <Text style={{ fontFamily: theme.typography.fontFamilies.heading, fontSize: theme.typography.sizes.xl, color: theme.colors.neutralDark, marginBottom: theme.spacing.xl }}>Reset Password</Text>
      
      <TextInput
        style={{ backgroundColor: theme.colors.surfaceCard, padding: theme.spacing.md, borderRadius: theme.radius.md, marginBottom: theme.spacing.lg, borderColor: theme.colors.borderSubtle, borderWidth: 1 }}
        onChangeText={setEmail}
        value={email}
        placeholder="Email"
        autoCapitalize="none"
      />
      
      <TouchableOpacity 
        style={{ backgroundColor: theme.colors.primary, padding: theme.spacing.md, borderRadius: theme.radius.pill, alignItems: 'center' }}
        disabled={loading}
        onPress={resetPassword}>
        {loading ? <ActivityIndicator color={theme.colors.surfaceCard} /> : <Text style={{ color: theme.colors.surfaceCard, fontFamily: theme.typography.fontFamilies.heading, fontWeight: '600' }}>Send Reset Link</Text>}
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => router.back()} style={{ marginTop: theme.spacing.md, alignItems: 'center' }}>
        <Text style={{ color: theme.colors.neutralDark }}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}
