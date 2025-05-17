import React, { useState } from 'react';
import styles from './ApplicationDetailsModal.module.css';
import Modal from '../global/Modal';
import ResumeModal from './ResumeModal';
import CoverLetterModal from './CoverLetterModal';
import { Application } from './types';
import { FileText, User } from 'lucide-react';

interface ApplicationDetailsModalProps {
  application: Application;
  onClose: () => void;
}

const ApplicationDetailsModal: React.FC<ApplicationDetailsModalProps> = ({ application, onClose }) => {
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [showCoverLetterModal, setShowCoverLetterModal] = useState(false);

  const openResumeModal = () => {
    setShowResumeModal(true);
  };

  const openCoverLetterModal = () => {
    setShowCoverLetterModal(true);
  };

  return (
    <>
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
            <button onClick={openResumeModal} className={styles.documentLink}>
              <FileText size={18} />
              View Resume
            </button>
            <button onClick={openCoverLetterModal} className={styles.documentLink}>
              <User size={18} />
              View Cover Letter
            </button>
          </div>
        </div>
      </Modal>

      {showResumeModal && (
        <ResumeModal 
          applicantName={application.applicantName} 
          onClose={() => setShowResumeModal(false)} 
        />
      )}

      {showCoverLetterModal && (
        <CoverLetterModal 
          applicantName={application.applicantName} 
          internshipTitle={application.internshipTitle}
          onClose={() => setShowCoverLetterModal(false)} 
        />
      )}
    </>
  );
};

export default ApplicationDetailsModal;
