// app/Registration/page.tsx
import styles from './page.module.css';
import Link from 'next/link';

// Server action for form handling
async function registerCompany(formData: FormData): Promise<void> {
  'use server';
  
  // Extract form data
  const companyName = formData.get('companyName');
  const industry = formData.get('industry');
  const companySize = formData.get('companySize');
  const companyEmail = formData.get('companyEmail');
  
  console.log('Registration form submitted:', {
    companyName,
    industry,
    companySize,
    companyEmail
  });
  
  // Here you would process the registration
  // For example, save to database, send confirmation email, etc.
  
  // Redirect after successful registration
  // You need to use the redirect function from next/navigation
  // import { redirect } from 'next/navigation';
  // redirect('/registration-success');
}

export default function CompanyRegistration() {
  return (
    <div className={styles.page}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Registration</h2>
        <div className={styles.titleUnderline}></div>
        <form className={styles.form} action={registerCompany}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Company Name</label>
            <input
              type="text"
              name="companyName"
              placeholder="Please enter your company name"
              className={styles.input}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Industry</label>
            <input
              type="text"
              name="industry"
              placeholder="Please enter your industry"
              className={styles.input}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Company Size</label>
            <select
              className={styles.select}
              name="companySize"
              required
            >
              <option value="">Please select</option>
              <option value="small">Small (50 employees or less)</option>
              <option value="medium">Medium (more than 50, less than or equal to 100 employees)</option>
              <option value="large">Large (more than 100, less than or equal to 500 employees)</option>
              <option value="corporate">Corporate (more than 500 employees)</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Company Logo</label>
            <div className={styles.inputFile}>
              <input
                type="file"
                name="companyLogo"
                accept="image/*"
              />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Official Company Email</label>
            <input
              type="email"
              name="companyEmail"
              placeholder="Please enter your company email"
              className={styles.input}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Upload Documents</label>
            <div className={styles.inputFile}>
              <input
                type="file"
                name="documents"
                accept=".pdf,.doc,.docx"
                multiple
              />
            </div>
          </div>
          <button
            type="submit"
            className={styles.submitButton}
          >
            Submit <span className={styles.arrow}>→</span>
          </button>
        </form>
        <p className={styles.signInLink}>
          Already have an account? <Link href="/CompanyLogin" className={styles.link}>Login</Link>
        </p>
      </div>
    </div>
  );
}