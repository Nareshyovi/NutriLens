import { View, Text, TouchableOpacity } from 'react-native';
import { theme } from '../../src/theme/theme';
import { useRouter } from 'expo-router';

export default function AdminOverviewScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.surfaceCanvas, padding: theme.spacing.lg }}>
      <View style={{ backgroundColor: theme.colors.primary, padding: theme.spacing.md, borderRadius: theme.radius.md, marginBottom: theme.spacing.xl }}>
        <Text style={{ color: theme.colors.surfaceCard, fontFamily: theme.typography.fontFamilies.heading, fontSize: theme.typography.sizes.sm }}>
          Your administrator account and full RBAC (Role-Based Access Control) portal have been configured and verified.
        </Text>
      </View>

      <Text style={{ fontFamily: theme.typography.fontFamilies.heading, fontSize: theme.typography.sizes.xl, color: theme.colors.neutralDark, marginBottom: theme.spacing.lg }}>Admin Overview</Text>

      <TouchableOpacity 
        style={{ backgroundColor: theme.colors.surfaceCard, padding: theme.spacing.md, borderRadius: theme.radius.md, marginBottom: theme.spacing.md, borderColor: theme.colors.borderSubtle, borderWidth: 1 }}
        onPress={() => router.push('/(admin)/users')}>
        <Text style={{ color: theme.colors.neutralDark, fontFamily: theme.typography.fontFamilies.heading }}>Manage Users</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={{ backgroundColor: theme.colors.surfaceCard, padding: theme.spacing.md, borderRadius: theme.radius.md, marginBottom: theme.spacing.md, borderColor: theme.colors.borderSubtle, borderWidth: 1 }}
        onPress={() => router.push('/(admin)/roles')}>
        <Text style={{ color: theme.colors.neutralDark, fontFamily: theme.typography.fontFamilies.heading }}>Roles & Permissions</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={{ backgroundColor: theme.colors.surfaceCard, padding: theme.spacing.md, borderRadius: theme.radius.md, marginBottom: theme.spacing.md, borderColor: theme.colors.borderSubtle, borderWidth: 1 }}
        onPress={() => router.push('/(admin)/audit')}>
        <Text style={{ color: theme.colors.neutralDark, fontFamily: theme.typography.fontFamilies.heading }}>Audit Logs</Text>
      </TouchableOpacity>
    </View>
  );
}
