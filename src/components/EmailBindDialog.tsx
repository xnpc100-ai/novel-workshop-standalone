import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail } from 'lucide-react';
import { toast } from 'sonner';
import { localDb } from '@/supabase/client';

export function EmailBindDialog() {
  const { showEmailBindDialog, setShowEmailBindDialog, setEmail, email } = useAuth();
  const [bindEmail, setBindEmail] = useState('');
  const [bindCode, setBindCode] = useState('');
  const [sendingCode, setSendingCode] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // 如果已经绑定了邮箱，不显示弹窗
  useEffect(() => {
    if (email) {
      setShowEmailBindDialog(false);
    }
  }, [email, setShowEmailBindDialog]);

  // 清理过期验证码
  useEffect(() => {
    localDb.cleanExpiredCodes();
  }, []);

  const handleSendCode = async () => {
    if (!bindEmail.trim()) {
      toast.error('请输入邮箱地址');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(bindEmail)) {
      toast.error('请输入有效的邮箱地址');
      return;
    }

    setSendingCode(true);

    // 模拟发送验证码（实际使用本地存储演示模式）
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 生成6位验证码
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // 存储验证码（10分钟有效）
    localDb.email_codes[bindEmail] = {
      code: code,
      expires: Date.now() + 10 * 60 * 1000
    };
    localDb.save();

    setSendingCode(false);
    setCountdown(60);
    
    // 演示模式：显示验证码
    toast.success(`验证码已发送！（演示模式：${code}）`);

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleVerifyEmail = async () => {
    if (!bindCode || bindCode.length !== 6) {
      toast.error('请输入6位验证码');
      return;
    }

    setVerifying(true);

    // 清理过期验证码
    localDb.cleanExpiredCodes();

    // 验证
    const stored = localDb.email_codes[bindEmail];
    if (!stored) {
      toast.error('验证码已过期，请重新获取');
      setVerifying(false);
      return;
    }

    if (stored.code !== bindCode) {
      toast.error('验证码错误');
      setVerifying(false);
      return;
    }

    // 验证成功
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setVerifying(false);
    setEmail(bindEmail);
    setShowEmailBindDialog(false);
    
    // 删除已使用的验证码
    delete localDb.email_codes[bindEmail];
    localDb.save();
    
    toast.success('邮箱绑定成功！');
  };

  const handleSkip = () => {
    setShowEmailBindDialog(false);
  };

  return (
    <Dialog open={showEmailBindDialog} onOpenChange={setShowEmailBindDialog}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            绑定邮箱
          </DialogTitle>
          <DialogDescription>
            首次激活后需要绑定邮箱，用于接收验证码和找回密码
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label>邮箱地址</Label>
            <Input
              type="email"
              value={bindEmail}
              onChange={(e) => setBindEmail(e.target.value)}
              placeholder="请输入邮箱地址"
              className="mt-1"
              disabled={countdown > 0}
            />
          </div>

          <div>
            <Label>验证码</Label>
            <div className="flex gap-2 mt-1">
              <Input
                value={bindCode}
                onChange={(e) => setBindCode(e.target.value.replace(/\D/g, ''))}
                placeholder="请输入6位验证码"
                maxLength={6}
                className="flex-1"
              />
              <Button
                variant="outline"
                onClick={handleSendCode}
                disabled={sendingCode || countdown > 0}
                className="whitespace-nowrap"
              >
                {countdown > 0 ? `${countdown}s` : sendingCode ? '发送中...' : '获取验证码'}
              </Button>
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground">
            💡 演示模式：点击"获取验证码"后，验证码会显示在成功提示中
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleSkip}>
            稍后绑定
          </Button>
          <Button
            onClick={handleVerifyEmail}
            disabled={!bindEmail || !bindCode || verifying}
            className="bg-primary hover:bg-primary/90"
          >
            {verifying ? '验证中...' : '确认绑定'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
