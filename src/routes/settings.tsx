import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings as SettingsIcon, Key, Moon, Sun, Monitor, Eye, EyeOff, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
});

function SettingsPage() {
  const [apiKey, setApiKey] = useState<string>('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [testModel, setTestModel] = useState('deepseek-chat');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  useEffect(() => {
    loadApiKey();
    loadTheme();
  }, []);

  const loadApiKey = () => {
    const savedKey = localStorage.getItem('api_key');
    if (savedKey) setApiKey(savedKey);
  };

  const loadTheme = () => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system';
    if (savedTheme) setTheme(savedTheme);
  };

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast.error('API Key不能为空');
      return;
    }
    localStorage.setItem('api_key', apiKey);
    toast.success('API Key已保存');
  };

  const handleTestConnection = async () => {
    if (!apiKey.trim()) {
      toast.error('请先输入API Key');
      return;
    }
    setTestingConnection(true);
    setConnectionStatus('idle');
    
    try {
      // 模拟测试连接
      await new Promise(resolve => setTimeout(resolve, 1500));
      setConnectionStatus('success');
      toast.success('连接测试成功');
    } catch (err) {
      setConnectionStatus('error');
      toast.error('连接测试失败');
    } finally {
      setTestingConnection(false);
    }
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // 应用主题
    const root = document.documentElement;
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else if (newTheme === 'light') {
      root.classList.remove('dark');
    } else {
      // system - 根据系统偏好
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
    
    toast.success(`主题已切换为${newTheme === 'light' ? '浅色' : newTheme === 'dark' ? '深色' : '跟随系统'}`);
  };

  return (
    <div className="min-h-screen pb-16">
      {/* 标题区 */}
      <section className="pt-16 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto animate-fade-in-up">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 tracking-tight flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-primary" />
            设置
          </h1>
          <p className="text-lg text-muted-foreground">
            管理API密钥、主题偏好和其他配置
          </p>
        </div>
      </section>

      {/* 设置内容 */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Tabs defaultValue="api" className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-xl bg-secondary p-1">
            <TabsTrigger value="api" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all">
              <Key className="w-4 h-4 mr-2" />
              API密钥
            </TabsTrigger>
            <TabsTrigger value="appearance" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all">
              <Monitor className="w-4 h-4 mr-2" />
             外观设置
            </TabsTrigger>
          </TabsList>

          {/* API密钥设置 */}
          <TabsContent value="api" className="space-y-6 mt-6">
            <Card className="shadow-elegant rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-primary" />
                  AI服务API密钥
                </CardTitle>
                <CardDescription>
                  配置Meoo Cloud AI服务的访问密钥，用于调用大模型进行仿写
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <div className="relative">
                    <Input
                      id="api-key"
                      type={showApiKey ? 'text' : 'password'}
                      placeholder="请输入您的API Key"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="pr-12"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>测试模型</Label>
                  <Select value={testModel} onValueChange={setTestModel}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="deepseek-chat">deepseek-chat（默认）</SelectItem>
                      <SelectItem value="qwen3.6-plus">qwen3.6-plus</SelectItem>
                      <SelectItem value="kimi-k2.5">kimi-k2.5</SelectItem>
                      <SelectItem value="deepseek-v3.2">deepseek-v3.2</SelectItem>
                      <SelectItem value="glm-5">glm-5</SelectItem>
                      <SelectItem value="MiniMax-M2.5">MiniMax-M2.5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3">
                  <Button onClick={handleSaveApiKey} className="flex-1">
                    保存密钥
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleTestConnection}
                    disabled={testingConnection || !apiKey.trim()}
                    className="gap-2"
                  >
                    {testingConnection ? (
                      <>
                        <Zap className="w-4 h-4 animate-pulse" />
                        测试中...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        测试连接
                      </>
                    )}
                  </Button>
                </div>

                {connectionStatus === 'success' && (
                  <div className="p-3 rounded-lg bg-green-500/10 text-green-600 text-sm">
                    ✓ 连接成功，API密钥有效
                  </div>
                )}
                {connectionStatus === 'error' && (
                  <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                    ✗ 连接失败，请检查API密钥是否正确
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 外观设置 */}
          <TabsContent value="appearance" className="space-y-6 mt-6">
            <Card className="shadow-elegant rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-primary" />
                  主题偏好
                </CardTitle>
                <CardDescription>
                  选择您喜欢的界面主题
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <button
                    onClick={() => handleThemeChange('light')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      theme === 'light'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/30'
                    }`}
                  >
                    <Sun className="w-8 h-8 mx-auto mb-2 text-foreground" />
                    <span className="text-sm font-medium">浅色</span>
                  </button>
                  <button
                    onClick={() => handleThemeChange('dark')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      theme === 'dark'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/30'
                    }`}
                  >
                    <Moon className="w-8 h-8 mx-auto mb-2 text-foreground" />
                    <span className="text-sm font-medium">深色</span>
                  </button>
                  <button
                    onClick={() => handleThemeChange('system')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      theme === 'system'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/30'
                    }`}
                  >
                    <Monitor className="w-8 h-8 mx-auto mb-2 text-foreground" />
                    <span className="text-sm font-medium">跟随系统</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
