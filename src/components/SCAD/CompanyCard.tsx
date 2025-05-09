import React from "react";
import styles from "./CompanyCard.module.css";

export interface CompanyCardProps {
  name: string;
  industry: string;
  applicationDate: string;
  status: 'pending' | 'accepted' | 'rejected';
  onViewDetails?: () => void;
}

const getCardBackground = (name: string): string => {
  const colors = [
    '#e8f3ff', '#ffe8f0', '#e8fff0', '#fff8e8', '#f0e8ff',
    '#e8ffea', '#f0ffe8', '#fff0f0'
  ];
  // Simple hash function to get consistent colors for the same company name
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

const getStatusChip = (status: string) => {
  let chipColor = '#e8f3ff';
  let textColor = '#217dbb';
  
  if (status === 'accepted') {
    chipColor = '#e8ffe8';
    textColor = '#1aaf5d';
  } else if (status === 'rejected') {
    chipColor = '#ffe8e8';
    textColor = '#e74c3c';
  }
  
  return (
    <span className={styles.statusChip} style={{backgroundColor: chipColor, color: textColor}}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const CompanyCard: React.FC<CompanyCardProps> = ({ 
  name, 
  industry, 
  applicationDate, 
  status, 
  onViewDetails 
}) => (
  <div className={styles.card} onClick={onViewDetails} style={{ cursor: 'pointer' }}>
    <div className={styles.cardInner} style={{ backgroundColor: getCardBackground(name) }}>
      <div className={styles.cardDate}>
        <span>Applied: {applicationDate}</span>
        {getStatusChip(status)}
      </div>
      
      <div className={styles.companyInfo}>
        <span className={styles.companyName}>{industry}</span>
      </div>
      
      <div className={styles.jobTitleContainer}>
        <h3 className={styles.jobTitle}>{name}</h3>
      </div>
      
      <div className={styles.jobTags}>
        <span className={styles.jobTag}>{industry}</span>
        <span className={styles.jobTag}>New Application</span>
      </div>
    </div>
    
    <div className={styles.cardFooter}>
      <div className={styles.jobMeta}>
        <div className={styles.salary}>Application Review</div>
        <div className={styles.location}>{status === 'pending' ? 'Needs attention' : status === 'accepted' ? 'Approved' : 'Not approved'}</div>
      </div>
      <button 
        className={styles.detailsButton}
        onClick={(e) => {
          e.stopPropagation();
          onViewDetails && onViewDetails();
        }}
      >
        Details
      </button>
    </div>
  </div>
);

export default CompanyCard;
