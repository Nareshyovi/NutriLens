import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { theme } from '../../src/theme/theme';
import { supabase } from '../../src/lib/supabase';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function signUpWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) Alert.alert('Error', error.message);
    else Alert.alert('Success', 'Check your email for the confirmation link!');
    setLoading(false);
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.surfaceCanvas, justifyContent: 'center', padding: theme.spacing.lg }}>
      <Text style={{ fontFamily: theme.typography.fontFamilies.heading, fontSize: theme.typography.sizes.xl, color: theme.colors.neutralDark, marginBottom: theme.spacing.xl }}>Register</Text>
      
      <TextInput
        style={{ backgroundColor: theme.colors.surfaceCard, padding: theme.spacing.md, borderRadius: theme.radius.md, marginBottom: theme.spacing.md, borderColor: theme.colors.borderSubtle, borderWidth: 1 }}
        onChangeText={setEmail}
        value={email}
        placeholder="Email"
        autoCapitalize="none"
      />
      <TextInput
        style={{ backgroundColor: theme.colors.surfaceCard, padding: theme.spacing.md, borderRadius: theme.radius.md, marginBottom: theme.spacing.lg, borderColor: theme.colors.borderSubtle, borderWidth: 1 }}
        onChangeText={setPassword}
        value={password}
        secureTextEntry
        placeholder="Password"
        autoCapitalize="none"
      />
      
      <TouchableOpacity 
        style={{ backgroundColor: theme.colors.primary, padding: theme.spacing.md, borderRadius: theme.radius.pill, alignItems: 'center' }}
        disabled={loading}
        onPress={signUpWithEmail}>
        {loading ? <ActivityIndicator color={theme.colors.surfaceCard} /> : <Text style={{ color: theme.colors.surfaceCard, fontFamily: theme.typography.fontFamilies.heading, fontWeight: '600' }}>Sign Up</Text>}
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => router.push('/login')} style={{ marginTop: theme.spacing.md, alignItems: 'center' }}>
        <Text style={{ color: theme.colors.primary }}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}
