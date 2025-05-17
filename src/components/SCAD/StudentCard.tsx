import React from "react";
import styles from "./StudentCard.module.css";

export interface StudentCardProps {
  name: string;
  email: string;
  major: string;
  gpa: number;
  internshipStatus: string;
  academicYear: string;
  companyName?: string;
  onViewProfile?: () => void;
}

const getCardBackground = (name: string): string => {
  const colors = [
    '#f0e8ff', '#e8fff0', '#fff8e8', '#e8f0ff', '#ffe8e8', 
    '#e8ffea', '#f0ffe8', '#fff0f0'
  ];
  // Simple hash function to get consistent colors for the same name
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

const StudentCard: React.FC<StudentCardProps> = ({ 
  name, 
  email, 
  major, 
  gpa, 
  internshipStatus, 
  academicYear, 
  companyName, 
  onViewProfile 
}) => (
  <div className={styles.card} onClick={onViewProfile} style={{ cursor: 'pointer' }}>
    <div className={styles.cardInner} style={{ backgroundColor: getCardBackground(name) }}>
      <div className={styles.cardDate}>
        <span>{academicYear}</span>
        <span className={styles.score}>{gpa} GPA</span>
      </div>
      
      {companyName && (
        <div className={styles.companyInfo}>
          <span className={styles.companyName}>{companyName}</span>
        </div>
      )}
      
      <div className={styles.jobTitleContainer}>
        <h3 className={styles.jobTitle}>{name}</h3>
      </div>
      
      <div className={styles.jobTags}>
        <span className={styles.jobTag}>{major}</span>
        <span className={styles.jobTag}>{internshipStatus}</span>
      </div>
    </div>
    
    <div className={styles.cardFooter}>
      <div className={styles.jobMeta}>
        <div className={styles.salary}>{email}</div>
        <div className={styles.location}>Contact</div>
      </div>
      <button 
        className={styles.detailsButton}
        onClick={(e) => {
          e.stopPropagation();
          onViewProfile && onViewProfile();
        }}
      >
        Details
      </button>
    </div>
  </div>
);

export default StudentCard;
