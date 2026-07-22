/**
 * 出版级文学翻译服务（PRD 1）
 * 
 * 核心能力：
 *  1. 中英双核枢纽路由：所有非中英文互译强制经 zh/en 中转
 *  2. 出版级文学质量：语义精准 + 文学性 + 跨文化阅读体验
 *  3. 长文本分段落：超 3000 字自动分批次，相邻段保留 200 字上下文避免语义断裂
 *  4. 多种模式：双语对照（bilingual）/ 纯净译文（clean）
 *  5. 50+ 种语言支持
 */

import { LANG_BY_CODE, routeTranslation, type LanguageDef } from '@/data/languages';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

function getApiKey(): string {
  const userKey = localStorage.getItem('rewrite_api_key');
  return userKey || 'sk-3dc3dd5c193b4c8db608720257a79b60';
}

const MAX_TOTAL_CHARS = 200_000; // 单次翻译最长 20 万字
const CHUNK_SIZE = 3000;          // 每段 3000 字
const CONTEXT_OVERLAP = 200;      // 段间保留 200 字上下文

export type TranslationMode = 'clean' | 'bilingual';

export interface TranslationRequest {
  text: string;
  src: string;       // 'zh' | 'en' | ...
  tgt: string;
  mode: TranslationMode;
  /** 上下文延续（自动从上一段末尾带过来） */
  prevContext?: string;
  /** 进度回调：0-100 */
  onProgress?: (pct: number, msg: string) => void;
}

export interface TranslationResult {
  translatedText: string;     // 纯净译文（仅 target）
  bilingualVersion?: string;  // 双语对照版（原文+译文交替）
  route: ReturnType<typeof routeTranslation>;
  chunkCount: number;
  totalChars: number;
  mode: TranslationMode;
}

/**
 * 拆分长文本为 ~3000 字/段，按段落边界切割避免切碎句子
 */
function chunkText(text: string, size = CHUNK_SIZE): string[] {
  if (text.length <= size) return [text];
  const chunks: string[] = [];
  let i = 0;
  while (i < text.length) {
    let end = Math.min(i + size, text.length);
    if (end < text.length) {
      const tail = text.slice(i + Math.floor(size * 0.7), end);
      const m =
        tail.match(/\n\n[^]*$/) ||
        tail.match(/[。！？][^]*$/) ||
        tail.match(/[.!?]\s[^]*$/);
      if (m && m.index !== undefined) {
        end = i + Math.floor(size * 0.7) + m.index + 1;
      }
    }
    chunks.push(text.slice(i, end));
    i = end;
  }
  return chunks;
}

/** 单段翻译：调用 DeepSeek 一次 */
async function translateChunk(
  text: string,
  srcLang: LanguageDef,
  tgtLang: LanguageDef,
  prevContext: string,
  mode: TranslationMode,
  apiKey: string
): Promise<{ clean: string; bilingual: string }> {
  const system = buildSystemPrompt(srcLang, tgtLang, mode, prevContext);
  const userContent = `【原文段落 / Source】\n${text}\n\n${
    mode === 'bilingual'
      ? '【输出要求】严格按以下双语 JSON 格式输出：{"translation":"...译文...","bilingual":"原文段落1\\n译文段落1\\n\\n原文段落2\\n译文段落2\\n..."}【bilingual 中每对"原文+译文"用双换行分隔，整体长度与原文保持一致。】'
      : '【输出要求】只输出译文 JSON：{"translation":"...完整译文段落..."】'
  }`;

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
        { role: 'user', content: userContent },
      ],
      temperature: 0.4,
      max_tokens: 8192,
      response_format: { type: 'json_object' },
    }),
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.error?.message || `翻译API错误: ${resp.status}`);
  }

  const data = await resp.json();
  const content = data.choices?.[0]?.message?.content || '{}';

  let parsed: any;
  try {
    parsed = JSON.parse(content);
  } catch {
    // 退而求其次：去除 markdown 代码块后重试
    const cleaned = content.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
    parsed = JSON.parse(cleaned);
  }

  return {
    clean: parsed.translation || '',
    bilingual: parsed.bilingual || buildFallbackBilingual(text, parsed.translation || ''),
  };
}

/** 段落级双语对照回退（API没返回 bilingual 字段时） */
function buildFallbackBilingual(src: string, tgt: string): string {
  const srcParas = src.split(/\n\n+/);
  const tgtParas = tgt.split(/\n\n+/);
  const len = Math.max(srcParas.length, tgtParas.length);
  const out: string[] = [];
  for (let i = 0; i < len; i++) {
    if (srcParas[i]) out.push(`【原文】\n${srcParas[i].trim()}`);
    if (tgtParas[i]) out.push(`【译文】\n${tgtParas[i].trim()}`);
    out.push('');
  }
  return out.join('\n');
}

