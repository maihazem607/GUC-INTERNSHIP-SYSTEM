import React, { useState } from "react";
import styles from "./EvaluationDetails.module.css";
import { Evaluation } from "./EvaluationList";

interface EvaluationDetailsProps {
  evaluation: Evaluation;
  onClose: () => void;
  onUpdate?: (id: number, score: number, comments: string) => void;
  onDelete?: (id: number) => void;
}

const EvaluationDetails: React.FC<EvaluationDetailsProps> = ({
  evaluation,
  onClose,
  onUpdate,
  onDelete
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [score, setScore] = useState(evaluation.evaluationScore);
  const [comments, setComments] = useState(""); // You'd load actual comments here
  
  const handleUpdate = () => {
    if (onUpdate) {
      onUpdate(evaluation.id, score, comments);
      setIsEditing(false);
    }
  };
  
  const handleDelete = () => {
    if (onDelete && confirm("Are you sure you want to delete this evaluation?")) {
      onDelete(evaluation.id);
      onClose();
    }
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Evaluation Report</h2>
          <div className={styles.modalCompany}>
            <span className={styles.modalCompanyName}>{evaluation.companyName}</span>
          </div>
        </div>
        
        <div className={styles.modalInfo}>
          <div className={styles.modalInfoItem}>
            <div className={styles.modalInfoLabel}>Student</div>
            <div className={styles.modalInfoValue}>{evaluation.studentName}</div>
          </div>
          <div className={styles.modalInfoItem}>
            <div className={styles.modalInfoLabel}>Major</div>
            <div className={styles.modalInfoValue}>{evaluation.major}</div>
          </div>
          <div className={styles.modalInfoItem}>
            <div className={styles.modalInfoLabel}>Supervisor</div>
            <div className={styles.modalInfoValue}>{evaluation.supervisorName}</div>
          </div>
          <div className={styles.modalInfoItem}>
            <div className={styles.modalInfoLabel}>Start Date</div>
            <div className={styles.modalInfoValue}>{evaluation.internshipStartDate}</div>
          </div>
          <div className={styles.modalInfoItem}>
            <div className={styles.modalInfoLabel}>End Date</div>
            <div className={styles.modalInfoValue}>{evaluation.internshipEndDate}</div>
          </div>
          <div className={styles.modalInfoItem}>
            <div className={styles.modalInfoLabel}>Evaluation Date</div>
            <div className={styles.modalInfoValue}>{evaluation.evaluationDate}</div>
          </div>
          <div className={styles.modalInfoItem}>
            <div className={styles.modalInfoLabel}>Status</div>
            <div className={styles.modalInfoValue}>{evaluation.status}</div>
          </div>
        </div>
        
        {!isEditing ? (
          <div className={styles.modalDescription}>
            <h3>Performance Evaluation</h3>
            <p><strong>Score:</strong> {evaluation.evaluationScore}/10</p>
            <p><strong>Comments:</strong> {comments || "No comments provided."}</p>
          </div>
        ) : (
          <div className={styles.modalDescription}>
            <h3>Edit Evaluation</h3>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Score (1-10)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={score}
                onChange={(e) => setScore(Number(e.target.value))}
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Comments</label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className={styles.textarea}
                rows={4}
              />
            </div>
          </div>
        )}
        
        <div className={styles.modalActions}>
          {!isEditing ? (
            <>
              {onUpdate && (
                <button
                  className={`${styles.applyButton} ${styles.editButton}`}
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  className={`${styles.applyButton} ${styles.deleteButton}`}
                  onClick={handleDelete}
                >
                  Delete
                </button>
              )}
            </>
          ) : (
            <>
              <button
                className={styles.applyButton}
                onClick={handleUpdate}
              >
                Update
              </button>
              <button
                className={`${styles.applyButton} ${styles.cancelButton}`}
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EvaluationDetails;