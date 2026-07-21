import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Sparkles } from 'lucide-react';

const models = [
  { id: 'deepseek-chat', name: 'DeepSeek Chat', desc: 'DeepSeek・通用写作', default: true },
  { id: 'qwen3.6-plus', name: 'Qwen3.6-Plus', desc: '通义千问・通用写作' },
  { id: 'qwen3-max', name: 'Qwen3-Max', desc: '通义千问・最强推理' },
  { id: 'kimi-k2.5', name: 'Kimi K2.5', desc: '月之暗面・长文本' },
  { id: 'deepseek-v3.2', name: 'DeepSeek V3.2', desc: '深度求索・高性价比' },
  { id: 'glm-5', name: 'GLM-5', desc: '智谱清言・中文优化' },
  { id: 'MiniMax-M2.5', name: 'MiniMax M2.5', desc: 'MiniMax・创意写作' },
];

const writeModes = [
  { value: 'comprehensive', label: '全维综合模式', desc: '情节 + 人物 + 风格 + 节奏 + 设定全方位对标' },
  { value: 'track', label: '赛道适配模式' },
  { value: 'plot', label: '情节模式' },
  { value: 'character', label: '人物模式' },
  { value: 'style', label: '风格模式' },
];

const wordTargets = [
  { label: '千【总纲】', value: 1000, disabled: false },
  { label: '1万【测试】', value: 10000, disabled: false },
  { label: '2万【测试】', value: 20000, disabled: false },
  { label: '3万【短篇】', value: 30000, disabled: false },
  { label: '10万', value: 100000, disabled: false },
  { label: '30万', value: 300000, disabled: false },
  { label: '50万', value: 500000, disabled: false },
  { label: '100万', value: 1000000, disabled: false },
  { label: '200万', value: 2000000, disabled: true },
  { label: '300万', value: 3000000, disabled: true },
];

interface ModelConfigSectionProps {
  onParamsChange?: (params: any) => void;
}

