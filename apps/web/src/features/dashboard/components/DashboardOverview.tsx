import React from 'react';
import { useMyBlogs, useDeleteBlogMutation } from '@/features/blogs/hooks/useBlogs.js';
import { useMyComments, useUpdateCommentStatusMutation, useDeleteCommentMutation } from '@/features/comments/hooks/useComments.js';
import { Button } from '@/components/ui/button.js';
import { Link } from 'react-router-dom';
import { Loader2, Plus, Edit, Trash2, ShieldOff, Check } from 'lucide-react';

export const DashboardOverview: React.FC = () => {
  const { data: blogsData, isLoading: blogsLoading } = useMyBlogs();
  const { data: commentsData, isLoading: commentsLoading } = useMyComments();
  const deleteBlogMutation = useDeleteBlogMutation();
  const updateCommentMutation = useUpdateCommentStatusMutation();
  const deleteCommentMutation = useDeleteCommentMutation();

  const handleDeleteBlog = async (id: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      await deleteBlogMutation.mutateAsync(id);
    }
  };

  const handleToggleComment = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'approved' ? 'hidden' : 'approved';
    await updateCommentMutation.mutateAsync({ id, status: nextStatus });
  };

  const handleDeleteComment = async (id: string) => {
    if (confirm('Are you sure you want to delete this comment permanently?')) {
      await deleteCommentMutation.mutateAsync(id);
    }
  };

  return (
    <div className="space-y-12">
      {/* Blogs section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white tracking-tight">Your Blog Posts</h2>
          <Link to="/create-blog">
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1">
              <Plus className="w-4 h-4" />
              Write Post
            </Button>
          </Link>
        </div>

        {blogsLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
          </div>
        ) : !blogsData || blogsData.blogs.length === 0 ? (
          <div className="text-center py-12 text-sm text-muted-foreground bg-white/5 border border-white/5 rounded-xl">
            You haven't written any posts yet. Click 'Write Post' to start!
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/5 bg-black/20 backdrop-blur-md">
            <table className="w-full text-left border-collapse text-sm text-muted-foreground">
              <thead>
                <tr className="border-b border-white/5 bg-white/5 text-xs font-semibold uppercase tracking-wider text-white">
                  <th className="p-4">Title</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Created At</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {blogsData.blogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-medium text-white max-w-xs truncate">
                      <Link to={`/blog/${blog.slug}`} className="hover:underline hover:text-indigo-400">
                        {blog.title}
                      </Link>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          blog.status === 'published'
                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                            : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                        }`}
                      >
                        {blog.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right flex justify-end gap-2">
                      <Link to={`/edit-blog/${blog.id}`}>
                        <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-white/5 text-white">
                          <Edit className="w-4 h-4 text-indigo-400" />
                        </Button>
                      </Link>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 hover:bg-white/5 text-white"
                        onClick={() => handleDeleteBlog(blog.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Comments management section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white tracking-tight">Manage Thread Comments</h2>

        {commentsLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
          </div>
        ) : !commentsData || commentsData.length === 0 ? (
          <div className="text-center py-12 text-sm text-muted-foreground bg-white/5 border border-white/5 rounded-xl">
            No comments found on any of your blog posts.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/5 bg-black/20 backdrop-blur-md">
            <table className="w-full text-left border-collapse text-sm text-muted-foreground">
              <thead>
                <tr className="border-b border-white/5 bg-white/5 text-xs font-semibold uppercase tracking-wider text-white">
                  <th className="p-4">Commenter</th>
                  <th className="p-4">Post</th>
                  <th className="p-4">Content</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {commentsData.map((comment) => {
                  const commenterName =
                    typeof comment.author === 'object'
                      ? comment.author.name
                      : comment.guestName || 'Anonymous';
                  const postTitle =
                    typeof comment.blog === 'object'
                      ? (comment.blog as any).title
                      : 'Unknown Post';

                  return (
                    <tr key={comment.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-semibold text-white truncate max-w-[120px]">
                        {commenterName}
                      </td>
                      <td className="p-4 truncate max-w-[150px]">{postTitle}</td>
                      <td className="p-4 max-w-xs truncate">{comment.content}</td>
                      <td className="p-4">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            comment.status === 'approved'
                              ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                              : 'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}
                        >
                          {comment.status}
                        </span>
                      </td>
                      <td className="p-4 text-right flex justify-end gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 hover:bg-white/5 text-white"
                          onClick={() => handleToggleComment(comment.id, comment.status)}
                          title={comment.status === 'approved' ? 'Hide comment' : 'Approve comment'}
                        >
                          {comment.status === 'approved' ? (
                            <ShieldOff className="w-4 h-4 text-yellow-400" />
                          ) : (
                            <Check className="w-4 h-4 text-green-400" />
                          )}
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 hover:bg-white/5 text-white"
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
export default DashboardOverview;
