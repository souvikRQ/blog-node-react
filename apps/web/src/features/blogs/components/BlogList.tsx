import React, { useState } from 'react';
import { useBlogsList } from '../hooks/useBlogs.js';
import { BlogCard } from './BlogCard.js';
import { Input } from '@/components/ui/input.js';
import { Button } from '@/components/ui/button.js';
import { Search, Loader2 } from 'lucide-react';

export const BlogList: React.FC = () => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useBlogsList({
    page,
    limit: 6,
    search: debouncedSearch,
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedSearch(search);
    setPage(1);
  };

  const handleClear = () => {
    setSearch('');
    setDebouncedSearch('');
    setPage(1);
  };

  return (
    <div className="space-y-8">
      {/* Search Input bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-md mx-auto">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search articles..."
            className="pl-9 bg-background/40 border-white/10 text-white placeholder:text-muted-foreground/50 focus-visible:ring-indigo-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white">
          Search
        </Button>
        {debouncedSearch && (
          <Button type="button" variant="outline" onClick={handleClear} className="border-white/10 text-white hover:bg-white/5">
            Clear
          </Button>
        )}
      </form>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
        </div>
      ) : !data || data.blogs.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground glass-panel rounded-xl max-w-md mx-auto p-8 border border-white/5">
          <p className="text-lg font-medium">No published blogs found</p>
          <p className="text-sm mt-1">Check back later or search for another keyword.</p>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>

          {/* Pagination controls */}
          {data.pagination && data.pagination.pages > 1 && (
            <div className="flex justify-center items-center gap-4 pt-4">
              <Button
                variant="outline"
                size="sm"
                className="border-white/10 text-white hover:bg-white/5"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {data.pagination.pages}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="border-white/10 text-white hover:bg-white/5"
                disabled={page === data.pagination.pages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default BlogList;
