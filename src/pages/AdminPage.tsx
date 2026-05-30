import { useCallback, useState } from 'react';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import {
  ADMIN_PASSWORD,
  DEMO_ADMIN_PASSWORD,
  IS_DEMO_PASSWORD,
} from '@/services/config';

const STORAGE_KEY = 'obninsk70_admin_session';

function readSession(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function AdminPage() {
  const [authorized, setAuthorized] = useState<boolean>(readSession);

  const handleLogin = useCallback((password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      try {
        sessionStorage.setItem(STORAGE_KEY, 'true');
      } catch {
        /* sessionStorage может быть недоступен — авторизуем на сессию в памяти */
      }
      setAuthorized(true);
      return true;
    }
    return false;
  }, []);

  const handleLogout = useCallback(() => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setAuthorized(false);
  }, []);

  if (!authorized) {
    return (
      <AdminLogin
        onSubmit={handleLogin}
        demoPassword={IS_DEMO_PASSWORD ? DEMO_ADMIN_PASSWORD : null}
      />
    );
  }

  return <AdminDashboard onLogout={handleLogout} />;
}
