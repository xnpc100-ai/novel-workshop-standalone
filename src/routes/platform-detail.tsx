import { createFileRoute, Link } from '@tanstack/react-router';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft, Globe, TrendingUp, Users, Clock, CheckCircle,
  AlertTriangle, Star, BookOpen, FileText, Target, Zap,
  ExternalLink, Award, Shield
} from 'lucide-react';

export const Route = createFileRoute('/platform-detail')({
  component: PlatformDetailPage,
});

const platformData: Record<string, any> = {
  '1': {
    id: 1,
    name: '番茄小说',
    company: '字节跳动',
    rank: 1,
    type: 'domestic',
    income: '月收益3000-10000+',
    pros: ['流量巨大', '新手友好', '分成比例优', '推荐算法精准'],
    cons: ['竞争激烈', '审核周期长'],
    description: '番茄小说是字节跳动旗下的免费阅读平台，依托抖音强大的流量入口，为作者提供广阔的读者群体。平台采用广告分成模式，读者免费看书，作者通过广告收益获得收入。',
    stats: {
      dailyActiveUsers: '5000万+',
      avgIncome: '3000-8000元/月',
      signingRate: '15%',
      updateRequirement: '日更4000字'
    },
    requirements: {
      minWords: '3万字可申请签约',
      updateFrequency: '建议日更，断更会影响推荐',
      contentRules: '严禁涉黄、涉政、暴力内容',
      copyright: '签约后版权归平台所有'
    },
    tips: [
      { icon: Star, text: '开篇前三章至关重要，决定编辑是否给推荐位', type: 'success' },
      { icon: Target, text: '保持稳定的更新频率，断更会严重影响流量', type: 'warning' },
      { icon: Zap, text: '利用平台的智能推荐系统，标签要准确', type: 'info' }
    ],
    successStories: [
      { author: '墨香小筑', work: '《逆天改命》', income: '月入5万+', desc: '从兼职写作到全职创作，用了半年时间实现月收入破万' },
      { author: '雪落无痕', work: '《都市异能觉醒》', income: '月入2万+', desc: '抓住热点题材，单月收入突破2万' },
      { author: '剑指天涯', work: '《修仙模拟器》', income: '月入6000+', desc: '坚持日更4000字，三个月拿到全勤奖' },
      { author: '星辰大海', work: '《最强仙帝》', income: '版权收益15万+', desc: '第一部作品被影视公司看中，版权费15万' },
      { author: '雨落无声', work: '《王爷的掌心娇》', income: '月入4000+', desc: '女频言情也能月入过万，关键是找准定位' }
    ],
    faq: [
      { q: '番茄小说的签约流程是怎样的？', a: '字数达到3万字后，在作家后台提交签约申请，编辑会在3-5个工作日内审核。审核通过后会发送站内信通知，按照指引完成电子签约即可。' },
      { q: '断更会有什么后果？', a: '断更会严重影响推荐位获取，连续断更3天以上可能导致作品被降权。建议提前存稿，遇到特殊情况可以请假1-2天。' },
      { q: '广告分成如何计算？', a: '根据读者的阅读时长、广告点击率等综合因素计算。一般来说，每万字阅读收益在5-20元之间，具体取决于作品质量和读者活跃度。' },
      { q: '可以同时发布到其他平台吗？', a: '签约后作品独家授权给番茄小说，不能同时发布到其他平台。未签约前可以自由发布，但建议专注一个平台积累读者。' },
      { q: '如何提高作品的推荐量？', a: '保持高质量更新、准确打标签、积极参与平台活动、与读者互动都能提高推荐量。关键是让读者愿意长时间阅读和分享。' },
      { q: '编辑联系方式是什么？', a: '可以通过作家后台的"联系编辑"功能发送消息，或加入官方作者QQ群咨询。紧急问题也可以拨打客服热线400-xxx-xxxx。' },
      { q: '审核周期一般多久？', a: '新书签约审核3-5个工作日，章节审核通常24小时内完成。节假日可能会延长，建议提前上传避免断更。' },
      { q: '稿费什么时候发放？', a: '每月15日发放上月稿费，通过银行卡转账。首次签约需要提供银行卡信息和身份证信息进行实名认证。' },
      { q: '作品可以被改编成影视吗？', a: '签约后平台拥有作品的改编权，如果有影视公司看中，平台会协助进行版权运营，作者可以获得额外的版权收益分成。' },
      { q: '新人有什么扶持政策？', a: '番茄有"新人扶持计划"，新书前30天会获得额外流量曝光。此外还有"全勤奖"、"完本奖"等多种福利，详情可在作家后台查看。' }
    ]
  },
  '2': {
    id: 2,
    name: '七猫小说',
    company: '百度旗下',
    rank: 2,
    type: 'domestic',
    income: '千字20元起保底',
    pros: ['收入稳定', '编辑指导', '保底制度', '福利完善'],
    cons: ['审核严格', '题材限制较多'],
    description: '七猫小说是百度旗下的网文平台，以保底+分成模式著称。新人作者可以申请千字保底，降低创作风险。平台编辑团队专业，会为签约作者提供写作指导。',
    stats: {
      dailyActiveUsers: '3000万+',
      avgIncome: '保底20-50元/千字',
      signingRate: '20%',
      updateRequirement: '日更4000-6000字'
    },
    requirements: {
      minWords: '1万字大纲+正文可申请内签',
      updateFrequency: '签约后需保持稳定更新',
      contentRules: '内容健康向上，符合主流价值观',
      copyright: '保底作品版权归平台，分成作品可协商'
    },
    tips: [
      { icon: Star, text: '准备好完整的大纲和人设，提高内签通过率', type: 'success' },
      { icon: Shield, text: '保底制度适合新人，降低创作风险', type: 'info' },
      { icon: AlertTriangle, text: '注意平台对内容的审核标准较严格', type: 'warning' }
    ],
    successStories: [
      { author: '稳定输出者', work: '《ZZZ》', income: '月入3万+', desc: '靠稳定更新和优质内容获得长期推荐' },
      { author: '保底达人', work: '《逆天邪神》', income: '保底+分成月入5万+', desc: '千字30元保底，上架后分成更高' },
      { author: '编辑力荐', work: '《最强赘婿》', income: '月入4万+', desc: '得到编辑重点指导，作品质量大幅提升' },
      { author: '新人黑马', work: '《都市仙医》', income: '月入2.5万+', desc: '首秀即获得千字25元保底，3个月后分成超过保底' },
      { author: '长篇王者', work: '《万古帝尊》', income: '年入50万+', desc: '完本300万字，累计稿费超过60万' }
    ],
    faq: [
      { q: '七猫的保底申请流程是什么？', a: '准备1万字正文+完整大纲（包含人物设定、主线剧情、世界观），通过作家后台的内签通道提交。编辑评估后会给出保底价格，一般千字20-50元不等。' },
      { q: '保底和分成哪个更划算？', a: '新人建议先拿保底降低风险，等有稳定读者基础后再尝试纯分成。老作者如果对自己作品有信心，纯分成的上限更高。' },
      { q: '保底合同一般签多久？', a: '保底合同通常签1-2年，或约定字数（如100万字）。合同期内需要保持稳定更新，否则可能被取消保底资格。' },
      { q: '编辑会提供写作指导吗？', a: '是的，七猫的编辑团队非常专业。签约后会有专属编辑对接，定期提供修改建议和数据分析，帮助作者提升作品质量。' },
      { q: '审核标准为什么比较严格？', a: '七猫注重内容质量和价值观导向，对涉黄、暴力、低俗内容零容忍。这也是为了保障平台的长期健康发展。' },
      { q: '如何联系责任编辑？', a: '签约后会分配专属编辑，可以通过企业微信或QQ联系。未签约作者可以通过作家后台的"在线咨询"功能提问。' },
      { q: '断更会影响保底吗？', a: '连续断更3天以上可能会被警告，7天以上可能取消保底资格。建议提前存稿，特殊情况可以提前向编辑请假。' },
      { q: '完结作品有奖励吗？', a: '有"完本奖"，正常完结且字数达到要求的作品可获得额外奖金。具体金额根据作品表现而定，一般在1000-5000元之间。' },
      { q: '可以写多少字？', a: '没有上限，但建议至少规划100万字以上。长篇作品更容易积累读者，获得更好的推荐位。' },
      { q: '稿费发放时间？', a: '每月10日发放上月稿费，通过银行转账。需要提供本人银行卡信息和身份证进行实名认证。' }
    ]
  },
  '3': {
    id: 3,
    name: '起点中文网',
    company: '阅文集团',
    rank: 3,
    type: 'domestic',
    income: '爆款可斩获数十万',
    pros: ['IP价值高', '读者付费意愿强', '大神云集', '版权运营成熟'],
    cons: ['竞争极其激烈', '新人出头难', '需要长期积累'],
    description: '起点中文网是中国最大的原创文学平台之一，隶属于阅文集团。平台拥有成熟的付费阅读体系和IP开发能力，是众多网文大神的首选平台。',
    stats: {
      dailyActiveUsers: '2000万+',
      avgIncome: '头部作者月入10万+',
      signingRate: '5%',
      updateRequirement: '日更6000-10000字'
    },
    requirements: {
      minWords: '1万字正文+大纲可内签',
      updateFrequency: '高强度更新，竞争激烈',
      contentRules: '内容质量要求高，注重创新性',
      copyright: '全版权运营，平台拥有改编权'
    },
    tips: [
      { icon: Award, text: '起点适合有实力的作者，追求高质量创作', type: 'success' },
      { icon: Users, text: '建立粉丝群，维护核心读者关系', type: 'info' },
      { icon: AlertTriangle, text: '新人需要有长期作战的心理准备', type: 'warning' }
    ],
    successStories: [
      { author: '白金大神', work: '《AAA》', income: '年入百万+', desc: '连续多年占据月票榜前列' },
      { author: '玄幻至尊', work: '《斗破苍穹》', income: '年入500万+', desc: '开创"退婚流"先河，IP改编价值过亿' },
      { author: '历史巨匠', work: '《明朝那些事儿》', income: '年入200万+', desc: '以通俗幽默的方式讲述历史，破圈成功' },
      { author: '科幻新星', work: '《三体前传》', income: '月入15万+', desc: '硬科幻题材在起点异军突起，获得银河奖提名' },
      { author: '都市王者', work: '《最强狂兵》', income: '年入300万+', desc: '日更万字坚持3年，积累千万粉丝' }
    ],
    faq: [
      { q: '起点内签和外签有什么区别？', a: '内签是通过编辑直接签约，需要提交大纲和正文样本，审核更严格但资源更好。外签是达到一定数据后自动签约，门槛较低但初期推荐较少。' },
      { q: '起点的推荐机制是怎样的？', a: '采用算法+人工双重推荐。新书有"新书入库"曝光，数据好的作品会进入"强推"、"精品频道"等更高推荐位。月票榜、推荐榜也是重要曝光渠道。' },
      { q: '如何成为签约作者？', a: '方式一：内签，准备1万字正文+完整大纲投稿给编辑；方式二：外签，公开发布作品，当收藏达到500、推荐票达到一定数量时，系统会自动发出签约邀请。' },
      { q: '起点的分成比例是多少？', a: 'VIP章节订阅收入作者拿50%，打赏收入作者拿70%（扣除渠道费后）。全勤奖、半年奖等额外福利另计。' },
      { q: 'IP改编机会大吗？', a: '起点是阅文集团旗下平台，拥有完善的IP运营体系。头部作品有机会改编成动漫、影视、游戏、有声书等，版权收益非常可观。' },
      { q: '编辑联系方式？', a: '可以通过起点作家助手APP内的"我的编辑"查看专属编辑联系方式。未签约作者可以在作家专区找到各品类编辑的投稿邮箱。' },
      { q: '断更会有什么惩罚？', a: '断更会影响推荐位获取，连续断更可能失去全勤奖资格。建议每天固定时间更新，培养读者阅读习惯。' },
      { q: '月票怎么获得？', a: '读者通过订阅、打赏、投票等方式获得月票。作者可以通过加更、互动、参与活动等方式激励读者投月票。月票榜是起点最重要的榜单之一。' },
      { q: '新人有什么扶持政策？', a: '起点有"新人新作"计划，新书前3个月有额外曝光。还有"星创奖"评选优秀新人，获奖者可获得奖金和推荐资源。' },
      { q: '完本后有后续收益吗？', a: '完本作品仍可通过订阅、打赏获得持续收入。优质完本作品还有机会进入"完本精品"频道，获得二次推广。' }
    ]
  },
  '4': {
    id: 4,
    name: 'Webnovel',
    company: '阅文海外版',
    rank: 4,
    type: 'overseas',
    income: '男频玄幻受众广',
    pros: ['全球市场', '美元结算', '竞争相对较小', '翻译作品有机会'],
    cons: ['语言要求高', '文化差异', '时差问题'],
    description: 'Webnovel是阅文集团的海外平台，面向全球英语读者。中国玄幻小说在海外市场非常受欢迎，为国内作者提供了出海的机遇。',
    stats: {
      dailyActiveUsers: '1000万+',
      avgIncome: '$500-2000/月',
      signingRate: '10%',
      updateRequirement: '周更3-5章'
    },
    requirements: {
      minWords: '英文翻译或原创均可',
      updateFrequency: '相对稳定即可',
      contentRules: '符合海外读者审美',
      copyright: '根据合同条款确定'
    },
    tips: [
      { icon: Globe, text: '了解海外读者的阅读偏好，调整写作风格', type: 'info' },
      { icon: Star, text: '玄幻、修仙类题材在海外很受欢迎', type: 'success' }
    ],
    successStories: []
  },
  '5': {
    id: 5,
    name: 'GoodNovel',
    company: '中文在线旗下',
    rank: 5,
    type: 'overseas',
    income: '分成比例优',
    pros: ['女频优势', '分成比例高', '编辑支持好'],
    cons: ['竞争激烈', '需要英文创作'],
    description: 'GoodNovel专注于海外市场的女频小说，言情、总裁、狼人等题材表现优异。平台分成比例较高，适合擅长女频创作的作者。',
    stats: {
      dailyActiveUsers: '800万+',
      avgIncome: '$300-1500/月',
      signingRate: '12%',
      updateRequirement: '日更2000-3000英文单词'
    },
    requirements: {
      minWords: '英文原创为主',
      updateFrequency: '保持稳定更新',
      contentRules: '符合海外女频审美',
      copyright: '视合同而定'
    },
    tips: [
      { icon: Star, text: '总裁文、狼人文在海外女频市场很受欢迎', type: 'success' },
      { icon: AlertTriangle, text: '需要了解海外读者的情感表达方式', type: 'warning' }
    ],
    successStories: []
  }
};

