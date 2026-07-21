import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Shield, AlertCircle } from 'lucide-react';
import { UserAgreement } from '@/components/legal/UserAgreement';
import { PrivacyPolicy } from '@/components/legal/PrivacyPolicy';
import { ComplianceStatement } from '@/components/legal/ComplianceStatement';

export function ActivationSection() {
  const [cardCode, setCardCode] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { activate } = useAuth();

  const handleActivate = async () => {
    // 前端校验
    if (!agreed) {
      setError('请先勾选用户协议');
      return;
    }
    if (cardCode.length !== 16) {
      setError('激活码必须为16位字符');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const success = await activate(cardCode);

      if (success) {
        toast.success('激活成功！请绑定邮箱');
        // 不再直接跳转，而是显示邮箱绑定弹窗（由AuthContext控制）
      } else {
        setError('激活码无效，请检查后重新输入');
      }
    } catch (err) {
      setError('网络异常，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto">
        <div className="bg-card rounded-3xl p-8 sm:p-10 border border-border shadow-elegant-lg hover-lift animate-fade-in-up">
          {/* 标题 */}
          <div className="text-center mb-8">
            <div className="inline-flex p-4 rounded-2xl bg-primary/10 mb-4">
              <Shield className="w-14 h-14 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">激活您的专属权限</h2>
            <p className="text-sm text-muted-foreground">输入16位激活码解锁全部功能</p>
          </div>

          {/* 输入框 */}
          <div className="space-y-5">
            <div>
              <Input
                type="text"
                placeholder="请输入16位激活码"
                value={cardCode}
                onChange={(e) => {
                  setCardCode(e.target.value.replace(/\s/g, '').toUpperCase());
                  setError('');
                }}
                maxLength={16}
                className="text-center text-lg tracking-[0.3em] font-mono h-14 rounded-xl border-2 focus:border-primary transition-all"
              />
              {error && (
                <div className="flex items-center gap-2 mt-3 text-destructive text-sm animate-fade-in-up">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* 协议勾选 */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-secondary/50">
              <Checkbox
                id="agreement"
                checked={agreed}
                onCheckedChange={(checked) => setAgreed(checked as boolean)}
                className="mt-0.5"
              />
              <Label htmlFor="agreement" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
                我已阅读并同意
                <UserAgreement>
                  <a href="#" className="text-primary hover:underline ml-1">《用户协议》</a>
                </UserAgreement>
                、
                <PrivacyPolicy>
                  <a href="#" className="text-primary hover:underline ml-1">《隐私政策》</a>
                </PrivacyPolicy>
                、
                <ComplianceStatement>
                  <a href="#" className="text-primary hover:underline ml-1">《合规创作声明》</a>
                </ComplianceStatement>
              </Label>
            </div>

            {/* 激活按钮 */}
            <Button
              onClick={handleActivate}
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-primary-light hover:shadow-elegant text-primary-foreground font-semibold py-7 text-lg rounded-xl transition-all click-feedback"
            >
              {loading ? '激活中...' : '立即激活'}
            </Button>
          </div>

          {/* 底部链接 */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <a href="#payment" className="hover:text-primary transition-colors font-medium">获取激活码</a>
            <span className="mx-3 text-border">|</span>
            <a href="#consult" className="hover:text-primary transition-colors font-medium">咨询客服</a>
          </div>
        </div>
      </div>
    </section>
  );
}
