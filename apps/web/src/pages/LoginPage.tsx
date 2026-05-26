import React from 'react';
import { LoginForm } from '@/features/auth/components/LoginForm.js';

export const LoginPage: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-20 px-4">
      <LoginForm />
    </div>
  );
};
export default LoginPage;
