/**
 * 小说分析服务 - 直接调用DeepSeek API
 */

export interface AnalysisParams {
  model?: string;
  analysisType?: 'novel-analysis' | 'character-analysis' | 'plot-analysis';
  writeMode?: string;
}

const MAX_ANALYSIS_LENGTH = 50000;

// DeepSeek API 配置
const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

// 获取API Key
function getApiKey(): string {
  const userKey = localStorage.getItem('rewrite_api_key');
  return userKey || 'sk-3dc3dd5c193b4c8db608720257a79b60';
}

function getAnalysisTypeName(type?: string): string {
  switch (type) {
    case 'character-analysis':
      return '人物分析';
    case 'plot-analysis':
      return '剧情分析';
    default:
      return '小说爆款分析';
  }
}

function buildAnalysisPrompt(text: string, params: AnalysisParams): string {
  const analysisName = getAnalysisTypeName(params.analysisType);
  
  let prompt = `你是资深网络小说编辑，请对以下小说文本进行专业的${analysisName}。

## 分析维度

请从以下维度进行深度分析：

1. **情节结构**
   - 主线清晰度与推进节奏
   - 情节转折与高潮设置
   - 起承转合的完整性

2. **人物塑造**
   - 主要人物的性格深度
   - 人物关系的张力
   - 角色成长的弧线

3. **语言风格**
   - 文笔特色与节奏感
   - 描写手法与修辞运用
   - 对话的自然度

4. **市场潜力**
   - 当前热元素的融合度
   - 读者爽点与期待感
   - 差异化与创新点

5. **优化建议**
   - 可提升的关键点
   - 具体改进方向

## 输出格式

请按以上5个维度输出详细分析报告，每个维度至少300字，整体报告不少于1500字。
`;

  return prompt;
}

export async function requestNovelAnalysis(
  text: string,
  params: AnalysisParams,
  onChunk: (text: string) => void
): Promise<string> {
  if (text.length > MAX_ANALYSIS_LENGTH) {
    throw new Error(`文本过长（${text.length}字），分析功能建议不超过${MAX_ANALYSIS_LENGTH}字`);
  }

  const apiKey = getApiKey();
  const systemPrompt = buildAnalysisPrompt(text, params);

  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text }
      ],
      stream: true,
      temperature: 0.7
    })
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
        if (payload === '[DONE]') return fullText;

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
    if ((err as Error).name === 'AbortError') return fullText;
    throw err;
  }

  return fullText;
}
