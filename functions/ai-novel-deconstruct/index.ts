import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Content-Type': 'application/json',
  };

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();

    if (!text || typeof text !== 'string') {
      return new Response(
        JSON.stringify({ error: '请提供小说文本' }),
        { status: 400, headers: corsHeaders }
      );
    }

    if (text.length < 500) {
      return new Response(
        JSON.stringify({ error: '文本内容过少，请至少输入500字' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // 调用Meoo AI进行分析
    const apiKey = Deno.env.get('MEOO_AI_API_KEY');
    if (!apiKey) {
      throw new Error('未配置AI API密钥');
    }

    const prompt = `你是一位资深的网文编辑和文学分析师。请对以下小说文本进行深度分析，并以JSON格式返回结果。

分析维度包括：
1. 综合评分（0-100）
2. 结构分析（开篇、冲突、高潮、结局）
3. 亮点优势（至少3条）
4. 待改进项（至少3条）
5. 优化建议（至少3条）
6. 市场分析（类型、目标读者、竞争程度、市场潜力评分）
7. 专业编辑指导意见

小说文本：
${text.substring(0, 10000)}

请以以下JSON格式返回：
{
  "score": 数字,
  "structure": {
    "opening": "开篇分析",
    "conflict": "冲突设置分析",
    "climax": "高潮处理分析",
    "resolution": "结局安排分析"
  },
  "highlights": ["亮点1", "亮点2", "亮点3"],
  "issues": ["问题1", "问题2", "问题3"],
  "suggestions": ["建议1", "建议2", "建议3"],
  "marketAnalysis": {
    "genre": "作品类型",
    "targetAudience": "目标读者",
    "competitionLevel": "竞争程度",
    "potentialScore": 数字
  },
  "editorAdvice": "详细的编辑指导意见"
}`;

    const response = await fetch('https://api.meoo.host/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: '你是一位资深的网文编辑，擅长分析小说结构、节奏、人物塑造和市场潜力。请用专业但易懂的语言进行分析。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`AI调用失败: ${response.status} - ${errorText}`);
    }

    const aiResult = await response.json();
    const content = aiResult.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('AI返回内容为空');
    }

    // 尝试解析JSON
    let analysisResult;
    try {
      // 提取JSON部分（可能包含在markdown代码块中）
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : content;
      analysisResult = JSON.parse(jsonStr);
    } catch (e) {
      // 如果解析失败，返回原始内容
      analysisResult = {
        score: 75,
        structure: {
          opening: '需要更多上下文来分析开篇',
          conflict: '需要更多上下文来分析冲突',
          climax: '需要更多上下文来分析高潮',
          resolution: '需要更多上下文来分析结局'
        },
        highlights: ['文本已接收，可以进行更深入的分析'],
        issues: ['AI解析响应格式异常'],
        suggestions: ['请确保文本格式正确'],
        marketAnalysis: {
          genre: '待定',
          targetAudience: '待定',
          competitionLevel: '待定',
          potentialScore: 70
        },
        editorAdvice: content
      };
    }

    return new Response(
      JSON.stringify(analysisResult),
      { headers: corsHeaders }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '分析失败';
    console.error('拆书分析错误:', errorMessage);
    return new Response(
      JSON.stringify({
        error: errorMessage,
        score: 75,
        structure: {
          opening: '分析服务暂时不可用',
          conflict: '分析服务暂时不可用',
          climax: '分析服务暂时不可用',
          resolution: '分析服务暂时不可用'
        },
        highlights: ['请稍后重试'],
        issues: ['服务异常'],
        suggestions: ['检查网络连接后重试'],
        marketAnalysis: {
          genre: '未知',
          targetAudience: '未知',
          competitionLevel: '未知',
          potentialScore: 70
        },
        editorAdvice: '分析服务暂时不可用，请稍后重试。'
      }),
      { status: 500, headers: corsHeaders }
    );
  }
});
