// @ts-nocheck
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { corsHeaders } from '../shared/cors.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) throw new Error('Unauthorized');

    // Fetch all user data
    const [profile, meals, weights, water] = await Promise.all([
      supabaseClient.from('profiles').select('*').eq('id', user.id).single(),
      supabaseClient.from('meal_logs').select('*, meal_items(*)').eq('user_id', user.id),
      supabaseClient.from('weight_logs').select('*').eq('user_id', user.id),
      supabaseClient.from('water_logs').select('*').eq('user_id', user.id),
    ]);

    const exportData = {
      user: { id: user.id, email: user.email, profile: profile.data },
      meals: meals.data,
      weights: weights.data,
      water: water.data,
      exportedAt: new Date().toISOString()
    };

    return new Response(JSON.stringify(exportData), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Content-Disposition': 'attachment; filename="nutrilens-export.json"' } 
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