function buildSystemPrompt(
  src: LanguageDef,
  tgt: LanguageDef,
  mode: TranslationMode,
  prevContext: string
): string {
  const contextBlock = prevContext
    ? `\n\n【前文续接 / Prior Context】\n为保持叙事连贯，以下是紧邻本段的前文最后${prevContext.length}字及其译文（如果有）。请勿重复翻译，仅在指代消解/术语一致时参考：\n${prevContext}`
    : '';

  return `你是世界顶级文学翻译家，掌握50+种语言，曾获国际翻译大奖。本次任务：将以下${src.name}（${src.native}）小说段落翻译为${tgt.name}（${tgt.native}），目标出版级文学标准。${contextBlock}

## 一、源/目标语言
- 源语言：${src.promptHint}
- 目标语言：${tgt.promptHint}

## 二、翻译质量铁律（必须同时满足）
1. **语义与逻辑绝对精准**（零差错）
   - 逐字级深度理解，杜绝误译、漏译、增译
   - 长文本中人物动机、时间线、逻辑链高度一致
   - 专有名词/人名/地名跨段保持完全一致（建立术语表）
   - 数字、量词、时态、指代关系不能错

2. **文学性与艺术意境还原**
   - 精准捕捉作者叙事风格（文白、雅俗、张弛）
   - 重构情感张力、节奏、呼吸感
   - 成语/隐喻/典故采用"功能对等"策略，找到目标语中文化功能对等表达，不生硬直译
   - 保留原文的修辞美（对仗、押韵、双关、排比若有可尝试保留）
3. **跨文化阅读体验**（母语级）
   - 符合${tgt.name}母语者的表达习惯
   - 彻底消除"翻译腔"——避免"被……所""的"地"等明显外语结构堆砌
   - 中国文化概念（风水、修仙、江湖、官场、节气等）做恰当本土化处理：保留意境优先，必要时简注
   - 西方文化概念反向亦然

## 三、风格调性
- 体裁：网络小说/严肃文学视原文风格自适应
- 视角：保持原文叙事视角（第一人称/全知/限知）
- 对话：保留人物个性化语气词、方言特征（适度）
- 心理/独白：自然流畅，避免直译"我想""我觉得"等结构
## 四、特殊要求
- 段落结构与原文保持一致
- 保留原文所有标点符号的情感色彩（问号、感叹号、省略号）
- 不输出任何解释、注释、译者评论
- 不改变情节、不删减、不合并
- 只输出 JSON，不要 markdown 代码块
## 五、术语与上下文
- 第一次出现的人物/地名/功法/势力，译法在脑海中锁定，全文一致
- 段间衔接时回头照应前文术语表

现在开始翻译。`;
}

function LANGUAGES_count() {
  return '50+';
}

/**
 * 单跳翻译：src → tgt（直接翻译或 中英↔其他）
 */
async function singleHopTranslate(
  text: string,
  srcLang: LanguageDef,
  tgtLang: LanguageDef,
  route: ReturnType<typeof routeTranslation>,
  mode: TranslationMode,
  onProgress?: (pct: number, msg: string) => void
): Promise<TranslationResult> {
  const apiKey = getApiKey();
  const chunks = chunkText(text);
  const cleanParts: string[] = [];
  const bilingualParts: string[] = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const prev = i > 0 ? chunks[i - 1].slice(-CONTEXT_OVERLAP) : '';
    const prevTranslated = cleanParts[i - 1]?.slice(-CONTEXT_OVERLAP) || '';
    const prevContext = prev ? `原文末段：\n${prev}\n\n译文末段：\n${prevTranslated}` : '';

    onProgress?.(Math.floor((i / chunks.length) * 90), `正在翻译第 ${i + 1}/${chunks.length} 段（${chunk.length}字）`);

    const { clean, bilingual } = await translateChunk(chunk, srcLang, tgtLang, prevContext, mode, apiKey);
    cleanParts.push(clean);
    if (bilingual) bilingualParts.push(bilingual);
  }

  onProgress?.(100, '翻译完成');

  return {
    translatedText: cleanParts.join('\n\n'),
    bilingualVersion: bilingualParts.length > 0 ? bilingualParts.join('\n\n') : undefined,
    route,
    chunkCount: chunks.length,
    totalChars: text.length,
    mode,
  };
}

