"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '../../src/components/RegisterationAndLogin/LoginForm';

const StudentLogin = () => {
  const router = useRouter();
  
  const handleLogin = (email: string, password: string) => {
    console.log('Student login attempt with:', { email, password });
    // Here you would typically handle authentication logic
    router.push('/StudentDashboard');
  };

  return <LoginForm userType="student" onLogin={handleLogin} />;
};

export default StudentLogin;
