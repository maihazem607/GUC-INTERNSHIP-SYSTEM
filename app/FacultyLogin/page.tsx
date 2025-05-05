"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '../../src/components/RegisterationAndLogin/LoginForm';

const FacultyLogin = () => {
  const router = useRouter();
  
  const handleLogin = (email: string, password: string) => {
    console.log('Faculty login attempt with:', { email, password });
    // Here you would typically handle authentication logic
    router.push('/FacultyDashboard');
  };

  return <LoginForm userType="faculty" onLogin={handleLogin} />;
};

export default FacultyLogin;
