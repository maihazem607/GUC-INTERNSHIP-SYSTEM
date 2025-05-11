import React, { useState } from 'react';
import Image from "next/image";
import styles from './InternshipDetailsModal.module.css';
import { Internship } from './types';

interface DetailsModalProps {
  internship: Internship;
  onClose: () => void;
  onApply: (internship: Internship) => void;
}

const InternshipDetailsModal: React.FC<DetailsModalProps> = ({
  internship,
  onClose,
  onApply
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApply = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await onApply(internship);
      onClose();
    } catch (err) {
      console.error('Network error:', err);
      setError('Network connection error. Please check your internet connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{internship.title}</h2>
          <div className={styles.modalCompany}>
            {internship.logo && (
              <Image 
                src={internship.logo} 
                alt={`${internship.company} logo`} 
                width={40} 
                height={40} 
                className={styles.modalCompanyLogo}
              />
            )}
            <span className={styles.modalCompanyName}>{internship.company}</span>
          </div>
        </div>
        
        <div className={styles.modalInfo}>
          <div className={styles.modalInfoItem}>
            <div className={styles.modalInfoLabel}>Posted Date</div>
            <div className={styles.modalInfoValue}>{internship.date}</div>
          </div>
          <div className={styles.modalInfoItem}>
            <div className={styles.modalInfoLabel}>Duration</div>
            <div className={styles.modalInfoValue}>{internship.duration}</div>
          </div>
          <div className={styles.modalInfoItem}>
            <div className={styles.modalInfoLabel}>Location</div>
            <div className={styles.modalInfoValue}>{internship.location}</div>
          </div>
          <div className={styles.modalInfoItem}>
            <div className={styles.modalInfoLabel}>Salary</div>
            <div className={styles.modalInfoValue}>{internship.salary}</div>
          </div>
        </div>
        
        <div className={styles.modalDescription}>
          <h3>About this internship</h3>
          <p>{internship.description || 'No description available for this internship opportunity.'}</p>
        </div>
        
        <div className={styles.modalTags}>
          <div className={styles.modalTagTitle}>Industry</div>
          <div className={styles.tagList}>
            <span className={styles.tag}>{internship.industry}</span>
          </div>
          
          <div className={styles.modalTagTitle}>Type</div>
          <div className={styles.tagList}>
            <span className={styles.tag}>{internship.isPaid ? 'Paid' : 'Unpaid'}</span>
          </div>
        </div>
        
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}
        
        <div className={styles.modalActions}>
          <button 
            className={styles.applyButton}
            onClick={handleApply}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Apply Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InternshipDetailsModal;