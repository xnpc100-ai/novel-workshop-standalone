import { Card } from '@/components/ui/card';

const domesticPlatforms = [
  { name: '起点中文网', url: 'https://www.qidian.com/', desc: '阅文集团旗下男频网文龙头' },
  { name: '晋江文学城', url: 'https://www.jjwxc.net/', desc: '女频原创文学第一站' },
  { name: '番茄小说', url: 'https://fanqienovel.com/', desc: '抖音旗下免费阅读平台' },
  { name: '七猫小说', url: 'https://www.7mao.com/', desc: '免费小说+广告变现模式' },
  { name: '纵横中文网', url: 'http://www.zongheng.com/', desc: '老牌网文平台，玄幻武侠为主' },
  { name: '飞卢小说网', url: 'https://b.faloo.com/', desc: '同人小说与快节奏爽文' },
  { name: '潇湘书院', url: 'https://www.xxsy.net/', desc: '阅文旗下女频品牌' },
  { name: '红袖添香', url: 'https://www.hongxiu.com/', desc: '女性向言情文学平台' },
  { name: '创世中文网', url: 'https://chuangshi.qq.com/', desc: '腾讯系男频创作平台' },
  { name: '17K小说网', url: 'https://www.17k.com/', desc: '中文在线旗下综合平台' },
  { name: '书旗小说', url: 'https://www.shuqi.com/', desc: '阿里文学移动阅读平台' },
  { name: '咪咕阅读', url: 'https://www.migu.cn/', desc: '中国移动数字阅读基地' },
  { name: '云起书院', url: 'https://yunqi.qq.com/', desc: '阅文女频新锐作家孵化地' },
  { name: '刺猬猫', url: 'https://www.ciweimao.com/', desc: '二次元轻小说社区' },
  { name: '小说阅读网', url: 'https://www.readnovel.com/', desc: '阅文集团综合阅读平台' },
  { name: '百度作家平台', url: 'https://zuojia.baidu.com/', desc: 'AI辅助写作与大纲生成' },
  { name: '掌阅文学', url: 'https://www.ireader.com/', desc: '掌阅科技原创内容生态' },
  { name: '磨铁中文网', url: 'https://www.motie.com/', desc: '悬疑推理与都市异能' },
  { name: '塔读文学', url: 'https://www.tadu.com/', desc: '塔读科技旗下网文平台' },
  { name: '黑岩阅读', url: 'https://www.heiyan.com/', desc: '悬疑灵异与都市传说' },
  { name: '逐浪中文网', url: 'https://www.zhulang.com/', desc: '历史架空与军事题材' },
  { name: '火星小说', url: 'https://www.huoxingxiaoshuo.com/', desc: '新媒体风短篇连载' },
  { name: '米读小说', url: 'https://www.midushu.com/', desc: '今日头条旗下免费阅读' },
  { name: '连尚读书', url: 'https://www.lianshang.com/', desc: '连尚wifi旗下阅读平台' },
  { name: '得间小说', url: 'https://www.dejian.com/', desc: '免费小说聚合平台' },
  { name: '疯读小说', url: 'https://www.fengduxs.com/', desc: '短视频引流免费阅读' },
  { name: '快点阅读', url: 'https://www.kuaishen.com/', desc: '对话式小说创新平台' },
  { name: '话本小说', url: 'https://www.huaben.com/', desc: '剧本杀式互动小说' },
  { name: '息壤中文网', url: 'https://www.xirang.com/', desc: '小众精品文学社区' },
  { name: '豆瓣阅读', url: 'https://read.douban.com/', desc: '文艺青年与严肃文学' },
];

