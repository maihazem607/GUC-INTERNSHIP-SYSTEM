"use client";

import React, { useState } from 'react';
import styles from './page.module.css';
import Link from 'next/link';


const CompanyLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleRememberMeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(event.target.checked);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Login attempt with:', { email, password, rememberMe });
    // Here you would typically handle authentication logic
  };

  return (
    <div className={styles.page}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Login</h2>
        <div className={styles.titleUnderline}></div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Company Email</label>
            <input
              type="email"
              placeholder="Please enter your company email"
              className={styles.input}
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Password</label>
            <input
              type="password"
              placeholder="Please enter your password"
              className={styles.input}
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <div className={`${styles.formGroup} ${styles.rememberForgot}`}>
            <div className={styles.checkboxContainer}>
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={handleRememberMeChange}
                className={styles.checkbox}
              />
              <label htmlFor="rememberMe" className={styles.checkboxLabel}>
                Remember me
              </label>
            </div>
            <a href="#" className={styles.link}>
              Forgot password?
            </a>
          </div>
          <button
            type="submit"
            className={styles.submitButton}
          >
            Login <span className={styles.arrow}>→</span>
          </button>
        </form>
        <p className={styles.signInLink}>
          Don't have an account? <Link href="/Registration" className={styles.link}>Register</Link>
        </p>
      </div>
    </div>
  );
};

export default CompanyLogin;
