import React from 'react';
import { Blog } from '@blog/shared-types';
import DOMPurify from 'isomorphic-dompurify';
import { Calendar, User, ArrowLeft, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BlogDetailProps {
  blog: Blog;
}

export const BlogDetail: React.FC<BlogDetailProps> = ({ blog }) => {
  const authorName = typeof blog.author === 'object' ? blog.author.name : 'Unknown Author';
  const date = blog.publishedAt
    ? new Date(blog.publishedAt).toLocaleDateString(undefined, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Draft';

  // Sanitize the HTML string using DOMPurify
  const sanitizedContent = DOMPurify.sanitize(blog.content);

  return (
    <article className="max-w-3xl mx-auto space-y-6">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-indigo-400 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to articles
      </Link>

      <div className="space-y-4">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          {blog.title}
        </h1>

        <div className="flex items-center gap-4 text-xs text-muted-foreground border-b border-white/5 pb-4">
          <span className="flex items-center gap-1">
            <User className="w-3.5 h-3.5" />
            {authorName}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {date}
          </span>
          {blog.status === 'draft' && (
            <span className="text-[9px] font-bold tracking-wider text-yellow-300 bg-yellow-500/10 border border-yellow-500/20 px-1.5 py-0.5 rounded-md uppercase">
              Draft
            </span>
          )}
        </div>
      </div>

      {blog.coverImage && (
        <div className="rounded-xl overflow-hidden border border-white/5 h-64 md:h-96 w-full relative">
          <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Main post markup content */}
      <div
        className="prose prose-invert max-w-none text-muted-foreground leading-relaxed text-base md:text-lg space-y-4 whitespace-pre-wrap pt-2"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />

      {blog.tags && blog.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-6 border-t border-white/5">
          {blog.tags.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1 text-xs text-indigo-300 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20"
            >
              <Tag className="w-3 h-3" />
              {t}
            </span>
          ))}
        </div>
      )}
    </article>
  );
};
export default BlogDetail;
