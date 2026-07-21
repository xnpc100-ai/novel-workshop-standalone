import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeft, FileText, Clock, BookOpen, AlertCircle, CheckCircle, Shield } from 'lucide-react';

export const Route = createFileRoute('/guide/submission')({
  component: SubmissionGuidePage,
});

function SubmissionGuidePage() {
  return (
    <div className="min-h-screen pb-12">
      {/* 返回按钮 */}
      <section className="pt-8 pb-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link to="/core" className="inline-flex items-center gap-2 text-primary hover:underline text-sm">
            <ArrowLeft className="w-4 h-4" />
            返回创作页
          </Link>
        </div>
      </section>

      {/* 标题区 */}
      <section className="pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary" />
            各平台投稿注意事项详解
          </h1>
          <p className="text-lg text-muted-foreground">
            从字数要求到格式规范，从大纲准备到签约规则，全面解析网文投稿的核心要点
          </p>
        </div>
      </section>

      {/* 主要内容区 */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* 1. 字数要求 */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground mb-2">一、字数要求：起步与单章限制</h2>
              <p className="text-sm text-muted-foreground">不同平台对投稿字数有不同要求，合理控制篇幅是过稿的第一步</p>
            </div>
          </div>

          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="bg-background/50 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">📊 起步字数标准</h3>
              <ul className="space-y-2 ml-4">
                <li><strong>最低门槛：</strong>至少6000字（约3章），这是大多数平台的审稿底线。低于此字数编辑无法判断作品潜力。</li>
                <li><strong>推荐字数：</strong>最好达到1万字（约5章），能更完整展现故事框架、人物设定和文风特点，大幅提高过稿率。</li>
                <li><strong>理想状态：</strong>部分平台（如起点、纵横）建议准备2-3万字正文+完整大纲，便于编辑全面评估。</li>
              </ul>
            </div>

            <div className="bg-background/50 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">📝 单章字数限制</h3>
              <ul className="space-y-2 ml-4">
                <li><strong>上限控制：</strong>单章不超过2100字，这是移动端阅读的最佳长度。过长会导致读者疲劳，影响完读率。</li>
                <li><strong>下限建议：</strong>单章不低于1500字，避免章节过于零碎，影响阅读连贯性。</li>
                <li><strong>最佳区间：</strong>1800-2000字/章，既能保证内容充实，又符合碎片化阅读习惯。</li>
                <li><strong>特殊情况：</strong>高潮章节可适当延长至2500字，但需确保节奏紧凑不拖沓。</li>
              </ul>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <h3 className="font-semibold text-primary mb-2">💡 实用建议</h3>
              <p>投稿前务必检查总字数是否达标，同时确保每章字数在合理区间。可以使用写作软件自动统计字数，避免手动计算误差。对于新人作者，建议先写满1万字再投稿，这样即使被拒也能快速调整方向重新投递。</p>
            </div>
          </div>
        </div>

        {/* 2. 格式规范 */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground mb-2">二、格式规范：专业排版提升印象分</h2>
              <p className="text-sm text-muted-foreground">规范的文档格式体现作者的专业态度，直接影响编辑的第一印象</p>
            </div>
          </div>

          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="bg-background/50 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">📄 文件格式要求</h3>
              <ul className="space-y-2 ml-4">
                <li><strong>首选格式：</strong>Word文档（.doc或.docx），兼容性最好，编辑批注方便。</li>
                <li><strong>备选格式：</strong>纯文本（.txt），适合简单投稿，但无法保留排版格式。</li>
                <li><strong>禁止格式：</strong>PDF、图片、网页链接等不可编辑格式，编辑无法直接审阅和批注。</li>
                <li><strong>文件命名：</strong>建议采用"书名_作者名_字数.docx"格式，如《都市修仙_张三_10000字.docx"，便于编辑归档。</li>
              </ul>
            </div>

            <div className="bg-background/50 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">🔤 字体与排版</h3>
              <ul className="space-y-2 ml-4">
                <li><strong>字体选择：</strong>宋体五号字（10.5pt），这是出版行业标准字体，清晰易读。</li>
                <li><strong>行距设置：</strong>1.0倍行距或1.15倍行距，避免过密导致视觉疲劳，也避免过疏浪费版面。</li>
                <li><strong>首段缩进：</strong>每段首行缩进两字符（约2个汉字宽度），符合中文阅读习惯。</li>
                <li><strong>段落间距：</strong>段前段后不设额外间距，保持紧凑排版。</li>
                <li><strong>页边距：</strong>默认页边距即可，无需特殊调整。</li>
              </ul>
            </div>

            <div className="bg-background/50 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">⚠️ 常见格式错误</h3>
              <ul className="space-y-2 ml-4">
                <li>❌ 使用花哨字体（艺术字、手写体等），影响阅读体验</li>
                <li>❌ 段落之间空行过多，造成版面浪费</li>
                <li>❌ 使用特殊符号装饰（★☆◆◇等），显得不专业</li>
                <li>❌ 章节标题不加粗或不统一，层次混乱</li>
                <li>❌ 全文无标点或使用英文标点，不符合中文规范</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 3. 附带大纲 */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground mb-2">三、附带大纲：让编辑快速了解你的故事</h2>
              <p className="text-sm text-muted-foreground">一份完整的大纲能帮助编辑在5分钟内判断作品潜力，是过稿的关键</p>
            </div>
          </div>

          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="bg-background/50 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">📋 大纲必备要素</h3>
              <ul className="space-y-2 ml-4">
                <li><strong>人设表：</strong>主角及主要配角的姓名、年龄、性格特点、外貌特征、金手指/特殊能力、成长弧光。每人100-200字简介。</li>
                <li><strong>世界观背景：</strong>故事发生的时代、地点、社会规则、力量体系（如有）。300-500字概述。</li>
                <li><strong>主线剧情：</strong>用一句话概括核心冲突（如"废柴少年逆袭成为最强修仙者"），再用300字简述起承转合。</li>
                <li><strong>故事梗概：</strong>按章节或卷次划分，简述每个阶段的主要事件和高潮点。1000-1500字。</li>
                <li><strong>预计字数：</strong>明确标注计划总字数（如30万字、50万字、100万字+），以及预计更新频率（日更/双更）。</li>
                <li><strong>本书亮点：</strong>提炼3-5个核心卖点，如"反套路系统流""群像刻画细腻""世界观宏大"等，每条50字以内。</li>
              </ul>
            </div>

            <div className="bg-background/50 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">🎯 大纲撰写技巧</h3>
              <ul className="space-y-2 ml-4">
                <li><strong>逻辑清晰：</strong>大纲要有明确的因果关系，避免跳跃式叙述。</li>
                <li><strong>重点突出：</strong>用加粗或编号标注关键转折点和爽点，方便编辑快速定位。</li>
                <li><strong>留有余地：</strong>不要把所有细节都写死，给后续创作留出调整空间。</li>
                <li><strong>真实可行：</strong>预计字数要合理，不要为了吸引编辑而夸大篇幅。</li>
              </ul>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <h3 className="font-semibold text-primary mb-2">💡 大纲模板示例</h3>
              <pre className="text-xs bg-background p-3 rounded overflow-x-auto whitespace-pre-wrap">
{`【书名】都市最强仙医
【类型】都市修仙/医术
【预计字数】50万字
【更新频率】日更4000字

【人设】
主角：林凡，22岁，医学院大三学生。性格坚韧不拔，智商在线但不完美。金手指：获得上古医仙传承，可修炼灵气并施展医术。
女主：苏清雪，21岁，校花兼学生会主席。外冷内热，家族有商业背景。
反派：赵天霸，富二代，嫉妒主角才华，多次设局陷害。

【世界观】
现代都市背景，存在隐藏的修仙者群体。灵气复苏初期，普通人不知晓修仙存在。

【主线】
林凡意外获得医仙传承，从校园小透明成长为都市最强仙医，揭开身世之谜，最终守护家人和朋友。

【亮点】
1. 医术+修仙双体系，创新融合
2. 打脸节奏快，爽点密集
3. 感情线细腻，不后宫`}
              </pre>
            </div>
          </div>
        </div>

        {/* 4. 避免一稿多投 */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground mb-2">四、避免一稿多投：合规投稿的基本原则</h2>
              <p className="text-sm text-muted-foreground">一稿多投是行业大忌，可能导致作品被封禁甚至作者被列入黑名单</p>
            </div>
          </div>

          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="bg-background/50 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">🚫 什么是一稿多投</h3>
              <p className="mb-2">一稿多投指同一部作品同时向多个平台或多个编辑投稿的行为。分为两种情况：</p>
              <ul className="space-y-2 ml-4">
                <li><strong>同平台多编辑：</strong>在同一平台内，将同一作品同时发给多位编辑。这是严格禁止的，会被视为扰乱审稿秩序。</li>
                <li><strong>跨平台投稿：</strong>将同一作品同时投递到不同平台。这在未签约前通常允许，但需注意各平台的具体规定。</li>
              </ul>
            </div>

            <div className="bg-background/50 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">✅ 正确做法</h3>
              <ul className="space-y-2 ml-4">
                <li><strong>单平台单编辑：</strong>选择一个心仪的平台，找到对应类型的编辑，只向其一人投稿。等待7-15个工作日未回复后再考虑其他平台。</li>
                <li><strong>跨平台错峰：</strong>如需多平台尝试，建议间隔1-2周再投下一家，避免同时审稿造成资源浪费。</li>
                <li><strong>明确告知：</strong>如果作品已在其他平台发布但未签约，投稿时应主动说明情况，避免版权纠纷。</li>
                <li><strong>签约后专注：</strong>一旦与某平台签约，必须独家发布，不得在其他平台同步更新或转载。</li>
              </ul>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-600 mb-2">⚠️ 违规后果</h3>
              <ul className="space-y-2 ml-4 text-red-700">
                <li>• 作品被下架或删除</li>
                <li>• 作者账号被封禁</li>
                <li>• 被列入平台黑名单，永久禁止投稿</li>
                <li>• 已获得的收益可能被追回</li>
                <li>• 严重者可能面临法律诉讼</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 5. 存稿准备 */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground mb-2">五、存稿准备：保持稳定更新的底气</h2>
              <p className="text-sm text-muted-foreground">充足的存稿是应对突发情况的保障，也是维持读者粘性的关键</p>
            </div>
          </div>

          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="bg-background/50 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">📦 存稿量建议</h3>
              <ul className="space-y-2 ml-4">
                <li><strong>最低标准：</strong>过稿后建议存稿1-1.5万字（约5-7章），能应对3-4天的突发情况。</li>
                <li><strong>推荐标准：</strong>存稿2-3万字（约10-15章），可从容应对一周内的各种状况。</li>
                <li><strong>理想状态：</strong>存稿5万字以上，可在生病、出差、灵感枯竭时依然保持更新。</li>
                <li><strong>新书期特殊：</strong>新书上架前30天是关键期，建议存稿3万字以上，确保每日稳定更新。</li>
              </ul>
            </div>

            <div className="bg-background/50 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">🔄 更新稳定性的重要性</h3>
              <ul className="space-y-2 ml-4">
                <li><strong>算法推荐：</strong>大部分平台（尤其是番茄、七猫）的推荐算法会优先推送更新稳定的作品。断更会导致推荐量骤降。</li>
                <li><strong>读者粘性：</strong>固定更新时间培养读者阅读习惯，断更会让读者流失到其他作品。</li>
                <li><strong>全勤奖励：</strong>多数平台设有全勤奖（如日更4000字每月额外奖励600-1500元），断更即失去资格。</li>
                <li><strong>编辑印象：</strong>稳定更新的作者更容易获得编辑青睐，获得更多推荐资源和签约机会。</li>
              </ul>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <h3 className="font-semibold text-primary mb-2">💡 存稿管理技巧</h3>
              <ul className="space-y-2 ml-4">
                <li>使用云同步写作软件（如WPS云文档、石墨文档），防止数据丢失</li>
                <li>制定写作计划，每天固定时间写作，养成习惯</li>
                <li>状态好时多写，状态差时少写但不断更</li>
                <li>提前规划剧情，避免卡文导致断更</li>
                <li>建立备用章节库，紧急情况下可直接发布</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 6. 了解规则 */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground mb-2">六、了解规则：签约与福利政策详解</h2>
              <p className="text-sm text-muted-foreground">不同平台的签约条件和福利政策差异巨大，选择合适的平台至关重要</p>
            </div>
          </div>

          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="bg-background/50 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">📜 签约条件对比</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 pr-4">平台</th>
                      <th className="text-left py-2 pr-4">签约字数</th>
                      <th className="text-left py-2 pr-4">审核周期</th>
                      <th className="text-left py-2">难度</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/50">
                      <td className="py-2 pr-4 font-medium">起点中文网</td>
                      <td className="py-2 pr-4">2-3万字+大纲</td>
                      <td className="py-2 pr-4">7-15工作日</td>
                      <td className="py-2 text-red-600">⭐⭐⭐⭐⭐</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2 pr-4 font-medium">番茄小说</td>
                      <td className="py-2 pr-4">1-2万字</td>
                      <td className="py-2 pr-4">3-7工作日</td>
                      <td className="py-2 text-yellow-600">⭐⭐⭐</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2 pr-4 font-medium">七猫小说</td>
                      <td className="py-2 pr-4">2万字+大纲</td>
                      <td className="py-2 pr-4">5-10工作日</td>
                      <td className="py-2 text-yellow-600">⭐⭐⭐</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2 pr-4 font-medium">晋江文学城</td>
                      <td className="py-2 pr-4">1万字</td>
                      <td className="py-2 pr-4">7-15工作日</td>
                      <td className="py-2 text-orange-600">⭐⭐⭐⭐</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2 pr-4 font-medium">纵横中文网</td>
                      <td className="py-2 pr-4">1万字+大纲</td>
                      <td className="py-2 pr-4">5-10工作日</td>
                      <td className="py-2 text-yellow-600">⭐⭐⭐</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium">盐言故事</td>
                      <td className="py-2 pr-4">完结1-3万字</td>
                      <td className="py-2 pr-4">3-5工作日</td>
                      <td className="py-2 text-green-600">⭐⭐</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-background/50 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">💰 主流福利政策</h3>
              <ul className="space-y-2 ml-4">
                <li><strong>全勤奖：</strong>日更4000字，月更12万字，额外奖励600-1500元/月（各平台不同）</li>
                <li><strong>保底分成：</strong>千字20-100元保底+超额分成，适合新人降低风险</li>
                <li><strong>打赏分成：</strong>读者打赏作者可得50%-70%，头部作者月收入可达数万</li>
                <li><strong>IP改编：</strong>优质作品可改编影视、动漫、游戏，版权收益数十万至数百万</li>
                <li><strong>新书推荐：</strong>新书期获得首页推荐位，曝光量提升10倍以上</li>
              </ul>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <h3 className="font-semibold text-primary mb-2">💡 选择平台建议</h3>
              <ul className="space-y-2 ml-4">
                <li><strong>新人首选：</strong>番茄、七猫（门槛低、流量大、收益稳定）</li>
                <li><strong>追求IP：</strong>起点、晋江（签约难但版权价值高）</li>
                <li><strong>短篇擅长：</strong>盐言故事、知乎（1-3万字完结，变现快）</li>
                <li><strong>传统玄幻：</strong>纵横、创世（老牌平台，受众稳定）</li>
                <li><strong>女频言情：</strong>晋江、潇湘、红袖（女性读者集中）</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 底部提示 */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 border border-primary/20">
          <p className="text-center text-sm text-muted-foreground">
            以上为通用投稿指南，具体平台规则可能随时调整，投稿前请务必查阅各平台最新官方公告
          </p>
        </div>
      </div>
    </div>
  );
}
