import React from 'react';
import styles from './AssessmentCard.module.css';
import { CheckCircle, Clock, FileText, Star, Award, BarChart2 } from 'lucide-react';
import Image from 'next/image';
import { Assessment } from './types';

interface AssessmentCardProps {
  assessment: Assessment;
  onClick: () => void;
}

const AssessmentCard: React.FC<AssessmentCardProps> = ({ assessment, onClick }) => {
  const {
    title,
    description,
    category,
    difficulty,
    duration,
    questionCount,
    company,
    companyLogo,
    isCompleted,
    score,
    totalPossibleScore
  } = assessment;

  // Calculate score percentage if completed
  const scorePercentage = isCompleted && score !== undefined && totalPossibleScore 
    ? Math.round((score / totalPossibleScore) * 100) 
    : null;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return '#4ade80'; // green
      case 'Intermediate': return '#f59e0b'; // amber
      case 'Advanced': return '#ef4444'; // red
      default: return '#6b7280'; // gray
    }
  };

  return (
    <div className={styles.card} onClick={onClick}>
      {isCompleted && (
        <div className={styles.completedBadge}>
          <CheckCircle size={14} style={{ marginRight: 4 }} />
          Completed
        </div>
      )}

      <div className={styles.cardHeader}>
        <div className={styles.categoryBadge} style={{ backgroundColor: '#eef2ff' }}>
          {category}
        </div>
        <div 
          className={styles.difficultyBadge}
          style={{ 
            backgroundColor: `${getDifficultyColor(difficulty)}15`,
            color: getDifficultyColor(difficulty)
          }}
        >
          <Star size={14} style={{ marginRight: 4 }} />
          {difficulty}
        </div>
      </div>

      <h3 className={styles.title}>{title}</h3>
      
      <p className={styles.description}>{description}</p>

      <div className={styles.details}>
        <div className={styles.detailItem}>
          <Clock size={16} className={styles.detailIcon} />
          <span>{duration}</span>
        </div>
        <div className={styles.detailItem}>
          <FileText size={16} className={styles.detailIcon} />
          <span>{questionCount} Questions</span>
        </div>
      </div>

      {company && (
        <div className={styles.companySection}>
          {companyLogo && (
            <Image 
              src={companyLogo} 
              alt={company}
              width={20} 
              height={20} 
              className={styles.companyLogo}
            />
          )}
          <span className={styles.companyName}>By {company}</span>
        </div>
      )}

      {isCompleted && scorePercentage !== null && (
        <div className={styles.scoreSection}>
          <BarChart2 size={16} className={styles.scoreIcon} />
          <div className={styles.scoreBar}>
            <div 
              className={styles.scoreProgress} 
              style={{ 
                width: `${scorePercentage}%`,
                backgroundColor: scorePercentage >= 70 
                  ? '#4ade80' 
                  : scorePercentage >= 40 
                    ? '#f59e0b' 
                    : '#ef4444'
              }} 
            />
          </div>
          <span className={styles.scoreText}>{scorePercentage}%</span>
        </div>
      )}

      <div className={styles.cardFooter}>
        <button className={styles.startButton}>
          {isCompleted ? 'View Results' : 'Start Assessment'}
        </button>
      </div>
    </div>
  );
};

export default AssessmentCard;
