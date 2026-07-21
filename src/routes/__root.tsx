import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  Outlet,
  Navigate,
  createRootRouteWithContext,
  useRouterState,
} from '@tanstack/react-router';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { Sidebar } from '@/components/Sidebar';
import { EmailBindDialog } from '@/components/EmailBindDialog';

function NotFoundComponent() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname === '/') return null;
  return <Navigate to="/" replace />;
}

function ErrorComponent({ error }: { error: Error; reset: () => void }) {
  console.error(error);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname === '/') return null;
  return <Navigate to="/" replace />;
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isActivated } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // 未激活且访问非首页,重定向到首页
  if (!isActivated && pathname !== '/') {
    return <Navigate to="/" replace />;
  }

  // 已激活且访问首页，自动跳到工作台（邮箱绑定是可选的，从设置里补即可）
  if (isActivated && pathname === '/') {
    return <Navigate to="/core" replace />;
  }

  return <>{children}</>;
}

function LayoutWithSidebar() {
  const { isActivated } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // 首页不显示侧边栏
  const showSidebar = isActivated && pathname !== '/';

  return (
    <div className="min-h-screen bg-background">
      {showSidebar && <Sidebar />}
      <main className={showSidebar ? "ml-20" : ""}>
        <Outlet />
      </main>
    </div>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthGuard>
          <LayoutWithSidebar />
          <EmailBindDialog />
        </AuthGuard>
      </AuthProvider>
    </QueryClientProvider>
  );
}
