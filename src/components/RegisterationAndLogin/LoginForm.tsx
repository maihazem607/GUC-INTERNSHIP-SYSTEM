import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './LoginForm.module.css';

export interface LoginFormProps {
  userType: 'company' | 'student' | 'pro-student' | 'scad' | 'faculty';
  onLogin: (email: string, password: string) => void;
  logoSrc?: string;
  title?: string;
}

export default function LoginForm({
  userType,
  onLogin,
  logoSrc = '/logos/GUCInternshipSystemLogo.png',
  title = 'GUC Internship System'
}: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateForm = () => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');

    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // This is a dummy authentication since there's no backend
      // In a real application, this would call an API
      setTimeout(() => {
        // Simulate successful login
        onLogin(email, password);
      }, 1500);
    } catch (err) {
      setError('Login failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getUserTypeDisplay = () => {
    const userTypes = {
      'company': 'Company',
      'student': 'Student',
      'pro-student': 'PRO Student',
      'scad': 'SCAD Office',
      'faculty': 'Faculty Member'
    };
    return userTypes[userType] || 'User';
  };

  const getRedirectPath = () => {
    const paths = {
      'company': '/Registration',
      'student': '/Registration',
      'pro-student': '/Registration',
      'scad': '/Registration',
      'faculty': '/Registration'
    };
    return paths[userType] || '/Registration';
  };

  const getNextPage = () => {
    const paths = {
      'company': '/CompanyDashboard',
      'student': '/StudentDashboard',
      'pro-student': '/ProStudentDashboard',
      'scad': '/SCADDashboard',
      'faculty': '/FacultyDashboard'
    };
    return paths[userType] || '/';
  };

  const getOtherLoginTypes = () => {
    const allTypes = [
      { type: 'company', label: 'Company', path: '/CompanyLogin' },
      { type: 'student', label: 'Student', path: '/StudentLogin' },
      { type: 'pro-student', label: 'PRO Student', path: '/StudentLogin' },
      { type: 'scad', label: 'SCAD Office', path: '/SCADLogin' },
      { type: 'faculty', label: 'Faculty', path: '/FacultyLogin' }
    ];
    
    return allTypes.filter(t => t.type !== userType);
  };

  const getIllustration = () => {
    const illustrations = {
      'company': '/assets/images/company-login.svg',
      'student': '/assets/images/student-login.svg',
      'pro-student': '/assets/images/pro-student-login.svg',
      'scad': '/assets/images/scad-login.svg',
      'faculty': '/assets/images/faculty-login.svg'
    };
    
    return illustrations[userType] || '/assets/images/login-default.svg';
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.formCard}>
        {/* Left side - Illustration */}
        <div className={styles.illustrationSide}>
          <div className={styles.welcomeText}>
            <h2>Welcome to</h2>
            <h1>{title}</h1>
            <p>Your gateway to exciting career opportunities</p>
          </div>
          
          <div className={styles.illustrationWrapper}>
            <div className={styles.illustrationPlaceholder}>
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path fill="#FFFFFF" d="M42.7,-57.2C55.9,-51.8,67.4,-40.6,73.3,-26.8C79.2,-13,79.5,3.3,74.1,17.2C68.7,31.2,57.6,42.8,44.9,51.5C32.1,60.1,17.7,65.8,1.8,63.6C-14.1,61.4,-31.5,51.2,-43.6,39.1C-55.7,26.9,-62.5,12.8,-65.2,-3.1C-67.9,-19,-66.5,-36.7,-57.6,-48.7C-48.7,-60.7,-32.4,-67,-17.2,-67.5C-2,-68,12.9,-62.6,26.7,-62.7C40.5,-62.7,53.1,-68.3,42.7,-57.2Z" transform="translate(100 100)" />
              </svg>
            </div>
          </div>
          
          <div className={styles.decorationDots}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        
        {/* Right side - Form */}
        <div className={styles.formSide}>
          <div className={styles.logoSection}>
            <Image
              src={logoSrc}
              alt={title}
              width={80}
              height={80}
              className={styles.logo}
            />
            <h1 className={styles.title}>{getUserTypeDisplay()} Login</h1>
            <div className={styles.divider}></div>
          </div>

          {error && (
            <div className={styles.errorAlert}>
              <span className={styles.errorIcon}>⚠️</span>
              {error}
            </div>
          )}

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>Email Address</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>✉️</span>
                <input
                  id="email"
                  type="email"
                  placeholder={`Enter your ${userType === 'company' ? 'company' : ''} email`}
                  className={`${styles.input} ${emailError ? styles.inputError : ''}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {emailError && <span className={styles.errorText}>{emailError}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>🔒</span>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className={`${styles.input} ${passwordError ? styles.inputError : ''}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {passwordError && <span className={styles.errorText}>{passwordError}</span>}
            </div>

            <div className={styles.formOptions}>
              <div className={styles.checkboxWrapper}>
                <input
                  type="checkbox"
                  id="rememberMe"
                  className={styles.checkbox}
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="rememberMe" className={styles.checkboxLabel}>
                  Remember me
                </label>
              </div>
              <Link href="/forgot-password" className={styles.forgotPasswordLink}>
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className={styles.loginButton}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className={styles.spinner}></span>
              ) : (
                <>
                  Login <span className={styles.buttonArrow}>→</span>
                </>
              )}
            </button>
            
            {userType === 'company' && (
              <p className={styles.registerLink}>
                Don't have an account?{' '}
                <Link href={getRedirectPath()} className={styles.link}>
                  Register here
                </Link>
              </p>
            )}

            <div className={styles.otherLoginTypes}>
              <p className={styles.otherLoginTitle}>Other login options:</p>
              <div className={styles.loginTypeLinks}>
                {getOtherLoginTypes().map((loginType) => (
                  <Link 
                    key={loginType.type} 
                    href={loginType.path} 
                    className={styles.loginTypeLink}
                  >
                    {loginType.label}
                  </Link>
                ))}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}