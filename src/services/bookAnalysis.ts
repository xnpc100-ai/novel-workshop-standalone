/**
 * 6 维智能拆书服务（PRD 2）
 *
 * 维度：结构/人物/剧情/风格/金句 + 综合评估
 * 真实调用 DeepSeek，强约束 JSON 输出
 */

const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

function getApiKey(): string {
  const userKey = localStorage.getItem('rewrite_api_key');
  return userKey || 'sk-3dc3dd5c193b4c8db608720257a79b60';
}

const MAX_CHARS = 50_000;

export type AnalysisTab = 'structure' | 'characters' | 'plot' | 'style' | 'quotes';

interface ChapterOutline {
  chapter: number;
  title: string;
  summary: string;
  keyEvents: string[];
}

interface Faction {
  name: string;
  description: string;
}

interface Character {
  name: string;
  role: 'protagonist' | 'supporting' | 'antagonist';
  personality: string;
  background: string;
  growth: string;
  relationships: string[];
}

interface TurningPoint {
  chapter: number;
  description: string;
}

interface Subplot {
  title: string;
  relationToMain: string;
}

interface GoldenQuote {
  text: string;
  emotionTag: string;
  rhetoricType: string;
  position: string;
  score: number;
}

export interface AnalysisResult {
  score: number;
  structure: {
    opening: string;
    conflict: string;
    climax: string;
    resolution: string;
  };
  highlights: string[];
  issues: string[];
  suggestions: string[];
  marketAnalysis: {
    genre: string;
    targetAudience: string;
    competitionLevel: string;
    potentialScore: number;
  };
  editorAdvice: string;
  outline?: {
    mainPlot: string;
    chapterOutlines: ChapterOutline[];
  };
  worldBuilding?: {
    background: string;
    factions: Faction[];
    magicSystem?: string;
  };
  characters?: Character[];
  plotAnalysis?: {
    rhythm: string;
    turningPoints: TurningPoint[];
    subplots: Subplot[];
  };
  themeAnalysis?: {
    coreThemes: string[];
    emotionalArc: string;
  };
  writingStyle?: {
    perspective: string;
    narrativeRhythm: string;
    techniques: string[];
  };
  goldenQuotes?: GoldenQuote[];
}

async function callDeepSeekJSON(system: string, user: string): Promise<any> {
  const apiKey = getApiKey();
  const resp = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: 0.5,
      max_tokens: 8000,
      response_format: { type: 'json_object' },
    }),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.error?.message || `API错误: ${resp.status}`);
  }
  const data = await resp.json();
  const content = data.choices?.[0]?.message?.content || '{}';
  try {
    return JSON.parse(content);
  } catch {
    const cleaned = content.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
    return JSON.parse(cleaned);
  }
}

function buildFullAnalysisPrompt(text: string): string {
  return `你是顶级网文/严肃文学双栖编辑，出版业20年经验，深度理解网文爆款逻辑与传统文学叙事技法。
请对以下小说文本进行 **6 维度深度拆解 + 综合评估**（严格按 PRD 2.x 维度标准：结构/人物/剧情/风格/金句/综合）。

# 重要输出约束（必须严格遵守）
1. 只输出一个 JSON 对象，不要 markdown 代码块，不要任何解释文字。
2. 所有字段必须【直接位于根对象下】，禁止用 dimension1/dimension2/维度 等外层对象包裹。
3. 字段名必须完全等于下面示例中的英文名，一个字母都不能改。

# 必须输出的 JSON 结构（严格照此，用真实内容替换占位值）
{
  "score": 88,
  "structure": { "opening": "开篇评估", "conflict": "冲突评估", "climax": "高潮评估", "resolution": "结局评估" },
  "highlights": ["亮点1", "亮点2"],
  "issues": ["待改进1", "待改进2"],
  "suggestions": ["建议1", "建议2"],
  "marketAnalysis": { "genre": "都市修仙", "targetAudience": "18-35岁男性", "competitionLevel": "中等", "potentialScore": 80 },
  "editorAdvice": "200-400字编辑综合意见",
  "outline": {
    "mainPlot": "全书主线200-400字",
    "chapterOutlines": [ { "chapter": 1, "title": "章节标题", "summary": "摘要50字内", "keyEvents": ["关键事件1", "关键事件2"] } ]
  },
  "worldBuilding": {
    "background": "背景架构100-200字",
    "factions": [ { "name": "势力名", "description": "描述" } ],
    "magicSystem": "体系设定（无则省略此字段）"
  },
  "characters": [
    { "name": "人名", "role": "protagonist", "personality": "性格", "background": "背景", "growth": "成长", "relationships": ["关系1", "关系2"] }
  ],
  "plotAnalysis": {
    "rhythm": "节奏感100-200字",
    "turningPoints": [ { "chapter": 3, "description": "转折点描述" } ],
    "subplots": [ { "title": "支线名", "relationToMain": "与主线关系" } ]
  },
  "themeAnalysis": { "coreThemes": ["主题1", "主题2"], "emotionalArc": "情感脉络80-150字" },
  "writingStyle": { "perspective": "叙事视角30-80字", "narrativeRhythm": "叙事节奏80-150字", "techniques": ["技巧1", "技巧2"] },
  "goldenQuotes": [
    { "text": "金句原文摘录", "emotionTag": "励志", "rhetoricType": "比喻", "position": "第5章", "score": 90 }
  ]
}

# 各维度内容要求
- outline.chapterOutlines：拆出 3-8 个关键章节，chapter 用数字。
- worldBuilding.factions：武侠/玄幻/奇幻等含势力分布的类型必出 2-6 个，每项含 name 与 description 两个字段。
- characters：自动识别 3-8 个核心人物，role 只能取 protagonist / supporting / antagonist。
- plotAnalysis.turningPoints：3-5 个，含 chapter 与 description。
- goldenQuotes：提取 5-12 条，优先真正有文学价值的高光句；score 为 0-100。
- score：综合评分 0-100（基于结构/人物/语言/市场潜力）。

# 原文
${text}`;
}

