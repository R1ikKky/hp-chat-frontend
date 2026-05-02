'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { tokens } from '@/lib/tokens';
import { api } from '@/lib/api';

function AuthHydrator({ children }: { children: React.ReactNode }) {
  const setAuth = useAuthStore((s) => s.setAuth);
  const hydrated = useRef(false);

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;

    const refresh = tokens.getRefresh();
    if (!refresh) return;

    api
      .post<{ accessToken: string; refreshToken: string }>('/auth/refresh', {
        refreshToken: refresh,
      })
      .then((res) => {
        tokens.setAccess(res.data.accessToken);
        tokens.setRefresh(res.data.refreshToken);
        // Decode JWT payload (no signature verify needed on client)
        const payload = JSON.parse(atob(res.data.accessToken.split('.')[1]));
        setAuth({
          userId: payload.userId,
          login: payload.userLogin,
          role: payload.userRole,
        });
      })
      .catch(() => {
        tokens.clear();
      });
  }, [setAuth]);

  return <>{children}</>;
}

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 } },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthHydrator>{children}</AuthHydrator>
    </QueryClientProvider>
  );
}
