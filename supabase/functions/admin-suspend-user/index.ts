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

    const { data: hasPermission, error: permError } = await supabaseClient.rpc('has_permission', { p_resource: 'users', p_action: 'edit' });
    if (permError || !hasPermission) throw new Error('Forbidden: Insufficient permissions');

    const { targetUserId } = await req.json();
    if (!targetUserId) throw new Error('Missing targetUserId');

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Write to audit log
    await supabaseAdmin.from('audit_logs').insert({
      actor_id: user.id,
      action: 'SUSPEND_USER',
      target_resource: `user:${targetUserId}`,
    });

    const { error: banError } = await supabaseAdmin.auth.admin.updateUserById(targetUserId, { ban_duration: '876000h' }); // 100 years
    if (banError) throw banError;

    return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
