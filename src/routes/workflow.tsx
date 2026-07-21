import { createFileRoute } from '@tanstack/react-router';
import { WorkflowBuilder } from '@/components/workflow/WorkflowBuilder';
import { TemplateManager } from '@/components/workflow/TemplateManager';

export const Route = createFileRoute('/workflow')({
  component: WorkflowPage,
});

function WorkflowPage() {
  return (
    <div className="min-h-screen pb-12">
      {/* 页面标题区 */}
      <section className="pt-16 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            自定义工作流搭建
          </h1>
          <p className="text-lg text-muted-foreground">
            脱离系统固定35套工作流，从零搭建专属仿写方案
          </p>
        </div>
      </section>

      {/* 主要内容区 */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <WorkflowBuilder />
        <TemplateManager />
      </div>

      {/* 底部页脚 */}
      <footer className="mt-12 py-8 px-4 border-t border-border">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <p className="text-xs text-muted-foreground">
            合规须知：本工具仅用于个人写作练习、学习参考。请勿在未获得原著版权授权的情况下进行商业使用，违规使用产生的法律风险由用户自行承担。
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <a href="https://sqai.shop/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              SqAI菱形AI综合平台
            </a>
            <span className="text-muted-foreground">|</span>
            <a href="https://joyful-narwhal-112ef4.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              菱形AI图办秘书
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
