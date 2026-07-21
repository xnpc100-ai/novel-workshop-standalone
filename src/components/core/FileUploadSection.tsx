import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Upload, FileText, Download, Loader2, UploadCloud } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import mammoth from 'mammoth';
import { requestNovelAnalysis } from '@/services/novelAnalysis';

interface FileUploadSectionProps {
  onTextLoaded?: (text: string) => void;
}

// 章节智能拆分函数
function splitChapters(text: string): string[] {
  // 常见章节标题模式
  const chapterPatterns = [
    /^第[一二三四五六七八九十百千万\d]+章\s+.+$/gm,
    /^第[一二三四五六七八九十百千万\d]+回\s+.+$/gm,
    /^Chapter\s+\d+/gim,
    /^第[一二三四五六七八九十百千万\d]+节\s+.+$/gm,
    /^卷[一二三四五六七八九十百千万\d]+\s*.+$/gm,
  ];

  let chapters: string[] = [];
  let matched = false;

  for (const pattern of chapterPatterns) {
    const matches = [...text.matchAll(pattern)];
    if (matches.length > 0) {
      matched = true;
      // 按匹配位置分割文本
      let lastIndex = 0;
      matches.forEach((match, index) => {
        const start = match.index!;
        if (index > 0) {
          chapters.push(text.slice(lastIndex, start).trim());
        }
        lastIndex = start;
      });
      // 添加最后一章
      chapters.push(text.slice(lastIndex).trim());
      break;
    }
  }

  // 如果没有匹配到章节模式，按空行分段
  if (!matched) {
    chapters = text.split(/\n\s*\n/).filter(p => p.trim().length > 100);
  }

  return chapters.filter(c => c.length > 0);
}

