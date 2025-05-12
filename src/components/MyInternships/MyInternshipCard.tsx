import React from 'react';
import Image from "next/image";
import styles from './MyInternshipCard.module.css';
import { Internship } from '../internships/types';

// Extended Internship type to include application status, evaluation and report
interface MyInternship extends Internship {
  applicationStatus: 'none' | 'pending' | 'accepted' | 'rejected' | 'finalized';
  applicationDate: string;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
  evaluation?: {
    rating: number;
    comment: string;
    recommended: boolean;
  } | null;
  report?: {
    title: string;
    introduction: string;
    body: string;
  } | null;
}

interface MyInternshipCardProps {
  internship: MyInternship;
  onViewDetails: (internship: Internship) => void;
  onEvaluate?: (internship: MyInternship) => void;
  onReport?: (internship: MyInternship) => void;
  activeTab: 'applications' | 'internships';
}

const getCardBackground = (id: number): string => {
  const colors = [
    '#ffe8f0', '#e8f3ff', '#e8ffe8', '#fff0e8', '#f0e8ff',
    '#e8fff0', '#fff8e8', '#e8f0ff', '#ffe8e8', '#e8ffea',
    '#f0ffe8', '#fff0f0'
  ];
  return colors[id % colors.length];
};

const getStatusBadgeClass = (status: string): string => {
  switch (status) {
    case 'pending':
      return styles.pendingBadge;
    case 'accepted':
      return styles.acceptedBadge;
    case 'rejected':
      return styles.rejectedBadge;
    case 'finalized':
      return styles.interviewBadge;
    default:
      return '';
  }
};

const getStatusText = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'accepted':
      return 'Accepted';
    case 'rejected':
      return 'Rejected';
    case 'finalized':
      return 'Finalized';
    default:
      return '';
  }
};

const MyInternshipCard: React.FC<MyInternshipCardProps> = ({ 
  internship, 
  onViewDetails,
  onEvaluate,
  onReport,
  activeTab
}) => {
  return (
    <div className={styles.card}>      <div className={styles.cardInner} style={{ backgroundColor: getCardBackground(internship.id) }}>
        <div className={styles.cardDate}>
          <span>
            {activeTab === 'applications' ? (
              <>Submitted: {internship.applicationDate}</>
            ) : (
              <>Started: {internship.startDate || 'Not specified'}</>
            )}
          </span>
          {/* We'll keep the status badge here for internships tab, but applications tab will show in footer */}
          {activeTab === 'internships' && (
            <div className={styles.statusContainer}>
              <span className={`${styles.statusBadge} ${getStatusBadgeClass(internship.applicationStatus)}`}>
                {getStatusText(internship.applicationStatus)}
              </span>
            </div>
          )}
        </div>
        
        <div className={styles.companyInfo}>
          <span className={styles.companyName}>{internship.company}</span>
        </div>
        
        <div className={styles.jobTitleContainer}>
          <h3 className={styles.jobTitle}>{internship.title}</h3>
          {internship.logo && (
            <div className={styles.companyLogo}>
              <Image src={internship.logo} alt={`${internship.company} logo`} width={30} height={30} />
            </div>
          )}
        </div>
        
        <div className={styles.jobTags}>
          <span className={styles.jobTag}>{internship.duration}</span>
          <span className={styles.jobTag}>{internship.industry}</span>
          <span className={styles.jobTag}>{internship.isPaid ? 'Paid' : 'Unpaid'}</span>
        </div>
      </div>
        <div className={styles.cardFooter}>
        <div className={styles.jobMeta}>
          <div className={styles.salary}>{internship.salary}</div>
          <div className={styles.location}>{internship.location}</div>
        </div>        {/* Show different elements based on the active tab and internship status */}
        {activeTab === 'applications' && (
          <div className={styles.badgeContainer}>
            <span className={`${styles.statusBadge} ${getStatusBadgeClass(internship.applicationStatus)}`}>
              {getStatusText(internship.applicationStatus)}
            </span>
          </div>
        )}

        {activeTab === 'internships' && internship.isActive && (
          <button 
            className={styles.inProgressButton}
            disabled
          >
            In Progress
          </button>
        )}

        {activeTab === 'internships' && !internship.isActive && (
          <div className={styles.buttonsContainer}>
            <button 
              className={styles.reportButton}
              onClick={() => onReport && onReport(internship)}
            >
              {internship.report ? 'View Report' : 'Submit Report'}
            </button>
            <button 
              className={styles.evaluateButton}
              onClick={() => onEvaluate && onEvaluate(internship)}
            >
              {internship.evaluation ? 'View Evaluation' : 'Evaluate'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyInternshipCard;
