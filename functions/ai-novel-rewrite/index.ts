const DEEPSEEK_API_URL = 'https://api.deepseek.com';
const DEEPSEEK_API_KEY = Deno.env.get('DEEPSEEK_API_KEY') || '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  const functionName = 'ai-novel-rewrite';
  const requestId = crypto.randomUUID().slice(0, 8);
  const startTime = Date.now();

  // CORS 预检
  if (req.method === 'OPTIONS') {
    console.info(`[${functionName}] CORS preflight ${requestId}`);
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    console.info(`[${functionName}] request ${requestId} body=${JSON.stringify(body).slice(0, 500)}`);

    const { originalText, params } = body;

    console.info(`[${functionName}] request ${requestId} textLength=${originalText?.length || 0}`);
    console.info(`[${functionName}] params=${JSON.stringify(params)}`);

    // 参数验证
    if (!originalText || originalText.length === 0) {
      console.error(`[${functionName}] validation failed ${requestId}: originalText is empty`);
      return new Response(
        JSON.stringify({ error: 'originalText is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    if (!params?.model) {
      console.error(`[${functionName}] validation failed ${requestId}: params.model is missing`);
      return new Response(
        JSON.stringify({ error: 'params.model is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 构建仿写提示词
    const systemPrompt = buildRewritePrompt(params);
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: originalText }
    ];

    // 支持的模型列表（与前端保持一致）
    const supportedModels = [
      'deepseek-chat',
      'qwen3.6-plus',
      'qwen3-max',
      'kimi-k2.5',
      'deepseek-v3.2',
      'glm-5',
      'MiniMax-M2.5'
    ];

    // 验证并选择模型
    const selectedModel = params.model && supportedModels.includes(params.model)
      ? params.model
      : 'deepseek-chat';

    console.info(`[${functionName}] using model ${selectedModel} (requested: ${params.model})`);

    // 调用 DeepSeek API（强制流式）
    const requestBody = {
      model: selectedModel,
      messages,
      stream: true,
      temperature: typeof params.aiCreativity === 'number' ? params.aiCreativity / 100 : 0.6
    };
    console.info(`[${functionName}] upstream request ${requestId} model=${requestBody.model} temperature=${requestBody.temperature}`);

    const response = await fetch(
      `${DEEPSEEK_API_URL}/chat/completions`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );
    const upstreamDuration = Date.now() - startTime;
    console.info(`[${functionName}] upstream ${requestId} status=${response.status} durationMs=${upstreamDuration}`);

    // 转发上游 HTTP 状态码
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`[${functionName}] upstream failed ${requestId} status=${response.status}: ${errorBody.slice(0, 500)}`);
      console.error(`[${functionName}] upstream request body was: ${JSON.stringify(requestBody).slice(0, 500)}`);
      return new Response(
        JSON.stringify({
          error: 'Upstream AI service error',
          upstreamStatus: response.status,
          upstreamError: errorBody.slice(0, 200)
        }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 转发 SSE 流
    const reader = response.body!.getReader();
    let chunkCount = 0;
    let totalBytes = 0;
    const readable = new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunkCount++;
            totalBytes += value.byteLength;
            controller.enqueue(value);
          }
          controller.close();
          console.info(`[${functionName}] stream done ${requestId} chunks=${chunkCount} bytes=${totalBytes} durationMs=${Date.now() - startTime}`);
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          console.error(`[${functionName}] stream failed ${requestId}: ${message}`);
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    console.error(`[${functionName}] failed ${requestId}: ${message}`);
    return new Response(
      JSON.stringify({ error: message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

// 构建仿写提示词
function buildRewritePrompt(params: any): string {
  const {
    writeMode = 'comprehensive',
    plotRetention = 85,
    characterRetention = 85,
    highlightRetention = 80,
    logicRetention = 65,
    styleRetention = 78,
    aiCreativity = 60,
    optimizationInstruction = '',
    styleRequirement = '',
    forbiddenWords = ''
  } = params;

  // 计算创意与保守的平衡
  const creativityLevel = aiCreativity > 70 ? '高' : aiCreativity > 40 ? '中' : '低';

  let prompt = `# 角色定位
你是一位资深小说编辑和文学创作专家，擅长在保留原著精髓的基础上进行创新性改写。你的任务是提供高质量的仿写内容，既要忠实于原作精神，又要展现独特的文学表达。

# 核心任务
对提供的原文进行专业级仿写，在保持核心要素的同时，通过语言重构、细节丰富、节奏调整等手段，创造出既熟悉又新颖的阅读体验。

# 仿写策略配置

## 1. 仿写模式
**${getWriteModeDesc(writeMode)}**

## 2. 五维权重控制
| 维度 | 保留度 | 执行要点 |
|------|--------|----------|
| 剧情结构 | ${plotRetention}% | ${getPlotGuidance(plotRetention)} |
| 人物塑造 | ${characterRetention}% | ${getCharacterGuidance(characterRetention)} |
| 爽点设置 | ${highlightRetention}% | ${getHighlightGuidance(highlightRetention)} |
| 逻辑连贯 | ${logicRetention}% | ${getLogicGuidance(logicRetention)} |
| 文风语感 | ${styleRetention}% | ${getStyleGuidance(styleRetention)} |

## 3. 创意程度：**${creativityLevel}**（AI创意度 ${aiCreativity}%）
- **高创意**：大胆重构句式，增加原创性描写，适度扩展细节
- **中创意**：平衡保守与创新，在关键处加入个性化表达
- **低创意**：贴近原文结构，主要进行同义替换和微调

## 4. 特殊要求`;

  if (optimizationInstruction) {
    prompt += `\n**优化指令**：${optimizationInstruction}`;
  }
  if (styleRequirement) {
    prompt += `\n**风格要求**：${styleRequirement}`;
  }
  if (forbiddenWords) {
    const words = forbiddenWords.split(',').map((w: string) => w.trim()).filter((w: string) => w);
    prompt += `\n**禁用词汇**：${words.join('、')}（严格避免使用上述词汇）`;
  }

  prompt += `

# 技术规范

## 必须遵守
✅ 保持原文的核心事件顺序和因果关系
✅ 维持人物的基本性格特征和行为逻辑
✅ 确保世界观设定的一致性
✅ 输出纯文本，不含Markdown标记、注释或解释
✅ 段落结构与原文保持相似节奏

## 严禁行为
❌ 改变核心剧情走向或结局
❌ 扭曲人物基本性格或动机
❌ 添加原文不存在的重要情节
❌ 使用口语化、网络用语（除非原文如此）
❌ 输出"以下是仿写结果"等元信息

# 输出格式
直接输出仿写后的正文内容，无需任何前缀、后缀或说明。

---

**原文如下：**`;

  return prompt;
}

function getPlotGuidance(retention: number): string {
  if (retention >= 90) return '几乎完全复刻原有情节，仅做必要润色';
  if (retention >= 80) return '保持主线剧情不变，可微调次要情节';
  if (retention >= 70) return '核心事件保留，允许重组部分情节顺序';
  return '保留关键转折点，其他情节可大幅重构';
}

function getCharacterGuidance(retention: number): string {
  if (retention >= 90) return '严格保持人设，连口头禅都要保留';
  if (retention >= 80) return '核心性格不变，可调整表达方式';
  if (retention >= 70) return '保持人物基本特质，允许适度深化';
  return '保留人物核心动机，可重新塑造部分性格侧面';
}

function getHighlightGuidance(retention: number): string {
  if (retention >= 90) return '所有爽点原样保留，仅换表达方式';
  if (retention >= 80) return '核心爽点保留，可增强情绪渲染';
  if (retention >= 70) return '保留主要高潮，可调整铺垫方式';
  return '保留情感爆发点，可重构爽点呈现形式';
}

function getLogicGuidance(retention: number): string {
  if (retention >= 90) return '严格遵循因果链，不允许任何逻辑跳跃';
  if (retention >= 80) return '保持主要因果关系，允许合理省略';
  if (retention >= 70) return '核心逻辑完整，次要线索可简化';
  return '保证故事自洽，允许适度留白';
}

function getStyleGuidance(retention: number): string {
  if (retention >= 90) return '完全模仿原文笔法，包括修辞习惯';
  if (retention >= 80) return '保持整体文风，可微调句式变化';
  if (retention >= 70) return '维持基本语调，允许融入个人风格';
  return '保留叙事视角，可大幅调整语言风格';
}

function getWriteModeDesc(mode: string): string {
  const modes: Record<string, string> = {
    comprehensive: '全维综合模式：情节 + 人物 + 风格 + 节奏 + 设定全方位对标',
    track: '赛道适配模式：根据目标平台调整文风和节奏',
    plot: '情节模式：优先复刻优化剧情结构',
    character: '人物模式：优先保留塑造人设',
    style: '风格模式：优先还原原文文风语感'
  };
  return modes[mode] || modes.comprehensive;
}
