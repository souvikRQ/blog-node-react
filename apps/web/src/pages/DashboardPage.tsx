import React from 'react';
import { DashboardOverview } from '@/features/dashboard/components/DashboardOverview.js';

export const DashboardPage: React.FC = () => {
  return (
    <div className="py-10 max-w-6xl mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Author Workspace</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review and write articles, manage draft statuses, and moderate comments.
        </p>
      </div>

      <DashboardOverview />
    </div>
  );
};
export default DashboardPage;