export function ModelConfigSection({ onParamsChange }: ModelConfigSectionProps) {
  const [selectedModels, setSelectedModels] = useState<string[]>(['deepseek-chat']);
  const [writeMode, setWriteMode] = useState('comprehensive');
  const [wordTarget, setWordTarget] = useState(300000);
  const [customWordTarget, setCustomWordTarget] = useState('');
  const [isCustomInput, setIsCustomInput] = useState(false);
  const [chapterSize, setChapterSize] = useState('standard');
  const [outputFormat, setOutputFormat] = useState('txt');

  // 统一通知父组件状态变化
  const notifyChange = (updates: any) => {
    onParamsChange?.(updates);
  };

  const toggleModel = (modelId: string) => {
    let newSelected: string[];
    if (selectedModels.includes(modelId)) {
      newSelected = selectedModels.filter(id => id !== modelId);
    } else if (selectedModels.length < 2) {
      newSelected = [...selectedModels, modelId];
    } else {
      return; // 最多选2个
    }
    setSelectedModels(newSelected);
    notifyChange({ model: newSelected[0] || 'deepseek-chat' });
  };

  const handleWriteModeChange = (value: string) => {
    setWriteMode(value);
    notifyChange({ writeMode: value });
  };

  return (
    <section className="bg-card rounded-2xl p-6 border border-border mt-6">
      <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-primary" />
        步骤2：AI模型选择 + 仿写配置
      </h2>

      {/* 模型选择 */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-foreground mb-3">AI模型选择（最多2个）</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {models.map((model) => (
            <div
              key={model.id}
              onClick={() => toggleModel(model.id)}
              className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                selectedModels.includes(model.id)
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-start gap-2">
                <Checkbox
                  checked={selectedModels.includes(model.id)}
                  onCheckedChange={() => toggleModel(model.id)}
                />
                <div>
                  <p className="text-sm font-medium text-foreground">{model.name}</p>
                  <p className="text-xs text-muted-foreground">{model.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 仿写模式 */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-foreground mb-3">仿写模式</h3>
        <RadioGroup value={writeMode} onValueChange={handleWriteModeChange}>
          <div className="space-y-2">
            {writeModes.map((mode) => (
              <div key={mode.value} className="flex items-start gap-2">
                <RadioGroupItem value={mode.value} id={mode.value} />
                <Label htmlFor={mode.value} className="flex-1">
                  <span className="text-sm text-foreground">{mode.label}</span>
                  {mode.desc && (
                    <span className="text-xs text-muted-foreground ml-2">{mode.desc}</span>
                  )}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </div>

      {/* 目标字数 */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-foreground mb-3">目标字数</h3>
        <div className="flex flex-wrap gap-2">
          {wordTargets.map((item) => (
            <Button
              key={item.value}
              variant={wordTarget === item.value && !isCustomInput ? 'default' : 'outline'}
              size="sm"
              disabled={item.disabled}
              onClick={() => {
                if (!item.disabled) {
                  setIsCustomInput(false);
                  setWordTarget(item.value);
                }
              }}
              className={`${
                wordTarget === item.value && !isCustomInput
                  ? 'bg-primary hover:bg-primary/90'
                  : item.disabled
                    ? 'opacity-50 cursor-not-allowed line-through'
                    : ''
              }`}
            >
              {item.label}
            </Button>
          ))}
          <Button
            variant={isCustomInput ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setIsCustomInput(true);
              setCustomWordTarget('');
            }}
            className={isCustomInput ? 'bg-primary hover:bg-primary/90' : 'text-foreground'}
          >
            自定义
          </Button>
        </div>

        {/* 自定义输入框 */}
        {isCustomInput && (
          <div className="mt-3 flex items-center gap-2">
            <Input
              type="number"
              placeholder="请输入目标字数"
              value={customWordTarget}
              onChange={(e) => {
                const value = e.target.value;
                setCustomWordTarget(value);
                const numValue = parseInt(value);
                if (!isNaN(numValue) && numValue > 0) {
                  setWordTarget(numValue);
                }
              }}
              className="w-48"
              min="1"
            />
            <span className="text-sm text-muted-foreground">字</span>
          </div>
        )}

        <p className="text-xs text-muted-foreground mt-2">
          目标字数 {wordTarget >= 10000 ? `${wordTarget / 10000}万` : wordTarget}字 | 预估 {Math.ceil(wordTarget / 3000)} 章 | 缩放比例 1.0x
        </p>
      </div>

      {/* 章节字数 */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-foreground mb-3">章节字数</h3>
        <div className="flex gap-3">
          {[
            { value: 'compact', label: '紧凑', range: '1890~2600', tag: '自选' },
            { value: 'standard', label: '标准', range: '2200~3800', tag: '默认' },
            { value: 'rich', label: '丰满', range: '3200~5500', tag: '自选' },
          ].map((item) => (
            <Button
              key={item.value}
              variant={chapterSize === item.value ? 'default' : 'outline'}
              onClick={() => setChapterSize(item.value)}
              className={chapterSize === item.value ? 'bg-primary hover:bg-primary/90' : 'text-foreground'}
            >
              {item.label} {item.range}【{item.tag}】
            </Button>
          ))}
        </div>
      </div>

      {/* 输出格式 */}
      <div>
        <h3 className="text-sm font-medium text-foreground mb-3">输出格式</h3>
        <div className="flex gap-3">
          <Button
            variant={outputFormat === 'txt' ? 'default' : 'outline'}
            onClick={() => setOutputFormat('txt')}
            className={outputFormat === 'txt' ? 'bg-primary hover:bg-primary/90' : 'text-foreground'}
          >
            TXT【默认】
          </Button>
          <Button
            variant={outputFormat === 'docx' ? 'default' : 'outline'}
            onClick={() => setOutputFormat('docx')}
            className={outputFormat === 'docx' ? 'bg-primary hover:bg-primary/90' : 'text-foreground'}
          >
            DOCX【自选】
          </Button>
        </div>
      </div>
    </section>
  );
}
