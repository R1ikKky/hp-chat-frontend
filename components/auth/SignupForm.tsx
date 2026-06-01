'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSendOtpMutation, useVerifyOtpMutation, useSignupMutation } from '@/lib/auth-mutations';

// ── Step schemas ────────────────────────────────────────────────
const phoneSchema = z.object({
  phone: z.string().regex(/^\+7\d{10}$/, 'Enter valid phone: +7XXXXXXXXXX'),
});

const otpSchema = z.object({
  code: z.string().length(6, 'Code must be 6 digits'),
});

const detailsSchema = z.object({
  displayName: z.string().min(2, 'Min 2 characters'),
  password: z
    .string()
    .min(6, 'Min 6 characters')
    .regex(/[0-9]/, 'Must contain at least one number'),
  age: z.number().int().min(1, 'Enter your age').max(120, 'Enter valid age'),
  bio: z.string().optional().default(''),
  terms: z.literal(true, { message: 'You must agree to the terms' }),
});

type PhoneValues = z.infer<typeof phoneSchema>;
type OtpValues = z.infer<typeof otpSchema>;
type DetailsInput = z.input<typeof detailsSchema>;
type DetailsValues = z.output<typeof detailsSchema>;

// ── Step 1: phone ───────────────────────────────────────────────
function StepPhone({ onNext }: { onNext: (phone: string) => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<PhoneValues>({
    resolver: zodResolver(phoneSchema),
  });
  const { mutate, isPending, error } = useSendOtpMutation();

  const onSubmit = (d: PhoneValues) =>
    mutate(d.phone, { onSuccess: () => onNext(d.phone) });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <Label htmlFor="phone">phone number</Label>
        <Input id="phone" type="tel" placeholder="+79001234567" autoComplete="tel" {...register('phone')} />
        {errors.phone && <p className="mt-1.5 text-xs text-red-400">{errors.phone.message}</p>}
      </div>
      {error && (
        <p className="text-xs text-red-400 text-center">
          {(error as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Failed to send OTP.'}
        </p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="flex items-center justify-center gap-2 w-full h-11 rounded-lg bg-[#1a2d1a] hover:bg-[#1e3520] border border-[#2a4a2a] text-[#e2fce4] text-sm font-medium transition-colors disabled:opacity-60"
      >
        {isPending ? 'sending…' : <>send code <span className="text-base">→</span></>}
      </button>
      <p className="text-center text-sm text-[#4a6e4a]">
        already have an account?{' '}
        <Link href="/login" className="text-[#22c55e] hover:text-[#4ade80] transition-colors">sign in →</Link>
      </p>
    </form>
  );
}

// ── Step 2: OTP ─────────────────────────────────────────────────
function StepOtp({ phone, onNext, onBack }: { phone: string; onNext: () => void; onBack: () => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<OtpValues>({
    resolver: zodResolver(otpSchema),
  });
  const { mutate, isPending, error } = useVerifyOtpMutation();

  const onSubmit = (d: OtpValues) =>
    mutate({ phone, code: d.code }, {
      onSuccess: (verified) => {
        if (verified) onNext();
      },
      onError: () => {},
    });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <p className="text-xs text-[#4a6e4a] text-center">code sent to <span className="text-[#22c55e]">{phone}</span></p>
      <div>
        <Label htmlFor="code">verification code</Label>
        <Input
          id="code"
          type="text"
          inputMode="numeric"
          maxLength={6}
          placeholder="123456"
          autoComplete="one-time-code"
          {...register('code')}
        />
        {errors.code && <p className="mt-1.5 text-xs text-red-400">{errors.code.message}</p>}
      </div>
      {error && (
        <p className="text-xs text-red-400 text-center">
          {(error as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Verification failed.'}
        </p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="flex items-center justify-center gap-2 w-full h-11 rounded-lg bg-[#1a2d1a] hover:bg-[#1e3520] border border-[#2a4a2a] text-[#e2fce4] text-sm font-medium transition-colors disabled:opacity-60"
      >
        {isPending ? 'verifying…' : <>verify <span className="text-base">→</span></>}
      </button>
      <button type="button" onClick={onBack} className="text-xs text-[#4a6e4a] hover:text-[#e2fce4] transition-colors">
        ← change number
      </button>
    </form>
  );
}

// ── Step 3: details ─────────────────────────────────────────────
function StepDetails({ phone }: { phone: string }) {
  const { register, handleSubmit, formState: { errors } } =
    useForm<DetailsInput, unknown, DetailsValues>({ resolver: zodResolver(detailsSchema) });
  const { mutate, isPending, error } = useSignupMutation();

  const onSubmit = (data: DetailsValues) =>
    mutate({ login: data.displayName, phone, password: data.password, age: data.age, bio: data.bio ?? '' });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <Label htmlFor="displayName">display name</Label>
        <Input id="displayName" type="text" placeholder="how should we call you?" autoComplete="name" {...register('displayName')} />
        {errors.displayName && <p className="mt-1.5 text-xs text-red-400">{errors.displayName.message}</p>}
      </div>
      <div>
        <Label htmlFor="password">password</Label>
        <Input id="password" type="password" placeholder="min. 6 characters, include a number" autoComplete="new-password" {...register('password')} />
        {errors.password && <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>}
      </div>
      <div>
        <Label htmlFor="age">age</Label>
        <Input id="age" type="number" placeholder="your age" min={1} max={120} {...register('age', { valueAsNumber: true })} />
        {errors.age && <p className="mt-1.5 text-xs text-red-400">{errors.age.message}</p>}
      </div>
      <div>
        <Label htmlFor="bio">bio <span className="text-[#4a6e4a]">(optional)</span></Label>
        <Input id="bio" type="text" placeholder="a few words about you" {...register('bio')} />
      </div>
      <label className="flex items-start gap-2.5 cursor-pointer">
        <input
          type="checkbox"
          {...register('terms')}
          className="mt-0.5 w-4 h-4 rounded border border-[#1e2e1e] bg-[#0d1410] accent-[#22c55e] cursor-pointer shrink-0"
        />
        <span className="text-sm text-[#6b9e6b]">
          i agree to the{' '}
          <Link href="/terms" className="text-[#22c55e] hover:text-[#4ade80] transition-colors">terms of service</Link>
          {' '}and{' '}
          <Link href="/privacy" className="text-[#22c55e] hover:text-[#4ade80] transition-colors">privacy policy</Link>
        </span>
      </label>
      {errors.terms && <p className="-mt-2 text-xs text-red-400">{errors.terms.message}</p>}
      {error && (
        <p className="text-xs text-red-400 text-center">
          {(error as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Sign up failed. Try again.'}
        </p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="flex items-center justify-center gap-2 w-full h-11 rounded-lg bg-[#1a2d1a] hover:bg-[#1e3520] border border-[#2a4a2a] text-[#e2fce4] text-sm font-medium transition-colors disabled:opacity-60 mt-1"
      >
        {isPending ? 'creating account…' : <>create account <span className="text-base">→</span></>}
      </button>
    </form>
  );
}

// ── Step indicator ───────────────────────────────────────────────
function Steps({ current }: { current: 1 | 2 | 3 }) {
  return (
    <div className="flex items-center gap-2 justify-center">
      {([1, 2, 3] as const).map((n) => (
        <div
          key={n}
          className={`h-1 rounded-full transition-all ${
            n === current ? 'w-6 bg-[#22c55e]' : n < current ? 'w-3 bg-[#2a4a2a]' : 'w-3 bg-[#1a2d1a]'
          }`}
        />
      ))}
    </div>
  );
}

// ── Root ─────────────────────────────────────────────────────────
export function SignupForm() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [phone, setPhone] = useState('');

  return (
    <div className="flex flex-col gap-5">
      <Steps current={step} />
      {step === 1 && (
        <StepPhone onNext={(p) => { setPhone(p); setStep(2); }} />
      )}
      {step === 2 && (
        <StepOtp phone={phone} onNext={() => setStep(3)} onBack={() => setStep(1)} />
      )}
      {step === 3 && (
        <StepDetails phone={phone} />
      )}
    </div>
  );
}
