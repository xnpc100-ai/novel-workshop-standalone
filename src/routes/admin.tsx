import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { supabase } from '@/supabase/client';
import { toast } from 'sonner';
import { Check, X, Eye, Trash2 } from 'lucide-react';

export const Route = createFileRoute('/admin')({
  component: AdminPage,
});

interface PendingShare {
  id: string;
  nickname: string;
  avatar_url: string | null;
  platform: string;
  title: string;
  income: string | null;
  story: string;
  background: string | null;
  breakthrough: string | null;
  current_status: string | null;
  advice: string | null;
  tips: string | null;
  achievement: string | null;
  images: any;
  status: string;
  created_at: string;
}

function AdminPage() {
  const navigate = useNavigate();
  const [pendingShares, setPendingShares] = useState<PendingShare[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedShare, setSelectedShare] = useState<PendingShare | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    loadPendingShares();
  }, []);

  const loadPendingShares = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('author_shares')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPendingShares(data || []);
    } catch (error) {
      console.error('加载待审核分享失败:', error);
      toast.error('加载失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (shareId: string) => {
    try {
      setProcessing(shareId);
      const { error } = await supabase
        .from('author_shares')
        .update({
          status: 'approved',
          reviewed_at: new Date().toISOString()
        })
        .eq('id', shareId);

      if (error) throw error;

      toast.success('审核通过');
      setPendingShares(prev => prev.filter(s => s.id !== shareId));
      setSelectedShare(null);
    } catch (error: any) {
      console.error('审核失败:', error);
      toast.error(error.message || '审核失败');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (shareId: string) => {
    try {
      setProcessing(shareId);
      const { error } = await supabase
        .from('author_shares')
        .update({
          status: 'rejected',
          reviewed_at: new Date().toISOString()
        })
        .eq('id', shareId);

      if (error) throw error;

      toast.success('已拒绝');
      setPendingShares(prev => prev.filter(s => s.id !== shareId));
      setSelectedShare(null);
    } catch (error: any) {
      console.error('拒绝失败:', error);
      toast.error(error.message || '操作失败');
    } finally {
      setProcessing(null);
    }
  };

  const handleDelete = async (shareId: string) => {
    if (!confirm('确定要删除这条分享吗？此操作不可恢复。')) return;

    try {
      setProcessing(shareId);
      const { error } = await supabase
        .from('author_shares')
        .delete()
        .eq('id', shareId);

      if (error) throw error;

      toast.success('已删除');
      setPendingShares(prev => prev.filter(s => s.id !== shareId));
      setSelectedShare(null);
    } catch (error: any) {
      console.error('删除失败:', error);
      toast.error(error.message || '删除失败');
    } finally {
      setProcessing(null);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleString('zh-CN');
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">内容审核管理</h1>
            <p className="text-sm text-muted-foreground mt-1">审核用户提交的作者心得分享</p>
          </div>
          <Button variant="outline" onClick={() => navigate({ to: '/profile' })}>
            返回个人中心
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              待审核列表
              <Badge variant="secondary">{pendingShares.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">加载中...</div>
            ) : pendingShares.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">暂无待审核内容</div>
            ) : (
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {pendingShares.map((share) => (
                    <div
                      key={share.id}
                      className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                    >
                      {/* 头部信息 */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                            {share.avatar_url ? (
                              <img src={share.avatar_url} alt="头像" className="w-full h-full object-cover" />
                            ) : (
                              <span>👤</span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{share.nickname}</p>
                            <p className="text-xs text-muted-foreground">{share.platform} · {share.title}</p>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">{formatDate(share.created_at)}</span>
                      </div>

                      {/* 内容预览 */}
                      <p className="text-sm text-foreground mb-3 line-clamp-2">{share.story}</p>

                      {/* 收益信息 */}
                      {share.income && (
                        <Badge variant="secondary" className="mb-3">{share.income}</Badge>
                      )}

                      {/* 操作按钮 */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => setSelectedShare(share)}
                          variant="outline"
                          className="flex-1"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          查看详情
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleApprove(share.id)}
                          disabled={processing === share.id}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          通过
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleReject(share.id)}
                          disabled={processing === share.id}
                          variant="destructive"
                          className="flex-1"
                        >
                          <X className="w-4 h-4 mr-1" />
                          拒绝
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleDelete(share.id)}
                          disabled={processing === share.id}
                          variant="outline"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        {/* 详情对话框 */}
        <Dialog open={!!selectedShare} onOpenChange={() => setSelectedShare(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                  {selectedShare?.avatar_url ? (
                    <img src={selectedShare.avatar_url} alt="头像" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-lg">👤</span>
                  )}
                </div>
                <div>
                  <p className="text-lg">{selectedShare?.nickname}</p>
                  <p className="text-xs text-muted-foreground">{selectedShare?.platform} · {selectedShare?.title}</p>
                </div>
              </DialogTitle>
              <DialogDescription>{selectedShare?.story}</DialogDescription>
            </DialogHeader>
            {selectedShare && (
              <div className="py-4 space-y-4">
                {selectedShare.background && (
                  <div>
                    <h4 className="font-medium text-foreground mb-2">📖 创作背景</h4>
                    <p className="text-sm text-muted-foreground">{selectedShare.background}</p>
                  </div>
                )}
                {selectedShare.breakthrough && (
                  <div>
                    <h4 className="font-medium text-foreground mb-2">🚀 突破契机</h4>
                    <p className="text-sm text-muted-foreground">{selectedShare.breakthrough}</p>
                  </div>
                )}
                {selectedShare.current_status && (
                  <div>
                    <h4 className="font-medium text-foreground mb-2">📊 当前状态</h4>
                    <p className="text-sm text-muted-foreground">{selectedShare.current_status}</p>
                  </div>
                )}
                {selectedShare.images && Array.isArray(selectedShare.images) && selectedShare.images.length > 0 && (
                  <div>
                    <h4 className="font-medium text-foreground mb-2">📸 配图</h4>
                    <div className={`grid gap-2 ${
                      selectedShare.images.length === 1 ? 'grid-cols-1' :
                      selectedShare.images.length === 2 ? 'grid-cols-2' :
                      selectedShare.images.length === 3 ? 'grid-cols-3' :
                      'grid-cols-3'
                    }`}>
                      {selectedShare.images.slice(0, 9).map((img: string, idx: number) => (
                        <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-muted">
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {selectedShare.advice && (
                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <h4 className="font-medium text-foreground mb-2">💡 经验分享</h4>
                    <p className="text-sm text-muted-foreground">{selectedShare.advice}</p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
