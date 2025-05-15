"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import styles from './StudentLogin.module.css';
import Link from 'next/link';

const StudentLogin = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      console.log('Student login attempt with:', { email, password });

      // Use existing login logic from the original StudentLogin page
      if (email === 'ahmed.mostafa@student.guc.edu.eg' && password === '123456') {
        setTimeout(() => {
          router.push('/StudentLogin/student');
        }, 1500);
      } else if (email === 'salma.hassan@student.guc.edu.eg' && password === '123456') {
        setTimeout(() => {
          router.push('/StudentLogin/pro-student');
        }, 1500);
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (err) {
      setError('Login failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          {/* Left side - Form */}
          <div className={styles.formSide}>
            <div className={styles.logoHeader}>
              <Link href="/" className={styles.backLink}>
                <ArrowLeft size={20} />
                <span>Back to Home</span>
              </Link>

              <div className={styles.logoContainer}>
                <div className={styles.logo}>
                  <div className={styles.logoCircle}></div>
                </div>
                <span className={styles.appName}>GUC Internship System</span>
              </div>
            </div>

            <div className={styles.formContent}>
              <div className={styles.formHeader}>
                <h2 className={styles.startText}>STUDENT PORTAL</h2>
                <h1 className={styles.createText}>Log in to account<span className={styles.dot}>.</span></h1>
              </div>

              {error && <div className={styles.errorMessage}>{error}</div>}

              <form onSubmit={handleLogin} className={styles.loginForm}>
                <div className={styles.inputGroup}>
                  <label htmlFor="email" className={styles.inputLabel}>Email</label>
                  <div className={styles.inputWrapper}>
                    <input
                      id="email"
                      type="email"
                      className={styles.input}
                      placeholder="Enter your student email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <button type="button" className={styles.inputIcon}>
                      <Mail size={16} />
                    </button>
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="password" className={styles.inputLabel}>Password</label>
                  <div className={styles.inputWrapper}>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className={styles.input}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className={styles.passwordToggle}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className={styles.formOptions}>
                  <div className={styles.checkboxWrapper}>
                    <input
                      type="checkbox"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className={styles.checkbox}
                    />
                    <label htmlFor="rememberMe" className={styles.checkboxLabel}>
                      Remember me
                    </label>
                  </div>
                  <Link href="/forgot-password" className={styles.forgotPassword}>
                    Forgot password?
                  </Link>
                </div>

                <div className={styles.actionButtons}>
                  <button
                    type="submit"
                    className={styles.primaryButton}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className={styles.spinner}></span>
                    ) : (
                      'Log in'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right side - Illustration */}
          <div className={styles.illustrationSide}>
            <Image
              src="/assets/Student.svg"
              alt="Student Illustration"
              fill
              className={styles.illustration}
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
