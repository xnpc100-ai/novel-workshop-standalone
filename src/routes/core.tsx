import { useState, useEffect, useCallback, useRef } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { FileUploadSection } from '@/components/core/FileUploadSection';
import { ModelConfigSection } from '@/components/core/ModelConfigSection';
import { ParameterTabs } from '@/components/core/ParameterTabs';
import { AdvancedCustomization } from '@/components/core/AdvancedCustomization';
import { RewriteEngine } from '@/components/core/RewriteEngine';
import { toast } from 'sonner';

export const Route = createFileRoute('/core')({
  component: CorePage,
});

function CorePage() {
  const [originalText, setOriginalText] = useState('');
  const [rewriteParams, setRewriteParams] = useState<any>({
    model: 'deepseek-chat',
    writeMode: 'comprehensive',
    plotRetention: 85,
    characterRetention: 85,
    highlightRetention: 80,
    logicRetention: 65,
    styleRetention: 78,
    aiCreativity: 60,
    optimizationInstruction: '',
    styleRequirement: '',
    forbiddenWords: '',
  });

  // 使用 ref 来存储参数，避免依赖问题
  const paramsRef = useRef(rewriteParams);

  // 同步 ref 和 state
  useEffect(() => {
    paramsRef.current = rewriteParams;
  }, [rewriteParams]);

  // 使用 useCallback 并基于稳定的 ref 来创建回调
  const handleParamsChange = useCallback((newParams: any) => {
    const currentParams = paramsRef.current;
    const hasChanges = Object.entries(newParams).some(
      ([key, value]) => currentParams[key] !== value
    );

    if (hasChanges) {
      const updatedParams = { ...currentParams, ...newParams };
      setRewriteParams(updatedParams);
    }
  }, []); // 空依赖数组，因为只使用 ref

  // 检查是否有应用的模板配置
  useEffect(() => {
    const appliedTemplate = localStorage.getItem('applied_template');
    if (appliedTemplate) {
      try {
        const templateData = JSON.parse(appliedTemplate);

        // 合并模板配置到当前参数
        setRewriteParams((prev: any) => ({
          ...prev,
          model: templateData.model || prev.model,
          writeMode: templateData.writeMode || prev.writeMode,
          contentRetention: templateData.contentRetention !== undefined ? templateData.contentRetention : prev.plotRetention,
          aiCreativity: templateData.aiCreativity !== undefined ? templateData.aiCreativity : prev.aiCreativity,
        }));

        toast.success(`已应用模板"${templateData.templateName}"的配置`);

        // 清除已应用的模板，避免重复应用
        localStorage.removeItem('applied_template');
      } catch (e) {
        console.error('解析模板配置失败:', e);
      }
    }
  }, []);

  return (
    <div className="min-h-screen pb-16">
      {/* 引擎标题区 */}
      <section className="pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center animate-fade-in-up">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 tracking-tight">
            核心仿写引擎
          </h1>
          <p className="text-lg text-muted-foreground">
            22步精工流水线 · DNA提取 → 逐章仿写 → 智能质检 → 一键成书
          </p>
        </div>
      </section>

      {/* 主要内容区 */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <FileUploadSection onTextLoaded={setOriginalText} />
        <ModelConfigSection onParamsChange={handleParamsChange} />
        <ParameterTabs onParamsChange={handleParamsChange} />
        <AdvancedCustomization onParamsChange={handleParamsChange} />

        {/* 仿写执行引擎 */}
        <RewriteEngine originalText={originalText} params={rewriteParams} />
      </div>

      {/* 底部页脚 */}
      <footer className="mt-16 py-10 px-4 border-t border-border">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <p className="text-xs text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            合规须知：本工具仅用于个人写作练习、学习参考。请勿在未获得原著版权授权的情况下进行商业使用，违规使用产生的法律风险由用户自行承担。
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm">
            <a href="https://zuojia.baidu.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline transition-colors">
              百度作家平台
            </a>
            <a href="https://www.zhimeiai.cn/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline transition-colors">
              智媒AI伪原创
            </a>
            <a href="https://ai.thinkgs.cn/sites/121.html" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline transition-colors">
              彩云小梦
            </a>
            <a href="https://www.aitoolall.com/favorites/writingtools/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline transition-colors">
              AI写作工具导航
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
