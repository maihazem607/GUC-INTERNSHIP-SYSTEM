import React from 'react';
import styles from './EvaluationModal.module.css';
import Modal from '../global/Modal';
import EvaluationForm from './EvaluationForm';
import { Internship } from '../../components/internships/types';

interface MyInternship extends Internship {
  applicationStatus: "none" | "pending" | "accepted" | "rejected" | "finalized" | undefined;
  applicationDate: string;
  evaluation?: {
    rating: number;
    comment: string;
    recommended: boolean;
    finalized?: boolean;
  } | null;
}

interface EvaluationType {
  rating: number;
  comment: string;
  recommended: boolean;
  finalized?: boolean;
}

interface EvaluationModalProps {
  evaluation: EvaluationType;
  setEvaluation: React.Dispatch<React.SetStateAction<EvaluationType>>;
  selectedInternship: MyInternship;
  onClose: () => void;
  onSubmit: () => void;
  onDelete: () => void;
  isSubmitting: boolean;
}

const EvaluationModal: React.FC<EvaluationModalProps> = ({
  evaluation,
  setEvaluation,
  selectedInternship,
  onClose,
  onSubmit,
  onDelete,
  isSubmitting
}) => {  // Prepare action buttons for the modal
  const actions = (
    <>
      {/* Only show delete button if evaluation exists and is not finalized */}
      {selectedInternship.evaluation && !evaluation.finalized && (
        <button 
          className={styles.deleteButton}
          onClick={onDelete}
        >
          Reset
        </button>
      )}
      
      {/* If evaluation is finalized, show a "Finalized" badge instead of buttons */}
      {evaluation.finalized ? (
        <div className={styles.finalizedBadge}>
          <span>Finalized</span>
          <span className={styles.finalizedNote}>(Read-only)</span>
        </div>
      ) : (
        <div className={styles.actionButtonsGroup}>
          <button 
            className={styles.saveDraftButton}
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Draft'}
          </button>
          
          <button 
            className={styles.submitButton}
            onClick={() => {
              if (window.confirm('Once submitted, this evaluation will become read-only and cannot be edited. Continue?')) {
                // Set as finalized before submitting
                evaluation.finalized = true;
                onSubmit();
              }
            }}
            disabled={isSubmitting || evaluation.rating === 0 || evaluation.comment.trim() === ''}
          >
            Submit
          </button>
        </div>
      )}
    </>
  );
  
  return (
    <Modal
      title="Evaluate Your Internship"
      onClose={onClose}
      actions={actions}
    >
      <div className={styles.modalHost}>
        {selectedInternship.logo && (
          <img 
            src={selectedInternship.logo} 
            alt={`${selectedInternship.company} logo`} 
            width={40} 
            height={40} 
            className={styles.modalHostLogo}
          />
        )}
        <span className={styles.modalHostName}>{selectedInternship.company} - {selectedInternship.title}</span>
      </div>
      
      <EvaluationForm 
        evaluation={evaluation}
        setEvaluation={setEvaluation}
      />
    </Modal>
  );
};

export default EvaluationModal;
