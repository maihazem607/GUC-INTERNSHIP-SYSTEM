import React from "react";
import styles from "./ReportCard.module.css";

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

// Individual Report Card component
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

const ReportTable: React.FC<ReportTableProps> = ({ reports, onViewReport }) => (
  <div className={styles.reportCardContainer}>
    {reports.length > 0 ? (
      <div className={styles.reportsGrid}>
        {reports.map((report) => (
          <ReportCard 
            key={report.id}
            report={report}
            onViewReport={onViewReport}
          />
        ))}
      </div>
    ) : (
      <div className={styles.noResults}>
        <div className={styles.noResultsIcon}>🔍</div>
        <p>No reports found matching your criteria.</p>
      </div>
    )}
  </div>
);

export default ReportTable;
