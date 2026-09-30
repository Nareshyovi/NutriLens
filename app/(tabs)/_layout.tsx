import { Tabs } from 'expo-router';
import { theme } from '../../src/theme/theme';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: theme.colors.primary,
      tabBarInactiveTintColor: theme.colors.neutralDark,
      tabBarStyle: {
        backgroundColor: theme.colors.surfaceCard,
        borderTopColor: theme.colors.borderSubtle,
      },
      headerStyle: {
        backgroundColor: theme.colors.surfaceCard,
      },
      headerTintColor: theme.colors.neutralDark,
    }}>
      <Tabs.Screen name="index" options={{ title: 'Dashboard' }} />
      <Tabs.Screen name="diary" options={{ title: 'Diary' }} />
      <Tabs.Screen name="progress" options={{ title: 'Progress' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  );
}
