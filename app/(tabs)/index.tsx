import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity, Image } from 'react-native';
import { theme } from '../../src/theme/theme';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../src/lib/supabase';
import { useRouter } from 'expo-router';

export default function DashboardScreen() {
  const router = useRouter();
  
  const { data: meals, isLoading, error } = useQuery({
    queryKey: ['meals'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('meal_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('logged_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const totalCalories = meals?.reduce((sum, meal) => sum + (Number(meal.total_calories) || 0), 0) || 0;
  const targetCalories = 1900;
  const remaining = Math.max(targetCalories - totalCalories, 0);

  return (
    <View style={{ flex: 1, backgroundColor: '#f1fcf5' }}>
      {/* Top App Bar */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 15, backgroundColor: '#f1fcf5' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#e5f1ea', borderWidth: 2, borderColor: '#69dca1', overflow: 'hidden' }}>
            {/* Minimal Avatar Placeholder */}
            <View style={{ width: '100%', height: '100%', backgroundColor: '#69dca1', justifyContent: 'center', alignItems: 'center' }}>
               <Text style={{color: '#002112', fontWeight: 'bold'}}>R</Text>
            </View>
          </View>
          <View>
            <Text style={{ fontFamily: theme.typography.fontFamilies.heading, fontSize: 18, fontWeight: '700', color: '#006a43' }}>NutriLens AI</Text>
            <Text style={{ fontSize: 10, fontWeight: '700', color: '#6d7a71', letterSpacing: 1 }}>SMART NUTRITION</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {/* Greeting */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontFamily: theme.typography.fontFamilies.heading, fontSize: 28, fontWeight: '700', color: '#141e1a' }}>Good afternoon 👋</Text>
          <Text style={{ fontSize: 14, color: '#3e4a41', marginTop: 4 }}>Let's nourish your body mindfully today.</Text>
        </View>

        {/* Hero Calorie Card */}
        <View style={{ backgroundColor: '#ffffff', borderRadius: 24, padding: 20, shadowColor: '#1f2925', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2, marginBottom: 20, borderWidth: 1, borderColor: '#E5E9E7' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <Text style={{ fontFamily: theme.typography.fontFamilies.heading, fontSize: 20, fontWeight: '700', color: '#141e1a' }}>Energy Balance</Text>
            <View style={{ backgroundColor: '#ebf6f0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#6d7a71' }}>Target: {targetCalories} kcal</Text>
            </View>
          </View>

          <View style={{ alignItems: 'center', marginVertical: 10 }}>
            {/* Mock Circular Progress */}
            <View style={{ width: 160, height: 160, borderRadius: 80, borderWidth: 12, borderColor: '#e5f1ea', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#6d7a71', letterSpacing: 1 }}>REMAINING</Text>
              <Text style={{ fontFamily: theme.typography.fontFamilies.heading, fontSize: 40, fontWeight: '800', color: '#fe893c' }}>{remaining}</Text>
              <Text style={{ fontSize: 14, color: '#3e4a41', fontWeight: '500' }}>kcal left</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#e5e9e7', paddingTop: 15, marginTop: 10 }}>
            <View style={{ alignItems: 'center', flex: 1 }}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#6d7a71' }}>EATEN</Text>
              <Text style={{ fontFamily: theme.typography.fontFamilies.heading, fontSize: 18, fontWeight: '700', color: '#141e1a', marginTop: 4 }}>{totalCalories}</Text>
            </View>
            <View style={{ alignItems: 'center', flex: 1, borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#e5e9e7' }}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#6d7a71' }}>BURNED</Text>
              <Text style={{ fontFamily: theme.typography.fontFamilies.heading, fontSize: 18, fontWeight: '700', color: '#006a43', marginTop: 4 }}>0</Text>
            </View>
            <View style={{ alignItems: 'center', flex: 1 }}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#6d7a71' }}>BUDGET</Text>
              <Text style={{ fontFamily: theme.typography.fontFamilies.heading, fontSize: 18, fontWeight: '700', color: '#141e1a', marginTop: 4 }}>{targetCalories}</Text>
            </View>
          </View>
        </View>

        {/* Today's Meals Section */}
        <View style={{ marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
            <Text style={{ fontFamily: theme.typography.fontFamilies.heading, fontSize: 20, fontWeight: '700', color: '#141e1a' }}>Today's Meals</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#006a43' }}>Detailed Log</Text>
          </View>

          {isLoading && <ActivityIndicator color="#006a43" />}
          
          {!isLoading && meals?.length === 0 && (
            <View style={{ backgroundColor: '#ffffff', borderRadius: 20, padding: 20, alignItems: 'center', borderWidth: 2, borderColor: '#006a4340', borderStyle: 'dashed' }}>
              <Text style={{ fontSize: 16, color: '#3e4a41', textAlign: 'center' }}>No meals logged yet today.</Text>
            </View>
          )}

          {!isLoading && meals && meals.map((item, index) => (
            <View key={item.id || index} style={{ backgroundColor: '#ffffff', borderRadius: 18, padding: 15, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: '#1f2925', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 1, borderWidth: 1, borderColor: '#E5E9E7' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#e0ebe4', justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontSize: 20 }}>🍽️</Text>
                </View>
                <View>
                  <Text style={{ fontFamily: theme.typography.fontFamilies.heading, fontSize: 16, fontWeight: '600', color: '#141e1a' }}>{item.meal_type || 'Meal'}</Text>
                  <Text style={{ fontSize: 12, color: '#6d7a71', marginTop: 2 }}>Logged</Text>
                </View>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontFamily: theme.typography.fontFamilies.heading, fontSize: 18, fontWeight: '700', color: '#141e1a' }}>{item.total_calories || 0}</Text>
                <Text style={{ fontSize: 11, color: '#6d7a71' }}>kcal</Text>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={{ position: 'absolute', bottom: 30, alignSelf: 'center', backgroundColor: '#006a43', width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', shadowColor: '#22A06B', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 15, elevation: 6 }}
        onPress={() => router.push('/add-meal')}
      >
        <Text style={{ color: '#ffffff', fontSize: 32, fontWeight: '300' }}>+</Text>
      </TouchableOpacity>
    </View>
  );
}
