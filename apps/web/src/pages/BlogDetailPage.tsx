import React from 'react';
import { useParams } from 'react-router-dom';
import { useBlogDetail } from '@/features/blogs/hooks/useBlogs.js';
import { BlogDetail } from '@/features/blogs/components/BlogDetail.js';
import { CommentSection } from '@/features/comments/components/CommentSection.js';
import { Loader2 } from 'lucide-react';

export const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: blog, isLoading, error } = useBlogDetail(slug || '');

  if (isLoading) {
    return (
      <div className="flex justify-center py-40">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-400" />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="text-center py-40 max-w-md mx-auto p-6 glass-panel rounded-xl border border-white/5">
        <p className="text-xl font-bold text-destructive">Error Loading Article</p>
        <p className="text-sm text-muted-foreground mt-2">
          The blog article you are looking for does not exist or you lack permission.
        </p>
      </div>
    );
  }

  return (
    <div className="py-10 px-4 space-y-12">
      <BlogDetail blog={blog} />
      <CommentSection blogId={blog.id} />
    </div>
  );
};
export default BlogDetailPage;
