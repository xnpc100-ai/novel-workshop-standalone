import { Sparkles } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto text-center">
        {/* Logo和品牌名 */}
        <div className="flex items-center justify-center gap-4 mb-8 animate-fade-in-up">
          <div className="p-3 rounded-2xl bg-primary/10 shadow-elegant">
            <Sparkles className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
            SqAI 菱形AI小说仿写工坊2.0
          </h1>
        </div>

        {/* Slogan - 主标语 */}
        <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <p className="text-2xl sm:text-3xl font-semibold gradient-text mb-3">
            写小说别再独自瞎熬！爆款套路一键转原创
          </p>
          <p className="text-lg sm:text-xl text-muted-foreground">
            0基础直通月入过万，中外全平台投稿变现全覆盖
          </p>
        </div>

        {/* 副标语 - 特性标签 */}
        <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <span className="px-4 py-2 rounded-full bg-secondary border border-border-subtle">双模型协同仿写</span>
          <span className="px-4 py-2 rounded-full bg-secondary border border-border-subtle">百万字长篇稳更</span>
          <span className="px-4 py-2 rounded-full bg-secondary border border-border-subtle">文风精准复刻</span>
          <span className="px-4 py-2 rounded-full bg-secondary border border-border-subtle">合规原创改写</span>
        </div>
      </div>
    </section>
  );
}
