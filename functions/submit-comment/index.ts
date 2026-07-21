Deno.serve(async (req) => {
  const functionName = 'submit-comment';
  const requestId = crypto.randomUUID().slice(0, 8);

  if (req.method === 'OPTIONS') {
    console.info(`[${functionName}] CORS preflight ${requestId}`);
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
    const { targetType, targetId, content, parentId } = await req.json();
    console.info(`[${functionName}] request ${requestId} targetType=${targetType}`);

    if (!targetType || !targetId || !content) {
      return new Response(JSON.stringify({ error: '缺少必要参数' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: '需要登录才能评论' }), {
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

    const { data, error } = await supabase
      .from('comments')
      .insert({
        target_type: targetType,
        target_id: targetId,
        user_id: user.id,
        content,
        parent_id: parentId || null,
      })
      .select();

    if (error) throw error;
    if (!data || data.length === 0) throw new Error('评论失败');

    console.info(`[${functionName}] success ${requestId} commentId=${data[0].id}`);
    return new Response(JSON.stringify({
      success: true,
      message: '评论成功',
      commentId: data[0].id
    }), { headers: corsHeaders });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[${functionName}] failed ${requestId}: ${message}`);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
