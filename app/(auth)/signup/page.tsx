import { BackgroundGradient } from '@/components/ui/background-gradient';
import { SparklesBg } from '@/components/ui/sparkles-bg';
import { SignupForm } from '@/components/auth/SignupForm';

export const metadata = { title: 'Create account — hp-chat' };

export default function SignupPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-chat-bg px-4 py-12">
      <SparklesBg particleColor="#22c55e" particleCount={60} />

      {/* Glow orbs */}
      <div className="absolute top-1/4 right-1/3 w-72 h-72 bg-[#22c55e]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-56 h-56 bg-[#16a34a]/8 rounded-full blur-3xl pointer-events-none" />

      <BackgroundGradient
        containerClassName="w-full max-w-md"
        className="rounded-2xl bg-chat-card px-8 py-10"
      >
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-chat-accent" />
            <span className="text-xs font-medium text-chat-muted tracking-widest uppercase">
              hp-chat
            </span>
          </div>
          <h1 className="text-2xl font-bold text-chat-text">Create account</h1>
          <p className="text-sm text-chat-subtext mt-1">Join and start chatting</p>
        </div>

        <SignupForm />
      </BackgroundGradient>
    </div>
  );
}
