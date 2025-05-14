"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '../../../src/components/RegisterationAndLogin/LoginForm';

const StudentLogin = () => {
  const router = useRouter();
  
  const handleLogin = (email: string, password: string) => {
    console.log('Student login attempt with:', { email, password });
    //student: email: ahmed.mostafa@student.guc.edu.eg
    //Pro Student email: salma.hassan@student.guc.edu.eg
    //password for both: 123456
    if (email === 'ahmed.mostafa@student.guc.edu.eg' && password === '123456') {
      router.push('/student');
    } else if (email === 'salma.hassan@student.guc.edu.eg' && password === '123456') {
      router.push('/proStudent');
    }
  };

  return <LoginForm userType="student" onLogin={handleLogin} />;
};

export default StudentLogin;
