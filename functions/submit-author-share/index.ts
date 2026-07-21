Deno.serve(async (req) => {
  const functionName = 'submit-author-share';
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
    const shareData = await req.json();
    console.info(`[${functionName}] request ${requestId} platform=${shareData.platform}`);

    // 获取用户认证信息
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: '需要登录才能分享' }), {
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

    // 获取当前用户ID和资料
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: '用户未认证' }), {
        status: 401,
        headers: corsHeaders,
      });
    }

    // 获取用户资料
    const { data: profile } = await supabase
      .from('profiles')
      .select('username, avatar_url')
      .eq('id', user.id)
      .single();

    // 插入分享数据
    const { data, error } = await supabase
      .from('author_shares')
      .insert({
        user_id: user.id,
        nickname: profile?.username || '匿名用户',
        avatar_url: profile?.avatar_url,
        platform: shareData.platform,
        title: shareData.title,
        income: shareData.income,
        story: shareData.story,
        background: shareData.background,
        breakthrough: shareData.breakthrough,
        current_status: shareData.currentStatus,
        advice: shareData.advice,
        tips: shareData.tips,
        achievement: shareData.achievement,
        images: shareData.images || [],
        status: 'pending'
      })
      .select();

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      throw new Error('提交失败：可能被 RLS 策略拦截');
    }

    console.info(`[${functionName}] success ${requestId} shareId=${data[0].id}`);
    return new Response(JSON.stringify({
      success: true,
      message: '分享提交成功，等待审核',
      shareId: data[0].id
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
