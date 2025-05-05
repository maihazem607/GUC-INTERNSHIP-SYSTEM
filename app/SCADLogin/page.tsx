"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '../../src/components/RegisterationAndLogin/LoginForm';

const SCADLogin = () => {
  const router = useRouter();
  
  const handleLogin = (email: string, password: string) => {
    console.log('SCAD login attempt with:', { email, password });
    // Here you would typically handle authentication logic
    router.push('/SCADDashboard');
  };

  return <LoginForm userType="scad" onLogin={handleLogin} />;
};

export default SCADLogin;
