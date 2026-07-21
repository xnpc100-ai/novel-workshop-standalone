import { createFileRoute, Link } from '@tanstack/react-router';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { chinesePlatforms, englishPlatforms, type GlobalPlatform } from '@/data/globalPlatforms';
import {
  ArrowLeft, Globe, TrendingUp, Users, Award, Star,
  CheckCircle, AlertTriangle, ExternalLink, BookOpen,
  Crown, Medal, Trophy
} from 'lucide-react';
import { useState } from 'react';

export const Route = createFileRoute('/global-rankings')({
  component: GlobalRankingsPage,
});

function PlatformCard({ platform, rank }: { platform: GlobalPlatform; rank: number }) {
  const getRankIcon = (r: number) => {
    if (r === 1) return <Crown className="w-6 h-6 text-yellow-500" />;
    if (r === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (r === 3) return <Trophy className="w-6 h-6 text-orange-500" />;
    return <span className="text-lg font-bold text-muted-foreground">#{r}</span>;
  };

  const getRankBg = (r: number) => {
    if (r === 1) return 'bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 border-yellow-500/30';
    if (r === 2) return 'bg-gradient-to-br from-gray-400/20 to-gray-400/5 border-gray-400/30';
    if (r === 3) return 'bg-gradient-to-br from-orange-500/20 to-orange-500/5 border-orange-500/30';
    return 'bg-secondary/30';
  };

  return (
    <Card className={`shadow-elegant rounded-2xl border ${getRankBg(rank)} hover:shadow-lg transition-shadow`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              {getRankIcon(rank)}
            </div>
            <div>
              <h3 className="font-bold text-lg">{platform.name}</h3>
              <p className="text-xs text-muted-foreground">{platform.country}</p>
            </div>
          </div>
          <Badge variant={platform.language === 'chinese' ? 'default' : 'secondary'}>
            {platform.language === 'chinese' ? '中文' : 'English'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 关键指标 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-secondary/50">
            <Users className="w-4 h-4 text-primary mb-1" />
            <p className="text-sm font-semibold">{platform.dailyActiveUsers}</p>
            <p className="text-xs text-muted-foreground">日活用户</p>
          </div>
          <div className="p-3 rounded-lg bg-secondary/50">
            <TrendingUp className="w-4 h-4 text-primary mb-1" />
            <p className="text-sm font-semibold">{platform.monthlyRevenue}</p>
            <p className="text-xs text-muted-foreground">月收入</p>
          </div>
        </div>

        {/* 合同信息 */}
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <BookOpen className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-muted-foreground">签约模式：</span>
              <span className="text-foreground">{platform.contractType}</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Star className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-muted-foreground">分成比例：</span>
              <span className="text-foreground">{platform.royaltyRate}</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-muted-foreground">最低字数：</span>
              <span className="text-foreground">{platform.minWords}</span>
            </div>
          </div>
        </div>

        {/* 优缺点 */}
        <div className="space-y-2">
          <div>
            <p className="text-xs font-medium text-green-600 mb-1 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> 优势
            </p>
            <div className="flex flex-wrap gap-1">
              {platform.pros.slice(0, 3).map((pro, i) => (
                <Badge key={i} variant="outline" className="text-xs bg-green-500/10 text-green-700 border-green-500/20">
                  {pro}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-orange-600 mb-1 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> 注意
            </p>
            <div className="flex flex-wrap gap-1">
              {platform.cons.slice(0, 2).map((con, i) => (
                <Badge key={i} variant="outline" className="text-xs bg-orange-500/10 text-orange-700 border-orange-500/20">
                  {con}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* 投稿建议 */}
        <div className="pt-3 border-t">
          <p className="text-xs font-medium text-primary mb-2">投稿建议</p>
          <ul className="space-y-1">
            {platform.submissionTips.slice(0, 2).map((tip, i) => (
              <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                <span className="text-primary">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

function GlobalRankingsPage() {
  const [language, setLanguage] = useState<'chinese' | 'english'>('chinese');

  const platforms = language === 'chinese' ? chinesePlatforms : englishPlatforms;

  return (
    <div className="min-h-screen pb-16">
      {/* 顶部导航 */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link to="/community">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                返回
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-xl font-bold flex items-center gap-2">
                <Globe className="w-6 h-6 text-primary" />
                全球小说网站TOP20排行榜
              </h1>
              <p className="text-sm text-muted-foreground">涵盖中英文主流网文平台，助你找到最适合的创作舞台</p>
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 语言切换 */}
        <Tabs value={language} onValueChange={(v) => setLanguage(v as 'chinese' | 'english')} className="w-full mb-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 rounded-xl bg-secondary p-1">
            <TabsTrigger value="chinese" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              🇨🇳 中文平台 TOP10
            </TabsTrigger>
            <TabsTrigger value="english" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              🌍 English Platforms TOP10
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chinese" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {chinesePlatforms.map((platform) => (
                <PlatformCard key={platform.id} platform={platform} rank={platform.rank} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="english" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {englishPlatforms.map((platform) => (
                <PlatformCard key={platform.id} platform={platform} rank={platform.rank - 10} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* 底部说明 */}
        <Card className="shadow-elegant rounded-2xl mt-8 bg-gradient-to-r from-primary/5 to-primary/10">
          <CardContent className="py-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              数据说明
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                排名综合考量：日活用户数、作者收入水平、平台影响力、新人友好度等多维度指标
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                收入数据为平台作者平均月收入范围，头部作者收入可能远超此范围
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                平台政策和分成比例可能随时调整，请以官方最新公告为准
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                数据来源：各平台官方公开信息、作者社区反馈、行业报告（截至2024年）
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
