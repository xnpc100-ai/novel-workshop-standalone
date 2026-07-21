import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeft, BookOpen, Clock, Users, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export const Route = createFileRoute('/tutorial-detail')({
  component: TutorialDetailPage,
  validateSearch: (search: Record<string, unknown>): { id?: string } => {
    return {
      id: typeof search.id === 'string' ? search.id : undefined,
    };
  },
});

interface TutorialData {
  id: number;
  title: string;
  desc: string;
  content: React.ReactNode;
}

const tutorials: TutorialData[] = [
  {
    id: 1,
    title: '快速上手指南',
    desc: '5分钟学会如何使用仿写工具',
    content: (
      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-bold text-foreground mb-3">第一步：上传原文</h3>
          <ul className="space-y-2 text-sm text-muted-foreground ml-4">
            <li>• 支持TXT和DOCX格式</li>
            <li>• 建议单次上传不超过10万字</li>
            <li>• 系统会自动识别章节结构</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-bold text-foreground mb-3">第二步：选择AI模型</h3>
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="bg-background/50 rounded-lg p-3">
              <p className="font-semibold text-foreground mb-1">qwen3.6-plus</p>
              <p className="text-xs text-muted-foreground">推荐，速度快</p>
            </div>
            <div className="bg-background/50 rounded-lg p-3">
              <p className="font-semibold text-foreground mb-1">kimi-k2.5</p>
              <p className="text-xs text-muted-foreground">长文本处理强</p>
            </div>
            <div className="bg-background/50 rounded-lg p-3">
              <p className="font-semibold text-foreground mb-1">deepseek-v3.2</p>
              <p className="text-xs text-muted-foreground">性价比高</p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-bold text-foreground mb-3">第三步：调整参数</h3>
          <ul className="space-y-2 text-sm text-muted-foreground ml-4">
            <li><strong>AI创意度：</strong>控制改写幅度（30%-80%）</li>
            <li><strong>写作模式：</strong>综合/精简/扩写</li>
            <li><strong>风格保持：</strong>保留原文风格程度</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-bold text-foreground mb-3">第四步：开始仿写</h3>
          <ul className="space-y-2 text-sm text-muted-foreground ml-4">
            <li>• 点击"开始仿写"按钮</li>
            <li>• 实时查看生成进度</li>
            <li>• 完成后下载作品</li>
          </ul>
        </section>

        <section className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <h4 className="font-semibold text-primary mb-2">小贴士</h4>
          <ul className="space-y-2 text-sm text-muted-foreground ml-4">
            <li>• 首次使用建议从短篇开始</li>
            <li>• 多尝试不同参数组合</li>
            <li>• 保存常用配置为模板</li>
          </ul>
        </section>
      </div>
    ),
  },
  {
    id: 2,
    title: '爆款仿写技巧',
    desc: '掌握核心仿写逻辑，提升作品质量',
    content: (
      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-bold text-foreground mb-3">1. 开头黄金三章</h3>
          <ul className="space-y-2 text-sm text-muted-foreground ml-4">
            <li>• 第一章必须出现冲突或悬念</li>
            <li>• 主角人设要鲜明立体</li>
            <li>• 世界观设定要自然融入剧情</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-bold text-foreground mb-3">2. 节奏把控</h3>
          <ul className="space-y-2 text-sm text-muted-foreground ml-4">
            <li>• 每3000字设置一个小高潮</li>
            <li>• 每1万字设置一个大转折</li>
            <li>• 避免长时间平淡叙述</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-bold text-foreground mb-3">3. 人物塑造</h3>
          <ul className="space-y-2 text-sm text-muted-foreground ml-4">
            <li>• 主角要有明确的目标和动机</li>
            <li>• 配角要有记忆点</li>
            <li>• 反派要有合理的行动逻辑</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-bold text-foreground mb-3">4. 爽点设计</h3>
          <ul className="space-y-2 text-sm text-muted-foreground ml-4">
            <li>• 打脸情节要铺垫充分</li>
            <li>• 升级过程要有层次感</li>
            <li>• 感情线要循序渐进</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-bold text-foreground mb-3">5. 仿写要点</h3>
          <ul className="space-y-2 text-sm text-muted-foreground ml-4">
            <li>• 保留原文的核心冲突</li>
            <li>• 优化对话的自然度</li>
            <li>• 增强场景的画面感</li>
          </ul>
        </section>
      </div>
    ),
  },
  {
    id: 3,
    title: '平台投稿攻略',
    desc: '各大网文平台投稿规则详解',
    content: (
      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-bold text-foreground mb-3">番茄小说</h3>
          <div className="bg-background/50 rounded-lg p-4 space-y-2">
            <p className="text-sm"><span className="font-semibold">签约方式：</span>满2万字自动审核</p>
            <p className="text-sm"><span className="font-semibold">收益模式：</span>广告分成+全勤奖</p>
            <p className="text-sm"><span className="font-semibold">适合类型：</span>玄幻、都市、言情</p>
            <p className="text-sm"><span className="font-semibold">注意事项：</span>日更4000字以上有加成</p>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-bold text-foreground mb-3">七猫小说</h3>
          <div className="bg-background/50 rounded-lg p-4 space-y-2">
            <p className="text-sm"><span className="font-semibold">签约方式：</span>编辑人工审核</p>
            <p className="text-sm"><span className="font-semibold">收益模式：</span>千字20元起保底</p>
            <p className="text-sm"><span className="font-semibold">适合类型：</span>女频、甜宠、霸总</p>
            <p className="text-sm"><span className="font-semibold">注意事项：</span>需要稳定更新</p>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-bold text-foreground mb-3">起点中文网</h3>
          <div className="bg-background/50 rounded-lg p-4 space-y-2">
            <p className="text-sm"><span className="font-semibold">签约方式：</span>内投或直发</p>
            <p className="text-sm"><span className="font-semibold">收益模式：</span>订阅+打赏+版权</p>
            <p className="text-sm"><span className="font-semibold">适合类型：</span>男频、玄幻、仙侠</p>
            <p className="text-sm"><span className="font-semibold">注意事项：</span>质量要求高</p>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-bold text-foreground mb-3">晋江文学城</h3>
          <div className="bg-background/50 rounded-lg p-4 space-y-2">
            <p className="text-sm"><span className="font-semibold">签约方式：</span>申请签约</p>
            <p className="text-sm"><span className="font-semibold">收益模式：</span>VIP订阅</p>
            <p className="text-sm"><span className="font-semibold">适合类型：</span>女频、古言、现言</p>
            <p className="text-sm"><span className="font-semibold">注意事项：</span>注重文笔和情感</p>
          </div>
        </section>
      </div>
    ),
  },
  {
    id: 4,
    title: '版权合规指南',
    desc: '如何避免抄袭风险，安全创作',
    content: (
      <div className="space-y-6">
        <section>
          <h3 className="text-lg font-bold text-foreground mb-3">什么是合规仿写？</h3>
          <ul className="space-y-2 text-sm text-muted-foreground ml-4">
            <li>• 借鉴故事框架和情节结构</li>
            <li>• 重新创作人物和对话</li>
            <li>• 改变背景设定和世界观</li>
            <li>• 加入原创元素和创新点</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-bold text-foreground mb-3">避免抄袭的方法</h3>
          <div className="space-y-3">
            <div className="bg-background/50 rounded-lg p-4">
              <h4 className="font-semibold text-foreground mb-2">1. 不要直接复制原文</h4>
              <ul className="space-y-1.5 text-sm text-muted-foreground ml-4">
                <li>- 用自己的语言重述</li>
                <li>- 改变叙述视角</li>
                <li>- 调整情节顺序</li>
              </ul>
            </div>
            <div className="bg-background/50 rounded-lg p-4">
              <h4 className="font-semibold text-foreground mb-2">2. 增加原创内容</h4>
              <ul className="space-y-1.5 text-sm text-muted-foreground ml-4">
                <li>- 设计新的人物关系</li>
                <li>- 添加支线剧情</li>
                <li>- 创造独特的世界观</li>
              </ul>
            </div>
            <div className="bg-background/50 rounded-lg p-4">
              <h4 className="font-semibold text-foreground mb-2">3. 保持合理相似度</h4>
              <ul className="space-y-1.5 text-sm text-muted-foreground ml-4">
                <li>- 核心冲突可以相似</li>
                <li>- 具体表达必须原创</li>
                <li>- 对话要完全重写</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="font-semibold text-red-700 mb-2">法律风险提示</h4>
          <ul className="space-y-2 text-sm text-red-800 ml-4">
            <li>• 直接复制超过30%可能被认定抄袭</li>
            <li>• 人物名称和设定要修改</li>
            <li>• 特殊情节需要大幅改动</li>
          </ul>
        </section>

        <section className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <h4 className="font-semibold text-primary mb-2">建议</h4>
          <ul className="space-y-2 text-sm text-muted-foreground ml-4">
            <li>• 仿写是学习手段，不是最终目的</li>
            <li>• 逐步提高原创比例</li>
            <li>• 形成自己的写作风格</li>
          </ul>
        </section>
      </div>
    ),
  },
];

function TutorialDetailPage() {
  const { id } = Route.useSearch();
  const tutorialId = id ? parseInt(id) : 1;
  const tutorial = tutorials.find(t => t.id === tutorialId) || tutorials[0];

  return (
    <div className="min-h-screen pb-16">
      {/* 顶部导航 */}
      <section className="pt-16 pb-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="max-w-4xl mx-auto animate-fade-in-up">
          <Link to="/community" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            返回社区
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 tracking-tight">
            {tutorial.title}
          </h1>
          <p className="text-lg text-muted-foreground">
            {tutorial.desc}
          </p>
        </div>
      </section>

      {/* 教程内容 */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="bg-card rounded-xl p-6 border border-border shadow-elegant">
          {tutorial.content}
        </div>

        {/* 底部提示 */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 border border-primary/20">
          <p className="text-center text-sm text-muted-foreground">
            教程内容持续更新中，如有建议欢迎在社区反馈
          </p>
        </div>
      </div>
    </div>
  );
}
