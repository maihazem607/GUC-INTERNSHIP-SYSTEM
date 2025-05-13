import React, { useState, useEffect } from "react";
import styles from "./EvaluationDetails.module.css";
import { Evaluation } from "./EvaluationList";

interface EvaluationDetailsProps {
  evaluation: Evaluation;
  onClose: () => void;
  onUpdate?: (id: number, performanceRating: number, skillsRating: number, attitudeRating: number, comments: string) => void;
  onDelete?: (id: number) => void;
}

const EvaluationDetails: React.FC<EvaluationDetailsProps> = ({
  evaluation,
  onClose,
  onUpdate,
  onDelete
}) => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Initialize with values from evaluation or defaults
  const [performanceRating, setPerformanceRating] = useState(evaluation.performanceRating || Math.floor(evaluation.evaluationScore / 2));
  const [skillsRating, setSkillsRating] = useState(evaluation.skillsRating || Math.floor(evaluation.evaluationScore / 2));
  const [attitudeRating, setAttitudeRating] = useState(evaluation.attitudeRating || Math.floor(evaluation.evaluationScore / 2));
  const [comments, setComments] = useState(evaluation.comments || "");
  const [overallScore, setOverallScore] = useState(evaluation.evaluationScore);
  
  // Update state if props change
  useEffect(() => {
    setPerformanceRating(evaluation.performanceRating || Math.floor(evaluation.evaluationScore / 2));
    setSkillsRating(evaluation.skillsRating || Math.floor(evaluation.evaluationScore / 2));
    setAttitudeRating(evaluation.attitudeRating || Math.floor(evaluation.evaluationScore / 2));
    setComments(evaluation.comments || "");
    setOverallScore(evaluation.evaluationScore);
  }, [evaluation]);    const handleUpdate = () => {
    if (onUpdate) {
      // Calculate new overall score based on the three ratings
      const newScore = Math.round(
        (performanceRating + skillsRating + attitudeRating) / 3 * 2
      );
      // Update the overall score to maintain consistency with the list view
      setOverallScore(newScore);
      
      onUpdate(
        evaluation.id, 
        performanceRating, 
        skillsRating, 
        attitudeRating,
        comments
      );
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
        
        {isEditing && (
          <div className={styles.modeIndicator}>
            Edit Mode
          </div>
        )}
        
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
            <div className={styles.evaluationMetrics}>
              <p><strong>Performance Rating:</strong> {performanceRating}/5</p>
              <p><strong>Skills Rating:</strong> {skillsRating}/5</p>
              <p><strong>Attitude Rating:</strong> {attitudeRating}/5</p>
              <p><strong>Overall Score:</strong> {overallScore}/10</p>
            </div>
            <p><strong>Comments:</strong> {comments || "No comments provided."}</p>
          </div>
        ): (
          <div className={styles.modalDescription}>
            <h3>Edit Evaluation</h3>
            <div className={styles.evaluationMetricsEdit}>              <div className={styles.formGroup}>
                <label className={styles.inputLabel}>Performance Rating (1-5)</label>
                <div className={styles.rangeInputContainer}>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={performanceRating}
                    onChange={(e) => setPerformanceRating(Number(e.target.value))}
                    className={styles.rangeInput}
                  />
                  <span>{performanceRating}/5</span>
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.inputLabel}>Skills Rating (1-5)</label>
                <div className={styles.rangeInputContainer}>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={skillsRating}
                    onChange={(e) => setSkillsRating(Number(e.target.value))}
                    className={styles.rangeInput}
                  />
                  <span>{skillsRating}/5</span>
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.inputLabel}>Attitude Rating (1-5)</label>
                <div className={styles.rangeInputContainer}>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={attitudeRating}
                    onChange={(e) => setAttitudeRating(Number(e.target.value))}
                    className={styles.rangeInput}
                  />
                  <span>{attitudeRating}/5</span>
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.inputLabel}>Overall Score</label>
                <div className={styles.calculatedScore}>{overallScore}/10</div>
              </div>
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
              <button
                className={`${styles.applyButton} ${styles.cancelButton}`}
                onClick={onClose}
              >
                Close
              </button>
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