/**
 * 主入口：一次性全维度分析
 */
export async function analyzeBook(
  text: string,
  onProgress?: (msg: string) => void
): Promise<AnalysisResult> {
  if (!text.trim()) throw new Error('请输入小说文本');
  if (text.length < 500) throw new Error('文本内容过少，请至少输入 500 字');
  if (text.length > MAX_CHARS) throw new Error(`文本过长（${text.length}字），建议不超过 ${MAX_CHARS} 字`);

  onProgress?.('开始 6 维度深度拆解（综合评估/结构/人物/剧情/风格/金句）...');
  const data = await callDeepSeekJSON(
    '你是顶级网文/文学双栖编辑。必须严格按照用户 prompt 中的 JSON 骨架输出：所有字段直接位于根对象，字段名一字不差，禁止任何外层包裹对象，禁止 markdown 代码块，禁止解释文字。',
    buildFullAnalysisPrompt(text)
  );

  // 容错：补齐缺失字段
  return normalizeResult(data, text);
}

function flattenDimensions(raw: any): any {
  // 兜底：模型有时会把结果包裹在 dimension1..6 / 维度1..6 外层对象中
  const dimKeys = Object.keys(raw || {}).filter((k) => /^dimension\d+$/i.test(k) || /^维度\d+$/.test(k));
  if (dimKeys.length === 0) return raw;
  const merged: any = {};
  for (const k of dimKeys) {
    const v = raw[k];
    if (v && typeof v === 'object') Object.assign(merged, v);
  }
  // 仍保留根级已有字段（根级优先）
  return { ...merged, ...raw, ...stripDimKeys(raw) };
}

function stripDimKeys(raw: any): any {
  const out: any = {};
  for (const k of Object.keys(raw || {})) {
    if (!/^dimension\d+$/i.test(k) && !/^维度\d+$/.test(k)) out[k] = raw[k];
  }
  return out;
}

function normalizeResult(raw: any, text: string): AnalysisResult {
  const r = flattenDimensions(raw || {});
  return {
    score: Number(raw.score) || 0,
    structure: {
      opening: raw.structure?.opening || '暂无',
      conflict: raw.structure?.conflict || '暂无',
      climax: raw.structure?.climax || '暂无',
      resolution: raw.structure?.resolution || '暂无',
    },
    highlights: Array.isArray(raw.highlights) ? raw.highlights : [],
    issues: Array.isArray(raw.issues) ? raw.issues : [],
    suggestions: Array.isArray(raw.suggestions) ? raw.suggestions : [],
    marketAnalysis: {
      genre: raw.marketAnalysis?.genre || '未知',
      targetAudience: raw.marketAnalysis?.targetAudience || '未知',
      competitionLevel: raw.marketAnalysis?.competitionLevel || '未知',
      potentialScore: Number(raw.marketAnalysis?.potentialScore) || 0,
    },
    editorAdvice: raw.editorAdvice || '',
    outline: raw.outline
      ? {
          mainPlot: raw.outline.mainPlot || '',
          chapterOutlines: Array.isArray(raw.outline.chapterOutlines)
            ? raw.outline.chapterOutlines
            : [],
        }
      : undefined,
    worldBuilding: raw.worldBuilding
      ? {
          background: raw.worldBuilding.background || '',
          factions: Array.isArray(raw.worldBuilding.factions)
            ? raw.worldBuilding.factions
            : [],
          magicSystem: raw.worldBuilding.magicSystem,
        }
      : undefined,
    characters: Array.isArray(raw.characters) ? raw.characters : undefined,
    plotAnalysis: raw.plotAnalysis
      ? {
          rhythm: raw.plotAnalysis.rhythm || '',
          turningPoints: Array.isArray(raw.plotAnalysis.turningPoints)
            ? raw.plotAnalysis.turningPoints
            : [],
          subplots: Array.isArray(raw.plotAnalysis.subplots)
            ? raw.plotAnalysis.subplots
            : [],
        }
      : undefined,
    themeAnalysis: raw.themeAnalysis
      ? {
          coreThemes: Array.isArray(raw.themeAnalysis.coreThemes)
            ? raw.themeAnalysis.coreThemes
            : [],
          emotionalArc: raw.themeAnalysis.emotionalArc || '',
        }
      : undefined,
    writingStyle: raw.writingStyle
      ? {
          perspective: raw.writingStyle.perspective || '',
          narrativeRhythm: raw.writingStyle.narrativeRhythm || '',
          techniques: Array.isArray(raw.writingStyle.techniques)
            ? raw.writingStyle.techniques
            : [],
        }
      : undefined,
    goldenQuotes: Array.isArray(raw.goldenQuotes) ? raw.goldenQuotes : undefined,
  };
}