export function FileUploadSection({ onTextLoaded }: FileUploadSectionProps) {
  const [fileName, setFileName] = useState<string>('');
  const [loadedChars, setLoadedChars] = useState<number>(0);
  const [chapterCount, setChapterCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState('');
  const [analysisType, setAnalysisType] = useState<'novel-analysis' | 'character-analysis' | 'plot-analysis'>('novel-analysis');
  const [uploadedText, setUploadedText] = useState('');
  const [chapters, setChapters] = useState<string[]>([]);
  const [selectedChapters, setSelectedChapters] = useState<number[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setLoading(true);

    try {
      let text = '';

      if (file.name.endsWith('.docx')) {
        // 解析DOCX文件
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        text = result.value;
      } else {
        // 解析TXT文件
        text = await file.text();
      }

      // 智能拆分章节
      const parsedChapters = splitChapters(text);
      setChapters(parsedChapters);
      setChapterCount(parsedChapters.length);
      setLoadedChars(text.length);
      setUploadedText(text);
      setSelectedChapters(parsedChapters.map((_, i) => i)); // 默认全选

      // 将完整文本传递给父组件
      onTextLoaded?.(text);
    } catch (error) {
      console.error('文件解析失败:', error);
      alert('文件解析失败，请检查文件格式');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChapters = () => {
    if (selectedChapters.length === 0) {
      toast.error('请至少选择一个章节');
      return;
    }

    const selectedText = selectedChapters.map(i => chapters[i]).join('\n\n');
    onTextLoaded?.(selectedText);
    setDialogOpen(false);
    toast.success(`已导入 ${selectedChapters.length} 个章节`);
  };

  const toggleChapter = (index: number) => {
    setSelectedChapters(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const selectAllChapters = () => {
    setSelectedChapters(chapters.map((_, i) => i));
  };

  const deselectAllChapters = () => {
    setSelectedChapters([]);
  };

  const handleAnalysis = async () => {
    console.log('[FileUploadSection] handleAnalysis called');
    console.log('[FileUploadSection] uploadedText length:', uploadedText?.length);
    console.log('[FileUploadSection] analysisType:', analysisType);

    if (!uploadedText.trim()) {
      toast.error('请先上传小说文本');
      return;
    }

    setAnalyzing(true);
    setAnalysisResult('');

    try {
      console.log('[FileUploadSection] calling requestNovelAnalysis...');
      await requestNovelAnalysis(
        uploadedText,
        { analysisType, model: 'deepseek-chat' },
        (chunk) => {
          console.log('[FileUploadSection] received chunk:', chunk.length);
          setAnalysisResult((prev) => prev + chunk);
        }
      );

      toast.success('分析完成！');
    } catch (error) {
      console.error('[FileUploadSection] analysis error:', error);
      toast.error(error instanceof Error ? error.message : '分析失败，请重试');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <section className="bg-card rounded-2xl p-6 border border-border">
      <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold mr-1">1</span>
        <UploadCloud className="w-5 h-5 text-primary" />
        步骤1：上传 & 导入章节
      </h2>

      {/* 文件上传区域 */}
      <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer relative">
        <input
          type="file"
          accept=".txt,.docx"
          onChange={handleFileSelect}
          disabled={loading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-foreground font-medium mb-1">拖拽文件到此处，或点击选择文件</p>
        <p className="text-sm text-muted-foreground">支持 .txt/.docx 格式，建议单文件 300 万字内</p>
        <p className="text-xs text-accent mt-2">⚠ 智能识别章节结构・自动拆分解析</p>
        
        {loading && (
          <p className="mt-3 text-sm text-primary font-medium">解析中...</p>
        )}
        
        {fileName && !loading && (
          <>
            <p className="mt-3 text-sm text-primary font-medium">已选择: {fileName}</p>
            <p className="mt-1 text-xs text-muted-foreground">已加载 {loadedChars.toLocaleString()} 字</p>
            {chapterCount > 0 && (
              <p className="mt-1 text-xs text-primary">智能识别到 {chapterCount} 个章节</p>
            )}
          </>
        )}
      </div>

      {/* 底部按钮 */}
      <div className="flex gap-3 mt-4">
        <Button
          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
          disabled={loadedChars === 0 || loading}
          onClick={() => {
            if (loadedChars > 0) {
              toast.success(`已成功导入 ${fileName}，共 ${loadedChars.toLocaleString()} 字，${chapterCount} 个章节`);
            }
          }}
        >
          一键导入所有章节
        </Button>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex-1 border-border text-foreground" disabled={loadedChars === 0 || chapters.length === 0}>
              选择章节导入
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>选择要导入的章节</DialogTitle>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={selectAllChapters}>
                  全选
                </Button>
                <Button size="sm" variant="outline" onClick={deselectAllChapters}>
                  取消全选
                </Button>
                <span className="text-sm text-muted-foreground ml-auto">
                  已选 {selectedChapters.length}/{chapters.length} 章
                </span>
              </div>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-2">
                  {chapters.map((chapter, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 cursor-pointer"
                      onClick={() => toggleChapter(index)}
                    >
                      <Checkbox
                        checked={selectedChapters.includes(index)}
                        onCheckedChange={() => toggleChapter(index)}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground line-clamp-1">
                          {chapter.split('\n')[0].substring(0, 50)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {chapter.length} 字
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <Button
                className="w-full"
                onClick={handleSelectChapters}
                disabled={selectedChapters.length === 0}
              >
                确认导入 ({selectedChapters.length} 章)
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* 爆款分析区 */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-medium text-foreground flex items-center gap-2">
              📊 爆款分析
              <span className="text-xs text-muted-foreground">深度解析 (~10000 字)</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select
              value={analysisType}
              onValueChange={(v) => setAnalysisType(v as any)}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="novel-analysis">小说爆款分析</SelectItem>
                <SelectItem value="character-analysis">人物分析</SelectItem>
                <SelectItem value="plot-analysis">剧情分析</SelectItem>
              </SelectContent>
            </Select>
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={loadedChars === 0 || analyzing}
              onClick={handleAnalysis}
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  分析中...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-1" />
                  分析
                </>
              )}
            </Button>
          </div>
        </div>

        {/* 分析结果展示 */}
        {analysisResult && (
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-semibold text-foreground">分析结果</h4>
            <Textarea
              value={analysisResult}
              readOnly
              className="min-h-[200px] font-mono text-sm"
            />
          </div>
        )}

        {/* 进度条 */}
        {analyzing && (
          <div className="mt-3 space-y-2">
            <Progress value={50} className="h-2" />
            <p className="text-xs text-muted-foreground text-center">AI分析中...</p>
          </div>
        )}
      </div>
    </section>
  );
}
