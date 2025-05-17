import React from 'react';
import styles from './ProfileViewDetailsModal.module.css';
import { X } from 'lucide-react';

// Use the same ProfileView interface as in ProfileViewsList
interface ProfileView {
  id: number;
  company: string;
  logo: string;
  viewDate: string;
  viewTime: string;
  jobTitle?: string;
  recruiterName?: string;
  industry: string;
  isRecurring: boolean;
}

interface ProfileViewDetailsModalProps {
  view: ProfileView;
  onClose: () => void;
  onSendMessage?: (view: ProfileView) => void;
}

const ProfileViewDetailsModal: React.FC<ProfileViewDetailsModalProps> = ({ view, onClose, onSendMessage }) => {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Company Profile View Details</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.companyHeader}>
          <div className={styles.logoContainer}>
            {view.logo && (
              <img 
                src={view.logo} 
                alt={`${view.company} logo`} 
                className={styles.companyLogo}
              />
            )}
          </div>
          <div className={styles.companyInfo}>
            <h3 className={styles.companyName}>{view.company}</h3>
            <p className={styles.companyIndustry}>{view.industry}</p>
          </div>
        </div>

        <div className={styles.detailsSection}>
          <div className={styles.detailRow}>
            <div className={styles.detailLabel}>View Date:</div>
            <div className={styles.detailValue}>{`${view.viewDate} at ${view.viewTime}`}</div>
          </div>
          
          <div className={styles.detailRow}>
            <div className={styles.detailLabel}>View Type:</div>
            <div className={styles.detailValue}>
              <span className={`${styles.statusBadge} ${view.isRecurring ? styles.recurringBadge : styles.newViewBadge}`}>
                {view.isRecurring ? 'Recurring View' : 'New View'}
              </span>
            </div>
          </div>
          
          {view.recruiterName && (
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>Recruiter:</div>
              <div className={styles.detailValue}>{view.recruiterName}</div>
            </div>
          )}
          
          {view.jobTitle && (
            <div className={styles.detailRow}>
              <div className={styles.detailLabel}>Position of Interest:</div>
              <div className={styles.detailValue}>{view.jobTitle}</div>
            </div>
          )}
        </div>
          <div className={styles.additionalInfoSection}>
          <h4 className={styles.sectionTitle}>Company Information</h4>
          <div className={styles.additionalInfoContent}>
            <div className={styles.infoRow}>
              <div className={styles.infoLabel}>Company Website:</div>
              <div className={styles.infoValue}>
                <a href="#" className={styles.infoLink}>www.{view.company.toLowerCase().replace(' ', '')}.com</a>
              </div>
            </div>
            <div className={styles.infoRow}>
              <div className={styles.infoLabel}>Company Size:</div>
              <div className={styles.infoValue}>
                {view.company === 'Google' || view.company === 'Microsoft' || view.company === 'Amazon' ? 'Large Enterprise (10,000+)' : 
                 view.company === 'IBM' || view.company === 'Apple' ? 'Large Enterprise (5,000-10,000)' : 'Medium Business (500-5,000)'}
              </div>
            </div>
            <div className={styles.infoRow}>
              <div className={styles.infoLabel}>Hiring Status:</div>
              <div className={styles.infoValue}>
                <span className={styles.hiringBadge}>Actively Hiring</span>
              </div>
            </div>
          </div>
        </div>
          <div className={styles.notesSection}>
          <h4 className={styles.sectionTitle}>Notes</h4>
          <div className={styles.insightBox}>
            <div className={styles.insightIcon}>💡</div>
            <div className={styles.insightText}>
              <strong>Pro Tip:</strong> Profile views from recruiters are often a good indication that your skills match 
              an open position. Reach out within 48 hours for best results.
            </div>
          </div>
        </div>
        
        <div className={styles.actionButtonContainer}>          <button 
            className={`${styles.actionButton} ${styles.primaryAction}`}            onClick={() => {
              // This would typically redirect to a messaging interface or open a compose modal
              console.log('Send message to recruiter:', view.recruiterName);
              
              // If onSendMessage is provided, call it
              if (onSendMessage) {
                onSendMessage(view);
              } else {
                // Fallback for backwards compatibility
                alert('Sending message to recruiter: ' + (view.recruiterName || 'Unknown Recruiter'));
              }
            }}
          >
            Send Message to Recruiter
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProfileViewDetailsModal;