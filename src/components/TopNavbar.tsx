import { Link, useRouterState } from '@tanstack/react-router';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, User } from 'lucide-react';

export function TopNavbar() {
  const { isActivated, remainingDays } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (!isActivated) return null;

  const navItems = [
    { path: '/core', label: '核心仿写' },
    { path: '/workflow', label: '自定义工作流' },
    { path: '/profile', label: '个人中心', icon: User },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 左侧品牌区 */}
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-lg font-bold text-foreground">小说仿写工坊 2.0</h1>
              <p className="text-xs text-muted-foreground">AI 智能仿写 · 一键生成原创</p>
            </div>
          </div>

          {/* 中部导航菜单 */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  pathname === item.path
                    ? 'bg-primary/20 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                {item.icon && <item.icon className="w-4 h-4" />}
                {item.label}
              </Link>
            ))}
          </div>

          {/* 右侧状态区 */}
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <span className="text-primary font-medium">已激活</span>
              {remainingDays && (
                <span className="text-muted-foreground ml-2">| 剩余 {remainingDays} 天</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 移动端导航 */}
      <div className="md:hidden border-t border-border">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-1.5 rounded text-xs font-medium ${
                pathname === item.path
                  ? 'bg-primary/20 text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
