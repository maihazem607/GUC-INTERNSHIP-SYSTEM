import React from 'react';
import styles from './EvaluationForm.module.css';

interface EvaluationType {
  rating: number;
  comment: string;
  recommended: boolean;
  finalized?: boolean;
}

interface EvaluationFormProps {
  evaluation: EvaluationType;
  setEvaluation: React.Dispatch<React.SetStateAction<EvaluationType>>;
  readOnly?: boolean;
}

const EvaluationForm: React.FC<EvaluationFormProps> = ({ 
  evaluation, 
  setEvaluation,
  readOnly = false
}) => {
  // Consider an evaluation as read-only if explicitly set or if finalized
  const isReadOnly = readOnly || evaluation.finalized;
  return (
    <div className={styles.evaluationForm}>
      <div className={`${styles.formGroup} ${styles.ratingGroup}`}>
        <label className={styles.formLabel}>How would you rate this internship?</label>
        <div className={styles.starRating}>
          {[1, 2, 3, 4, 5].map((star) => (            <button
              key={star}
              type="button"
              className={star <= evaluation.rating ? styles.starActive : styles.star}
              onClick={() => !isReadOnly && setEvaluation({...evaluation, rating: star})}
              disabled={isReadOnly}
            >
              ★
            </button>
          ))}
        </div>
        {evaluation.rating > 0 && (
          <div className={styles.ratingText}>
            {evaluation.rating === 1 && 'Poor'}
            {evaluation.rating === 2 && 'Fair'}
            {evaluation.rating === 3 && 'Good'}
            {evaluation.rating === 4 && 'Very Good'}
            {evaluation.rating === 5 && 'Excellent'}
          </div>
        )}
      </div>
      
      <div className={styles.formGroup}>
        <label className={styles.formLabel} htmlFor="evaluation-comment">Share your experience</label>        
        <textarea
          id="evaluation-comment"
          className={styles.commentTextarea}
          placeholder="Share your experience with this internship... What did you learn? What skills did you develop? What was the work environment like?"
          value={evaluation.comment}
          onChange={(e) => !isReadOnly && setEvaluation({...evaluation, comment: e.target.value})}
          rows={5}
          readOnly={isReadOnly}
        />
      </div>
      
      <label className={styles.recommendationLabel}>        <input
          type="checkbox"
          checked={evaluation.recommended}
          onChange={(e) => !isReadOnly && setEvaluation({...evaluation, recommended: e.target.checked})}
          disabled={isReadOnly}
        />
        I would recommend this internship to other students
      </label>
    </div>
  );
};

export default EvaluationForm;
