"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Mail, Lock, Building, Users, ArrowLeft } from 'lucide-react';
import styles from './Registration.module.css';
import Link from 'next/link';

const Registration = () => {
  const router = useRouter();
  const [formValues, setFormValues] = useState({
    companyName: '',
    companyEmail: '',
    password: '',
    confirmPassword: '',
    industry: '',
    companySize: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });

    // Clear error for this field when user starts typing again
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formValues.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formValues.companyEmail.trim()) {
      newErrors.companyEmail = 'Company email is required';
    } else if (!emailRegex.test(formValues.companyEmail)) {
      newErrors.companyEmail = 'Please enter a valid email address';
    }

    if (!formValues.password) {
      newErrors.password = 'Password is required';
    } else if (formValues.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formValues.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formValues.password !== formValues.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formValues.industry) {
      newErrors.industry = 'Please select your industry';
    }

    if (!formValues.companySize) {
      newErrors.companySize = 'Please select your company size';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      console.log('Company registration attempt with:', formValues);
      setTimeout(() => {
        router.push('/CompanyLogin');
      }, 1500);
    } catch (err) {
      setErrors({
        ...errors,
        form: 'Registration failed. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const industries = [
    { value: 'tech', label: 'Technology' },
    { value: 'finance', label: 'Finance' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'education', label: 'Education' },
    { value: 'retail', label: 'Retail' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'media', label: 'Media & Entertainment' },
    { value: 'consulting', label: 'Consulting' },
    { value: 'non_profit', label: 'Non-Profit' },
    { value: 'other', label: 'Other' }
  ];

  const companySizes = [
    { value: 'small', label: 'Small (1-50 employees)' },
    { value: 'medium', label: 'Medium (51-200 employees)' },
    { value: 'large', label: 'Large (201-1000 employees)' },
    { value: 'enterprise', label: 'Enterprise (1000+ employees)' }
  ];

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
                <h2 className={styles.startText}>COMPANY PORTAL</h2>
                <h1 className={styles.createText}>Create new account<span className={styles.dot}>.</span></h1>
                <p className={styles.memberText}>
                  Already have an account? <Link href="/CompanyLogin" className={styles.loginLink}>Log in here</Link>
                </p>
              </div>

              {errors.form && <div className={styles.errorMessage}>{errors.form}</div>}

              <form onSubmit={handleSubmit} className={styles.loginForm}>
                <div className={styles.inputGroup}>
                  <label htmlFor="companyName" className={styles.inputLabel}>Company Name</label>
                  <div className={styles.inputWrapper}>
                    <input
                      id="companyName"
                      name="companyName"
                      type="text"
                      className={styles.input}
                      placeholder="Enter your company name"
                      value={formValues.companyName}
                      onChange={handleInputChange}
                      required
                    />
                    <span className={styles.inputIcon}>
                      <Building size={16} />
                    </span>
                  </div>
                  {errors.companyName && <span className={styles.errorText}>{errors.companyName}</span>}
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="companyEmail" className={styles.inputLabel}>Company Email</label>
                  <div className={styles.inputWrapper}>
                    <input
                      id="companyEmail"
                      name="companyEmail"
                      type="email"
                      className={styles.input}
                      placeholder="Enter your company email"
                      value={formValues.companyEmail}
                      onChange={handleInputChange}
                      required
                    />
                    <span className={styles.inputIcon}>
                      <Mail size={16} />
                    </span>
                  </div>
                  {errors.companyEmail && <span className={styles.errorText}>{errors.companyEmail}</span>}
                </div>

                <div className={styles.inputRow}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="industry" className={styles.inputLabel}>Industry</label>
                    <div className={styles.selectWrapper}>
                      <select
                        id="industry"
                        name="industry"
                        className={styles.select}
                        value={formValues.industry}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="" disabled>Select your industry</option>
                        {industries.map(industry => (
                          <option key={industry.value} value={industry.value}>
                            {industry.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.industry && <span className={styles.errorText}>{errors.industry}</span>}
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="companySize" className={styles.inputLabel}>Company Size</label>
                    <div className={styles.selectWrapper}>
                      <select
                        id="companySize"
                        name="companySize"
                        className={styles.select}
                        value={formValues.companySize}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="" disabled>Select company size</option>
                        {companySizes.map(size => (
                          <option key={size.value} value={size.value}>
                            {size.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.companySize && <span className={styles.errorText}>{errors.companySize}</span>}
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="password" className={styles.inputLabel}>Password</label>
                  <div className={styles.inputWrapper}>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      className={styles.input}
                      placeholder="Create a password (min. 8 characters)"
                      value={formValues.password}
                      onChange={handleInputChange}
                      required
                    />
                    <span className={styles.inputIcon}>
                      <Lock size={16} />
                    </span>
                  </div>
                  {errors.password && <span className={styles.errorText}>{errors.password}</span>}
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="confirmPassword" className={styles.inputLabel}>Confirm Password</label>
                  <div className={styles.inputWrapper}>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      className={styles.input}
                      placeholder="Confirm your password"
                      value={formValues.confirmPassword}
                      onChange={handleInputChange}
                      required
                    />
                    <span className={styles.inputIcon}>
                      <Lock size={16} />
                    </span>
                  </div>
                  {errors.confirmPassword && <span className={styles.errorText}>{errors.confirmPassword}</span>}
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
                      'Register Company'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right side - Illustration */}
          <div className={styles.illustrationSide}>
            <Image
              src="/assets/CompanyRegisteration.svg"
              alt="Company Illustration"
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

export default Registration;