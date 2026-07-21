import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

export function UserAgreement({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>用户协议</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4 text-sm text-muted-foreground">
            <h3 className="text-foreground font-semibold">一、服务说明</h3>
            <p>1.1 小说仿写工坊是一款基于AI技术的智能写作辅助工具，提供文本分析、风格模仿、内容生成等服务。</p>
            <p>1.2 本平台采用会员制服务模式，分为月卡（¥60/月）和年卡（¥398/年）两种套餐，具体权益以页面展示为准。</p>
            <p>1.3 用户通过购买激活码解锁全部功能，包括6款主流AI模型无限制调用、全字数档位创作、智能质检等核心能力。</p>
            
            <h3 className="text-foreground font-semibold mt-6">二、账号与激活</h3>
            <p>2.1 用户付款后获得16位激活码，在首页输入框中完成激活即可使用全部功能。</p>
            <p>2.2 激活状态存储在本地浏览器中，清除浏览器数据可能导致需要重新激活。</p>
            <p>2.3 激活码仅限单人使用，不得转让、出借或分享给他人。</p>
            
            <h3 className="text-foreground font-semibold mt-6">三、功能使用规范</h3>
            <p>3.1 <strong>文件上传</strong>：支持 .txt/.docx 格式，建议单文件不超过300万字。</p>
            <p>3.2 <strong>AI模型选择</strong>：平台提供Qwen3.6-Plus、Qwen3-Max、Kimi K2.5、DeepSeek V3.2、GLM-5、MiniMax M2.5六款模型，用户可根据需求选择。</p>
            <p>3.3 <strong>参数调节</strong>：用户可自定义剧情保留度、人设保留度、爽点保留度、逻辑保留度、风格保留度等五维权重，以及AI创意度等高级参数。</p>
            <p>3.4 <strong>流式输出</strong>：仿写结果通过SSE技术实时流式显示，用户可随时查看生成进度。</p>
            <p>3.5 <strong>下载功能</strong>：支持将仿写结果导出为TXT或DOCX格式。</p>
            
            <h3 className="text-foreground font-semibold mt-6">四、付费与退款</h3>
            <p>4.1 本平台提供微信支付和客服微信对接两种付费方式。</p>
            <p>4.2 会员服务到期后，相关权益自动终止，如需继续使用需重新购买。</p>
            <p>4.3 除法律法规另有规定外，付费服务一经开通，不支持退款。</p>
            <p>4.4 如遇技术问题导致无法正常使用，用户可联系客服协商处理。</p>
            
            <h3 className="text-foreground font-semibold mt-6">五、服务变更与终止</h3>
            <p>5.1 本平台有权根据业务发展需要调整服务内容、收费标准或暂停部分功能，并将提前通知用户。</p>
            <p>5.2 如用户违反本协议或相关法律法规，本平台有权暂停或终止该用户的服务。</p>
            <p>5.3 因不可抗力、网络故障、系统维护等原因导致的服务中断，本平台不承担赔偿责任。</p>
            
            <h3 className="text-foreground font-semibold mt-6">六、免责声明</h3>
            <p>6.1 本平台提供的AI仿写服务仅作为创作辅助工具，不对生成内容的准确性、合法性、适用性做任何保证。</p>
            <p>6.2 用户应当自行判断使用本平台生成内容的合法性和适用性，本平台不对用户的使用后果承担责任。</p>
            <p>6.3 因用户操作不当、设备问题、网络环境等导致的损失，由用户自行承担。</p>
            
            <h3 className="text-foreground font-semibold mt-6">七、协议修改</h3>
            <p>7.1 本平台有权根据需要修改本协议内容，修改后的协议将在平台上公布。</p>
            <p>7.2 如用户不同意修改后的协议，有权停止使用本平台服务；继续使用视为接受修改后的协议。</p>
            
            <h3 className="text-foreground font-semibold mt-6">八、联系方式</h3>
            <p>如您对本协议有任何疑问，请联系客服微信：xnpc01</p>
            
            <p className="mt-6 text-xs">最后更新日期：2026年7月</p>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
