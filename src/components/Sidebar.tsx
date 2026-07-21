import { Link, useRouterState } from '@tanstack/react-router';
import { Sparkles, BookOpen, Users, User, MessageSquare, MoreHorizontal, Plus, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/core', icon: Sparkles, label: '创作' },
  { to: '/workflow', icon: BookOpen, label: '技能' },
  { to: '/deconstruct', icon: FileText, label: '拆书' },
  { to: '/community', icon: Users, label: '社区' },
];

const bottomItems = [
  { to: '/profile', icon: User, label: '我的' },
  { to: '/messages', icon: MessageSquare, label: '消息', badge: true },
  { to: '/more', icon: MoreHorizontal, label: '更多' },
];

export function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="fixed left-0 top-0 h-screen w-20 bg-background border-r border-border flex flex-col items-center py-8 z-50">
      {/* Logo */}
      <div className="mb-12">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-elegant">
          <span className="text-primary-foreground font-bold text-2xl">M</span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 flex flex-col gap-4 w-full px-3">
        {navItems.map((item) => {
          const isActive = pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl transition-all duration-200 cursor-pointer",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <item.icon className={cn("w-6 h-6", isActive && "stroke-[2.5px]")} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="flex flex-col gap-4 w-full px-3 mb-6">
        {bottomItems.map((item) => {
          const isActive = pathname === item.to;
          return (
            <Link
              key={item.label}
              to={item.to}
              className={cn(
                "relative flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl transition-all duration-200 cursor-pointer",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <item.icon className={cn("w-6 h-6", isActive && "stroke-[2.5px]")} />
              <span className="text-xs font-medium">{item.label}</span>
              {item.badge && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
              )}
            </Link>
          );
        })}
      </div>

      {/* New Button */}
      <button className="w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-elegant-lg hover:shadow-elegant hover:-translate-y-0.5 active:scale-95 transition-all duration-200 flex items-center justify-center cursor-pointer">
        <Plus className="w-6 h-6" />
      </button>
    </aside>
  );
}
