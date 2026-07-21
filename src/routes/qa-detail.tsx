import { createFileRoute, Link } from '@tanstack/react-router';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/supabase/client';
import {
  ArrowLeft, MessageCircle, Eye, HelpCircle, Clock,
  Heart, Share2, Bookmark, Send, ThumbsUp, Users
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export const Route = createFileRoute('/qa-detail')({
  component: QADetailPage,
});

interface QAAnswer {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  nickname?: string;
  avatar_url?: string | null;
}

interface QAPost {
  id: string;
  title: string;
  content: string;
  category: string;
  answer_count: number | null;
  view_count: number | null;
  created_at: string;
  user_id?: string | null;
}

function QADetailPage() {
  const { id } = Route.useSearch();
  const [qa, setQa] = useState<QAPost | null>(null);
  const [answers, setAnswers] = useState<QAAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [answerContent, setAnswerContent] = useState('');

  useEffect(() => {
    if (id) {
      loadQADetail();
    }
  }, [id]);

  const loadQADetail = async () => {
    try {
      const { data: postData, error: postError } = await supabase
        .from('qa_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (postError || !postData) {
        console.warn('加载问题失败:', postError?.message);
        setLoading(false);
        return;
      }

      setQa(postData as QAPost);

      const { data: answersData, error: answersError } = await supabase
        .from('qa_answers')
        .select('*')
        .eq('post_id', id)
        .order('created_at', { ascending: true });

      if (answersError) {
        console.warn('加载回答失败:', answersError.message);
      } else if (answersData) {
        setAnswers(answersData as QAAnswer[]);
      }

      setLoading(false);
    } catch (error) {
      console.error('加载详情异常:', error);
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answerContent.trim()) {
      toast.error('请输入回答内容');
      return;
    }

    try {
      const session = (await supabase.auth.getSession()).data.session;
      if (!session) {
        toast.error('请先登录');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/submit-qa-answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          postId: id,
          content: answerContent,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      toast.success('回答发布成功');
      setAnswerContent('');
      loadQADetail();
    } catch (error) {
      const message = error instanceof Error ? error.message : '发布失败';
      toast.error(message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="shadow-elegant rounded-2xl max-w-md">
          <CardContent className="py-12 text-center">
            <HelpCircle className="w-16 h-16 mx-auto mb-4 text-primary/40 animate-pulse" />
            <p className="text-muted-foreground">加载中...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!qa) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="shadow-elegant rounded-2xl max-w-md">
          <CardContent className="py-12 text-center">
            <HelpCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-30" />
            <h2 className="text-xl font-semibold mb-2">问题不存在</h2>
            <p className="text-muted-foreground mb-4">该问题可能已被删除或ID不正确</p>
            <Link to="/community">
              <Button>返回社区</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16">
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link to="/community">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                返回
              </Button>
            </Link>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="secondary">{qa.category}</Badge>
                <span className="text-sm text-muted-foreground">
                  {new Date(qa.created_at).toLocaleDateString('zh-CN')}
                </span>
              </div>
              <h1 className="text-lg font-semibold">{qa.title}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-elegant rounded-2xl">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
                      U
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">提问者</span>
                      <span className="text-xs text-muted-foreground">提问者</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(qa.created_at).toLocaleString('zh-CN')}</span>
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{qa.view_count || 0} 浏览</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground whitespace-pre-line">{qa.content}</p>
                <div className="flex items-center gap-4 mt-4 pt-4 border-t">
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Heart className="w-4 h-4" />
                    <span>关注问题</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Share2 className="w-4 h-4" />
                    <span>分享</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Bookmark className="w-4 h-4" />
                    <span>收藏</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                {answers.length} 个回答
              </h2>

              {answers.length > 0 ? (
                <div className="space-y-4">
                  {answers.map((answer) => (
                    <Card key={answer.id} className="shadow-elegant rounded-2xl">
                      <CardHeader className="pb-3">
                        <div className="flex items-start gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={answer.avatar_url || undefined} />
                            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
                              {(answer.nickname || 'U')[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{answer.nickname || '匿名用户'}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(answer.created_at).toLocaleString('zh-CN')}
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-foreground whitespace-pre-line">{answer.content}</p>
                        <div className="flex items-center gap-4 pt-3 border-t">
                          <Button variant="ghost" size="sm" className="gap-1">
                            <ThumbsUp className="w-4 h-4" />
                            <span>点赞</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="gap-1">
                            <MessageCircle className="w-4 h-4" />
                            <span>回复</span>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="shadow-elegant rounded-2xl">
                  <CardContent className="py-12 text-center">
                    <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-30" />
                    <p className="text-muted-foreground mb-4">暂无回答，快来帮助提问者吧！</p>
                  </CardContent>
                </Card>
              )}
            </div>

            <Card className="shadow-elegant rounded-2xl">
              <CardHeader>
                <h3 className="font-semibold">写下你的回答</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  placeholder="分享你的经验和见解..."
                  value={answerContent}
                  onChange={(e) => setAnswerContent(e.target.value)}
                  className="min-h-[150px]"
                />
                <div className="flex justify-end">
                  <Button onClick={handleSubmitAnswer} className="gap-2" disabled={!answerContent.trim()}>
                    <Send className="w-4 h-4" />
                    发布回答
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="shadow-elegant rounded-2xl">
              <CardHeader>
                <h3 className="font-semibold flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-primary" />
                  相关问题
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center py-4">
                  更多相关问题即将上线
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-elegant rounded-2xl">
              <CardHeader>
                <h3 className="font-semibold flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  问题统计
                </h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-2 rounded-lg bg-secondary/50">
                  <span className="text-sm">回答数</span>
                  <span className="text-sm font-semibold">{qa.answer_count || 0}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-secondary/50">
                  <span className="text-sm">浏览量</span>
                  <span className="text-sm font-semibold">{qa.view_count || 0}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-secondary/50">
                  <span className="text-sm">分类</span>
                  <Badge variant="secondary">{qa.category}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
