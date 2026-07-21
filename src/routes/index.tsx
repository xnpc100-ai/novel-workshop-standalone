import { createFileRoute } from '@tanstack/react-router';
import { TopNavbar } from '@/components/TopNavbar';
import { HeroSection } from '@/components/home/HeroSection';
import { ActivationSection } from '@/components/home/ActivationSection';
import { PaymentSection } from '@/components/home/PaymentSection';
import { BenefitsSection } from '@/components/home/BenefitsSection';
import { ContentSection } from '@/components/home/ContentSection';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen">
      <TopNavbar />
      <HeroSection />
      <ActivationSection />
      <PaymentSection />
      <BenefitsSection />
      <ContentSection />
      
      {/* 底部页脚 */}
      <footer className="py-8 px-4 border-t border-border mt-12">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <p className="text-xs text-muted-foreground">
            合规须知：本工具仅用于个人写作练习、学习参考。请勿在未获得原著版权授权的情况下进行商业使用，违规使用产生的法律风险由用户自行承担。
          </p>
          <p className="text-xs text-muted-foreground">
            激活码为虚拟商品，一经激活概不退换，请确认后购买
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <a href="https://sqai.shop/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              SqAI菱形AI综合平台
            </a>
            <span className="text-muted-foreground">|</span>
            <a href="https://joyful-narwhal-112ef4.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              菱形AI图办秘书
            </a>
          </div>
          <p className="text-xs text-muted-foreground">
            创作交流与教程：添加微信 xnpc000（备注：小说），可免费进社群学习
          </p>
        </div>
      </footer>
    </div>
  );
}
