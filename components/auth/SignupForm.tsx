'use client';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSignupMutation } from '@/lib/auth-mutations';

const schema = z.object({
  displayName: z.string().min(2, 'Min 2 characters'),
  phone: z.string().regex(/^\+7\d{10}$/, 'Enter valid phone: +7XXXXXXXXXX'),
  password: z
    .string()
    .min(6, 'Min 6 characters')
    .regex(/[0-9]/, 'Must contain at least one number'),
  age: z.number().int().min(1, 'Enter your age').max(120, 'Enter valid age'),
  bio: z.string().optional().default(''),
  terms: z.literal(true, { message: 'You must agree to the terms' }),
});

type FormInput = z.input<typeof schema>;
type FormValues = z.output<typeof schema>;

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  );
}

export function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput, unknown, FormValues>({ resolver: zodResolver(schema) });

  const { mutate, isPending, error } = useSignupMutation();

  const onSubmit = (data: FormValues) =>
    mutate({ login: data.displayName, phone: data.phone, password: data.password, age: data.age, bio: data.bio ?? '' });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {/* Social buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          className="flex items-center justify-center gap-2 h-10 rounded-lg border border-[#1e2e1e] bg-[#0d1410] text-[#e2fce4] text-sm font-medium hover:bg-[#111a12] transition-colors"
        >
          <GoogleIcon />
          Google
        </button>
        <button
          type="button"
          className="flex items-center justify-center gap-2 h-10 rounded-lg border border-[#1e2e1e] bg-[#0d1410] text-[#e2fce4] text-sm font-medium hover:bg-[#111a12] transition-colors"
        >
          <GithubIcon />
          GitHub
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 my-1">
        <div className="flex-1 h-px bg-[#1a2d1a]" />
        <span className="text-xs text-[#3a5a3a] font-mono">or sign up with phone</span>
        <div className="flex-1 h-px bg-[#1a2d1a]" />
      </div>

      {/* Display name */}
      <div>
        <Label htmlFor="displayName">display name</Label>
        <Input id="displayName" type="text" placeholder="how should we call you?" autoComplete="name" {...register('displayName')} />
        {errors.displayName && <p className="mt-1.5 text-xs text-red-400">{errors.displayName.message}</p>}
      </div>

      {/* Phone */}
      <div>
        <Label htmlFor="phone">phone</Label>
        <Input id="phone" type="tel" placeholder="+79001234567" autoComplete="tel" {...register('phone')} />
        {errors.phone && <p className="mt-1.5 text-xs text-red-400">{errors.phone.message}</p>}
      </div>

      {/* Password */}
      <div>
        <Label htmlFor="password">password</Label>
        <Input id="password" type="password" placeholder="min. 6 characters, include a number" autoComplete="new-password" {...register('password')} />
        {errors.password && <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>}
      </div>

      {/* Age */}
      <div>
        <Label htmlFor="age">age</Label>
        <Input id="age" type="number" placeholder="your age" min={1} max={120} {...register('age', { valueAsNumber: true })} />
        {errors.age && <p className="mt-1.5 text-xs text-red-400">{errors.age.message}</p>}
      </div>

      {/* Bio */}
      <div>
        <Label htmlFor="bio">bio <span className="text-[#4a6e4a]">(optional)</span></Label>
        <Input id="bio" type="text" placeholder="a few words about you" {...register('bio')} />
        {errors.bio && <p className="mt-1.5 text-xs text-red-400">{errors.bio.message}</p>}
      </div>

      {/* Terms */}
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

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="flex items-center justify-center gap-2 w-full h-11 rounded-lg bg-[#1a2d1a] hover:bg-[#1e3520] border border-[#2a4a2a] text-[#e2fce4] text-sm font-medium transition-colors disabled:opacity-60 mt-1"
      >
        {isPending ? 'creating account…' : (
          <>create account <span className="text-base">→</span></>
        )}
      </button>

      <p className="text-center text-sm text-[#4a6e4a]">
        already have an account?{' '}
        <Link href="/login" className="text-[#22c55e] hover:text-[#4ade80] transition-colors">
          sign in →
        </Link>
      </p>
    </form>
  );
}
