import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeft, Globe, Users, TrendingUp, DollarSign, BookOpen, Star } from 'lucide-react';

export const Route = createFileRoute('/guide/platforms')({
  component: PlatformsGuidePage,
});

function PlatformsGuidePage() {
  return (
    <div className="min-h-screen pb-12">
      {/* 返回按钮 */}
      <section className="pt-8 pb-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <Link to="/core" className="inline-flex items-center gap-2 text-primary hover:underline text-sm">
            <ArrowLeft className="w-4 h-4" />
            返回创作页
          </Link>
        </div>
      </section>

      {/* 标题区 */}
      <section className="pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 flex items-center gap-3">
            <Globe className="w-8 h-8 text-primary" />
            主要平台特点对比详解
          </h1>
          <p className="text-lg text-muted-foreground">
            深度解析六大主流网文平台的用户画像、内容偏好、签约规则与变现模式，助你精准选择创作阵地
          </p>
        </div>
      </section>

      {/* 主要内容区 */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* 起点中文网 */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center flex-shrink-0 text-white font-bold text-xl">
              起点
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground mb-2">起点中文网</h2>
              <p className="text-sm text-muted-foreground">阅文集团旗下男频头部平台，IP价值天花板，大神聚集地</p>
            </div>
          </div>

          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-background/50 rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  用户画像
                </h3>
                <ul className="space-y-2 ml-4">
                  <li><strong>年龄分布：</strong>25-40岁为主，占比超60%。读者群体成熟，消费能力强。</li>
                  <li><strong>性别比例：</strong>男性读者占85%以上，女性读者较少。</li>
                  <li><strong>阅读偏好：</strong>偏好逻辑严密、世界观宏大、人物立体的作品。对文笔和剧情质量要求高。</li>
                  <li><strong>付费意愿：</strong>付费意识强，愿意为优质内容买单。打赏文化盛行，头部作者月打赏可达数万。</li>
                </ul>
              </div>

              <div className="bg-background/50 rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  内容特点
                </h3>
                <ul className="space-y-2 ml-4">
                  <li><strong>主流类型：</strong>玄幻、仙侠、都市、历史、科幻、游戏。传统男频题材占据主导。</li>
                  <li><strong>风格倾向：</strong>适合慢热型作品，允许长篇铺垫构建世界观。不追求快节奏爽文，更注重故事深度。</li>
                  <li><strong>字数要求：</strong>普遍百万字起步，完本作品多在200-500万字。超长篇是常态。</li>
                  <li><strong>创新空间：</strong>鼓励创新，但需在传统框架内微创新。纯实验性作品受众有限。</li>
                </ul>
              </div>
            </div>

            <div className="bg-background/50 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                签约与推荐机制
              </h3>
              <ul className="space-y-2 ml-4">
                <li><strong>签约难度：</strong>⭐⭐⭐⭐⭐（极难）。审核严格，通过率低于10%。需要2-3万字正文+完整大纲。</li>
                <li><strong>审核周期：</strong>7-15个工作日，部分热门类型可能更长。</li>
                <li><strong>推荐机制：</strong>编辑人工推荐为主，算法辅助。新书期有"新人榜""潜力榜"等曝光渠道。</li>
                <li><strong>关键指标：</strong>收藏数、推荐票、月票数、订阅率。数据好的作品能获得首页推荐位。</li>
              </ul>
            </div>

            <div className="bg-background/50 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-primary" />
                变现模式
              </h3>
              <ul className="space-y-2 ml-4">
                <li><strong>订阅分成：</strong>VIP章节订阅，作者获得50%-70%分成。头部作者月收入可达数十万。</li>
                <li><strong>打赏收入：</strong>读者打赏作者可得50%-70%，是重要收入来源。</li>
                <li><strong>全勤奖励：</strong>日更4000字，月更12万字，额外奖励600-1000元。</li>
                <li><strong>IP改编：</strong>最大优势！优质作品可改编影视、动漫、游戏、有声书。版权收益数十万至数百万，如《斗破苍穹》《全职高手》等。</li>
                <li><strong>周边衍生：</strong>手办、漫画、动画等衍生品分成。</li>
              </ul>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 className="font-semibold text-orange-700 mb-2 flex items-center gap-2">
                <Star className="w-4 h-4" />
                适合人群与建议
              </h3>
              <ul className="space-y-2 ml-4 text-orange-800">
                <li>✅ 适合有扎实写作功底、能驾驭长篇的作者</li>
                <li>✅ 适合追求IP价值、有长远规划的职业作家</li>
                <li>✅ 擅长构建宏大世界观、塑造群像角色</li>
                <li>❌ 不适合新手试水，签约门槛高、竞争激烈</li>
                <li>❌ 不适合快节奏爽文、短篇作品</li>
                <li><strong>建议：</strong>新人可先在起点免费连载积累人气，达到一定数据后再申请签约。或先在番茄、七猫等平台练手，提升实力后再冲击起点。</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 番茄小说 */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0 text-white font-bold text-xl">
              番茄
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground mb-2">番茄小说</h2>
              <p className="text-sm text-muted-foreground">抖音旗下免费阅读平台，流量天花板，算法推荐之王</p>
            </div>
          </div>

          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-background/50 rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  用户画像
                </h3>
                <ul className="space-y-2 ml-4">
                  <li><strong>日活用户：</strong>3亿+，全网最大免费阅读平台。</li>
                  <li><strong>年龄分布：</strong>18-35岁为主，年轻用户占比高。</li>
                  <li><strong>阅读习惯：</strong>碎片化阅读，单次阅读时长15-30分钟。偏好快速进入剧情、节奏明快的作品。</li>
                  <li><strong>地域分布：</strong>下沉市场用户多，三四线城市及农村用户占比超50%。</li>
                </ul>
              </div>

              <div className="bg-background/50 rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  内容特点
                </h3>
                <ul className="space-y-2 ml-4">
                  <li><strong>主流类型：</strong>都市爽文、战神归来、赘婿逆袭、系统流、签到流。快节奏爽文是绝对主流。</li>
                  <li><strong>风格倾向：</strong>对话流占比高（对话占全文40%以上），完读率提升47%。少描写多对话，推进速度快。</li>
                  <li><strong>字数要求：</strong>30-100万字为主，不需要百万字长篇。完结即可变现。</li>
                  <li><strong>开篇要求：</strong>前3章必须有强冲突和金手指，否则会被算法淘汰。</li>
                </ul>
              </div>
            </div>

            <div className="bg-background/50 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                签约与推荐机制
              </h3>
              <ul className="space-y-2 ml-4">
                <li><strong>签约难度：</strong>⭐⭐⭐（中等）。1-2万字即可申请签约，审核相对宽松。</li>
                <li><strong>审核周期：</strong>3-7个工作日，速度较快。</li>
                <li><strong>推荐机制：</strong>纯算法推荐，无编辑人工干预。根据完读率、停留时长、点击率等数据自动分配流量。</li>
                <li><strong>关键指标：</strong>首章完读率（目标&gt;40%）、十章完读率（目标&gt;20%）、书架添加率。数据好则流量爆发，数据差则迅速沉底。</li>
              </ul>
            </div>

            <div className="bg-background/50 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-primary" />
                变现模式
              </h3>
              <ul className="space-y-2 ml-4">
                <li><strong>广告分成：</strong>免费阅读+广告模式，作者根据阅读时长获得广告分成。头部作者月收入可达3-10万。</li>
                <li><strong>全勤奖励：</strong>日更4000字，月更12万字，额外奖励600-1000元。</li>
                <li><strong>听书分成：</strong>作品被转化为有声书后，作者可获得额外分成。</li>
                <li><strong>流量倾斜：</strong>数据好的作品会获得更多推荐位，形成马太效应。</li>
              </ul>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
                <Star className="w-4 h-4" />
                适合人群与建议
              </h3>
              <ul className="space-y-2 ml-4 text-red-800">
                <li>✅ 适合新手入门，门槛低、流量大、变现快</li>
                <li>✅ 适合手速快、能日更6000字以上的作者</li>
                <li>✅ 擅长写快节奏爽文、打脸情节密集</li>
                <li>❌ 不适合慢热型、文艺向、深度思考类作品</li>
                <li>❌ IP价值较低，难以改编影视</li>
                <li><strong>建议：</strong>研究番茄爆款榜单，模仿其开篇结构和节奏。注重前三章的钩子设计，确保首章完读率达标。保持高频更新，利用算法红利期快速积累读者。</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 七猫小说 */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0 text-white font-bold text-xl">
              七猫
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground mb-2">七猫小说</h2>
              <p className="text-sm text-muted-foreground">百度旗下免费阅读平台，保底+超保底双轨制，小镇青年最爱</p>
            </div>
          </div>

          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-background/50 rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  用户画像
                </h3>
                <ul className="space-y-2 ml-4">
                  <li><strong>核心用户：</strong>小镇青年、中年男性，30-50岁占比高。</li>
                  <li><strong>阅读偏好：</strong>偏好情感浓烈、节奏快、冲突激烈的作品。喜欢明确的善恶对立和爽快的打脸情节。</li>
                  <li><strong>消费能力：</strong>中等偏下，但对优质内容愿意付费。广告接受度较高。</li>
                </ul>
              </div>

              <div className="bg-background/50 rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  内容特点
                </h3>
                <ul className="space-y-2 ml-4">
                  <li><strong>主流类型：</strong>都市异能、战神赘婿、豪门恩怨、乡村神医。新媒体风是主流。</li>
                  <li><strong>风格倾向：</strong>情绪驱动型，强调情感冲击力。开篇要有强烈冲突（如退婚、背叛、羞辱）。</li>
                  <li><strong>字数要求：</strong>50-150万字为主，中长篇居多。</li>
                  <li><strong>投稿要求：</strong>需2万字正文+完整大纲内投编辑，不能直接发布。</li>
                </ul>
              </div>
            </div>

            <div className="bg-background/50 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                签约与推荐机制
              </h3>
              <ul className="space-y-2 ml-4">
                <li><strong>签约难度：</strong>⭐⭐⭐（中等）。需要内投编辑，通过邮件发送正文+大纲。</li>
                <li><strong>审核周期：</strong>5-10个工作日。</li>
                <li><strong>推荐机制：</strong>编辑推荐+算法推荐结合。签约后获得基础曝光，数据好则增加推荐权重。</li>
                <li><strong>关键指标：</strong>留存率、阅读时长、追读率。编辑会根据数据调整推荐力度。</li>
              </ul>
            </div>

            <div className="bg-background/50 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-primary" />
                变现模式
              </h3>
              <ul className="space-y-2 ml-4">
                <li><strong>保底分成：</strong>千字20-100元保底+超额分成。保底降低新人风险，即使数据不好也有基本收入。</li>
                <li><strong>超保底分成：</strong>当作品收入超过保底金额后，超出部分按更高比例分成（最高可达80%）。</li>
                <li><strong>全勤奖励：</strong>日更4000字，月更12万字，额外奖励800-1500元（高于行业平均）。</li>
                <li><strong>渠道分发：</strong>七猫作品会分发到百度系其他产品（如百度APP、好看视频），获得额外曝光。</li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
                <Star className="w-4 h-4" />
                适合人群与建议
              </h3>
              <ul className="space-y-2 ml-4 text-blue-800">
                <li>✅ 适合有一定写作经验、能把握新媒体风的作者</li>
                <li>✅ 适合追求稳定收入、希望降低风险的作者（保底模式）</li>
                <li>✅ 擅长写情感冲突激烈、打脸爽快的作品</li>
                <li>❌ 不适合纯文学、慢热型、小众题材</li>
                <li>❌ 需要主动联系编辑内投，流程较繁琐</li>
                <li><strong>建议：</strong>研究七猫畅销榜，学习其开篇冲突设计和情绪渲染技巧。准备一份专业的大纲，突出作品的卖点和商业价值。与编辑保持良好沟通，根据反馈及时调整剧情。</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 晋江文学城 */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 text-white font-bold text-xl">
              晋江
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground mb-2">晋江文学城</h2>
              <p className="text-sm text-muted-foreground">女频绝对头部平台，言情纯爱圣地，影视IP开发活跃</p>
            </div>
          </div>

          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-background/50 rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  用户画像
                </h3>
                <ul className="space-y-2 ml-4">
                  <li><strong>性别比例：</strong>女性读者占95%以上，是纯粹的女性向平台。</li>
                  <li><strong>年龄分布：</strong>18-30岁为主，学生党和年轻白领占比高。</li>
                  <li><strong>阅读偏好：</strong>偏好情感细腻、人物关系复杂、有深度的作品。对文笔要求高，反感流水账。</li>
                  <li><strong>付费意愿：</strong>付费意识极强，愿意为喜欢的作者和作品充值。打赏文化浓厚。</li>
                </ul>
              </div>

              <div className="bg-background/50 rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  内容特点
                </h3>
                <ul className="space-y-2 ml-4">
                  <li><strong>主流类型：</strong>现代言情、古代言情、纯爱耽美、穿越重生、娱乐圈文。女频全品类覆盖。</li>
                  <li><strong>风格倾向：</strong>注重情感描写和心理刻画，文笔要求高。允许慢热，但感情线要清晰。</li>
                  <li><strong>字数要求：</strong>门槛低，1万字即可签约。常见篇幅30-80万字，不需要百万字长篇。</li>
                  <li><strong>创新空间：</strong>鼓励创新，同人、快穿、无限流等新颖题材受欢迎。</li>
                </ul>
              </div>
            </div>

            <div className="bg-background/50 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                签约与推荐机制
              </h3>
              <ul className="space-y-2 ml-4">
                <li><strong>签约难度：</strong>⭐⭐⭐⭐（较难）。1万字即可申请签约，但审核严格，注重文笔和情感表达。</li>
                <li><strong>审核周期：</strong>7-15个工作日。</li>
                <li><strong>推荐机制：</strong>编辑人工推荐为主。有"新晋作者榜""金榜""月榜"等曝光渠道。</li>
                <li><strong>关键指标：</strong>收藏数、评论数、积分、订阅率。互动数据比阅读数据更重要。</li>
              </ul>
            </div>

            <div className="bg-background/50 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-primary" />
                变现模式
              </h3>
              <ul className="space-y-2 ml-4">
                <li><strong>VIP订阅：</strong>入V后章节收费，作者获得50%-70%分成。头部作者月收入可达10-50万。</li>
                <li><strong>打赏收入：</strong>读者打赏作者可得50%-70%，是重要收入来源。晋江读者打赏意愿强。</li>
                <li><strong>IP改编：</strong>影视改编活跃，《甄嬛传》《花千骨》《陈情令》等均出自晋江。版权收益数十万至数百万。</li>
                <li><strong>出版机会：</strong>优质作品有机会实体出版，获得版税收入。</li>
              </ul>
            </div>

            <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
              <h3 className="font-semibold text-pink-700 mb-2 flex items-center gap-2">
                <Star className="w-4 h-4" />
                适合人群与建议
              </h3>
              <ul className="space-y-2 ml-4 text-pink-800">
                <li>✅ 适合女性作者，擅长情感描写和人物塑造</li>
                <li>✅ 适合追求IP价值、希望作品影视化的作者</li>
                <li>✅ 文笔好、能写出细腻情感的作者</li>
                <li>❌ 不适合男频题材、爽文套路、快节奏作品</li>
                <li>❌ 社区氛围封闭，新人融入需要时间</li>
                <li><strong>建议：</strong>研究晋江金榜作品，学习其情感描写技巧和人物关系构建。注重文案和简介的吸引力，这是吸引读者的第一要素。积极参与社区互动，建立粉丝基础。保持更新稳定，晋江读者对断更容忍度低。</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 纵横中文网 */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0 text-white font-bold text-xl">
              纵横
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground mb-2">纵横中文网</h2>
              <p className="text-sm text-muted-foreground">男频第二大平台，传统玄幻武侠大本营，大神聚集地</p>
            </div>
          </div>

          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-background/50 rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  用户画像
                </h3>
                <ul className="space-y-2 ml-4">
                  <li><strong>年龄分布：</strong>25-45岁为主，老书虫占比高。</li>
                  <li><strong>性别比例：</strong>男性读者占90%以上。</li>
                  <li><strong>阅读偏好：</strong>偏好传统玄幻、武侠、历史军事等经典题材。对套路熟悉，要求作品有新鲜感。</li>
                  <li><strong>忠诚度：</strong>读者忠诚度高，一旦认可作者会长期追随。</li>
                </ul>
              </div>

              <div className="bg-background/50 rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  内容特点
                </h3>
                <ul className="space-y-2 ml-4">
                  <li><strong>主流类型：</strong>玄幻、仙侠、武侠、历史、军事。传统男频题材为主。</li>
                  <li><strong>风格倾向：</strong>适合传统网文风格，注重世界观构建和修炼体系设计。不追求极致快节奏。</li>
                  <li><strong>字数要求：</strong>100-300万字为主，长篇是常态。</li>
                  <li><strong>投稿要求：</strong>需1万字正文+大纲内投编辑。</li>
                </ul>
              </div>
            </div>

            <div className="bg-background/50 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                签约与推荐机制
              </h3>
              <ul className="space-y-2 ml-4">
                <li><strong>签约难度：</strong>⭐⭐⭐（中等）。门槛低于起点，但高于番茄七猫。需要内投编辑。</li>
                <li><strong>审核周期：</strong>5-10个工作日。</li>
                <li><strong>推荐机制：</strong>编辑推荐+榜单排名。有"新书榜""热销榜""月票榜"等曝光渠道。</li>
                <li><strong>关键指标：</strong>收藏数、推荐票、月票数、订阅率。</li>
              </ul>
            </div>

            <div className="bg-background/50 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-primary" />
                变现模式
              </h3>
              <ul className="space-y-2 ml-4">
                <li><strong>订阅分成：</strong>VIP章节订阅，作者获得50%-70%分成。</li>
                <li><strong>全勤奖励：</strong>日更4000字，月更12万字，额外奖励600-1000元。</li>
                <li><strong>打赏收入：</strong>读者打赏作者可得50%-70%。</li>
                <li><strong>版权运营：</strong>部分优质作品可改编影视、动漫，但频率低于起点和晋江。</li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                <Star className="w-4 h-4" />
                适合人群与建议
              </h3>
              <ul className="space-y-2 ml-4 text-green-800">
                <li>✅ 适合擅长传统玄幻、武侠题材的作者</li>
                <li>✅ 适合有一定写作经验、想避开起点激烈竞争的作者</li>
                <li>✅ 能驾驭长篇、构建完整修炼体系</li>
                <li>❌ 不适合新媒体风、快节奏爽文</li>
                <li>❌ 流量规模小于起点和番茄</li>
                <li><strong>建议：</strong>研究纵横大神作品，学习其世界观构建和修炼体系设计。注重前期铺垫，不要急于展开主线。与编辑保持沟通，获取专业指导。保持稳定更新，纵横读者对断更容忍度低。</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 盐言故事 */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0 text-white font-bold text-xl">
              盐言
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground mb-2">盐言故事</h2>
              <p className="text-sm text-muted-foreground">知乎旗下短篇故事平台，情绪付费新模式，高知女性最爱</p>
            </div>
          </div>

          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-background/50 rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  用户画像
                </h3>
                <ul className="space-y-2 ml-4">
                  <li><strong>年龄分布：</strong>18-35岁为主，高知女性占比高。</li>
                  <li><strong>教育背景：</strong>本科及以上学历占比超60%，读者素质高。</li>
                  <li><strong>阅读偏好：</strong>偏好现实题材、情感共鸣强、有反转的故事。对文笔和逻辑要求高。</li>
                  <li><strong>付费意愿：</strong>付费意识强，愿意为优质短篇内容付费。单篇付费模式接受度高。</li>
                </ul>
              </div>

              <div className="bg-background/50 rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  内容特点
                </h3>
                <ul className="space-y-2 ml-4">
                  <li><strong>主流类型：</strong>现实情感、职场故事、家庭伦理、悬疑推理、甜宠恋爱。短篇为主。</li>
                  <li><strong>风格倾向：</strong>第一人称沉浸式叙述，增强代入感。注重情绪渲染和心理描写。</li>
                  <li><strong>字数要求：</strong>1-3万字完结，短篇是主流。不需要长篇连载。</li>
                  <li><strong>结构要求：</strong>1500字内必须形成情绪闭环，快速抓住读者。结尾要有反转或升华。</li>
                </ul>
              </div>
            </div>

            <div className="bg-background/50 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                签约与推荐机制
              </h3>
              <ul className="space-y-2 ml-4">
                <li><strong>签约难度：</strong>⭐⭐（较易）。完结1-3万字即可投稿，审核速度快。</li>
                <li><strong>审核周期：</strong>3-5个工作日，效率极高。</li>
                <li><strong>推荐机制：</strong>算法推荐+编辑精选。优质作品会被推送到知乎首页，获得巨大曝光。</li>
                <li><strong>关键指标：</strong>点赞数、评论数、收藏数、付费转化率。互动数据决定推荐权重。</li>
              </ul>
            </div>

            <div className="bg-background/50 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-primary" />
                变现模式
              </h3>
              <ul className="space-y-2 ml-4">
                <li><strong>付费阅读：</strong>单篇定价1-9元，作者获得50%-70%分成。爆款单篇收入可达数千至数万。</li>
                <li><strong>会员分成：</strong>知乎盐选会员免费阅读，作者根据阅读量获得分成。</li>
                <li><strong>专栏收入：</strong>系列故事可打包成专栏销售，获得持续收入。</li>
                <li><strong>IP改编：</strong>优质短篇可改编短剧、漫画，近年来短剧市场火爆，变现潜力大。</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-700 mb-2 flex items-center gap-2">
                <Star className="w-4 h-4" />
                适合人群与建议
              </h3>
              <ul className="space-y-2 ml-4 text-yellow-800">
                <li>✅ 适合擅长短篇创作、能快速完结故事的作者</li>
                <li>✅ 适合文笔好、擅长情绪渲染和心理描写的作者</li>
                <li>✅ 适合现实题材、情感类、悬疑类创作者</li>
                <li>❌ 不适合长篇连载、玄幻仙侠等传统网文题材</li>
                <li>❌ 需要较强的故事构思和反转设计能力</li>
                <li><strong>建议：</strong>研究盐言爆款故事，学习其开篇钩子设计和情绪闭环构建。注重标题和简介的吸引力，这是决定点击率的关键。结尾要有反转或升华，给读者留下深刻印象。可以多写系列故事，形成个人品牌。</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 平台对比总结表 */}
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/20">
          <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            六大平台核心数据对比
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b-2 border-primary/30">
                  <th className="text-left py-3 pr-4">维度</th>
                  <th className="text-left py-3 pr-4">起点</th>
                  <th className="text-left py-3 pr-4">番茄</th>
                  <th className="text-left py-3 pr-4">七猫</th>
                  <th className="text-left py-3 pr-4">晋江</th>
                  <th className="text-left py-3 pr-4">纵横</th>
                  <th className="text-left py-3">盐言</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50">
                  <td className="py-3 pr-4 font-medium">定位</td>
                  <td className="py-3 pr-4">男频头部</td>
                  <td className="py-3 pr-4">免费顶流</td>
                  <td className="py-3 pr-4">保底稳健</td>
                  <td className="py-3 pr-4">女频霸主</td>
                  <td className="py-3 pr-4">传统男频</td>
                  <td className="py-3">短篇精品</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 pr-4 font-medium">签约难度</td>
                  <td className="py-3 pr-4 text-red-600">⭐⭐⭐⭐⭐</td>
                  <td className="py-3 pr-4 text-yellow-600">⭐⭐⭐</td>
                  <td className="py-3 pr-4 text-yellow-600">⭐⭐⭐</td>
                  <td className="py-3 pr-4 text-orange-600">⭐⭐⭐⭐</td>
                  <td className="py-3 pr-4 text-yellow-600">⭐⭐⭐</td>
                  <td className="py-3 text-green-600">⭐⭐</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 pr-4 font-medium">字数要求</td>
                  <td className="py-3 pr-4">200-500万</td>
                  <td className="py-3 pr-4">30-100万</td>
                  <td className="py-3 pr-4">50-150万</td>
                  <td className="py-3 pr-4">30-80万</td>
                  <td className="py-3 pr-4">100-300万</td>
                  <td className="py-3">1-3万</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 pr-4 font-medium">变现模式</td>
                  <td className="py-3 pr-4">订阅+IP</td>
                  <td className="py-3 pr-4">广告分成</td>
                  <td className="py-3 pr-4">保底+分成</td>
                  <td className="py-3 pr-4">订阅+IP</td>
                  <td className="py-3 pr-4">订阅分成</td>
                  <td className="py-3">单篇付费</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 pr-4 font-medium">IP价值</td>
                  <td className="py-3 pr-4 text-green-600">极高</td>
                  <td className="py-3 pr-4 text-red-600">低</td>
                  <td className="py-3 pr-4 text-yellow-600">中</td>
                  <td className="py-3 pr-4 text-green-600">极高</td>
                  <td className="py-3 pr-4 text-yellow-600">中</td>
                  <td className="py-3 text-orange-600">中高</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-medium">适合人群</td>
                  <td className="py-3 pr-4">职业作家</td>
                  <td className="py-3 pr-4">新手入门</td>
                  <td className="py-3 pr-4">求稳作者</td>
                  <td className="py-3 pr-4">女频作者</td>
                  <td className="py-3 pr-4">传统玄幻</td>
                  <td className="py-3">短篇高手</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 bg-background/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>选择建议：</strong>新人建议从番茄或七猫入手，门槛低、流量大、变现快；有一定基础后可尝试起点或晋江，追求更高IP价值；擅长短篇创作的作者可选择盐言，单篇变现效率高。多平台布局可分散风险，但需注意独家签约限制。
            </p>
          </div>
        </div>

        {/* 底部提示 */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 border border-primary/20">
          <p className="text-center text-sm text-muted-foreground">
            平台规则和政策可能随时调整，投稿前请务必查阅各平台最新官方公告和作者后台说明
          </p>
        </div>
      </div>
    </div>
  );
}
