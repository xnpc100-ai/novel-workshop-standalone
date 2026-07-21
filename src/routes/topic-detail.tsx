import { createFileRoute, Link } from '@tanstack/react-router';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowLeft, MessageCircle, Eye, TrendingUp, Users, Clock,
  Heart, Share2, Bookmark, Send, Plus
} from 'lucide-react';
import { useState } from 'react';

export const Route = createFileRoute('/topic-detail')({
  component: TopicDetailPage,
});

const topicData: Record<string, any> = {
  '1': {
    id: 1,
    title: '新手入门指南',
    tag: '新手',
    postCount: 128,
    viewCount: 5600,
    isHot: true,
    description: '专为刚接触网文创作的新人准备的综合指南，涵盖从注册账号到签约投稿的全流程指导',
    posts: [
      {
        id: 1,
        author: '墨染清风',
        avatar: null,
        title: '新人第一本书该怎么写？求建议',
        content: '大家好，我是刚入坑的新人，想写一本玄幻小说，但不知道从何下手。请问各位前辈，新人第一本书应该选择什么题材比较好？需要注意哪些坑？',
        replyCount: 23,
        viewCount: 456,
        createdAt: '2024-01-15T10:30:00Z',
        replies: [
          { author: '老书虫', content: '建议先从熟悉的题材入手，不要好高骛远。玄幻虽然热门，但竞争也激烈。可以先写都市异能或校园类，门槛较低。', createdAt: '2024-01-15T11:00:00Z' },
          { author: '编辑小王', content: '新人最重要的是坚持完本，不要中途切书。第一本不用追求完美，关键是积累经验。', createdAt: '2024-01-15T11:30:00Z' },
          { author: '写作达人', content: '我当年也是从玄幻开始的，建议先列好大纲，至少规划好前50章的情节走向，避免写到后面崩盘。', createdAt: '2024-01-15T12:00:00Z' }
        ]
      },
      {
        id: 2,
        author: '星辰大海',
        avatar: null,
        title: '如何判断自己是否适合写网文？',
        content: '一直有写作的梦想，但不确定自己是否有这个天赋。请问大家是如何发现自己适合写网文的？有什么自测方法吗？',
        replyCount: 18,
        viewCount: 389,
        createdAt: '2024-01-14T15:20:00Z',
        replies: [
          { author: '写作达人', content: '天赋不是最重要的，坚持才是。你可以先试着写个3000字的短篇，看看自己能否享受创作过程。', createdAt: '2024-01-14T16:00:00Z' },
          { author: '全职作者', content: '问自己三个问题：1.能否接受长期孤独创作 2.能否承受被拒稿的打击 3.能否坚持日更。如果答案都是yes，那就试试吧。', createdAt: '2024-01-14T16:30:00Z' }
        ]
      },
      {
        id: 3,
        author: '小白作者',
        avatar: null,
        title: '每天应该写多少字比较合适？',
        content: '看到很多大神日更万字，我目前只能写3000字左右，这样会不会太少了？需要强迫自己多写吗？',
        replyCount: 15,
        viewCount: 312,
        createdAt: '2024-01-13T09:45:00Z',
        replies: [
          { author: '稳定更新派', content: '质量比数量重要。日更3000字如果能保证质量，比注水万字强多了。关键是保持稳定。', createdAt: '2024-01-13T10:30:00Z' },
          { author: '编辑小李', content: '平台一般要求日更4000字以上才有推荐位，建议尽量达到这个标准。可以分两次更新，早晚各2000字。', createdAt: '2024-01-13T11:00:00Z' }
        ]
      },
      {
        id: 4,
        author: '追梦少年',
        avatar: null,
        title: '新人需要存稿吗？存多少合适？',
        content: '准备开始写第一本书，听说需要存稿。请问一般需要存多少字再发书？存稿期间要不要同步更新？',
        replyCount: 12,
        viewCount: 278,
        createdAt: '2024-01-12T14:00:00Z',
        replies: [
          { author: '经验老手', content: '建议至少存稿3-5万字再发书，这样可以应对突发情况。发书后保持日更，存稿作为缓冲。', createdAt: '2024-01-12T15:00:00Z' }
        ]
      },
      {
        id: 5,
        author: '文学爱好者',
        avatar: null,
        title: '写网文需要学习哪些基础知识？',
        content: '想系统学习网文写作，请问有哪些必看的书籍或课程推荐？',
        replyCount: 20,
        viewCount: 445,
        createdAt: '2024-01-11T10:00:00Z',
        replies: [
          { author: '写作教练', content: '推荐《故事》《救猫咪》《小说课》这三本书。另外多拆解爆款作品的结构，比看书更有效。', createdAt: '2024-01-11T11:00:00Z' },
          { author: '资深读者', content: '最重要的是多读！每天至少读2-3本同类型的完本小说，分析它们的节奏和套路。', createdAt: '2024-01-11T11:30:00Z' }
        ]
      }
    ]
  },
  '2': {
    id: 2,
    title: '爆款创作技巧',
    tag: '技巧',
    postCount: 96,
    viewCount: 4200,
    isHot: true,
    description: '分享打造爆款作品的核心技巧和实战经验，帮助作者提升作品质量和吸引力',
    posts: [
      {
        id: 1,
        author: '爆款制造机',
        avatar: null,
        title: '黄金三章怎么写才能留住读者？',
        content: '都说开篇定生死，请问各位大佬，黄金三章的核心要素是什么？有没有具体的写作模板可以参考？',
        replyCount: 32,
        viewCount: 678,
        createdAt: '2024-01-15T08:00:00Z',
        replies: [
          { author: '资深编辑', content: '黄金三章要点：1.快速引入主角和核心冲突 2.设置悬念或反转 3.展现主角性格标签。不要铺垫太多背景。', createdAt: '2024-01-15T09:00:00Z' },
          { author: '千万大神', content: '我的经验是第一章必须出现一个让读者好奇的事件，第二章揭示部分真相，第三章留下更大悬念。', createdAt: '2024-01-15T09:30:00Z' },
          { author: '节奏大师', content: '记住公式：冲突+悬念+期待=留存率。每章结尾都要留钩子。', createdAt: '2024-01-15T10:00:00Z' }
        ]
      },
      {
        id: 2,
        author: '节奏大师',
        avatar: null,
        title: '如何把控小说的节奏？',
        content: '感觉自己写的小说节奏太平淡，没有起伏。请问如何设计情节的高潮和低谷？',
        replyCount: 21,
        viewCount: 534,
        createdAt: '2024-01-14T14:00:00Z',
        replies: [
          { author: '结构专家', content: '使用"波浪式"节奏：小高潮-平缓-大高潮-平缓。每5-10章一个小高潮，每30-50章一个大高潮。', createdAt: '2024-01-14T15:00:00Z' },
          { author: '编辑老王', content: '检查你的章节：如果连续3章没有新事件发生，说明节奏太慢了。', createdAt: '2024-01-14T15:30:00Z' }
        ]
      },
      {
        id: 3,
        author: '人设达人',
        avatar: null,
        title: '如何塑造让人印象深刻的主角？',
        content: '我的主角总是很平淡，缺乏特色。请问怎么才能让主角更有记忆点？',
        replyCount: 18,
        viewCount: 423,
        createdAt: '2024-01-13T11:00:00Z',
        replies: [
          { author: '角色设计师', content: '给主角设计1-2个核心标签（如腹黑、傲娇），再加上一个反差萌特质。比如外表冷酷内心温柔。', createdAt: '2024-01-13T12:00:00Z' }
        ]
      },
      {
        id: 4,
        author: '爽文专家',
        avatar: null,
        title: '爽点的设置有什么技巧？',
        content: '知道要写爽文，但不知道怎么设置爽点才自然。求教！',
        replyCount: 25,
        viewCount: 567,
        createdAt: '2024-01-12T09:00:00Z',
        replies: [
          { author: '套路分析师', content: '爽点公式：压抑-爆发-收获。先让主角受委屈，然后反击打脸，最后获得奖励。', createdAt: '2024-01-12T10:00:00Z' },
          { author: '读者代表', content: '作为读者，我最喜欢的爽点是：主角被看不起→展示实力→众人震惊→获得尊重。这个套路百试不爽。', createdAt: '2024-01-12T10:30:00Z' }
        ]
      }
    ]
  },
  '3': {
    id: 3,
    title: '平台投稿经验',
    tag: '平台',
    postCount: 84,
    viewCount: 3800,
    isHot: true,
    description: '各平台投稿实战经验分享，包括签约技巧、编辑沟通、推荐位获取等实用信息',
    posts: [
      {
        id: 1,
        author: '签约达人',
        avatar: null,
        title: '番茄小说签约全流程分享',
        content: '刚刚在番茄成功签约，分享一下我的经历。首先字数要达到3万，然后去作家后台申请签约，编辑会在3-5个工作日内审核...\n\n**我的时间线：**\n- 第1天：字数达标，提交签约申请\n- 第3天：收到编辑站内信，要求修改开头\n- 第5天：修改后重新提交\n- 第7天：签约成功！\n\n**关键建议：**\n1. 开头一定要吸引人，编辑看稿很快\n2. 大纲要完整，至少规划到50章\n3. 保持日更，断更会影响审核',
        replyCount: 45,
        viewCount: 892,
        createdAt: '2024-01-15T07:00:00Z',
        replies: [
          { author: '新人作者', content: '请问审核不通过怎么办？可以重新申请吗？', createdAt: '2024-01-15T08:00:00Z' },
          { author: '签约达人', content: '可以修改后重新提交，一般第二次通过率会高很多。关键是开头要吸引人。', createdAt: '2024-01-15T08:30:00Z' },
          { author: '编辑助理', content: '补充一点：如果第一次被拒，仔细看编辑的反馈意见，针对性修改后再投。', createdAt: '2024-01-15T09:00:00Z' }
        ]
      },
      {
        id: 2,
        author: '七猫作者',
        avatar: null,
        title: '七猫保底申请经验分享',
        content: '在七猫拿到了千字30元的保底，分享一下经验...\n\n**申请流程：**\n1. 准备1万字正文+完整大纲\n2. 通过内签通道提交\n3. 编辑评估后给出保底价格\n\n**注意事项：**\n- 大纲要详细，包括人物设定和情节走向\n- 正文质量要高，开头尤其重要\n- 保底合同一般签1-2年',
        replyCount: 28,
        viewCount: 634,
        createdAt: '2024-01-14T10:00:00Z',
        replies: [
          { author: '保底新人', content: '千字30元很高了！请问对字数有要求吗？', createdAt: '2024-01-14T11:00:00Z' }
        ]
      },
      {
        id: 3,
        author: '起点老作者',
        avatar: null,
        title: '起点内签 vs 外签的区别',
        content: '在起点写了两年，分享一下内签和外签的经验...',
        replyCount: 35,
        viewCount: 723,
        createdAt: '2024-01-13T14:00:00Z',
        replies: []
      }
    ]
  },
  '4': {
    id: 4,
    title: '版权合规讨论',
    tag: '法律',
    postCount: 52,
    viewCount: 2100,
    isHot: false,
    description: '探讨网文创作中的版权边界、合理借鉴与抄袭的界定，帮助作者规避法律风险',
    posts: [
      {
        id: 1,
        author: '法律顾问',
        avatar: null,
        title: '仿写和抄袭的法律界限在哪里？',
        content: '很多作者担心自己的作品被判定为抄袭，请问从法律角度，什么样的情况构成侵权？\n\n**法律定义：**\n- 抄袭：直接复制他人作品的表达形式\n- 借鉴：学习他人的创作思路和技巧\n- 合理使用：引用少量内容用于评论或研究\n\n**判断标准：**\n1. 相似度超过30%有风险\n2. 核心情节雷同可能侵权\n3. 人物设定完全一致有问题',
        replyCount: 28,
        viewCount: 567,
        createdAt: '2024-01-14T10:00:00Z',
        replies: [
          { author: '谨慎作者', content: '那用AI仿写算抄袭吗？', createdAt: '2024-01-14T11:00:00Z' },
          { author: '法律顾问', content: 'AI仿写本身不违法，但如果输出结果与原作高度相似，仍可能构成侵权。建议相似度控制在40%以下，并进行人工修改。', createdAt: '2024-01-14T11:30:00Z' }
        ]
      },
      {
        id: 2,
        author: '维权意识强',
        avatar: null,
        title: '作品被盗版了怎么办？',
        content: '发现我的小说被多个网站盗版转载，请问该如何维权？',
        replyCount: 15,
        viewCount: 389,
        createdAt: '2024-01-13T09:00:00Z',
        replies: []
      }
    ]
  },
  '5': {
    id: 5,
    title: 'AI模型对比',
    tag: '技术',
    postCount: 67,
    viewCount: 2900,
    isHot: false,
    description: '对比分析各大AI模型在网文创作中的表现，分享使用心得和参数调优经验',
    posts: [
      {
        id: 1,
        author: 'AI探索者',
        avatar: null,
        title: 'qwen3.6-plus vs kimi-k2.5 实测对比',
        content: '最近测试了两个主流模型，分享一下使用感受。\n\n**qwen3.6-plus：**\n- 优点：响应速度快，成本低，适合日常仿写\n- 缺点：长文本连贯性稍弱\n- 适用场景：3万字以下的短篇仿写\n\n**kimi-k2.5：**\n- 优点：长文本处理能力强，逻辑连贯性好\n- 缺点：速度较慢，成本较高\n- 适用场景：长篇连载、复杂情节处理\n\n**参数建议：**\n- 创意度：70-80%\n- 相似度：40-50%\n- 风格强度：中等',
        replyCount: 19,
        viewCount: 445,
        createdAt: '2024-01-13T16:00:00Z',
        replies: [
          { author: '技术控', content: 'deepseek-v3.2怎么样？有人用过吗？', createdAt: '2024-01-13T17:00:00Z' },
          { author: '多模型用户', content: 'deepseek性价比不错，但中文理解能力略逊于qwen和kimi。适合预算有限的情况。', createdAt: '2024-01-13T17:30:00Z' }
        ]
      },
      {
        id: 2,
        author: '参数调优师',
        avatar: null,
        title: '如何调整AI仿写参数获得最佳效果？',
        content: '分享一些参数调优的经验...',
        replyCount: 12,
        viewCount: 334,
        createdAt: '2024-01-12T11:00:00Z',
        replies: []
      }
    ]
  }
};

