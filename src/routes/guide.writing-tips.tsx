import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeft, PenTool, Zap, BookOpen, Clock, Users, TrendingUp } from 'lucide-react';

export const Route = createFileRoute('/guide/writing-tips')({
  component: WritingTipsPage,
});

function WritingTipsPage() {
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
            <PenTool className="w-8 h-8 text-primary" />
            核心写作技巧详解
          </h1>
          <p className="text-lg text-muted-foreground">
            从开篇钩子到剧情起伏，从主角塑造到更新节奏，掌握网文创作的核心方法论
          </p>
        </div>
      </section>

      {/* 主要内容区 */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* 1. 黄金三章 */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground mb-2">一、黄金三章：决定作品生死的关键</h2>
              <p className="text-sm text-muted-foreground">前三章是读者决定是否追读的分水岭，也是编辑判断作品潜力的核心依据</p>
            </div>
          </div>

          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="bg-background/50 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">🎯 黄金三章的五大要素</h3>
              <ul className="space-y-3 ml-4">
                <li>
                  <strong>框架清晰：</strong>第一章必须交代清楚故事背景、主角身份、核心冲突。读者读完第一章应该能回答：这是什么样的世界？主角是谁？他要解决什么问题？避免故弄玄虚、信息碎片化。
                </li>
                <li>
                  <strong>剧情新颖：</strong>避免老套的"废柴退婚流""穿越重生流"直接照搬。即使是经典套路，也要加入创新元素。例如：同样是系统流，可以设计"反向系统"（系统给的任务越难奖励越高）或"双系统对抗"（两个系统互相干扰）。
                </li>
                <li>
                  <strong>主线明确：</strong>前三章必须让读者清楚知道故事的主线是什么。是复仇？是逆袭？是求生？是恋爱？不要试图在开头埋太多伏笔，导致主线模糊。一条清晰的主线比十条隐晦的支线更有吸引力。
                </li>
                <li>
                  <strong>节奏明快：</strong>每章都要有推进，不能有纯铺垫章节。第一章引入冲突，第二章激化矛盾，第三章出现转机或金手指。避免大段环境描写、人物心理独白、世界观设定说明。用动作和对话推动剧情。
                </li>
                <li>
                  <strong>金手指鲜明：</strong>如果作品有金手指（系统、传承、异能等），必须在第三章前亮相并展示其作用。金手指要具体、可量化、有成长空间。例如："每天签到获得随机技能"比"获得神秘力量"更有吸引力。
                </li>
              </ul>
            </div>

            <div className="bg-background/50 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">📖 黄金三章结构模板</h3>
              <div className="space-y-3">
                <div className="border-l-4 border-primary pl-4">
                  <p className="font-medium text-foreground">第一章：引入冲突（1500-2000字）</p>
                  <ul className="mt-2 space-y-1 ml-4 text-xs">
                    <li>• 开场即高潮：主角遭遇重大挫折或危机</li>
                    <li>• 快速交代背景：用对话或回忆自然带出世界观</li>
                    <li>• 树立反派/对手：制造明确的对立面</li>
                    <li>• 结尾留悬念：危机未解，引发读者好奇</li>
                  </ul>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <p className="font-medium text-foreground">第二章：激化矛盾（1500-2000字）</p>
                  <ul className="mt-2 space-y-1 ml-4 text-xs">
                    <li>• 冲突升级：反派出手或局势恶化</li>
                    <li>• 展现主角性格：通过应对方式体现人设</li>
                    <li>• 铺垫金手指：暗示即将获得的转机</li>
                    <li>• 情绪渲染：让读者产生共情和期待</li>
                  </ul>
                </div>
                <div className="border-l-4 border-primary pl-4">
                  <p className="font-medium text-foreground">第三章：金手指亮相（1500-2000字）</p>
                  <ul className="mt-2 space-y-1 ml-4 text-xs">
                    <li>• 金手指正式激活：展示具体功能</li>
                    <li>• 首次小试牛刀：用金手指解决一个小问题</li>
                    <li>• 确立短期目标：接下来要做什么</li>
                    <li>• 留下更大悬念：金手指的局限或代价</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <h3 className="font-semibold text-primary mb-2">💡 实战案例对比</h3>
              <div className="grid sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <p className="font-medium text-red-700 mb-2">❌ 错误示范</p>
                  <p>第一章花了1500字描写主角起床、刷牙、吃早餐，然后慢慢回忆前世经历，最后才提到今天要参加宗门考核。节奏拖沓，冲突不明显。</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded p-3">
                  <p className="font-medium text-green-700 mb-2">✅ 正确示范</p>
                  <p>开篇第一句："林凡被踹下悬崖时，脑海中突然响起机械音：【最强修仙系统已激活】"。直接切入危机+金手指，瞬间抓住读者。</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. 开篇钩子 */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground mb-2">二、开篇钩子：300字内抓住读者</h2>
              <p className="text-sm text-muted-foreground">开篇钩子是留住读者的第一道防线，决定了作品的初始留存率</p>
            </div>
          </div>

          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="bg-background/50 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">🪝 什么是开篇钩子</h3>
              <p className="mb-3">开篇钩子指文章开头300字内制造的强烈冲突、悬念、痛点或反转，目的是让读者产生"我必须看下去"的冲动。</p>
              <ul className="space-y-2 ml-4">
                <li><strong>时间要求：</strong>300字内必须出现钩子，最好在100字内</li>
                <li><strong>强度要求：</strong>要有足够的情绪冲击力，不能平淡无奇</li>
                <li><strong>类型多样：</strong>可以是生死危机、情感背叛、身份揭露、意外转折等</li>
              </ul>
            </div>

            <div className="bg-background/50 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">🎣 六种高效钩子类型</h3>
              <div className="space-y-3">
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="font-medium text-foreground">1. 生死危机型</p>
                  <p className="text-xs mt-1">"刀锋抵住喉咙的瞬间，林萧笑了。"——立即制造紧张感，读者想知道主角如何脱险。</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <p className="font-medium text-foreground">2. 情感背叛型</p>
                  <p className="text-xs mt-1">"婚礼现场，新娘挽着伴郎的手走向神父。"——激发读者的愤怒和好奇，想看主角如何反击。</p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <p className="font-medium text-foreground">3. 身份反转型</p>
                  <p className="text-xs mt-1">"被嘲笑了十年的废物，竟是隐藏的世界首富。"——满足读者的爽感期待。</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="font-medium text-foreground">4. 超自然现象型</p>
                  <p className="text-xs mt-1">"镜子里的我，眨了眨眼。"——制造诡异氛围，引发探索欲。</p>
                </div>
                <div className="border-l-4 border-red-500 pl-4">
                  <p className="font-medium text-foreground">5. 极端处境型</p>
                  <p className="text-xs mt-1">"氧气只剩3%，飞船偏离轨道，而我是唯一清醒的人。"——高压情境吸引读者。</p>
                </div>
                <div className="border-l-4 border-pink-500 pl-4">
                  <p className="font-medium text-foreground">6. 反常识设定型</p>
                  <p className="text-xs mt-1">"在这个世界，说谎会被雷劈。"——新奇设定激发好奇心。</p>
                </div>
              </div>
            </div>

            <div className="bg-background/50 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">⏱️ 800字前的关键节点</h3>
              <ul className="space-y-2 ml-4">
                <li><strong>300字内：</strong>必须出现开篇钩子（冲突/悬念/反转）</li>
                <li><strong>500字左右：</strong>交代主角基本信息（姓名、身份、当前处境）</li>
                <li><strong>800字前：</strong>金手指亮相或重大转折出现，给读者希望</li>
                <li><strong>1000字后：</strong>进入第一个小高潮，展示金手指的作用</li>
              </ul>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <h3 className="font-semibold text-primary mb-2">💡 钩子设计原则</h3>
              <ul className="space-y-2 ml-4">
                <li><strong>真实性：</strong>钩子要与后续剧情连贯，不能为了吸引眼球而编造无法圆回的设定</li>
                <li><strong>相关性：</strong>钩子要服务于主线，不是孤立的噱头</li>
                <li><strong>情绪共鸣：</strong>选择读者容易产生共情的场景（被欺负、被背叛、绝境求生等）</li>
                <li><strong>适度夸张：</strong>可以戏剧化，但不能脱离逻辑，否则会让读者出戏</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 3. 讲好故事 */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground mb-2">三、讲好故事：重心是叙事而非说教</h2>
              <p className="text-sm text-muted-foreground">网文的本质是娱乐产品，讲好一个吸引人的故事比表达深刻思想更重要</p>
            </div>
          </div>

          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="bg-background/50 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">📚 故事 vs 道理</h3>
              <ul className="space-y-2 ml-4">
                <li><strong>网文定位：</strong>网文是大众娱乐消费品，读者阅读目的是放松、消遣、获得爽感，不是接受教育或思考人生哲理。</li>
                <li><strong>常见误区：</strong>新人作者容易陷入"我要通过这个故事表达什么深刻道理"的思维，导致情节服务于主题，故事变得说教味重、可读性差。</li>
                <li><strong>正确做法：</strong>先想好一个吸引人的故事框架，再自然融入你想表达的观点。让读者在享受故事的过程中潜移默化地接受你的价值观，而不是直接灌输。</li>
              </ul>
            </div>

            <div className="bg-background/50 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">✍️ 大白话写作原则</h3>
              <ul className="space-y-2 ml-4">
                <li><strong>通俗易懂：</strong>使用日常口语，避免生僻字、文言文、复杂句式。目标是让初中文化水平的读者也能流畅阅读。</li>
                <li><strong>简洁明了：</strong>一句话能说清楚的不要用两句话。删除冗余的形容词、副词，保留核心动词和名词。</li>
                <li><strong>画面感强：</strong>多用具体的动作、表情、声音描写，少用抽象的心理描述。例如："他拳头紧握，指节发白"比"他很愤怒"更有画面感。</li>
                <li><strong>对话驱动：</strong>用人物对话推进剧情和展现性格，减少旁白叙述。好的对话能让读者"听"到人物的声音。</li>
              </ul>
            </div>

            <div className="bg-background/50 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">🚫 不卖弄文采</h3>
              <ul className="space-y-2 ml-4">
                <li>❌ 避免堆砌华丽辞藻："月光如水般倾泻在静谧的湖面上，泛起层层涟漪，宛如少女羞涩的脸庞"</li>
                <li>✅ 改为简洁表达："月光洒在湖面，泛起波纹"</li>
                <li>❌ 避免过度引用诗词典故，除非是古风题材且符合人物身份</li>
                <li>❌ 避免长段落的环境描写，超过3行的景物描写会让读者跳读</li>
                <li>✅ 将环境描写融入动作中："他推开窗，冷风灌进来，远处的山峦笼罩在雾气中"</li>
              </ul>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <h3 className="font-semibold text-primary mb-2">💡 好故事的标准</h3>
              <ul className="space-y-2 ml-4">
                <li><strong>有冲突：</strong>没有冲突就没有故事，每个章节都要有矛盾或对立面</li>
                <li><strong>有变化：</strong>主角的状态、关系、处境要有明显变化，不能原地踏步</li>
                <li><strong>有因果：</strong>事件之间要有逻辑联系，不能凭空出现或消失</li>
                <li><strong>有情绪：</strong>能让读者产生喜怒哀乐的情绪波动</li>
                <li><strong>有期待：</strong>每章结尾要让读者想知道接下来发生什么</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 4. 保持更新 */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground mb-2">四、保持更新：稳定胜过爆发</h2>
              <p className="text-sm text-muted-foreground">网文是长跑，稳定的更新节奏比偶尔的爆更更重要</p>
            </div>
          </div>

          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="bg-background/50 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">📊 更新量标准</h3>
              <ul className="space-y-2 ml-4">
                <li><strong>最低要求：</strong>日更4000字以上，这是大多数平台全勤奖的门槛。低于此标准会失去推荐资格和福利。</li>
                <li><strong>推荐标准：</strong>日更6000-8000字，能在保证质量的同时获得更多曝光。番茄、七猫等平台对高频更新作者有额外流量倾斜。</li>
                <li><strong>大神水平：</strong>日更1万字以上，适合手速快、存稿充足的作者。但要注意质量不能因速度下降。</li>
                <li><strong>周末加更：</strong>周六日可适当增加更新量（如双倍更新），利用读者空闲时间提升阅读量。</li>
              </ul>
            </div>

            <div className="bg-background/50 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">🚫 断更的严重后果</h3>
              <ul className="space-y-2 ml-4">
                <li><strong>算法降权：</strong>大部分平台的推荐算法会将断更作品降权，恢复更新后需要很长时间才能重新获得推荐。</li>
                <li><strong>读者流失：</strong>网文读者忠诚度低，断更1-2天就可能转投其他作品。一旦流失，很难挽回。</li>
                <li><strong>全勤取消：</strong>断更即失去当月全勤奖，对于依靠全勤收入的作者来说是重大损失。</li>
                <li><strong>编辑印象：</strong>频繁断更会让编辑认为作者不靠谱，影响后续资源分配和签约机会。</li>
                <li><strong>榜单掉落：</strong>正在冲榜的作品一旦断更，排名会迅速下滑，前期努力付诸东流。</li>
              </ul>
            </div>

            <div className="bg-background/50 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">📝 请假与补更规则</h3>
              <ul className="space-y-2 ml-4">
                <li><strong>提前请假：</strong>如遇特殊情况必须断更，至少提前1-2天在作品相关或书友圈发布请假公告，说明原因和预计恢复时间。</li>
                <li><strong>控制频率：</strong>每月请假不超过2次，每次不超过2天。频繁请假等同于断更。</li>
                <li><strong>及时补更：</strong>请假结束后，应在3天内补齐欠更章节。可以在章节末尾注明"补更第X章"。</li>
                <li><strong>补偿措施：</strong>补更时可适当加更1-2章作为补偿，或在书友群发放红包维持读者粘性。</li>
              </ul>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <h3 className="font-semibold text-primary mb-2">💡 保持稳定更新的技巧</h3>
              <ul className="space-y-2 ml-4">
                <li>建立固定写作时间：每天同一时间段写作，形成生物钟</li>
                <li>拆分写作任务：将每日目标拆分为上午2000字+下午2000字，降低心理压力</li>
                <li>提前规划剧情：每周日规划下周剧情大纲，避免卡文</li>
                <li>利用碎片时间：通勤、排队时用语音输入或手机记录灵感</li>
                <li>加入作者群：与其他作者互相监督，形成写作氛围</li>
                <li>设置奖励机制：完成周目标后给自己小奖励，保持动力</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 5. 主角塑造 */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground mb-2">五、主角塑造：让读者产生代入感</h2>
              <p className="text-sm text-muted-foreground">主角是故事的灵魂，成功的主角塑造能让读者产生强烈代入感和情感共鸣</p>
            </div>
          </div>

          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="bg-background/50 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">👤 主角核心特质</h3>
              <ul className="space-y-2 ml-4">
                <li><strong>三观正：</strong>主角可以有缺点，但基本价值观要正向。不能滥杀无辜、背信弃义、欺压弱小。读者需要认同主角的行为逻辑。</li>
                <li><strong>不圣母：</strong>善良不等于软弱。面对敌人要果断狠辣，该出手时就出手。一味忍让会让读者憋屈，导致弃书。</li>
                <li><strong>有成长弧光：</strong>主角要从弱小到强大，从幼稚到成熟，有明显的能力提升和心智成长。成长过程要合理，不能一夜之间无敌。</li>
                <li><strong>智商在线：</strong>主角要有基本的判断力和应变能力，不能被配角碾压智商。遇到危机能冷静分析，找到解决方案。</li>
                <li><strong>不完美：</strong>完美无缺的主角缺乏真实感。可以给主角设置一些无伤大雅的缺点，如路痴、贪吃、怕鬼等，增加亲和力。</li>
              </ul>
            </div>

            <div className="bg-background/50 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">🎭 人设构建方法</h3>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-foreground">外在特征</p>
                  <ul className="mt-1 space-y-1 ml-4 text-xs">
                    <li>• 外貌：不必过于详细，突出1-2个记忆点即可（如"剑眉星目""左脸有疤"）</li>
                    <li>• 衣着：符合身份和场景，不需要每章都描写</li>
                    <li>• 习惯动作：如摸鼻子、挑眉、转笔等，增加辨识度</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-foreground">内在性格</p>
                  <ul className="mt-1 space-y-1 ml-4 text-xs">
                    <li>• 核心性格：用3-5个词概括（如坚韧、机智、护短、腹黑）</li>
                    <li>• 行为模式：面对不同情况的反应方式（遇强则强、以牙还牙等）</li>
                    <li>• 价值取向：最看重什么（亲情、友情、自由、力量等）</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-foreground">人际关系</p>
                  <ul className="mt-1 space-y-1 ml-4 text-xs">
                    <li>• 与家人：孝顺但不愚孝，有独立人格</li>
                    <li>• 与朋友：真诚相待，关键时刻挺身而出</li>
                    <li>• 与爱人：专一深情，不后宫（除非是后宫文）</li>
                    <li>• 与敌人：恩怨分明，不赶尽杀绝但也不心慈手软</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-background/50 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">🚫 主角塑造常见雷区</h3>
              <ul className="space-y-2 ml-4">
                <li>❌ <strong>龙傲天式主角：</strong>开局无敌，没有任何挑战，故事缺乏张力</li>
                <li>❌ <strong>憋屈型主角：</strong>一直被欺负不还手，直到后期才爆发，前期读者体验极差</li>
                <li>❌ <strong>工具人主角：</strong>主角没有主观能动性，全靠外力推动剧情</li>
                <li>❌ <strong>双标主角：</strong>对自己宽松对别人严格，言行不一，让人反感</li>
                <li>❌ <strong>面瘫主角：</strong>全程面无表情、内心毫无波澜，缺乏情绪感染力</li>
              </ul>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <h3 className="font-semibold text-primary mb-2">💡 代入感营造技巧</h3>
              <ul className="space-y-2 ml-4">
                <li>使用第二人称视角的心理描写："你一定会觉得这很荒谬，但事实就是如此"</li>
                <li>设置普遍性困境：如职场压力、家庭矛盾、经济困难，让读者产生共鸣</li>
                <li>给予主角合理的弱点：让读者看到自己的影子</li>
                <li>展现主角的努力过程：不只是结果，更要展示奋斗历程</li>
                <li>让主角做出读者也会做的选择：增强认同感</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 6. 剧情起伏 */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground mb-2">六、剧情起伏：掌控节奏的艺术</h2>
              <p className="text-sm text-muted-foreground">好的剧情像过山车，有起有落，有高潮有低谷，让读者欲罢不能</p>
            </div>
          </div>

          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="bg-background/50 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">📈 节奏控制原则</h3>
              <ul className="space-y-2 ml-4">
                <li><strong>几章一小高潮：</strong>每3-5章设置一个小高潮，如打败一个小boss、获得一个新技能、解开一个小谜题。小高潮能给读者即时满足感，维持阅读兴趣。</li>
                <li><strong>几十章一大高潮：</strong>每30-50章设置一个大高潮，如击败最终boss、揭开身世之谜、完成重大任务。大高潮是卷末的收官之战，要有足够的铺垫和震撼力。</li>
                <li><strong>高低交替：</strong>高潮之后要有缓冲期，让读者情绪平复，同时为下一个高潮做铺垫。不能一直高潮，否则读者会疲劳；也不能一直平淡，否则读者会弃书。</li>
                <li><strong>渐进式升级：</strong>敌人的强度、任务的难度、奖励的价值要逐步提升，形成清晰的成长曲线。</li>
              </ul>
            </div>

            <div className="bg-background/50 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">🎢 剧情起伏模板</h3>
              <div className="space-y-3">
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="font-medium text-foreground">平静期（1-2章）</p>
                  <p className="text-xs mt-1">日常描写、角色互动、信息交代。节奏舒缓，为后续冲突做铺垫。</p>
                </div>
                <div className="border-l-4 border-yellow-500 pl-4">
                  <p className="font-medium text-foreground">酝酿期（2-3章）</p>
                  <p className="text-xs mt-1">矛盾初现、危机预兆、反派布局。 tension逐渐升高，读者开始期待。</p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <p className="font-medium text-foreground">爆发期（2-3章）</p>
                  <p className="text-xs mt-1">正面冲突、激烈对抗、生死搏9。节奏最快，描写最密集，情绪最高涨。</p>
                </div>
                <div className="border-l-4 border-red-500 pl-4">
                  <p className="font-medium text-foreground">高潮期（1-2章）</p>
                  <p className="text-xs mt-1">胜负分晓、真相揭露、重大转折。释放所有积累的情绪，给读者最大满足感。</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="font-medium text-foreground">收尾期（1-2章）</p>
                  <p className="text-xs mt-1">战后整理、收获奖励、新线索出现。节奏放缓，为下一轮循环做准备。</p>
                </div>
              </div>
            </div>

            <div className="bg-background/50 rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-2">🪝 学会卡点断章</h3>
              <p className="mb-2">卡点断章是指在章节结尾处设置悬念或转折，迫使读者点击下一章的技巧。这是提升追读率的关键手段。</p>
              <ul className="space-y-2 ml-4">
                <li><strong>危机卡点：</strong>"就在刀刃即将落下时，一道黑影突然出现..."——读者必须看下一章才知道谁救了主角</li>
                <li><strong>揭秘卡点：</strong>"他缓缓摘下口罩，露出的脸让所有人震惊不已..."——读者想知道是谁</li>
                <li><strong>选择卡点：</strong>"摆在他面前的有两个选择：A... B..."——读者好奇主角会选哪个</li>
                <li><strong>反转卡点：</strong>"所有人都以为他死了，然而..."——颠覆预期，引发好奇</li>
                <li><strong>新人物卡点：</strong>"门被推开，一个从未见过的女人走了进来..."——引入新变量</li>
              </ul>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <h3 className="font-semibold text-primary mb-2">💡 节奏把控技巧</h3>
              <ul className="space-y-2 ml-4">
                <li>绘制剧情曲线图：标注每个高潮点的位置，检查分布是否均匀</li>
                <li>控制单章信息量：一章只推进1-2个主要事件，避免信息过载</li>
                <li>善用过渡章节：在高潮之间插入日常、修炼、交流等缓和节奏</li>
                <li>观察读者反馈：评论区抱怨"太水"说明节奏慢，抱怨"太快"说明铺垫不足</li>
                <li>参考爆款作品：分析同类型热门作品的章节结构和节奏安排</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 底部提示 */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 border border-primary/20">
          <p className="text-center text-sm text-muted-foreground">
            写作技巧需要大量练习才能掌握，建议新手先从模仿爆款作品开始，逐步形成自己的风格
          </p>
        </div>
      </div>
    </div>
  );
}
