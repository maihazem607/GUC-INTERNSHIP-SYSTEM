"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '../../src/components/RegisterationAndLogin/LoginForm';

const CompanyLogin = () => {
  const router = useRouter();
  
  const handleLogin = (email: string, password: string) => {
    console.log('Company login attempt with:', { email, password });
    // Here you would typically handle authentication logic
    router.push('/CompanyDashboard');
  };

  return <LoginForm userType="company" onLogin={handleLogin} />;
};

export default CompanyLogin;
