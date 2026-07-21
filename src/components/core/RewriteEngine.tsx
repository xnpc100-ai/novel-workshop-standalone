import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { requestNovelRewrite, RewriteParams, checkApiKey } from '@/services/aiRewrite';
import { Play, Download, Loader2, Key, Eye, EyeOff } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  template_config: any;
}

interface RewriteEngineProps {
  originalText: string;
  params: RewriteParams;
}

export function RewriteEngine({ originalText, params }: RewriteEngineProps) {
  const [isRewriting, setIsRewriting] = useState(false);
  const [rewrittenText, setRewrittenText] = useState('');
  const [progress, setProgress] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  // API Key 管理
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [savedApiKey, setSavedApiKey] = useState('');
  const [apiKeyValid, setApiKeyValid] = useState<boolean | null>(null);

  // 工作流选择相关状态
  const [saveRecord, setSaveRecord] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>('default');
  const [workflows, setWorkflows] = useState<Template[]>([]);

  // 加载保存的API Key
  useEffect(() => {
    const saved = localStorage.getItem('rewrite_api_key');
    if (saved) {
      setSavedApiKey(saved);
    }
    
    // 加载预设工作流
    setWorkflows(generatePresetWorkflows());
  }, []);

  // 生成预设工作流模板
  const generatePresetWorkflows = (): Template[] => {
    const scenarios = [
      { name: '番茄爆款', scenario: 'tomato' },
      { name: '七猫保底', scenario: 'qimao' },
      { name: '起点IP', scenario: 'qidian' },
      { name: '晋江言情', scenario: 'jinjiang' },
      { name: '纵横玄幻', scenario: 'zongheng' },
      { name: '盐言短篇', scenario: 'yan' },
    ];

    const styles = [
      { type: 'balanced', label: '均衡复刻' },
      { type: 'framework', label: '纯框架' },
      { type: 'innovation', label: '深度创新' },
    ];

    const models = ['deepseek-chat', 'qwen3.6-plus', 'kimi-k2.5', 'deepseek-v3.2', 'glm-5', 'MiniMax-M2.6'];
    const workflows: Template[] = [];
    let id = 1;

    scenarios.forEach((s) => {
      styles.forEach((style) => {
        const model = models[(id - 1) % models.length];
        workflows.push({
          id: `preset-${id}`,
          name: `${s.name}-${style.label}`,
          template_config: {
            model,
            writeMode: style.type === 'framework' ? 'plot' : 'comprehensive',
            aiCreativity: style.type === 'innovation' ? 80 : 60,
            scenario: s.scenario,
          },
        });
        id++;
      });
    });

    return workflows;
  };

  // 保存API Key
  const handleSaveApiKey = async () => {
    if (!apiKeyInput.trim()) {
      toast.error('请输入API Key');
      return;
    }
    
    const isValid = await checkApiKey(apiKeyInput.trim());
    if (!isValid) {
      setApiKeyValid(false);
      toast.error('API Key无效，请检查');
      return;
    }
    
    localStorage.setItem('rewrite_api_key', apiKeyInput.trim());
    setSavedApiKey(apiKeyInput.trim());
    setApiKeyValid(true);
    toast.success('API Key保存成功！');
    setApiKeyInput('');
  };

  // 应用选中的工作流配置
  const applyWorkflow = (workflowId: string) => {
    if (workflowId === 'default') return;
    const workflow = workflows.find(w => w.id === workflowId);
    if (workflow && workflow.template_config) {
      toast.success(`已应用工作流：${workflow.name}`);
    }
  };

  const handleStartRewrite = async () => {
    if (!originalText.trim()) {
      toast.error('请先上传或输入原文内容');
      return;
    }

    const MAX_TEXT_LENGTH = 120000;
    if (originalText.length > MAX_TEXT_LENGTH) {
      toast.error(`文本过长（${originalText.length}字），建议分批处理。单次仿写建议不超过${MAX_TEXT_LENGTH}字`);
      return;
    }

    setIsRewriting(true);
    setRewrittenText('');
    setProgress(0);

    abortControllerRef.current = new AbortController();

    try {
      await requestNovelRewrite(
        originalText,
        params,
        (chunk) => {
          setRewrittenText((prev) => prev + chunk);
          const estimatedProgress = Math.min(95, Math.floor((rewrittenText.length / originalText.length) * 100 + Math.random() * 10));
          setProgress(estimatedProgress);
        },
        abortControllerRef.current.signal
      );

      toast.success('仿写完成！');
      setProgress(100);

      // 保存记录
      if (saveRecord) {
        const records = JSON.parse(localStorage.getItem('rewrite_records') || '[]');
        records.unshift({
          id: Date.now(),
          original_length: originalText.length,
          rewritten_length: rewrittenText.length,
          model: params.model || 'deepseek-chat',
          created_at: new Date().toISOString()
        });
        localStorage.setItem('rewrite_records', JSON.stringify(records.slice(0, 50)));
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        toast.info('已取消仿写');
      } else {
        toast.error(error.message || '仿写失败，请重试');
      }
    } finally {
      setIsRewriting(false);
    }
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsRewriting(false);
  };

  const handleDownload = () => {
    if (!rewrittenText) return;
    
    const blob = new Blob([rewrittenText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `仿写作品_${new Date().getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('下载成功！');
  };

  return (
    <div className="space-y-4">
      {/* API Key 管理 */}
      <div className="bg-card rounded-xl p-4 border border-border space-y-3">
        <div className="flex items-center gap-2">
          <Key className="w-4 h-4 text-primary" />
          <Label className="text-sm font-medium">DeepSeek API Key</Label>
          {savedApiKey && (
            <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">已配置</span>
          )}
        </div>
        
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              type={showApiKey ? 'text' : 'password'}
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder={savedApiKey ? '已保存Key，可输入新Key替换' : 'sk-...'}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <Button onClick={handleSaveApiKey} variant="outline" size="sm">
            保存
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          💡 输入您的DeepSeek API Key，可前往{' '}
          <a href="https://platform.deepseek.com" target="_blank" rel="noopener" className="text-primary hover:underline">
            platform.deepseek.com
          </a>{' '}
          获取
        </p>
      </div>

      {/* 仿写记录和工作流选择 */}
      <div className="bg-card rounded-xl p-4 border border-border space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Switch
              id="save-record"
              checked={saveRecord}
              onCheckedChange={(checked) => setSaveRecord(checked)}
            />
            <Label htmlFor="save-record" className="text-sm font-medium cursor-pointer">
              仿写记录
            </Label>
          </div>

          <div className="flex items-center gap-2">
            <Label className="text-sm text-muted-foreground">工作流：</Label>
            <Select value={selectedWorkflow} onValueChange={(value) => {
              setSelectedWorkflow(value);
              applyWorkflow(value);
            }}>
              <SelectTrigger className="w-[180px] h-8 text-xs">
                <SelectValue placeholder="默认配置" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">默认配置</SelectItem>
                {workflows.map((workflow) => (
                  <SelectItem key={workflow.id} value={workflow.id}>
                    {workflow.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* 开始按钮 */}
      <Button
        onClick={isRewriting ? handleCancel : handleStartRewrite}
        disabled={!originalText && !isRewriting}
        className={`w-full py-6 text-lg font-bold ${
          isRewriting 
            ? 'bg-destructive hover:bg-destructive/90' 
            : 'bg-primary hover:bg-primary/90'
        }`}
      >
        {isRewriting ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            停止仿写
          </>
        ) : (
          <>
            <Play className="w-5 h-5 mr-2" />
            🚀 开始仿写
          </>
        )}
      </Button>

      {/* 进度条 */}
      {isRewriting && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground text-center">
            仿写进度: {progress}% （AI正在创作中，请稍候...）
          </p>
        </div>
      )}

      {/* 结果展示区 */}
      {rewrittenText && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">仿写结果</h3>
            <Button onClick={handleDownload} size="sm" variant="outline">
              <Download className="w-4 h-4 mr-2" />
              下载作品
            </Button>
          </div>
          <Textarea
            value={rewrittenText}
            readOnly
            className="min-h-[400px] font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            字数: {rewrittenText.length} | 预计章节: {Math.ceil(rewrittenText.length / 3000)}
          </p>
        </div>
      )}
    </div>
  );
}
