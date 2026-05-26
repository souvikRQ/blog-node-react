import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createBlogSchema, publishBlogSchema } from '@blog/shared-schemas';
import { Blog, CreateBlogDTO } from '@blog/shared-types';
import { Button } from '@/components/ui/button.js';
import { Input } from '@/components/ui/input.js';
import { Textarea } from '@/components/ui/textarea.js';

interface BlogFormProps {
  initialData?: Blog;
  onSubmit: (data: CreateBlogDTO) => Promise<void>;
  isSubmitting: boolean;
}

export const BlogForm: React.FC<BlogFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [tagsText, setTagsText] = useState(initialData?.tags.join(', ') || '');

  // We default to createBlogSchema (drafts allowed). When user clicks "Publish", we'll run a custom manual triggers/checks.
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<CreateBlogDTO>({
    resolver: zodResolver(createBlogSchema),
    defaultValues: {
      title: initialData?.title || '',
      excerpt: initialData?.excerpt || '',
      content: initialData?.content || '',
      coverImage: initialData?.coverImage || '',
      tags: initialData?.tags || [],
      status: initialData?.status || 'draft',
    },
  });

  const handleFormSubmit = async (data: CreateBlogDTO, publish = false) => {
    try {
      setError(null);
      // Parse comma-separated tags
      const tagsArray = tagsText
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const payload = {
        ...data,
        tags: tagsArray,
        status: (publish ? 'published' : 'draft') as any,
      };

      // If user is trying to publish, run the publish schema validator client side first
      if (publish) {
        const publishValidation = publishBlogSchema.safeParse(payload);
        if (!publishValidation.success) {
          setError(
            publishValidation.error.errors.map((err) => err.message).join('. ')
          );
          return;
        }
      }

      await onSubmit(payload);
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving.');
    }
  };

  return (
    <form className="space-y-6 max-w-2xl mx-auto glass-panel p-6 rounded-xl border border-white/5 bg-black/30">
      {error && (
        <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Title</label>
        <Input
          type="text"
          placeholder="Give your article a title..."
          className="bg-background/50 border-white/10 text-white placeholder:text-muted-foreground/50 focus-visible:ring-indigo-500 font-semibold"
          {...register('title')}
        />
        {errors.title && (
          <span className="text-xs text-destructive">{errors.title.message}</span>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Cover Image URL (Optional)</label>
        <Input
          type="text"
          placeholder="https://example.com/cover.jpg"
          className="bg-background/50 border-white/10 text-white placeholder:text-muted-foreground/50 focus-visible:ring-indigo-500"
          {...register('coverImage')}
        />
        {errors.coverImage && (
          <span className="text-xs text-destructive">{errors.coverImage.message}</span>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Excerpt (Summary)</label>
        <Textarea
          placeholder="Write a brief intro summary..."
          rows={3}
          className="bg-background/50 border-white/10 text-white placeholder:text-muted-foreground/50 focus-visible:ring-indigo-500"
          {...register('excerpt')}
        />
        {errors.excerpt && (
          <span className="text-xs text-destructive">{errors.excerpt.message}</span>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Content (Markdown / HTML)</label>
        <Textarea
          placeholder="Draft the body text of your blog post here..."
          rows={10}
          className="bg-background/50 border-white/10 text-white placeholder:text-muted-foreground/50 focus-visible:ring-indigo-500 font-mono text-sm leading-relaxed"
          {...register('content')}
        />
        {errors.content && (
          <span className="text-xs text-destructive">{errors.content.message}</span>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Tags (Comma separated)</label>
        <Input
          type="text"
          placeholder="tutorial, javascript, react"
          className="bg-background/50 border-white/10 text-white placeholder:text-muted-foreground/50 focus-visible:ring-indigo-500"
          value={tagsText}
          onChange={(e) => setTagsText(e.target.value)}
        />
      </div>

      <div className="flex gap-4 pt-4 border-t border-white/5">
        <Button
          type="button"
          variant="outline"
          className="flex-grow border-white/10 text-white hover:bg-white/5"
          disabled={isSubmitting}
          onClick={handleSubmit((data) => handleFormSubmit(data, false))}
        >
          Save Draft
        </Button>
        <Button
          type="button"
          className="flex-grow bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
          disabled={isSubmitting}
          onClick={handleSubmit((data) => handleFormSubmit(data, true))}
        >
          Publish Post
        </Button>
      </div>
    </form>
  );
};
export default BlogForm;
