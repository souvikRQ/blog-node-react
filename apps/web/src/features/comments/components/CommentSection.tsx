import React from 'react';
import { useBlogComments } from '../hooks/useComments.js';
import { CommentForm } from './CommentForm.js';
import { useAuth } from '@/features/auth/context/auth-context.js';
import { User } from '@blog/shared-types';
import { Loader2, MessageSquare } from 'lucide-react';

interface CommentSectionProps {
  blogId: string;
  blogAuthor?: string | User;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ blogId, blogAuthor }) => {
  const { data: comments, isLoading } = useBlogComments(blogId);
  const { user: currentUser } = useAuth();

  // Helper function to get author ID safely
  const getAuthorId = (author: string | User | undefined): string | undefined => {
    if (typeof author === 'object' && author) {
      return author.id;
    }
    return typeof author === 'string' ? author : undefined;
  };

  const blogAuthorId = getAuthorId(blogAuthor);
  const currentUserId = currentUser?.id;

  return (
    <div className="space-y-8 border-t border-white/5 pt-8 max-w-3xl mx-auto">
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-indigo-400" />
          Comments ({comments?.length || 0})
        </h2>

        {isLoading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
          </div>
        ) : !comments || comments.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground bg-white/5 border border-white/5 rounded-xl">
            No comments yet. Be the first to share your thoughts!
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => {
              const commenterName =
                typeof comment.author === 'object'
                  ? comment.author.name
                  : comment.guestName || 'Anonymous';

              // Resolve the commenter's user ID (null for guests)
              const commentAuthorId =
                typeof comment.author === 'object' ? comment.author.id : undefined;

              // Role flags
              const isCurrentUser = !!currentUserId && commentAuthorId === currentUserId;
              const isBlogAuthor  = !!blogAuthorId  && commentAuthorId === blogAuthorId;

              // --- Dynamic style tokens ---
              const avatarClass = isCurrentUser
                ? 'bg-indigo-500/30 border-indigo-400/60 text-indigo-200'
                : isBlogAuthor
                ? 'bg-amber-500/20 border-amber-400/40 text-amber-300'
                : 'bg-white/5 border-white/10 text-slate-400';

              const nameClass = isCurrentUser
                ? 'text-indigo-300 font-bold'
                : isBlogAuthor
                ? 'text-amber-300 font-bold'
                : 'text-white font-semibold';

              const cardClass = isCurrentUser
                ? 'glass-panel p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 flex gap-3 items-start'
                : isBlogAuthor
                ? 'glass-panel p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 flex gap-3 items-start'
                : 'glass-panel p-4 rounded-xl border border-white/5 bg-black/10 flex gap-3 items-start';

              const date = new Date(comment.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <div key={comment.id} className={cardClass}>
                  <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs uppercase flex-shrink-0 ${avatarClass}`}>
                    {commenterName.charAt(0)}
                  </div>

                  <div className="space-y-1 flex-grow">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-sm ${nameClass}`}>
                        {commenterName}
                      </span>

                      {/* "You" badge — logged-in user's own comment */}
                      {isCurrentUser && (
                        <span className="text-[9px] uppercase font-bold tracking-wider text-indigo-300 bg-indigo-500/15 border border-indigo-400/30 px-1.5 py-0.5 rounded-md">
                          You
                        </span>
                      )}

                      {/* "Author" badge — comment written by the blog's author */}
                      {isBlogAuthor && (
                        <span className="text-[9px] uppercase font-bold tracking-wider text-amber-300 bg-amber-500/15 border border-amber-400/30 px-1.5 py-0.5 rounded-md">
                          Author
                        </span>
                      )}

                      <span className="text-[10px] text-muted-foreground">
                        {date}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <CommentForm blogId={blogId} />
    </div>
  );
};
export default CommentSection;
