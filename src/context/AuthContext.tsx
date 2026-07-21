import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { localDb } from '@/supabase/client';

interface AuthState {
  isActivated: boolean;
  cardCode?: string;
  expireTime?: string;
  remainingDays?: number;
  email?: string | null;
  showEmailBindDialog?: boolean;
}

interface AuthContextType extends AuthState {
  activate: (cardCode: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  setEmail: (email: string) => void;
  setShowEmailBindDialog: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 内置有效的测试激活码
const VALID_ACTIVATION_CODES = [
  'XSGC918388928759',
  'XSGC846821648326',
  'XSGC111122223333',
  'XSGC202620262026',
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const saved = localStorage.getItem('auth_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // 如果之前已经跳过过邮箱绑定，且当前未绑定邮箱，不强制弹窗
        if (parsed?.isActivated && !parsed?.email) {
          const skipped = (() => { try { return sessionStorage.getItem('email_bind_skipped') === '1'; } catch { return false; } })();
          if (skipped) {
            return { ...parsed, showEmailBindDialog: false };
          }
        }
        return parsed;
      } catch {
        return { isActivated: false };
      }
    }
    return { isActivated: false };
  });

  // 保存到localStorage
  useEffect(() => {
    localStorage.setItem('auth_state', JSON.stringify(authState));
  }, [authState]);

  const activate = async (cardCode: string): Promise<{ success: boolean; message: string }> => {
    const code = cardCode.toUpperCase().trim();
    
    // 检查是否是有效的内置码
    if (!VALID_ACTIVATION_CODES.includes(code)) {
      // 检查localDb中的码
      if (!localDb.activation_keys[code]) {
        return { success: false, message: '激活码无效，请检查后重新输入' };
      }
      // 检查是否已使用
      if (localDb.activation_keys[code].is_used) {
        return { success: false, message: '该激活码已被使用' };
      }
    }

    // 激活成功
    const expireDays = 365; // 有效期一年
    const expireTime = new Date();
    expireTime.setDate(expireTime.getDate() + expireDays);

    // 标记为已使用
    localDb.activation_keys[code] = { is_used: true, created_at: new Date().toISOString() };
    localDb.save();

    setAuthState({
      isActivated: true,
      cardCode: code,
      expireTime: expireTime.toISOString(),
      remainingDays: expireDays,
      showEmailBindDialog: true,
    });

    return { success: true, message: '激活成功！' };
  };

  const setEmail = (email: string) => {
    setAuthState(prev => ({ ...prev, email }));
  };

  const setShowEmailBindDialog = (show: boolean) => {
    setAuthState(prev => ({ ...prev, showEmailBindDialog: show }));
    if (!show) {
      try { sessionStorage.setItem('email_bind_skipped', '1'); } catch {}
    }
  };

  const logout = () => {
    setAuthState({ isActivated: false });
    localStorage.removeItem('auth_state');
  };

  return (
    <AuthContext.Provider value={{ ...authState, activate, logout, setEmail, setShowEmailBindDialog }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
