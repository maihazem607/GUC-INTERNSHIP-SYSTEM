import React from 'react';
import styles from './ReportsList.module.css';
import highlightStyles from './ReportHighlight.module.css';
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

interface ReportsListProps {
  reports: MyInternship[];
  onViewReportResults: (internship: MyInternship) => void;
  highlightedReportId?: number;
}

const ReportsList: React.FC<ReportsListProps> = ({ 
  reports, 
  onViewReportResults,
  highlightedReportId 
}) => {
  // Helper function to get appropriate badge class based on report status
  const getStatusBadgeClass = (status?: string): string => {
    switch (status) {
      case 'accepted':
        return styles.acceptedBadge;
      case 'flagged':
        return styles.flaggedBadge;
      case 'rejected':
        return styles.rejectedBadge;
      default:
        return styles.pendingBadge;
    }
  };

  // Helper function to get status text
  const getStatusText = (status?: string): string => {
    switch (status) {
      case 'accepted':
        return 'Accepted';
      case 'flagged':
        return 'Flagged';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Pending';
    }
  };

  return (
    <div className={styles.reportsContainer}>
      <table className={styles.reportsTable}>
        <thead>
          <tr>
            <th>Company</th>
            <th>Position</th>
            <th>Completion Date</th>
            <th>Report Title</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.length > 0 ? (            reports.map((report) => (
              <tr 
                key={report.id} 
                className={`${styles.reportRow} ${highlightedReportId === report.id ? highlightStyles.highlightedRow : ''}`}
              >
                <td className={styles.companyCell}>
                  <div className={styles.companyInfo}>
                    {report.logo && (
                      <img 
                        src={report.logo} 
                        alt={`${report.company} logo`} 
                        className={styles.companyLogo}
                      />
                    )}
                    <span>{report.company}</span>
                  </div>
                </td>
                <td>{report.title}</td>
                <td>{report.endDate || 'N/A'}</td>
                <td className={styles.reportTitleCell}>{report.report?.title || 'Untitled Report'}</td>
                <td>
                  <span className={`${styles.statusBadge} ${getStatusBadgeClass(report.report?.status)}`}>
                    {getStatusText(report.report?.status)}
                  </span>
                </td>
                <td>
                  <button 
                    className={styles.viewButton}
                    onClick={() => onViewReportResults(report)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className={styles.noReports}>
                <div className={styles.emptyState}>
                  <i className={styles.emptyIcon}>📋</i>
                  <p>No completed internship reports found</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReportsList;
