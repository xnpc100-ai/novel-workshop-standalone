import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Film, Clapperboard, Sparkles, Clock } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/more')({
  component: MorePage,
});

const comingFeatures = [
  {
    id: 1,
    title: '小说一键转剧本',
    description: '智能将小说文本转换为标准剧本格式，包含场景、对话、动作描述',
    icon: Film,
    status: 'developing'
  },
  {
    id: 2,
    title: '小说转漫剧',
    description: '将小说内容自动生成分镜脚本和漫画分格，支持多种画风选择',
    icon: Clapperboard,
    status: 'developing'
  },
  {
    id: 3,
    title: 'AI续写助手',
    description: '基于已有情节智能续写后续章节，保持人物性格和剧情连贯性',
    icon: Sparkles,
    status: 'planned'
  }
];

function MorePage() {
  const handleFeatureClick = (title: string) => {
    toast.info(`${title} - 正在开发中，敬请期待！`);
  };

  return (
    <div className="min-h-screen pb-16">
      {/* 标题区 */}
      <section className="pt-16 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center animate-fade-in-up">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 tracking-tight">
            更多功能
          </h1>
          <p className="text-lg text-muted-foreground">
            探索即将上线的创新功能
          </p>
        </div>
      </section>

      {/* 功能卡片列表 */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {comingFeatures.map((feature) => (
          <Card
            key={feature.id}
            className="shadow-elegant rounded-2xl cursor-pointer hover-lift transition-all"
            onClick={() => handleFeatureClick(feature.title)}
          >
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl mb-1">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">
                    {feature.status === 'developing' ? '开发中' : '规划中'}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" onClick={(e) => {
                e.stopPropagation();
                handleFeatureClick(feature.title);
              }}>
                查看详情
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
