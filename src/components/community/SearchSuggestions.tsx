import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { supabase, getSupabaseUrl } from '@/supabase/client';
import { Users, BookOpen, HelpCircle, Clock, X, TrendingUp } from 'lucide-react';

interface Suggestion {
  id: string;
  type: string;
  title: string;
  subtitle: string;
  icon: string;
}

interface SearchSuggestionsProps {
  keyword: string;
  onSelect: (suggestion: Suggestion) => void;
  onClose: () => void;
}

const iconMap: Record<string, any> = {
  Users,
  BookOpen,
  HelpCircle,
};

// 热门搜索数据（基于统计）
const hotSearches = [
  { keyword: '番茄小说', count: 1280 },
  { keyword: '爆款技巧', count: 960 },
  { keyword: '新手入门', count: 850 },
  { keyword: '玄幻创作', count: 720 },
  { keyword: '平台投稿', count: 680 },
];

export function SearchSuggestions({ keyword, onSelect, onClose }: SearchSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // 加载搜索历史
  useEffect(() => {
    const history = localStorage.getItem('search_history');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  // 防抖搜索建议
  useEffect(() => {
    if (!keyword || keyword.length < 1) {
      setSuggestions([]);
      return;
    }

    setLoading(true);

    const timer = setTimeout(async () => {
      try {
        const session = (await supabase.auth.getSession()).data.session;
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };
        if (session) {
          headers['Authorization'] = `Bearer ${session.access_token}`;
        }

        const response = await fetch(
          `${getSupabaseUrl()}/functions/v1/search-suggestions?keyword=${encodeURIComponent(keyword)}&limit=8`,
          { headers }
        );

        const data = await response.json();
        if (data.suggestions) {
          setSuggestions(data.suggestions);
        }
      } catch (error) {
        console.error('获取搜索建议失败:', error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [keyword]);

  // 保存搜索历史
  const saveToHistory = (term: string) => {
    const newHistory = [term, ...searchHistory.filter(h => h !== term)].slice(0, 10);
    setSearchHistory(newHistory);
    localStorage.setItem('search_history', JSON.stringify(newHistory));
  };

  // 清除搜索历史
  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('search_history');
  };

  // 处理选择建议
  const handleSelect = (suggestion: Suggestion) => {
    saveToHistory(suggestion.title);
    onSelect(suggestion);
  };

  // 处理选择历史记录
  const handleSelectHistory = (term: string) => {
    saveToHistory(term);
    onSelect({ id: '', type: 'history', title: term, subtitle: '', icon: 'Clock' });
  };

  const hasContent = keyword.length > 0 || searchHistory.length > 0;

  if (!hasContent) return null;

  return (
    <Card className="absolute top-full left-0 right-0 mt-2 shadow-elegant-lg rounded-xl z-50 max-h-96 overflow-hidden animate-scale-in">
      <ScrollArea className="max-h-96">
        <div className="p-4 space-y-4">
          {/* 搜索建议 */}
          {keyword && suggestions.length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-muted-foreground mb-2">搜索建议</h4>
              <div className="space-y-1">
                {suggestions.map((item) => {
                  const Icon = iconMap[item.icon] || Users;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-secondary transition-colors text-left"
                    >
                      <Icon className="w-4 h-4 text-primary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {item.type === 'share' ? '分享' : item.type === 'work' ? '作品' : '问答'}
                      </Badge>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 加载中 */}
          {keyword && loading && (
            <div className="text-center py-4 text-muted-foreground text-sm">搜索中...</div>
          )}

          {/* 无结果 */}
          {keyword && !loading && suggestions.length === 0 && (
            <div className="text-center py-4 text-muted-foreground text-sm">未找到相关结果</div>
          )}

          {/* 热门搜索 */}
          {!keyword && (
            <div>
              <h4 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                热门搜索
              </h4>
              <div className="flex flex-wrap gap-2">
                {hotSearches.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectHistory(item.keyword)}
                    className="px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 text-sm text-foreground transition-colors flex items-center gap-1"
                  >
                    <span>{item.keyword}</span>
                    <span className="text-xs text-muted-foreground">{item.count > 1000 ? `${(item.count / 1000).toFixed(1)}k` : item.count}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 搜索历史 */}
          {searchHistory.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  搜索历史
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearHistory}
                  className="h-6 text-xs text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3 h-3 mr-1" />
                  清空
                </Button>
              </div>
              <div className="space-y-1">
                {searchHistory.slice(0, 5).map((term, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectHistory(term)}
                    className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-secondary transition-colors text-left"
                  >
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-sm text-foreground">{term}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
