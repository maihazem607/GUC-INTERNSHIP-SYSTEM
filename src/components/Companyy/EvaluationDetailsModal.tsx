import React, { useState, useEffect } from "react";
import styles from "./EvaluationDetailsModal.module.css";
import Modal from "../global/Modal";
import { Evaluation } from "../SCAD/EvaluationList";
import { MessageSquareText, Award } from "lucide-react";

interface EvaluationDetailsModalProps {
  evaluation: Evaluation;
  onClose: () => void;
  onUpdate?: (id: string, performanceRating: number, skillsRating: number, attitudeRating: number, comments: string) => void;
  onDelete?: (id: string) => void;
  isEditingEvaluation?: boolean; // Add this prop to toggle button text
}

const EvaluationDetailsModal: React.FC<EvaluationDetailsModalProps> = ({
  evaluation,
  onClose,
  onUpdate,
  onDelete,
  isEditingEvaluation = false // Default to false if not provided
}) => {
  // State to track edited values
  const [editedPerformanceRating, setEditedPerformanceRating] = useState<number>(evaluation?.performanceRating || 0);
  const [editedSkillsRating, setEditedSkillsRating] = useState<number>(evaluation?.skillsRating || 0);
  const [editedAttitudeRating, setEditedAttitudeRating] = useState<number>(evaluation?.attitudeRating || 0);
  const [editedComments, setEditedComments] = useState<string>(evaluation?.comments || '');
  
  // Update local state when evaluation prop changes
  useEffect(() => {
    setEditedPerformanceRating(evaluation?.performanceRating || 0);
    setEditedSkillsRating(evaluation?.skillsRating || 0);
    setEditedAttitudeRating(evaluation?.attitudeRating || 0);
    setEditedComments(evaluation?.comments || '');
  }, [evaluation]);
  
  // Safe access to properties with null/undefined checks
  const calculateOverallScore = () => {
    const performanceRating = isEditingEvaluation ? editedPerformanceRating : (evaluation?.performanceRating || 0);
    const skillsRating = isEditingEvaluation ? editedSkillsRating : (evaluation?.skillsRating || 0);
    const attitudeRating = isEditingEvaluation ? editedAttitudeRating : (evaluation?.attitudeRating || 0);
    
    const average = (performanceRating + skillsRating + attitudeRating) / 3;
    return Math.round(average * 10) / 10;
  };
  
  // Handle star click when in edit mode
  const handleStarClick = (rating: number, type: 'performance' | 'skills' | 'attitude') => {
    if (!isEditingEvaluation) return;
    
    switch (type) {
      case 'performance':
        setEditedPerformanceRating(rating);
        break;
      case 'skills':
        setEditedSkillsRating(rating);
        break;
      case 'attitude':
        setEditedAttitudeRating(rating);
        break;
    }
  };
  
  const renderStars = (rating: number = 0, type: 'performance' | 'skills' | 'attitude') => {
    const stars = [];
    const currentRating = isEditingEvaluation 
      ? (type === 'performance' ? editedPerformanceRating : 
         type === 'skills' ? editedSkillsRating : editedAttitudeRating)
      : rating;
      
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span 
          key={i} 
          className={`${i <= currentRating ? styles.starFilled : styles.starEmpty} ${isEditingEvaluation ? styles.starClickable : ''}`}
          onClick={() => handleStarClick(i, type)}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <Modal title="Evaluation Details" onClose={onClose} width="750px">
      <div className={styles.evaluationDetailsWrapper}>
        {/* Company Information Section */}
        <div className={styles.modalHost}>
          <div className={styles.modalHostLogo}>
            {evaluation.companyName?.charAt(0) || 'C'}
          </div>
          <div className={styles.modalHostName}>
            {evaluation.companyName || 'Company'}
          </div>
        </div>
        
        {/* Student Information Section */}
        <div className={styles.studentInfo}>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.label}>Student</span>
              <span className={styles.value}>{evaluation.studentName || 'Student'}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Major</span>
              <span className={styles.value}>{evaluation.major || 'Computer Science'}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Supervisor</span>
              <span className={styles.value}>{evaluation.supervisorName || 'N/A'}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Start Date</span>
              <span className={styles.value}>{evaluation.internshipStartDate || 'N/A'}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>End Date</span>
              <span className={styles.value}>{evaluation.internshipEndDate || 'N/A'}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Evaluation Date</span>
              <span className={styles.value}>{evaluation.evaluationDate || 'N/A'}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.label}>Status</span>
              <span className={styles.value}>{evaluation.status ? evaluation.status.toUpperCase() : 'PENDING'}</span>
            </div>
          </div>
        </div>
        
        {/* Performance Evaluation Section */}
        <div className={styles.evaluationSection}>
          <h3 className={styles.sectionTitle}>Performance Evaluation</h3>
          <div className={styles.ratingSection}>
            <div className={styles.ratingItems}>
              <div className={styles.ratingItem}>
                <div className={styles.ratingLabel}>Technical Skills</div>
                <div className={styles.ratingValue}>
                  <div className={styles.ratingStars}>
                    {renderStars(evaluation.skillsRating, 'skills')}
                  </div>
                  <span className={styles.ratingNumber}>
                    {isEditingEvaluation ? editedSkillsRating : (evaluation.skillsRating || 0)}/5
                  </span>
                </div>
              </div>
              
              <div className={styles.ratingItem}>
                <div className={styles.ratingLabel}>Work Performance</div>
                <div className={styles.ratingValue}>
                  <div className={styles.ratingStars}>
                    {renderStars(evaluation.performanceRating, 'performance')}
                  </div>
                  <span className={styles.ratingNumber}>
                    {isEditingEvaluation ? editedPerformanceRating : (evaluation.performanceRating || 0)}/5
                  </span>
                </div>
              </div>
              
              <div className={styles.ratingItem}>
                <div className={styles.ratingLabel}>Professional Attitude</div>
                <div className={styles.ratingValue}>
                  <div className={styles.ratingStars}>
                    {renderStars(evaluation.attitudeRating, 'attitude')}
                  </div>
                  <span className={styles.ratingNumber}>
                    {isEditingEvaluation ? editedAttitudeRating : (evaluation.attitudeRating || 0)}/5
                  </span>
                </div>
              </div>
              
              <div className={styles.ratingItem}>
                <div className={styles.ratingLabel}>Overall Rating</div>
                <div className={styles.ratingValue}>
                  <span className={styles.overallScore}>
                    {calculateOverallScore()} <Award size={20} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Comments Section */}
        <div className={styles.commentsSection}>
          <div className={styles.commentsTitle}>
            Supervisor's Comments
          </div>
          {isEditingEvaluation ? (
            <textarea
              className={styles.commentsTextarea}
              value={editedComments}
              onChange={(e) => setEditedComments(e.target.value)}
              placeholder="Add your comments here..."
              rows={4}
            />
          ) : (
            evaluation.comments ? (
              <div className={styles.commentsText}>{evaluation.comments}</div>
            ) : (
              <div className={styles.noComments}>No comments provided</div>
            )
          )}
        </div>
        
        {/* Action Buttons */}
        {(onUpdate || onDelete) && (
          <div className={styles.actionsContainer}>
            <div className={styles.actionButtonsGroup}>
              {onUpdate && (                <button
                  className={isEditingEvaluation ? styles.saveButton : styles.editButton}
                  onClick={() => onUpdate(
                    String(evaluation.id),
                    Number(editedPerformanceRating) || 0,
                    Number(editedSkillsRating) || 0,
                    Number(editedAttitudeRating) || 0,
                    editedComments || ''
                  )}
                >
                  {isEditingEvaluation ? 'Save Changes' : 'Edit Evaluation'}
                </button>
              )}
              {onDelete && (
                <button
                  className={styles.deleteButton}
                  onClick={() => onDelete(String(evaluation.id))}
                >
                  Delete Evaluation
                </button>
              )}
              <button className={styles.actionButtonsClose} onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default EvaluationDetailsModal;
