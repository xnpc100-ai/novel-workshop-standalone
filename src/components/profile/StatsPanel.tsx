import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/supabase/client';
import { FileText, TrendingUp, Clock, Award } from 'lucide-react';

interface StatsData {
  totalRecords: number;
  totalOriginalChars: number;
  totalRewrittenChars: number;
  avgExpansionRate: number;
  mostUsedModel: string;
  lastRewriteTime: string | null;
}

export function StatsPanel() {
  const [stats, setStats] = useState<StatsData>({
    totalRecords: 0,
    totalOriginalChars: 0,
    totalRewrittenChars: 0,
    avgExpansionRate: 0,
    mostUsedModel: '-',
    lastRewriteTime: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      
      // 获取所有记录
      const { data: records, error } = await supabase
        .from('rewrite_records')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!records || records.length === 0) {
        setStats({
          totalRecords: 0,
          totalOriginalChars: 0,
          totalRewrittenChars: 0,
          avgExpansionRate: 0,
          mostUsedModel: '-',
          lastRewriteTime: null,
        });
        return;
      }

      // 计算统计数据
      const totalRecords = records.length;
      const totalOriginalChars = records.reduce((sum, r) => sum + r.original_text_length, 0);
      const totalRewrittenChars = records.reduce((sum, r) => sum + r.rewritten_text_length, 0);
      const avgExpansionRate = totalOriginalChars > 0 
        ? (totalRewrittenChars / totalOriginalChars) * 100 
        : 0;

      // 找出最常用的模型
      const modelCount: Record<string, number> = {};
      records.forEach(r => {
        modelCount[r.model_used] = (modelCount[r.model_used] || 0) + 1;
      });
      const mostUsedModel = Object.entries(modelCount)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || '-';

      // 最后一次仿写时间
      const lastRewriteTime = records[0]?.created_at || null;

      setStats({
        totalRecords,
        totalOriginalChars,
        totalRewrittenChars,
        avgExpansionRate,
        mostUsedModel,
        lastRewriteTime,
      });
    } catch (error) {
      console.error('加载统计数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-border animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-24 mb-2"></div>
              <div className="h-8 bg-muted rounded w-32"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
            <FileText className="w-4 h-4" />
            总仿写次数
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-foreground">{stats.totalRecords}</p>
          <p className="text-xs text-muted-foreground mt-1">累计完成仿写任务</p>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            平均扩写率
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-foreground">
            {stats.avgExpansionRate.toFixed(0)}%
          </p>
          <p className="text-xs text-muted-foreground mt-1">仿写后字数增长比例</p>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
            <Clock className="w-4 h-4" />
            最近仿写
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-bold text-foreground">
            {stats.lastRewriteTime 
              ? new Date(stats.lastRewriteTime).toLocaleDateString()
              : '-'
            }
          </p>
          <p className="text-xs text-muted-foreground mt-1">上次仿写时间</p>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
            <Award className="w-4 h-4" />
            常用模型
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-bold text-foreground">{stats.mostUsedModel}</p>
          <p className="text-xs text-muted-foreground mt-1">使用频率最高的AI模型</p>
        </CardContent>
      </Card>
    </div>
  );
}
