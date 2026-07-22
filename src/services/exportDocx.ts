/**
 * DOCX 导出服务（纯 JS 写 .docx）
 *
 * 原理：.docx = ZIP 容器，里面装 OOXML XML
 *   [Content_Types].xml
 *   _rels/.rels
 *   word/document.xml   ← 正文
 *   word/styles.xml     ← 样式
 *   word/_rels/document.xml.rels
 *
 * 能力：标题/段落/列表/表格/简单富文本（粗体/斜体）
 */

import JSZip from 'jszip';

export type DocBlock =
  | { type: 'heading'; level: 1 | 2 | 3; text: string }
  | { type: 'paragraph'; text: string; align?: 'left' | 'center' | 'right' }
  | { type: 'list'; items: string[]; ordered?: boolean }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'quote'; text: string }
  | { type: 'separator' };

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** 简易富文本：将 **粗体** 和 *斜体* 标记转换为 OOXML run */
function richText(s: string): string {
  // 先转义
  let html = xmlEscape(s);
  // 粗体 **text**
  html = html.replace(/\*\*([^*]+)\*\*/g, '<w:r><w:rPr><w:b/></w:rPr><w:t xml:space="preserve">$1</w:t></w:r>');
  // 斜体 *text*
  html = html.replace(/(^|[^*])\*([^*]+)\*([^*]|$)/g, '$1<w:r><w:rPr><w:i/></w:rPr><w:t xml:space="preserve">$2</w:t></w:r>$3');
  return html;
}

function blockToXml(b: DocBlock): string {
  switch (b.type) {
    case 'heading': {
      const styleMap = { 1: 'Heading1', 2: 'Heading2', 3: 'Heading3' };
      return `<w:p><w:pPr><w:pStyle w:val="${styleMap[b.level]}"/></w:pPr><w:r><w:t xml:space="preserve">${xmlEscape(b.text)}</w:t></w:r></w:p>`;
    }
    case 'paragraph': {
      const align = b.align && b.align !== 'left' ? `<w:jc w:val="${b.align}"/>` : '';
      return `<w:p><w:pPr>${align}</w:pPr>${richText(b.text)}</w:p>`;
    }
    case 'list': {
      return b.items
        .map(
          (it) =>
            `<w:p><w:pPr><w:pStyle w:val="${b.ordered ? 'ListNumber' : 'ListBullet'}"/></w:pPr><w:r><w:t xml:space="preserve">${xmlEscape(it)}</w:t></w:r></w:p>`
        )
        .join('');
    }
    case 'table': {
      const headerRow = `<w:tr><w:trPr><w:tblHeader/></w:trPr>${b.headers
        .map((h) => `<w:tc><w:tcPr><w:tcW w:w="0" w:type="auto"/></w:tcPr><w:p><w:pPr><w:pStyle w:val="TableHeader"/></w:pPr><w:r><w:rPr><w:b/></w:rPr><w:t xml:space="preserve">${xmlEscape(h)}</w:t></w:r></w:p></w:tc>`)
        .join('')}</w:tr>`;
      const dataRows = b.rows
        .map(
          (r) =>
            `<w:tr>${r
              .map(
                (c) =>
                  `<w:tc><w:tcPr><w:tcW w:w="0" w:type="auto"/></w:tcPr><w:p>${richText(c)}</w:p></w:tc>`
              )
              .join('')}</w:tr>`
        )
        .join('');
      return `<w:tbl><w:tblPr><w:tblW w:w="0" w:type="auto"/><w:tblBorders><w:top w:val="single" w:sz="4" w:color="auto"/><w:left w:val="single" w:sz="4" w:color="auto"/><w:bottom w:val="single" w:sz="4" w:color="auto"/><w:right w:val="single" w:sz="4" w:color="auto"/><w:insideH w:val="single" w:sz="4" w:color="auto"/><w:insideV w:val="single" w:sz="4" w:color="auto"/></w:tblBorders></w:tblPr>${headerRow}${dataRows}</w:tbl>`;
    }
    case 'quote':
      return `<w:p><w:pPr><w:pStyle w:val="Quote"/></w:pPr><w:r><w:t xml:space="preserve">${xmlEscape(b.text)}</w:t></w:r></w:p>`;
    case 'separator':
      return '<w:p><w:pPr><w:pBdr><w:bottom w:val="single" w:sz="6" w:color="auto"/></w:pBdr></w:pPr></w:p>';
  }
}

const CONTENT_TYPES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>`;

const RELS_ROOT = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>`;

