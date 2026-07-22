import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import mammoth from 'mammoth';
import {
  analyzeBook,
  type AnalysisResult,
} from '@/services/bookAnalysis';
import {
  translateLiterary,
  type TranslationResult,
  type TranslationMode,
} from '@/services/translation';
import {
  generateRewrite,
  generateSummary,
  parseExercises,
  type RewriteOutput,
  type SummaryResult,
  type ExerciseParseResult,
} from '@/services/derivative';
import {
  analysisToDocx,
  rewriteToDocx,
  translationToDocx,
  blocksToDocx,
} from '@/services/exportDocx';
import { LANGUAGES, LANG_BY_CODE } from '@/data/languages';
import {
  BookOpen, FileText, Sparkles, Upload, BarChart3, Lightbulb,
  Target, TrendingUp, AlertCircle, CheckCircle2, Star,
  Layers, Users, Clock, Zap, Award, MessageSquare, X,
  Globe, PenTool, Download, Languages, Copy, ChevronDown, ChevronRight,
  User, Map, ScrollText, Palette, Quote, FileText as FileIcon,
  CheckSquare, GraduationCap
} from 'lucide-react';
import { useState, useRef } from 'react';
import { toast } from 'sonner';

export const Route = createFileRoute('/deconstruct')({
  component: DeconstructPage,
});

