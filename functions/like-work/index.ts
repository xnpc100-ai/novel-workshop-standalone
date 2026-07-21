Deno.serve(async (req) => {
  const functionName = 'like-work';
  const requestId = crypto.randomUUID().slice(0, 8);

  // CORS 预检
  if (req.method === 'OPTIONS') {
    console.info(`[${functionName}] CORS preflight ${requestId}`);
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  try {
    const { workId, action } = await req.json();
    console.info(`[${functionName}] request ${requestId} workId=${workId} action=${action}`);

    if (!workId || !action) {
      return new Response(JSON.stringify({ error: '缺少必要参数' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // 获取用户认证信息
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: '需要登录才能点赞' }), {
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

    if (action === 'like') {
      // 点赞
      const { data, error } = await supabase
        .from('work_likes')
        .insert({ work_id: workId, user_id: user.id })
        .select();

      if (error) {
        // 可能是重复点赞
        if (error.code === '23505') {
          return new Response(JSON.stringify({ error: '已经点过赞了' }), {
            status: 400,
            headers: corsHeaders,
          });
        }
        throw error;
      }

      if (!data || data.length === 0) {
        throw new Error('点赞失败：可能被 RLS 策略拦截');
      }

      // 更新作品的点赞数
      await supabase
        .from('works_showcase')
        .update({ like_count: supabase.rpc('increment', { column: 'like_count', row_id: workId }) })
        .eq('id', workId);

      console.info(`[${functionName}] success ${requestId} liked`);
      return new Response(JSON.stringify({ success: true, message: '点赞成功' }), {
        headers: corsHeaders,
      });
    } else if (action === 'unlike') {
      // 取消点赞
      const { error } = await supabase
        .from('work_likes')
        .delete()
        .eq('work_id', workId)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      console.info(`[${functionName}] success ${requestId} unliked`);
      return new Response(JSON.stringify({ success: true, message: '取消点赞成功' }), {
        headers: corsHeaders,
      });
    } else {
      return new Response(JSON.stringify({ error: '无效的操作类型' }), {
        status: 400,
        headers: corsHeaders,
      });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[${functionName}] failed ${requestId}: ${message}`);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
