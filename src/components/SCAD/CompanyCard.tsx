import React from "react";
import styles from "./CompanyCard.module.css";

export interface CompanyCardProps {
  name: string;
  industry: string;
  applicationDate: string;
  status: "pending" | "accepted" | "rejected";
  onViewDetails?: () => void;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ name, industry, applicationDate, status, onViewDetails }) => (
  <div className={styles.card} onClick={onViewDetails} style={{ cursor: 'pointer' }}>
    <div className={styles.cardInner}>
      <div className={styles.cardDate}>
        <span>{applicationDate}</span>
      </div>
      <div className={styles.jobTitleContainer}>
        <h3 className={styles.jobTitle}>{name}</h3>
      </div>
      <div className={styles.jobTags}>
        <span className={styles.jobTag}>{industry}</span>
        <span className={styles.jobTag + ' ' + styles[status]}>{status.toUpperCase()}</span>
      </div>
    </div>
    <div className={styles.cardFooter}>
      <button className={styles.detailsButton} onClick={e => { e.stopPropagation(); onViewDetails && onViewDetails(); }}>
        View Details
      </button>
    </div>
  </div>
);

export default CompanyCard;
