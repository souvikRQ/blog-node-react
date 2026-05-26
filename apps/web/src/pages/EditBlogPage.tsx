import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBlogById, useCreateBlogMutation, useUpdateBlogMutation } from '@/features/blogs/hooks/useBlogs.js';
import { BlogForm } from '@/features/blogs/components/BlogForm.js';
import { Loader2 } from 'lucide-react';

export const EditBlogPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const isEditMode = !!id;
  const { data: blog, isLoading } = useBlogById(id || '');

  const createMutation = useCreateBlogMutation();
  const updateMutation = useUpdateBlogMutation();

  const handleSubmit = async (payload: any) => {
    if (isEditMode) {
      await updateMutation.mutateAsync({ id: id!, data: payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
    navigate('/dashboard');
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  if (isEditMode && isLoading) {
    return (
      <div className="flex justify-center py-40">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-400" />
      </div>
    );
  }

  return (
    <div className="py-10 px-4 space-y-6">
      <div className="max-w-2xl mx-auto mb-2 text-center md:text-left">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          {isEditMode ? 'Edit Blog Post' : 'Create Blog Post'}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {isEditMode
            ? 'Make changes to your article and re-save or publish.'
            : 'Draft your ideas and release them to the world.'}
        </p>
      </div>

      <BlogForm
        initialData={blog}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
export default EditBlogPage;
