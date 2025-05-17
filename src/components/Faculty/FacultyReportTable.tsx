import React from "react";
import { Report } from "../SCAD/ReportList";
import reportStyles from "../../../src/components/SCAD/ReportList.module.css";
import styles from "./FacultyReportTable.module.css";

export interface FacultyReportTableProps {
  reports: Report[];
  onViewReport: (report: Report) => void;
  onStatusChange: (reportId: number, newStatus: "pending" | "flagged" | "rejected" | "accepted") => void;
}

// Helper function to generate background colors based on report title
const getRowBackground = (id: number): string => {
  const pastelColors = [
    'rgba(230, 230, 250, 0.3)', // Pastel Purple
    'rgba(255, 255, 224, 0.3)', // Pastel Yellow
    'rgba(240, 255, 240, 0.3)', // Pastel Green
    'rgba(230, 240, 255, 0.3)', // Pastel Blue
  ];
  return pastelColors[id % pastelColors.length];
};

// Dropdown menu for status change
const StatusDropdown = ({ 
  report, 
  onStatusChange 
}: { 
  report: Report, 
  onStatusChange: (reportId: number, newStatus: "pending" | "flagged" | "rejected" | "accepted") => void 
}) => {
  return (
    <div className={styles.statusDropdownContainer} onClick={(e) => e.stopPropagation()}>
      {/* Styled select as the status pill */}
      <select 
        className={`${styles.statusBadge} ${styles[report.status]}`}
        value={report.status}
        onChange={(e) => onStatusChange(report.id, e.target.value as any)}
      >
        <option value="pending">PENDING</option>
        <option value="flagged">FLAGGED</option>
        <option value="rejected">REJECTED</option>
        <option value="accepted">ACCEPTED</option>
      </select>
    </div>
  );
};

// Custom Report Table that includes status dropdown
const FacultyReportTable: React.FC<FacultyReportTableProps> = ({ 
  reports, 
  onViewReport,
  onStatusChange
}) => (
  <div className={reportStyles.reportCardContainer}>
    {reports && reports.length > 0 ? (
      <table className={reportStyles.studentsTable}>
        <tbody>
          {reports.map((report) => (
            <tr
              key={report.id}
              className={reportStyles.studentRow}
              onClick={() => onViewReport(report)}
              style={{ backgroundColor: getRowBackground(report.id) }}>
              {/* Name and Title Column */}
              <td>
                <div className={reportStyles.studentProfile}>
                  <div className={reportStyles.studentAvatar}>
                    {report.studentName.charAt(0)}
                  </div>
                  <div className={reportStyles.studentInfo}>
                    <div className={reportStyles.studentName}>{report.studentName}</div>
                    <div className={reportStyles.studentAge}>{report.title}</div>
                  </div>
                </div>
              </td>
              {/* Company Name as "Accessibility Tags" */}
              <td>
                <div className={reportStyles.tagContainer}>
                  <span className={reportStyles.tag}>{report.companyName}</span>
                </div>
              </td>
              {/* Major - Just simple text with no progress bar */}
              <td>
                <div className={reportStyles.majorCell}>
                  {report.major}
                </div>
              </td>
              {/* Submission Date as "Social Skills" */}
              <td>
                <div className={reportStyles.dateCell}>
                  {report.submissionDate}
                  <div className={reportStyles.submissionTag}>Submitted</div>
                </div>
              </td>
              {/* Last column - status dropdown */}
              <td onClick={(e) => e.stopPropagation()}>
                <div className={reportStyles.tagContainer}>
                  <StatusDropdown 
                    report={report} 
                    onStatusChange={onStatusChange} 
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p>No reports found.</p>
    )}
  </div>
);

export default FacultyReportTable;
