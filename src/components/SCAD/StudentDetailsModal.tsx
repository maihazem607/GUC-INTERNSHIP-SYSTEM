import React from "react";
import styles from "./StudentDetailsModal.module.css";

export interface StudentDetailsModalProps {
  name: string;
  email: string;
  major: string;
  academicYear: string;
  gpa: number;
  internshipStatus: string;
  companyName?: string;
  internshipStartDate?: string;
  internshipEndDate?: string;
  reports?: { id: number; title: string; status: string; submissionDate: string; onView: () => void }[];
  onClose: () => void;
}

const StudentDetailsModal: React.FC<StudentDetailsModalProps> = ({
  name,
  email,
  major,
  academicYear,
  gpa,
  internshipStatus,
  companyName,
  internshipStartDate,
  internshipEndDate,
  reports = [],
  onClose
}) => (
  <div className={styles.modalBackdrop}>
    <div className={styles.modalContent}>
      <button className={styles.closeButton} onClick={onClose}>&times;</button>
      <div className={styles.modalHeader}>
        <h2 className={styles.modalTitle}>{name}</h2>
        {companyName && (
          <div className={styles.modalCompany}>
            <span className={styles.modalCompanyName}>{companyName}</span>
          </div>
        )}
      </div>
      <div className={styles.modalInfo}>
        <div className={styles.modalInfoItem}>
          <div className={styles.modalInfoLabel}>Email</div>
          <div className={styles.modalInfoValue}>{email}</div>
        </div>
        <div className={styles.modalInfoItem}>
          <div className={styles.modalInfoLabel}>Major</div>
          <div className={styles.modalInfoValue}>{major}</div>
        </div>
        <div className={styles.modalInfoItem}>
          <div className={styles.modalInfoLabel}>Academic Year</div>
          <div className={styles.modalInfoValue}>{academicYear}</div>
        </div>
        <div className={styles.modalInfoItem}>
          <div className={styles.modalInfoLabel}>GPA</div>
          <div className={styles.modalInfoValue}>{gpa}</div>
        </div>
        <div className={styles.modalInfoItem}>
          <div className={styles.modalInfoLabel}>Internship Status</div>
          <div className={styles.modalInfoValue}>{internshipStatus}</div>
        </div>
        {internshipStartDate && (
          <div className={styles.modalInfoItem}>
            <div className={styles.modalInfoLabel}>Start Date</div>
            <div className={styles.modalInfoValue}>{internshipStartDate}</div>
          </div>
        )}
        {internshipEndDate && (
          <div className={styles.modalInfoItem}>
            <div className={styles.modalInfoLabel}>End Date</div>
            <div className={styles.modalInfoValue}>{internshipEndDate}</div>
          </div>
        )}
      </div>
      {reports.length > 0 && (
        <div className={styles.modalDescription}>
          <h3>Submitted Reports</h3> 
          <ul>{reports.map(report => (
              <li key={report.id}>
                <strong>{report.title}</strong> - <span>{report.status.toUpperCase()}</span> - <span>Submitted: {report.submissionDate}</span>
                <button className={styles.applyButton} style={{marginLeft:8}} onClick={report.onView}>View Report</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  </div>
);

export default StudentDetailsModal;
