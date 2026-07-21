import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, Mail, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/supabase/client';
import { toast } from 'sonner';

export const Route = createFileRoute('/messages')({
  component: MessagesPage,
});

interface Message {
  id: string;
  title: string;
  content: string;
  type: string;
  is_read: boolean;
  created_at: string | null;
}

function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error('加载消息失败:', err);
      toast.error('加载消息失败');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', id);

      if (error) throw error;
      setMessages(prev =>
        prev.map(msg => msg.id === id ? { ...msg, is_read: true } : msg)
      );
    } catch (err) {
      console.error('标记已读失败:', err);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'system':
        return <AlertCircle className="w-5 h-5 text-primary" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const unreadCount = messages.filter(m => !m.is_read).length;

  return (
    <div className="min-h-screen pb-16">
      {/* 标题区 */}
      <section className="pt-16 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto animate-fade-in-up">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight flex items-center gap-3">
              <Bell className="w-8 h-8 text-primary" />
              消息通知
            </h1>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-base px-3 py-1">
                {unreadCount} 条未读
              </Badge>
            )}
          </div>
          <p className="text-lg text-muted-foreground">
            系统通知和重要提醒
          </p>
        </div>
      </section>

      {/* 消息列表 */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-elegant rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              全部消息
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">加载中...</div>
            ) : messages.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Bell className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p>暂无消息</p>
              </div>
            ) : (
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        msg.is_read
                          ? 'bg-card border-border'
                          : 'bg-primary/5 border-primary/20'
                      }`}
                      onClick={() => markAsRead(msg.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1">{getIcon(msg.type)}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className={`font-medium ${!msg.is_read ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {msg.title}
                            </h3>
                            {!msg.is_read && (
                              <Badge variant="default" className="text-xs">未读</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{msg.content}</p>
                          <span className="text-xs text-muted-foreground">
                            {msg.created_at ? new Date(msg.created_at).toLocaleString('zh-CN') : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
