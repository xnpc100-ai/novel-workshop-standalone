Deno.serve(async (req) => {
  const functionName = 'submit-qa-answer';
  const requestId = crypto.randomUUID().slice(0, 8);

  // CORS 预检
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
    const { postId, content } = await req.json();
    console.info(`[${functionName}] request ${requestId} postId=${postId}`);

    if (!postId || !content) {
      return new Response(JSON.stringify({ error: '问题ID和回答内容不能为空' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // 获取用户认证信息
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: '需要登录才能回答' }), {
        status: 401,
        headers: corsHeaders,
      });
    }

    // 创建 Supabase 客户端
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    // 获取当前用户ID
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: '用户未认证' }), {
        status: 401,
        headers: corsHeaders,
      });
    }

    // 插入回答
    const { data, error } = await supabase
      .from('qa_answers')
      .insert({
        post_id: postId,
        user_id: user.id,
        content,
        is_best_answer: false
      })
      .select();

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      throw new Error('回答失败：可能被 RLS 策略拦截');
    }

    // 更新问题的回答数
    await supabase
      .from('qa_posts')
      .update({ answer_count: supabase.rpc('increment', { column: 'answer_count', row_id: postId }) })
      .eq('id', postId);

    console.info(`[${functionName}] success ${requestId} answerId=${data[0].id}`);
    return new Response(JSON.stringify({
      success: true,
      message: '回答发布成功',
      answerId: data[0].id
    }), {
      headers: corsHeaders,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[${functionName}] failed ${requestId}: ${message}`);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
