import React from 'react';
import { Blog } from '@blog/shared-types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card.js';
import { Link } from 'react-router-dom';
import { Calendar, User, Tag } from 'lucide-react';

interface BlogCardProps {
  blog: Blog;
}

export const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  const authorName = typeof blog.author === 'object' ? blog.author.name : 'Unknown Author';
  const publishedDate = blog.publishedAt
    ? new Date(blog.publishedAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Draft';

  return (
    <Card className="glass-panel glass-card-hover flex flex-col h-full overflow-hidden group border border-white/5 bg-black/40 backdrop-blur-md">
      {blog.coverImage && (
        <div className="h-48 w-full overflow-hidden relative">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}
      <CardHeader className="space-y-2 p-5">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <User className="w-3.5 h-3.5" />
            {authorName}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {publishedDate}
          </span>
        </div>
        <CardTitle className="text-xl font-bold line-clamp-2 text-white group-hover:text-indigo-400 transition-colors">
          <Link to={`/blog/${blog.slug}`}>{blog.title}</Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {blog.excerpt || 'No excerpt available for this post.'}
        </p>
      </CardContent>
      {blog.tags && blog.tags.length > 0 && (
        <CardFooter className="px-5 pb-5 pt-0 flex flex-wrap gap-1.5 border-t border-white/5 pt-4 mt-auto">
          {blog.tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1 text-[10px] uppercase font-semibold tracking-wider text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20"
            >
              <Tag className="w-2.5 h-2.5" />
              {t}
            </span>
          ))}
        </CardFooter>
      )}
    </Card>
  );
};
export default BlogCard;
