import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, Wand2, Play } from 'lucide-react';

interface AdvancedCustomizationProps {
  onParamsChange?: (params: any) => void;
}

export function AdvancedCustomization({ onParamsChange }: AdvancedCustomizationProps) {
  const [strictMode, setStrictMode] = useState(false);
  const [originalityCheck, setOriginalityCheck] = useState(false);
  const [qualityThreshold, setQualityThreshold] = useState(false);
  const [breakpointRepair, setBreakpointRepair] = useState(false);
  const [rewriteRepair, setRewriteRepair] = useState(false);
  const [optimizationInstruction, setOptimizationInstruction] = useState('');
  const [styleRequirement, setStyleRequirement] = useState('');
  const [forbiddenWords, setForbiddenWords] = useState('');

  // 统一通知父组件状态变化
  const notifyChange = (updates: any) => {
    onParamsChange?.(updates);
  };

  const handleOptimizationChange = (value: string) => {
    setOptimizationInstruction(value);
    notifyChange({ optimizationInstruction: value });
  };

  const handleStyleChange = (value: string) => {
    setStyleRequirement(value);
    notifyChange({ styleRequirement: value });
  };

  const handleForbiddenWordsChange = (value: string) => {
    setForbiddenWords(value);
    notifyChange({ forbiddenWords: value });
  };

  return (
    <>
      {/* 步骤4: 高阶自定义精修 */}
      <section className="bg-card rounded-2xl p-6 border border-border mt-6">
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-primary" />
          步骤4：高阶自定义精修
        </h2>

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-foreground">优化指令:</Label>
            <Textarea
              placeholder="如：增强动作场景的张力，突出主角的内心独白…"
              className="mt-2 min-h-[80px]"
              value={optimizationInstruction}
              onChange={(e) => handleOptimizationChange(e.target.value)}
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-foreground">风格要求:</Label>
            <Textarea
              placeholder="如：采用金庸式武侠笔法…"
              className="mt-2 min-h-[80px]"
              value={styleRequirement}
              onChange={(e) => handleStyleChange(e.target.value)}
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-foreground">禁止词汇（逗号分隔）：</Label>
            <Input
              placeholder="如：突然,忽然,但是,然而"
              className="mt-2"
              value={forbiddenWords}
              onChange={(e) => handleForbiddenWordsChange(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">用英文逗号分隔多个词汇</p>
          </div>
        </div>
      </section>

      {/* 步骤5: 智能质检 */}
      <section className="bg-card rounded-2xl p-6 border border-border mt-6">
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          步骤5：智能质检
        </h2>

        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Switch checked={strictMode} onCheckedChange={setStrictMode} />
            <Label className="text-foreground font-medium">严格模式【默认关闭】</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={originalityCheck} onCheckedChange={setOriginalityCheck} />
            <Label className="text-foreground font-medium">原创性检测【默认关闭】</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={qualityThreshold} onCheckedChange={setQualityThreshold} />
            <Label className="text-foreground font-medium">质控底线: 80 / 100 分【默认关闭】</Label>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mb-4">
          分项总分：基础规范20分 叙事逻辑25分 阅读体验25分 风格适配20分 内容质感10分
        </p>

        {/* 质检规则详情 */}
        <div className="space-y-3 text-sm">
          {[
            { name: '基础规范质检', score: '≥18 分', desc: '仅允许极个别错别字、标点瑕疵，无合规问题、无核心设定矛盾、无大面积格式错误' },
            { name: '叙事逻辑质检', score: '≥20 分', desc: '无核心剧情硬伤、无人设严重 OOC，仅允许 1-2 处轻微逻辑不严谨' },
            { name: '阅读体验质检', score: '≥20 分', desc: '节奏基本流畅，叙事配比合理，无大段灌水内容、无严重阅读卡顿' },
            { name: '风格适配质检', score: '≥16 分', desc: '全文风格基本统一，誊造 / 仿写贴合度达标，无明显风格断层' },
            { name: '内容质感质检', score: '≥8 分', desc: '有基本的细节表达，情绪与台词合格，无严重扁平感' },
          ].map((item, index) => (
            <div key={index} className="p-3 bg-secondary/30 rounded-lg">
              <p className="font-medium text-foreground">{item.name}：{item.score}</p>
              <p className="text-xs text-muted-foreground mt-1">扣分边界：{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 步骤6: 执行 & 输出 */}
      <section className="bg-card rounded-2xl p-6 border border-border mt-6">
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Play className="w-5 h-5 text-primary" />
          步骤6：执行 & 输出
        </h2>

        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Switch checked={breakpointRepair} onCheckedChange={setBreakpointRepair} />
            <Label className="text-foreground font-medium">断点修复【默认关闭】</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={rewriteRepair} onCheckedChange={setRewriteRepair} />
            <Label className="text-foreground font-medium">仿写修复【默认关闭】</Label>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          注：仿写记录功能已移至"仿写执行引擎"区域，可在那里开启自动保存
        </p>
      </section>
    </>
  );
}
