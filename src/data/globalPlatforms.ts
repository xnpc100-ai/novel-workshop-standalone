export interface GlobalPlatform {
  id: number;
  name: string;
  nameEn: string;
  country: string;
  language: 'chinese' | 'english';
  rank: number;
  dailyActiveUsers: string;
  monthlyRevenue: string;
  contractType: string;
  royaltyRate: string;
  minWords: string;
  pros: string[];
  cons: string[];
  submissionTips: string[];
  successStories: Array<{
    author: string;
    title: string;
    income: string;
    story: string;
  }>;
  description: string;
}

export const chinesePlatforms: GlobalPlatform[] = [
  {
    id: 1,
    name: '番茄小说',
    nameEn: 'Tomato Novel',
    country: '中国',
    language: 'chinese',
    rank: 1,
    dailyActiveUsers: '5000万+',
    monthlyRevenue: '3000-10000元',
    contractType: '广告分成',
    royaltyRate: '根据阅读时长和广告点击',
    minWords: '3万字签约',
    pros: ['流量巨大', '新手友好', '分成比例优', '推荐算法精准'],
    cons: ['竞争激烈', '审核周期长'],
    submissionTips: ['开篇前三章至关重要', '保持日更4000字以上', '标签要准确'],
    successStories: [
      { author: '墨香小筑', title: '《逆天改命》', income: '月入5万+', story: '从兼职写作到全职创作，用了半年时间实现月收入破万' },
      { author: '雪落无痕', title: '《都市异能觉醒》', income: '月入2万+', story: '抓住热点题材，单月收入突破2万' }
    ],
    description: '字节跳动旗下的免费阅读平台，依托抖音强大的流量入口，采用广告分成模式。'
  },
  {
    id: 2,
    name: '七猫小说',
    nameEn: 'Seven Cats Novel',
    country: '中国',
    language: 'chinese',
    rank: 2,
    dailyActiveUsers: '3000万+',
    monthlyRevenue: '保底20-50元/千字',
    contractType: '保底+分成',
    royaltyRate: '千字20元起保底',
    minWords: '1万字大纲+正文内签',
    pros: ['收入稳定', '编辑指导', '保底制度', '福利完善'],
    cons: ['审核严格', '题材限制较多'],
    submissionTips: ['准备完整大纲和人设', '保底适合新人降低风险', '注意内容审核标准'],
    successStories: [
      { author: '保底达人', title: '《逆天邪神》', income: '月入5万+', story: '千字30元保底，上架后分成更高' },
      { author: '长篇王者', title: '《万古帝尊》', income: '年入50万+', story: '完本300万字，累计稿费超过60万' }
    ],
    description: '百度旗下的网文平台，以保底+分成模式著称，编辑团队专业，提供写作指导。'
  },
  {
    id: 3,
    name: '起点中文网',
    nameEn: 'Qidian',
    country: '中国',
    language: 'chinese',
    rank: 3,
    dailyActiveUsers: '2000万+',
    monthlyRevenue: '头部作者月入10万+',
    contractType: 'VIP订阅分成',
    royaltyRate: '订阅50%，打赏70%',
    minWords: '1万字正文+大纲内签',
    pros: ['IP价值高', '读者付费意愿强', '大神云集', '版权运营成熟'],
    cons: ['竞争极其激烈', '新人出头难', '需要长期积累'],
    submissionTips: ['适合有实力的作者', '建立粉丝群维护读者', '做好长期作战准备'],
    successStories: [
      { author: '玄幻至尊', title: '《斗破苍穹》', income: '年入500万+', story: '开创退婚流先河，IP改编价值过亿' },
      { author: '都市王者', title: '《最强狂兵》', income: '年入300万+', story: '日更万字坚持3年，积累千万粉丝' }
    ],
    description: '阅文集团旗下最大原创文学平台，拥有成熟的付费阅读体系和IP开发能力。'
  },
  {
    id: 4,
    name: '晋江文学城',
    nameEn: 'Jinjiang Literature City',
    country: '中国',
    language: 'chinese',
    rank: 4,
    dailyActiveUsers: '1500万+',
    monthlyRevenue: '2000-8000元',
    contractType: 'VIP订阅分成',
    royaltyRate: '订阅分成50%',
    minWords: '无硬性要求',
    pros: ['女频优势明显', '读者粘性高', '社区氛围好', '版权保护强'],
    cons: ['审核极严', '男频弱势', '更新压力大'],
    submissionTips: ['专注言情、耽美等女频题材', '注重情感描写', '遵守平台内容规范'],
    successStories: [
      { author: '言情天后', title: '《何以笙箫默》', income: '年入200万+', story: '经典都市言情，影视改编大获成功' },
      { author: '纯爱大神', title: '《魔道祖师》', income: '年入300万+', story: '现象级作品，动漫影视全面开花' }
    ],
    description: '专注于女性向原创文学的平台，言情、耽美、百合等题材表现优异。'
  },
  {
    id: 5,
    name: '纵横中文网',
    nameEn: 'Zongheng',
    country: '中国',
    language: 'chinese',
    rank: 5,
    dailyActiveUsers: '1000万+',
    monthlyRevenue: '3000-6000元',
    contractType: '分成+全勤',
    royaltyRate: '订阅分成50%',
    minWords: '2万字可申请签约',
    pros: ['福利政策好', '编辑负责', '竞争相对较小', '全勤奖丰厚'],
    cons: ['流量不如头部平台', '读者群体较小'],
    submissionTips: ['保持稳定更新拿全勤', '玄幻、都市题材较受欢迎', '与编辑保持沟通'],
    successStories: [
      { author: '纵横老将', title: '《剑来》', income: '年入100万+', story: '长期稳定更新，积累忠实读者' }
    ],
    description: '老牌网文平台，以福利政策完善著称，适合追求稳定收入的作者。'
  },
  {
    id: 6,
    name: '17K小说网',
    nameEn: '17K Novel',
    country: '中国',
    language: 'chinese',
    rank: 6,
    dailyActiveUsers: '800万+',
    monthlyRevenue: '2000-5000元',
    contractType: '分成+保底',
    royaltyRate: '订阅分成50%',
    minWords: '1.5万字可签约',
    pros: ['门槛较低', '审核较快', '新人友好', '活动丰富'],
    cons: ['流量一般', '头部作者少'],
    submissionTips: ['新人首选平台之一', '积极参与平台活动', '保持日更'],
    successStories: [
      { author: '17K新星', title: '《近身保镖》', income: '月入3万+', story: '新书期获得重点推荐，快速崛起' }
    ],
    description: '中文在线旗下平台，门槛较低，适合新人起步积累创作经验。'
  },
  {
    id: 7,
    name: '掌阅书城',
    nameEn: 'iReader',
    country: '中国',
    language: 'chinese',
    rank: 7,
    dailyActiveUsers: '1200万+',
    monthlyRevenue: '3000-7000元',
    contractType: '分成+渠道分发',
    royaltyRate: '多渠道分成',
    minWords: '3万字签约',
    pros: ['渠道资源丰富', '移动端体验好', '海外发行能力强'],
    cons: ['签约门槛较高', '审核周期长'],
    submissionTips: ['作品质量要求高', '适合多平台分发', '注重移动端阅读体验'],
    successStories: [],
    description: '掌阅科技旗下平台，拥有强大的渠道资源和海外发行能力。'
  },
  {
    id: 8,
    name: '米读小说',
    nameEn: 'MiDu Novel',
    country: '中国',
    language: 'chinese',
    rank: 8,
    dailyActiveUsers: '600万+',
    monthlyRevenue: '2000-5000元',
    contractType: '广告分成',
    royaltyRate: '按阅读时长分成',
    minWords: '2万字签约',
    pros: ['免费阅读模式', '用户增长快', '分成透明'],
    cons: ['单篇收益较低', '需要大量阅读时长'],
    submissionTips: ['适合快节奏爽文', '章节结尾留悬念', '保持高频更新'],
    successStories: [],
    description: '主打免费阅读的广告分成平台，用户增长迅速。'
  },
  {
    id: 9,
    name: '塔读文学',
    nameEn: 'TaDu Literature',
    country: '中国',
    language: 'chinese',
    rank: 9,
    dailyActiveUsers: '500万+',
    monthlyRevenue: '1500-4000元',
    contractType: '分成+全勤',
    royaltyRate: '订阅分成50%',
    minWords: '2万字签约',
    pros: ['新人扶持力度大', '审核速度快', '社区活跃'],
    cons: ['流量有限', '知名度较低'],
    submissionTips: ['新人友好平台', '积极参与社区互动', '保持稳定更新'],
    successStories: [],
    description: '新兴网文平台，对新人作者扶持力度大，社区氛围活跃。'
  },
  {
    id: 10,
    name: '刺猬猫',
    nameEn: 'Ciweimao',
    country: '中国',
    language: 'chinese',
    rank: 10,
    dailyActiveUsers: '400万+',
    monthlyRevenue: '2000-6000元',
    contractType: '打赏+订阅',
    royaltyRate: '打赏分成70%',
    minWords: '无硬性要求',
    pros: ['二次元文化浓厚', '同人创作友好', '读者互动性强'],
    cons: ['题材受限', '主流认可度低'],
    submissionTips: ['专注二次元、同人题材', '注重角色塑造', '与读者频繁互动'],
    successStories: [],
    description: '专注于二次元文化的网文平台，同人创作氛围浓厚。'
  }
];

