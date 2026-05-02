'use client';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { api } from './api';
import { tokens } from './tokens';
import { useAuthStore } from '@/store/auth.store';

interface LoginPayload {
  phone: string;
  password: string;
}

interface SignupPayload {
  login: string;
  phone: string;
  password: string;
  age: number;
  bio: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
}

interface SignupResponse {
  user: { id: string; login: string; phone: string; role: string };
  tokens: { accessToken: string; refreshToken: string };
}

function decodePayload(token: string) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return {};
  }
}

export function useLoginMutation() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginPayload) =>
      api.post<LoginResponse>('/auth/login', data).then((r) => r.data),
    onSuccess: (data) => {
      tokens.setAccess(data.accessToken);
      tokens.setRefresh(data.refreshToken);
      const payload = decodePayload(data.accessToken);
      setAuth({
        userId: data.userId,
        login: payload.userLogin ?? '',
        role: payload.userRole ?? '',
      });
      router.push('/chat');
    },
  });
}

export function useSignupMutation() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const router = useRouter();

  return useMutation({
    mutationFn: (data: SignupPayload) =>
      api.post<SignupResponse>('/auth/signup', data).then((r) => r.data),
    onSuccess: (data) => {
      tokens.setAccess(data.tokens.accessToken);
      tokens.setRefresh(data.tokens.refreshToken);
      const payload = decodePayload(data.tokens.accessToken);
      setAuth({
        userId: data.user.id,
        login: data.user.login,
        role: payload.userRole ?? data.user.role,
      });
      router.push('/chat');
    },
  });
}

export function useLogoutMutation() {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const router = useRouter();

  return useMutation({
    mutationFn: () => {
      const refreshToken = tokens.getRefresh();
      return api.post('/auth/logout', { refreshToken }).then((r) => r.data);
    },
    onSettled: () => {
      tokens.clear();
      clearAuth();
      router.push('/login');
    },
  });
}
