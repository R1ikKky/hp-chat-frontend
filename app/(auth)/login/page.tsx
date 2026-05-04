import { LoginForm } from '@/components/auth/LoginForm';

export const metadata = { title: 'Sign in — hp-chat' };

function ChatIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" fill="white" fillOpacity="0.9"/>
      <path d="M7 9h10M7 13h6" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

export default function LoginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: 'radial-gradient(ellipse at 50% 40%, #0d1f0d 0%, #071007 55%, #040c04 100%)' }}
    >
      <div className="w-full max-w-[420px]">
        <div className="rounded-2xl border border-[#1a2d1a] bg-[#0a160a] px-8 py-10 flex flex-col items-center gap-6 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-[#22c55e] flex items-center justify-center shadow-lg shadow-[#22c55e20]">
            <ChatIcon />
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#e2fce4] tracking-tight">welcome back</h1>
            <p className="text-sm text-[#4a6e4a] mt-1">sign in to your account</p>
          </div>

          <div className="w-full">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
