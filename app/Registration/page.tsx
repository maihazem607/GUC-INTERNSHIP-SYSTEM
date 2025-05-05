// app/Registration/page.tsx
import React from 'react';
import CompanyRegistrationForm from '../../src/components/RegisterationAndLogin/CompanyRegistrationForm';
import styles from './page.module.css';

export default function Registration() {
  return (
    <div className={styles.registrationPage}>
      <CompanyRegistrationForm />
    </div>
  );
}