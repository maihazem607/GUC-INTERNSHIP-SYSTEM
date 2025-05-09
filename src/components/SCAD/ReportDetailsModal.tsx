import React from "react";
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
  onClose: () => void;
  onAccept?: () => void;
  onFlag?: () => void;
  onReject?: () => void;
}

const getStatusColor = (status: string) => {
  switch(status) {
    case 'accepted':
      return '#1aaf5d';
    case 'rejected':
      return '#e74c3c';
    case 'flagged':
      return '#f5b400';
    default:
      return '#217dbb';
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
  onClose,
  onAccept,
  onFlag,
  onReject
}) => (
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
      
      {(evaluationScore !== undefined || evaluationComments) && (
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
          )}
          {onFlag && (
            <button 
              className={`${styles.applyButton} ${styles.flagButton}`}
              onClick={onFlag}
              style={{backgroundColor: '#f5b400', marginLeft: '10px'}}
            >
              Flag
            </button>
          )}
          {onReject && (
            <button 
              className={`${styles.applyButton} ${styles.rejectButton}`}
              onClick={onReject}
              style={{backgroundColor: '#e74c3c', marginLeft: '10px'}}
            >
              Reject
            </button>
          )}
        </div>
      )}
    </div>
  </div>
);

export default ReportDetailsModal;
