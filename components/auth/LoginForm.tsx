'use client';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLoginMutation } from '@/lib/auth-mutations';

const schema = z.object({
  phone: z.string().min(10, 'Enter valid phone number'),
  password: z.string().min(6, 'Min 6 characters'),
});

type FormValues = z.infer<typeof schema>;

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const { mutate, isPending, error } = useLoginMutation();

  const onSubmit = (data: FormValues) => mutate(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
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
          autoComplete="current-password"
          {...register('password')}
        />
        {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
      </div>

      {error && (
        <p className="text-xs text-red-400 text-center">
          {(error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
            'Login failed. Check credentials.'}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="relative w-full h-11 rounded-xl font-semibold text-sm text-[#080d08] bg-[#22c55e] hover:bg-[#16a34a] disabled:opacity-60 transition-colors duration-200 overflow-hidden group"
      >
        <span className="relative z-10">{isPending ? 'Signing in…' : 'Sign in'}</span>
        <span className="absolute inset-0 bg-gradient-to-r from-[#22c55e] to-[#4ade80] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </button>

      <p className="text-center text-sm text-[#86efac]">
        No account?{' '}
        <Link href="/signup" className="text-[#22c55e] hover:text-[#4ade80] font-medium transition-colors">
          Sign up
        </Link>
      </p>
    </form>
  );
}
