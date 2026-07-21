import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

export function PrivacyPolicy({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>隐私政策</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4 text-sm text-muted-foreground">
            <h3 className="text-foreground font-semibold">一、我们收集的信息</h3>
            <p>1.1 <strong>激活码信息</strong>：您在首页输入的16位激活码，用于验证会员权限。</p>
            <p>1.2 <strong>上传的文本内容</strong>：您通过文件上传功能提交的 .txt/.docx 小说原文，用于AI仿写处理。</p>
            <p>1.3 <strong>仿写参数配置</strong>：包括您选择的AI模型、仿写模式、五维权重设置、自定义指令等参数。</p>
            <p>1.4 <strong>生成的仿写结果</strong>：AI根据原文和参数生成的仿写文本内容。</p>
            <p>1.5 <strong>设备与浏览器信息</strong>：包括设备型号、操作系统版本、浏览器类型、IP地址等技术信息，用于服务优化和安全防护。</p>
            
            <h3 className="text-foreground font-semibold mt-6">二、信息使用方式</h3>
            <p>2.1 <strong>提供核心服务</strong>：将您上传的原文和参数配置发送至Edge Function，调用Meoo AI API进行仿写生成。</p>
            <p>2.2 <strong>改进服务质量</strong>：分析用户使用习惯，优化AI模型选择建议、默认参数设置等。</p>
            <p>2.3 <strong>安全防护</strong>：检测异常使用行为，防止恶意攻击和滥用。</p>
            <p>2.4 <strong>客服支持</strong>：当您联系客服时，可能需要提供相关信息以便快速解决问题。</p>
            
            <h3 className="text-foreground font-semibold mt-6">三、数据存储与安全</h3>
            <p>3.1 <strong>本地存储</strong>：您的激活状态存储在浏览器localStorage中，不会上传至服务器。</p>
            <p>3.2 <strong>临时处理</strong>：上传的文本内容和生成的仿写结果仅在内存中临时处理，完成后立即释放，不持久化存储。</p>
            <p>3.3 <strong>传输加密</strong>：所有数据通过HTTPS加密传输，确保传输过程中的安全性。</p>
            <p>3.4 <strong>API密钥保护</strong>：Meoo AI的API密钥存储在Edge Function环境变量中，前端无法获取。</p>
            
            <h3 className="text-foreground font-semibold mt-6">四、信息共享与披露</h3>
            <p>4.1 我们不会向第三方出售或泄露您的个人信息。</p>
            <p>4.2 在以下情况下，我们可能会共享必要信息：</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>获得您的明确同意</li>
              <li>为履行法律义务或响应司法程序</li>
              <li>与云服务提供商（Meoo Cloud）合作，但其仅作为技术基础设施提供方，受保密协议约束</li>
              <li>与AI服务提供商（Meoo AI）交互，但仅发送必要的文本内容和参数，不包含个人身份信息</li>
            </ul>
            
            <h3 className="text-foreground font-semibold mt-6">五、Cookie与类似技术</h3>
            <p>5.1 本平台使用localStorage存储激活状态，不使用传统Cookie。</p>
            <p>5.2 您可以清除浏览器数据来删除本地存储的激活状态，但这会导致需要重新激活。</p>
            
            <h3 className="text-foreground font-semibold mt-6">六、您的权利</h3>
            <p>6.1 <strong>访问权</strong>：您可以查看自己上传的文本和生成的仿写结果（在下载前）。</p>
            <p>6.2 <strong>删除权</strong>：由于我们不持久化存储用户内容，您的数据在处理完成后自动消失。</p>
            <p>6.3 <strong>撤回同意</strong>：您可以停止使用本平台服务，即视为撤回对数据处理的同意。</p>
            <p>6.4 您可以通过客服微信 xnpc01 行使上述权利或提出疑问。</p>
            
            <h3 className="text-foreground font-semibold mt-6">七、未成年人保护</h3>
            <p>7.1 我们不建议未满18周岁的用户使用本平台服务。</p>
            <p>7.2 如监护人发现未成年人在未获同意的情况下使用了本平台，请联系我们删除相关数据。</p>
            
            <h3 className="text-foreground font-semibold mt-6">八、政策更新</h3>
            <p>8.1 我们可能适时修订本隐私政策，更新后的政策将在平台上公布。</p>
            <p>8.2 重大变更时，我们会通过显著方式通知您。</p>
            
            <h3 className="text-foreground font-semibold mt-6">九、联系我们</h3>
            <p>如您对本隐私政策有任何疑问或建议，请联系客服微信：xnpc01</p>
            
            <p className="mt-6 text-xs">最后更新日期：2026年7月</p>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
