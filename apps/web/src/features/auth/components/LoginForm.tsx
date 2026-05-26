import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@blog/shared-schemas';
import { LoginRequest } from '@blog/shared-types';
import { useAuth } from '../context/auth-context.js';
import { Button } from '@/components/ui/button.js';
import { Input } from '@/components/ui/input.js';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card.js';
import { useNavigate, Link } from 'react-router-dom';

export const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginRequest) => {
    try {
      setError(null);
      await login(data);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <Card className="w-full max-w-md glass-panel">
      <CardHeader>
        <CardTitle className="text-2xl text-center font-bold tracking-tight bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
          Welcome Back
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

          <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white mt-2" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-muted-foreground border-t border-white/5 pt-4">
        <span>Don't have an account? </span>
        <Link to="/register" className="text-indigo-400 hover:underline ml-1">
          Sign up
        </Link>
      </CardFooter>
    </Card>
  );
};
