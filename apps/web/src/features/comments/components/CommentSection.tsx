import React from 'react';
import { useBlogComments } from '../hooks/useComments.js';
import { CommentForm } from './CommentForm.js';
import { Loader2, MessageSquare } from 'lucide-react';

interface CommentSectionProps {
  blogId: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ blogId }) => {
  const { data: comments, isLoading } = useBlogComments(blogId);

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
              const isAuthorUser = typeof comment.author === 'object';
              const date = new Date(comment.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <div
                  key={comment.id}
                  className="glass-panel p-4 rounded-xl border border-white/5 bg-black/10 flex gap-3 items-start"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center font-bold text-xs text-indigo-300 uppercase">
                    {commenterName.charAt(0)}
                  </div>
                  <div className="space-y-1 flex-grow">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-white">
                        {commenterName}
                      </span>
                      {isAuthorUser && (
                        <span className="text-[9px] uppercase font-bold tracking-wider text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded-md">
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
