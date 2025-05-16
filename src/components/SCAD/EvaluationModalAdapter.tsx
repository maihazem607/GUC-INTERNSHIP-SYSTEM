import React, { useState } from 'react';
import styles from './EvaluationModalAdapter.module.css';
import EvaluationModal from '../MyInternships/EvaluationModal';
import { Evaluation } from './EvaluationList';

interface EvaluationDetailsProps {
  evaluation: Evaluation;
  onClose: () => void;
  onUpdate?: (id: number, performanceRating: number, skillsRating: number, attitudeRating: number, comments: string, recommended: boolean) => void;
  onDelete?: (id: number) => void;
  hideActions?: boolean; // Added prop to hide edit/delete buttons
}

/**
 * Adapter component that uses EvaluationModal for displaying SCAD evaluations
 */
const EvaluationModalAdapter: React.FC<EvaluationDetailsProps> = ({
  evaluation,
  onClose,
  onUpdate,
  onDelete,
  hideActions = false // Default to showing the buttons
}) => {const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Convert the SCAD Evaluation to a format compatible with EvaluationModal
  const adaptedInternship = {
    id: evaluation.id,
    company: evaluation.companyName,
    title: "Software Engineering Intern",
    logo: '/logos/GUCInternshipSystemLogo.png',
    location: "",
    duration: `${evaluation.internshipStartDate} to ${evaluation.internshipEndDate}`,
    applicationStatus: evaluation.status === 'completed' ? 'finalized' : 'accepted',
    applicationDate: evaluation.evaluationDate,
    studentName: evaluation.studentName,
    major: evaluation.major,
    supervisorName: evaluation.supervisorName,
    internshipStartDate: evaluation.internshipStartDate,
    internshipEndDate: evaluation.internshipEndDate,
    evaluationDate: evaluation.evaluationDate,
    evaluation: {
      performanceRating: evaluation.performanceRating || 3,
      skillsRating: evaluation.skillsRating || 3,
      attitudeRating: evaluation.attitudeRating || 3,
      comment: evaluation.comments || "",
      recommended: true,
      finalized: evaluation.status === 'completed'
    }
  };
  
  // Convert the EvaluationType to the expected format
  // Calculate average rating
  const calculateOverallScore = (performance: number, skills: number, attitude: number) => {
    const average = (performance + skills + attitude) / 3;
    // Round to 1 decimal place
    return Math.round(average * 10) / 10;
  };
  
  const performanceRating = evaluation.performanceRating || 3;
  const skillsRating = evaluation.skillsRating || 3;
  const attitudeRating = evaluation.attitudeRating || 3;
  
  // Calculate the rating based on the average of the three ratings
  const calculatedRating = calculateOverallScore(performanceRating, skillsRating, attitudeRating);
  
  // If evaluationScore exists but doesn't match our calculated rating, update it
  if (evaluation.evaluationScore && Math.abs(evaluation.evaluationScore - calculatedRating) > 0.1) {
    evaluation.evaluationScore = calculatedRating;
  }
  
  const [adaptedEvaluation, setAdaptedEvaluation] = useState({
    performanceRating,
    skillsRating,
    attitudeRating,
    comment: evaluation.comments || "",
    recommended: true,
    finalized: evaluation.status === 'completed',
    rating: calculatedRating // Use the calculated rating
  });
    // Handle updates from the EvaluationModal
    const handleSubmit = () => {
    if (onUpdate) {
      setIsSubmitting(true);
      
      // Recalculate the overall score
      const overallScore = calculateOverallScore(
        adaptedEvaluation.performanceRating,
        adaptedEvaluation.skillsRating,
        adaptedEvaluation.attitudeRating
      );
      
      // Call the original onUpdate with the correct parameters
      onUpdate(
        evaluation.id,
        adaptedEvaluation.performanceRating,
        adaptedEvaluation.skillsRating,
        adaptedEvaluation.attitudeRating,
        adaptedEvaluation.comment,
        adaptedEvaluation.recommended
      );
      
      // Update the UI to show the new values
      setAdaptedEvaluation({
        ...adaptedEvaluation,
        rating: (adaptedEvaluation.performanceRating + adaptedEvaluation.skillsRating + adaptedEvaluation.attitudeRating) / 3
      });
      
      setIsSubmitting(false);
    }
  };
  
  // Handle deletion
  const handleDelete = () => {
    if (onDelete) {
      onDelete(evaluation.id);
    }
  };
    return (
    <>
      {/* Use the custom Modal with all the student details */}
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>          <div className={styles.modalHeader}>
            <h2 className={styles.modalTitle}>Intern Evaluation</h2>
            <button className={styles.closeButton} onClick={onClose} aria-label="Close">×</button>
          </div>
          
          <div className={styles.evaluationDetailsWrapper}>
            {/* Display the company info */}
            <div className={styles.modalHost}>
              <img 
                src={'/logos/GUCInternshipSystemLogo.png'} 
                alt={`${evaluation.companyName} logo`} 
                width={40} 
                height={40} 
                className={styles.modalHostLogo}
              />
              <span className={styles.modalHostName}>{evaluation.companyName} - Software Engineering Intern</span>
            </div>
            
            {/* Display the student info section */}
            <div className={styles.studentInfo}>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Student:</span>
                  <span className={styles.value}>{evaluation.studentName}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Major:</span>
                  <span className={styles.value}>{evaluation.major}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Supervisor:</span>
                  <span className={styles.value}>{evaluation.supervisorName}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Start Date:</span>
                  <span className={styles.value}>{evaluation.internshipStartDate}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>End Date:</span>
                  <span className={styles.value}>{evaluation.internshipEndDate}</span>
                </div>                <div className={styles.infoItem}>
                  <span className={styles.label}>Evaluation Date:</span>
                  <span className={styles.value}>{evaluation.evaluationDate}</span>
                </div>
              </div>
            </div>
            
            {/* Use the original EvaluationModal component without its modal container */}            <div className={styles.evaluationSection}>
              {/* Display rating information */}
              <div className={styles.ratingSection}>
                <h3 className={styles.sectionTitle}>Intern Performance Evaluation</h3>
                <div className={styles.ratingItems}>
                  <div className={styles.ratingItem}>
                    <span className={styles.ratingLabel}>Technical Skills:</span>
                    <div className={styles.ratingValue}>
                      <div className={styles.ratingStars}>
                        {Array(5).fill(0).map((_, i) => (
                          <span 
                            key={i} 
                            className={i < adaptedEvaluation.skillsRating ? styles.starFilled : styles.starEmpty}
                            onClick={isEditMode ? () => setAdaptedEvaluation({
                              ...adaptedEvaluation,
                              skillsRating: i + 1
                            }) : undefined}
                            style={isEditMode ? { cursor: 'pointer' } : {}}
                            aria-hidden="true"
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className={styles.ratingNumber}>{adaptedEvaluation.skillsRating}/5</span>
                    </div>
                  </div>
                  
                  <div className={styles.ratingItem}>
                    <span className={styles.ratingLabel}>Work Performance:</span>
                    <div className={styles.ratingValue}>
                      <div className={styles.ratingStars}>
                        {Array(5).fill(0).map((_, i) => (
                          <span 
                            key={i} 
                            className={i < adaptedEvaluation.performanceRating ? styles.starFilled : styles.starEmpty}
                            onClick={isEditMode ? () => setAdaptedEvaluation({
                              ...adaptedEvaluation,
                              performanceRating: i + 1
                            }) : undefined}
                            style={isEditMode ? { cursor: 'pointer' } : {}}
                            aria-hidden="true"
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className={styles.ratingNumber}>{adaptedEvaluation.performanceRating}/5</span>
                    </div>
                  </div>
                  
                  <div className={styles.ratingItem}>
                    <span className={styles.ratingLabel}>Professional Attitude:</span>
                    <div className={styles.ratingValue}>
                      <div className={styles.ratingStars}>
                        {Array(5).fill(0).map((_, i) => (
                          <span 
                            key={i} 
                            className={i < adaptedEvaluation.attitudeRating ? styles.starFilled : styles.starEmpty}
                            onClick={isEditMode ? () => setAdaptedEvaluation({
                              ...adaptedEvaluation,
                              attitudeRating: i + 1
                            }) : undefined}
                            style={isEditMode ? { cursor: 'pointer' } : {}}
                            aria-hidden="true"
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className={styles.ratingNumber}>{adaptedEvaluation.attitudeRating}/5</span>
                    </div>
                  </div>                  
                  <div className={styles.ratingItem}>
                    <span className={styles.ratingLabel}>Overall Rating:</span>
                    <div className={styles.ratingValue}>
                      <div className={styles.ratingStars}>
                        {Array(5).fill(0).map((_, i) => {
                          // For the overall score, allow half stars
                          const rating = adaptedEvaluation.rating;
                          const isFullStar = i < Math.floor(rating);
                          const isHalfStar = !isFullStar && (i < Math.ceil(rating) && (rating % 1) >= 0.5);
                          
                          return (
                            <span 
                              key={i} 
                              className={isFullStar ? styles.starFilled : (isHalfStar ? styles.starHalf : styles.starEmpty)}
                              aria-hidden="true"
                            >
                              ★
                            </span>
                          );
                        })}
                      </div>
                      <span className={styles.ratingNumber}>{adaptedEvaluation.rating}/5</span>
                    </div>
                  </div>
                </div>
              </div>                
              <div className={styles.commentsSection}>
                <h4 className={styles.commentsTitle}>Performance Feedback</h4>
                {isEditMode ? (
                  <textarea
                    className={styles.commentTextarea}
                    value={adaptedEvaluation.comment || ""}
                    onChange={(e) => setAdaptedEvaluation({
                      ...adaptedEvaluation,
                      comment: e.target.value
                    })}
                    rows={8}
                  />
                ) : (                  <p className={styles.commentsText}>
                    {adaptedEvaluation.comment || ""}
                  </p>
                )}
              </div>
            </div>
              {/* Actions */}            <div className={styles.actionsContainer}>
              {/* Edit Mode - Always show save/cancel buttons when in edit mode */}
              {isEditMode && (
                <>
                  <button 
                    className={styles.actionButtonsClose}
                    onClick={() => {
                      handleSubmit(); 
                      setIsEditMode(false);
                    }}
                    type="button"
                  >
                    Save Changes
                  </button>
                  <button 
                    className={styles.actionButtonOutline}
                    onClick={() => setIsEditMode(false)}
                    type="button"
                  >
                    Cancel
                  </button>
                </>
              )}
              
              {/* View Mode - Conditionally show edit/delete buttons based on hideActions prop */}
              {!isEditMode && (
                <>
                  {!hideActions && onUpdate && (
                    <button 
                      className={styles.editButton}
                      onClick={() => setIsEditMode(true)}
                      type="button"
                    >
                      Edit
                    </button>
                  )}
                  {!hideActions && onDelete && (
                    <button 
                      className={styles.deleteButton}
                      onClick={handleDelete}
                      type="button"
                    >
                      Delete
                    </button>
                  )}
                  <button 
                    className={styles.actionButtonsClose}
                    onClick={onClose}
                    type="button"
                  >
                    Close
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EvaluationModalAdapter;
