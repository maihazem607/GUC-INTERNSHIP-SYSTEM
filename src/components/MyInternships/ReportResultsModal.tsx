import React, { useState } from 'react';
import styles from './ReportResultsModal.module.css';
import { Internship } from '../internships/types';

// Extended Internship type
interface MyInternship extends Internship {
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
  report?: {
    title: string;
    introduction: string;
    body: string;
    coursesApplied?: string[];
    finalized?: boolean;
    status?: 'pending' | 'accepted' | 'flagged' | 'rejected';
    scadComments?: string;
    appealMessage?: string;
    appealDate?: string;
  } | null;
}

interface ReportResultsModalProps {
  internship: MyInternship;
  onClose: () => void;
  onSubmitAppeal: (internshipId: number, appealMessage: string) => void;
  isSubmittingAppeal: boolean;
}

const ReportResultsModal: React.FC<ReportResultsModalProps> = ({
  internship,
  onClose,
  onSubmitAppeal,
  isSubmittingAppeal
}) => {
  const [appealMessage, setAppealMessage] = useState(internship.report?.appealMessage || '');
  const [showAppealForm, setShowAppealForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'feedback' | 'appeal'>('details');

  const handleSubmitAppeal = () => {
    if (appealMessage.trim()) {
      onSubmitAppeal(internship.id, appealMessage);
    }
  };

  // Define badge color based on status
  const getStatusBadgeClass = (status?: string) => {
    switch (status) {
      case 'accepted': return styles.acceptedBadge;
      case 'flagged': return styles.flaggedBadge;
      case 'rejected': return styles.rejectedBadge;
      default: return styles.pendingBadge;
    }
  };

  // Define verbose status text
  const getStatusText = (status?: string) => {
    switch (status) {
      case 'accepted': return 'Accepted by SCAD';
      case 'flagged': return 'Flagged by SCAD - Needs Revision';
      case 'rejected': return 'Rejected by SCAD';
      default: return 'Pending SCAD Review';
    }
  };

  // Format date string nicely
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        
        <div className={styles.modalHeader}>
          <div className={styles.headerTop}>
            <h2 className={styles.modalTitle}>Internship Report Status</h2>
            <div className={styles.statusContainer}>
              <span 
                className={`${styles.statusBadge} ${getStatusBadgeClass(internship.report?.status)}`}
              >
                {getStatusText(internship.report?.status)}
              </span>
            </div>
          </div>
          
          <div className={styles.tabsContainer}>
            <button 
              className={`${styles.tabButton} ${activeTab === 'details' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('details')}
            >
              Report Details
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'feedback' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('feedback')}
            >
              SCAD Feedback
            </button>
            {(internship.report?.status === 'flagged' || internship.report?.status === 'rejected') && (
              <button 
                className={`${styles.tabButton} ${activeTab === 'appeal' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('appeal')}
              >
                Submit Appeal
              </button>
            )}
          </div>
        </div>

      {activeTab === 'details' && (
          <div className={styles.reportDetails}>
            <div className={styles.reportSection}>
              <h3 className={styles.sectionTitle}>Report Title</h3>
              <p className={styles.reportTitle}>{internship.report?.title}</p>
            </div>
            
            <div className={styles.reportSection}>
              <h3 className={styles.sectionTitle}>Internship Information</h3>
              <div className={styles.internshipInfo}>
                <div className={styles.companyHeader}>
                  {internship.logo && (
                    <img src={internship.logo} alt={`${internship.company} logo`} className={styles.companyLogo} />
                  )}
                  <h4 className={styles.companyName}>{internship.company}</h4>
                </div>
                
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Position:</span>
                    <span className={styles.value}>{internship.title}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Duration:</span>
                    <span className={styles.value}>{internship.duration}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Start Date:</span>
                    <span className={styles.value}>{formatDate(internship.startDate)}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Completion Date:</span>
                    <span className={styles.value}>{formatDate(internship.endDate)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={styles.reportSection}>
              <h3 className={styles.sectionTitle}>Report Summary</h3>
              <div className={styles.reportSummary}>
                <div className={styles.summaryItem}>
                  <h4 className={styles.summaryTitle}>Introduction</h4>
                  <p className={styles.summaryText}>{internship.report?.introduction}</p>
                </div>
                
                <div className={styles.summaryItem}>
                  <h4 className={styles.summaryTitle}>Main Content</h4>
                  <div className={styles.reportContent}>
                    <p className={styles.reportParagraph}>{internship.report?.body}</p>
                  </div>
                </div>
                
                {internship.report?.coursesApplied && internship.report?.coursesApplied.length > 0 && (
                  <div className={styles.summaryItem}>
                    <h4 className={styles.summaryTitle}>Courses Applied</h4>
                    <div className={styles.courseList}>
                      {internship.report.coursesApplied.map(course => (
                        <span key={course} className={styles.courseBadge}>
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            </div>
        )}

        {activeTab === 'feedback' && (
          <div className={styles.feedbackTab}>
            <div className={styles.feedbackHeader}>
              <div 
                className={`${styles.statusIndicator} ${
                  internship.report?.status === 'accepted' ? styles.acceptedIndicator :
                  internship.report?.status === 'flagged' ? styles.flaggedIndicator :
                  internship.report?.status === 'rejected' ? styles.rejectedIndicator :
                  styles.pendingIndicator
                }`}
              ></div>
              <div className={styles.feedbackTitle}>
                {getStatusText(internship.report?.status)}
                {internship.report?.status !== 'pending' && (
                  <span className={styles.feedbackDate}>
                    Reviewed on {formatDate(new Date().toISOString())}
                  </span>
                )}
              </div>
            </div>

            {internship.report?.status === 'pending' ? (
              <div className={styles.noFeedback}>
                <svg className={styles.noFeedbackIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <h3>Pending Review</h3>
                <p>Your report is still under review by the SCAD office. You'll be notified when feedback is available.</p>
              </div>
            ) : (
              <div className={styles.feedbackContent}>
                {internship.report?.scadComments && (
                  <div className={styles.commentBlock}>
                    <h4 className={styles.commentTitle}>SCAD Feedback</h4>
                    <div className={styles.commentText}>
                      {internship.report.scadComments}
                    </div>
                  </div>
                )}

                {internship.report?.appealMessage && (
                  <div className={styles.appealBlock}>
                    <h4 className={styles.appealTitle}>Your Appeal</h4>
                    <div className={styles.appealText}>
                      <p>{internship.report.appealMessage}</p>
                      <div className={styles.appealDate}>
                        <small>Submitted on {formatDate(internship.report.appealDate || new Date().toISOString())}</small>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'appeal' && (
          <div className={styles.appealTab}>
            <div className={styles.appealIntro}>
              <h3 className={styles.appealHeading}>Submit an Appeal</h3>
              <p className={styles.appealDescription}>
                If you believe your report has been incorrectly evaluated, you may submit an appeal to have your report reconsidered.
                Please provide a clear explanation of why you think your report meets the requirements.
              </p>

              <div className={styles.scadFeedbackReminder}>
                <h4 className={styles.reminderTitle}>SCAD Feedback</h4>
                <p className={styles.reminderContent}>{internship.report?.scadComments}</p>
              </div>
            </div>

            {internship.report?.appealMessage ? (
              <div className={styles.appealSubmitted}>
                <h4>Appeal Already Submitted</h4>
                <p>{internship.report.appealMessage}</p>
                <div className={styles.appealDate}>
                  <small>Submitted on {formatDate(internship.report.appealDate || new Date().toISOString())}</small>
                </div>
                <p className={styles.appealNote}>Your appeal is being reviewed. You'll be notified when there's an update.</p>
              </div>
            ) : showAppealForm ? (
              <div className={styles.appealForm}>
                <label className={styles.appealLabel}>
                  Please explain why you believe your report should be reconsidered:
                </label>
                <textarea
                  value={appealMessage}
                  onChange={(e) => setAppealMessage(e.target.value)}
                  placeholder="Provide details about why your report meets the requirements and should be reconsidered..."
                  rows={5}
                  className={styles.appealTextarea}
                  disabled={isSubmittingAppeal}
                />
                <div className={styles.appealActions}>
                  <button 
                    className={styles.cancelButton} 
                    onClick={() => setShowAppealForm(false)}
                    disabled={isSubmittingAppeal}
                  >
                    Cancel
                  </button>
                  <button 
                    className={styles.submitButton} 
                    onClick={handleSubmitAppeal}
                    disabled={!appealMessage.trim() || isSubmittingAppeal}
                  >
                    {isSubmittingAppeal ? 'Submitting Appeal...' : 'Submit Appeal'}
                  </button>
                </div>
              </div>
            ) : (
              <button 
                className={styles.appealButton} 
                onClick={() => setShowAppealForm(true)}
              >
                Appeal this Decision
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportResultsModal;