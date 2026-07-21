import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Edit, Trash2, Eye, EyeOff, Plus } from 'lucide-react';
import { supabase } from '@/supabase/client';
import { toast } from 'sonner';

interface Template {
  id: string;
  name: string;
  description: string | null;
  template_config: any;
  is_public: boolean;
  created_by: string | null;
  usage_count: number;
  score: number;
  scenario: string | null;
  created_at: string;
  updated_at: string;
}

export function TemplateManager() {
  const [myTemplates, setMyTemplates] = useState<Template[]>([]);
  const [publicTemplates, setPublicTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    scenario: 'general',
    template_config: {},
  });

  // 加载模板数据
  useEffect(() => {
    loadTemplates();
  }, []);

  // 生成预设公开模板
  const generatePresetTemplates = () => {
    const scenarios = [
      { name: '番茄爆款仿写', scenario: 'tomato', desc: '适配番茄小说快节奏爽文风格' },
      { name: '七猫保底仿写', scenario: 'qimao', desc: '符合七猫千字20元保底标准' },
      { name: '起点IP孵化', scenario: 'qidian', desc: '注重世界观和人物深度' },
      { name: '晋江言情', scenario: 'jinjiang', desc: '情感细腻，人设鲜明' },
      { name: '纵横玄幻', scenario: 'zongheng', desc: '宏大世界观，热血战斗' },
      { name: '盐言短篇', scenario: 'yan', desc: '知乎风短篇故事' },
      { name: '飞卢同人', scenario: 'feilu', desc: '同人创作，脑洞大开' },
      { name: '潇湘古言', scenario: 'xiaoxiang', desc: '古风言情，文笔优美' },
      { name: '红袖添香', scenario: 'hongxiu', desc: '女性向甜宠文' },
      { name: '创世男频', scenario: 'chuangshi', desc: '腾讯系男频爽文' },
    ];

    const styles = [
      { type: 'balanced', label: '均衡复刻' },
      { type: 'framework', label: '纯框架' },
      { type: 'innovation', label: '深度创新' },
      { type: 'deduplication', label: '降重改写' },
      { type: 'expansion', label: '扩写润色' },
      { type: 'compression', label: '精简压缩' },
    ];

    const models = ['deepseek-chat', 'qwen3.6-plus', 'qwen3-max', 'kimi-k2.5', 'deepseek-v3.2', 'glm-5', 'MiniMax-M2.5'];

    const templates: Template[] = [];
    let id = 1;

    // 为每个场景生成6种风格的模板
    scenarios.forEach((s) => {
      styles.forEach((style, idx) => {
        const model = models[(id - 1) % models.length];
        templates.push({
          id: `preset-${id}`,
          name: `${s.name}-${style.label}模板`,
          description: `${s.desc}，采用${style.label}策略，使用${model}模型`,
          template_config: {
            model: model,
            writeMode: style.type === 'balanced' ? 'comprehensive' : style.type === 'framework' ? 'plot' : 'comprehensive',
            contentRetention: style.type === 'deduplication' ? 40 : style.type === 'expansion' ? 90 : 70,
            aiCreativity: style.type === 'innovation' ? 80 : style.type === 'deduplication' ? 30 : 60,
            scenario: s.scenario,
            styleType: style.type,
          },
          is_public: true,
          created_by: null,
          usage_count: Math.floor(Math.random() * 500) + 50,
          score: Math.floor(Math.random() * 20) + 80,
          scenario: s.scenario,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        id++;
      });
    });

    return templates;
  };

  const loadTemplates = async () => {
    try {
      setLoading(true);

      // 加载公开模板
      const { data: publicData, error: publicError } = await supabase
        .from('templates')
        .select('*')
        .eq('is_public', true)
        .order('usage_count', { ascending: false })
        .limit(100);

      if (publicError) throw publicError;

      // 如果数据库中没有足够多的模板，使用预设模板
      let finalPublicTemplates: Template[] = (publicData as Template[]) || [];
      if (finalPublicTemplates.length < 50) {
        const presets = generatePresetTemplates();
        finalPublicTemplates = [...presets, ...finalPublicTemplates].slice(0, 60);
      }

      setPublicTemplates(finalPublicTemplates);

      // 注意：由于当前无用户认证，暂时无法加载"我的模板"
      // 后续接入认证后可实现
      setMyTemplates([]);
    } catch (error) {
      console.error('加载模板失败:', error);
      toast.error('加载模板失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个模板吗？')) return;

    try {
      const { error } = await supabase
        .from('templates')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('删除成功');
      loadTemplates();
    } catch (error) {
      console.error('删除失败:', error);
      toast.error('删除失败');
    }
  };

  const handleTogglePublic = async (template: Template) => {
    try {
      const { error } = await supabase
        .from('templates')
        .update({ is_public: !template.is_public })
        .eq('id', template.id);

      if (error) throw error;
      
      toast.success(template.is_public ? '已设为私有' : '已公开');
      loadTemplates();
    } catch (error) {
      console.error('操作失败:', error);
      toast.error('操作失败');
    }
  };

  const handleUseTemplate = async (template: Template) => {
    try {
      // 增加使用次数
      const { error } = await supabase
        .from('templates')
        .update({ usage_count: template.usage_count + 1 })
        .eq('id', template.id);

      if (error) throw error;

      // 将模板配置保存到localStorage，供core页面读取
      localStorage.setItem('applied_template', JSON.stringify({
        ...template.template_config,
        templateName: template.name,
        appliedAt: new Date().toISOString(),
      }));

      toast.success(`模板"${template.name}"已套用，前往核心仿写页生效`);
      loadTemplates();
    } catch (error) {
      console.error('套用失败:', error);
      toast.error('套用失败');
    }
  };

  const handleCreateTemplate = () => {
    setEditingTemplate(null);
    setFormData({ name: '', description: '', scenario: 'general', template_config: {} });
    setDialogOpen(true);
  };

  const handleEditTemplate = (template: Template) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      description: template.description || '',
      scenario: template.scenario || 'general',
      template_config: template.template_config || {},
    });
    setDialogOpen(true);
  };

  const handleSaveTemplate = async () => {
    if (!formData.name.trim()) {
      toast.error('请输入模板名称');
      return;
    }

    try {
      if (editingTemplate) {
        // 编辑模式
        const { error } = await supabase
          .from('templates')
          .update({
            name: formData.name,
            description: formData.description,
            scenario: formData.scenario,
            template_config: formData.template_config,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingTemplate.id);

        if (error) throw error;
        toast.success('模板已更新');
      } else {
        // 创建模式
        const { error } = await supabase.from('templates').insert({
          name: formData.name,
          description: formData.description,
          scenario: formData.scenario,
          template_config: formData.template_config,
          is_public: false,
          usage_count: 0,
          score: 0,
        });

        if (error) throw error;
        toast.success('模板已创建');
      }

      setDialogOpen(false);
      loadTemplates();
    } catch (error) {
      console.error('保存失败:', error);
      toast.error('保存失败');
    }
  };

  if (loading) {
    return (
      <section className="bg-card rounded-2xl p-6 border border-border mt-6">
        <h2 className="text-xl font-bold text-foreground mb-4">模板管理</h2>
        <p className="text-center text-muted-foreground py-8">加载中...</p>
      </section>
    );
  }

  return (
    <section className="bg-card rounded-2xl p-6 border border-border mt-6">
      <h2 className="text-xl font-bold text-foreground mb-4">模板管理</h2>

      <Tabs defaultValue="public" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my">我的模板</TabsTrigger>
          <TabsTrigger value="public">公开模板</TabsTrigger>
        </TabsList>

        {/* 我的模板 */}
        <TabsContent value="my" className="pt-4">
          <div className="space-y-3">
            {myTemplates.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>暂无个人模板</p>
                <p className="text-sm mt-2">请先登录并创建模板</p>
              </div>
            ) : (
              myTemplates.map((template) => (
                <Card key={template.id} className="border-border">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      <Badge variant={template.is_public ? 'default' : 'secondary'}>
                        {template.is_public ? '公开' : '私有'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                      <span>适用场景：{template.scenario || '未设置'}</span>
                      <span>评分：{template.score}分</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="text-foreground" onClick={() => handleEditTemplate(template)}>
                        <Edit className="w-4 h-4 mr-1" />
                        编辑
                      </Button>
                      <Button size="sm" variant="outline" className="text-foreground">
                        <Copy className="w-4 h-4 mr-1" />
                        复刻
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-foreground"
                        onClick={() => handleTogglePublic(template)}
                      >
                        {template.is_public ? (
                          <>
                            <EyeOff className="w-4 h-4 mr-1" />
                            私有
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 mr-1" />
                            公开
                          </>
                        )}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDelete(template.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        删除
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}

            <Button 
              className="w-full border-dashed border-2 border-border text-foreground hover:text-foreground hover:border-primary/50" 
              variant="outline"
              onClick={handleCreateTemplate}
            >
              <Plus className="w-4 h-4 mr-2" />
              新建模板
            </Button>
          </div>
        </TabsContent>

        {/* 公开模板 */}
        <TabsContent value="public" className="pt-4">
          <div className="space-y-3">
            {publicTemplates.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>暂无公开模板</p>
              </div>
            ) : (
              publicTemplates.map((template) => (
                <Card key={template.id} className="border-border">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      <Badge>公开</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                      <span>适用场景：{template.scenario || '全网通用'}</span>
                      <span>使用次数：{template.usage_count}</span>
                      <span>评分：{template.score}分</span>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="bg-primary hover:bg-primary/90"
                        onClick={() => handleUseTemplate(template)}
                      >
                        一键套用
                      </Button>
                      <Button size="sm" variant="outline" className="text-foreground">
                        <Copy className="w-4 h-4 mr-1" />
                        另存为
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* 创建/编辑模板对话框 */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingTemplate ? '编辑模板' : '新建模板'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>模板名称</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="如：通用精品小说仿写模板"
                className="mt-1"
              />
            </div>
            <div>
              <Label>描述</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="简要描述模板用途和特点"
                className="mt-1"
              />
            </div>
            <div>
              <Label>适用场景</Label>
              <Select
                value={formData.scenario}
                onValueChange={(v) => setFormData({ ...formData, scenario: v })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">全网通用网文</SelectItem>
                  <SelectItem value="urban">都市小说</SelectItem>
                  <SelectItem value="fantasy">玄幻小说</SelectItem>
                  <SelectItem value="ancient">古言小说</SelectItem>
                  <SelectItem value="short">短篇爽文</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>取消</Button>
            <Button onClick={handleSaveTemplate} className="bg-primary hover:bg-primary/90">
              {editingTemplate ? '保存修改' : '创建模板'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
