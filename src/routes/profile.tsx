import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase, getSupabaseUrl } from '@/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { StatsPanel } from '@/components/profile/StatsPanel';
import { User, Key, FileText, BarChart3, LogOut, Mail, Bell, Eye, EyeOff, ArrowLeft, Camera, Edit3, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
});

interface RewriteRecord {
  id: string;
  original_text_length: number;
  rewritten_text_length: number;
  model_used: string;
  params_used: any;
  created_at: string;
}

interface Message {
  id: string;
  title: string;
  content: string;
  type: string;
  is_read: boolean;
  created_at: string | null;
}

function ProfilePage() {
  const navigate = useNavigate();
  const authState = useAuth();
  const [records, setRecords] = useState<RewriteRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(true);

  // API Key管理相关状态
  const [apiKey, setApiKey] = useState<string>('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [testModel, setTestModel] = useState('deepseek-chat');
  const [testResult, setTestResult] = useState<string>('');

  // 邮箱绑定相关状态 - 使用AuthContext中的状态
  const [bindEmail, setBindEmail] = useState('');
  const [bindCode, setBindCode] = useState('');
  const [sendingCode, setSendingCode] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // 从AuthContext获取邮箱状态
  const userEmail = authState.email || null;
  const showBindEmailDialog = authState.showEmailBindDialog || false;
  const setShowBindEmailDialog = authState.setShowEmailBindDialog;
  const setEmail = authState.setEmail;

  // 用户资料相关状态
  const [nickname, setNickname] = useState<string>('用户');
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [showEditNicknameDialog, setShowEditNicknameDialog] = useState(false);
  const [newNickname, setNewNickname] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // 社区交流相关状态
  const [selectedTutorial, setSelectedTutorial] = useState<any>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<any>(null);
  const [selectedAuthor, setSelectedAuthor] = useState<any>(null);
  const [authorShares, setAuthorShares] = useState<any[]>([]);
  const [sharesLoading, setSharesLoading] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [submittingShare, setSubmittingShare] = useState(false);
  const [shareForm, setShareForm] = useState({
    platform: '',
    title: '',
    income: '',
    story: '',
    background: '',
    breakthrough: '',
    currentStatus: '',
    advice: '',
    tips: '',
    achievement: ''
  });
  const [shareImages, setShareImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [likedShares, setLikedShares] = useState<Set<string>>(new Set());
  const [shareLikeCounts, setShareLikeCounts] = useState<Record<string, number>>({});

  // 教程详细数据
  const tutorials = [
    {
      id: 1,
      title: '快速上手指南',
      desc: '5分钟学会如何使用仿写工具',
      content: `## 快速上手指南

### 第一步：上传原文
- 支持TXT和DOCX格式
- 建议单次上传不超过10万字
- 系统会自动识别章节结构

### 第二步：选择AI模型
- qwen3.6-plus（推荐，速度快）
- kimi-k2.5（长文本处理强）
- deepseek-v3.2（性价比高）

### 第三步：调整参数
- AI创意度：控制改写幅度（30%-80%）
- 写作模式：综合/精简/扩写
- 风格保持：保留原文风格程度

### 第四步：开始仿写
- 点击"开始仿写"按钮
- 实时查看生成进度
- 完成后下载作品

### 小贴士
- 首次使用建议从短篇开始
- 多尝试不同参数组合
- 保存常用配置为模板`
    },
    {
      id: 2,
      title: '爆款仿写技巧',
      desc: '掌握核心仿写逻辑，提升作品质量',
      content: `## 爆款仿写技巧

### 1. 开头黄金三章
- 第一章必须出现冲突或悬念
- 主角人设要鲜明立体
- 世界观设定要自然融入剧情

### 2. 节奏把控
- 每3000字设置一个小高潮
- 每1万字设置一个大转折
- 避免长时间平淡叙述

### 3. 人物塑造
- 主角要有明确的目标和动机
- 配角要有记忆点
- 反派要有合理的行动逻辑

### 4. 爽点设计
- 打脸情节要铺垫充分
- 升级过程要有层次感
- 感情线要循序渐进

### 5. 仿写要点
- 保留原文的核心冲突
- 优化对话的自然度
- 增强场景的画面感`
    },
    {
      id: 3,
      title: '平台投稿攻略',
      desc: '各大网文平台投稿规则详解',
      content: `## 平台投稿攻略

### 番茄小说
- **签约方式**：满2万字自动审核
- **收益模式**：广告分成+全勤奖
- **适合类型**：玄幻、都市、言情
- **注意事项**：日更4000字以上有加成

### 七猫小说
- **签约方式**：编辑人工审核
- **收益模式**：千字20元起保底
- **适合类型**：女频、甜宠、霸总
- **注意事项**：需要稳定更新

### 起点中文网
- **签约方式**：内投或直发
- **收益模式**：订阅+打赏+版权
- **适合类型**：男频、玄幻、仙侠
- **注意事项**：质量要求高

### 晋江文学城
- **签约方式**：申请签约
- **收益模式**：VIP订阅
- **适合类型**：女频、古言、现言
- **注意事项**：注重文笔和情感`
    },
    {
      id: 4,
      title: '版权合规指南',
      desc: '如何避免抄袭风险，安全创作',
      content: `## 版权合规指南

### 什么是合规仿写？
- 借鉴故事框架和情节结构
- 重新创作人物和对话
- 改变背景设定和世界观
- 加入原创元素和创新点

### 避免抄袭的方法
1. **不要直接复制原文**
   - 用自己的语言重述
   - 改变叙述视角
   - 调整情节顺序

2. **增加原创内容**
   - 设计新的人物关系
   - 添加支线剧情
   - 创造独特的世界观

3. **保持合理相似度**
   - 核心冲突可以相似
   - 具体表达必须原创
   - 对话要完全重写

### 法律风险提示
- 直接复制超过30%可能被认定抄袭
- 人物名称和设定要修改
- 特殊情节需要大幅改动

### 建议
- 仿写是学习手段，不是最终目的
- 逐步提高原创比例
- 形成自己的写作风格`
    }
  ];

  // 平台详细数据
  const platforms = [
    {
      name: '番茄小说',
      desc: '流量天花板，新手零门槛',
      income: '月收益3000-10000+',
      type: 'domestic',
      details: {
        platform: '番茄小说',
        company: '字节跳动',
        signup: '满2万字自动审核签约',
        payment: '广告分成+全勤奖+礼物',
        minUpdate: '日更4000字',
        fullAttendance: '月更12万字，全勤600元',
        pros: ['流量巨大', '新手友好', '结算透明', '提现方便'],
        cons: ['竞争激烈', '单价较低', '算法推荐'],
        tips: '保持日更，前10万字是关键期，注意标题和简介的吸引力'
      }
    },
    {
      name: '七猫小说',
      desc: '千字20元起保底',
      income: '全勤福利稳定',
      type: 'domestic',
      details: {
        platform: '七猫小说',
        company: '百度旗下',
        signup: '编辑人工审核，3-7天回复',
        payment: '保底+分成，千字20-100元',
        minUpdate: '日更4000字',
        fullAttendance: '月更12万字，全勤奖励',
        pros: ['收入稳定', '编辑指导', '女频优势', '保底保障'],
        cons: ['审核严格', '题材限制', '更新压力'],
        tips: '女频作者首选，甜宠、霸总题材容易过稿，注意开篇吸引力'
      }
    },
    {
      name: '起点中文网',
      desc: 'IP变现天花板',
      income: '爆款可斩获数十万',
      type: 'domestic',
      details: {
        platform: '起点中文网',
        company: '阅文集团',
        signup: '内投编辑或直发待签',
        payment: 'VIP订阅+打赏+版权改编',
        minUpdate: '日更4000字推荐',
        fullAttendance: '无强制全勤，自由更新',
        pros: ['IP价值高', '读者付费能力强', '大神云集', '版权机会多'],
        cons: ['竞争极其激烈', '新人难出头', '质量要求高'],
        tips: '男频作者圣地，玄幻、仙侠、都市是主流，注重世界观构建和升级体系'
      }
    },
    {
      name: '晋江文学城',
      desc: '女频言情首选',
      income: '付费转化率高',
      type: 'domestic',
      details: {
        platform: '晋江文学城',
        company: '独立运营',
        signup: '申请签约，审核较严',
        payment: 'VIP订阅+出版+影视改编',
        minUpdate: '日更3000字即可',
        fullAttendance: '无强制要求',
        pros: ['女频头部平台', '读者忠诚度高', '版权开发成熟', '文笔要求高'],
        cons: ['审核严格', '题材受限', '签约难度大'],
        tips: '古言、现言、纯爱是主流，注重情感描写和人物刻画，文笔要好'
      }
    },
    {
      name: 'Webnovel',
      desc: '海外流量庞大',
      income: '男频玄幻受众广',
      type: 'overseas',
      details: {
        platform: 'Webnovel',
        company: '阅文集团海外版',
        signup: '直接发布，达到标准签约',
        payment: '订阅+礼物+合同保底',
        minUpdate: '日更2000英文单词',
        fullAttendance: '有全勤计划',
        pros: ['全球市场', '美元结算', '玄幻受欢迎', '长尾收益'],
        cons: ['语言要求', '文化差异', '时差问题'],
        tips: '玄幻、系统、穿越题材最受欢迎，注意文化适配，可用翻译工具辅助'
      }
    },
    {
      name: 'GoodNovel',
      desc: '女频言情付费转化高',
      income: '分成比例优',
      type: 'overseas',
      details: {
        platform: 'GoodNovel',
        company: '中文在线旗下',
        signup: '投稿审核，7天内回复',
        payment: '高分成比例，最高70%',
        minUpdate: '日更2000英文单词',
        fullAttendance: '有更新奖励',
        pros: ['女频优势', '分成高', '编辑支持', '欧美市场'],
        cons: ['竞争激烈', '质量要求', '语言门槛'],
        tips: '狼人、吸血鬼、霸总题材热门，注重情感冲突和悬念设置'
      }
    },
    {
      name: 'Amazon Kindle',
      desc: '常年持续曝光',
      income: '被动长尾收益',
      type: 'overseas',
      details: {
        platform: 'Amazon Kindle Direct Publishing',
        company: '亚马逊',
        signup: '自助出版，无需审核',
        payment: '销售分成，最高70%',
        minUpdate: '无更新要求，一次性出版',
        fullAttendance: '无',
        pros: ['全球最大平台', '被动收入', '永久在售', '多语言'],
        cons: ['营销靠自己', '前期投入大', '竞争激烈'],
        tips: '适合完结作品，做好封面和简介，利用KDP Select推广'
      }
    },
    {
      name: 'Dreame',
      desc: '新兴市场增长快',
      income: '竞争相对较小',
      type: 'overseas',
      details: {
        platform: 'Dreame',
        company: '中文在线',
        signup: '投稿审核',
        payment: '订阅+礼物+保底',
        minUpdate: '日更2000英文单词',
        fullAttendance: '有全勤奖励',
        pros: ['增长迅速', '东南亚市场', '竞争较小', '扶持新人'],
        cons: ['平台较新', '读者基数小', '不稳定'],
        tips: '早期进入有红利，适合多平台分发，注意本地化'
      }
    }
  ];



  useEffect(() => {
    loadRewriteRecords();
    checkUserEmail();
    loadMessages();
    loadApiKey();
    loadUserProfile();
    loadAuthorShares();
    loadLikeData();
  }, []);

  // 加载用户资料
  const loadUserProfile = () => {
    const savedNickname = localStorage.getItem('user_nickname');
    const savedAvatar = localStorage.getItem('user_avatar');
    if (savedNickname) setNickname(savedNickname);
    if (savedAvatar) setAvatarUrl(savedAvatar);
  };

  // 保存昵称
  const handleSaveNickname = () => {
    if (!newNickname.trim()) {
      toast.error('昵称不能为空');
      return;
    }
    if (newNickname.length > 20) {
      toast.error('昵称不能超过20个字符');
      return;
    }
    setNickname(newNickname);
    localStorage.setItem('user_nickname', newNickname);
    setShowEditNicknameDialog(false);
    toast.success('昵称修改成功');
  };

  // 上传头像
  const handleUploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      toast.error('请选择图片文件');
      return;
    }

    // 验证文件大小（最大5MB）
    if (file.size > 5 * 1024 * 1024) {
      toast.error('图片大小不能超过5MB');
      return;
    }

    try {
      setUploadingAvatar(true);

      // 将图片转换为base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        setAvatarUrl(base64);
        localStorage.setItem('user_avatar', base64);
        setUploadingAvatar(false);
        toast.success('头像上传成功');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('上传头像失败:', error);
      setUploadingAvatar(false);
      toast.error('上传头像失败');
    }
  };

  // 加载作者分享列表
  const loadAuthorShares = async () => {
    try {
      setSharesLoading(true);
      const { data, error } = await supabase
        .from('author_shares')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setAuthorShares(data || []);
    } catch (error) {
      console.error('加载作者分享失败:', error);
    } finally {
      setSharesLoading(false);
    }
  };

  // 加载点赞数据
  const loadLikeData = async () => {
    try {
      // 获取每个分享的点赞数
      const { data: likesData, error } = await supabase
        .from('author_share_likes')
        .select('share_id');

      if (error) throw error;

      // 统计每个分享的点赞数
      const counts: Record<string, number> = {};
      likesData?.forEach((like: any) => {
        counts[like.share_id] = (counts[like.share_id] || 0) + 1;
      });
      setShareLikeCounts(counts);
    } catch (error) {
      console.error('加载点赞数据失败:', error);
    }
  };

  // 切换点赞状态
  const toggleLike = async (shareId: string) => {
    try {
      const isLiked = likedShares.has(shareId);

      if (isLiked) {
        // 取消点赞
        await supabase
          .from('author_share_likes')
          .delete()
          .eq('share_id', shareId);

        setLikedShares(prev => {
          const newSet = new Set(prev);
          newSet.delete(shareId);
          return newSet;
        });
        setShareLikeCounts(prev => ({
          ...prev,
          [shareId]: Math.max(0, (prev[shareId] || 1) - 1)
        }));
      } else {
        // 点赞
        await supabase
          .from('author_share_likes')
          .insert({ share_id: shareId });

        setLikedShares(prev => new Set(prev).add(shareId));
        setShareLikeCounts(prev => ({
          ...prev,
          [shareId]: (prev[shareId] || 0) + 1
        }));
      }
    } catch (error) {
      console.error('点赞操作失败:', error);
      toast.error('操作失败，请重试');
    }
  };

  // 处理图片上传
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // 限制最多9张图片
    if (shareImages.length + files.length > 9) {
      toast.error('最多只能上传9张图片');
      return;
    }

    try {
      setUploadingImages(true);
      const newImages: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // 验证文件类型
        if (!file.type.startsWith('image/')) {
          toast.error('请选择图片文件');
          continue;
        }

        // 验证文件大小（最大5MB）
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`图片 ${file.name} 大小不能超过5MB`);
          continue;
        }

        // 转换为base64
        const reader = new FileReader();
        const base64 = await new Promise<string>((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        newImages.push(base64);
      }

      setShareImages(prev => [...prev, ...newImages]);
      setUploadingImages(false);
      toast.success(`成功上传 ${newImages.length} 张图片`);
    } catch (error) {
      console.error('上传图片失败:', error);
      setUploadingImages(false);
      toast.error('上传图片失败');
    }
  };

  // 删除已选图片
  const handleRemoveImage = (index: number) => {
    setShareImages(prev => prev.filter((_, i) => i !== index));
  };

  // 提交作者分享
  const handleSubmitShare = async () => {
    if (!shareForm.platform.trim()) {
      toast.error('请选择发布平台');
      return;
    }
    if (!shareForm.title.trim()) {
      toast.error('请输入作者头衔');
      return;
    }
    if (!shareForm.story.trim()) {
      toast.error('请输入心得故事');
      return;
    }

    try {
      setSubmittingShare(true);

      const { error } = await supabase.from('author_shares').insert({
        nickname: nickname,
        avatar_url: avatarUrl || null,
        platform: shareForm.platform,
        title: shareForm.title,
        income: shareForm.income || null,
        story: shareForm.story,
        background: shareForm.background || null,
        breakthrough: shareForm.breakthrough || null,
        current_status: shareForm.currentStatus || null,
        advice: shareForm.advice || null,
        tips: shareForm.tips || null,
        achievement: shareForm.achievement || null,
        images: shareImages.length > 0 ? shareImages : null
      });

      if (error) throw error;

      toast.success('分享发布成功！');
      setShowShareDialog(false);
      setShareForm({
        platform: '',
        title: '',
        income: '',
        story: '',
        background: '',
        breakthrough: '',
        currentStatus: '',
        advice: '',
        tips: '',
        achievement: ''
      });
      setShareImages([]);
      loadAuthorShares();
    } catch (error: any) {
      console.error('发布分享失败:', error);
      toast.error(error.message || '发布失败，请重试');
    } finally {
      setSubmittingShare(false);
    }
  };

  // 加载API Key
  const loadApiKey = () => {
    const savedKey = localStorage.getItem('user_api_key');
    if (savedKey) {
      setApiKey(savedKey);
    } else {
      // 生成默认演示Key
      const defaultKey = 'sk-demo-' + Math.random().toString(36).substring(2, 15);
      setApiKey(defaultKey);
    }
  };

  // 保存API Key
  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast.error('API Key不能为空');
      return;
    }
    localStorage.setItem('user_api_key', apiKey);
    toast.success('API Key已保存');
  };

  // 测试连接
  const handleTestConnection = async () => {
    if (!apiKey.trim()) {
      toast.error('请先输入API Key');
      return;
    }

    try {
      setTestingConnection(true);
      setConnectionStatus('idle');
      setTestResult('');

      // 调用真实的Edge Function进行测试（使用极小payload避免413）
      const response = await fetch(
        `${getSupabaseUrl()}/functions/v1/ai-novel-rewrite`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            originalText: 'hi',
            params: {
              model: testModel,
              writeMode: 'comprehensive',
              aiCreativity: 60,
            }
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `请求失败: ${response.status}`);
      }

      // 读取流式响应
      if (!response.body) {
        throw new Error('当前环境不支持流式响应');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data: ')) continue;

          const payload = trimmed.slice(6);
          if (payload === '[DONE]') break;

          try {
            const json = JSON.parse(payload);
            const content = json.choices?.[0]?.delta?.content;
            if (content) {
              fullText += content;
              setTestResult(fullText);
            }
          } catch {
            // 忽略非法JSON行
          }
        }
      }

      setConnectionStatus('success');
      toast.success('连接测试成功！AI服务正常');
    } catch (error: any) {
      console.error('测试连接失败:', error);
      setConnectionStatus('error');
      setTestResult(error.message || '未知错误');
      toast.error('连接失败：' + (error.message || '请检查网络或API配置'));
    } finally {
      setTestingConnection(false);
    }
  };

  // 加载消息列表
  const loadMessages = async () => {
    try {
      setMessagesLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('加载消息失败:', error);
    } finally {
      setMessagesLoading(false);
    }
  };

  // 检查用户是否已绑定邮箱
  const checkUserEmail = async () => {
    try {
      // 从AuthContext中读取绑定的邮箱
      if (authState.email) {
        // 已绑定邮箱，无需操作
      } else {
        // 未绑定邮箱，显示绑定对话框
        setShowBindEmailDialog(true);
      }
    } catch (error) {
      console.error('检查邮箱失败:', error);
    }
  };

  // 发送验证码（简化版：仅做格式校验，实际项目中应接入真实邮件服务）
  const handleSendCode = async () => {
    if (!bindEmail.trim()) {
      toast.error('请输入邮箱地址');
      return;
    }

    // 邮箱格式校验
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(bindEmail)) {
      toast.error('请输入有效的邮箱地址');
      return;
    }

    try {
      setSendingCode(true);

      // 注意：当前项目使用激活码系统，未集成完整的Supabase Auth登录
      // 真实的邮箱验证码功能需要：
      // 1. 完整的用户注册登录系统
      // 2. 配置Supabase Email Template
      // 3. 或使用第三方邮件服务（如SendGrid、阿里云邮件推送）

      // 临时方案：模拟发送成功，实际项目中应替换为真实邮件发送
      toast.success('演示模式：验证码已发送（实际需配置邮件服务）');
      setCountdown(60);

      // 倒计时
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: any) {
      console.error('发送验证码失败:', error);
      toast.error(error.message || '发送验证码失败');
    } finally {
      setSendingCode(false);
    }
  };

  // 验证邮箱并绑定（简化版）
  const handleVerifyEmail = async () => {
    if (!bindCode.trim()) {
      toast.error('请输入验证码');
      return;
    }

    // 演示模式：任意6位数字都视为有效
    if (bindCode.length !== 6 || !/^\d{6}$/.test(bindCode)) {
      toast.error('请输入6位数字验证码');
      return;
    }

    try {
      setVerifying(true);

      // 通过AuthContext保存邮箱
      setEmail(bindEmail);

      toast.success('邮箱绑定成功');
      setShowBindEmailDialog(false);
      setBindEmail('');
      setBindCode('');
    } catch (error: any) {
      console.error('验证失败:', error);
      toast.error(error.message || '验证失败');
    } finally {
      setVerifying(false);
    }
  };

  const loadRewriteRecords = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('rewrite_records')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error('加载记录失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalOriginalChars = records.reduce((sum, r) => sum + r.original_text_length, 0);
  const totalRewrittenChars = records.reduce((sum, r) => sum + r.rewritten_text_length, 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* 用户信息卡片 */}
        <Card className="mb-8 border-border shadow-elegant rounded-2xl overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* 头像区域 */}
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="头像" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-primary" />
                    )}
                  </div>
                  {/* 上传按钮 */}
                  <label className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors">
                    <Camera className="w-3 h-3 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadAvatar}
                      className="hidden"
                      disabled={uploadingAvatar}
                    />
                  </label>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-xl">{nickname}</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setNewNickname(nickname);
                        setShowEditNicknameDialog(true);
                      }}
                      className="h-6 px-2"
                    >
                      <Edit3 className="w-3 h-3" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    激活码: {authState.cardCode || '未激活'}
                  </p>
                  {userEmail && (
                    <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {userEmail}
                    </p>
                  )}
                </div>
              </div>
              <Button variant="outline" onClick={authState.logout}>
                <LogOut className="w-4 h-4 mr-2" />
                退出登录
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-accent/50">
                <p className="text-sm text-muted-foreground">激活状态</p>
                <Badge className="mt-2 bg-green-500">已激活</Badge>
              </div>
              <div className="p-4 rounded-lg bg-accent/50">
                <p className="text-sm text-muted-foreground">剩余天数</p>
                <p className="text-2xl font-bold text-foreground mt-2">
                  {authState.remainingDays || 0} 天
                </p>
              </div>
              <div className="p-4 rounded-lg bg-accent/50">
                <p className="text-sm text-muted-foreground">过期时间</p>
                <p className="text-lg font-medium text-foreground mt-2">
                  {authState.expireTime ? new Date(authState.expireTime).toLocaleDateString() : '-'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 数据统计和仿写记录 */}
        <Tabs defaultValue="stats" className="w-full space-y-8">
          <TabsList className="grid w-full grid-cols-2 rounded-xl bg-secondary p-1">
            <TabsTrigger value="stats" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all">
              <BarChart3 className="w-4 h-4 mr-2" />
              数据统计
            </TabsTrigger>
            <TabsTrigger value="records" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all">
              <FileText className="w-4 h-4 mr-2" />
              仿写记录
            </TabsTrigger>
          </TabsList>

          {/* 数据统计 */}
          <TabsContent value="stats" className="pt-4">
            <StatsPanel />
          </TabsContent>

          {/* 仿写记录 */}
          <TabsContent value="records" className="pt-4">
            <Card className="border-border shadow-elegant rounded-2xl">
              <CardHeader>
                <CardTitle>最近仿写记录</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-center text-muted-foreground py-8">加载中...</p>
                ) : records.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">暂无仿写记录</p>
                ) : (
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-3">
                      {records.map((record) => (
                        <div key={record.id} className="p-4 rounded-lg border border-border">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline">{record.model_used}</Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(record.created_at).toLocaleString()}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">原文:</span>
                              <span className="ml-2 text-foreground">{record.original_text_length.toLocaleString()} 字</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">仿写:</span>
                              <span className="ml-2 text-foreground">{record.rewritten_text_length.toLocaleString()} 字</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* 邮箱绑定对话框 */}
      <Dialog open={showBindEmailDialog} onOpenChange={setShowBindEmailDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>绑定邮箱</DialogTitle>
            <DialogDescription>
              首次使用个人中心需要绑定邮箱，用于接收验证码和找回密码
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>邮箱地址</Label>
              <Input
                type="email"
                value={bindEmail}
                onChange={(e) => setBindEmail(e.target.value)}
                placeholder="请输入邮箱地址"
                className="mt-1"
                disabled={countdown > 0}
              />
            </div>

            <div>
              <Label>验证码</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={bindCode}
                  onChange={(e) => setBindCode(e.target.value)}
                  placeholder="请输入6位验证码"
                  maxLength={6}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  onClick={handleSendCode}
                  disabled={sendingCode || countdown > 0}
                  className="whitespace-nowrap"
                >
                  {countdown > 0 ? `${countdown}s` : sendingCode ? '发送中...' : '获取验证码'}
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBindEmailDialog(false)}>
              稍后绑定
            </Button>
            <Button
              onClick={handleVerifyEmail}
              disabled={!bindEmail || !bindCode || verifying}
              className="bg-primary hover:bg-primary/90"
            >
              {verifying ? '验证中...' : '确认绑定'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 修改昵称对话框 */}
      <Dialog open={showEditNicknameDialog} onOpenChange={setShowEditNicknameDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>修改昵称</DialogTitle>
            <DialogDescription>
              昵称长度不超过20个字符
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Label>新昵称</Label>
            <Input
              value={newNickname}
              onChange={(e) => setNewNickname(e.target.value)}
              placeholder="请输入新昵称"
              className="mt-2"
              maxLength={20}
            />
            <p className="text-xs text-muted-foreground mt-2">
              已输入 {newNickname.length}/20 个字符
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditNicknameDialog(false)}>
              取消
            </Button>
            <Button
              onClick={handleSaveNickname}
              disabled={!newNickname.trim()}
              className="bg-primary hover:bg-primary/90"
            >
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 教程详情对话框 */}
      <Dialog open={!!selectedTutorial} onOpenChange={() => setSelectedTutorial(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedTutorial?.title}</DialogTitle>
            <DialogDescription>{selectedTutorial?.desc}</DialogDescription>
          </DialogHeader>
          <div className="py-4 prose prose-sm max-w-none">
            {selectedTutorial?.content.split('\n').map((line: string, i: number) => {
              if (line.startsWith('## ')) {
                return <h2 key={i} className="text-xl font-bold mt-6 mb-3 text-foreground">{line.slice(3)}</h2>;
              } else if (line.startsWith('### ')) {
                return <h3 key={i} className="text-lg font-semibold mt-4 mb-2 text-foreground">{line.slice(4)}</h3>;
              } else if (line.startsWith('- **')) {
                const match = line.match(/\*\*(.+?)\*\*[:：]\s*(.+)/);
                if (match) {
                  return (
                    <p key={i} className="ml-4 my-1">
                      <span className="font-medium text-foreground">{match[1]}：</span>
                      <span className="text-muted-foreground">{match[2]}</span>
                    </p>
                  );
                }
                return <p key={i} className="ml-4 my-1 text-muted-foreground">{line.replace(/\*\*/g, '')}</p>;
              } else if (line.startsWith('- ')) {
                return <p key={i} className="ml-4 my-1 text-muted-foreground">• {line.slice(2)}</p>;
              } else if (/^\d+\.\s+\*\*/.test(line)) {
                const match = line.match(/^\d+\.\s+\*\*(.+?)\*\*/);
                if (match) {
                  return <p key={i} className="my-2"><span className="font-medium text-foreground">{match[1]}</span></p>;
                }
                return <p key={i} className="my-2 text-muted-foreground">{line.replace(/\*\*/g, '')}</p>;
              } else if (line.trim()) {
                return <p key={i} className="my-1 text-muted-foreground">{line}</p>;
              }
              return <br key={i} />;
            })}
          </div>
          <DialogFooter>
            <Button onClick={() => setSelectedTutorial(null)} className="bg-primary hover:bg-primary/90">
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 平台详情对话框 */}
      <Dialog open={!!selectedPlatform} onOpenChange={() => setSelectedPlatform(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedPlatform?.name}
              <Badge variant={selectedPlatform?.type === 'domestic' ? 'outline' : 'secondary'}>
                {selectedPlatform?.type === 'domestic' ? '国内平台' : '海外平台'}
              </Badge>
            </DialogTitle>
            <DialogDescription>{selectedPlatform?.desc}</DialogDescription>
          </DialogHeader>
          {selectedPlatform && (
            <div className="py-4 space-y-4">
              {/* 基本信息 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-accent/30">
                  <p className="text-xs text-muted-foreground mb-1">所属公司</p>
                  <p className="text-sm font-medium text-foreground">{selectedPlatform.details.company}</p>
                </div>
                <div className="p-3 rounded-lg bg-accent/30">
                  <p className="text-xs text-muted-foreground mb-1">收益预期</p>
                  <p className="text-sm font-medium text-foreground">{selectedPlatform.income}</p>
                </div>
              </div>

              {/* 详细信息 */}
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-foreground mb-2">签约方式</h4>
                  <p className="text-sm text-muted-foreground">{selectedPlatform.details.signup}</p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">收益模式</h4>
                  <p className="text-sm text-muted-foreground">{selectedPlatform.details.payment}</p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">更新要求</h4>
                  <p className="text-sm text-muted-foreground">最低：{selectedPlatform.details.minUpdate}</p>
                  <p className="text-sm text-muted-foreground">全勤：{selectedPlatform.details.fullAttendance}</p>
                </div>
              </div>

              {/* 优缺点 */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-green-600 mb-2">✓ 优势</h4>
                  <ul className="space-y-1">
                    {selectedPlatform.details.pros.map((pro: string, i: number) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">•</span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-red-600 mb-2">✗ 劣势</h4>
                  <ul className="space-y-1">
                    {selectedPlatform.details.cons.map((con: string, i: number) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-red-500 mt-0.5">•</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 建议 */}
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <h4 className="font-medium text-foreground mb-2">💡 运营建议</h4>
                <p className="text-sm text-muted-foreground">{selectedPlatform.details.tips}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setSelectedPlatform(null)} className="bg-primary hover:bg-primary/90">
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 作者心得详情对话框 */}
      <Dialog open={!!selectedAuthor} onOpenChange={() => setSelectedAuthor(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                {selectedAuthor?.avatar_url ? (
                  <img src={selectedAuthor.avatar_url} alt="头像" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-lg">👤</span>
                )}
              </div>
              <div>
                <p className="text-lg">{selectedAuthor?.nickname}</p>
                <p className="text-xs text-muted-foreground">{selectedAuthor?.platform} · {selectedAuthor?.title}</p>
              </div>
            </DialogTitle>
            <DialogDescription>{selectedAuthor?.story}</DialogDescription>
          </DialogHeader>
          {selectedAuthor && (
            <div className="py-4 space-y-4">
              {/* 背景故事 */}
              {selectedAuthor.background && (
                <div>
                  <h4 className="font-medium text-foreground mb-2">📖 创作背景</h4>
                  <p className="text-sm text-muted-foreground">{selectedAuthor.background}</p>
                </div>
              )}

              {/* 突破点 */}
              {selectedAuthor.breakthrough && (
                <div>
                  <h4 className="font-medium text-foreground mb-2">🚀 突破契机</h4>
                  <p className="text-sm text-muted-foreground">{selectedAuthor.breakthrough}</p>
                </div>
              )}

              {/* 当前状态 */}
              {selectedAuthor.current_status && (
                <div>
                  <h4 className="font-medium text-foreground mb-2">📊 当前状态</h4>
                  <p className="text-sm text-muted-foreground">{selectedAuthor.current_status}</p>
                </div>
              )}

              {/* 图片展示（如果有） */}
              {selectedAuthor.images && Array.isArray(selectedAuthor.images) && selectedAuthor.images.length > 0 && (
                <div>
                  <h4 className="font-medium text-foreground mb-2">📸 配图</h4>
                  <div className={`grid gap-2 ${
                    selectedAuthor.images.length === 1 ? 'grid-cols-1' :
                    selectedAuthor.images.length === 2 ? 'grid-cols-2' :
                    selectedAuthor.images.length === 3 ? 'grid-cols-3' :
                    'grid-cols-3'
                  }`}>
                    {(selectedAuthor.images as string[]).slice(0, 9).map((img: string, idx: number) => (
                      <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-muted">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 收益展示（如果有） */}
              {selectedAuthor.income && (
                <div>
                  <h4 className="font-medium text-foreground mb-2">💰 收益情况</h4>
                  <Badge variant="secondary" className="text-sm">{selectedAuthor.income}</Badge>
                </div>
              )}

              {/* 成就（如果有） */}
              {selectedAuthor.achievement && (
                <div>
                  <h4 className="font-medium text-foreground mb-2">🏆 主要成就</h4>
                  <p className="text-sm text-muted-foreground">{selectedAuthor.achievement}</p>
                </div>
              )}

              {/* 建议 */}
              {selectedAuthor.advice && (
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <h4 className="font-medium text-foreground mb-2">💡 经验分享</h4>
                  <p className="text-sm text-muted-foreground">{selectedAuthor.advice}</p>
                </div>
              )}

              {/* 额外提示（如果有） */}
              {selectedAuthor.tips && (
                <div className="p-4 rounded-lg bg-accent/30 border border-border">
                  <h4 className="font-medium text-foreground mb-2">📌 实用技巧</h4>
                  <p className="text-sm text-muted-foreground">{selectedAuthor.tips}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setSelectedAuthor(null)} className="bg-primary hover:bg-primary/90">
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 发布分享对话框 */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>发布心得分享</DialogTitle>
            <DialogDescription>
              分享你的创作经验和收益故事，帮助更多作者成长
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            {/* 基本信息 */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>发布平台 *</Label>
                <Select value={shareForm.platform} onValueChange={(v) => setShareForm({...shareForm, platform: v})}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="选择平台" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="番茄小说">番茄小说</SelectItem>
                    <SelectItem value="七猫小说">七猫小说</SelectItem>
                    <SelectItem value="起点中文网">起点中文网</SelectItem>
                    <SelectItem value="晋江文学城">晋江文学城</SelectItem>
                    <SelectItem value="Webnovel">Webnovel</SelectItem>
                    <SelectItem value="GoodNovel">GoodNovel</SelectItem>
                    <SelectItem value="Amazon Kindle">Amazon Kindle</SelectItem>
                    <SelectItem value="Dreame">Dreame</SelectItem>
                    <SelectItem value="其他">其他</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>作者头衔 *</Label>
                <Input
                  value={shareForm.title}
                  onChange={(e) => setShareForm({...shareForm, title: e.target.value})}
                  placeholder="如：签约作者、保底作者"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label>收益情况</Label>
              <Input
                value={shareForm.income}
                onChange={(e) => setShareForm({...shareForm, income: e.target.value})}
                placeholder="如：月入6000+、版权收益20万+"
                className="mt-1"
              />
            </div>

            <div>
              <Label>心得故事 *</Label>
              <Textarea
                value={shareForm.story}
                onChange={(e) => setShareForm({...shareForm, story: e.target.value})}
                placeholder="用一句话概括你的创作经历和收获..."
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label>创作背景</Label>
              <Textarea
                value={shareForm.background}
                onChange={(e) => setShareForm({...shareForm, background: e.target.value})}
                placeholder="分享你开始写作前的状态和遇到的困难..."
                className="mt-1"
                rows={2}
              />
            </div>

            <div>
              <Label>突破契机</Label>
              <Textarea
                value={shareForm.breakthrough}
                onChange={(e) => setShareForm({...shareForm, breakthrough: e.target.value})}
                placeholder="是什么让你取得了突破？..."
                className="mt-1"
                rows={2}
              />
            </div>

            <div>
              <Label>当前状态</Label>
              <Textarea
                value={shareForm.currentStatus}
                onChange={(e) => setShareForm({...shareForm, currentStatus: e.target.value})}
                placeholder="描述你现在的创作状态和收入情况..."
                className="mt-1"
                rows={2}
              />
            </div>

            <div>
              <Label>经验分享</Label>
              <Textarea
                value={shareForm.advice}
                onChange={(e) => setShareForm({...shareForm, advice: e.target.value})}
                placeholder="给其他作者的建议和经验..."
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label>实用技巧</Label>
              <Textarea
                value={shareForm.tips}
                onChange={(e) => setShareForm({...shareForm, tips: e.target.value})}
                placeholder="分享一些具体的写作技巧..."
                className="mt-1"
                rows={2}
              />
            </div>

            <div>
              <Label>主要成就</Label>
              <Input
                value={shareForm.achievement}
                onChange={(e) => setShareForm({...shareForm, achievement: e.target.value})}
                placeholder="如：作品已签约影视改编"
                className="mt-1"
              />
            </div>

            {/* 图片上传 */}
            <div>
              <Label>添加图片（可选，最多9张）</Label>
              <div className="mt-2">
                <label className="inline-flex items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                  <div className="text-center">
                    <span className="text-2xl">📷</span>
                    <p className="text-sm text-muted-foreground mt-1">点击上传图片</p>
                    <p className="text-xs text-muted-foreground">支持 JPG、PNG，单张不超过5MB</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadingImages || shareImages.length >= 9}
                  />
                </label>
              </div>

              {/* 已选图片预览 */}
              {shareImages.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-3">
                  {shareImages.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-muted group">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowShareDialog(false)}>
              取消
            </Button>
            <Button
              onClick={handleSubmitShare}
              disabled={submittingShare || !shareForm.platform || !shareForm.title || !shareForm.story}
              className="bg-primary hover:bg-primary/90"
            >
              {submittingShare ? '发布中...' : '发布分享'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
