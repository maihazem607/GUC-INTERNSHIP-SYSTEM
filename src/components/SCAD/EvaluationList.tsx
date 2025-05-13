import React from 'react';
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

export interface EvaluationTableProps {
  evaluations: Evaluation[];
  onViewDetails: (evaluation: Evaluation) => void;
}

// Helper function for getting background colors (preserved from original)
const getCardBackground = (id: number): string => {
  const colors = [
    '#f0e8ff', '#e8fff0', '#fff8e8', '#e8f0ff', '#ffe8e8', 
    '#e8ffea', '#f0ffe8', '#fff0f0'
  ];
  return colors[id % colors.length];
};

// Helper function to get row background color based on row index
const getRowBackground = (id: number): string => {
  const pastelColors = [
    'rgba(230, 230, 250, 0.3)', // Pastel Purple
    'rgba(255, 255, 224, 0.3)', // Pastel Yellow
    'rgba(240, 255, 240, 0.3)', // Pastel Green
    'rgba(230, 240, 255, 0.3)', // Pastel Blue
  ];
  return pastelColors[id % pastelColors.length];
};

// Helper function to get score color based on the score value
const getScoreColor = (score: number): string => {
  if (score <= 4) {
    return 'score-low'; // Red for low scores (0-4)
  } else if (score <= 7) {
    return 'score-medium'; // Orange for medium scores (5-7)
  } else if (score < 9) {
    return 'score-high'; // Green for high scores (8-8.9)
  } else {
    return 'score-excellent'; // Blue for excellent scores (9-10)
  }
};

// List view for evaluations using a table layout similar to ReportTable
const EvaluationTable: React.FC<EvaluationTableProps> = ({ evaluations, onViewDetails }) => (
  <div className={styles.evaluationCardContainer}>
    {evaluations && evaluations.length > 0 ? (      <table className={styles.studentsTable}> 
        <tbody>
          {evaluations.map((evaluation) => {
            return (
              <tr 
                key={evaluation.id} 
                className={styles.studentRow} 
                onClick={() => onViewDetails(evaluation)}
                style={{ backgroundColor: getRowBackground(evaluation.id) }}
              >
                {/* Student Name and ID Column */}
                <td>
                  <div className={styles.studentProfile}>
                    <div className={styles.studentAvatar}>
                      {evaluation.studentName.charAt(0)}
                    </div>
                    <div className={styles.studentInfo}>
                      <div className={styles.studentName}>{evaluation.studentName}</div>
                      <div className={styles.studentAge}>ID: {evaluation.studentId}</div>
                    </div>
                  </div>
                </td>
                
                {/* Company Name */}
                <td>
                  <div className={styles.tagContainer}>
                    <span className={styles.tag}>{evaluation.companyName}</span>
                  </div>
                </td>
                
                {/* Major */}
                <td>
                  <div className={styles.majorCell}>
                    {evaluation.major}
                  </div>
                </td>
                
                {/* Evaluation Date and Score */}
                <td>
                  <div className={styles.dateCell}>
                    {evaluation.evaluationDate}
                    <div className={`${styles.scoreTag} ${styles[getScoreColor(evaluation.evaluationScore)]}`}>
                      Score: {evaluation.evaluationScore}/10
                    </div>
                  </div>
                </td>
                
                {/* Status */}
                <td>
                  <div className={styles.tagContainer}>
                    <span 
                      className={`${styles.statusBadge} ${styles[evaluation.status]}`}
                    >
                      {evaluation.status.toUpperCase()}
                    </span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    ) : (
      <div className={styles.noResults}>
        <img 
          src="assets/images/icons/search.png" 
          alt="Search Icon" 
          className={styles.searchIcon} 
        /> 
        <p>No evaluations found matching your criteria.</p>
      </div>
    )}
  </div>
);

// Keep the card view implementation available for backward compatibility
const EvaluationCard: React.FC<{evaluation: Evaluation, onViewDetails: (evaluation: Evaluation) => void}> = ({ 
  evaluation, 
  onViewDetails 
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardInner} style={{ backgroundColor: getCardBackground(evaluation.id) }}>
        <div className={styles.cardDate}>
          <span>{evaluation.evaluationDate}</span>
          <span className={`${styles.score} ${styles[getScoreColor(evaluation.evaluationScore)]}`}>{evaluation.evaluationScore}/10</span>
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

export default EvaluationTable;