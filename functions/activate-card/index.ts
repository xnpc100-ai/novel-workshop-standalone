import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

Deno.serve(async (req) => {
  const functionName = 'activate-card';
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
    const { cardCode } = await req.json();
    console.info(`[${functionName}] request ${requestId} cardCode=${cardCode}`);

    // 参数校验
    if (!cardCode || typeof cardCode !== 'string' || cardCode.length !== 16) {
      return new Response(
        JSON.stringify({ success: false, error: '激活码格式错误，必须为16位字符' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // 初始化 Supabase 客户端（使用服务角色密钥以绕过 RLS）
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      console.error(`[${functionName}] missing env vars ${requestId}`);
      return new Response(
        JSON.stringify({ success: false, error: '服务器配置错误' }),
        { status: 500, headers: corsHeaders }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // 查询激活码
    const { data, error } = await supabase
      .from('activation_keys')
      .select('*')
      .eq('key_code', cardCode.toUpperCase())
      .single();

    if (error) {
      console.error(`[${functionName}] query failed ${requestId}: ${error.message}`);
      return new Response(
        JSON.stringify({ success: false, error: '激活码不存在' }),
        { status: 404, headers: corsHeaders }
      );
    }

    // 检查是否已使用
    if (data.is_used) {
      console.info(`[${functionName}] already used ${requestId}`);
      return new Response(
        JSON.stringify({ success: false, error: '该激活码已被使用' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // 检查是否过期
    const now = new Date();
    const expiresAt = new Date(data.expires_at);
    if (now > expiresAt) {
      console.info(`[${functionName}] expired ${requestId} expiresAt=${data.expires_at}`);
      return new Response(
        JSON.stringify({ success: false, error: '激活码已过期' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // 标记为已使用
    const { error: updateError } = await supabase
      .from('activation_keys')
      .update({
        is_used: true,
        activated_at: now.toISOString(),
      })
      .eq('id', data.id);

    if (updateError) {
      console.error(`[${functionName}] update failed ${requestId}: ${updateError.message}`);
      return new Response(
        JSON.stringify({ success: false, error: '激活失败，请稍后重试' }),
        { status: 500, headers: corsHeaders }
      );
    }

    // 计算剩余天数
    const remainingDays = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    console.info(`[${functionName}] success ${requestId} remainingDays=${remainingDays}`);

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          cardCode: data.key_code,
          expireTime: data.expires_at,
          remainingDays,
        },
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[${functionName}] failed ${requestId}: ${message}`);
    return new Response(
      JSON.stringify({ success: false, error: '服务器内部错误' }),
      { status: 500, headers: corsHeaders }
    );
  }
});
