import React from "react";
import styles from "./ReportTable.module.css";

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

const ReportTable: React.FC<ReportTableProps> = ({ reports, onViewReport }) => (
  <div className={styles.reportTable}>
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Title</th>
          <th>Student</th>
          <th>Major</th>
          <th>Company</th>
          <th>Submission Date</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {reports.map((report) => (
          <tr key={report.id}>
            <td>{report.title}</td>
            <td>{report.studentName}</td>
            <td>{report.major}</td>
            <td>{report.companyName}</td>
            <td>{report.submissionDate}</td>
            <td>
              <span className={`${styles.statusBadge} ${styles[report.status]}`}>{report.status.toUpperCase()}</span>
            </td>
            <td>
              <button className={styles.viewReportButton} onClick={() => onViewReport(report)}>
                View
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    {reports.length === 0 && (
      <div className={styles.noResults}>
        <div className={styles.noResultsIcon}>🔍</div>
        <p>No reports found matching your criteria.</p>
      </div>
    )}
  </div>
);

export default ReportTable;