function PlatformDetailPage() {
  const { id } = Route.useSearch();
  const platform = platformData[id || '1'];

  if (!platform) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="shadow-elegant rounded-2xl max-w-md">
          <CardContent className="py-12 text-center">
            <h2 className="text-xl font-semibold mb-2">平台不存在</h2>
            <Link to="/community">
              <Button>返回社区</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16">
      {/* 顶部导航 */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link to="/community">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                返回
              </Button>
            </Link>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-primary-foreground font-bold text-lg">
                  {platform.rank}
                </div>
                <div>
                  <h1 className="text-lg font-semibold">{platform.name}</h1>
                  <p className="text-sm text-muted-foreground">{platform.company}</p>
                </div>
                <Badge variant={platform.type === 'domestic' ? 'default' : 'secondary'}>
                  {platform.type === 'domestic' ? '国内' : '海外'}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5 rounded-xl bg-secondary p-1 mb-6">
            <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">概览</TabsTrigger>
            <TabsTrigger value="requirements" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">投稿要求</TabsTrigger>
            <TabsTrigger value="tips" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">攻略技巧</TabsTrigger>
            <TabsTrigger value="stories" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">成功案例</TabsTrigger>
            <TabsTrigger value="faq" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">常见问题</TabsTrigger>
          </TabsList>

          {/* 概览 */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="shadow-elegant rounded-2xl">
              <CardHeader>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  平台介绍
                </h2>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">{platform.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-secondary/50 text-center">
                    <Users className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold text-foreground">{platform.stats.dailyActiveUsers}</p>
                    <p className="text-xs text-muted-foreground">日活用户</p>
                  </div>
                  <div className="p-4 rounded-xl bg-secondary/50 text-center">
                    <TrendingUp className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <p className="text-lg font-bold text-foreground">{platform.stats.avgIncome}</p>
                    <p className="text-xs text-muted-foreground">平均收入</p>
                  </div>
                  <div className="p-4 rounded-xl bg-secondary/50 text-center">
                    <CheckCircle className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold text-foreground">{platform.stats.signingRate}</p>
                    <p className="text-xs text-muted-foreground">签约率</p>
                  </div>
                  <div className="p-4 rounded-xl bg-secondary/50 text-center">
                    <Clock className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm font-bold text-foreground">{platform.stats.updateRequirement}</p>
                    <p className="text-xs text-muted-foreground">更新要求</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-elegant rounded-2xl">
                <CardHeader>
                  <h3 className="font-semibold flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    平台优势
                  </h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {platform.pros.map((pro: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{pro}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-elegant rounded-2xl">
                <CardHeader>
                  <h3 className="font-semibold flex items-center gap-2 text-orange-600">
                    <AlertTriangle className="w-4 h-4" />
                    注意事项
                  </h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {platform.cons.map((con: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                        <span>{con}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 投稿要求 */}
          <TabsContent value="requirements" className="space-y-6">
            <Card className="shadow-elegant rounded-2xl">
              <CardHeader>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  投稿要求详解
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-secondary/50">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-primary" />
                      字数要求
                    </h4>
                    <p className="text-sm text-muted-foreground">{platform.requirements.minWords}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-secondary/50">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      更新频率
                    </h4>
                    <p className="text-sm text-muted-foreground">{platform.requirements.updateFrequency}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-secondary/50">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-primary" />
                      内容规范
                    </h4>
                    <p className="text-sm text-muted-foreground">{platform.requirements.contentRules}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-secondary/50">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Target className="w-4 h-4 text-primary" />
                      版权归属
                    </h4>
                    <p className="text-sm text-muted-foreground">{platform.requirements.copyright}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 攻略技巧 */}
          <TabsContent value="tips" className="space-y-6">
            <Card className="shadow-elegant rounded-2xl">
              <CardHeader>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  成功攻略
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {platform.tips.map((tip: any, i: number) => {
                    const Icon = tip.icon;
                    const colors = {
                      success: 'text-green-500 bg-green-500/10',
                      warning: 'text-orange-500 bg-orange-500/10',
                      info: 'text-blue-500 bg-blue-500/10'
                    };
                    return (
                      <div key={i} className={`flex items-start gap-3 p-4 rounded-xl ${colors[tip.type as keyof typeof colors]}`}>
                        <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <p className="text-sm">{tip.text}</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 成功案例 */}
          <TabsContent value="stories" className="space-y-6">
            {platform.successStories.length > 0 ? (
              <div className="space-y-4">
                {platform.successStories.map((story: any, i: number) => (
                  <Card key={i} className="shadow-elegant rounded-2xl">
                    <CardContent className="py-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                          <Award className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{story.author}</h3>
                            <Badge variant="outline">{story.work}</Badge>
                          </div>
                          <p className="text-primary font-medium mb-2">{story.income}</p>
                          <p className="text-sm text-muted-foreground">{story.desc}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="shadow-elegant rounded-2xl">
                <CardContent className="py-12 text-center">
                  <Award className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-30" />
                  <p className="text-muted-foreground">暂无公开的成功案例</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* 常见问题 */}
          <TabsContent value="faq" className="space-y-4">
            {platform.faq && platform.faq.length > 0 ? (
              <div className="space-y-3">
                {platform.faq.map((item: any, i: number) => (
                  <Card key={i} className="shadow-elegant rounded-2xl">
                    <CardContent className="py-4">
                      <h4 className="font-medium text-foreground mb-2 flex items-start gap-2">
                        <span className="text-primary font-bold">Q{i + 1}.</span>
                        {item.q}
                      </h4>
                      <p className="text-sm text-muted-foreground ml-6">{item.a}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="shadow-elegant rounded-2xl">
                <CardContent className="py-12 text-center">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-30" />
                  <p className="text-muted-foreground">暂无常见问题</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
