import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Admin Overview' }} />
      <Stack.Screen name="users" options={{ title: 'Manage Users' }} />
      <Stack.Screen name="roles" options={{ title: 'Roles & Permissions' }} />
      <Stack.Screen name="audit" options={{ title: 'Audit Logs' }} />
    </Stack>
  );
}
