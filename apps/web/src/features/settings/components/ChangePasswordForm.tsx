import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { changePasswordSchema } from '@blog/shared-schemas';
import { ChangePasswordRequest } from '@blog/shared-types';
import { changePassword } from '../api/settings-api.js';
import { Button } from '@/components/ui/button.js';
import { Input } from '@/components/ui/input.js';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card.js';
import { ShieldCheck } from 'lucide-react';

export const ChangePasswordForm: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordRequest>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordRequest) => {
    try {
      setError(null);
      setSuccess(null);
      const result = await changePassword(data);
      setSuccess(result.message);
      reset();
    } catch (err: any) {
      setError(err.message || 'Failed to update password. Please try again.');
    }
  };

  return (
    <Card className="w-full max-w-md glass-panel">
      <CardHeader>
        <CardTitle className="text-2xl text-center font-bold tracking-tight bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
          Change Password
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 text-sm text-green-400 bg-green-500/10 rounded-md border border-green-500/20">
              {success}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Current Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              className="bg-background/50 border-white/10 text-white placeholder:text-muted-foreground/50"
              {...register('currentPassword')}
            />
            {errors.currentPassword && (
              <span className="text-xs text-destructive">{errors.currentPassword.message}</span>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">New Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              className="bg-background/50 border-white/10 text-white placeholder:text-muted-foreground/50"
              {...register('newPassword')}
            />
            {errors.newPassword && (
              <span className="text-xs text-destructive">{errors.newPassword.message}</span>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Confirm New Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              className="bg-background/50 border-white/10 text-white placeholder:text-muted-foreground/50"
              {...register('confirmNewPassword')}
            />
            {errors.confirmNewPassword && (
              <span className="text-xs text-destructive">{errors.confirmNewPassword.message}</span>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white mt-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Updating Password...' : 'Update Password'}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center gap-2 text-sm text-muted-foreground border-t border-white/5 pt-4">
        <ShieldCheck className="w-4 h-4 text-indigo-400 flex-shrink-0" />
        <span>Use a strong password of at least 8 characters.</span>
      </CardFooter>
    </Card>
  );
};