export const englishPlatforms: GlobalPlatform[] = [
  {
    id: 11,
    name: 'Webnovel',
    nameEn: 'Webnovel',
    country: '新加坡/全球',
    language: 'english',
    rank: 1,
    dailyActiveUsers: '1000万+',
    monthlyRevenue: '$500-2000',
    contractType: '分成+合同制',
    royaltyRate: '50%分成',
    minWords: '英文翻译或原创',
    pros: ['全球市场', '美元结算', '竞争相对较小', '翻译作品有机会'],
    cons: ['语言要求高', '文化差异', '时差问题'],
    submissionTips: ['了解海外读者偏好', '玄幻修仙类受欢迎', '注意文化差异'],
    successStories: [
      { author: 'Chinese Translator', title: 'Coiling Dragon', income: '$3000/month', story: 'Successful translation of Chinese xianxia novel' }
    ],
    description: '阅文集团海外平台，面向全球英语读者，中国玄幻小说在海外市场非常受欢迎。'
  },
  {
    id: 12,
    name: 'Royal Road',
    nameEn: 'Royal Road',
    country: '加拿大',
    language: 'english',
    rank: 2,
    dailyActiveUsers: '500万+',
    monthlyRevenue: '$300-1500',
    contractType: 'Patreon众筹',
    royaltyRate: 'Patreon订阅收入',
    minWords: '无硬性要求',
    pros: ['LitRPG/Progression Fantasy热门', '社区反馈积极', 'Patreon变现成熟'],
    cons: ['需要自建读者群', '平台不直接付费'],
    submissionTips: ['LitRPG题材最受欢迎', '定期与读者互动', '建立Patreon页面'],
    successStories: [
      { author: 'Defensive Sub', title: 'The Primal Hunter', income: '$5000/month', story: 'Top LitRPG novel with strong Patreon support' }
    ],
    description: '专注于LitRPG和Progression Fantasy的平台，通过Patreon实现变现。'
  },
  {
    id: 13,
    name: 'Wattpad',
    nameEn: 'Wattpad',
    country: '加拿大',
    language: 'english',
    rank: 3,
    dailyActiveUsers: '8000万+',
    monthlyRevenue: '$200-1000',
    contractType: 'Wattpad Premium',
    royaltyRate: 'Premium阅读分成',
    minWords: '无硬性要求',
    pros: ['用户基数巨大', '年轻读者多', '社交属性强', '影视改编机会'],
    cons: ['变现困难', '竞争激烈', '青少年内容为主'],
    submissionTips: ['言情、青春题材受欢迎', '利用社交功能推广', '参与官方活动'],
    successStories: [
      { author: 'Anna Todd', title: 'After', income: '百万美元', story: 'From Wattpad to bestselling book and movie franchise' }
    ],
    description: '全球最大的社交阅读平台，年轻读者居多，有多部作品成功影视化。'
  },
  {
    id: 14,
    name: 'Amazon KDP',
    nameEn: 'Kindle Direct Publishing',
    country: '美国',
    language: 'english',
    rank: 4,
    dailyActiveUsers: 'N/A (零售平台)',
    monthlyRevenue: '$1000-10000+',
    contractType: '电子书销售分成',
    royaltyRate: '35%-70%',
    minWords: '建议25000字以上',
    pros: ['全球最大电子书市场', '自主定价权', 'Kindle Unlimited计划', '纸质书同步出版'],
    cons: ['营销需自理', '竞争极其激烈', '需要专业封面和编辑'],
    submissionTips: ['投资专业封面设计', '做好关键词优化', '考虑KU计划获取稳定收入'],
    successStories: [
      { author: 'Mark Dawson', title: 'John Milton Series', income: '$50000/month', story: 'Self-published thriller series became bestseller' }
    ],
    description: '亚马逊自助出版平台，全球最大的电子书销售渠道，支持自主定价和出版。'
  },
  {
    id: 15,
    name: 'Scribble Hub',
    nameEn: 'Scribble Hub',
    country: '美国',
    language: 'english',
    rank: 5,
    dailyActiveUsers: '200万+',
    monthlyRevenue: '$200-800',
    contractType: '广告+捐赠',
    royaltyRate: '广告分成+读者捐赠',
    minWords: '无硬性要求',
    pros: ['免费平台', '社区友好', '多种题材接受度高', '易于上手'],
    cons: ['变现能力弱', '流量有限'],
    submissionTips: ['保持定期更新', '与读者互动', '使用标签提高曝光'],
    successStories: [],
    description: '免费的网文发布平台，社区氛围友好，适合新人练手和积累读者。'
  },
  {
    id: 16,
    name: 'Inkitt',
    nameEn: 'Inkitt',
    country: '德国',
    language: 'english',
    rank: 6,
    dailyActiveUsers: '300万+',
    monthlyRevenue: '$300-1200',
    contractType: 'Galatea独家合同',
    royaltyRate: '根据表现分成',
    minWords: '建议5万字以上',
    pros: ['AI数据分析选稿', '可能获得Galatea出版', '欧洲市场优势'],
    cons: ['筛选严格', '合同绑定较长'],
    submissionTips: ['作品需有商业潜力', '注重开头吸引力', '完成度要高'],
    successStories: [],
    description: '使用AI数据分析筛选作品的平台，优秀作品有机会获得Galatea出版合同。'
  },
  {
    id: 17,
    name: 'GoodNovel',
    nameEn: 'GoodNovel',
    country: '新加坡',
    language: 'english',
    rank: 7,
    dailyActiveUsers: '800万+',
    monthlyRevenue: '$300-1500',
    contractType: '分成合同',
    royaltyRate: '50%分成',
    minWords: '英文原创为主',
    pros: ['女频优势', '分成比例高', '编辑支持好', '亚洲市场强'],
    cons: ['竞争激烈', '需要英文创作'],
    submissionTips: ['总裁文、狼人文受欢迎', '了解海外女频审美', '保持日更'],
    successStories: [],
    description: '专注于海外女频小说的平台，言情、总裁、狼人等题材表现优异。'
  },
  {
    id: 18,
    name: 'Dreame',
    nameEn: 'Dreame',
    country: '新加坡',
    language: 'english',
    rank: 8,
    dailyActiveUsers: '600万+',
    monthlyRevenue: '$200-1000',
    contractType: '分成+保底',
    royaltyRate: '根据合同而定',
    minWords: '建议3万字以上',
    pros: ['新兴市场增长快', '多元题材', '编辑指导'],
    cons: ['知名度较低', '流量不稳定'],
    submissionTips: ['尝试多元题材', '与编辑保持沟通', '关注平台活动'],
    successStories: [],
    description: '新兴的海外网文平台，在东南亚和欧美市场都有布局。'
  },
  {
    id: 19,
    name: 'NovelToon',
    nameEn: 'NovelToon',
    country: '新加坡',
    language: 'english',
    rank: 9,
    dailyActiveUsers: '500万+',
    monthlyRevenue: '$200-800',
    contractType: '广告分成',
    royaltyRate: '按阅读时长分成',
    minWords: '无硬性要求',
    pros: ['免费阅读模式', '漫画联动', '年轻用户多'],
    cons: ['单篇收益低', '需要大量阅读量'],
    submissionTips: ['适合快节奏爽文', '与漫画部门合作', '保持高频更新'],
    successStories: [],
    description: '结合小说和漫画的平台，免费阅读模式，年轻用户占比较高。'
  },
  {
    id: 20,
    name: 'MoonQuill',
    nameEn: 'MoonQuill',
    country: '美国',
    language: 'english',
    rank: 10,
    dailyActiveUsers: '100万+',
    monthlyRevenue: '$100-500',
    contractType: '众筹+订阅',
    royaltyRate: '读者直接支持',
    minWords: '无硬性要求',
    pros: ['创作者友好', '直接读者支持', '社区驱动', '灵活变现'],
    cons: ['流量小', '需要自建受众', '平台知名度低'],
    submissionTips: ['建立个人品牌', '跨平台推广', '与读者深度互动'],
    successStories: [],
    description: '社区驱动的创作者平台，强调作者与读者的直接联系和支持。'
  }
];

export const allPlatforms: GlobalPlatform[] = [...chinesePlatforms, ...englishPlatforms];