function TopicDetailPage() {
  const { id } = Route.useSearch();
  const topic = topicData[id || '1'];
  const [replyContent, setReplyContent] = useState('');

  if (!topic) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="shadow-elegant rounded-2xl max-w-md">
          <CardContent className="py-12 text-center">
            <h2 className="text-xl font-semibold mb-2">话题不存在</h2>
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
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-lg font-semibold">{topic.title}</h1>
                <Badge variant="secondary">{topic.tag}</Badge>
                {topic.isHot && <Badge className="bg-red-500 text-white">热门</Badge>}
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{topic.postCount} 帖</span>
                <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{topic.viewCount} 浏览</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧帖子列表 */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">最新讨论</h2>
              <Button size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                发起讨论
              </Button>
            </div>

            {topic.posts.map((post: any) => (
              <Card key={post.id} className="shadow-elegant rounded-2xl hover-lift transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
                        {post.author[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{post.author}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(post.createdAt).toLocaleDateString('zh-CN')}
                        </span>
                      </div>
                      <h3 className="font-semibold text-foreground">{post.title}</h3>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground">{post.content}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <button className="flex items-center gap-1 hover:text-primary transition-colors">
                      <Heart className="w-4 h-4" />
                      <span>点赞</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-primary transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.replyCount} 回复</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-primary transition-colors">
                      <Share2 className="w-4 h-4" />
                      <span>分享</span>
                    </button>
                  </div>

                  {/* 回复列表 */}
                  {post.replies && post.replies.length > 0 && (
                    <div className="mt-4 space-y-3 pt-4 border-t">
                      {post.replies.map((reply: any, index: number) => (
                        <div key={index} className="flex gap-3 p-3 rounded-lg bg-secondary/50">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {reply.author[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium">{reply.author}</span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(reply.createdAt).toLocaleString('zh-CN')}
                              </span>
                            </div>
                            <p className="text-sm text-foreground">{reply.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 右侧侧边栏 */}
          <div className="space-y-4">
            {/* 话题简介 */}
            <Card className="shadow-elegant rounded-2xl">
              <CardHeader>
                <h3 className="font-semibold flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  话题简介
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{topic.description}</p>
              </CardContent>
            </Card>

            {/* 相关话题 */}
            <Card className="shadow-elegant rounded-2xl">
              <CardHeader>
                <h3 className="font-semibold flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  相关话题
                </h3>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.values(topicData)
                  .filter((t: any) => t.id !== topic.id)
                  .slice(0, 3)
                  .map((t: any) => (
                    <Link key={t.id} to="/topic-detail" search={{ id: t.id.toString() }}>
                      <div className="p-2 rounded-lg hover:bg-secondary transition-colors cursor-pointer">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{t.title}</span>
                          <Badge variant="secondary" className="text-xs">{t.tag}</Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <span>{t.postCount} 帖</span>
                          <span>{t.viewCount} 浏览</span>
                        </div>
                      </div>
                    </Link>
                  ))}
              </CardContent>
            </Card>

            {/* 快速发帖 */}
            <Card className="shadow-elegant rounded-2xl">
              <CardHeader>
                <h3 className="font-semibold">参与讨论</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  placeholder="分享你的观点..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="min-h-[100px]"
                />
                <Button className="w-full gap-2" disabled={!replyContent.trim()}>
                  <Send className="w-4 h-4" />
                  发布回复
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
