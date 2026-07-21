Deno.serve(async (req) => {
  const functionName = 'toggle-collection';
  const requestId = crypto.randomUUID().slice(0, 8);

  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  try {
    const { targetType, targetId } = await req.json();

    if (!targetType || !targetId) {
      return new Response(JSON.stringify({ error: '缺少必要参数' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: '需要登录' }), {
        status: 401,
        headers: corsHeaders,
      });
    }

    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: '用户未认证' }), {
        status: 401,
        headers: corsHeaders,
      });
    }

    // 检查是否已收藏
    const { data: existing } = await supabase
      .from('collections')
      .select('id')
      .eq('target_type', targetType)
      .eq('target_id', targetId)
      .eq('user_id', user.id)
      .single();

    if (existing) {
      // 取消收藏
      await supabase
        .from('collections')
        .delete()
        .eq('id', existing.id);

      return new Response(JSON.stringify({ success: true, collected: false }), {
        headers: corsHeaders,
      });
    } else {
      // 添加收藏
      const { data, error } = await supabase
        .from('collections')
        .insert({
          target_type: targetType,
          target_id: targetId,
          user_id: user.id,
        })
        .select();

      if (error) throw error;
      if (!data || data.length === 0) throw new Error('收藏失败');

      return new Response(JSON.stringify({ success: true, collected: true }), {
        headers: corsHeaders,
      });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[${functionName}] failed: ${message}`);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
