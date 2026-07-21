import { createFileRoute, Link } from '@tanstack/react-router';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase, getSupabaseUrl } from '@/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { SkeletonCard } from '@/components/community/SkeletonCard';
import { SearchSuggestions } from '@/components/community/SearchSuggestions';
import {
  Users, MessageCircle, BookOpen, TrendingUp, Heart, Share2,
  Plus, FileText, Globe, HelpCircle, Star, Clock, Eye,
  Bookmark, UserPlus, Search, Filter, MoreHorizontal, ExternalLink
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';

export const Route = createFileRoute('/community')({
  component: CommunityPage,
});

const tutorials = [
  { id: 1, title: '快速上手指南', desc: '5分钟学会如何使用仿写工具', icon: BookOpen },
  { id: 2, title: '爆款仿写技巧', desc: '掌握核心仿写逻辑', icon: Star },
  { id: 3, title: '平台投稿攻略', desc: '各大网文平台投稿规则', icon: Globe },
  { id: 4, title: '版权合规指南', desc: '如何避免抄袭风险', icon: FileText }
];

const platforms = [
  { rank: 1, name: '番茄小说', company: '字节跳动', income: '月收益3000-10000+', type: 'domestic', pros: ['流量巨大', '新手友好'], cons: ['竞争激烈'] },
  { rank: 2, name: '七猫小说', company: '百度旗下', income: '千字20元起保底', type: 'domestic', pros: ['收入稳定', '编辑指导'], cons: ['审核严格'] },
  { rank: 3, name: '起点中文网', company: '阅文集团', income: '爆款可斩获数十万', type: 'domestic', pros: ['IP价值高'], cons: ['竞争极其激烈'] },
  { rank: 4, name: 'Webnovel', company: '阅文海外版', income: '男频玄幻受众广', type: 'overseas', pros: ['全球市场'], cons: ['语言要求'] },
  { rank: 5, name: 'GoodNovel', company: '中文在线旗下', income: '分成比例优', type: 'overseas', pros: ['女频优势'], cons: ['竞争激烈'] }
];

const hotTopics = [
  { id: 1, title: '新手入门指南', tag: '新手', postCount: 128, viewCount: 5600, isHot: true },
  { id: 2, title: '爆款创作技巧', tag: '技巧', postCount: 96, viewCount: 4200, isHot: true },
  { id: 3, title: '平台投稿经验', tag: '平台', postCount: 84, viewCount: 3800, isHot: true },
  { id: 4, title: '版权合规讨论', tag: '法律', postCount: 52, viewCount: 2100, isHot: false },
  { id: 5, title: 'AI模型对比', tag: '技术', postCount: 67, viewCount: 2900, isHot: false }
];

interface AuthorShare {
  id: string;
  nickname: string;
  avatar_url?: string | null;
  platform: string;
  title: string;
  income?: string | null;
  story: string;
  created_at: string;
  user_id?: string | null;
}

interface WorkShowcase {
  id: string;
  title: string;
  genre: string;
  description?: string | null;
  cover_image?: string | null;
  like_count: number | null;
  view_count: number | null;
  created_at: string;
  user_id?: string | null;
}

interface QAPost {
  id: string;
  title: string;
  content: string;
  category: string;
  answer_count: number | null;
  view_count: number | null;
  created_at: string;
  user_id?: string | null;
}

interface Comment {
  id: string;
  target_type: string;
  target_id: string;
  user_id: string;
  content: string;
  parent_id: string | null;
  created_at: string;
  nickname?: string;
  avatar_url?: string | null;
  like_count?: number | null;
}

function CommunityPage() {
  const { isActivated } = useAuth();
  const [shares, setShares] = useState<AuthorShare[]>([]);
  const [works, setWorks] = useState<WorkShowcase[]>([]);
  const [qaPosts, setQaPosts] = useState<QAPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showQuestionDialog, setShowQuestionDialog] = useState(false);
  const [showWorkDialog, setShowWorkDialog] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');

  const [shareForm, setShareForm] = useState({
    platform: '', title: '', income: '', story: '',
    background: '', breakthrough: '', currentStatus: '',
    advice: '', tips: '', achievement: ''
  });
  const [questionForm, setQuestionForm] = useState({
    title: '', content: '', category: ''
  });
  const [workForm, setWorkForm] = useState({
    title: '', genre: '', description: '', coverImage: ''
  });

  const [collectedItems, setCollectedItems] = useState<Set<string>>(new Set());
  const [followingUsers, setFollowingUsers] = useState<Set<string>>(new Set());
  const [animatingIcons, setAnimatingIcons] = useState<Set<string>>(new Set());
  const [comments, setComments] = useState<Map<string, Comment[]>>(new Map());
  const [showCommentDialog, setShowCommentDialog] = useState<{ targetType: string; targetId: string } | null>(null);
  const [commentContent, setCommentContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'views'>('latest');
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadData();
    loadUserInteractions();
  }, []);

  const loadData = async () => {
    try {
      const { data: sharesData, error: sharesError } = await supabase
        .from('author_shares')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(20);

      if (sharesError) {
        console.warn('加载作者分享失败:', sharesError.message);
      } else if (sharesData && sharesData.length > 0) {
        setShares(sharesData);
      } else {
        const mockShares: AuthorShare[] = [
          {
            id: '1',
            nickname: '墨染星辰',
            avatar_url: null,
            platform: '番茄小说',
            title: '从月入3000到月入5万，我的逆袭之路',
            income: '50000元',
            story: '三年前我还是个普通上班族，偶然接触到网文创作。刚开始每天只能写2000字，收入 barely 够买奶茶。后来我学会了研究爆款套路，掌握了黄金三章的写法，现在稳定月入5万+。关键是要坚持日更，保持稳定的更新节奏，同时多学习优秀作品的结构和节奏把控。',
            created_at: '2024-01-15T08:30:00Z',
            user_id: null
          },
          {
            id: '2',
            nickname: '清风明月',
            avatar_url: null,
            platform: '七猫小说',
            title: '新人如何快速签约？我的经验分享',
            income: '12000元',
            story: '作为一个刚入行半年的新人，我想分享一下快速签约的经验。首先，选题很重要，要选择热门题材但要有自己的创新点。其次，前三章一定要精彩，抓住编辑的眼球。我投了三次才签约，前两次都被拒了，但每次都有认真修改。现在我已经写了80万字，虽然收入不算高，但能养活自己就很满足了。',
            created_at: '2024-01-14T14:20:00Z',
            user_id: null
          },
          {
            id: '3',
            nickname: '夜雨听风',
            avatar_url: null,
            platform: '起点中文网',
            title: '全职写作两年，我踩过的坑和收获',
            income: '28000元',
            story: '两年前我辞掉工作全职写作，这条路并不好走。最大的坑就是没有做好财务规划，前半年几乎零收入。后来我调整策略，先在免费平台积累读者，等有了一定粉丝基础再转付费平台。现在我有两部作品在连载，一部完本作品还在持续产生收益。建议新人不要急于全职，先兼职试水，等收入稳定后再考虑全职。',
            created_at: '2024-01-13T10:15:00Z',
            user_id: null
          }
        ];
        setShares(mockShares);
      }

      const { data: worksData, error: worksError } = await supabase
        .from('works_showcase')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(20);

      if (worksError) {
        console.warn('加载作品展示失败:', worksError.message);
      } else if (worksData && worksData.length > 0) {
        setWorks(worksData);
      } else {
        const mockWorks: WorkShowcase[] = [
          {
            id: '1',
            title: '都市修仙：从外卖员到至尊强者',
            genre: '都市',
            description: '一个普通外卖员意外获得修仙传承，从此踏上逆天改命之路。在繁华都市中，他既要应对现代生活的挑战，又要面对修真界的明争暗斗。故事融合了现代都市生活与古典修仙元素，主角从底层逆袭，经历重重磨难，最终成为一代至尊强者。小说节奏紧凑，爽点密集，深受读者喜爱。',
            cover_image: 'https://conversation.cdn.meoo.host/conversations/335332197118652416/image/2026-07-21/1784625246755-image.png?auth_key=d49fa39ab0d3b47284d062fa505638b4022a22400658adaba91eb70830dcf1df',
            like_count: 328,
            view_count: 15600,
            created_at: '2024-01-14T10:00:00Z',
            user_id: null
          },
          {
            id: '2',
            title: '总裁的契约娇妻',
            genre: '言情',
            description: '一场商业联姻，她被迫嫁给冷酷无情的集团总裁。本以为只是契约关系，却在相处中渐渐沦陷。女主坚韧独立，男主外冷内热，两人从互相利用到真心相爱，情感细腻动人。小说情节跌宕起伏，甜虐交织，是都市言情经典之作。',
            cover_image: 'https://conversation.cdn.meoo.host/conversations/335332197118652416/image/2026-07-21/1784625330060-image.png?auth_key=7f682c4f79c7bf2e2c742afb1b8ad7a060157e492a295ceaf69835750e65c99d',
            like_count: 567,
            view_count: 23400,
            created_at: '2024-01-13T15:30:00Z',
            user_id: null
          },
          {
            id: '3',
            title: '玄幻：开局签到十万年',
            genre: '玄幻',
            description: '穿越到玄幻世界，觉醒签到系统。每天签到就能获得神级奖励，从新手村一路杀到诸天万界！主角凭借签到系统快速成长，收服神兽，探索秘境，对抗强敌。小说设定新颖，升级体系清晰，战斗场面热血激昂，是玄幻小说中的佳作。',
            cover_image: '//g.cdn.meoo.host/agent-generated-images/uvgjt3d6zgte/ai-image-1784483794259-a423b04d-1.png?auth_key=69d72e69daee92a35fbc041e03edbd9751de6ba7cb092c7b069f3d3f04931944',
            like_count: 892,
            view_count: 45200,
            created_at: '2024-01-12T09:20:00Z',
            user_id: null
          },
          {
            id: '4',
            title: '宫斗：庶女翻身记',
            genre: '古代',
            description: '身为庶女，她在深宫中步步为营。从被人欺辱的小透明，到权倾朝野的贵妃，她的逆袭之路充满血泪与智慧。小说刻画了复杂的宫廷斗争，人物性格鲜明，情节环环相扣，展现了女性在逆境中的坚韧与智慧。',
            cover_image: '//g.cdn.meoo.host/agent-generated-images/uvgjt3d6zgte/ai-image-1784483811402-5723e8a9-1.png?auth_key=6908e76156aa5ea6ba0e382cdffa5f628d09093391e9b183fc3220edfeee2464',
            like_count: 445,
            view_count: 18900,
            created_at: '2024-01-11T14:45:00Z',
            user_id: null
          },
          {
            id: '5',
            title: '科幻：星际殖民时代',
            genre: '科幻',
            description: '人类进入星际殖民时代，主角作为第一批火星移民，在恶劣环境中建立新家园，揭开宇宙深处的秘密。小说融合了硬科幻与人文关怀，探讨了人类在宇宙中的位置与意义，想象力丰富，逻辑严谨。',
            cover_image: '//g.cdn.meoo.host/agent-generated-images/uvgjt3d6zgte/ai-image-1784483817318-ab8a71b8-1.png?auth_key=15808c1e4493ef9a62c4a697a20d3ef36c8bdbae475a898de3968045ba6695a4',
            like_count: 234,
            view_count: 12300,
            created_at: '2024-01-10T11:15:00Z',
            user_id: null
          },
          {
            id: '6',
            title: '悬疑：消失的证人',
            genre: '悬疑',
            description: '一桩离奇命案，关键证人神秘失踪。侦探抽丝剥茧，却发现真相远比想象中更加黑暗。小说悬念设置巧妙，反转不断，人物心理描写细腻，是一部高质量的悬疑推理作品。',
            cover_image: '//g.cdn.meoo.host/agent-generated-images/uvgjt3d6zgte/ai-image-1784483823672-80fbc86a-1.png?auth_key=bc62c33520f25e245d4ffcb1177ea42ff60f05b58e6628aaffcfd7d3562a4f7c',
            like_count: 178,
            view_count: 9800,
            created_at: '2024-01-09T16:00:00Z',
            user_id: null
          }
        ];
        setWorks(mockWorks);
      }

      const { data: qaData, error: qaError } = await supabase
        .from('qa_posts')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false })
        .limit(20);

      if (qaError) {
        console.warn('加载问答失败:', qaError.message);
      } else if (qaData && qaData.length > 0) {
        setQaPosts(qaData);
      }

      setLoading(false);
    } catch (error) {
      console.error('加载数据异常:', error);
      setLoading(false);
    }
  };

  const loadUserInteractions = async () => {
    try {
      const session = (await supabase.auth.getSession()).data.session;
      if (!session) return;

      const { data: collections } = await supabase
        .from('collections')
        .select('target_type, target_id')
        .eq('user_id', session.user.id);

      if (collections) {
        const collected = new Set(collections.map(c => `${c.target_type}:${c.target_id}`));
        setCollectedItems(collected);
      }

      const { data: follows } = await supabase
        .from('follows')
        .select('following_id')
        .eq('follower_id', session.user.id);

      if (follows) {
        const following = new Set(follows.map(f => f.following_id).filter(Boolean) as string[]);
        setFollowingUsers(following);
      }
    } catch (error) {
      console.error('加载用户交互数据失败:', error);
    }
  };

  const loadComments = async (targetType: string, targetId: string) => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('target_type', targetType)
        .eq('target_id', targetId)
        .order('created_at', { ascending: true });

      if (error) {
        console.warn('加载评论失败:', error.message);
        return;
      }

      if (data) {
        setComments(prev => {
          const newMap = new Map(prev);
          newMap.set(`${targetType}:${targetId}`, data as Comment[]);
          return newMap;
        });
      }
    } catch (error) {
      console.error('加载评论异常:', error);
    }
  };

  const handleSubmitComment = async () => {
    if (!commentContent.trim()) {
      toast.error('请输入评论内容');
      return;
    }

    try {
      const session = (await supabase.auth.getSession()).data.session;
      if (!session) {
        toast.error('请先登录');
        return;
      }

      if (!showCommentDialog) return;

      const response = await fetch(`${getSupabaseUrl()}/functions/v1/submit-comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          targetType: showCommentDialog.targetType,
          targetId: showCommentDialog.targetId,
          content: commentContent,
          parentId: replyingTo,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      toast.success('评论成功');
      setCommentContent('');
      setReplyingTo(null);
      await loadComments(showCommentDialog.targetType, showCommentDialog.targetId);
    } catch (error) {
      const message = error instanceof Error ? error.message : '评论失败';
      toast.error(message);
    }
  };

  const handleToggleCommentLike = async (commentId: string) => {
    try {
      const session = (await supabase.auth.getSession()).data.session;
      if (!session) {
        toast.error('请先登录');
        return;
      }

      const response = await fetch(`${getSupabaseUrl()}/functions/v1/toggle-comment-like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ commentId }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      setLikedComments(prev => {
        const newSet = new Set(prev);
        if (result.liked) {
          newSet.add(commentId);
        } else {
          newSet.delete(commentId);
        }
        return newSet;
      });

      if (showCommentDialog) {
        const key = `${showCommentDialog.targetType}:${showCommentDialog.targetId}`;
        setComments(prev => {
          const newMap = new Map(prev);
          const comments = newMap.get(key);
          if (comments) {
            const updatedComments = comments.map(c => {
              if (c.id === commentId) {
                return { ...c, like_count: (c.like_count || 0) + (result.liked ? 1 : -1) };
              }
              return c;
            });
            newMap.set(key, updatedComments);
          }
          return newMap;
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : '操作失败';
      toast.error(message);
    }
  };

  const handleToggleCollection = async (targetType: string, targetId: string) => {
    try {
      const session = (await supabase.auth.getSession()).data.session;
      if (!session) {
        toast.error('请先登录');
        return;
      }

      const key = `${targetType}:${targetId}`;
      setAnimatingIcons(prev => new Set([...prev, key]));
      setTimeout(() => {
        setAnimatingIcons(prev => {
          const newSet = new Set(prev);
          newSet.delete(key);
          return newSet;
        });
      }, 600);

      const response = await fetch(`${getSupabaseUrl()}/functions/v1/toggle-collection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ targetType, targetId }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      setCollectedItems(prev => {
        const newSet = new Set(prev);
        if (result.collected) {
          newSet.add(key);
          toast.success('收藏成功', { icon: '⭐' });
        } else {
          newSet.delete(key);
          toast.success('取消收藏');
        }
        return newSet;
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : '操作失败';
      toast.error(message);
    }
  };

  const handleToggleFollow = async (userId: string) => {
    try {
      const session = (await supabase.auth.getSession()).data.session;
      if (!session) {
        toast.error('请先登录');
        return;
      }

      const response = await fetch(`${getSupabaseUrl()}/functions/v1/toggle-follow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ followingId: userId }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      setFollowingUsers(prev => {
        const newSet = new Set(prev);
        if (result.following) {
          newSet.add(userId);
          toast.success('关注成功');
        } else {
          newSet.delete(userId);
          toast.success('取消关注');
        }
        return newSet;
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : '操作失败';
      toast.error(message);
    }
  };

  const handleSubmitShare = async () => {
    if (!isActivated) { toast.error('请先激活账号'); return; }
    if (!shareForm.platform || !shareForm.title || !shareForm.story) { toast.error('请填写必填项'); return; }

    try {
      const session = (await supabase.auth.getSession()).data.session;
      if (!session) { toast.error('请先登录'); return; }

      const response = await fetch(`${getSupabaseUrl()}/functions/v1/submit-author-share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify(shareForm),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      toast.success('分享提交成功，等待审核');
      setShowShareDialog(false);
      setShareForm({ platform: '', title: '', income: '', story: '', background: '', breakthrough: '', currentStatus: '', advice: '', tips: '', achievement: '' });
    } catch (error) {
      const message = error instanceof Error ? error.message : '提交失败';
      toast.error(message);
    }
  };

  const handleSubmitQuestion = async () => {
    if (!isActivated) { toast.error('请先激活账号'); return; }
    if (!questionForm.title || !questionForm.content || !questionForm.category) { toast.error('请填写必填项'); return; }

    try {
      const session = (await supabase.auth.getSession()).data.session;
      if (!session) { toast.error('请先登录'); return; }

      const response = await fetch(`${getSupabaseUrl()}/functions/v1/submit-qa-post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify(questionForm),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      toast.success('问题发布成功');
      setShowQuestionDialog(false);
      setQuestionForm({ title: '', content: '', category: '' });
      loadData();
    } catch (error) {
      const message = error instanceof Error ? error.message : '发布失败';
      toast.error(message);
    }
  };

  const handleSubmitWork = async () => {
    if (!isActivated) { toast.error('请先激活账号'); return; }
    if (!workForm.title || !workForm.genre || !workForm.description) { toast.error('请填写必填项'); return; }

    try {
      const session = (await supabase.auth.getSession()).data.session;
      if (!session) { toast.error('请先登录'); return; }

      const { data, error } = await supabase
        .from('works_showcase')
        .insert({
          title: workForm.title,
          genre: workForm.genre,
          description: workForm.description,
          cover_image: workForm.coverImage || null,
          status: 'published',
          user_id: session.user.id,
        })
        .select()
        .single();

      if (error) throw new Error(error.message);

      toast.success('作品发布成功');
      setShowWorkDialog(false);
      setWorkForm({ title: '', genre: '', description: '', coverImage: '' });
      loadData();
    } catch (error) {
      const message = error instanceof Error ? error.message : '发布失败';
      toast.error(message);
    }
  };

  const filteredShares = shares.filter(share => {
    if (selectedPlatform !== 'all' && share.platform !== selectedPlatform) return false;
    if (searchKeyword && !share.title.toLowerCase().includes(searchKeyword.toLowerCase()) && !share.story.toLowerCase().includes(searchKeyword.toLowerCase())) return false;
    return true;
  });

  const filteredWorks = works.filter(work => {
    if (selectedGenre !== 'all' && work.genre !== selectedGenre) return false;
    if (searchKeyword && !work.title.toLowerCase().includes(searchKeyword.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen pb-16">
      <section className="pt-16 pb-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto animate-fade-in-up">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 tracking-tight flex items-center justify-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            创作者社区
          </h1>
          <p className="text-lg text-muted-foreground text-center">与万千创作者一起交流成长</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="shadow-elegant rounded-xl hover-lift transition-all">
            <CardContent className="py-4 px-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{shares.length}</p>
                  <p className="text-xs text-muted-foreground">作者分享</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-elegant rounded-xl hover-lift transition-all">
            <CardContent className="py-4 px-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{works.length}</p>
                  <p className="text-xs text-muted-foreground">作品展示</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-elegant rounded-xl hover-lift transition-all">
            <CardContent className="py-4 px-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{qaPosts.length}</p>
                  <p className="text-xs text-muted-foreground">问答互助</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-elegant rounded-xl hover-lift transition-all">
            <CardContent className="py-4 px-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{hotTopics.reduce((sum, t) => sum + t.viewCount, 0).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">总浏览量</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-elegant rounded-2xl">
          <CardContent className="py-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  ref={searchInputRef}
                  placeholder="搜索分享、作品、问答..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="pl-10"
                />
                {showSuggestions && (
                  <SearchSuggestions
                    keyword={searchKeyword}
                    onSelect={(suggestion) => {
                      setSearchKeyword(suggestion.title);
                      setShowSuggestions(false);
                    }}
                    onClose={() => setShowSuggestions(false)}
                  />
                )}
              </div>
              <div className="flex gap-2">
                <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="平台" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部平台</SelectItem>
                    <SelectItem value="番茄小说">番茄小说</SelectItem>
                    <SelectItem value="七猫小说">七猫小说</SelectItem>
                    <SelectItem value="起点中文网">起点中文网</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部类型</SelectItem>
                    <SelectItem value="玄幻">玄幻</SelectItem>
                    <SelectItem value="都市">都市</SelectItem>
                    <SelectItem value="言情">言情</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Tabs defaultValue="shares" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 rounded-xl bg-secondary p-1 mb-8">
            <TabsTrigger value="shares" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
              <Users className="w-4 h-4 mr-2" /><span className="hidden sm:inline">作者分享</span><span className="sm:hidden">分享</span>
            </TabsTrigger>
            <TabsTrigger value="works" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
              <BookOpen className="w-4 h-4 mr-2" /><span className="hidden sm:inline">作品展示</span><span className="sm:hidden">作品</span>
            </TabsTrigger>
            <TabsTrigger value="tutorials" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
              <FileText className="w-4 h-4 mr-2" /><span className="hidden sm:inline">教程攻略</span><span className="sm:hidden">教程</span>
            </TabsTrigger>
            <TabsTrigger value="platforms" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
              <Globe className="w-4 h-4 mr-2" /><span className="hidden sm:inline">平台排名</span><span className="sm:hidden">平台</span>
            </TabsTrigger>
            <TabsTrigger value="topics" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
              <TrendingUp className="w-4 h-4 mr-2" /><span className="hidden sm:inline">热门话题</span><span className="sm:hidden">话题</span>
            </TabsTrigger>
            <TabsTrigger value="qa" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
              <HelpCircle className="w-4 h-4 mr-2" /><span className="hidden sm:inline">问答互助</span><span className="sm:hidden">问答</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="shares" className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-foreground">作者经验分享</h2>
              <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
                <DialogTrigger asChild>
                  <Button className="gap-2"><Plus className="w-4 h-4" />分享经验</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader><DialogTitle>分享你的创作经验</DialogTitle></DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>发布平台 *</Label>
                        <Select value={shareForm.platform} onValueChange={(v) => setShareForm({...shareForm, platform: v})}>
                          <SelectTrigger><SelectValue placeholder="选择平台" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="番茄小说">番茄小说</SelectItem>
                            <SelectItem value="七猫小说">七猫小说</SelectItem>
                            <SelectItem value="起点中文网">起点中文网</SelectItem>
                            <SelectItem value="晋江文学城">晋江文学城</SelectItem>
                            <SelectItem value="其他">其他</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>月收入</Label>
                        <Input placeholder="如: 5000元" value={shareForm.income} onChange={(e) => setShareForm({...shareForm, income: e.target.value})} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>分享标题 *</Label>
                      <Input placeholder="给你的分享起个吸引人的标题" value={shareForm.title} onChange={(e) => setShareForm({...shareForm, title: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>创作故事 *</Label>
                      <Textarea placeholder="分享你的创作历程..." className="min-h-[150px]" value={shareForm.story} onChange={(e) => setShareForm({...shareForm, story: e.target.value})} />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                      <Button variant="outline" onClick={() => setShowShareDialog(false)}>取消</Button>
                      <Button onClick={handleSubmitShare}>提交分享</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {loading ? (
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <SkeletonCard key={i} type="share" />
                ))}
              </div>
            ) : filteredShares.length === 0 ? (
              <Card className="shadow-elegant rounded-2xl">
                <CardContent className="py-16 text-center">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                    <Users className="w-12 h-12 text-primary/40" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">暂无作者分享</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">成为第一个分享创作经验的作者，帮助更多创作者成长</p>
                  <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
                    <DialogTrigger asChild>
                      <Button size="lg" className="gap-2">
                        <Plus className="w-4 h-4" />
                        分享我的经验
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader><DialogTitle>分享你的创作经验</DialogTitle></DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>发布平台 *</Label>
                            <Select value={shareForm.platform} onValueChange={(v) => setShareForm({...shareForm, platform: v})}>
                              <SelectTrigger><SelectValue placeholder="选择平台" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="番茄小说">番茄小说</SelectItem>
                                <SelectItem value="七猫小说">七猫小说</SelectItem>
                                <SelectItem value="起点中文网">起点中文网</SelectItem>
                                <SelectItem value="晋江文学城">晋江文学城</SelectItem>
                                <SelectItem value="其他">其他</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>月收入</Label>
                            <Input placeholder="如: 5000元" value={shareForm.income} onChange={(e) => setShareForm({...shareForm, income: e.target.value})} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>分享标题 *</Label>
                          <Input placeholder="给你的分享起个吸引人的标题" value={shareForm.title} onChange={(e) => setShareForm({...shareForm, title: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                          <Label>创作故事 *</Label>
                          <Textarea placeholder="分享你的创作历程..." className="min-h-[150px]" value={shareForm.story} onChange={(e) => setShareForm({...shareForm, story: e.target.value})} />
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                          <Button variant="outline" onClick={() => setShowShareDialog(false)}>取消</Button>
                          <Button onClick={handleSubmitShare}>提交分享</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {filteredShares.map((share) => {
                  const isCollected = collectedItems.has(`share:${share.id}`);
                  const isFollowing = share.user_id ? followingUsers.has(share.user_id) : false;
                  
                  return (
                    <Card key={share.id} className="shadow-elegant rounded-2xl hover-lift transition-all overflow-hidden">
                      <div className="h-2 bg-gradient-to-r from-primary via-primary-light to-primary opacity-80" />
                      <CardHeader className="pb-3">
                        <div className="flex items-start gap-3">
                          <div className="relative">
                            <Avatar className="w-10 h-10 ring-2 ring-primary/20">
                              <AvatarImage src={share.avatar_url || undefined} />
                              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">{share.nickname[0]}</AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-foreground">{share.nickname}</span>
                              <Badge variant="secondary" className="text-xs flex items-center gap-1">
                                <Globe className="w-3 h-3" />
                                {share.platform}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(share.created_at).toLocaleDateString('zh-CN')}
                            </p>
                          </div>
                          {share.user_id && (
                            <Button
                              variant={isFollowing ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleToggleFollow(share.user_id!)}
                              className="gap-1"
                            >
                              <UserPlus className="w-3 h-3" />
                              {isFollowing ? '已关注' : '关注'}
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <h3 className="text-lg font-semibold text-foreground flex items-start gap-2">
                          <FileText className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          {share.title}
                        </h3>
                        {share.income && (
                          <Badge variant="outline" className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 text-yellow-600 border-yellow-500/20 flex items-center gap-1 w-fit">
                            <TrendingUp className="w-3 h-3" />
                            月收入: {share.income}
                          </Badge>
                        )}
                        <p className="text-muted-foreground line-clamp-3">{share.story}</p>
                        <div className="flex items-center gap-4 pt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleCollection('share', share.id)}
                            className={`gap-1 ${isCollected ? 'text-primary' : 'text-muted-foreground'} transition-all`}
                          >
                            <Bookmark className={`w-4 h-4 ${isCollected ? 'fill-current' : ''} ${animatingIcons.has(`share:${share.id}`) ? 'animate-star-twinkle' : ''}`} />
                            <span>{isCollected ? '已收藏' : '收藏'}</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setShowCommentDialog({ targetType: 'share', targetId: share.id });
                              loadComments('share', share.id);
                            }}
                            className="gap-1 text-muted-foreground"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>评论</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                            <Share2 className="w-4 h-4" /><span>分享</span>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="works" className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-foreground">作品展示广场</h2>
              <Dialog open={showWorkDialog} onOpenChange={setShowWorkDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2"><Plus className="w-4 h-4" />发布作品</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader><DialogTitle>发布你的作品</DialogTitle></DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>作品标题 *</Label>
                        <Input placeholder="给你的作品起个吸引人的标题" value={workForm.title} onChange={(e) => setWorkForm({...workForm, title: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label>作品类型 *</Label>
                        <Select value={workForm.genre} onValueChange={(v) => setWorkForm({...workForm, genre: v})}>
                          <SelectTrigger><SelectValue placeholder="选择类型" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="玄幻">玄幻</SelectItem>
                            <SelectItem value="都市">都市</SelectItem>
                            <SelectItem value="言情">言情</SelectItem>
                            <SelectItem value="古代">古代</SelectItem>
                            <SelectItem value="科幻">科幻</SelectItem>
                            <SelectItem value="悬疑">悬疑</SelectItem>
                            <SelectItem value="其他">其他</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>封面图片URL</Label>
                      <Input placeholder="可选，输入图片链接" value={workForm.coverImage} onChange={(e) => setWorkForm({...workForm, coverImage: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>作品简介 *</Label>
                      <Textarea placeholder="简要介绍你的作品..." className="min-h-[120px]" value={workForm.description} onChange={(e) => setWorkForm({...workForm, description: e.target.value})} />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                      <Button variant="outline" onClick={() => setShowWorkDialog(false)}>取消</Button>
                      <Button onClick={handleSubmitWork}>发布作品</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <SkeletonCard key={i} type="work" />
                ))}
              </div>
            ) : filteredWorks.length === 0 ? (
              <Card className="shadow-elegant rounded-2xl">
                <CardContent className="py-16 text-center">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-primary/40" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">暂无作品展示</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">展示你的创作成果，获得更多读者的关注和认可</p>
                  <Dialog open={showWorkDialog} onOpenChange={setShowWorkDialog}>
                    <DialogTrigger asChild>
                      <Button size="lg" className="gap-2">
                        <Plus className="w-4 h-4" />
                        发布我的作品
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader><DialogTitle>发布你的作品</DialogTitle></DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>作品标题 *</Label>
                            <Input placeholder="给你的作品起个吸引人的标题" value={workForm.title} onChange={(e) => setWorkForm({...workForm, title: e.target.value})} />
                          </div>
                          <div className="space-y-2">
                            <Label>作品类型 *</Label>
                            <Select value={workForm.genre} onValueChange={(v) => setWorkForm({...workForm, genre: v})}>
                              <SelectTrigger><SelectValue placeholder="选择类型" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="玄幻">玄幻</SelectItem>
                                <SelectItem value="都市">都市</SelectItem>
                                <SelectItem value="言情">言情</SelectItem>
                                <SelectItem value="古代">古代</SelectItem>
                                <SelectItem value="科幻">科幻</SelectItem>
                                <SelectItem value="悬疑">悬疑</SelectItem>
                                <SelectItem value="其他">其他</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>封面图片URL</Label>
                          <Input placeholder="可选，输入图片链接" value={workForm.coverImage} onChange={(e) => setWorkForm({...workForm, coverImage: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                          <Label>作品简介 *</Label>
                          <Textarea placeholder="简要介绍你的作品..." className="min-h-[120px]" value={workForm.description} onChange={(e) => setWorkForm({...workForm, description: e.target.value})} />
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                          <Button variant="outline" onClick={() => setShowWorkDialog(false)}>取消</Button>
                          <Button onClick={handleSubmitWork}>发布作品</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredWorks.map((work) => {
                  const isCollected = collectedItems.has(`work:${work.id}`);
                  
                  return (
                    <Card key={work.id} className="shadow-elegant rounded-2xl hover-lift transition-all cursor-pointer group overflow-hidden">
                      <div className="aspect-video relative rounded-t-2xl overflow-hidden">
                        {work.cover_image ? (
                          <img
                            src={work.cover_image}
                            alt={work.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center group-hover:from-primary/20 group-hover:to-primary/10 transition-all">
                            <BookOpen className="w-12 h-12 text-primary/30" />
                          </div>
                        )}
                      </div>
                      <CardContent className="pt-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary">{work.genre}</Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleCollection('work', work.id);
                            }}
                            className={`${isCollected ? 'text-primary' : 'text-muted-foreground'} transition-all`}
                          >
                            <Bookmark className={`w-4 h-4 ${isCollected ? 'fill-current' : ''} ${animatingIcons.has(`work:${work.id}`) ? 'animate-star-twinkle' : ''}`} />
                          </Button>
                        </div>
                        <h3 className="font-semibold text-foreground line-clamp-2">{work.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{work.description}</p>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{work.like_count || 0}</span>
                            <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{work.view_count || 0}</span>
                          </div>
                          <span>{new Date(work.created_at).toLocaleDateString('zh-CN')}</span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="tutorials" className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">教程与攻略库</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tutorials.map((tutorial, index) => {
                const gradients = [
                  'from-blue-500 to-cyan-500',
                  'from-purple-500 to-pink-500',
                  'from-green-500 to-emerald-500',
                  'from-orange-500 to-red-500'
                ];
                return (
                  <Link key={tutorial.id} to="/tutorial-detail" search={{ id: tutorial.id.toString() }}>
                    <Card className="shadow-elegant rounded-2xl hover-lift transition-all cursor-pointer overflow-hidden group">
                      <div className={`h-1.5 bg-gradient-to-r ${gradients[index % gradients.length]} opacity-70 group-hover:opacity-100 transition-opacity`} />
                      <CardHeader>
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradients[index % gradients.length]}/20 flex items-center justify-center flex-shrink-0 group-hover:${gradients[index % gradients.length]}/30 transition-all`}>
                            <tutorial.icon className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold mb-1 group-hover:text-primary transition-colors">{tutorial.title}</h3>
                            <p className="text-sm text-muted-foreground">{tutorial.desc}</p>
                          </div>
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="platforms" className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">全球小说网站排名</h2>
            <div className="space-y-4">
              {platforms.map((platform) => (
                <Link key={platform.rank} to="/platform-detail" search={{ id: platform.rank.toString() }}>
                  <Card className="shadow-elegant rounded-2xl hover-lift transition-all cursor-pointer">
                    <CardContent className="py-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-primary-foreground font-bold text-xl flex-shrink-0">
                          {platform.rank}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold text-foreground">{platform.name}</h3>
                            <Badge variant={platform.type === 'domestic' ? 'default' : 'secondary'}>{platform.type === 'domestic' ? '国内' : '海外'}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{platform.company}</p>
                          <p className="text-primary font-medium mb-3">{platform.income}</p>
                          <div className="flex flex-wrap gap-2">
                            {platform.pros.map((pro, i) => (
                              <Badge key={i} variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">{pro}</Badge>
                            ))}
                            {platform.cons.map((con, i) => (
                              <Badge key={i} variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-500/20">{con}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            <div className="text-center pt-6">
              <Link to="/global-rankings">
                <Button size="lg" variant="outline" className="gap-2">
                  <Globe className="w-4 h-4" />
                  查看全球TOP20完整榜单（中英文）
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="topics" className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">热门话题与榜单</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {hotTopics.map((topic, index) => {
                const topicGradients = [
                  'from-red-500 to-orange-500',
                  'from-blue-500 to-indigo-500',
                  'from-green-500 to-teal-500',
                  'from-purple-500 to-pink-500',
                  'from-yellow-500 to-amber-500'
                ];
                return (
                  <Link key={topic.id} to="/topic-detail" search={{ id: topic.id.toString() }}>
                    <Card className="shadow-elegant rounded-2xl hover-lift transition-all cursor-pointer overflow-hidden group">
                      <div className={`h-1.5 bg-gradient-to-r ${topicGradients[index % topicGradients.length]} opacity-60 group-hover:opacity-100 transition-opacity`} />
                      <CardContent className="py-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{topic.title}</h3>
                              {topic.isHot && (
                                <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white flex items-center gap-1 animate-pulse">
                                  <TrendingUp className="w-3 h-3" />
                                  热门
                                </Badge>
                              )}
                            </div>
                            <Badge variant="secondary" className="mb-3 flex items-center gap-1 w-fit">
                              <MessageCircle className="w-3 h-3" />
                              {topic.tag}
                            </Badge>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1 hover:text-primary transition-colors">
                                <MessageCircle className="w-3 h-3" />
                                {topic.postCount} 帖
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {topic.viewCount} 浏览
                              </span>
                            </div>
                          </div>
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${topicGradients[index % topicGradients.length]}/20 flex items-center justify-center group-hover:${topicGradients[index % topicGradients.length]}/30 transition-all`}>
                            <TrendingUp className="w-6 h-6 text-primary" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="qa" className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-foreground">问答互助区</h2>
              <Dialog open={showQuestionDialog} onOpenChange={setShowQuestionDialog}>
                <DialogTrigger asChild>
                  <Button className="gap-2"><Plus className="w-4 h-4" />提问求助</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader><DialogTitle>发布新问题</DialogTitle></DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label>分类 *</Label>
                      <Select value={questionForm.category} onValueChange={(v) => setQuestionForm({...questionForm, category: v})}>
                        <SelectTrigger><SelectValue placeholder="选择分类" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="技术">技术问题</SelectItem>
                          <SelectItem value="创作">创作问题</SelectItem>
                          <SelectItem value="平台">平台问题</SelectItem>
                          <SelectItem value="其他">其他</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>问题标题 *</Label>
                      <Input placeholder="简要描述你的问题" value={questionForm.title} onChange={(e) => setQuestionForm({...questionForm, title: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>详细描述 *</Label>
                      <Textarea placeholder="详细说明你遇到的问题..." className="min-h-[150px]" value={questionForm.content} onChange={(e) => setQuestionForm({...questionForm, content: e.target.value})} />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                      <Button variant="outline" onClick={() => setShowQuestionDialog(false)}>取消</Button>
                      <Button onClick={handleSubmitQuestion}>发布问题</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <SkeletonCard key={i} type="qa" />
                ))}
              </div>
            ) : qaPosts.length === 0 ? (
              <Card className="shadow-elegant rounded-2xl">
                <CardContent className="py-16 text-center">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                    <HelpCircle className="w-12 h-12 text-primary/40" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">暂无问题</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">提出你的创作疑问，社区达人会为你解答</p>
                  <Dialog open={showQuestionDialog} onOpenChange={setShowQuestionDialog}>
                    <DialogTrigger asChild>
                      <Button size="lg" className="gap-2">
                        <Plus className="w-4 h-4" />
                        发布我的问题
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader><DialogTitle>发布新问题</DialogTitle></DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label>分类 *</Label>
                          <Select value={questionForm.category} onValueChange={(v) => setQuestionForm({...questionForm, category: v})}>
                            <SelectTrigger><SelectValue placeholder="选择分类" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="技术">技术问题</SelectItem>
                              <SelectItem value="创作">创作问题</SelectItem>
                              <SelectItem value="平台">平台问题</SelectItem>
                              <SelectItem value="其他">其他</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>问题标题 *</Label>
                          <Input placeholder="简要描述你的问题" value={questionForm.title} onChange={(e) => setQuestionForm({...questionForm, title: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                          <Label>详细描述 *</Label>
                          <Textarea placeholder="详细说明你遇到的问题..." className="min-h-[150px]" value={questionForm.content} onChange={(e) => setQuestionForm({...questionForm, content: e.target.value})} />
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                          <Button variant="outline" onClick={() => setShowQuestionDialog(false)}>取消</Button>
                          <Button onClick={handleSubmitQuestion}>发布问题</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {qaPosts.map((post) => (
                  <Link key={post.id} to="/qa-detail" search={{ id: post.id }}>
                    <Card className="shadow-elegant rounded-2xl hover-lift transition-all cursor-pointer overflow-hidden group">
                      <div className="h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-60 group-hover:opacity-100 transition-opacity" />
                      <CardContent className="py-6">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 relative">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all">
                              <HelpCircle className="w-6 h-6 text-blue-500" />
                            </div>
                            {post.answer_count && post.answer_count > 0 && (
                              <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-green-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold px-1">
                                {post.answer_count > 9 ? '9+' : post.answer_count}
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary" className="flex items-center gap-1">
                                <MessageCircle className="w-3 h-3" />
                                {post.category}
                              </Badge>
                              <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(post.created_at).toLocaleDateString('zh-CN')}
                              </span>
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
                            <p className="text-muted-foreground line-clamp-2 mb-3">{post.content}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1 hover:text-primary transition-colors">
                                <MessageCircle className="w-3 h-3" />
                                {post.answer_count || 0} 回答
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {post.view_count || 0} 浏览
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!showCommentDialog} onOpenChange={(open) => {
        if (!open) {
          setShowCommentDialog(null);
          setCommentContent('');
          setReplyingTo(null);
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>评论区</DialogTitle>
          </DialogHeader>

          <ScrollArea className="flex-1 pr-4 mb-4">
            <div className="space-y-4">
              {showCommentDialog && comments.get(`${showCommentDialog.targetType}:${showCommentDialog.targetId}`)?.map((comment) => (
                <div key={comment.id} className="flex gap-3 p-3 rounded-lg bg-secondary/50">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={comment.avatar_url || undefined} />
                    <AvatarFallback>{comment.nickname?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{comment.nickname || '匿名用户'}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.created_at).toLocaleString('zh-CN')}
                      </span>
                    </div>
                    <p className="text-sm text-foreground">{comment.content}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleCommentLike(comment.id)}
                        className={`h-7 text-xs gap-1 ${likedComments.has(comment.id) ? 'text-primary' : 'text-muted-foreground'}`}
                      >
                        <Heart className={`w-3 h-3 ${likedComments.has(comment.id) ? 'fill-current' : ''}`} />
                        <span>{comment.like_count || 0}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setReplyingTo(comment.id)}
                        className="h-7 text-xs"
                      >
                        回复
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {showCommentDialog && (!comments.get(`${showCommentDialog.targetType}:${showCommentDialog.targetId}`) || comments.get(`${showCommentDialog.targetType}:${showCommentDialog.targetId}`)?.length === 0) && (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p>暂无评论，快来发表第一条评论吧！</p>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="border-t pt-4">
            {replyingTo && (
              <div className="mb-2 text-sm text-primary flex items-center gap-2">
                <span>回复评论</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyingTo(null)}
                  className="h-6 text-xs"
                >
                  取消
                </Button>
              </div>
            )}
            <Textarea
              placeholder={replyingTo ? "写下你的回复..." : "写下你的评论..."}
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              className="min-h-[80px] mb-3"
            />
            <div className="flex justify-end">
              <Button onClick={handleSubmitComment} disabled={!commentContent.trim()}>
                发表评论
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
