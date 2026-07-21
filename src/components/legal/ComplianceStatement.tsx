import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

export function ComplianceStatement({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>合规创作声明</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4 text-sm text-muted-foreground">
            <h3 className="text-foreground font-semibold">一、服务定位</h3>
            <p>1.1 小说仿写工坊是一款AI辅助写作工具，旨在帮助用户学习写作技巧、激发创作灵感、提升文字表达能力。</p>
            <p>1.2 本平台的核心功能是基于用户提供的原文，通过AI技术进行风格模仿和内容重构，生成具有相似风格但表达不同的文本。</p>
            <p>1.3 <strong>重要提示</strong>：本工具仅用于个人写作练习和学习参考，不鼓励、不支持任何形式的抄袭、剽窃行为。</p>
            
            <h3 className="text-foreground font-semibold mt-6">二、知识产权说明</h3>
            <p>2.1 <strong>原著版权</strong>：如您对某部作品进行仿写，应当获得原著作者的授权，或确保符合《著作权法》规定的合理使用情形（如个人学习、研究）。</p>
            <p>2.2 <strong>仿写内容归属</strong>：用户使用本平台生成的仿写内容，其著作权归用户所有，但用户应当确保不侵犯他人的合法权益。</p>
            <p>2.3 <strong>平台权利</strong>：本平台提供的软件、算法、界面设计等内容的知识产权归本平台所有。</p>
            <p>2.4 <strong>商业使用限制</strong>：未经原著作者授权，不得将仿写内容用于商业出版、付费阅读、影视改编等商业用途。</p>
            
            <h3 className="text-foreground font-semibold mt-6">三、禁止行为</h3>
            <p>用户在使用本平台服务时，严禁进行以下行为：</p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li><strong>侵犯版权</strong>：未经授权将他人作品上传进行仿写，并将结果用于商业目的</li>
              <li><strong>违规内容</strong>：上传或生成包含色情、暴力、恐怖主义、分裂主义、歧视性等违法违规内容</li>
              <li><strong>恶意竞争</strong>：利用本平台对他人作品进行恶意模仿、诋毁或不正当竞争</li>
              <li><strong>批量滥用</strong>：通过技术手段绕过平台限制，进行大规模自动化生成和发布</li>
              <li><strong>虚假宣传</strong>：将AI生成内容冒充为完全原创作品进行虚假宣传或欺诈</li>
              <li><strong>传播有害信息</strong>：生成并传播谣言、虚假信息、人身攻击等内容</li>
            </ul>
            
            <h3 className="text-foreground font-semibold mt-6">四、合理使用建议</h3>
            <p>4.1 <strong>学习参考</strong>：将仿写结果作为学习写作技巧的参考，分析AI如何处理情节、人物、风格等要素。</p>
            <p>4.2 <strong>灵感启发</strong>：利用AI生成的内容激发创作灵感，但应当加入自己的思考和创意，形成真正属于自己的作品。</p>
            <p>4.3 <strong>个人练习</strong>：在非公开场合进行写作练习，对比原文和仿写结果，提升自己的表达能力。</p>
            <p>4.4 <strong>注明出处</strong>：如在公开场合分享仿写内容或基于仿写结果创作的作品，应当注明使用了AI辅助工具。</p>
            <p>4.5 <strong>尊重原创</strong>：始终尊重原著作者的劳动成果，不要将仿写内容直接当作原创作品发表。</p>
            
            <h3 className="text-foreground font-semibold mt-6">五、法律责任</h3>
            <p>5.1 用户应当对自己使用本平台生成的内容承担全部法律责任。</p>
            <p>5.2 如用户违反本声明或相关法律法规，本平台有权：</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>暂停或终止该用户的服务，且不退还已支付费用</li>
              <li>删除违规内容</li>
              <li>配合司法机关调查，提供必要信息</li>
              <li>追究用户的法律责任</li>
            </ul>
            <p>5.3 如因用户使用本平台导致第三方权益受损，用户应当自行承担赔偿责任，与本平台无关。</p>
            
            <h3 className="text-foreground font-semibold mt-6">六、智能质检说明</h3>
            <p>6.1 本平台提供智能质检功能，包括基础规范、叙事逻辑、阅读体验、风格适配、内容质感五个维度的评分。</p>
            <p>6.2 质检结果仅供参考，不能保证内容的绝对合规性或质量。</p>
            <p>6.3 用户应当自行对最终内容进行审核，确保符合法律法规和个人要求。</p>
            
            <h3 className="text-foreground font-semibold mt-6">七、举报与反馈</h3>
            <p>7.1 如您发现有人违反本声明或侵犯您的合法权益，请通过以下方式联系我们：</p>
            <p>客服微信：xnpc01</p>
            <p>7.2 我们将在收到举报后尽快核实并处理，必要时配合相关部门调查。</p>
            
            <h3 className="text-foreground font-semibold mt-6">八、声明更新</h3>
            <p>8.1 本平台有权根据法律法规变化和业务发展需要，适时更新本声明。</p>
            <p>8.2 更新后的声明将在平台上公布，重大变更时会通过显著方式通知用户。</p>
            
            <p className="mt-6 text-xs">最后更新日期：2026年7月</p>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
