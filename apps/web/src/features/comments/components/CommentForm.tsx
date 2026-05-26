import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createCommentSchema } from '@blog/shared-schemas';
import { CreateCommentDTO } from '@blog/shared-types';
import { useAuth } from '@/features/auth/context/auth-context.js';
import { useSubmitCommentMutation } from '../hooks/useComments.js';
import { Button } from '@/components/ui/button.js';
import { Input } from '@/components/ui/input.js';
import { Textarea } from '@/components/ui/textarea.js';

interface CommentFormProps {
  blogId: string;
}

export const CommentForm: React.FC<CommentFormProps> = ({ blogId }) => {
  const { user } = useAuth();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CreateCommentDTO>({
    resolver: zodResolver(createCommentSchema),
    mode: 'onBlur',
    defaultValues: { content: '', guestName: '', guestEmail: '' },
  });

  const submitMutation = useSubmitCommentMutation(blogId, reset);

  const onSubmit = (data: CreateCommentDTO) => {
    // Strip guest fields when user is authenticated
    const payload = user ? { content: data.content } : data;
    submitMutation.mutate(payload);
  };

  // Auto-clear success banner after 3 seconds
  useEffect(() => {
    if (submitMutation.isSuccess) {
      const timer = setTimeout(() => submitMutation.reset(), 3000);
      return () => clearTimeout(timer);
    }
  }, [submitMutation.isSuccess]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-white">Leave a Comment</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 glass-panel p-5 rounded-xl border border-white/5 bg-black/20">
        {submitMutation.isSuccess && (
          <div className="p-3 text-sm text-green-400 bg-green-500/10 rounded-md border border-green-500/20">
            Comment submitted successfully!
          </div>
        )}
        {submitMutation.isError && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
            {(submitMutation.error as any)?.message || 'Failed to submit comment. Please try again.'}
          </div>
        )}

        {!user && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Name</label>
              <Input
                type="text"
                placeholder="John Doe"
                className="bg-background/50 border-white/10 text-white placeholder:text-muted-foreground/50 focus-visible:ring-indigo-500"
                {...register('guestName')}
              />
              {errors.guestName && (
                <span className="text-[10px] text-destructive">{errors.guestName.message}</span>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Email</label>
              <Input
                type="email"
                placeholder="john@example.com"
                className="bg-background/50 border-white/10 text-white placeholder:text-muted-foreground/50 focus-visible:ring-indigo-500"
                {...register('guestEmail')}
              />
              {errors.guestEmail && (
                <span className="text-[10px] text-destructive">{errors.guestEmail.message}</span>
              )}
            </div>
          </div>
        )}

        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Comment</label>
          <Textarea
            placeholder={user ? "Write something meaningful..." : "Share your thoughts publicly..."}
            rows={4}
            className="bg-background/50 border-white/10 text-white placeholder:text-muted-foreground/50 focus-visible:ring-indigo-500"
            {...register('content')}
          />
          {errors.content && (
            <span className="text-[10px] text-destructive">{errors.content.message}</span>
          )}
        </div>

        <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white" disabled={isSubmitting || submitMutation.isPending}>
          {(isSubmitting || submitMutation.isPending) ? 'Posting...' : 'Post Comment'}
        </Button>
      </form>
    </div>
  );
};
export default CommentForm;
