import React from "react";
import styles from "./ReportList.module.css";

export interface Report {
  id: number;
  title: string;
  studentName: string;
  major: string;
  companyName: string;
  submissionDate: string;
  status: "pending" | "flagged" | "rejected" | "accepted";
}

export interface ReportTableProps {
  reports: Report[];
  onViewReport: (report: Report) => void;
}

// Helper function to generate background colors based on report title
const getCardBackground = (title: string): string => {
  const colors = [
    '#e8f3ff', '#ffe8f0', '#e8ffe8', '#fff8e8', '#f0e8ff',
    '#e8ffea', '#f0ffe8', '#fff0f0'
  ];
  // Simple hash function to get consistent colors for the same report title
  const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

// Helper function to create status chip with appropriate styling
const getStatusChip = (status: Report['status']) => {
  let chipClass = styles.statusBadge;
  
  return (
    <span className={`${chipClass} ${styles[status]}`}>
      {status.toUpperCase()}
    </span>
  );
};

// List view for reports using the original report data
const ReportTable: React.FC<ReportTableProps> = ({ reports, onViewReport }) => (
  <div className={styles.reportCardContainer}>
    {reports && reports.length > 0 ? (
      <table className={styles.studentsTable}>
        <tbody>
          {reports.map((report) => {
            return (
              <tr key={report.id} className={styles.studentRow} onClick={() => onViewReport(report)}>
                {/* Name and Title Column */}
                <td>
                  <div className={styles.studentProfile}>
                    <div className={styles.studentAvatar}>
                      {report.studentName.charAt(0)}
                    </div>
                    <div className={styles.studentInfo}>
                      <div className={styles.studentName}>{report.studentName}</div>
                      <div className={styles.studentAge}>{report.title}</div>
                    </div>
                  </div>
                </td>
                
                {/* Company Name as "Accessibility Tags" */}
                <td>
                  <div className={styles.tagContainer}>
                    <span className={styles.tag}>{report.companyName}</span>
                  </div>
                </td>
                
                {/* Major - Just simple text with no progress bar */}
                <td>
                  <div style={{ color: '#555', fontSize: '14px' }}>
                    {report.major}
                  </div>
                </td>
                
                {/* Submission Date as "Social Skills" */}
                <td>
                  <div style={{ color: '#555', fontSize: '14px' }}>
                    {report.submissionDate}
                    <div className={styles.lifeSkills}>{report.status}</div>
                  </div>
                </td>
                
                {/* Last column - just a status tag instead of progress */}
                <td>
                  <div className={styles.tagContainer}>
                    <span 
                      className={styles.tag} 
                      style={{
                        backgroundColor: report.status === 'accepted' ? '#e6fff2' : 
                                        report.status === 'rejected' ? '#ffeaea' :
                                        report.status === 'flagged' ? '#e6f7ff' : '#fffbe6',
                        color: report.status === 'accepted' ? '#1aaf5d' :
                              report.status === 'rejected' ? '#d32f2f' :
                              report.status === 'flagged' ? '#217dbb' : '#bfa100'
                      }}
                    >
                      {report.status.toUpperCase()}
                    </span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    ) : (
      <div className={styles.noResults}>
        <div className={styles.noResultsIcon}>🔍</div>
        <p>No reports found matching your criteria.</p>
      </div>
    )}
  </div>
);

// Keep the card view implementation available for backward compatibility
const ReportCard: React.FC<{report: Report, onViewReport: (report: Report) => void}> = ({
  report,
  onViewReport
}) => (
  <div className={styles.card} onClick={() => onViewReport(report)}>
    <div className={styles.cardInner} style={{ backgroundColor: getCardBackground(report.title) }}>
      <div className={styles.cardDate}>
        <span>Submitted: {report.submissionDate}</span>
        {getStatusChip(report.status)}
      </div>
      
      <div className={styles.companyInfo}>
        <span className={styles.companyName}>{report.companyName}</span>
      </div>
      
      <div className={styles.jobTitleContainer}>
        <h3 className={styles.jobTitle}>{report.title}</h3>
      </div>
      
      <div className={styles.reportInfo}>
        <div className={styles.studentName}>Student: {report.studentName}</div>
        <div className={styles.major}>Major: {report.major}</div>
      </div>
      
      <div className={styles.jobTags}>
        <span className={styles.jobTag}>{report.major}</span>
        <span className={styles.jobTag}>{report.companyName}</span>
      </div>
    </div>
    
    <div className={styles.cardFooter}>
      <div className={styles.jobMeta}>
        <div className={styles.salary}>Report Review</div>
        <div className={styles.location}>
          {report.status === 'pending' ? 'Needs review' : 
          report.status === 'accepted' ? 'Approved' : 
          report.status === 'flagged' ? 'Flagged for review' : 'Not approved'}
        </div>
      </div>
      <button 
        className={styles.detailsButton}
        onClick={(e) => {
          e.stopPropagation();
          onViewReport(report);
        }}
      >
        View Details
      </button>
    </div>
  </div>
);

export default ReportTable;
