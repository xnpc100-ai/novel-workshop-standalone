import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ParameterSlider } from '@/components/ParameterSlider';
import { SlidersHorizontal } from 'lucide-react';

interface ParameterTabsProps {
  onParamsChange?: (params: any) => void;
}

export function ParameterTabs({ onParamsChange }: ParameterTabsProps) {
  const [useDefault, setUseDefault] = useState(true);

  // 内容还原权重参数
  const [plotRetention, setPlotRetention] = useState(85);
  const [characterRetention, setCharacterRetention] = useState(85);
  const [highlightRetention, setHighlightRetention] = useState(80);
  const [logicRetention, setLogicRetention] = useState(65);
  const [styleRetention, setStyleRetention] = useState(78);

  // AI创意精修参数
  const [aiCreativity, setAiCreativity] = useState(60);
  const [optimizationRounds, setOptimizationRounds] = useState(40);
  const [auditStrictness, setAuditStrictness] = useState(50);
  const [literaryEnhancement, setLiteraryEnhancement] = useState(45);
  const [aiDivergence, setAiDivergence] = useState(35);

  // 翻译参数
  const [translationEnabled, setTranslationEnabled] = useState(false);
  const [translationFidelity, setTranslationFidelity] = useState(80);
  const [translationCreativity, setTranslationCreativity] = useState(50);

  // 统一通知父组件状态变化
  const notifyChange = (updates: any) => {
    onParamsChange?.(updates);
  };

  // 包装setter函数，在状态变化时通知父组件
  const handlePlotRetentionChange = (value: number) => {
    setPlotRetention(value);
    notifyChange({ plotRetention: value });
  };

  const handleCharacterRetentionChange = (value: number) => {
    setCharacterRetention(value);
    notifyChange({ characterRetention: value });
  };

  const handleHighlightRetentionChange = (value: number) => {
    setHighlightRetention(value);
    notifyChange({ highlightRetention: value });
  };

  const handleLogicRetentionChange = (value: number) => {
    setLogicRetention(value);
    notifyChange({ logicRetention: value });
  };

  const handleStyleRetentionChange = (value: number) => {
    setStyleRetention(value);
    notifyChange({ styleRetention: value });
  };

  const handleAiCreativityChange = (value: number) => {
    setAiCreativity(value);
    notifyChange({ aiCreativity: value });
  };

  return (
    <section className="bg-card rounded-2xl p-6 border border-border mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-primary" />
          步骤3：核心参数调节
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={useDefault}
              onCheckedChange={setUseDefault}
            />
            <Label className="text-sm text-foreground font-medium">一键默认</Label>
          </div>
          <Button variant="outline" size="sm" className="text-foreground">恢复默认值</Button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mb-4">使用最佳默认参数，新人推荐打开</p>

      <Tabs defaultValue="retention" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="retention">内容还原·创新权重</TabsTrigger>
          <TabsTrigger value="creative">AI创意精修</TabsTrigger>
          <TabsTrigger value="translation">中英双语翻译</TabsTrigger>
        </TabsList>

        {/* 标签1: 内容还原·创新权重 */}
        <TabsContent value="retention" className="space-y-4 pt-4">
          <ParameterSlider
            label="剧情保留度"
            value={plotRetention}
            onChange={handlePlotRetentionChange}
            color="gold"
          />
          <ParameterSlider
            label="人设保留度"
            value={characterRetention}
            onChange={handleCharacterRetentionChange}
            color="gold"
          />
          <ParameterSlider
            label="爽点保留度"
            value={highlightRetention}
            onChange={handleHighlightRetentionChange}
            color="gold"
          />
          <ParameterSlider
            label="逻辑保留度"
            value={logicRetention}
            onChange={handleLogicRetentionChange}
            color="gold"
          />
          <ParameterSlider
            label="风格保留度"
            value={styleRetention}
            onChange={handleStyleRetentionChange}
            color="gold"
          />
        </TabsContent>

        {/* 标签2: AI创意精修 */}
        <TabsContent value="creative" className="space-y-4 pt-4">
          <ParameterSlider
            label="AI创意度"
            value={aiCreativity}
            onChange={handleAiCreativityChange}
            color="blue"
          />
          <ParameterSlider
            label="优化迭代轮次"
            value={optimizationRounds}
            onChange={setOptimizationRounds}
            color="blue"
          />
          <ParameterSlider
            label="审核严苛度"
            value={auditStrictness}
            onChange={setAuditStrictness}
            color="blue"
          />
          <ParameterSlider
            label="文学增强度"
            value={literaryEnhancement}
            onChange={setLiteraryEnhancement}
            color="blue"
          />
          <ParameterSlider
            label="AI发散度"
            value={aiDivergence}
            onChange={setAiDivergence}
            color="blue"
          />
        </TabsContent>

        {/* 标签3: 中英双语翻译 */}
        <TabsContent value="translation" className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <Label className="text-foreground font-medium">中英双语翻译</Label>
            <div className="flex items-center gap-2">
              <Switch
                checked={translationEnabled}
                onCheckedChange={setTranslationEnabled}
              />
              <span className="text-sm text-foreground font-medium">
                {translationEnabled ? '已开启' : '已关闭'}【默认关闭】
              </span>
            </div>
          </div>

          {translationEnabled && (
            <>
              <ParameterSlider
                label="翻译保真度"
                value={translationFidelity}
                onChange={setTranslationFidelity}
                color="green"
              />
              <ParameterSlider
                label="翻译创意度"
                value={translationCreativity}
                onChange={setTranslationCreativity}
                color="green"
              />

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm">英文风格</Label>
                  <Select defaultValue="us">
                    <SelectTrigger className="mt-1">
                      <SelectValue>US 美式</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">US 美式</SelectItem>
                      <SelectItem value="gb">GB 英式</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm">英编优化轮次</Label>
                  <Select defaultValue="2">
                    <SelectTrigger className="mt-1">
                      <SelectValue>2</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm">英编审核轮次</Label>
                  <Select defaultValue="2">
                    <SelectTrigger className="mt-1">
                      <SelectValue>2</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3].map((n) => (
                        <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </section>
  );
}
