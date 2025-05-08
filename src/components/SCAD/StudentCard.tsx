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

const StudentCard: React.FC<StudentCardProps> = ({ name, email, major, gpa, internshipStatus, academicYear, companyName, onViewProfile }) => (
  <div className={styles.card} onClick={onViewProfile} style={{ cursor: 'pointer' }}>
    <div className={styles.cardInner}>
      <div className={styles.cardDate}>
        <span>{academicYear}</span>
      </div>
      <div className={styles.jobTitleContainer}>
        <h3 className={styles.jobTitle}>{name}</h3>
      </div>
      <div className={styles.jobTags}>
        <span className={styles.jobTag}>{major}</span>
        <span className={styles.jobTag}>{gpa} GPA</span>
        {companyName && <span className={styles.jobTag}>{companyName}</span>}
        <span className={styles.jobTag}>{internshipStatus}</span>
      </div>
    </div>
    <div className={styles.cardFooter}>
      <button className={styles.detailsButton} onClick={e => { e.stopPropagation(); onViewProfile && onViewProfile(); }}>
        View Details
      </button>
    </div>
  </div>
);

export default StudentCard;
