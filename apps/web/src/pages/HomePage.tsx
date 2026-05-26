import React from 'react';
import { BlogList } from '@/features/blogs/components/BlogList.js';

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-12 py-10 max-w-6xl mx-auto px-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
          PenCraft
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Scaffolded, premium mono-repo blog writing platform for builders and writers.
        </p>
      </div>

      <BlogList />
    </div>
  );
};
export default HomePage;
