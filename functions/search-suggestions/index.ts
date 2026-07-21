Deno.serve(async (req) => {
  const functionName = 'search-suggestions';
  const requestId = crypto.randomUUID().slice(0, 8);

  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  try {
    const url = new URL(req.url);
    const keyword = url.searchParams.get('keyword') || '';
    const limit = parseInt(url.searchParams.get('limit') || '5');

    if (!keyword || keyword.length < 1) {
      return new Response(JSON.stringify({ suggestions: [] }), {
        headers: corsHeaders,
      });
    }

    const authHeader = req.headers.get('Authorization');
    
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      authHeader ? { global: { headers: { Authorization: authHeader } } } : {}
    );

    // 从多个表中搜索匹配的内容
    const [sharesResult, worksResult, qaResult] = await Promise.all([
      supabase
        .from('author_shares')
        .select('id, title, platform')
        .eq('status', 'approved')
        .ilike('title', `%${keyword}%`)
        .limit(limit),
      supabase
        .from('works_showcase')
        .select('id, title, genre')
        .eq('status', 'published')
        .ilike('title', `%${keyword}%`)
        .limit(limit),
      supabase
        .from('qa_posts')
        .select('id, title, category')
        .eq('status', 'open')
        .ilike('title', `%${keyword}%`)
        .limit(limit),
    ]);

    interface Suggestion {
      id: string;
      type: string;
      title: string;
      subtitle: string;
      icon: string;
    }

    const suggestions: Suggestion[] = [];

    if (sharesResult.data) {
      sharesResult.data.forEach(item => {
        suggestions.push({
          id: `share:${item.id}`,
          type: 'share',
          title: item.title,
          subtitle: item.platform,
          icon: 'Users',
        });
      });
    }

    if (worksResult.data) {
      worksResult.data.forEach(item => {
        suggestions.push({
          id: `work:${item.id}`,
          type: 'work',
          title: item.title,
          subtitle: item.genre,
          icon: 'BookOpen',
        });
      });
    }

    if (qaResult.data) {
      qaResult.data.forEach(item => {
        suggestions.push({
          id: `qa:${item.id}`,
          type: 'qa',
          title: item.title,
          subtitle: item.category,
          icon: 'HelpCircle',
        });
      });
    }

    // 按相关性排序（简单按标题长度和匹配度）
    suggestions.sort((a, b) => {
      const aMatch = a.title.toLowerCase().indexOf(keyword.toLowerCase());
      const bMatch = b.title.toLowerCase().indexOf(keyword.toLowerCase());
      if (aMatch !== bMatch) return aMatch - bMatch;
      return a.title.length - b.title.length;
    });

    // 只返回前limit条
    const limitedSuggestions = suggestions.slice(0, limit);

    console.info(`[${functionName}] success ${requestId} keyword=${keyword} count=${limitedSuggestions.length}`);
    return new Response(JSON.stringify({ 
      suggestions: limitedSuggestions,
      total: suggestions.length 
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
