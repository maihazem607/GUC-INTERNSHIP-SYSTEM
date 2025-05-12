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
  
  return (
    <Modal
      title={title}
      onClose={onClose}
      width="600px"      actions={
        <div className={styles.modalActions}>          {isViewMode ? (
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
      }    >      <div className={styles.evaluationForm}>
        {isViewMode && (
          <div className={styles.modeIndicator}>
            View Mode
          </div>
        )}
        <div className={styles.formGroup}>
          <label>Performance Rating (1-5)</label>
          <input
            type="range"
            min="1"
            max="5"
            value={evaluation.performanceRating}
            onChange={(e) => setEvaluation({
              ...evaluation,
              performanceRating: parseInt(e.target.value)
            })}
            disabled={isViewMode}
          />          <span>{evaluation.performanceRating}/5</span>
        </div>
        
        <div className={styles.formGroup}>
          <label>Skills Rating (1-5)</label>
          <input
            type="range"
            min="1"
            max="5"
            value={evaluation.skillsRating}
            onChange={(e) => setEvaluation({
              ...evaluation,
              skillsRating: parseInt(e.target.value)
            })}
            disabled={isViewMode}
          />          <span>{evaluation.skillsRating}/5</span>
        </div>
        
        <div className={styles.formGroup}>
          <label>Attitude Rating (1-5)</label>
          <input
            type="range"
            min="1"
            max="5"
            value={evaluation.attitudeRating}
            onChange={(e) => setEvaluation({
              ...evaluation,
              attitudeRating: parseInt(e.target.value)
            })}
            disabled={isViewMode}
          />          <span>{evaluation.attitudeRating}/5</span>
        </div>
        
        <div className={styles.formGroup}>
          <label>Comments</label>
          <textarea
            value={evaluation.comments}
            onChange={(e) => setEvaluation({
              ...evaluation,
              comments: e.target.value
            })}
            rows={5}
            placeholder="Provide detailed feedback about the intern's performance..."
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
            <p className={styles.helpText}>Click the "Edit Evaluation" button to make changes.</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default EvaluationModal;