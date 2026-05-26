import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '@blog/shared-schemas';
import { RegisterRequest } from '@blog/shared-types';
import { useAuth } from '../context/auth-context.js';
import { Button } from '@/components/ui/button.js';
import { Input } from '@/components/ui/input.js';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card.js';
import { useNavigate, Link } from 'react-router-dom';

export const RegisterForm: React.FC = () => {
  const { register: signup } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterRequest>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterRequest) => {
    try {
      setError(null);
      await signup(data);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Try a different email.');
    }
  };

  return (
    <Card className="w-full max-w-md glass-panel">
      <CardHeader>
        <CardTitle className="text-2xl text-center font-bold tracking-tight bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
          Create Account
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Full Name</label>
            <Input
              type="text"
              placeholder="John Doe"
              className="bg-background/50 border-white/10 text-white placeholder:text-muted-foreground/50"
              {...register('name')}
            />
            {errors.name && (
              <span className="text-xs text-destructive">{errors.name.message}</span>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Email</label>
            <Input
              type="email"
              placeholder="name@example.com"
              className="bg-background/50 border-white/10 text-white placeholder:text-muted-foreground/50"
              {...register('email')}
            />
            {errors.email && (
              <span className="text-xs text-destructive">{errors.email.message}</span>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              className="bg-background/50 border-white/10 text-white placeholder:text-muted-foreground/50"
              {...register('password')}
            />
            {errors.password && (
              <span className="text-xs text-destructive">{errors.password.message}</span>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Confirm Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              className="bg-background/50 border-white/10 text-white placeholder:text-muted-foreground/50"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <span className="text-xs text-destructive">{errors.confirmPassword.message}</span>
            )}
          </div>

          <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white mt-2" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-muted-foreground border-t border-white/5 pt-4">
        <span>Already have an account? </span>
        <Link to="/login" className="text-indigo-400 hover:underline ml-1">
          Sign in
        </Link>
      </CardFooter>
    </Card>
  );
};
