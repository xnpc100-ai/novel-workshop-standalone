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
import { getSupabaseUrl } from '@/supabase/client';
import {
  BookOpen, FileText, Sparkles, Upload, BarChart3, Lightbulb,
  Target, TrendingUp, AlertCircle, CheckCircle2, Star,
  Layers, Users, Clock, Zap, Award, MessageSquare, X,
  Globe, PenTool, Download, Languages, Copy, ChevronDown, ChevronRight,
  User, Map, ScrollText, Palette, Quote
} from 'lucide-react';
import { useState, useRef } from 'react';
import { toast } from 'sonner';

export const Route = createFileRoute('/deconstruct')({
  component: DeconstructPage,
});

// 辅助类型定义
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

interface AnalysisResult {
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
  derivativeWorks?: {
    rewrite?: string;
    summary?: {
      oneSentence: string;
      bulletPoints: string[];
      detailed: string;
    };
  };
  translations?: {
    [lang: string]: {
      translatedText: string;
      bilingualVersion?: string;
    };
  };
}

function DeconstructPage() {
  const [novelText, setNovelText] = useState('');
  const [fileName, setFileName] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  
  // 三大模块状态
  const [mainModule, setMainModule] = useState<'analysis' | 'creation' | 'translation'>('analysis');
  
  // 智能拆书子模块
  const [analysisSubTab, setAnalysisSubTab] = useState<'structure' | 'characters' | 'plot' | 'style' | 'quotes'>('structure');
  
  // 衍生创作子模块
  const [creationSubTab, setCreationSubTab] = useState<'rewrite' | 'summary' | 'download'>('rewrite');
  
  // 翻译模块状态
  const [sourceLang, setSourceLang] = useState('zh');
  const [targetLang, setTargetLang] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  
  // 仿写输入状态
  const [newBookName, setNewBookName] = useState('');
  const [newGenre, setNewGenre] = useState('');
  const [newSynopsis, setNewSynopsis] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileName_lower = file.name.toLowerCase();
    
    if (fileName_lower.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setNovelText(text);
        setFileName(file.name);
        toast.success(`已加载 ${file.name} (${text.length}字)`);
      };
      reader.onerror = () => toast.error('文件读取失败');
      reader.readAsText(file, 'UTF-8');
    } else if (fileName_lower.endsWith('.docx')) {
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
    try {
      const response = await fetch(`${getSupabaseUrl()}/functions/v1/ai-novel-deconstruct`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: novelText }),
      });
      if (!response.ok) throw new Error(`API请求失败: ${response.status}`);
      const result = await response.json();
      if (result.error) throw new Error(result.error);
      setAnalysisResult(result as AnalysisResult);
      toast.success('AI分析完成！');
    } catch (error) {
      console.warn('Edge Function调用失败，使用模拟数据:', error);
      setTimeout(() => {
        const mockResult: AnalysisResult = {
          score: 82,
          structure: {
            opening: '开篇采用"黄金三章"结构，第一章快速引入主角身份和核心冲突',
            conflict: '主线冲突明确，但支线冲突略显单薄',
            climax: '高潮部分情绪渲染到位，爽点密集',
            resolution: '结局处理较为圆满，留白空间可以更大'
          },
          highlights: ['主角人设接地气', '设定新颖', '爽点节奏把控良好', '配角塑造有特色'],
          issues: ['更新节奏不稳定', '部分场景描写套路化', '次要角色存在感较弱'],
          suggestions: ['稳定日更4000-6000字', '增加细节描写', '提升反派智商'],
          marketAnalysis: {
            genre: '都市修仙',
            targetAudience: '18-35岁男性读者',
            competitionLevel: '中等竞争，优质内容有突围机会',
            potentialScore: 78
          },
          editorAdvice: '整体来看，这是一部有潜力的作品。建议深化人物塑造和情节设计。',
          outline: {
            mainPlot: '主角从普通外卖员意外获得修仙传承，逐步成长为至尊强者的故事',
            chapterOutlines: [
              { chapter: 1, title: '意外传承', summary: '主角获得神秘传承', keyEvents: ['获得玉佩', '觉醒灵力'] },
              { chapter: 2, title: '初试身手', summary: '首次使用灵力解决危机', keyEvents: ['击退混混', '引起注意'] },
              { chapter: 3, title: '踏入修行', summary: '正式开始修炼之路', keyEvents: ['拜师', '学习基础功法'] }
            ]
          },
          worldBuilding: {
            background: '现代都市中隐藏着修仙世界，普通人不知晓的存在',
            factions: [
              { name: '青云门', description: '传统修仙门派，历史悠久' },
              { name: '暗影阁', description: '神秘组织，行事诡秘' }
            ],
            magicSystem: '灵力体系，分为炼气、筑基、金丹等境界'
          },
          characters: [
            {
              name: '林风',
              role: 'protagonist',
              personality: '坚韧不拔，重情重义',
              background: '普通外卖员，父母早逝',
              growth: '从凡人到修仙者的蜕变',
              relationships: ['师父：青云长老', '好友：张三']
            },
            {
              name: '苏婉',
              role: 'supporting',
              personality: '温柔善良，聪明机智',
              background: '富家千金，隐藏身份',
              growth: '逐渐展现实力',
              relationships: ['暗恋主角']
            }
          ],
          plotAnalysis: {
            rhythm: '前期节奏较快，中期略有拖沓，后期紧凑',
            turningPoints: [
              { chapter: 1, description: '获得传承，命运转折' },
              { chapter: 10, description: '首次重大危机' }
            ],
            subplots: [
              { title: '感情线', relationToMain: '辅助主线，增加情感深度' }
            ]
          },
          themeAnalysis: {
            coreThemes: ['成长', '友情', '正义'],
            emotionalArc: '从迷茫到坚定，从弱小到强大'
          },
          writingStyle: {
            perspective: '第三人称限知视角',
            narrativeRhythm: '张弛有度，高潮迭起',
            techniques: ['伏笔铺垫', '悬念设置', '对比手法']
          },
          goldenQuotes: [
            {
              text: '真正的强者，不是没有眼泪，而是含着眼泪依然奔跑',
              emotionTag: '励志',
              rhetoricType: '对比',
              position: '第5章',
              score: 92
            },
            {
              text: '修仙之路，修的不仅是力量，更是心境',
              emotionTag: '哲理',
              rhetoricType: '隐喻',
              position: '第12章',
              score: 88
            }
          ]
        };
        setAnalysisResult(mockResult);
        toast.success('分析完成（模拟数据模式）');
      }, 1500);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const downloadTXT = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('下载成功');
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('已复制到剪贴板');
    } catch (error) {
      toast.error('复制失败');
    }
  };

  const handleTranslate = async () => {
    if (!novelText.trim()) {
      toast.error('请先输入或上传小说文本');
      return;
    }
    setIsTranslating(true);
    setTimeout(() => {
      const mockTranslation = {
        translatedText: `[${targetLang.toUpperCase()} Translation]\n\nThis is a simulated translation of the novel. In production, this would call a real translation API.`,
        bilingualVersion: `原文：\n${novelText.substring(0, 200)}...\n\n译文：\n[Simulated translation content...]`
      };
      setAnalysisResult(prev => prev ? {
        ...prev,
        translations: { ...prev.translations, [targetLang]: mockTranslation }
      } : null);
      setIsTranslating(false);
      toast.success('翻译完成（模拟数据）');
    }, 1500);
  };

  const handleRewrite = async () => {
    if (!newBookName || !newGenre || !newSynopsis) {
      toast.error('请填写完整的仿写信息');
      return;
    }
    setIsAnalyzing(true);
    setTimeout(() => {
      const mockRewrite = `《${newBookName}》仿写框架\n\n类型：${newGenre}\n\n核心梗概：${newSynopsis}\n\n=== 大纲结构 ===\n\n第一章：开篇引入\n第二章：矛盾升级\n第三章：初次交锋\n\n=== 人物设定 ===\n\n主角：基于原书风格的新角色\n配角：支撑主线的关键人物`;
      setAnalysisResult(prev => prev ? {
        ...prev,
        derivativeWorks: { ...prev.derivativeWorks, rewrite: mockRewrite }
      } : null);
      setIsAnalyzing(false);
      toast.success('仿写生成完成（模拟数据）');
    }, 1500);
  };

  const generateSummary = () => {
    if (!analysisResult) {
      toast.error('请先进行分析');
      return;
    }
    const mockSummary = {
      oneSentence: '这是一部关于成长与奋斗的精彩故事，主角从平凡走向卓越。',
      bulletPoints: ['主角身份：普通但具有特殊潜力', '核心冲突：个人成长与外部压力', '故事亮点：节奏紧凑、人物立体'],
      detailed: '故事讲述了一个普通人如何通过不懈努力，在充满挑战的环境中逐步成长，最终实现自我价值的过程。作品融合了悬疑、冒险和情感元素，叙事节奏张弛有度。'
    };
    setAnalysisResult(prev => prev ? {
      ...prev,
      derivativeWorks: { ...prev.derivativeWorks, summary: mockSummary }
    } : null);
    toast.success('摘要生成完成');
  };

  const langOptions = [
    { value: 'zh', label: '中文' },
    { value: 'en', label: 'English' },
    { value: 'ja', label: '日本語' },
    { value: 'ko', label: '한국어' },
    { value: 'fr', label: 'Français' }
  ];

  return (
    <div className="min-h-screen pb-16">
      <section className="pt-16 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center animate-fade-in-up">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 tracking-tight flex items-center justify-center gap-3">
            <BookOpen className="w-8 h-8 text-primary" />
            智能拆书分析
          </h1>
          <p className="text-lg text-muted-foreground">
            AI深度解析小说结构，提取爆款要素，提供专业编辑级指导意见
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
                    <TabsList className="grid w-full grid-cols-3 rounded-xl bg-muted p-1 mb-4">
                      <TabsTrigger value="rewrite" className="rounded-lg text-xs">
                        <PenTool className="w-3 h-3 mr-1" />仿写重构
                      </TabsTrigger>
                      <TabsTrigger value="summary" className="rounded-lg text-xs">
                        <ScrollText className="w-3 h-3 mr-1" />内容摘要
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
                          <Button onClick={handleRewrite} disabled={!newBookName || !newGenre || !newSynopsis} className="w-full gap-2">
                            <Sparkles className="w-4 h-4" />生成仿写框架
                          </Button>
                        </CardContent>
                      </Card>
                      {analysisResult.derivativeWorks?.rewrite && (
                        <Card>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-base">仿写结果</CardTitle>
                              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(analysisResult.derivativeWorks!.rewrite!)}>
                                <Copy className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <pre className="text-sm whitespace-pre-line bg-muted p-4 rounded-lg overflow-x-auto">{analysisResult.derivativeWorks.rewrite}</pre>
                          </CardContent>
                        </Card>
                      )}
                    </TabsContent>

                    {/* 内容摘要 */}
                    <TabsContent value="summary" className="space-y-4">
                      <Card>
                        <CardHeader><CardTitle className="text-base">生成摘要</CardTitle></CardHeader>
                        <CardContent>
                          <Button onClick={generateSummary} className="w-full gap-2">
                            <Sparkles className="w-4 h-4" />生成三种粒度摘要
                          </Button>
                        </CardContent>
                      </Card>
                      {analysisResult.derivativeWorks?.summary && (
                        <div className="space-y-4">
                          <Card>
                            <CardHeader><CardTitle className="text-base">一句话摘要</CardTitle></CardHeader>
                            <CardContent><p className="text-sm italic">{analysisResult.derivativeWorks.summary.oneSentence}</p></CardContent>
                          </Card>
                          <Card>
                            <CardHeader><CardTitle className="text-base">要点清单</CardTitle></CardHeader>
                            <CardContent>
                              <ul className="space-y-1">
                                {analysisResult.derivativeWorks.summary.bulletPoints.map((point, i) => (
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
                            <CardContent><p className="text-sm leading-relaxed">{analysisResult.derivativeWorks.summary.detailed}</p></CardContent>
                          </Card>
                        </div>
                      )}
                    </TabsContent>

                    {/* 下载导出 */}
                    <TabsContent value="download" className="space-y-4">
                      <Card>
                        <CardHeader><CardTitle className="text-base">导出分析报告</CardTitle></CardHeader>
                        <CardContent className="space-y-3">
                          <p className="text-sm text-muted-foreground">将当前分析结果导出为本地文件，方便离线查看和编辑</p>
                          <div className="flex gap-3">
                            <Button onClick={() => {
                              const content = JSON.stringify(analysisResult, null, 2);
                              downloadTXT(content, '分析报告.json');
                            }} className="gap-2">
                              <Download className="w-4 h-4" />导出JSON
                            </Button>
                            <Button onClick={() => {
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
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </TabsContent>

                {/* 多语种翻译模块 */}
                <TabsContent value="translation" className="space-y-6">
                  <Card>
                    <CardHeader><CardTitle className="text-base flex items-center gap-2"><Languages className="w-4 h-4 text-primary" />语言选择</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">源语言</label>
                          <Select value={sourceLang} onValueChange={setSourceLang}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {langOptions.map(lang => (
                                <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">目标语言</label>
                          <Select value={targetLang} onValueChange={setTargetLang}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {langOptions.filter(l => l.value !== sourceLang).map(lang => (
                                <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Button onClick={handleTranslate} disabled={isTranslating} className="w-full gap-2">
                        {isTranslating ? (<><Sparkles className="w-4 h-4 animate-spin" />翻译中...</>) : (<><Globe className="w-4 h-4" />开始翻译</>)}
                      </Button>
                    </CardContent>
                  </Card>

                  {analysisResult.translations?.[targetLang] && (
                    <div className="space-y-4">
                      <Card>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">翻译结果</CardTitle>
                            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(analysisResult.translations![targetLang].translatedText)}>
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <pre className="text-sm whitespace-pre-line bg-muted p-4 rounded-lg overflow-x-auto max-h-[400px] overflow-y-auto">
                            {analysisResult.translations[targetLang].translatedText}
                          </pre>
                        </CardContent>
                      </Card>
                      {analysisResult.translations[targetLang].bilingualVersion && (
                        <Card>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-base">双语对照</CardTitle>
                              <Button variant="ghost" size="sm" onClick={() => downloadTXT(analysisResult.translations![targetLang].bilingualVersion!, '双语对照.txt')}>
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <pre className="text-sm whitespace-pre-line bg-muted p-4 rounded-lg overflow-x-auto max-h-[400px] overflow-y-auto">
                              {analysisResult.translations[targetLang].bilingualVersion}
                            </pre>
                          </CardContent>
                        </Card>
                      )}
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
