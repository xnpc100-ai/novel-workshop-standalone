import { TrendingUp, Zap, DollarSign, BookOpen } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export function ContentSection() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* 行业资讯 */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            2026网文行业趋势
          </h2>
          <div className="bg-card rounded-xl p-6 border border-border">
            <p className="text-muted-foreground leading-relaxed">
              当下网文行业彻底进入「效率制胜」时代，全网超40%签约新书、60%新媒体爆款网文，均依托AI辅助完成仿写、润色、节奏优化、大纲迭代。传统纯手动码字存在更新效率低、章节节奏混乱、套路老旧同质化、极易平台限流、变现收益极低等诸多痛点。合规AI仿写可精准复刻爆款底层框架，优化章节节奏，重塑真人细腻文风，大幅提升作品完读率、追读率与签约过审率。
            </p>
          </div>
        </div>

        {/* 四大核心优势 */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Zap className="w-6 h-6 text-primary" />
            四大核心仿写优势
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                title: '双模型协同校验',
                desc: '内置6大行业顶级写作模型，独家支持双模型并行生成、双向逻辑互审，完美解决AI文风僵硬、剧情流水、人设崩塌等通病。',
              },
              {
                title: '五维精准合规仿写',
                desc: '覆盖大纲复刻、剧情框架、人物人设、章节节奏、文风质感五大核心，仅借鉴爆款优质框架，不照搬原文内容。',
              },
              {
                title: '全场景全平台适配',
                desc: '支持千字短大纲到百万字超长篇全档位创作，完美适配番茄、七猫、起点、海外全平台发文规范。',
              },
              {
                title: '零门槛开箱即用',
                desc: '系统内置双重加密官方API密钥，无需充值模型、无需搭建环境、无需调试参数，激活后直接一键生成。',
              },
            ].map((item, index) => (
              <div key={index} className="bg-card rounded-xl p-5 border border-border">
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 平台收益对比 */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-primary" />
            全网主流网文平台收益
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-card rounded-xl p-5 border border-border">
              <h3 className="font-semibold text-foreground mb-3">国内顶流平台</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><span className="text-foreground font-medium">番茄小说：</span>流量天花板，新手零门槛，月收益3000-10000+</li>
                <li><span className="text-foreground font-medium">七猫小说：</span>千字20元起保底，全勤福利稳定</li>
                <li><span className="text-foreground font-medium">起点中文网：</span>IP变现天花板，爆款可斩获数十万版权收益</li>
              </ul>
            </div>
            <div className="bg-card rounded-xl p-5 border border-border">
              <h3 className="font-semibold text-foreground mb-3">海外跨境平台</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><span className="text-foreground font-medium">Webnovel：</span>海外流量庞大，男频玄幻受众广</li>
                <li><span className="text-foreground font-medium">GoodNovel/Dreame：</span>女频言情付费转化率高</li>
                <li><span className="text-foreground font-medium">Amazon Kindle：</span>常年持续曝光，被动长尾收益</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 避坑干货 */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            作者必备核心避坑干货
          </h2>
          <div className="space-y-4">
            {[
              {
                title: '版权合规避坑',
                content: '实操落地「仿写≠抄袭」核心逻辑，通过框架借鉴、内容原创、文风重塑三重优化，精准控制内容相似度，彻底规避平台查重、版权投诉风险。',
              },
              {
                title: 'AI文笔优化避坑',
                content: '专属AI润色改写实操技巧，针对性解决AI文笔僵硬、流水账、无情绪、同质化严重等问题，打磨出真人细腻文风。',
              },
              {
                title: '平台规则避坑',
                content: '实时同步各大网文平台最新限流、违规、敏感审核规则，规避老旧淘汰套路、违禁剧情、敏感话术。',
              },
            ].map((item, index) => (
              <div key={index} className="bg-card rounded-xl p-5 border border-border">
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 社群服务 */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">双模式分层社群服务</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="font-semibold text-foreground mb-3">免费基础作者社群</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                面向所有网文创作爱好者开放，无门槛入驻，主打创作交流、基础答疑、资源互通。社群常态化分享通用AI仿写思路、基础合规避坑常识、各平台基础发文规则。
              </p>
            </div>
            <div className="bg-card rounded-xl p-6 border-2 border-primary/30">
              <h3 className="font-semibold text-foreground mb-3">付费会员高阶专属社群</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                私密无广告、专注网文仿写变现深耕。不定期重磅更新独家干货资源：爆款书单拆解、冷热赛道风向预判、高阶精细化仿写提示词、海内外平台全套发文攻略等。提供一对一专属定制答疑。
              </p>
            </div>
          </div>
        </div>

        {/* 小说平台导航 */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">全球小说创作平台导航</h2>

          {/* 国内平台 */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-primary">国内主流平台</h3>
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-1.5">
              {[
                { name: '起点中文网', url: 'https://www.qidian.com/', desc: '阅文男频' },
                { name: '晋江文学城', url: 'https://www.jjwxc.net/', desc: '女频原创' },
                { name: '番茄小说', url: 'https://fanqienovel.com/', desc: '抖音免费' },
                { name: '七猫小说', url: 'https://www.7mao.com/', desc: '免费+广告' },
                { name: '纵横中文网', url: 'http://www.zongheng.com/', desc: '老牌玄幻' },
                { name: '飞卢小说网', url: 'https://b.faloo.com/', desc: '同人爽文' },
                { name: '潇湘书院', url: 'https://www.xxsy.net/', desc: '阅文女频' },
                { name: '红袖添香', url: 'https://www.hongxiu.com/', desc: '女性言情' },
                { name: '创世中文网', url: 'https://chuangshi.qq.com/', desc: '腾讯男频' },
                { name: '17K小说网', url: 'https://www.17k.com/', desc: '中文在线' },
                { name: '书旗小说', url: 'https://www.shuqi.com/', desc: '阿里阅读' },
                { name: '咪咕阅读', url: 'https://www.migu.cn/', desc: '移动数字' },
                { name: '云起书院', url: 'https://yunqi.qq.com/', desc: '女频孵化' },
                { name: '刺猬猫', url: 'https://www.ciweimao.com/', desc: '二次元' },
                { name: '小说阅读网', url: 'https://www.readnovel.com/', desc: '阅文综合' },
                { name: '百度作家', url: 'https://zuojia.baidu.com/', desc: 'AI辅助' },
                { name: '掌阅文学', url: 'https://www.ireader.com/', desc: '掌阅原创' },
                { name: '磨铁中文网', url: 'https://www.motie.com/', desc: '悬疑推理' },
                { name: '塔读文学', url: 'https://www.tadu.com/', desc: '塔读网文' },
                { name: '黑岩阅读', url: 'https://www.heiyan.com/', desc: '悬疑灵异' },
                { name: '逐浪中文网', url: 'https://www.zhulang.com/', desc: '历史军事' },
                { name: '火星小说', url: 'https://www.huoxingxiaoshuo.com/', desc: '新媒体' },
                { name: '米读小说', url: 'https://www.midushu.com/', desc: '头条免费' },
                { name: '连尚读书', url: 'https://www.lianshang.com/', desc: 'wifi阅读' },
                { name: '得间小说', url: 'https://www.dejian.com/', desc: '免费聚合' },
                { name: '疯读小说', url: 'https://www.fengduxs.com/', desc: '短视频' },
                { name: '快点阅读', url: 'https://www.kuaishen.com/', desc: '对话式' },
                { name: '话本小说', url: 'https://www.huaben.com/', desc: '剧本杀' },
                { name: '息壤中文网', url: 'https://www.xirang.com/', desc: '小众精品' },
                { name: '豆瓣阅读', url: 'https://read.douban.com/', desc: '文艺严肃' },
                { name: '盐言故事', url: 'https://yan.yuewen.com/', desc: '知乎短篇' },
                { name: 'QQ阅读', url: 'https://weread.qq.com/', desc: '腾讯综合' },
                { name: '起点女生网', url: 'https://www.qdmm.com/', desc: '女频专属' },
                { name: '言情小说吧', url: 'https://www.x81zw.com/', desc: '老牌言情' },
                { name: '花语女生网', url: 'https://www.huayu.org/', desc: '纵横女频' },
                { name: '四月天女生', url: 'https://www.4yt.net/', desc: '古言' },
                { name: '九天中文网', url: 'https://www.9tsw.com/', desc: '新媒体' },
                { name: '昆仑中文网', url: 'https://www.kunlun.com/', desc: '免费阅读' },
                { name: '红薯中文', url: 'https://www.hongshu.com/', desc: '掌阅系' },
                { name: '有乐中文网', url: 'https://www.uucn.com/', desc: '男女频' },
                { name: '品阅中文网', url: 'https://www.pinyue.com/', desc: '无线风' },
                { name: '书山中文网', url: 'https://www.shushan.com/', desc: '男频' },
                { name: '趣阅小说网', url: 'https://www.quyue.com/', desc: '女频' },
                { name: '速更小说', url: 'https://www.sugeng.com/', desc: '大融合' },
                { name: '魔情言情', url: 'https://www.moqing.com/', desc: '女频' },
                { name: '神起中文网', url: 'https://www.shenqi.com/', desc: '男频' },
                { name: 'i次元轻小说', url: 'https://www.iciyuan.com/', desc: '轻小说' },
                { name: '香网', url: 'https://www.xiang5.com/', desc: '清爽站' },
                { name: '榕树下', url: 'https://www.rongshuxia.com/', desc: '老牌门户' },
                { name: '翠微居', url: 'https://www.cuiweiju.com/', desc: '最早站' },
              ].map((platform) => (
                <a
                  key={platform.name}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-card rounded p-1.5 border border-border/50 hover:border-primary/30 hover:shadow-sm transition-all duration-200 hover:scale-[1.02] block"
                >
                  <div className="font-medium text-[11px] text-foreground group-hover:text-primary transition-colors truncate">
                    {platform.name}
                  </div>
                  <div className="text-[9px] text-muted-foreground mt-0.5 line-clamp-1">
                    {platform.desc}
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* 海外平台 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3 text-primary">海外知名平台</h3>
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-1.5">
              {[
                { name: 'Wattpad', url: 'https://www.wattpad.com/', desc: '全球最大' },
                { name: 'Royal Road', url: 'https://www.royalroad.com/', desc: '奇幻科幻' },
                { name: 'Amazon KDP', url: 'https://kdp.amazon.com/', desc: '自助出版' },
                { name: 'Webnovel', url: 'https://www.webnovel.com/', desc: '阅文海外' },
                { name: 'Wuxiaworld', url: 'https://www.wuxiaworld.com/', desc: '中国网文' },
                { name: 'AO3', url: 'https://archiveofourown.org/', desc: '同人圣地' },
                { name: 'Radish', url: 'https://radishfiction.com/', desc: '追剧式' },
                { name: 'Scribble Hub', url: 'https://www.scribblehub.com/', desc: '轻小说' },
                { name: 'GoodNovel', url: 'https://www.goodnovel.com/', desc: '女频出海' },
                { name: 'Dreame', url: 'https://www.dreame.com/', desc: '狼人题材' },
                { name: 'Tapas', url: 'https://tapas.io/', desc: '韩漫小说' },
                { name: 'Inkitt', url: 'https://inkitt.com/', desc: '数据驱动' },
                { name: 'Moonquill', url: 'https://moonquill.com/', desc: '高质量' },
                { name: 'Creative Novels', url: 'https://creativenovels.com/', desc: 'AI辅助' },
                { name: 'FanFiction', url: 'https://www.fanfiction.net/', desc: '同人鼻祖' },
                { name: 'Munpia', url: 'https://www.munpia.com/', desc: '韩国原创' },
                { name: 'Volare Novels', url: 'https://volarenovels.com/', desc: '北美英译' },
                { name: 'TapRead', url: 'https://www.tapread.com/', desc: '纵横海外' },
                { name: 'FANmily', url: 'https://fanmily.com/', desc: '多语言' },
                { name: 'BookBub', url: 'https://www.bookbub.com/', desc: '作者推广' },
                { name: 'Smashwords', url: 'https://www.smashwords.com/', desc: '免费分发' },
                { name: 'Lulu', url: 'https://www.lulu.com/', desc: '按需印刷' },
                { name: 'Barnes & Noble', url: 'https://www.barnesandnoble.com/', desc: '连锁书店' },
                { name: 'Kobo', url: 'https://www.kobo.com/', desc: '加拿大' },
                { name: 'Google Play Books', url: 'https://play.google.com/store/books', desc: '谷歌' },
                { name: 'Apple Books', url: 'https://books.apple.com/', desc: '苹果图书' },
                { name: 'Patreon', url: 'https://www.patreon.com/', desc: '创作者订阅' },
                { name: 'Medium', url: 'https://medium.com/', desc: '长文博客' },
                { name: 'Substack', url: 'https://substack.com/', desc: '付费邮件' },
                { name: 'Reedsy', url: 'https://reedsy.com/', desc: '自助出版' },
              ].map((platform) => (
                <a
                  key={platform.name}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-card rounded p-1.5 border border-border/50 hover:border-primary/30 hover:shadow-sm transition-all duration-200 hover:scale-[1.02] block"
                >
                  <div className="font-medium text-[11px] text-foreground group-hover:text-primary transition-colors truncate">
                    {platform.name}
                  </div>
                  <div className="text-[9px] text-muted-foreground mt-0.5 line-clamp-1">
                    {platform.desc}
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* 投稿注意事项与写作技巧 - 可点击跳转详情页 */}
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/20">
            <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full"></span>
              各平台投稿注意事项与写作技巧
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              {/* 投稿注意事项 - 可点击 */}
              <Link to="/guide/submission" className="group block">
                <div className="bg-background/80 rounded-lg p-4 border border-border group-hover:border-primary/50 group-hover:shadow-md transition-all duration-200">
                  <h4 className="font-semibold text-primary mb-3 flex items-center gap-2">
                    📋 投稿注意事项
                    <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">点击查看详情 →</span>
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span><strong>字数要求：</strong>至少6000字起步（3章），最好1万字；单章不超过2100字</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span><strong>格式规范：</strong>用Word文档投稿，宋体五号字，行距1.0，首段缩进两字符</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span><strong>附带大纲：</strong>包括人设、背景、主线、故事梗概、预计字数、本书亮点</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span><strong>避免一稿多投：</strong>同一平台不要同时投多个编辑，不同平台可分别投稿</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span><strong>存稿准备：</strong>过稿后建议存稿1-1.5万字，保持更新稳定性</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span><strong>了解规则：</strong>投稿前仔细阅读平台签约规则和福利政策</span>
                    </li>
                  </ul>
                </div>
              </Link>

              {/* 写作技巧 - 可点击 */}
              <Link to="/guide/writing-tips" className="group block">
                <div className="bg-background/80 rounded-lg p-4 border border-border group-hover:border-primary/50 group-hover:shadow-md transition-all duration-200">
                  <h4 className="font-semibold text-primary mb-3 flex items-center gap-2">
                    ✍️ 核心写作技巧
                    <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">点击查看详情 →</span>
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span><strong>黄金三章：</strong>前三章框架清晰、剧情新颖、主线明确、节奏明快、金手指鲜明</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span><strong>开篇钩子：</strong>300字内制造强烈冲突或痛点，800字前出现金手指或反转</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span><strong>讲好故事：</strong>重心是讲故事而非讲道理，用大白话，不卖弄文采</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span><strong>保持更新：</strong>日更4000字以上，不断更，断更要提前请假并补更</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span><strong>主角塑造：</strong>三观正、不圣母、有成长弧光，智商在线但不完美</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span><strong>剧情起伏：</strong>几章一小高潮，几十章一大高潮，学会卡点断章</span>
                    </li>
                  </ul>
                </div>
              </Link>
            </div>

            {/* 各平台特点对比 - 可点击 */}
            <Link to="/guide/platforms" className="group block mt-6 pt-6 border-t border-primary/20">
              <h4 className="font-semibold text-primary mb-3 flex items-center gap-2">
                🎯 主要平台特点对比
                <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">点击查看详情 →</span>
              </h4>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                <div className="bg-background/50 rounded-lg p-3 group-hover:bg-primary/5 transition-colors">
                  <div className="font-medium text-foreground mb-1">起点中文网</div>
                  <div className="text-xs text-muted-foreground">读者25-40岁，逻辑严密性要求高，适合慢热构建世界观，签约难但IP价值高</div>
                </div>
                <div className="bg-background/50 rounded-lg p-3 group-hover:bg-primary/5 transition-colors">
                  <div className="font-medium text-foreground mb-1">番茄小说</div>
                  <div className="text-xs text-muted-foreground">日活3亿+，算法推荐，快节奏爽文，对话流完读率高47%，适合手速快的作者</div>
                </div>
                <div className="bg-background/50 rounded-lg p-3 group-hover:bg-primary/5 transition-colors">
                  <div className="font-medium text-foreground mb-1">七猫小说</div>
                  <div className="text-xs text-muted-foreground">保底+超保底双轨制，小镇青年用户，情感浓烈节奏快，需2万字正文加大纲内投</div>
                </div>
                <div className="bg-background/50 rounded-lg p-3 group-hover:bg-primary/5 transition-colors">
                  <div className="font-medium text-foreground mb-1">晋江文学城</div>
                  <div className="text-xs text-muted-foreground">女频绝对头部，言情纯爱为主，付费阅读，影视IP开发活跃，字数门槛低</div>
                </div>
                <div className="bg-background/50 rounded-lg p-3 group-hover:bg-primary/5 transition-colors">
                  <div className="font-medium text-foreground mb-1">纵横中文网</div>
                  <div className="text-xs text-muted-foreground">男频第二大，传统玄幻武侠，大神聚集，门槛低于起点，需1万字正文加大纲</div>
                </div>
                <div className="bg-background/50 rounded-lg p-3 group-hover:bg-primary/5 transition-colors">
                  <div className="font-medium text-foreground mb-1">盐言故事</div>
                  <div className="text-xs text-muted-foreground">情绪付费平台，18-35岁高知女性，第一人称沉浸式短篇，1500字内形成情绪闭环</div>
                </div>
              </div>
            </Link>

            <p className="text-center text-xs text-muted-foreground mt-6">
              以上平台涵盖男频、女频、同人、轻小说等多种类型，供创作者参考学习
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
