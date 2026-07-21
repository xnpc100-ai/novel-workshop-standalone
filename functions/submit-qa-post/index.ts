Deno.serve(async (req) => {
  const functionName = 'submit-qa-post';
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
    const { title, content, category, tags } = await req.json();
    console.info(`[${functionName}] request ${requestId} category=${category}`);

    if (!title || !content || !category) {
      return new Response(JSON.stringify({ error: '标题、内容和分类不能为空' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // 获取用户认证信息
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: '需要登录才能提问' }), {
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

    // 插入问题
    const { data, error } = await supabase
      .from('qa_posts')
      .insert({
        user_id: user.id,
        title,
        content,
        category,
        tags: tags || [],
        status: 'open'
      })
      .select();

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      throw new Error('提问失败：可能被 RLS 策略拦截');
    }

    console.info(`[${functionName}] success ${requestId} postId=${data[0].id}`);
    return new Response(JSON.stringify({
      success: true,
      message: '问题发布成功',
      postId: data[0].id
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
