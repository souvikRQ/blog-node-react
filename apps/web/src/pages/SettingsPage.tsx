import React from 'react';
import { ChangePasswordForm } from '@/features/settings/components/ChangePasswordForm.js';

export const SettingsPage: React.FC = () => {
  return (
    <div className="py-10 max-w-6xl mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Account Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account security and preferences.
        </p>
      </div>

      <ChangePasswordForm />
    </div>
  );
};

export default SettingsPage;
