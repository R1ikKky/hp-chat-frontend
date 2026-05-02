'use client';
import { useLogoutMutation } from '@/lib/auth-mutations';
import { useAuthStore } from '@/store/auth.store';

export default function ChatPage() {
  const login = useAuthStore((s) => s.login);
  const { mutate: logout, isPending } = useLogoutMutation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-chat-bg">
      <div className="text-center">
        <div className="w-3 h-3 rounded-full bg-chat-accent mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-chat-text mb-2">hp-chat</h1>
        <p className="text-chat-subtext mb-8">
          {login ? `Signed in as ${login}` : 'Chat coming soon'}
        </p>
        <button
          onClick={() => logout()}
          disabled={isPending}
          className="px-6 py-2.5 rounded-xl bg-chat-card border border-chat-border text-chat-muted hover:border-chat-accent hover:text-chat-accent transition-colors text-sm font-medium disabled:opacity-60"
        >
          {isPending ? 'Signing out…' : 'Sign out'}
        </button>
      </div>
    </div>
  );
}