/**
 * 多跳翻译：src → hub → tgt（PRD 1.1 非中英文互译约束）
 * 分两阶段执行：先原文→枢纽，再枢纽→目标语
 */
async function multiHopTranslate(
  text: string,
  srcLang: LanguageDef,
  hubLang: LanguageDef,
  tgtLang: LanguageDef,
  route: ReturnType<typeof routeTranslation>,
  mode: TranslationMode,
  onProgress?: (pct: number, msg: string) => void
): Promise<TranslationResult> {
  const apiKey = getApiKey();
  const chunks = chunkText(text);
  const cleanParts: string[] = [];
  const bilingualParts: string[] = [];

  onProgress?.(0, `[阶段1/2] 将 ${srcLang.name} 译为 ${hubLang.name}（中转枢纽）…`);

  // === 阶段1：src → hub（始终 bilingual 模式以保留上下文对照） ===
  const hubClean: string[] = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const prevSrc = i > 0 ? chunks[i - 1].slice(-CONTEXT_OVERLAP) : '';
    const prevHub = i > 0 ? hubClean[i - 1]?.slice(-CONTEXT_OVERLAP) || '' : '';
    const prevContext = prevSrc ? `原文末段：\n${prevSrc}\n\n枢纽译文末段：\n${prevHub}` : '';

    const hop1 = await translateChunk(chunk, srcLang, hubLang, prevContext, 'bilingual', apiKey);
    hubClean.push(hop1.clean);

    onProgress?.(Math.floor((i / chunks.length) * 40), `[阶段1/2] 第 ${i + 1}/${chunks.length} 分段完成`);
  }

  onProgress?.(45, `[阶段2/2] 将 ${hubLang.name} 译为 ${tgtLang.name}（${mode === 'bilingual' ? '双语对照' : '纯净译文'}）…`);

  // === 阶段2：hub → tgt ===
  for (let i = 0; i < hubClean.length; i++) {
    const chunk = hubClean[i];
    const prevHub = i > 0 ? hubClean[i - 1]?.slice(-CONTEXT_OVERLAP) || '' : '';
    const prevTgt = i > 0 ? cleanParts[i - 1]?.slice(-CONTEXT_OVERLAP) || '' : '';
    const prevContext = prevHub ? `${hubLang.native}末段：\n${prevHub}\n\n${tgtLang.native}末段：\n${prevTgt}` : '';

    const hop2 = await translateChunk(chunk, hubLang, tgtLang, prevContext, mode, apiKey);
    cleanParts.push(hop2.clean);
    if (hop2.bilingual) bilingualParts.push(hop2.bilingual);

    onProgress?.(45 + Math.floor((i / hubClean.length) * 45), `[阶段2/2] 第 ${i + 1}/${hubClean.length} 分段完成`);
  }

  onProgress?.(100, '翻译完成（经枢纽中转两阶段）');

  return {
    translatedText: cleanParts.join('\n\n'),
    bilingualVersion: bilingualParts.length > 0 ? bilingualParts.join('\n\n') : undefined,
    route,
    chunkCount: chunks.length,
    totalChars: text.length,
    mode,
  };
}

/**
 * 主入口：出版级翻译（PRD 1）
 * 自动根据路由选择单跳或多跳翻译
 */
export async function translateLiterary(
  req: TranslationRequest
): Promise<TranslationResult> {
  const { text, src, tgt, mode, onProgress } = req;

  if (!text.trim()) throw new Error('原文不能为空');
  if (text.length > MAX_TOTAL_CHARS)
    throw new Error(`原文过长（${text.length}字），单次翻译上限 ${MAX_TOTAL_CHARS} 字`);

  const srcLang = LANG_BY_CODE[src];
  const tgtLang = LANG_BY_CODE[tgt];
  if (!srcLang || !tgtLang) throw new Error('不支持的源/目标语言');

  const route = routeTranslation(src, tgt);

  // 多跳路由：非中英文语言对 → 两阶段中转（PRD 1.1 强制约束）
  if (route.hops.length === 3) {
    const hubCode = route.hops[1];
    const hubLang = LANG_BY_CODE[hubCode];
    if (!hubLang) throw new Error(`无法确定中转枢纽（${hubCode}）`);
    return multiHopTranslate(text, srcLang, hubLang, tgtLang, route, mode, onProgress);
  }

  // 单跳：直接翻译（zh↔en, zh↔other, en↔other）
  return singleHopTranslate(text, srcLang, tgtLang, route, mode, onProgress);
}