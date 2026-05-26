import React from 'react';
import { RegisterForm } from '@/features/auth/components/RegisterForm.js';

export const RegisterPage: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-20 px-4">
      <RegisterForm />
    </div>
  );
};
export default RegisterPage;
