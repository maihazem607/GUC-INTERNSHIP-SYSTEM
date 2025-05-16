"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Mail, Lock, Building, Users, ArrowLeft, Upload, FileText } from 'lucide-react';
import styles from './Registration.module.css';
import Link from 'next/link';
import { useNotification } from '@/context/NotificationContext';

const Registration = () => {
  const router = useRouter();
  const documentInputRef = useRef<HTMLInputElement>(null);
  const [documentUploaded, setDocumentUploaded] = useState<boolean>(false);
  const [documentName, setDocumentName] = useState<string>('');
  const { showNotification } = useNotification();
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
  
  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setErrors({
          ...errors,
          companyDocuments: 'File size exceeds 10MB limit'
        });
        return;
      }

      // Check file type
      if (!['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
        setErrors({
          ...errors,
          companyDocuments: 'Only PDF, JPEG, PNG, and Word documents are allowed'
        });
        return;
      }

      // Set document as uploaded
      setDocumentUploaded(true);
      setDocumentName(file.name);

      // Clear error if exists
      if (errors.companyDocuments) {
        setErrors({
          ...errors,
          companyDocuments: ''
        });
      }
    }
  };
  const handleDocumentUploadClick = (e: React.MouseEvent) => {
    // Prevent event propagation to avoid double dialog opening
    e.stopPropagation();
    documentInputRef.current?.click();
  };const validateForm = (): boolean => {
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
    
    // Make document upload required
    if (!documentUploaded) {
      newErrors.companyDocuments = 'Verification documents are required';
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
      // In a real implementation, we would create a FormData object
      // and append all form fields and verification documents
      const formData = new FormData();
      
      // Append form values
      Object.entries(formValues).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });
      
      // Append verification document (would be handled in actual implementation)
      if (documentInputRef.current?.files?.[0]) {
        formData.append('verificationDocument', documentInputRef.current.files[0]);
      }
      
      // Simulate API call
      console.log('Company registration attempt with:', formValues);
      console.log('Document uploaded:', documentName);
      
      // Show notification
      showNotification({
        message: "Registration submitted. Your request is under review. You'll receive an email once it's approved or rejected",
        type: 'success'
      });
      
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
                </div>                <div className={styles.inputRow}>
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
                </div>                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Verification Documents</label>                  <div 
                    className={`${errors.companyDocuments ? styles.inputError : ''}`}
                    style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: '#ffffff',
                      marginBottom: '10px',
                      position: 'relative',
                      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {documentUploaded ? (
                      <div style={{
                        display: 'flex', 
                        alignItems: 'center',
                        width: '100%',
                        justifyContent: 'space-between'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px'
                        }}>
                          <div style={{
                            backgroundColor: '#ebf5ff',
                            borderRadius: '6px',
                            width: '36px',
                            height: '36px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                            <FileText size={18} color="#3b82f6" />
                          </div>
                          <div style={{display: 'flex', flexDirection: 'column'}}>
                            <span style={{fontWeight: 500, fontSize: '0.9rem', color: '#1e293b'}}>{documentName}</span>
                            <span style={{fontSize: '0.75rem', color: '#10b981'}}>Document uploaded successfully</span>
                          </div>
                        </div>                        <button 
                          type="button"
                          style={{
                            backgroundColor: '#edf2f7',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '6px 12px',
                            fontSize: '0.75rem',
                            color: '#4b5563',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = '#e2e8f0';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = '#edf2f7';
                          }}
                          onClick={handleDocumentUploadClick}
                        >
                          Change
                        </button>
                      </div>                    ) : (                      <div 
                        onClick={handleDocumentUploadClick}
                        style={{
                          display: 'flex',
                          alignItems: 'center', 
                          width: '100%',
                          cursor: 'pointer',
                          padding: '2px',
                          borderRadius: '6px'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = '#f8fafc';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <div style={{
                          backgroundColor: '#f8fafc',
                          borderRadius: '6px',
                          width: '36px',
                          height: '36px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: '12px'
                        }}>
                          <Upload size={18} color="#4c51bf" />
                        </div>
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          flex: 1
                        }}>
                          <span style={{fontWeight: 500, color: '#1e293b'}}>Upload Verification Documents</span>
                          <span style={{fontSize: '0.75rem', color: '#64748b', marginTop: '4px'}}>
                            Tax documents, business licenses, registration certificates (PDF, JPEG, PNG, DOC - Max 10MB)
                          </span>
                        </div>
                      </div>
                    )}
                    <input
                      type="file"
                      ref={documentInputRef}
                      id="companyDocuments"
                      name="companyDocuments"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={handleDocumentUpload}
                      style={{
                        display: 'none' // Hide the input element completely
                      }}
                    />
                  </div>
                  {errors.companyDocuments && <span className={styles.errorText}>{errors.companyDocuments}</span>}
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