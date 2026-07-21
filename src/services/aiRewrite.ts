/**
 * 纯前端AI仿写服务
 * 直接调用DeepSeek API，无需Edge Function
 */

export interface RewriteParams {
  model?: string;
  writeMode?: string;
  plotRetention?: number;
  characterRetention?: number;
  highlightRetention?: number;
  logicRetention?: number;
  styleRetention?: number;
  aiCreativity?: number;
  optimizationInstruction?: string;
  styleRequirement?: string;
  forbiddenWords?: string;
}

// DeepSeek API 配置
const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

// 内置的API Key（来自MEMORY.md）
const BUILTIN_API_KEY = 'sk-3dc3dd5c193b4c8db608720257a79b60';

// 获取API Key
function getApiKey(): string {
  // 优先使用用户配置的Key
  const userKey = localStorage.getItem('rewrite_api_key');
  if (userKey) return userKey;
  // 回退到内置Key
  return BUILTIN_API_KEY;
}

// 模型映射
const MODEL_MAP: Record<string, string> = {
  'deepseek-chat': 'deepseek-chat',
  'deepseek-v3.2': 'deepseek-chat',
  'qwen3.6-plus': 'qwen-plus',
  'qwen3-max': 'qwen-max',
  'kimi-k2.5': 'moonshot-v1-128k',
  'glm-5': 'glm-4',
  'MiniMax-M2.5': 'abab6.5s',
  // 默认
  'default': 'deepseek-chat'
};

// 获取实际模型名
function resolveModel(model: string): string {
  return MODEL_MAP[model] || MODEL_MAP['default'];
}

// 构建仿写提示词
function buildRewritePrompt(params: RewriteParams): string {
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

  const creativityLevel = aiCreativity > 70 ? '高' : aiCreativity > 40 ? '中' : '低';

  let prompt = `你是资深网络小说作者，擅长仿写创作。请对原文进行高质量仿写，保留核心精华，注入个人风格。

## 仿写要求

**模式**: ${writeMode === 'comprehensive' ? '全维综合模式' : writeMode === 'plot' ? '情节优先模式' : writeMode === 'character' ? '人物优先模式' : '风格优先模式'}

**五维控制**:
- 剧情结构: ${plotRetention}%
- 人物塑造: ${characterRetention}%
- 爽点设置: ${highlightRetention}%
- 逻辑连贯: ${logicRetention}%
- 文风语感: ${styleRetention}%

**创意程度**: ${creativityLevel}（AI创意度 ${aiCreativity}%）
${aiCreativity > 70 ? '→ 大胆重构，增加原创性描写' : aiCreativity > 40 ? '→ 平衡创新与保守' : '→ 贴近原文，主要同义替换'}`;

  if (optimizationInstruction) {
    prompt += `\n\n**优化指令**: ${optimizationInstruction}`;
  }
  if (styleRequirement) {
    prompt += `\n\n**风格要求**: ${styleRequirement}`;
  }
  if (forbiddenWords) {
    prompt += `\n\n**禁用词汇**: ${forbiddenWords}（严格避免）`;
  }

  prompt += `

## 输出规范
- 输出纯正文，不含Markdown标记或解释
- 保持核心事件和人物性格
- 段落节奏与原文相似
- 直接输出仿写内容，不要前缀

---

原文如下：
`;

  return prompt;
}

/**
 * 执行AI仿写（流式）
 */
export async function requestNovelRewrite(
  originalText: string,
  params: RewriteParams,
  onChunk: (text: string) => void,
  signal?: AbortSignal
): Promise<string> {
  const apiKey = getApiKey();
  const model = resolveModel(params.model || 'deepseek-chat');
  const temperature = (params.aiCreativity ?? 60) / 100;
  
  const systemPrompt = buildRewritePrompt(params);
  
  console.log('[aiRewrite] 正在调用DeepSeek API...');
  console.log('[aiRewrite] 模型:', model, '温度:', temperature);

  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: originalText }
      ],
      stream: true,
      temperature: Math.max(0.1, Math.min(1, temperature))
    }),
    signal
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `API错误: ${response.status}`);
  }

  if (!response.body) {
    throw new Error('浏览器不支持流式响应');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let fullText = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data: ')) continue;

        const payload = trimmed.slice(6);
        if (payload === '[DONE]') {
          return fullText;
        }

        try {
          const json = JSON.parse(payload);
          const content = json.choices?.[0]?.delta?.content;
          if (content) {
            fullText += content;
            onChunk(content);
          }
        } catch {
          // 忽略非法JSON
        }
      }
    }
  } catch (err) {
    if ((err as Error).name === 'AbortError') {
      return fullText;
    }
    throw err;
  }

  return fullText;
}

/**
 * 检测API Key是否有效
 */
export async function checkApiKey(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: 'hi' }],
        max_tokens: 5
      })
    });
    return response.ok;
  } catch {
    return false;
  }
}