const internationalPlatforms = [
  { name: 'Wattpad', url: 'https://www.wattpad.com/', desc: '全球最大社交写作平台' },
  { name: 'Royal Road', url: 'https://www.royalroad.com/', desc: '奇幻科幻与异世界小说' },
  { name: 'Amazon KDP', url: 'https://kdp.amazon.com/', desc: '亚马逊自助出版平台' },
  { name: 'Webnovel', url: 'https://www.webnovel.com/', desc: '阅文集团海外门户' },
  { name: 'Wuxiaworld', url: 'https://www.wuxiaworld.com/', desc: '中国网文英译先驱' },
  { name: 'AO3', url: 'https://archiveofourown.org/', desc: '非营利同人小说圣地' },
  { name: 'Radish', url: 'https://radishfiction.com/', desc: '追剧式短篇连载平台' },
  { name: 'Scribble Hub', url: 'https://www.scribblehub.com/', desc: '轻小说爱好者社区' },
  { name: 'GoodNovel', url: 'https://www.goodnovel.com/', desc: '新阅旗下女频出海' },
  { name: 'Dreame', url: 'https://www.dreame.com/', desc: '互动小说与狼人题材' },
  { name: 'Tapas', url: 'https://tapas.io/', desc: '韩漫与网络小说结合' },
  { name: 'Inkitt', url: 'https://inkitt.com/', desc: '数据驱动的内容孵化' },
  { name: 'Moonquill', url: 'https://moonquill.com/', desc: '高质量奇幻科幻平台' },
  { name: 'Creative Novels', url: 'https://creativenovels.com/', desc: 'AI辅助创作平台' },
  { name: 'FanFiction', url: 'https://www.fanfiction.net/', desc: '英文同人小说鼻祖' },
  { name: 'Munpia', url: 'https://www.munpia.com/', desc: '韩国原创网文平台' },
  { name: 'Volare Novels', url: 'https://volarenovels.com/', desc: '北美受众中国网文英译' },
  { name: 'TapRead', url: 'https://www.tapread.com/', desc: '纵横中文网海外版' },
  { name: 'FANmily', url: 'https://fanmily.com/', desc: '中日韩网文多语言版' },
  { name: 'BookBub', url: 'https://www.bookbub.com/', desc: '独立作者推广平台' },
  { name: 'Smashwords', url: 'https://www.smashwords.com/', desc: '免费电子书分发' },
  { name: 'Lulu', url: 'https://www.lulu.com/', desc: '按需印刷与自出版' },
  { name: 'Barnes & Noble', url: 'https://www.barnesandnoble.com/', desc: '美国连锁书店线上版' },
  { name: 'Kobo', url: 'https://www.kobo.com/', desc: '加拿大电子书零售商' },
  { name: 'Google Play Books', url: 'https://play.google.com/store/books', desc: '谷歌电子书商店' },
  { name: 'Apple Books', url: 'https://books.apple.com/', desc: '苹果图书生态系统' },
  { name: 'Patreon', url: 'https://www.patreon.com/', desc: '创作者会员订阅制' },
  { name: 'Medium', url: 'https://medium.com/', desc: '长文博客与故事分享' },
  { name: 'Substack', url: 'https://substack.com/', desc: '付费Newsletter平台' },
  { name: 'Reedsy', url: 'https://reedsy.com/', desc: '自助出版服务市场' },
];

export function NovelPlatforms() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8 text-foreground">
          全球小说创作平台导航
        </h2>

        {/* 国内平台 */}
        <div className="mb-10">
          <h3 className="text-lg font-semibold mb-4 text-primary flex items-center gap-2">
            <span className="w-1 h-5 bg-primary rounded-full"></span>
            国内主流平台（{domesticPlatforms.length}个）
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {domesticPlatforms.map((platform) => (
              <a
                key={platform.name}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Card className="p-3 hover:shadow-md transition-all duration-200 hover:scale-[1.02] border-border/50 hover:border-primary/30 bg-background">
                  <div className="font-medium text-sm text-foreground group-hover:text-primary transition-colors truncate">
                    {platform.name}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {platform.desc}
                  </div>
                </Card>
              </a>
            ))}
          </div>
        </div>

        {/* 海外平台 */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-primary flex items-center gap-2">
            <span className="w-1 h-5 bg-primary rounded-full"></span>
            海外知名平台（{internationalPlatforms.length}个）
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {internationalPlatforms.map((platform) => (
              <a
                key={platform.name}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Card className="p-3 hover:shadow-md transition-all duration-200 hover:scale-[1.02] border-border/50 hover:border-primary/30 bg-background">
                  <div className="font-medium text-sm text-foreground group-hover:text-primary transition-colors truncate">
                    {platform.name}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {platform.desc}
                  </div>
                </Card>
              </a>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8">
          以上平台涵盖男频、女频、同人、轻小说等多种类型，供创作者参考学习
        </p>
      </div>
    </section>
  );
}
