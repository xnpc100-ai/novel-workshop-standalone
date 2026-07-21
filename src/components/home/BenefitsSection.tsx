import { CheckCircle } from 'lucide-react';

export function BenefitsSection() {
  const monthlyBenefits = [
    '解锁全部AI模型，无限制仿写次数',
    '全字数创作档位（2000字-3000万字）',
    '全套基础变现教程',
    '价值1980元海外网文赚钱实战教程',
    '每月4次定制小说封面+封面提示词优化',
  ];

  const yearlyBenefits = [
    ...monthlyBenefits,
    '新功能优先内测资格',
    '一对一专属答疑服务',
    '海外赛道专属资源群',
    '定期爆款书单更新',
    '价值3980元小说剧转AI漫剧本工具大礼包',
    '每月10次定制小说封面',
  ];

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-foreground mb-8">
          会员专属权益
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* 月卡权益 */}
          <div className="bg-card rounded-2xl p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">月卡权益</h3>
              <span className="text-primary font-bold">¥60/月</span>
            </div>
            <ul className="space-y-3">
              {monthlyBenefits.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-accent-green flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 年卡权益 */}
          <div className="bg-card rounded-2xl p-6 border-2 border-primary/30 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-medium">
              限时特惠
            </div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">年卡权益 🔥</h3>
              <span className="text-primary font-bold">¥398/年</span>
            </div>
            <ul className="space-y-3">
              {yearlyBenefits.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-accent-green flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
