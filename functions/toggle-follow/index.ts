Deno.serve(async (req) => {
  const functionName = 'toggle-follow';
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
    const { followingId } = await req.json();

    if (!followingId) {
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

    if (user.id === followingId) {
      return new Response(JSON.stringify({ error: '不能关注自己' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // 检查是否已关注
    const { data: existing } = await supabase
      .from('follows')
      .select('id')
      .eq('follower_id', user.id)
      .eq('following_id', followingId)
      .single();

    if (existing) {
      // 取消关注
      await supabase
        .from('follows')
        .delete()
        .eq('id', existing.id);

      return new Response(JSON.stringify({ success: true, following: false }), {
        headers: corsHeaders,
      });
    } else {
      // 添加关注
      const { data, error } = await supabase
        .from('follows')
        .insert({
          follower_id: user.id,
          following_id: followingId,
        })
        .select();

      if (error) throw error;
      if (!data || data.length === 0) throw new Error('关注失败');

      return new Response(JSON.stringify({ success: true, following: true }), {
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
