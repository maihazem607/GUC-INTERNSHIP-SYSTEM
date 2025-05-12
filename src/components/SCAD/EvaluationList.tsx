import React from 'react';
import Image from "next/image";
import styles from './EvaluationList.module.css';

export interface Evaluation {
  id: number;
  studentName: string;
  studentId: number;
  companyName: string;
  major: string;
  supervisorName: string;
  internshipStartDate: string;
  internshipEndDate: string;
  evaluationDate: string;
  evaluationScore: number;
  performanceRating?: number;
  skillsRating?: number;
  attitudeRating?: number;
  comments?: string;
  status: 'completed' | 'pending';
}

interface EvaluationCardProps {
  evaluation: Evaluation;
  onViewDetails: (evaluation: Evaluation) => void;
}

const getCardBackground = (id: number): string => {
  const colors = [
    '#f0e8ff', '#e8fff0', '#fff8e8', '#e8f0ff', '#ffe8e8', 
    '#e8ffea', '#f0ffe8', '#fff0f0'
  ];
  return colors[id % colors.length];
};

const EvaluationCard: React.FC<EvaluationCardProps> = ({ 
  evaluation, 
  onViewDetails 
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardInner} style={{ backgroundColor: getCardBackground(evaluation.id) }}>
        <div className={styles.cardDate}>
          <span>{evaluation.evaluationDate}</span>
          <span className={styles.score}>{evaluation.evaluationScore}/10</span>
        </div>
        
        <div className={styles.companyInfo}>
          <span className={styles.companyName}>{evaluation.companyName}</span>
        </div>
        
        <div className={styles.jobTitleContainer}>
          <h3 className={styles.jobTitle}>{evaluation.studentName}</h3>
        </div>
        
        <div className={styles.jobTags}>
          <span className={styles.jobTag}>{evaluation.major}</span>
          <span className={styles.jobTag}>{evaluation.status}</span>
        </div>
      </div>
      
      <div className={styles.cardFooter}>
        <div className={styles.jobMeta}>
          <div className={styles.salary}>{evaluation.supervisorName}</div>
          <div className={styles.location}>Supervisor</div>
        </div>
        <button 
          className={styles.detailsButton}
          onClick={() => onViewDetails(evaluation)}
        >
          Details
        </button>
      </div>
    </div>
  );
};

export default EvaluationCard;