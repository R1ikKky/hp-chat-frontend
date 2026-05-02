'use client';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSignupMutation } from '@/lib/auth-mutations';

const schema = z.object({
  login: z.string().min(2, 'Min 2 characters'),
  phone: z.string().min(10, 'Enter valid phone number'),
  password: z
    .string()
    .min(6, 'Min 6 characters')
    .regex(/\d/, 'Must contain at least one number'),
  age: z.number().int().min(13, 'Must be 13+').max(120, 'Invalid age'),
  bio: z.string().min(1, 'Bio is required'),
});

type FormValues = z.infer<typeof schema>;

export function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const { mutate, isPending, error } = useSignupMutation();

  const onSubmit = (data: FormValues) => mutate(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <Label htmlFor="login">Username</Label>
        <Input
          id="login"
          type="text"
          placeholder="yourname"
          autoComplete="username"
          {...register('login')}
        />
        {errors.login && <p className="mt-1 text-xs text-red-400">{errors.login.message}</p>}
      </div>

      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+79991234567"
          autoComplete="tel"
          {...register('phone')}
        />
        {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone.message}</p>}
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          {...register('password')}
        />
        {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
      </div>

      <div>
        <Label htmlFor="age">Age</Label>
        <Input
          id="age"
          type="number"
          placeholder="25"
          min={13}
          max={120}
          {...register('age', { valueAsNumber: true })}
        />
        {errors.age && <p className="mt-1 text-xs text-red-400">{errors.age.message}</p>}
      </div>

      <div>
        <Label htmlFor="bio">Bio</Label>
        <textarea
          id="bio"
          placeholder="Tell something about yourself..."
          rows={3}
          className="w-full rounded-xl bg-[#111a12] border border-[#1e2e1e] text-[#e2fce4] px-4 py-2.5 text-sm placeholder:text-[#4ade8066] focus:outline-none focus:ring-[1.5px] focus:ring-[#22c55e60] resize-none transition duration-300"
          {...register('bio')}
        />
        {errors.bio && <p className="mt-1 text-xs text-red-400">{errors.bio.message}</p>}
      </div>

      {error && (
        <p className="text-xs text-red-400 text-center">
          {(error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
            'Sign up failed. Try again.'}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="relative w-full h-11 rounded-xl font-semibold text-sm text-[#080d08] bg-[#22c55e] hover:bg-[#16a34a] disabled:opacity-60 transition-colors duration-200 overflow-hidden group mt-1"
      >
        <span className="relative z-10">{isPending ? 'Creating account…' : 'Create account'}</span>
        <span className="absolute inset-0 bg-gradient-to-r from-[#22c55e] to-[#4ade80] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </button>

      <p className="text-center text-sm text-[#86efac]">
        Have an account?{' '}
        <Link href="/login" className="text-[#22c55e] hover:text-[#4ade80] font-medium transition-colors">
          Sign in
        </Link>
      </p>
    </form>
  );
}
