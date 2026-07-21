import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ParameterSlider } from '@/components/ParameterSlider';
import { Settings, FileText, Cpu, Sliders, Edit3, Globe, ShieldCheck, Download, Star, Save } from 'lucide-react';

const steps = [
  { id: 1, title: '模板基础设置', icon: FileText },
  { id: 2, title: '内容解析配置', icon: FileText },
  { id: 3, title: 'AI模型选择', icon: Cpu },
  { id: 4, title: '仿写参数调节', icon: Sliders },
  { id: 5, title: '个性化指令', icon: Edit3 },
  { id: 6, title: '质检标准', icon: ShieldCheck },
  { id: 7, title: '输出格式', icon: Download },
];

export function WorkflowBuilder() {
  const [currentStep, setCurrentStep] = useState(1);
  
  // 步骤1状态
  const [templateName, setTemplateName] = useState('');
  const [scenario, setScenario] = useState('general');
  const [templateType, setTemplateType] = useState('balanced');

  // 步骤2状态
  const [smartCompress, setSmartCompress] = useState(true);
  const [mainPlotWeight, setMainPlotWeight] = useState(95);
  const [characterWeight, setCharacterWeight] = useState(95);
  const [highlightWeight, setHighlightWeight] = useState(90);
  const [foreshadowingWeight, setForeshadowingWeight] = useState(90);

  // 步骤4状态
  const [contentRetention, setContentRetention] = useState(70);
  const [aiCreativity, setAiCreativity] = useState(60);

  // 步骤9状态
  const [totalScore, setTotalScore] = useState(85);
  const [plotCompleteness, setPlotCompleteness] = useState(85);
  const [characterFit, setCharacterFit] = useState(85);
  const [styleMatch, setStyleMatch] = useState(85);
  const [originality, setOriginality] = useState(80);
  const [fluency, setFluency] = useState(90);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-foreground font-medium">模板名称</Label>
              <Input placeholder="如：通用精品小说仿写模板" value={templateName} onChange={(e) => setTemplateName(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label className="text-foreground font-medium">适用场景</Label>
              <Select value={scenario} onValueChange={setScenario}>
                <SelectTrigger className="mt-1"><SelectValue>全网通用网文、都市、玄幻、古言全覆盖</SelectValue></SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">全网通用网文</SelectItem>
                  <SelectItem value="urban">都市小说</SelectItem>
                  <SelectItem value="fantasy">玄幻小说</SelectItem>
                  <SelectItem value="ancient">古言小说</SelectItem>
                  <SelectItem value="short">短篇爽文</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-foreground font-medium">模板类型</Label>
              <Select value={templateType} onValueChange={setTemplateType}>
                <SelectTrigger className="mt-1"><SelectValue>均衡复刻 + 轻微创新</SelectValue></SelectTrigger>
                <SelectContent>
                  <SelectItem value="balanced">均衡复刻 + 轻微创新</SelectItem>
                  <SelectItem value="framework">纯小说框架模板</SelectItem>
                  <SelectItem value="innovation">深度创新改写模板</SelectItem>
                  <SelectItem value="deduplication">纯降重模板</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-foreground font-medium">智能压缩冗余内容</Label>
              <Switch checked={smartCompress} onCheckedChange={setSmartCompress} />
            </div>
            <ParameterSlider label="主线剧情保留" value={mainPlotWeight} onChange={setMainPlotWeight} color="gold" />
            <ParameterSlider label="人设保留" value={characterWeight} onChange={setCharacterWeight} color="gold" />
            <p className="text-xs text-muted-foreground">核心内容高权重保留，冗余自动精简</p>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">选择1个主力模型即可</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { id: 'deepseek-chat', name: 'DeepSeek Chat', desc: '通用写作' },
                { id: 'qwen3.6-plus', name: 'Qwen3.6-Plus', desc: '通用写作' },
                { id: 'qwen3-max', name: 'Qwen3-Max', desc: '最强推理' },
                { id: 'kimi-k2.5', name: 'Kimi K2.5', desc: '长文本' },
                { id: 'deepseek-v3.2', name: 'DeepSeek V3.2', desc: '高性价比' },
                { id: 'glm-5', name: 'GLM-5', desc: '中文优化' },
                { id: 'MiniMax-M2.5', name: 'MiniMax M2.5', desc: '创意写作' },
              ].map((model) => (
                <div key={model.id} className="flex items-center gap-2 p-3 bg-secondary/30 rounded-lg">
                  <Checkbox id={`model-${model.id}`} />
                  <div>
                    <Label htmlFor={`model-${model.id}`} className="text-foreground">{model.name}</Label>
                    <p className="text-xs text-muted-foreground">{model.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <ParameterSlider label="内容还原度" value={contentRetention} onChange={setContentRetention} color="gold" />
            <ParameterSlider label="AI创意度" value={aiCreativity} onChange={setAiCreativity} color="blue" />
            <p className="text-xs text-muted-foreground">还原度高更忠实原文，创意度高更有新意</p>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-foreground font-medium">优化指令（可选）</Label>
              <Textarea placeholder="如：增强动作场景张力，突出主角内心独白…" className="mt-1" rows={3} />
            </div>
            <div>
              <Label className="text-foreground font-medium">禁止词汇（可选）</Label>
              <Input placeholder="如：突然,忽然,但是" className="mt-1" />
            </div>
            <p className="text-xs text-muted-foreground">留空则使用默认设置</p>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-foreground font-medium">严格质检模式</Label>
              <Switch defaultChecked />
            </div>
            <div>
              <Label className="text-foreground font-medium">合格分数线</Label>
              <Select defaultValue="80">
                <SelectTrigger className="mt-1"><SelectValue>80分（推荐）</SelectValue></SelectTrigger>
                <SelectContent>
                  {[75, 80, 85, 90].map((score) => (
                    <SelectItem key={score} value={String(score)}>{score}分</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground">低于合格线将提示重新生成</p>
          </div>
        );

      case 7:
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-foreground font-medium">导出格式</Label>
              <div className="flex gap-3 mt-2">
                <Button variant="default" size="sm" className="bg-primary">TXT（推荐）</Button>
                <Button variant="outline" size="sm" className="text-foreground">DOCX</Button>
              </div>
            </div>
            <div className="pt-4 border-t border-border">
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6">
                <Save className="w-5 h-5 mr-2" />
                保存工作流模板
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-2">保存后可在"公开模板"中快速套用</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section className="bg-card rounded-2xl p-6 border border-border">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary" />
          10步超高自由度自定义工作流搭建
        </h2>
        <p className="text-sm text-muted-foreground mt-1">脱离系统固定35套工作流，从零搭建专属仿写方案</p>
      </div>

      {/* 步骤导航 */}
      <div className="flex overflow-x-auto gap-2 mb-6 pb-2">
        {steps.map((step) => (
          <button
            key={step.id}
            onClick={() => setCurrentStep(step.id)}
            className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              currentStep === step.id ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            <step.icon className="w-4 h-4 inline mr-1" />
            步骤{step.id}
          </button>
        ))}
      </div>

      {/* 当前步骤内容 */}
      <div className="min-h-[300px]">
        <h3 className="text-lg font-semibold text-foreground mb-4">步骤{currentStep}：{steps[currentStep - 1]?.title}</h3>
        {renderStepContent()}
      </div>

      {/* 底部导航按钮 */}
      <div className="flex justify-between mt-6 pt-4 border-t border-border">
        <Button variant="outline" className="text-foreground" onClick={() => setCurrentStep(Math.max(1, currentStep - 1))} disabled={currentStep === 1}>上一步</Button>
        <Button onClick={() => setCurrentStep(Math.min(7, currentStep + 1))} className="bg-primary hover:bg-primary/90" disabled={currentStep === 7}>下一步</Button>
      </div>
    </section>
  );
}
