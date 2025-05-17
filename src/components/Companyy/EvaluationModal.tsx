import React from "react";
import styles from "./EvaluationModal.module.css";
import Modal from "../global/Modal";

interface Evaluation {
  id: string;
  evaluationDate: Date;
  internId: string;
  performanceRating: number;
  skillsRating: number;
  attitudeRating: number;
  comments: string;
}

interface EvaluationModalProps {
  title: string;
  onClose: () => void;
  onSubmit: () => void;
  intern: {
    id: string;
    name: string;
    evaluation?: Evaluation;
  };
  evaluation: {
    performanceRating: number;
    skillsRating: number;
    attitudeRating: number;
    comments: string;
  };
  setEvaluation: React.Dispatch<React.SetStateAction<any>>;
  onEditMode?: () => void; // Prop for switching to edit mode
  onDelete?: () => void;   // Prop for deleting an evaluation
}

const EvaluationModal: React.FC<EvaluationModalProps> = ({
  title,
  onClose,
  onSubmit,
  intern,
  evaluation,
  setEvaluation,
  onEditMode,
  onDelete
}) => {
  // Check if we're in view mode (when the intern already has an evaluation)
  const isViewMode = !!intern.evaluation;
  
  // Scroll handler for evaluation form
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [showScrollIndicator, setShowScrollIndicator] = React.useState(true);
  
  React.useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const { scrollTop } = scrollRef.current;
        if (scrollTop > 30) {
          setShowScrollIndicator(false);
        } else {
          setShowScrollIndicator(true);
        }
      }
    };
    
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      return () => scrollElement.removeEventListener('scroll', handleScroll);
    }
  }, []);
    // Function to render star ratings
  const renderStarRating = (rating: number, category: 'performanceRating' | 'skillsRating' | 'attitudeRating') => {
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span 
          key={i} 
          className={`${styles.star} ${!isViewMode ? styles.clickableStar : ''} ${i <= rating ? styles.starActive : styles.starInactive}`} 
          onClick={() => {
            if (!isViewMode) {
              setEvaluation({
                ...evaluation,
                [category]: i
              });
            }
          }}
          aria-label={`${i} star${i !== 1 ? 's' : ''}`}
        >
          ★
        </span>
      );
    }
    
    return (
      <div className={styles.starRatingContainer}>
        {stars}
        <span className={styles.ratingValue}>{rating}/5</span>
      </div>
    );
  };
    return (
    <Modal
      title={title}
      onClose={onClose}
      width="750px"
      actions={
        <div className={styles.modalActions}>
          {isViewMode ? (
            <>
              <button 
                className={styles.editButton} 
                onClick={onEditMode}
              >
                Edit
              </button>
              {onDelete && (
                <button
                  className={styles.deleteButton}
                  onClick={onDelete}
                >
                  Delete
                </button>
              )}
              <button 
                className={styles.actionButtonOutline} 
                onClick={onClose}
              >
                Close
              </button>
            </>
          ) : (
            <>
              <button 
                className={styles.actionButton} 
                onClick={onSubmit}
              >
                Submit Evaluation
              </button>
              <button 
                className={styles.actionButtonOutline}
                onClick={onClose}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      }
    >
      <div className={styles.evaluationForm} ref={scrollRef}>
        {isViewMode && (
          <div className={styles.modeIndicator}>
            View Mode
          </div>
        )}        <div className={styles.evaluationSummary}>
          <h3>Evaluating: <span>{intern.name}</span></h3>
          <div className={styles.evaluationMeta}>
            {isViewMode ? (
              <div className={styles.evaluationBadge}>Completed Evaluation</div>
            ) : (
              <div className={styles.evaluationBadge}>New Evaluation</div>
            )}
          </div>
          <p className={styles.evaluationDescription}>
            Please rate the intern's performance across the following categories:
          </p>          {showScrollIndicator && (
            <div className={styles.scrollIndicator}>
              <span>Scroll for more details</span>
              <div className={styles.scrollArrow}>↓</div>
            </div>
          )}
        </div>
        
        <div className={styles.ratingCategories}>          <div className={styles.formGroup}>
            <label>Technical Skills</label>
            {renderStarRating(evaluation.skillsRating, 'skillsRating')}
            <p className={styles.ratingDescription}>
              Evaluate the technical skills and competencies demonstrated during the internship period.
            </p>
          </div>
          
          <div className={styles.formGroup}>
            <label>Work Performance</label>
            {renderStarRating(evaluation.performanceRating, 'performanceRating')}
            <p className={styles.ratingDescription}>
              Assess the intern's ability to complete assigned tasks and meet objectives effectively.
            </p>
          </div>
          
          <div className={styles.formGroup}>
            <label>Professional Attitude</label>
            {renderStarRating(evaluation.attitudeRating, 'attitudeRating')}
            <p className={styles.ratingDescription}>
              Rate the intern's work ethic, communication, professionalism, and response to feedback.
            </p>
          </div>
        </div>
          <div className={`${styles.formGroup} ${styles.commentsSection}`}>
          <label>Supervisor's Comments</label>
          <textarea
            value={evaluation.comments}
            onChange={(e) => setEvaluation({
              ...evaluation,
              comments: e.target.value
            })}
            rows={6}
            placeholder="Provide detailed feedback about the intern's performance, strengths, areas for improvement, and any specific recommendations..."
            readOnly={isViewMode}
            className={isViewMode ? styles.readOnlyTextarea : ''}
          />
        </div>
        
        {isViewMode && intern.evaluation && (
          <div className={styles.evaluationDate}>
            <p><strong>Evaluation submitted on:</strong> {new Date(intern.evaluation.evaluationDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</p>
            <p className={styles.helpText}>Click the "Edit" button to make changes to this evaluation.</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default EvaluationModal;