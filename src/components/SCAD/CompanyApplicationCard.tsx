import React from 'react';
import styles from './CompanyApplicationCard.module.css';

interface CompanyApplicationCardProps {
  company: {
    id: number;
    name: string;
    industry: string;
    description: string;
    contactPerson: string;
    email: string;
    phone: string;
    applicationDate: string;
    status: 'pending' | 'accepted' | 'rejected';
    size?: 'small' | 'medium' | 'large' | 'corporate';
    logo?: string;
    documents?: Array<{
      id: number;
      name: string;
      type: string;
      url: string;
    }>;
  };
  onViewDetails: () => void;
}

// Helper function to generate a consistent logo placeholder based on company name
const getCompanyInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Helper function to get background color for logo based on company name
const getLogoBackground = (name: string): string => {
  const colors = [
    '#3182ce', '#805ad5', '#d53f8c', '#dd6b20', '#38b2ac', 
    '#3182ce', '#2b6cb0', '#4c51bf', '#667eea', '#00b5d8'
  ];
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

const CompanyApplicationCard: React.FC<CompanyApplicationCardProps> = ({ company, onViewDetails }) => {
  // Format date to be more readable
  const formattedDate = new Date(company.applicationDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  const initials = getCompanyInitials(company.name);
  const logoBackground = getLogoBackground(company.name);
    // Format company size for display
  const formatCompanySize = (size?: string) => {
    if (!size) return 'Unknown size';
    
    switch (size) {
      case 'small': return 'Small (≤50 employees)';
      case 'medium': return 'Medium (51-100 employees)';
      case 'large': return 'Large (101-500 employees)';
      case 'corporate': return 'Corporate (500+ employees)';
      default: return size;
    }
  };
  
  // Count company documents
  const documentCount = company.documents?.length || 0;
    
  return (
    <div className={styles.card} onClick={onViewDetails}>
      <div className={styles.statusBadge} data-status={company.status}>
        {company.status.charAt(0).toUpperCase() + company.status.slice(1)}
      </div>
      
      <div className={styles.header}>
        <div className={styles.logoContainer}>
          {company.logo ? (
            <img 
              src={company.logo} 
              alt={`${company.name} logo`} 
              className={styles.companyImage}
            />
          ) : (
            <div className={styles.companyLogo} style={{ backgroundColor: logoBackground }}>
              {initials}
            </div>
          )}
        </div>
        <h3 className={styles.companyName}>{company.name}</h3>
      </div>
      
      <div className={styles.details}>
        <div className={styles.detailItem}>
          <span className={styles.icon}>🏢</span>
          <span className={styles.detailText}>{company.industry}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.icon}>📊</span>
          <span className={styles.detailText}>{formatCompanySize(company.size)}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.icon}>📧</span>
          <span className={styles.detailText}>{company.email}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.icon}>📅</span>
          <span className={styles.detailText}>Applied: {formattedDate}</span>
        </div>
      </div>
        <div className={styles.descriptionContainer}>
        <h4 className={styles.descriptionTitle}>About</h4>
        <p className={styles.description}>
          {company.description.length > 120 
            ? `${company.description.substring(0, 120)}...` 
            : company.description
          }
        </p>
      </div>
      
      {documentCount > 0 && (
        <div className={styles.documentsIndicator}>
          <span className={styles.documentIcon}>📄</span>
          <span className={styles.documentCount}>{documentCount} document{documentCount !== 1 ? 's' : ''} attached</span>
        </div>
      )}
      
      <div className={styles.actions}>
        <button 
          className={`${styles.button} ${styles.detailsButton}`}
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails();
          }}
        >
          View Application Details
        </button>
      </div>
    </div>
  );
};

export default CompanyApplicationCard;
