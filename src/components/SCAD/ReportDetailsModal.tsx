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
  status: "pending" | "flagged" | "rejected" | "accepted";
  content: string;
  evaluationScore?: number;
  evaluationComments?: string;
  onClose: () => void;
  onAccept?: () => void;
  onFlag?: () => void;
  onReject?: () => void;
}

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
      <h2 className={styles.modalTitle}>{title}</h2>
      <div className={styles.reportHeader}>
        <div className={styles.reportMetadata}>
          <div className={styles.metadataGroup}>
            <div className={styles.metadataItem}><strong>Student:</strong> {studentName}</div>
            <div className={styles.metadataItem}><strong>Major:</strong> {major}</div>
          </div>
          <div className={styles.metadataGroup}>
            <div className={styles.metadataItem}><strong>Company:</strong> {companyName}</div>
            <div className={styles.metadataItem}><strong>Supervisor:</strong> {supervisorName}</div>
          </div>
          <div className={styles.metadataGroup}>
            <div className={styles.metadataItem}><strong>Start Date:</strong> {internshipStartDate}</div>
            <div className={styles.metadataItem}><strong>End Date:</strong> {internshipEndDate}</div>
          </div>
          <div className={styles.metadataGroup}>
            <div className={styles.metadataItem}><strong>Submitted:</strong> {submissionDate}</div>
            <div className={styles.metadataItem}><strong>Status:</strong> <span className={`${styles.statusBadge} ${styles[status]}`}>{status.toUpperCase()}</span></div>
          </div>
        </div>
      </div>
      <div className={styles.reportContent}>
        <h3>Report Content</h3>
        <div className={styles.contentBox}>{content}</div>
      </div>
      {evaluationScore !== undefined && (
        <div className={styles.evaluationSection}>
          <h3>Evaluation</h3>
          <div className={styles.evaluationDetail}><strong>Score:</strong> {evaluationScore}/10</div>
          <div className={styles.evaluationDetail}><strong>Comments:</strong> {evaluationComments || "No comments provided"}</div>
        </div>
      )}
      {status === "pending" && (
        <div className={styles.reportActions}>
          {onAccept && <button className={`${styles.statusButton} ${styles.acceptButton}`} onClick={onAccept}>Accept Report</button>}
          {onFlag && <button className={`${styles.statusButton} ${styles.flagButton}`} onClick={onFlag}>Flag for Review</button>}
          {onReject && <button className={`${styles.statusButton} ${styles.rejectButton}`} onClick={onReject}>Reject Report</button>}
        </div>
      )}
    </div>
  </div>
);

export default ReportDetailsModal;
