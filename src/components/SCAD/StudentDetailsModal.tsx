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
  companyLogo?: string;
  internshipStartDate?: string;
  internshipEndDate?: string;
  studentPhoto?: string; // Optional photo URL for the student
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
  companyLogo = '/logos/GUCInternshipSystemLogo.png',
  internshipStartDate,
  internshipEndDate,
  studentPhoto = '/assets/images/student-placeholder.png',
  reports = [],
  onClose
}) => {
  // Determine status color and icon
  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'active' || statusLower === 'completed') {
      return styles.statusActive;
    } else if (statusLower === 'pending') {
      return styles.statusPending;
    } else {
      return styles.statusNone;
    }
  };
  
  // Pre-format GPA server-side to avoid hydration mismatch
  // Use string to avoid floating-point inconsistencies between server/client
  const formattedGPA = typeof gpa === 'number' ? 
    (Math.round(gpa * 100) / 100).toFixed(2) : 
    '0.00';
  
  return (
  <div className={styles.modalBackdrop}>
    <div className={styles.modalContent}>
      <button className={styles.closeButton} onClick={onClose} aria-label="Close">&times;</button>
        <div className={styles.profileHeader}>
        <div className={styles.studentPhoto}>
          <img 
            src={studentPhoto} 
            alt={`${name}'s photo`}
            // Remove the inline onError handler to avoid hydration mismatch
          />
        </div>
        
        <div className={styles.profileInfo}>
          <h2 className={styles.modalTitle}>{name}</h2>
          <div className={styles.modalSubtitle}>{major} • {academicYear} Year</div>
          
          <div className={styles.statusWrapper}>
            <span className={`${styles.statusBadge} ${getStatusBadge(internshipStatus)}`}>
              {internshipStatus}
            </span>
            
            {companyName && (
              <div className={styles.companyBadge}>
                <img 
                  src={companyLogo} 
                  alt={`${companyName} logo`} 
                  className={styles.modalCompanyLogo} 
                />
                <span className={styles.modalCompanyName}>{companyName}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className={styles.sectionContainer}>
        <div className={styles.sectionTitle}>Personal Information</div>
        
        <div className={styles.infoCards}>
          <div className={styles.infoCard}>
            <div className={styles.infoCardIcon}>📧</div>
            <div>
              <div className={styles.modalInfoLabel}>Email Address</div>
              <div className={styles.modalInfoValue}>{email}</div>
            </div>
          </div>
          
          <div className={styles.infoCard}>
            <div className={styles.infoCardIcon}>🎓</div>
            <div>
              <div className={styles.modalInfoLabel}>GPA</div>
              <div className={styles.modalInfoValue}>{formattedGPA}</div>
            </div>
          </div>
        </div>
      </div>
      
      {(internshipStartDate || internshipEndDate) && (
        <div className={styles.sectionContainer}>
          <div className={styles.sectionTitle}>Internship Details</div>
          
          <div className={styles.infoCards}>
            {internshipStartDate && (
              <div className={styles.infoCard}>
                <div className={styles.infoCardIcon}>📅</div>
                <div>
                  <div className={styles.modalInfoLabel}>Start Date</div>
                  <div className={styles.modalInfoValue}>{internshipStartDate}</div>
                </div>
              </div>
            )}
            
            {internshipEndDate && (
              <div className={styles.infoCard}>
                <div className={styles.infoCardIcon}>🏁</div>
                <div>
                  <div className={styles.modalInfoLabel}>End Date</div>
                  <div className={styles.modalInfoValue}>{internshipEndDate}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {reports.length > 0 && (
        <div className={styles.sectionContainer}>
          <div className={styles.sectionTitle}>
            <div className={styles.sectionTitleWithCount}>
              Submitted Reports
              <span className={styles.countBadge}>{reports.length}</span>
            </div>
          </div>
          
          <div className={styles.reportsList}>
            {reports.map(report => (
              <div key={report.id} className={styles.reportCard}>
                <div className={styles.reportInfo}>
                  <div className={styles.reportTitle}>{report.title}</div>
                  <div className={styles.reportMeta}>
                    <span className={`${styles.reportStatus} ${
                      report.status.toLowerCase() === 'approved' ? styles.statusApproved :
                      report.status.toLowerCase() === 'rejected' ? styles.statusRejected :
                      styles.statusPending
                    }`}>
                      {report.status}
                    </span>
                    <span className={styles.reportDate}>
                      Submitted: {report.submissionDate}
                    </span>
                  </div>
                </div>
                <button 
                  className={styles.viewReportButton} 
                  onClick={report.onView}
                >
                  View Report
                </button>
              </div>
            ))}
          </div>
        </div>
      )}    </div>
  </div>
  );
};

export default StudentDetailsModal;
