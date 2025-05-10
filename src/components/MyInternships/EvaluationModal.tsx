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
  } | null;
}

interface EvaluationType {
  rating: number;
  comment: string;
  recommended: boolean;
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
      {selectedInternship.evaluation && (
        <button 
          className={styles.deleteButton}
          onClick={onDelete}
        >
          Reset
        </button>
      )}
      <button 
        className={styles.submitButton}
        onClick={onSubmit}
        disabled={isSubmitting || evaluation.rating === 0 || evaluation.comment.trim() === ''}
      >
        {isSubmitting ? (
          <span>Processing...</span>
        ) : (
          selectedInternship.evaluation ? 'Update' : 'Submit'
        )}
      </button>
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