function DeconstructPage() {
  const [novelText, setNovelText] = useState('');
  const [fileName, setFileName] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState('');

  // 三大模块状态
  const [mainModule, setMainModule] = useState<'analysis' | 'creation' | 'translation'>('analysis');

  // 智能拆书子模块
  const [analysisSubTab, setAnalysisSubTab] = useState<'structure' | 'characters' | 'plot' | 'style' | 'quotes'>('structure');

  // 衍生创作子模块
  const [creationSubTab, setCreationSubTab] = useState<'rewrite' | 'summary' | 'exercise' | 'download'>('rewrite');

  // 翻译模块状态
  const [sourceLang, setSourceLang] = useState('zh');
  const [targetLang, setTargetLang] = useState('en');
  const [translateMode, setTranslateMode] = useState<TranslationMode>('bilingual');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translateProgress, setTranslateProgress] = useState(0);
  const [translateMsg, setTranslateMsg] = useState('');
  const [translations, setTranslations] = useState<Record<string, TranslationResult>>({});

  // 仿写输入状态
  const [newBookName, setNewBookName] = useState('');
  const [newGenre, setNewGenre] = useState('');
  const [newSynopsis, setNewSynopsis] = useState('');
  const [rewriteDepth, setRewriteDepth] = useState<'light' | 'standard' | 'deep'>('standard');
  const [isRewriting, setIsRewriting] = useState(false);
  const [rewriteResult, setRewriteResult] = useState<RewriteOutput | null>(null);

  // 摘要
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryResult, setSummaryResult] = useState<SummaryResult | null>(null);

  // 习题拆解
  const [exerciseText, setExerciseText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [exerciseResult, setExerciseResult] = useState<ExerciseParseResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileNameLower = file.name.toLowerCase();

    if (fileNameLower.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setNovelText(text);
        setFileName(file.name);
        toast.success(`已加载 ${file.name} (${text.length}字)`);
      };
      reader.onerror = () => toast.error('文件读取失败');
      reader.readAsText(file, 'UTF-8');
    } else if (fileNameLower.endsWith('.docx')) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const result = await mammoth.extractRawText({ arrayBuffer });
          const text = result.value;
          setNovelText(text);
          setFileName(file.name);
          toast.success(`已加载 ${file.name} (${text.length}字)`);
        } catch (error) {
          toast.error('DOCX文件解析失败');
        }
      };
      reader.onerror = () => toast.error('文件读取失败');
      reader.readAsArrayBuffer(file);
    } else {
      toast.error('仅支持TXT和DOCX格式文件');
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClearFile = () => {
    setNovelText('');
    setFileName('');
    setAnalysisResult(null);
    toast.success('已清空内容');
  };

  // ============ 智能拆书：真实调用 ============
  const handleAnalyze = async () => {
    if (!novelText.trim()) {
      toast.error('请先输入或粘贴小说文本');
      return;
    }
    if (novelText.length < 500) {
      toast.error('文本内容过少，请至少输入500字');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress('AI 正在深度拆解（结构/人物/剧情/风格/金句/综合）...');
    try {
      const result = await analyzeBook(novelText, (msg) => setAnalysisProgress(msg));
      setAnalysisResult(result);
      toast.success('AI分析完成！');
    } catch (error: any) {
      console.error(error);
      toast.error(`分析失败：${error?.message || error}`);
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress('');
    }
  };

  // ============ 多语种翻译：真实调用 ============
  const handleTranslate = async () => {
    if (!novelText.trim()) {
      toast.error('请先输入或上传小说文本');
      return;
    }
    if (sourceLang === targetLang) {
      toast.error('源语言与目标语言不能相同');
      return;
    }
    setIsTranslating(true);
    setTranslateProgress(0);
    setTranslateMsg('准备翻译...');
    try {
      const result = await translateLiterary({
        text: novelText,
        src: sourceLang,
        tgt: targetLang,
        mode: translateMode,
        onProgress: (pct, msg) => {
          setTranslateProgress(pct);
          setTranslateMsg(msg);
        },
      });
      setTranslations((prev) => ({ ...prev, [targetLang]: result }));
      toast.success(`翻译完成（${result.route.note}，共 ${result.chunkCount} 段）`);
    } catch (error: any) {
      console.error(error);
      toast.error(`翻译失败：${error?.message || error}`);
    } finally {
      setIsTranslating(false);
    }
  };

  // ============ 仿写重构：真实调用 ============
  const handleRewrite = async () => {
    if (!newBookName || !newGenre || !newSynopsis) {
      toast.error('请填写完整的仿写信息');
      return;
    }
    setIsRewriting(true);
    try {
      const result = await generateRewrite({
        newTitle: newBookName,
        genre: newGenre,
        synopsis: newSynopsis,
        sourceText: novelText.length > 200 ? novelText.slice(0, 15000) : undefined,
        depth: rewriteDepth,
      });
      setRewriteResult(result);
      toast.success('仿写框架生成完成！');
    } catch (error: any) {
      console.error(error);
      toast.error(`仿写失败：${error?.message || error}`);
    } finally {
      setIsRewriting(false);
    }
  };

  // ============ 内容摘要：真实调用 ============
  const handleSummary = async () => {
    if (!novelText.trim()) {
      toast.error('请先输入或粘贴小说文本');
      return;
    }
    if (novelText.length < 500) {
      toast.error('文本内容过少，请至少输入500字');
      return;
    }
    setIsSummarizing(true);
    try {
      const result = await generateSummary(novelText);
      setSummaryResult(result);
      toast.success('摘要生成完成！');
    } catch (error: any) {
      console.error(error);
      toast.error(`摘要失败：${error?.message || error}`);
    } finally {
      setIsSummarizing(false);
    }
  };

  // ============ 习题拆解：真实调用 ============
  const handleParseExercises = async () => {
    if (!exerciseText.trim()) {
      toast.error('请粘贴试题/试卷文本');
      return;
    }
    setIsParsing(true);
    try {
      const result = await parseExercises(exerciseText);
      setExerciseResult(result);
      toast.success(`拆解完成，共 ${result.totalCount} 道题`);
    } catch (error: any) {
      console.error(error);
      toast.error(`拆解失败：${error?.message || error}`);
    } finally {
      setIsParsing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('下载成功');
  };

  const downloadTXT = (content: string, filename: string) => {
    downloadBlob(new Blob([content], { type: 'text/plain;charset=utf-8' }), filename);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('已复制到剪贴板');
    } catch (error) {
      toast.error('复制失败');
    }
  };

  // ============ 导出：Word / JSON / TXT ============
  const exportAnalysisWord = async () => {
    if (!analysisResult) return toast.error('请先分析');
    try {
      const base = fileName.replace(/\.(txt|docx)$/i, '') || '拆书分析';
      const blob = await analysisToDocx(analysisResult, base);
      downloadBlob(blob, `${base}_分析报告.docx`);
    } catch (e: any) {
      toast.error(`导出失败：${e?.message || e}`);
    }
  };

  const exportRewriteWord = async () => {
    if (!rewriteResult) return toast.error('请先生成仿写');
    try {
      const blob = await rewriteToDocx(rewriteResult);
      downloadBlob(blob, `《${rewriteResult.title}》仿写框架.docx`);
    } catch (e: any) {
      toast.error(`导出失败：${e?.message || e}`);
    }
  };

  const exportRewriteTXT = () => {
    if (!rewriteResult) return toast.error('请先生成仿写');
    let txt = '《' + rewriteResult.title + '》仿写框架\n' + '==================================\n\n';
    txt += '【核心创意】\n' + rewriteResult.coreIdea + '\n\n';
    txt += '【全书主线】\n' + rewriteResult.outline.mainPlot + '\n\n';
    txt += '【章节细纲】\n';
    rewriteResult.outline.chapterOutlines.forEach(function(ch) {
      txt += '  第' + ch.chapter + '章 ' + ch.title + '\n  ' + ch.summary + '\n';
    });
    txt += '\n【人物设定】\n';
    rewriteResult.characters.forEach(function(ch) {
      txt += '  ' + ch.name + '（' + ch.role + '）\n  性格：' + ch.personality + ' · 背景：' + ch.background + '\n';
    });
    txt += '\n【世界观】\n' + rewriteResult.worldSetting.background + '\n';
    txt += '关键元素：' + rewriteResult.worldSetting.keyElements.join(' / ') + '\n';
    txt += '\n【写作风格】\n视角：' + rewriteResult.writingStyle.perspective + '\n技巧：' + rewriteResult.writingStyle.techniques.join(' / ') + '\n';
    txt += '\n【市场建议】\n' + rewriteResult.marketAdvice + '\n';
    downloadTXT(txt, '《' + rewriteResult.title + '》仿写框架.txt');
  };


  const exportTranslationWord = async (mode: 'bilingual' | 'clean') => {
    const t = translations[targetLang];
    if (!t) return toast.error('请先翻译');
    try {
      const src = LANG_BY_CODE[sourceLang];
      const tgt = LANG_BY_CODE[targetLang];
      const blob = await translationToDocx(
        t.translatedText,
        mode === 'bilingual' ? t.bilingualVersion : undefined,
        src?.name || sourceLang,
        tgt?.name || targetLang,
        t.route.note
      );
      downloadBlob(blob, `翻译_${src?.name || sourceLang}_to_${tgt?.name || targetLang}.docx`);
    } catch (e: any) {
      toast.error(`导出失败：${e?.message || e}`);
    }
  };

  const exportExercisesWord = async () => {
    if (!exerciseResult) return toast.error('请先拆解');
    try {
      const blocks: Parameters<typeof blocksToDocx>[0] = [
        { type: 'heading', level: 1, text: '习题拆解结果' },
        { type: 'paragraph', align: 'center', text: `共 ${exerciseResult.totalCount} 题 · 生成时间 ${new Date().toLocaleString('zh-CN')}` },
        { type: 'separator' },
        { type: 'heading', level: 2, text: '知识点分布' },
        {
          type: 'table',
          headers: ['知识点', '题数'],
          rows: exerciseResult.knowledgeMap.map((k) => [k.point, String(k.count)]),
        },
        { type: 'heading', level: 2, text: '题目卡片' },
        ...exerciseResult.cards.flatMap<Parameters<typeof blocksToDocx>[0][number]>((c) => [
          { type: 'heading', level: 3, text: `[${c.id}] ${c.type}${c.difficulty ? ` · ${c.difficulty}` : ''}` },
          { type: 'paragraph', text: `题干：${c.stem}` },
          ...(c.options ? [{ type: 'list' as const, items: c.options }] : []),
          { type: 'paragraph', text: `答案：${c.answer}` },
          { type: 'paragraph', text: `解析：${c.analysis}` },
          ...(c.knowledgePoint ? [{ type: 'paragraph' as const, text: `知识点：${c.knowledgePoint}` }] : []),
          { type: 'separator' },
        ]),
      ];
      const blob = await blocksToDocx(blocks, '习题拆解');
      downloadBlob(blob, '习题拆解.docx');
    } catch (e: any) {
      toast.error(`导出失败：${e?.message || e}`);
    }
  };

  const exportExerciseTXT = () => {
    if (!exerciseResult) return toast.error('请先拆解');
    let txt = '习题拆解结果（共 ' + exerciseResult.totalCount + ' 题）\n====================\n\n';
    txt += '【知识点分布】\n' + exerciseResult.knowledgeMap.map(function(k) { return '  ' + k.point + '：' + k.count + '题'; }).join('\n') + '\n\n';
    txt += '【题目卡片】\n--------------------------------------------\n';
    exerciseResult.cards.forEach(function(card) {
      txt += '[' + card.id + '] ' + card.type + (card.difficulty ? ' · ' + card.difficulty : '') + '\n';
      txt += '题干：' + card.stem + '\n';
      if (card.options) card.options.forEach(function(o, i) { txt += '  ' + String.fromCharCode(65+i) + '. ' + o + '\n'; });
      txt += '答案：' + card.answer + '\n  解析：' + card.analysis + '\n';
      if (card.knowledgePoint) txt += '  知识点：' + card.knowledgePoint + '\n';
      txt += '\n';
    });
    downloadTXT(txt, '习题拆解.txt');
  };


  const exportSummaryWord = async () => {
    if (!summaryResult) return toast.error('请先生成摘要');
    try {
      const blocks: Parameters<typeof blocksToDocx>[0] = [
        { type: 'heading', level: 1, text: '内容摘要' },
        { type: 'heading', level: 2, text: '一句话核心' },
        { type: 'quote', text: summaryResult.oneSentence },
        { type: 'heading', level: 2, text: '要点清单' },
        { type: 'list', items: summaryResult.bulletPoints },
        { type: 'heading', level: 2, text: '详细摘要' },
        { type: 'paragraph', text: summaryResult.detailed },
        { type: 'heading', level: 2, text: '关键事件' },
        {
          type: 'table',
          headers: ['事件', '影响'],
          rows: summaryResult.keyEvents.map((k) => [k.event, k.impact]),
        },
        { type: 'heading', level: 2, text: '核心主题' },
        { type: 'list', items: summaryResult.themes },
      ];
      const blob = await blocksToDocx(blocks, '内容摘要');
      downloadBlob(blob, '内容摘要.docx');
    } catch (e: any) {
      toast.error(`导出失败：${e?.message || e}`);
    }
  };

  const exportSummaryTXT = () => {
    if (!summaryResult) return toast.error('请先生成摘要');
    let txt = '内容摘要\n====================\n\n';
    txt += '【一句话核心】\n' + summaryResult.oneSentence + '\n\n';
    txt += '【要点清单】\n' + summaryResult.bulletPoints.map(function(b, i) { return (i+1) + '. ' + b; }).join('\n') + '\n\n';
    txt += '【详细摘要】\n' + summaryResult.detailed + '\n\n';
    txt += '【关键事件】\n' + summaryResult.keyEvents.map(function(k) { return '· ' + k.event + ' → ' + k.impact; }).join('\n') + '\n\n';
    txt += '【核心主题】\n' + summaryResult.themes.join(' / ') + '\n';
    downloadTXT(txt, '内容摘要.txt');
  };


  const t = translations[targetLang];

  return (
    <div className="min-h-screen pb-16">
      <section className="pt-16 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center animate-fade-in-up">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 tracking-tight flex items-center justify-center gap-3">
            <BookOpen className="w-8 h-8 text-primary" />
            智能拆书分析
          </h1>
          <p className="text-lg text-muted-foreground">
            AI深度解析小说结构，多语种出版级翻译，衍生创作与习题拆解，全链路真实可用
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* 文件上传区域 */}
        <Card className="shadow-elegant rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              上传或粘贴小说文本
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3 flex-wrap">
              <input ref={fileInputRef} type="file" accept=".txt,.docx" onChange={handleFileUpload} className="hidden" />
              <Button variant="outline" className="gap-2" onClick={() => fileInputRef.current?.click()}>
                <Upload className="w-4 h-4" />上传TXT文件
              </Button>
              <Button variant="outline" className="gap-2" onClick={() => fileInputRef.current?.click()}>
                <FileText className="w-4 h-4" />上传DOCX文件
              </Button>
              {fileName && (
                <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1">
                  <span className="truncate max-w-[200px]">{fileName}</span>
                  <button onClick={handleClearFile} className="hover:text-destructive transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
            </div>
            <Textarea
              placeholder="在此粘贴需要分析的小说文本（建议至少500字，最多10万字）..."
              className="min-h-[300px] resize-none"
              value={novelText}
              onChange={(e) => setNovelText(e.target.value)}
            />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">已输入 {novelText.length} 字</span>
              <Button onClick={handleAnalyze} disabled={isAnalyzing || novelText.length < 500} className="gap-2">
                {isAnalyzing ? (<><Sparkles className="w-4 h-4 animate-spin" />分析中...</>) : (<><Sparkles className="w-4 h-4" />开始智能分析</>)}
              </Button>
            </div>
            {isAnalyzing && analysisProgress && (
              <div className="space-y-1">
                <Progress value={90} />
                <p className="text-xs text-muted-foreground text-center">{analysisProgress}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 分析报告区域 */}
        {analysisResult && (
          <Card className="shadow-elegant rounded-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  分析报告
                </CardTitle>
                <Badge variant="secondary" className="text-lg px-4 py-1">
                  综合评分: <span className={`font-bold ${getScoreColor(analysisResult.score)}`}>{analysisResult.score}</span> / 100
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {/* 第一层：三大核心模块 */}
              <Tabs value={mainModule} onValueChange={(v) => setMainModule(v as any)} className="w-full">
                <TabsList className="grid w-full grid-cols-3 rounded-xl bg-secondary p-1 mb-6">
                  <TabsTrigger value="analysis" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <Layers className="w-4 h-4 mr-2" />智能拆书
                  </TabsTrigger>
                  <TabsTrigger value="creation" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <PenTool className="w-4 h-4 mr-2" />衍生创作
                  </TabsTrigger>
                  <TabsTrigger value="translation" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <Globe className="w-4 h-4 mr-2" />多语种翻译
                  </TabsTrigger>
                </TabsList>

                {/* 智能拆书模块 */}
                <TabsContent value="analysis" className="space-y-6">
                  <Tabs value={analysisSubTab} onValueChange={(v) => setAnalysisSubTab(v as any)} className="w-full">
                    <TabsList className="grid w-full grid-cols-5 rounded-xl bg-muted p-1 mb-4">
                      <TabsTrigger value="structure" className="rounded-lg text-xs">
                        <ScrollText className="w-3 h-3 mr-1" />结构拆解
                      </TabsTrigger>
                      <TabsTrigger value="characters" className="rounded-lg text-xs">
                        <User className="w-3 h-3 mr-1" />人物档案
                      </TabsTrigger>
                      <TabsTrigger value="plot" className="rounded-lg text-xs">
                        <TrendingUp className="w-3 h-3 mr-1" />剧情分析
                      </TabsTrigger>
                      <TabsTrigger value="style" className="rounded-lg text-xs">
                        <Palette className="w-3 h-3 mr-1" />写作风格
                      </TabsTrigger>
                      <TabsTrigger value="quotes" className="rounded-lg text-xs">
                        <Quote className="w-3 h-3 mr-1" />金句识别
                      </TabsTrigger>
                    </TabsList>

                    {/* 结构拆解 */}
                    <TabsContent value="structure" className="space-y-4">
                      <Card>
                        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Map className="w-4 h-4 text-primary" />全书大纲</CardTitle></CardHeader>
                        <CardContent>
                          <p className="text-sm mb-4">{analysisResult.outline?.mainPlot || '暂无大纲数据'}</p>
                          {analysisResult.outline?.chapterOutlines && analysisResult.outline.chapterOutlines.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="text-sm font-semibold">章节细纲：</h4>
                              {analysisResult.outline.chapterOutlines.map((ch) => (
                                <div key={ch.chapter} className="border-l-2 border-primary pl-3 py-1">
                                  <p className="text-sm font-medium">第{ch.chapter}章：{ch.title}</p>
                                  <p className="text-xs text-muted-foreground mt-1">{ch.summary}</p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {ch.keyEvents.map((event, i) => (
                                      <Badge key={i} variant="outline" className="text-xs">{event}</Badge>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Map className="w-4 h-4 text-primary" />世界观设定</CardTitle></CardHeader>
                        <CardContent className="space-y-3">
                          <div>
                            <h4 className="text-sm font-semibold mb-1">背景架构</h4>
                            <p className="text-sm text-muted-foreground">{analysisResult.worldBuilding?.background || '暂无数据'}</p>
                          </div>
                          {analysisResult.worldBuilding?.factions && analysisResult.worldBuilding.factions.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold mb-2">势力分布</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {analysisResult.worldBuilding.factions.map((faction, i) => (
                                  <div key={i} className="border rounded-lg p-3">
                                    <p className="text-sm font-medium">{faction.name}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{faction.description}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {analysisResult.worldBuilding?.magicSystem && (
                            <div>
                              <h4 className="text-sm font-semibold mb-1">体系设定</h4>
                              <p className="text-sm text-muted-foreground">{analysisResult.worldBuilding.magicSystem}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* 人物档案 */}
                    <TabsContent value="characters" className="space-y-4">
                      {analysisResult.characters && analysisResult.characters.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {analysisResult.characters.map((char, i) => (
                            <Card key={i} className="border-l-4 border-l-primary">
                              <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                  <CardTitle className="text-base">{char.name}</CardTitle>
                                  <Badge variant={char.role === 'protagonist' ? 'default' : char.role === 'antagonist' ? 'destructive' : 'secondary'}>
                                    {char.role === 'protagonist' ? '主角' : char.role === 'antagonist' ? '反派' : '配角'}
                                  </Badge>
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-2 text-sm">
                                <div><span className="font-medium">性格：</span>{char.personality}</div>
                                <div><span className="font-medium">背景：</span>{char.background}</div>
                                <div><span className="font-medium">成长：</span>{char.growth}</div>
                                <div>
                                  <span className="font-medium">关系：</span>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {char.relationships.map((rel, j) => (
                                      <Badge key={j} variant="outline" className="text-xs">{rel}</Badge>
                                    ))}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <Card><CardContent className="py-8 text-center text-muted-foreground">暂无人物数据，请重新分析</CardContent></Card>
                      )}
                    </TabsContent>

                    {/* 剧情分析 */}
                    <TabsContent value="plot" className="space-y-4">
                      <Card>
                        <CardHeader><CardTitle className="text-base">剧情节奏</CardTitle></CardHeader>
                        <CardContent><p className="text-sm">{analysisResult.plotAnalysis?.rhythm || '暂无数据'}</p></CardContent>
                      </Card>
                      {analysisResult.plotAnalysis?.turningPoints && analysisResult.plotAnalysis.turningPoints.length > 0 && (
                        <Card>
                          <CardHeader><CardTitle className="text-base">转折点</CardTitle></CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {analysisResult.plotAnalysis.turningPoints.map((tp, i) => (
                                <div key={i} className="flex items-start gap-2">
                                  <Badge variant="secondary">第{tp.chapter}章</Badge>
                                  <p className="text-sm flex-1">{tp.description}</p>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                      {analysisResult.plotAnalysis?.subplots && analysisResult.plotAnalysis.subplots.length > 0 && (
                        <Card>
                          <CardHeader><CardTitle className="text-base">支线</CardTitle></CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {analysisResult.plotAnalysis.subplots.map((sp, i) => (
                                <div key={i} className="flex items-start gap-2">
                                  <Badge variant="outline">{sp.title}</Badge>
                                  <p className="text-sm flex-1">{sp.relationToMain}</p>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                      {analysisResult.themeAnalysis && (
                        <Card>
                          <CardHeader><CardTitle className="text-base">主题与情感</CardTitle></CardHeader>
                          <CardContent className="space-y-2">
                            <div>
                              <h4 className="text-sm font-semibold mb-1">核心主题</h4>
                              <div className="flex flex-wrap gap-1">
                                {analysisResult.themeAnalysis.coreThemes.map((theme, i) => (
                                  <Badge key={i} variant="outline">{theme}</Badge>
                                ))}
                              </div>
                            </div>
                            <div><span className="text-sm font-semibold">情感脉络：</span><p className="text-sm text-muted-foreground mt-1">{analysisResult.themeAnalysis.emotionalArc}</p></div>
                          </CardContent>
                        </Card>
                      )}
                    </TabsContent>

                    {/* 写作风格 */}
                    <TabsContent value="style" className="space-y-4">
                      <Card>
                        <CardHeader><CardTitle className="text-base">叙事视角</CardTitle></CardHeader>
                        <CardContent><p className="text-sm">{analysisResult.writingStyle?.perspective || '暂无数据'}</p></CardContent>
                      </Card>
                      <Card>
                        <CardHeader><CardTitle className="text-base">叙事节奏</CardTitle></CardHeader>
                        <CardContent><p className="text-sm">{analysisResult.writingStyle?.narrativeRhythm || '暂无数据'}</p></CardContent>
                      </Card>
                      {analysisResult.writingStyle?.techniques && analysisResult.writingStyle.techniques.length > 0 && (
                        <Card>
                          <CardHeader><CardTitle className="text-base">叙事技巧</CardTitle></CardHeader>
                          <CardContent>
                            <div className="flex flex-wrap gap-2">
                              {analysisResult.writingStyle.techniques.map((tech, i) => (
                                <Badge key={i} variant="secondary" className="px-3 py-1">{tech}</Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </TabsContent>

                    {/* 金句识别 */}
                    <TabsContent value="quotes" className="space-y-4">
                      {analysisResult.goldenQuotes && analysisResult.goldenQuotes.length > 0 ? (
                        <div className="space-y-3">
                          {analysisResult.goldenQuotes.map((quote, i) => (
                            <Card key={i} className="border-l-4 border-l-yellow-400">
                              <CardContent className="pt-4">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex-1">
                                    <p className="text-sm italic mb-2">"{quote.text}"</p>
                                    <div className="flex flex-wrap gap-2 text-xs">
                                      <Badge variant="outline">{quote.emotionTag}</Badge>
                                      <Badge variant="outline">{quote.rhetoricType}</Badge>
                                      <span className="text-muted-foreground">{quote.position}</span>
                                      <span className="text-yellow-600 font-semibold">评分: {quote.score}</span>
                                    </div>
                                  </div>
                                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(quote.text)}>
                                    <Copy className="w-4 h-4" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <Card><CardContent className="py-8 text-center text-muted-foreground">暂无金句数据</CardContent></Card>
                      )}
                    </TabsContent>
                  </Tabs>
                </TabsContent>

                {/* 衍生创作模块 */}
                <TabsContent value="creation" className="space-y-6">
                  <Tabs value={creationSubTab} onValueChange={(v) => setCreationSubTab(v as any)} className="w-full">
                    <TabsList className="grid w-full grid-cols-4 rounded-xl bg-muted p-1 mb-4">
                      <TabsTrigger value="rewrite" className="rounded-lg text-xs">
                        <PenTool className="w-3 h-3 mr-1" />仿写重构
                      </TabsTrigger>
                      <TabsTrigger value="summary" className="rounded-lg text-xs">
                        <ScrollText className="w-3 h-3 mr-1" />内容摘要
                      </TabsTrigger>
                      <TabsTrigger value="exercise" className="rounded-lg text-xs">
                        <CheckSquare className="w-3 h-3 mr-1" />习题拆解
                      </TabsTrigger>
                      <TabsTrigger value="download" className="rounded-lg text-xs">
                        <Download className="w-3 h-3 mr-1" />下载导出
                      </TabsTrigger>
                    </TabsList>

                    {/* 仿写重构 */}
                    <TabsContent value="rewrite" className="space-y-4">
                      <Card>
                        <CardHeader><CardTitle className="text-base">新书设定</CardTitle></CardHeader>
                        <CardContent className="space-y-3">
                          <Input placeholder="新书名" value={newBookName} onChange={(e) => setNewBookName(e.target.value)} />
                          <Input placeholder="流派（如：都市修仙、玄幻、言情等）" value={newGenre} onChange={(e) => setNewGenre(e.target.value)} />
                          <Textarea placeholder="核心梗概（简要描述故事主线）" value={newSynopsis} onChange={(e) => setNewSynopsis(e.target.value)} className="min-h-[100px]" />
                          <div>
                            <label className="text-sm font-medium mb-2 block">仿写深度</label>
                            <Select value={rewriteDepth} onValueChange={(v) => setRewriteDepth(v as any)}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="light">轻量（仅借鉴设定）</SelectItem>
                                <SelectItem value="standard">标准（结构+风格）</SelectItem>
                                <SelectItem value="deep">深度（风格迁移）</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button onClick={handleRewrite} disabled={!newBookName || !newGenre || !newSynopsis || isRewriting} className="w-full gap-2">
                            {isRewriting ? (<><Sparkles className="w-4 h-4 animate-spin" />生成中...</>) : (<><Sparkles className="w-4 h-4" />生成仿写框架</>)}
                          </Button>
                        </CardContent>
                      </Card>
                      {rewriteResult && (
                        <Card>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-base">《{rewriteResult.title}》仿写框架</CardTitle>
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(rewriteResult.coreIdea)}><Copy className="w-4 h-4" /></Button>
                                <Button variant="outline" size="sm" onClick={exportRewriteTXT}><Download className="w-4 h-4" />TXT</Button>
                                <Button variant="outline" size="sm" onClick={exportRewriteWord}><FileIcon className="w-4 h-4" />Word</Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4 text-sm">
                            <div>
                              <h4 className="font-semibold">核心创意</h4>
                              <p className="text-muted-foreground mt-1">{rewriteResult.coreIdea}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold">全书主线</h4>
                              <p className="text-muted-foreground mt-1">{rewriteResult.outline.mainPlot}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold">章节细纲</h4>
                              <div className="space-y-1 mt-1">
                                {rewriteResult.outline.chapterOutlines.map((c) => (
                                  <div key={c.chapter} className="border-l-2 border-primary pl-3 py-1">
                                    <p className="font-medium">第{c.chapter}章：{c.title}</p>
                                    <p className="text-xs text-muted-foreground">{c.summary}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold">人物设定</h4>
                              {rewriteResult.characters.map((c, i) => (
                                <div key={i} className="mt-1">
                                  <p className="font-medium">{c.name}（{c.role}）</p>
                                  <p className="text-xs text-muted-foreground">性格：{c.personality} · 背景：{c.background}</p>
                                </div>
                              ))}
                            </div>
                            <div>
                              <h4 className="font-semibold">世界观</h4>
                              <p className="text-muted-foreground mt-1">{rewriteResult.worldSetting.background}</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {rewriteResult.worldSetting.keyElements.map((e, i) => <Badge key={i} variant="outline" className="text-xs">{e}</Badge>)}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold">写作风格</h4>
                              <p className="text-muted-foreground mt-1">视角：{rewriteResult.writingStyle.perspective}</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {rewriteResult.writingStyle.techniques.map((t, i) => <Badge key={i} variant="secondary" className="text-xs">{t}</Badge>)}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold">市场建议</h4>
                              <p className="text-muted-foreground mt-1">{rewriteResult.marketAdvice}</p>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </TabsContent>

                    {/* 内容摘要 */}
                    <TabsContent value="summary" className="space-y-4">
                      <Card>
                        <CardHeader><CardTitle className="text-base">生成摘要</CardTitle></CardHeader>
                        <CardContent>
                          <Button onClick={handleSummary} disabled={isSummarizing} className="w-full gap-2">
                            {isSummarizing ? (<><Sparkles className="w-4 h-4 animate-spin" />生成中...</>) : (<><Sparkles className="w-4 h-4" />生成三种粒度摘要</>)}
                          </Button>
                        </CardContent>
                      </Card>
                      {summaryResult && (
                        <div className="space-y-4">
                          <Card>
                            <CardHeader><CardTitle className="text-base">一句话摘要</CardTitle></CardHeader>
                            <CardContent><p className="text-sm italic">{summaryResult.oneSentence}</p></CardContent>
                          </Card>
                          <Card>
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-base">要点清单</CardTitle>
                                <Button variant="outline" size="sm" onClick={exportSummaryWord}><FileIcon className="w-4 h-4" />Word</Button>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-1">
                                {summaryResult.bulletPoints.map((point, i) => (
                                  <li key={i} className="text-sm flex items-start gap-2">
                                    <span className="text-primary">•</span>
                                    <span>{point}</span>
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardHeader><CardTitle className="text-base">详细摘要</CardTitle></CardHeader>
                            <CardContent><p className="text-sm leading-relaxed">{summaryResult.detailed}</p></CardContent>
                          </Card>
                          {summaryResult.keyEvents.length > 0 && (
                            <Card>
                              <CardHeader><CardTitle className="text-base">关键事件</CardTitle></CardHeader>
                              <CardContent>
                                <div className="space-y-2">
                                  {summaryResult.keyEvents.map((k, i) => (
                                    <div key={i} className="border-l-2 border-primary pl-3">
                                      <p className="text-sm font-medium">{k.event}</p>
                                      <p className="text-xs text-muted-foreground">{k.impact}</p>
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </div>
                      )}
                    
                      {summaryResult && (
                        <Card>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-base">内容摘要</CardTitle>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={exportSummaryTXT}><Download className="w-4 h-4" />TXT</Button>
                                <Button variant="outline" size="sm" onClick={exportSummaryWord}><FileIcon className="w-4 h-4" />Word</Button>
                              </div>
                            </div>
                          </CardHeader>
                        </Card>
                      )}
</TabsContent>

                    {/* 习题拆解 */}
                    <TabsContent value="exercise" className="space-y-4">
                      <Card>
                        <CardHeader><CardTitle className="text-base flex items-center gap-2"><GraduationCap className="w-4 h-4 text-primary" />粘贴试题/试卷</CardTitle></CardHeader>
                        <CardContent className="space-y-3">
                          <Textarea
                            placeholder="在此粘贴试题文本（支持单选/多选/填空/判断/简答/计算/应用题），系统将自动拆解为独立卡片..."
                            className="min-h-[200px]"
                            value={exerciseText}
                            onChange={(e) => setExerciseText(e.target.value)}
                          />
                          <Button onClick={handleParseExercises} disabled={!exerciseText.trim() || isParsing} className="w-full gap-2">
                            {isParsing ? (<><Sparkles className="w-4 h-4 animate-spin" />拆解中...</>) : (<><CheckSquare className="w-4 h-4" />开始拆解为卡片</>)}
                          </Button>
                        </CardContent>
                      </Card>
                      {exerciseResult && (
                        <div className="space-y-4">
                          <Card>
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-base">拆解结果（共 {exerciseResult.totalCount} 题）</CardTitle>
                                <Button variant="outline" size="sm" onClick={exportExercisesWord}><FileIcon className="w-4 h-4" />导出Word</Button>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="flex flex-wrap gap-2 mb-3">
                                {Object.entries(exerciseResult.byType).map(([k, v]) => (
                                  <Badge key={k} variant="secondary">{k}：{v}</Badge>
                                ))}
                              </div>
                              {exerciseResult.knowledgeMap.length > 0 && (
                                <div className="mb-3">
                                  <h4 className="text-sm font-semibold mb-1">知识点分布</h4>
                                  <div className="flex flex-wrap gap-1">
                                    {exerciseResult.knowledgeMap.map((k, i) => (
                                      <Badge key={i} variant="outline" className="text-xs">{k.point}（{k.count}）</Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                          {exerciseResult.cards.map((c) => (
                            <Card key={c.id} className="border-l-4 border-l-blue-400">
                              <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                  <CardTitle className="text-base text-sm">{c.id} · {c.type}{c.difficulty ? ` · ${c.difficulty}` : ''}</CardTitle>
                                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(`题干：${c.stem}\n答案：${c.answer}`)}><Copy className="w-4 h-4" /></Button>
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-2 text-sm">
                                <div><span className="font-medium">题干：</span>{c.stem}</div>
                                {c.options && c.options.length > 0 && (
                                  <ul className="ml-4 list-disc">
                                    {c.options.map((o, j) => (<li key={j}>{o}</li>))}
                                  </ul>
                                )}
                                <div><span className="font-medium">答案：</span><span className="text-green-600">{c.answer}</span></div>
                                <div><span className="font-medium">解析：</span>{c.analysis}</div>
                                {c.knowledgePoint && <div><span className="font-medium">知识点：</span><span className="text-primary">{c.knowledgePoint}</span></div>}
                                {c.source && <div className="text-xs text-muted-foreground">出处：{c.source}</div>}
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    
                      {exerciseResult && (
                        <Card>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-base">习题拆解（{exerciseResult.totalCount} 题）</CardTitle>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={exportExerciseTXT}><Download className="w-4 h-4" />TXT</Button>
                                <Button variant="outline" size="sm" onClick={exportExercisesWord}><FileIcon className="w-4 h-4" />Word</Button>
                              </div>
                            </div>
                          </CardHeader>
                        </Card>
                      )}
</TabsContent>

                    {/* 下载导出 */}
                    <TabsContent value="download" className="space-y-4">
                      <Card>
                        <CardHeader><CardTitle className="text-base">导出分析报告</CardTitle></CardHeader>
                        <CardContent className="space-y-3">
                          <p className="text-sm text-muted-foreground">将当前分析结果导出为本地文件，支持 JSON / TXT / Word（.docx）</p>
                          <div className="flex flex-wrap gap-3">
                            <Button variant="outline" onClick={() => {
                              const content = JSON.stringify(analysisResult, null, 2);
                              downloadTXT(content, '分析报告.json');
                            }} className="gap-2">
                              <Download className="w-4 h-4" />导出JSON
                            </Button>
                            <Button variant="outline" onClick={() => {
                              let content = `=== 智能拆书分析报告 ===\n\n综合评分: ${analysisResult.score}/100\n\n`;
                              content += `【结构分析】\n开篇: ${analysisResult.structure.opening}\n冲突: ${analysisResult.structure.conflict}\n高潮: ${analysisResult.structure.climax}\n结局: ${analysisResult.structure.resolution}\n\n`;
                              content += `【亮点优势】\n${analysisResult.highlights.map(h => `- ${h}`).join('\n')}\n\n`;
                              content += `【待改进项】\n${analysisResult.issues.map(i => `- ${i}`).join('\n')}\n\n`;
                              content += `【优化建议】\n${analysisResult.suggestions.map(s => `- ${s}`).join('\n')}\n\n`;
                              content += `【编辑意见】\n${analysisResult.editorAdvice}`;
                              downloadTXT(content, '分析报告.txt');
                            }} className="gap-2">
                              <Download className="w-4 h-4" />导出TXT
                            </Button>
                            <Button onClick={exportAnalysisWord} className="gap-2">
                              <FileIcon className="w-4 h-4" />导出Word
                            </Button>
                          </div>
                          {t && (
                            <div className="pt-4 border-t space-y-3">
                              <p className="text-sm font-medium">翻译结果导出（{LANG_BY_CODE[sourceLang]?.name} → {LANG_BY_CODE[targetLang]?.name}）</p>
                              <div className="flex flex-wrap gap-3">
                                <Button variant="outline" onClick={() => exportTranslationWord('bilingual')} className="gap-2">
                                  <FileIcon className="w-4 h-4" />双语对照Word
                                </Button>
                                <Button variant="outline" onClick={() => exportTranslationWord('clean')} className="gap-2">
                                  <FileIcon className="w-4 h-4" />纯净译文Word
                                </Button>
                                <Button variant="outline" onClick={() => downloadTXT(t.translatedText, `翻译_纯净.txt`)} className="gap-2">
                                  <Download className="w-4 h-4" />纯净译文TXT
                                </Button>
                                {t.bilingualVersion && (
                                  <Button variant="outline" onClick={() => downloadTXT(t.bilingualVersion!, '双语对照.txt')} className="gap-2">
                                    <Download className="w-4 h-4" />双语对照TXT
                                  </Button>
                                )}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </TabsContent>

                {/* 多语种翻译模块 */}
                <TabsContent value="translation" className="space-y-6">
                  <Card>
                    <CardHeader><CardTitle className="text-base flex items-center gap-2"><Languages className="w-4 h-4 text-primary" />语言选择（50+ 语种 · 中英双核枢纽）</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">源语言</label>
                          <Select value={sourceLang} onValueChange={setSourceLang}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {LANGUAGES.map((l) => (
                                <SelectItem key={l.code} value={l.code}>{l.name}（{l.native}）</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">目标语言</label>
                          <Select value={targetLang} onValueChange={setTargetLang}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {LANGUAGES.filter((l) => l.code !== sourceLang).map((l) => (
                                <SelectItem key={l.code} value={l.code}>{l.name}（{l.native}）</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">翻译模式</label>
                        <Select value={translateMode} onValueChange={(v) => setTranslateMode(v as TranslationMode)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bilingual">双语对照（原文+译文）</SelectItem>
                            <SelectItem value="clean">纯净译文（仅译文）</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
                        <strong>路由提示：</strong>
                        {sourceLang === 'zh' || sourceLang === 'en' || targetLang === 'zh' || targetLang === 'en'
                          ? '当前为中英核心链路，直译。'
                          : `当前选择非中英文互译，系统将通过${sourceLang === 'ja' || targetLang === 'ja' || sourceLang === 'ko' || targetLang === 'ko' ? '中文' : '中文（默认枢纽）'}枢纽中转，确保翻译质量。`}
                      </div>
                      <Button onClick={handleTranslate} disabled={isTranslating || sourceLang === targetLang} className="w-full gap-2">
                        {isTranslating ? (<><Sparkles className="w-4 h-4 animate-spin" />翻译中... {translateProgress}%</>) : (<><Globe className="w-4 h-4" />开始翻译</>)}
                      </Button>
                      {isTranslating && (
                        <div className="space-y-1">
                          <Progress value={translateProgress} />
                          <p className="text-xs text-muted-foreground text-center">{translateMsg}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {t && (
                    <div className="space-y-4">
                      <div className="text-xs text-muted-foreground">
                        {t.route.note} · 共 {t.chunkCount} 段 · 原文 {t.totalChars} 字
                      </div>
                      {t.bilingualVersion && translateMode === 'bilingual' && (
                        <Card>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-base">双语对照</CardTitle>
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm" onClick={() => downloadTXT(t.bilingualVersion!, '双语对照.txt')}><Download className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(t.bilingualVersion!)}><Copy className="w-4 h-4" /></Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <pre className="text-sm whitespace-pre-line bg-muted p-4 rounded-lg overflow-x-auto max-h-[400px] overflow-y-auto">{t.bilingualVersion}</pre>
                          </CardContent>
                        </Card>
                      )}
                      <Card>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">纯净译文</CardTitle>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm" onClick={() => downloadTXT(t.translatedText, '纯净译文.txt')}><Download className="w-4 h-4" /></Button>
                              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(t.translatedText)}><Copy className="w-4 h-4" /></Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <pre className="text-sm whitespace-pre-line bg-muted p-4 rounded-lg overflow-x-auto max-h-[400px] overflow-y-auto">{t.translatedText}</pre>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* 空状态 */}
        {!analysisResult && !isAnalyzing && (
          <Card className="shadow-elegant rounded-2xl">
            <CardContent className="py-16 text-center">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-primary/40" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">等待分析</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                粘贴小说文本或上传TXT/DOCX文件后点击"开始智能分析"，AI将从结构、节奏、人物、市场等多个维度进行深度解析
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