const RELS_DOC = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`;

const STYLES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:eastAsia="宋体" w:hAnsi="Calibri"/><w:sz w:val="22"/><w:szCs w:val="22"/><w:lang w:val="en-US" w:eastAsia="zh-CN"/></w:rPr></w:rPrDefault>
    <w:pPrDefault><w:pPr><w:spacing w:line="360" w:lineRule="auto"/></w:pPr></w:pPrDefault>
  </w:docDefaults>
  <w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style>
  <w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:pPr><w:spacing w:before="360" w:after="120"/></w:pPr><w:rPr><w:rFonts w:ascii="Calibri" w:eastAsia="黑体" w:hAnsi="Calibri"/><w:b/><w:sz w:val="32"/><w:szCs w:val="32"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:pPr><w:spacing w:before="240" w:after="100"/></w:pPr><w:rPr><w:rFonts w:ascii="Calibri" w:eastAsia="黑体" w:hAnsi="Calibri"/><w:b/><w:sz w:val="28"/><w:szCs w:val="28"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="Heading3"><w:name w:val="heading 3"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:pPr><w:spacing w:before="200" w:after="100"/></w:pPr><w:rPr><w:rFonts w:ascii="Calibri" w:eastAsia="黑体" w:hAnsi="Calibri"/><w:b/><w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="Quote"><w:name w:val="Quote"/><w:basedOn w:val="Normal"/><w:pPr><w:ind w:left="480"/><w:pBdr><w:left w:val="single" w:sz="12" w:color="888888"/></w:pBdr></w:pPr><w:rPr><w:i/><w:color w:val="555555"/></w:rPr></w:style>
  <w:style w:type="paragraph" w:styleId="ListBullet"><w:name w:val="List Bullet"/><w:basedOn w:val="Normal"/><w:pPr><w:ind w:left="420" w:hanging="240"/></w:pPr></w:style>
  <w:style w:type="paragraph" w:styleId="ListNumber"><w:name w:val="List Number"/><w:basedOn w:val="Normal"/><w:pPr><w:ind w:left="420" w:hanging="240"/></w:pPr></w:style>
  <w:style w:type="paragraph" w:styleId="TableHeader"><w:name w:val="Table Header"/><w:basedOn w:val="Normal"/><w:rPr><w:b/></w:rPr></w:style>
</w:styles>`;

function buildDocumentXml(blocks: DocBlock[]): string {
  const body = blocks.map(blockToXml).join('\n');
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <w:body>${body}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/></w:sectPr></w:body>
</w:document>`;
}

function buildCoreXml(title: string, author = '小说仿写工坊'): string {
  const now = new Date().toISOString();
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title>${xmlEscape(title)}</dc:title>
  <dc:creator>${xmlEscape(author)}</dc:creator>
  <cp:lastModifiedBy>${xmlEscape(author)}</cp:lastModifiedBy>
  <dcterms:created xsi:type="dcterms:W3CDTF">${now}</dcterms:created>
  <dcterms:modified xsi:type="dcterms:W3CDTF">${now}</dcterms:modified>
</cp:coreProperties>`;
}

const APP_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>Microsoft Office Word</Application>
  <AppVersion>16.0000</AppVersion>
