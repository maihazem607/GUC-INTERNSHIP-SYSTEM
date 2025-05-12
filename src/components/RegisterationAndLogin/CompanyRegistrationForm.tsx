'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import styles from './CompanyRegistrationForm.module.css';
import {
  Factory, Mail, Lock, Upload,
  ArrowRight, ArrowLeft
} from 'lucide-react';

interface CompanySize {
  value: string;
  label: string;
  description: string;
}

const companySizes: CompanySize[] = [
  { value: 'small', label: 'Small', description: '50 employees or less' },
  { value: 'medium', label: 'Medium', description: 'More than 50, less than or equal to 100 employees' },
  { value: 'large', label: 'Large', description: 'More than 100, less than or equal to 500 employees' },
  { value: 'corporate', label: 'Corporate', description: 'More than 500 employees' }
];

interface Industry {
  value: string;
  label: string;
}

const industries: Industry[] = [
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

const CompanyRegistrationForm: React.FC = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [formValues, setFormValues] = useState({
    companyName: '',
    industry: '',
    companySize: '',
    companyEmail: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);

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

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormValues({
      ...formValues,
      [name]: checked
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({
          ...errors,
          companyLogo: 'File size exceeds 5MB limit'
        });
        return;
      }

      // Check file type
      if (!['image/jpeg', 'image/png', 'image/svg+xml'].includes(file.type)) {
        setErrors({
          ...errors,
          companyLogo: 'Only JPEG, PNG, and SVG files are allowed'
        });
        return;
      }

      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Clear error if exists
      if (errors.companyLogo) {
        setErrors({
          ...errors,
          companyLogo: ''
        });
      }
    }
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formValues.companyName.trim()) {
        newErrors.companyName = 'Company name is required';
      }

      if (!formValues.industry) {
        newErrors.industry = 'Please select your industry';
      }

      if (!formValues.companySize) {
        newErrors.companySize = 'Please select your company size';
      }
    } else if (currentStep === 2) {
      if (!logoPreview) {
        newErrors.companyLogo = 'Company logo is required';
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

      if (!formValues.termsAccepted) {
        newErrors.termsAccepted = 'You must accept the terms and conditions';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(step)) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call with a timeout
    setTimeout(() => {
      setIsSubmitting(false);

      // Redirect to success page or login page
      router.push('/CompanyLogin?registered=true');
    }, 1500);
  };

  const handleLogoUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={styles.registrationContainer}>
      <div className={styles.formCard}>
        <div className={styles.logoSection}>
          <Image
            src="/logos/GUCInternshipSystemLogo.png"
            alt="GUC Internship System"
            width={100}
            height={100}
            className={styles.logo}
          />
          <h1 className={styles.title}>Company Registration</h1>
          <div className={styles.divider}></div>
        </div>

        {/* Progress Indicator */}
        <div className={styles.progressContainer}>
          <div className={styles.progressStep}>
            <div className={`${styles.progressIndicator} ${step >= 1 ? styles.active : ''}`}>1</div>
            <span className={styles.progressLabel}>Company Details</span>
          </div>
          <div className={styles.progressLine}></div>
          <div className={styles.progressStep}>
            <div className={`${styles.progressIndicator} ${step >= 2 ? styles.active : ''}`}>2</div>
            <span className={styles.progressLabel}>Account Setup</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Step 1: Company Information */}
          {step === 1 && (
            <div className={styles.formStep}>
              <div className={styles.inputGroup}>
                <label htmlFor="companyName" className={styles.label}>Company Name <span className={styles.required}>*</span></label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>🏢</span>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formValues.companyName}
                    onChange={handleInputChange}
                    placeholder="Enter your company name"
                    className={`${styles.input} ${errors.companyName ? styles.inputError : ''}`}
                  />
                </div>
                {errors.companyName && <span className={styles.errorText}>{errors.companyName}</span>}
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="industry" className={styles.label}>Industry <span className={styles.required}>*</span></label>
                <div className={styles.selectWrapper}>
                  <span className={styles.inputIcon}>
                    <Factory size={16} color="#4c51bf" />
                  </span>
                  <select
                    id="industry"
                    name="industry"
                    value={formValues.industry}
                    onChange={handleInputChange}
                    className={`${styles.select} ${errors.industry ? styles.inputError : ''}`}
                  >
                    <option value="">Select your industry</option>
                    {industries.map(industry => (
                      <option key={industry.value} value={industry.value}>{industry.label}</option>
                    ))}
                  </select>
                </div>
                {errors.industry && <span className={styles.errorText}>{errors.industry}</span>}
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Company Size <span className={styles.required}>*</span></label>
                <div className={styles.sizeOptionsContainer}>
                  {companySizes.map(size => (
                    <div
                      key={size.value}
                      className={`${styles.sizeOption} ${formValues.companySize === size.value ? styles.selectedSize : ''}`}
                      onClick={() => setFormValues({ ...formValues, companySize: size.value })}
                    >
                      <input
                        type="radio"
                        id={size.value}
                        name="companySize"
                        value={size.value}
                        checked={formValues.companySize === size.value}
                        onChange={handleInputChange}
                        className={styles.sizeRadio}
                      />
                      <div className={styles.sizeContent}>
                        <label htmlFor={size.value} className={styles.sizeLabel}>{size.label}</label>
                        <span className={styles.sizeDescription}>{size.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {errors.companySize && <span className={styles.errorText}>{errors.companySize}</span>}
              </div>

              <div className={styles.buttonGroup}>
                <button
                  type="button"
                  onClick={handleNext}
                  className={styles.nextButton}
                >
                  Next <span className={styles.buttonArrow}><ArrowRight size={16} /></span>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Account Information */}
          {step === 2 && (
            <div className={styles.formStep}>
              <div className={styles.logoUploadSection}>
                <label className={styles.label}>Company Logo <span className={styles.required}>*</span></label>
                <div
                  className={`${styles.logoUploader} ${errors.companyLogo ? styles.logoUploaderError : ''}`}
                  onClick={handleLogoUploadClick}
                >
                  {logoPreview ? (
                    <Image
                      src={logoPreview}
                      alt="Company Logo Preview"
                      width={120}
                      height={120}
                      className={styles.logoPreviewImage}
                    />
                  ) : (
                    <div className={styles.uploadPlaceholder}>
                      <span className={styles.uploadIcon}>
                        <Upload size={24} color="#4c51bf" />
                      </span>
                      <span>Click to upload logo</span>
                      <span className={styles.uploadHint}>(JPEG, PNG, SVG, max 5MB)</span>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    id="companyLogo"
                    name="companyLogo"
                    accept="image/jpeg, image/png, image/svg+xml"
                    onChange={handleLogoChange}
                    className={styles.hiddenFileInput}
                  />
                </div>
                {errors.companyLogo && <span className={styles.errorText}>{errors.companyLogo}</span>}
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="companyEmail" className={styles.label}>Official Company Email <span className={styles.required}>*</span></label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>
                    <Mail size={16} color="#4c51bf" />
                  </span>
                  <input
                    type="email"
                    id="companyEmail"
                    name="companyEmail"
                    value={formValues.companyEmail}
                    onChange={handleInputChange}
                    placeholder="Enter your official company email"
                    className={`${styles.input} ${errors.companyEmail ? styles.inputError : ''}`}
                  />
                </div>
                {errors.companyEmail && <span className={styles.errorText}>{errors.companyEmail}</span>}
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="password" className={styles.label}>Password <span className={styles.required}>*</span></label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>
                    <Lock size={16} color="#4c51bf" />
                  </span>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formValues.password}
                    onChange={handleInputChange}
                    placeholder="Create a password (min. 8 characters)"
                    className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                  />
                </div>
                {errors.password && <span className={styles.errorText}>{errors.password}</span>}
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="confirmPassword" className={styles.label}>Confirm Password <span className={styles.required}>*</span></label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>
                    <Lock size={16} color="#4c51bf" />
                  </span>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formValues.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
                  />
                </div>
                {errors.confirmPassword && <span className={styles.errorText}>{errors.confirmPassword}</span>}
              </div>

              <div className={styles.checkboxGroup}>
                <div className={styles.checkboxWrapper}>
                  <input
                    type="checkbox"
                    id="termsAccepted"
                    name="termsAccepted"
                    checked={formValues.termsAccepted}
                    onChange={handleCheckboxChange}
                    className={styles.checkbox}
                  />
                  <label htmlFor="termsAccepted" className={styles.checkboxLabel}>
                    I agree to the <Link href="#" className={styles.link}>Terms & Conditions</Link> and <Link href="#" className={styles.link}>Privacy Policy</Link>
                  </label>
                </div>
                {errors.termsAccepted && <span className={styles.errorText}>{errors.termsAccepted}</span>}
              </div>

              <div className={styles.buttonGroup}>
                <button
                  type="button"
                  onClick={handlePrevious}
                  className={styles.backButton}
                >
                  <span className={styles.buttonArrowLeft}><ArrowLeft size={16} /></span> Back
                </button>

                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className={styles.spinner}></span>
                  ) : (
                    'Complete Registration'
                  )}
                </button>
              </div>
            </div>
          )}
        </form>

        <div className={styles.loginLink}>
          <p>
            Already have an account? <Link href="/CompanyLogin" className={styles.link}>Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompanyRegistrationForm;