/**
 * 衍生创作服务（PRD 3）
 *
 * - 一键仿写与重构：基于原书的大纲/细纲/写作风格，生成新书框架
 * - 内容浓缩与摘要：一句话/要点/详细摘要
 * - 习题与试卷拆解：非小说类文档拆解为独立卡片
 */

const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

function getApiKey(): string {
  const userKey = localStorage.getItem('rewrite_api_key');
  return userKey || 'sk-3dc3dd5c193b4c8db608720257a79b60';
}

async function callDeepSeekJSON(system: string, user: string, maxTokens = 6000): Promise<any> {
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
      temperature: 0.6,
      max_tokens: maxTokens,
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

// ============================================================
// 一、仿写与重构
// ============================================================

export interface RewriteInput {
  /** 新书名 */
  newTitle: string;
  /** 流派：玄幻/都市/言情/武侠/科幻/历史/仙侠/悬疑... */
  genre: string;
  /** 核心梗概 */
  synopsis: string;
  /** 原书文本（可选，有则基于风格迁移） */
  sourceText?: string;
  /** 仿写深度：light（仅借鉴设定）/ standard（结构+风格）/ deep（深度风格迁移） */
  depth?: 'light' | 'standard' | 'deep';
}

export interface RewriteOutput {
  title: string;
  genre: string;
  coreIdea: string;
  outline: {
    mainPlot: string;
    chapterOutlines: { chapter: number; title: string; summary: string; keyEvents: string[] }[];
  };
  characters: {
    name: string;
    role: string;
    personality: string;
    background: string;
  }[];
  worldSetting: {
    background: string;
    keyElements: string[];
  };
  writingStyle: {
    perspective: string;
    techniques: string[];
  };
  marketAdvice: string;
}

export async function generateRewrite(input: RewriteInput): Promise<RewriteOutput> {
  const { newTitle, genre, synopsis, sourceText, depth = 'standard' } = input;
  if (!newTitle.trim() || !genre.trim() || !synopsis.trim())
    throw new Error('请填写完整的新书名、类型和核心梗概');

  const depthNote =
    depth === 'light'
      ? '仅借鉴原书的"爽点结构 + 关键设定"，生成全新世界观'
      : depth === 'deep'
      ? '深度风格迁移：原书的叙事节奏、用词习惯、修辞偏好都尽量还原，仅替换具体情节'
      : '中等仿写：保留主线架构和节奏感，但允许较大幅度改写';

  const sourceBlock = sourceText
    ? `## 原书文本（用于风格参考）\n${sourceText.slice(0, 15000)}\n\n## 仿写深度\n${depthNote}\n`
    : '（无原书，基于通用爆款逻辑生成）\n';

  const system =
    '你是顶级网文策划编辑+爆款架构师，输出严格 JSON。';
  const user = `${sourceBlock}

## 新书需求
- **新书名**：${newTitle}
- **类型**：${genre}
- **核心梗概**：${synopsis}

## 输出要求（严格 JSON）

{
  "title": "新书名",
  "genre": "类型",
  "coreIdea": "核心创意/卖点（一句话）",
  "outline": {
    "mainPlot": "全书主线（200-300字）",
    "chapterOutlines": [
      // 6-10 个关键章节，每项 {chapter, title, summary, keyEvents: [string]}
    ]
  },
  "characters": [
    // 3-6 个核心人物 {name, role(主角/女主/反派/配角), personality, background}
  ],
  "worldSetting": {
    "background": "世界观背景（100-200字）",
    "keyElements": ["关键设定1", "关键设定2", ...]
  },
  "writingStyle": {
    "perspective": "叙事视角",
    "techniques": ["技巧1", "技巧2", ...]
  },
  "marketAdvice": "市场定位与运营建议（100-200字）"
}

不要 markdown 代码块。`;

  const raw = await callDeepSeekJSON(system, user, 8000);
  return {
    title: raw.title || newTitle,
    genre: raw.genre || genre,
    coreIdea: raw.coreIdea || '',
    outline: {
      mainPlot: raw.outline?.mainPlot || '',
      chapterOutlines: Array.isArray(raw.outline?.chapterOutlines)
        ? raw.outline.chapterOutlines
        : [],
    },
    characters: Array.isArray(raw.characters) ? raw.characters : [],
    worldSetting: {
      background: raw.worldSetting?.background || '',
      keyElements: Array.isArray(raw.worldSetting?.keyElements) ? raw.worldSetting.keyElements : [],
    },
    writingStyle: {
      perspective: raw.writingStyle?.perspective || '',
      techniques: Array.isArray(raw.writingStyle?.techniques) ? raw.writingStyle.techniques : [],
    },
    marketAdvice: raw.marketAdvice || '',
  };
}

// ============================================================
// 二、内容浓缩与摘要
// ============================================================

export interface SummaryResult {
  oneSentence: string;   // 一句话核心
  bulletPoints: string[]; // 要点清单 5-8 条
  detailed: string;       // 详细摘要 500-1000 字
  keyEvents: { event: string; impact: string }[]; // 关键事件
  themes: string[];       // 核心主题
}

export async function generateSummary(text: string): Promise<SummaryResult> {
  if (!text.trim()) throw new Error('请输入要摘要的文本');
  if (text.length < 500) throw new Error('文本内容过少，请至少输入 500 字');
  if (text.length > 80_000) throw new Error('文本过长，建议不超过 8 万字');

  const system = '你是顶级内容运营编辑，擅长把长文凝练为多粒度摘要。输出严格 JSON。';
  const user = `请对以下文本生成多粒度摘要：

## 文本
${text}

## 输出要求（严格 JSON）
{
  "oneSentence": "一句话核心摘要（30-80字，扣人心弦）",
  "bulletPoints": ["要点1", "要点2", ...], // 5-8 条
  "detailed": "详细摘要 500-1000 字，保留主线/人物/转折/结尾",
  "keyEvents": [
    {"event": "关键事件描述", "impact": "对剧情的影响"}
  ], // 3-5 个
  "themes": ["核心主题1", "核心主题2"] // 1-3 个
}

不要 markdown 代码块。`;

  const raw = await callDeepSeekJSON(system, user, 6000);
  return {
    oneSentence: raw.oneSentence || '',
    bulletPoints: Array.isArray(raw.bulletPoints) ? raw.bulletPoints : [],
    detailed: raw.detailed || '',
    keyEvents: Array.isArray(raw.keyEvents) ? raw.keyEvents : [],
    themes: Array.isArray(raw.themes) ? raw.themes : [],
  };
}

// ============================================================
// 三、习题与试卷拆解（非小说类）
// ============================================================

export interface QuestionCard {
  id: string;             // 唯一 ID（AI 给出或本地生成）
  type: '单选' | '多选' | '填空' | '判断' | '简答' | '计算' | '应用题' | '其他';
  stem: string;           // 题干
  options?: string[];     // 选项（选择题有）
  answer: string;         // 答案
  analysis: string;       // 解析
  knowledgePoint?: string; // 知识点
  difficulty?: '简单' | '中等' | '困难';
  source?: string;        // 出处（章节/页码）
}

export interface ExerciseParseResult {
  totalCount: number;
  byType: Record<string, number>;
  cards: QuestionCard[];
  knowledgeMap: { point: string; count: number }[];
}

export async function parseExercises(text: string): Promise<ExerciseParseResult> {
  if (!text.trim()) throw new Error('请输入要拆解的试题文本');
  if (text.length < 200) throw new Error('文本内容过少，请至少输入 200 字');

  const system =
    '你是教育内容结构化专家，擅长把试卷/习题集拆解为独立可索引的题目卡片。严格 JSON 输出。';
  const user = `请对以下试题/试卷文本进行结构化拆解：

## 文本
${text}

## 输出要求（严格 JSON）
{
  "totalCount": 题目总数,
  "byType": {"单选": n, "多选": n, ...},  // 各题型数量统计
  "cards": [
    {
      "id": "Q001",  // 自动生成 ID Q001, Q002, ...
      "type": "单选/多选/填空/判断/简答/计算/应用题/其他",
      "stem": "题干完整内容",
      "options": ["A...", "B...", "C...", "D..."],  // 选择题才有
      "answer": "答案（简答/计算/应用题可给完整答案）",
      "analysis": "详细解析（为什么对/为什么错）",
      "knowledgePoint": "所属知识点",
      "difficulty": "简单/中等/困难",
      "source": "出处（章节或页码，如不可考可空）"
    }
  ],
  "knowledgeMap": [{"point": "知识点", "count": 题数}, ...]  // 按题数倒序
}

要求：
- 防漏防重，每道题独立卡片
- 题干去除题号前缀（如"1. " "(1)" 等）
- 选项保留完整（包括字母和内容）
- 解析中肯，针对性强

不要 markdown 代码块。`;

  const raw = await callDeepSeekJSON(system, user, 8000);
  const cards: QuestionCard[] = Array.isArray(raw.cards)
    ? raw.cards.map((c: any, i: number) => ({
        id: c.id || `Q${String(i + 1).padStart(3, '0')}`,
        type: c.type || '其他',
        stem: c.stem || '',
        options: Array.isArray(c.options) ? c.options : undefined,
        answer: c.answer || '',
        analysis: c.analysis || '',
        knowledgePoint: c.knowledgePoint,
        difficulty: c.difficulty,
        source: c.source,
      }))
    : [];

  return {
    totalCount: Number(raw.totalCount) || cards.length,
    byType: raw.byType || {},
    cards,
    knowledgeMap: Array.isArray(raw.knowledgeMap) ? raw.knowledgeMap : [],
  };
}
