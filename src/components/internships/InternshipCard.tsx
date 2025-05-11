import React from 'react';
import Image from "next/image";
import styles from './InternshipCard.module.css';
import { Internship } from './types';

interface InternshipCardProps {
  internship: Internship;
  isStarred: boolean;
  onToggleStar: (id: number) => void;
  onViewDetails: (internship: Internship) => void;
}

const getCardBackground = (id: number): string => {
  const colors = [
    '#ffe8f0', '#e8f3ff', '#e8ffe8', '#fff0e8', '#f0e8ff',
    '#e8fff0', '#fff8e8', '#e8f0ff', '#ffe8e8', '#e8ffea',
    '#f0ffe8', '#fff0f0'
  ];
  return colors[id % colors.length];
};

const InternshipCard: React.FC<InternshipCardProps> = ({ 
  internship, 
  isStarred, 
  onToggleStar, 
  onViewDetails 
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardInner} style={{ backgroundColor: getCardBackground(internship.id) }}>
        <div className={styles.cardDate}>
          <span>{internship.date}</span>
          <button 
            className={isStarred ? styles.bookmarkActive : styles.bookmark}
            onClick={() => onToggleStar(internship.id)}
          >
            {isStarred ? '⭐' : '☆'}
          </button>
        </div>
        
        <div className={styles.companyInfo}>
          <span className={styles.companyName}>{internship.company}</span>
        </div>
        
        <div className={styles.jobTitleContainer}>
          <h3 className={styles.jobTitle}>{internship.title}</h3>
          {internship.logo && (
            <div className={styles.companyLogo}>
              <Image src={internship.logo} alt={`${internship.company} logo`} width={30} height={30} />
            </div>
          )}
        </div>
        
        <div className={styles.jobTags}>
          <span className={styles.jobTag}>{internship.duration}</span>
          <span className={styles.jobTag}>{internship.industry}</span>
          <span className={styles.jobTag}>{internship.isPaid ? 'Paid' : 'Unpaid'}</span>
        </div>
      </div>
      
      <div className={styles.cardFooter}>
        <div className={styles.jobMeta}>
          <div className={styles.salary}>{internship.salary}</div>
          <div className={styles.location}>{internship.location}</div>
        </div>
        <button 
          className={styles.detailsButton}
          onClick={() => onViewDetails(internship)}
        >
          Details
        </button>
      </div>
    </div>
  );
};

export default InternshipCard;