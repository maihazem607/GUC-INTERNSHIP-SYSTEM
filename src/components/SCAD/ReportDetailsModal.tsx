import React, { useState } from "react";
import styles from "./ReportDetailsModal.module.css";

export interface ReportDetailsModalProps {
  title: string;
  studentName: string;
  major: string;
  companyName: string;
  supervisorName: string;
  internshipStartDate: string;
  internshipEndDate: string;
  submissionDate: string;
  status: string;
  content: string;
  evaluationScore?: number;
  evaluationComments?: string;
  clarificationComment?: string;
  comments?: string[];
  onClose: () => void;
  onAccept?: () => void;
  onFlag?: (comment: string) => void;
  onReject?: (comment: string) => void;
  onAddComment?: (comment: string) => void;
  onDeleteComment?: (index: number) => void;
}

const getStatusColor = (status: string) => {
  switch(status) {
    case 'accepted':
      return '#1aaf5d';
    case 'rejected':
      return '#e74c3c';
    case 'flagged':
      return '#217dbb';  // Changed from yellow to blue
    case 'pending':
      return '#f5b400';  // Changed from default blue to yellow
    default:
      return '#6c757d';  // Changed default to a neutral gray
  }
};

const ReportDetailsModal: React.FC<ReportDetailsModalProps> = ({
  title,
  studentName,
  major,
  companyName,
  supervisorName,
  internshipStartDate,
  internshipEndDate,
  submissionDate,
  status,
  content,
  evaluationScore,
  evaluationComments,
  clarificationComment,
  comments = [], // Default to empty array if not provided
  onClose,
  onAccept,
  onFlag,
  onReject,
  onAddComment,
  onDeleteComment
}) => {
  const [comment, setComment] = React.useState(clarificationComment || '');
  const [allComments, setAllComments] = React.useState<string[]>(comments);
  
  const handleDeleteComment = (index: number) => {
    // Create a new array without the deleted comment
    const updatedComments = [...allComments];
    updatedComments.splice(index, 1);
    setAllComments(updatedComments);
    
    // If parent component provided a delete handler, call it
    if (onDeleteComment) {
      onDeleteComment(index);
    }
  };

  return (
  <div className={styles.modalBackdrop}>
    <div className={styles.modalContent}>
      <button className={styles.closeButton} onClick={onClose}>&times;</button>
      
      <div className={styles.modalHeader}>
        <h2 className={styles.modalTitle}>{title}</h2>
        <div className={styles.modalCompany}>
          <span className={styles.modalCompanyName}>{companyName}</span>
          <span 
            className={styles.statusChip} 
            style={{
              backgroundColor: `${getStatusColor(status)}20`,
              color: getStatusColor(status),
              marginLeft: '10px',
              padding: '4px 10px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 700
            }}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
      </div>
      
      <div className={styles.modalInfo}>
        <div className={styles.modalInfoItem}>
          <div className={styles.modalInfoLabel}>Student</div>
          <div className={styles.modalInfoValue}>{studentName}</div>
        </div>
        <div className={styles.modalInfoItem}>
          <div className={styles.modalInfoLabel}>Major</div>
          <div className={styles.modalInfoValue}>{major}</div>
        </div>
        <div className={styles.modalInfoItem}>
          <div className={styles.modalInfoLabel}>Supervisor</div>
          <div className={styles.modalInfoValue}>{supervisorName}</div>
        </div>
        <div className={styles.modalInfoItem}>
          <div className={styles.modalInfoLabel}>Start Date</div>
          <div className={styles.modalInfoValue}>{internshipStartDate}</div>
        </div>
        <div className={styles.modalInfoItem}>
          <div className={styles.modalInfoLabel}>End Date</div>
          <div className={styles.modalInfoValue}>{internshipEndDate}</div>
        </div>
        <div className={styles.modalInfoItem}>
          <div className={styles.modalInfoLabel}>Submission Date</div>
          <div className={styles.modalInfoValue}>{submissionDate}</div>
        </div>
      </div>
      
      <div className={styles.modalDescription}>
        <h3>Report Content</h3>
        <p>{content}</p>
      </div>
        {(evaluationScore !== undefined || evaluationComments) && status !== 'accepted' && (
        <div className={styles.modalDescription}>
          <h3>Evaluation</h3>
          {evaluationScore !== undefined && (
            <p><strong>Score:</strong> {evaluationScore}/10</p>
          )}
          {evaluationComments && (
            <p><strong>Comments:</strong> {evaluationComments}</p>
          )}
        </div>
      )}
      
      {status === 'pending' && (
        <div className={styles.modalActions}>
          {onAccept && (
            <button 
              className={styles.applyButton}
              onClick={onAccept}
            >
              Accept
            </button>
          )}          {onFlag && (
            <button 
              className={`${styles.applyButton} ${styles.flagButton}`}
              onClick={() => onFlag(comment)}
              style={{backgroundColor: '#217dbb', marginLeft: '10px'}}
              disabled={!comment.trim()}
              title={!comment.trim() ? "Please provide a clarification comment before flagging" : ""}
            >
              Flag
            </button>
          )}
          {onReject && (
            <button 
              className={`${styles.applyButton} ${styles.rejectButton}`}
              onClick={() => onReject(comment)}
              style={{backgroundColor: '#e74c3c', marginLeft: '10px'}}
              disabled={!comment.trim()}
              title={!comment.trim() ? "Please provide a clarification comment before rejecting" : ""}
            >
              Reject
            </button>
          )}
        </div>
      )}
        {/* Show existing clarification comment for flagged or rejected reports */}
      {(status === 'flagged' || status === 'rejected') && clarificationComment && (
        <div className={styles.modalDescription}>
          <h3>Clarification</h3>
          <p className={styles.clarificationText}>{clarificationComment}</p>
        </div>
      )}
      
      {/* Show comment textarea for pending reports before flagging/rejecting */}
      {status === 'pending' && (onFlag || onReject) && (
        <div className={styles.commentSection}>
          <h3>Clarification Comment</h3>
          <textarea
            className={styles.commentTextarea}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Enter your comment explaining why the report is being flagged or rejected..."
            rows={4}
          />
        </div>
      )}
      
      {/* Show comment section for flagged or rejected reports to add additional comments */}
      {(status === 'flagged' || status === 'rejected') && (
        <div className={styles.commentSection}>
          <div className={styles.sectionHeader}>
            <h3>SCAD Comments</h3>
          </div>
          
          {/* Display all submitted comments */}
          {(allComments.length > 0) && (
            <div className={styles.commentThreadContainer}>
              <div className={styles.commentsContainer}>
                {allComments.map((commentText, index) => (
                  <div key={index} className={styles.commentItem}>
                    <div className={styles.commentHeader}>
                      <span className={styles.commentAuthor}>SCAD</span>
                      <button 
                        className={styles.deleteCommentButton}
                        onClick={() => handleDeleteComment(index)}
                        aria-label="Delete comment"
                      >
                        &times;
                      </button>
                    </div>
                    <p className={styles.commentText}>{commentText}</p>
                    <span className={styles.commentDate}>
                      {new Date().toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Add comment form */}
          <div className={styles.addCommentForm}>
            <textarea
              className={styles.commentTextarea}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={`Add additional comments to this ${status} report...`}
              rows={4}
            />
            <button 
              className={styles.submitCommentButton}
              onClick={() => {
                console.log("Submit button clicked, comment:", comment);
                if (comment.trim() && onAddComment) {
                  console.log("Calling onAddComment with:", comment);
                  // Call the parent component's onAddComment function
                  onAddComment(comment);
                  
                  // Add comment to local state as well
                  setAllComments([...allComments, comment]);
                  setComment('');
                }
              }}
              disabled={!comment.trim()}
            >
              Submit Comment
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
  );
};

export default ReportDetailsModal;
