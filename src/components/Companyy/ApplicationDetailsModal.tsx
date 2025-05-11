import React from 'react';
import styles from './ApplicationDetailsModal.module.css';
import Modal from '../global/Modal';
import { Application } from './types';

interface ApplicationDetailsModalProps {
  application: Application;
  onClose: () => void;
}

const ApplicationDetailsModal: React.FC<ApplicationDetailsModalProps> = ({ application, onClose }) => {
  return (
    <Modal
      title="Application Details"
      onClose={onClose}
      width="500px"
    >
      <div className={styles.modalContent}>
        <div className={styles.applicantSection}>
          <h3 className={styles.applicantName}>{application.applicantName}</h3>
          <p className={styles.applicantEmail}>{application.applicantEmail}</p>
        </div>
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>University</h4>
          <p>{application.applicantUniversity} - {application.applicantMajor}</p>
        </div>
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Applied For</h4>
          <p>{application.internshipTitle}</p>
        </div>
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Application Date</h4>
          <p>{application.applicationDate.toLocaleDateString()}</p>
        </div>
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Status</h4>
          <p className={`${styles.status} ${styles[application.status]}`}>
            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
          </p>
        </div>
        <div className={styles.documentLinks}>
          <a href={application.resumeUrl} className={styles.documentLink} target="_blank" rel="noopener noreferrer">
            View Resume
          </a>
          <a href={application.coverLetterUrl} className={styles.documentLink} target="_blank" rel="noopener noreferrer">
            View Cover Letter
          </a>
        </div>
      </div>
    </Modal>
  );
};

export default ApplicationDetailsModal;
