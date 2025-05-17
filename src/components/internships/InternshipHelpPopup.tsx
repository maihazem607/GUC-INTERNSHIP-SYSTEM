import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './InternshipHelpPopup.module.css';

interface InternshipHelpPopupProps {
  onClose: () => void;
}

const InternshipHelpPopup: React.FC<InternshipHelpPopupProps> = ({ onClose }) => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Small delay to allow animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const handleNavigate = () => {
    router.push('/StudentLogin/pro-student/InternshipRequirements');
    onClose();
  };

  return (
    <div className={`${styles.popupOverlay} ${isVisible ? styles.visible : ''}`}>
      <div className={styles.popupContainer}>
        <button className={styles.closeButton} onClick={onClose}>
          ✕
        </button>
        <div className={styles.popupContent}>
          <h3>Not sure which internship to apply for?</h3>
          <p>
            Finding the right internship can be challenging. If you're unsure about which opportunity 
            matches your skills and career goals, our internship requirements guide can help you.
          </p>
          <div className={styles.buttonContainer}>
            <button 
              className={styles.primaryButton} 
              onClick={handleNavigate}
            >
              View Internship Requirements Guide
            </button>
            <button 
              className={styles.secondaryButton} 
              onClick={onClose}
            >
              I'll explore on my own
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternshipHelpPopup;