</Properties>`;

/**
 * 主入口：blocks 数组 → .docx Blob
 */
export async function blocksToDocx(
  blocks: DocBlock[],
  title = '文档',
  author = '小说仿写工坊'
): Promise<Blob> {
  const zip = new JSZip();
  zip.file('[Content_Types].xml', CONTENT_TYPES);
  zip.folder('_rels')!.file('.rels', RELS_ROOT);
  zip.folder('word')!.file('document.xml', buildDocumentXml(blocks));
  zip.folder('word')!.file('styles.xml', STYLES);
  zip.folder('word/_rels')!.file('document.xml.rels', RELS_DOC);
  zip.folder('docProps')!.file('core.xml', buildCoreXml(title, author));
  zip.folder('docProps')!.file('app.xml', APP_XML);

  return await zip.generateAsync({
    type: 'blob',
    mimeType:
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });
}

// ================ 预设场景：拆书报告 / 翻译 / 仿写 / 习题 ================

import type { AnalysisResult } from './bookAnalysis';
import type { RewriteOutput } from './derivative';

/** 拆书分析报告 → docx */
export async function analysisToDocx(result: AnalysisResult, fileName = '拆书分析报告'): Promise<Blob> {
  const blocks: DocBlock[] = [
    { type: 'heading', level: 1, text: `${fileName}` },
    { type: 'paragraph', align: 'center', text: `生成时间：${new Date().toLocaleString('zh-CN')}` },
    { type: 'separator' },
  ];

  // 综合评分
  blocks.push({ type: 'heading', level: 2, text: '一、综合评分' });
  blocks.push({ type: 'paragraph', text: `综合评分：${result.score} / 100` });
  blocks.push({ type: 'paragraph', text: `市场潜力：${result.marketAnalysis.potentialScore} / 100` });
  blocks.push({ type: 'paragraph', text: `类型：${result.marketAnalysis.genre}` });
  blocks.push({ type: 'paragraph', text: `目标读者：${result.marketAnalysis.targetAudience}` });
  blocks.push({ type: 'paragraph', text: `竞争水平：${result.marketAnalysis.competitionLevel}` });

  // 结构
  blocks.push({ type: 'heading', level: 2, text: '二、核心结构与设定拆解' });
  if (result.outline) {
    blocks.push({ type: 'heading', level: 3, text: '2.1 全书大纲' });
    blocks.push({ type: 'paragraph', text: result.outline.mainPlot });
    if (result.outline.chapterOutlines.length > 0) {
      blocks.push({ type: 'heading', level: 3, text: '2.2 章节细纲' });
      blocks.push({
        type: 'table',
        headers: ['章节', '标题', '摘要', '关键事件'],
        rows: result.outline.chapterOutlines.map((c) => [
          `第${c.chapter}章`,
          c.title,
          c.summary,
          (c.keyEvents || []).join(' / '),
        ]),
      });
    }
  }
  if (result.worldBuilding) {
    blocks.push({ type: 'heading', level: 3, text: '2.3 世界观设定' });
    blocks.push({ type: 'paragraph', text: `背景架构：${result.worldBuilding.background}` });
    if (result.worldBuilding.factions.length > 0) {
      blocks.push({ type: 'paragraph', text: '势力分布：' });
      blocks.push({ type: 'list', items: result.worldBuilding.factions.map((f) => `${f.name}：${f.description}`) });
    }
    if (result.worldBuilding.magicSystem) {
      blocks.push({ type: 'paragraph', text: `体系设定：${result.worldBuilding.magicSystem}` });
    }
  }

  // 人物
  if (result.characters && result.characters.length > 0) {
    blocks.push({ type: 'heading', level: 2, text: '三、人物档案' });
    result.characters.forEach((c) => {
      const roleText = c.role === 'protagonist' ? '主角' : c.role === 'antagonist' ? '反派' : '配角';
      blocks.push({ type: 'heading', level: 3, text: `${c.name}（${roleText}）` });
      blocks.push({ type: 'paragraph', text: `性格：${c.personality}` });
      blocks.push({ type: 'paragraph', text: `背景：${c.background}` });
      blocks.push({ type: 'paragraph', text: `成长：${c.growth}` });
      if (c.relationships.length > 0) {
        blocks.push({ type: 'paragraph', text: `关系：${c.relationships.join('、')}` });
      }
    });
  }

  // 剧情
  if (result.plotAnalysis) {
    blocks.push({ type: 'heading', level: 2, text: '四、剧情节奏与结构分析' });
    blocks.push({ type: 'paragraph', text: `节奏感：${result.plotAnalysis.rhythm}` });
    if (result.plotAnalysis.turningPoints.length > 0) {
      blocks.push({ type: 'paragraph', text: '转折点：' });
      blocks.push({ type: 'list', items: result.plotAnalysis.turningPoints.map((t) => `第${t.chapter}章：${t.description}`) });
    }
    if (result.plotAnalysis.subplots.length > 0) {
      blocks.push({ type: 'paragraph', text: '支线：' });
      blocks.push({ type: 'list', items: result.plotAnalysis.subplots.map((s) => `${s.title}（${s.relationToMain}）`) });
    }
  }
  if (result.themeAnalysis) {
    blocks.push({ type: 'heading', level: 3, text: '4.1 主题与情感' });
    blocks.push({ type: 'paragraph', text: `核心主题：${result.themeAnalysis.coreThemes.join('、')}` });
    blocks.push({ type: 'paragraph', text: `情感脉络：${result.themeAnalysis.emotionalArc}` });
  }

  // 风格
  if (result.writingStyle) {
    blocks.push({ type: 'heading', level: 2, text: '五、写作风格与技巧解析' });
    blocks.push({ type: 'paragraph', text: `叙事视角：${result.writingStyle.perspective}` });
    blocks.push({ type: 'paragraph', text: `叙事节奏：${result.writingStyle.narrativeRhythm}` });
    if (result.writingStyle.techniques.length > 0) {
      blocks.push({ type: 'paragraph', text: '叙事技巧：' });
      blocks.push({ type: 'list', items: result.writingStyle.techniques });
    }
  }

  // 金句
  if (result.goldenQuotes && result.goldenQuotes.length > 0) {
    blocks.push({ type: 'heading', level: 2, text: '六、智能金句识别' });
    blocks.push({
      type: 'table',
      headers: ['金句', '情感', '修辞', '位置', '评分'],
      rows: result.goldenQuotes.map((q) => [q.text, q.emotionTag, q.rhetoricType, q.position, String(q.score)]),
    });
  }

  // 编辑意见
  blocks.push({ type: 'heading', level: 2, text: '七、综合编辑意见' });
  blocks.push({ type: 'paragraph', text: '亮点优势：' });
  blocks.push({ type: 'list', items: result.highlights });
  blocks.push({ type: 'paragraph', text: '待改进项：' });
  blocks.push({ type: 'list', items: result.issues });
  blocks.push({ type: 'paragraph', text: '优化建议：' });
  blocks.push({ type: 'list', items: result.suggestions });
  blocks.push({ type: 'separator' });
  blocks.push({ type: 'quote', text: result.editorAdvice });

  return blocksToDocx(blocks, fileName);
}

/** 仿写结果 → docx */
export async function rewriteToDocx(r: RewriteOutput): Promise<Blob> {
  const blocks: DocBlock[] = [
    { type: 'heading', level: 1, text: `《${r.title}》仿写框架` },
    { type: 'paragraph', align: 'center', text: `类型：${r.genre}` },
    { type: 'separator' },
    { type: 'heading', level: 2, text: '核心创意' },
    { type: 'paragraph', text: r.coreIdea },
    { type: 'heading', level: 2, text: '全书主线' },
    { type: 'paragraph', text: r.outline.mainPlot },
    { type: 'heading', level: 2, text: '章节细纲' },
    {
      type: 'table',
      headers: ['章节', '标题', '摘要', '关键事件'],
      rows: r.outline.chapterOutlines.map((c) => [
        `第${c.chapter}章`,
        c.title,
        c.summary,
        (c.keyEvents || []).join(' / '),
      ]),
    },
    { type: 'heading', level: 2, text: '人物设定' },
    ...r.characters.flatMap<DocBlock>((c) => [
      { type: 'heading', level: 3, text: `${c.name}（${c.role}）` } as DocBlock,
      { type: 'paragraph', text: `性格：${c.personality}` } as DocBlock,
      { type: 'paragraph', text: `背景：${c.background}` } as DocBlock,
    ]),
    { type: 'heading', level: 2, text: '世界观设定' },
    { type: 'paragraph', text: r.worldSetting.background },
    { type: 'list', items: r.worldSetting.keyElements },
    { type: 'heading', level: 2, text: '写作风格' },
    { type: 'paragraph', text: `叙事视角：${r.writingStyle.perspective}` },
    { type: 'list', items: r.writingStyle.techniques },
    { type: 'heading', level: 2, text: '市场建议' },
    { type: 'paragraph', text: r.marketAdvice },
  ];
  return blocksToDocx(blocks, `《${r.title}》仿写框架`);
}

/** 翻译结果 → docx */
export async function translationToDocx(
  translatedText: string,
  bilingualVersion: string | undefined,
  srcName: string,
  tgtName: string,
  routeNote: string
): Promise<Blob> {
  const blocks: DocBlock[] = [
    { type: 'heading', level: 1, text: `多语种翻译（${srcName} → ${tgtName}）` },
    { type: 'paragraph', align: 'center', text: `路由：${routeNote}` },
    { type: 'paragraph', align: 'center', text: `生成时间：${new Date().toLocaleString('zh-CN')}` },
    { type: 'separator' },
  ];
  if (bilingualVersion) {
    blocks.push({ type: 'heading', level: 2, text: '双语对照' });
    // 拆分 bilingual 为段落
    bilingualVersion.split(/\n\n+/).forEach((p) => {
      const trimmed = p.trim();
      if (!trimmed) return;
      if (trimmed.startsWith('【原文】')) {
        blocks.push({ type: 'paragraph', text: trimmed.replace(/^【原文】\n?/, '') });
      } else if (trimmed.startsWith('【译文】')) {
        blocks.push({ type: 'quote', text: trimmed.replace(/^【译文】\n?/, '') });
      } else {
        blocks.push({ type: 'paragraph', text: trimmed });
      }
    });
    blocks.push({ type: 'separator' });
  }
  blocks.push({ type: 'heading', level: 2, text: '纯净译文' });
  blocks.push({ type: 'paragraph', text: translatedText });
  return blocksToDocx(blocks, `翻译_${srcName}_to_${tgtName}`);
}
