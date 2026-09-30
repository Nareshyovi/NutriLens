import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { theme } from '../../src/theme/theme';
import { supabase } from '../../src/lib/supabase';
import { useRouter } from 'expo-router';

export default function MFAScreen() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function verifyCode() {
    setLoading(true);
    // Note: MFA verification logic will depend on the factor setup flow.
    // Assuming the user has a factor registered and we verify the challenge.
    const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors();
    if (factorsError) {
      Alert.alert('Error', factorsError.message);
      setLoading(false);
      return;
    }

    const totpFactor = factors.totp[0];
    if (!totpFactor) {
      Alert.alert('Error', 'No TOTP factor found');
      setLoading(false);
      return;
    }

    const challenge = await supabase.auth.mfa.challenge({ factorId: totpFactor.id });
    if (challenge.error) {
      Alert.alert('Error', challenge.error.message);
      setLoading(false);
      return;
    }

    const verify = await supabase.auth.mfa.verify({
      factorId: totpFactor.id,
      challengeId: challenge.data.id,
      code,
    });

    if (verify.error) Alert.alert('Error', verify.error.message);
    else router.replace('/');
    setLoading(false);
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.surfaceCanvas, justifyContent: 'center', padding: theme.spacing.lg }}>
      <Text style={{ fontFamily: theme.typography.fontFamilies.heading, fontSize: theme.typography.sizes.xl, color: theme.colors.neutralDark, marginBottom: theme.spacing.xl }}>2FA Verification</Text>
      
      <TextInput
        style={{ backgroundColor: theme.colors.surfaceCard, padding: theme.spacing.md, borderRadius: theme.radius.md, marginBottom: theme.spacing.lg, borderColor: theme.colors.borderSubtle, borderWidth: 1 }}
        onChangeText={setCode}
        value={code}
        placeholder="Enter 6-digit code"
        keyboardType="number-pad"
        maxLength={6}
      />
      
      <TouchableOpacity 
        style={{ backgroundColor: theme.colors.primary, padding: theme.spacing.md, borderRadius: theme.radius.pill, alignItems: 'center' }}
        disabled={loading}
        onPress={verifyCode}>
        {loading ? <ActivityIndicator color={theme.colors.surfaceCard} /> : <Text style={{ color: theme.colors.surfaceCard, fontFamily: theme.typography.fontFamilies.heading, fontWeight: '600' }}>Verify</Text>}
      </TouchableOpacity>
    </View>
  );
}
