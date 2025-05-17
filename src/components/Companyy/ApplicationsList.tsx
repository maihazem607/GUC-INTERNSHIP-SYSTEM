import React from 'react';
import styles from './ApplicationsList.module.css';
import { Application } from './types';

interface ApplicationsListProps {
  applications: Application[];
  onStatusChange: (applicationId: string, status: Application['status']) => void;
  onViewDetails: (application: Application) => void;
}

// Helper function to get status badge with appropriate styling
const getStatusBadge = (status: Application['status']) => {
  return (
    <span className={`${styles.statusBadge} ${styles[status]}`}>
      {status.toUpperCase()}
    </span>
  );
};

// Helper function to get relative time
const getRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  } else {
    const months = Math.floor(diffDays / 30);
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  }
};

// Helper function to generate background colors based on internship title
const getCardBackground = (title: string): string => {
  const colors = [
    '#e8f3ff', '#ffe8f0', '#e8ffe8', '#fff8e8', '#f0e8ff',
    '#e8ffea', '#f0ffe8', '#fff0f0'
  ];
  // Simple hash function to get consistent colors for the same internship title
  const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

const ApplicationsList: React.FC<ApplicationsListProps> = ({ 
  applications, 
  onStatusChange, 
  onViewDetails 
}) => {
  return (
    <div className={styles.section}>
      {applications.length > 0 ? (
        <>
          {/* Table view (like ReportList) */}          <div className={styles.applicationCardContainer}>
            <table className={styles.applicationsTable}>
              <thead>
                <tr className={styles.tableHeader}>
                  <th>Applicant</th>
                  <th>Position</th>
                  <th>Education</th>
                  <th>Applied</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>{applications.map((app) => {
                  return (
                    <tr key={app.id} className={styles.applicationRow} onClick={() => onViewDetails(app)}>
                      {/* Applicant Profile Column */}
                      <td>
                        <div className={styles.applicantProfile}>
                          <div className={styles.applicantAvatar}>
                            {app.applicantName.charAt(0)}
                          </div>
                          <div className={styles.applicantDetails}>
                            <div className={styles.applicantName}>{app.applicantName}</div>
                            <div className={styles.applicantEmail}>{app.applicantEmail}</div>
                          </div>
                        </div>
                      </td>
                      
                      {/* Internship Title */}
                      <td>
                        <div className={styles.internshipTitle}>
                          {app.internshipTitle}
                        </div>
                      </td>
                      
                      {/* University & Major */}
                      <td>
                        <div>
                          <div className={styles.universityName}>{app.applicantUniversity}</div>
                          <div className={styles.universityTag}>{app.applicantMajor}</div>
                        </div>
                      </td>
                      
                      {/* Date with Relative Time */}
                      <td>
                        <div className={styles.dateContainer}>
                          <div className={styles.dateValue}>
                            {app.applicationDate.toLocaleDateString()}
                          </div>
                          <div className={styles.relativeTime}>
                            {getRelativeTime(app.applicationDate)}
                          </div>
                        </div>
                      </td>
                      
                      {/* Status */}
                      <td>
                        <select
                          className={`${styles.statusBadge} ${styles[app.status]}`}
                          value={app.status}
                          onChange={(e) => {
                            e.stopPropagation();
                            onStatusChange(app.id, e.target.value as Application['status']);
                          }}
                          onClick={(e) => e.stopPropagation()}                        >
                          <option value="pending">PENDING</option>
                          <option value="finalized">FINALIZED</option>
                          <option value="accepted">ACCEPTED</option>
                          <option value="rejected">REJECTED</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* Card view (alternative display) */}
          <div className={styles.applicationsGrid} style={{ display: 'none' }}>
            {applications.map((app) => (
              <ApplicationCard 
                key={app.id} 
                application={app} 
                onStatusChange={onStatusChange} 
                onViewDetails={onViewDetails} 
              />
            ))}
          </div>
        </>
      ) : (
        <div className={styles.noResults}>
          <div className={styles.noResultsIcon}>📄</div>
          <p>No applications found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

// Card component for applications (similar to ReportCard)
const ApplicationCard: React.FC<{
  application: Application;
  onStatusChange: (applicationId: string, status: Application['status']) => void;
  onViewDetails: (application: Application) => void;
}> = ({ application, onStatusChange, onViewDetails }) => (
  <div className={styles.card} onClick={() => onViewDetails(application)}>
    <div 
      className={styles.cardInner} 
      style={{ backgroundColor: getCardBackground(application.internshipTitle) }}
    >
      <div className={styles.cardDate}>
        <span>Applied: {application.applicationDate.toLocaleDateString()}</span>
        {getStatusBadge(application.status)}
      </div>
      
      <div className={styles.applicantInfo}>
        <div className={styles.applicantName}>{application.applicantName}</div>
        <div className={styles.applicantEmail}>{application.applicantEmail}</div>
      </div>
      
      <div className={styles.internshipTitleContainer}>
        <h3 className={styles.internshipTitle}>{application.internshipTitle}</h3>
      </div>
      
      <div className={styles.applicationInfo}>
        <div className={styles.university}>University: {application.applicantUniversity}</div>
        <div className={styles.major}>Major: {application.applicantMajor}</div>
      </div>
      
      <div className={styles.applicationTags}>
        <span className={styles.applicationTag}>{application.applicantMajor}</span>
        <span className={styles.applicationTag}>{application.internshipTitle}</span>
      </div>
    </div>
    
    <div className={styles.cardFooter}>
      <div className={styles.statusActions}>
        {application.status === 'pending' && (
          <>
            <button 
              className={`${styles.actionButton} ${styles.acceptButton}`}
              onClick={(e) => {
                e.stopPropagation();
                onStatusChange(application.id, 'accepted');
              }}
            >
              Accept
            </button>
            <button 
              className={`${styles.actionButton} ${styles.rejectButton}`}
              onClick={(e) => {
                e.stopPropagation();
                onStatusChange(application.id, 'rejected');
              }}
            >
              Reject
            </button>
          </>
        )}
      </div>
      <button 
        className={styles.actionButton}
        onClick={(e) => {
          e.stopPropagation();
          onViewDetails(application);
        }}
      >
        View Details
      </button>
    </div>
  </div>
);

export default ApplicationsList;
