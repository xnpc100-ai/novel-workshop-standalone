import { Button } from '@/components/ui/button';
import { Copy, QrCode } from 'lucide-react';
import { toast } from 'sonner';

export function PaymentSection() {
  const copyWechat = () => {
    navigator.clipboard.writeText('xnpc01');
    toast.success('微信号已复制');
  };

  return (
    <section id="payment" className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-foreground mb-8">
          限时会员权益套餐
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* 左侧：官方收款码 */}
          <div className="bg-card rounded-2xl p-6 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <QrCode className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">官方收款码</h3>
            </div>

            {/* 收款码 */}
            <div className="rounded-xl overflow-hidden mb-4">
              <img
                src="https://conversation.cdn.meoo.host/conversations/335332197118652416/image/2026-07-18/1784398408883-323600d8192d035e2ff089bc2c670d8c.jpg?auth_key=74c88af8ac5f1c44365237af92ac6e230ef357332c1a3d1708ba22ccfa208e69"
                alt="微信收款码"
                className="w-full h-auto"
              />
            </div>

            {/* 定价 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">月卡</p>
                  <p className="text-xs text-muted-foreground">解锁全部模型 + 无限制仿写</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">¥60</p>
                  <p className="text-xs text-muted-foreground line-through">原价¥198</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg border-2 border-primary/30">
                <div>
                  <p className="font-medium text-foreground">年卡 🔥推荐</p>
                  <p className="text-xs text-muted-foreground">含月卡所有权益 + 专属加赠</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">¥398</p>
                  <p className="text-xs text-muted-foreground line-through">原价¥998</p>
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mt-4 text-center">
              付款后自动获取16位激活码，输入上方弹窗即可激活使用
            </p>
          </div>

          {/* 右侧：专属客服微信 */}
          <div className="bg-card rounded-2xl p-6 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <Copy className="w-6 h-6 text-accent" />
              <h3 className="text-lg font-semibold text-foreground">专属客服微信</h3>
            </div>

            {/* 微信号 */}
            <div className="bg-secondary/50 rounded-xl p-6 mb-4">
              <p className="text-sm text-muted-foreground mb-2">微信号</p>
              <button
                onClick={copyWechat}
                className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors cursor-pointer"
              >
                xnpc01
              </button>
              <p className="text-xs text-muted-foreground mt-2">点击复制</p>
            </div>

            {/* 备注要求 */}
            <div className="space-y-2 text-sm">
              <p className="text-muted-foreground">
                <span className="text-foreground font-medium">开卡必备备注：</span>
                小说开卡
              </p>
              <p className="text-muted-foreground">
                添加对接开通权限、发放全套干货素材、享受一对一专属售后答疑
              </p>
            </div>

            {/* 微信二维码 */}
            <div className="mt-4 rounded-xl overflow-hidden">
              <img
                src="https://conversation.cdn.meoo.host/conversations/335332197118652416/image/2026-07-18/1784398400931-74bb13509c564e989c9a15c716bbbbe3.jpg?auth_key=7693d9426eb219fb7c6b18adb63476e81b7d33bb5723d7a43357e85ca853741f"
                alt="客服微信二维码"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
