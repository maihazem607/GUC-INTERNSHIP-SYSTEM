import React from 'react';
import styles from './ProfileViewsList.module.css';

// Define the profile view interface
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

interface ProfileViewsListProps {
  profileViews: ProfileView[];
  onViewDetails: (view: ProfileView) => void;
  highlightedViewId?: number;
}

const ProfileViewsList: React.FC<ProfileViewsListProps> = ({ 
  profileViews, 
  onViewDetails,
  highlightedViewId 
}) => {
  // Helper function to calculate how long ago the view happened
  const getTimeAgo = (dateString: string, timeString: string): string => {
    const viewDate = new Date(`${dateString} ${timeString}`);
    const now = new Date();
    
    const diffMs = now.getTime() - viewDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      return diffDays === 1 ? 'Yesterday' : `${diffDays} days ago`;
    } else if (diffHours > 0) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffMins > 0) {
      return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    } else {
      return 'Just now';
    }
  };

  // Helper function to get appropriate badge class for recurring views
  const getRecurringBadgeClass = (isRecurring: boolean): string => {
    return isRecurring ? styles.recurringBadge : styles.newViewBadge;
  };

  // Helper function to get recurring status text
  const getRecurringText = (isRecurring: boolean): string => {
    return isRecurring ? 'Recurring View' : 'New View';
  };

  return (
    <div className={styles.viewsContainer}>
      <table className={styles.viewsTable}>
        <thead>
          <tr>
            <th>Company</th>
            <th>Industry</th>
            <th>Position of Interest</th>
            <th>Recruiter</th>
            <th>View Date</th>
            <th>Time Ago</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead> 
        <tbody>
          {profileViews.length > 0 ? (
            profileViews.map((view) => (
              <tr 
                key={view.id} 
                className={`${styles.viewRow} ${highlightedViewId === view.id ? styles.highlightedRow : ''}`}
              >
                <td className={styles.companyCell}>
                  <div className={styles.companyInfo}>
                    {view.logo && (
                      <img 
                        src={view.logo} 
                        alt={`${view.company} logo`} 
                        className={styles.companyLogo}
                      />
                    )}
                    <span>{view.company}</span>
                  </div>
                </td>
                <td>{view.industry}</td>
                <td>{view.jobTitle || 'Not specified'}</td>
                <td>{view.recruiterName || 'Unknown'}</td>
                <td>{`${view.viewDate}, ${view.viewTime}`}</td>
                <td>{getTimeAgo(view.viewDate, view.viewTime)}</td>
                <td>
                  <span className={`${styles.statusBadge} ${getRecurringBadgeClass(view.isRecurring)}`}>
                    {getRecurringText(view.isRecurring)}
                  </span>
                </td>
                <td>
                  <button 
                    className={styles.viewButton}
                    onClick={() => onViewDetails(view)}
                  >
                    View Company
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className={styles.noViews}>
                <div className={styles.emptyState}>
                  <i className={styles.emptyIcon}>👁️</i>
                  <h3 className={styles.emptyTitle}>No profile views yet</h3>
                  <p className={styles.emptyMessage}>
                    Your profile has not been viewed by any companies yet. 
                    Continue applying to positions and updating your profile to increase visibility.
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProfileViewsList;