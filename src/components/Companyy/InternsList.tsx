import React from 'react';
import styles from './InternsList.module.css';
import { Intern } from "./types";
import { CheckCircle, User, Clock, CalendarClock } from "lucide-react";

// Interface for component props
interface InternsListProps {
  interns: Intern[];
  onStatusChange: (internId: string, status: "current" | "completed", endDate?: Date) => void;
  onEvaluate: (intern: Intern) => void;
}

// Helper function to get status badge with appropriate styling
const getStatusBadge = (status: Intern['status']) => {
  return (
    <span className={`${styles.statusBadge} ${styles[status]}`}>
      {status.toUpperCase()}
    </span>
  );
};

// Main component
const InternsList: React.FC<InternsListProps> = ({
  interns,
  onStatusChange,
  onEvaluate
}) => {
  // Handle status change
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>, internId: string) => {
    const newStatus = e.target.value as "current" | "completed";
    onStatusChange(internId, newStatus, newStatus === 'completed' ? new Date() : undefined);
  };

  // Handle evaluation
  const handleEvaluate = (intern: Intern) => {
    onEvaluate(intern);
  };
  
  // Calculate days remaining for each intern
  const calculateDaysRemaining = (startDate: Date, endDate: Date | null) => {
    if (!endDate) return 'Ongoing';
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? `${diffDays} days remaining` : 'Completed';
  };
  
  return (
    <div className={styles.section}>
      
      {interns.length > 0 ? (
        <>
          {/* Table view for interns */}
          <div className={styles.applicationCardContainer}>
            <table className={styles.applicationsTable}>              <thead>
                <tr className={styles.tableHeader}>
                  <th>Intern</th>
                  <th>Position</th>
                  <th>Education</th>
                  <th>Internship Period</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>{interns.map((intern) => (              <tr key={intern.id} className={styles.applicationRow}>
                <td>
                  <div className={styles.applicantProfile}>
                    <div className={styles.applicantAvatar}>
                      {intern.name.charAt(0)}
                    </div>
                    <div className={styles.applicantDetails}>
                      <div className={styles.applicantName}>
                        {intern.name}
                        {intern.evaluation && (
                          <span className={styles.evaluatedBadge} title="Evaluated">
                            <CheckCircle size={14} color="#10b981" />
                          </span>
                        )}
                      </div>
                      <div className={styles.applicantEmail}>{intern.email}</div>
                    </div>
                  </div>
                </td>

                {/* Internship Title */}
                <td>
                  <div className={styles.internshipTitle}>
                    {intern.internshipTitle}
                  </div>
                </td>

                {/* University & Major */}
                <td>
                  <div>
                    <div className={styles.universityName}>{intern.university}</div>
                    <div className={styles.universityTag}>{intern.major}</div>
                  </div>
                </td>

                {/* Date Range with Duration Indicator */}
                <td>
                  <div className={styles.dateRangeContainer}>
                    <div className={styles.dateRange}>
                      {new Date(intern.startDate).toLocaleDateString()} - {
                        intern.endDate
                          ? new Date(intern.endDate).toLocaleDateString()
                          : 'Present'
                      }
                    </div>
                    {intern.endDate && (
                      <div className={styles.durationIndicator}>
                        {calculateDaysRemaining(intern.startDate, intern.endDate)}
                      </div>
                    )}
                  </div>
                </td>

                {/* Status */}
                <td>
                  <select
                    className={`${styles.statusBadge} ${styles[intern.status]}`}
                    value={intern.status}
                    onChange={(e) => handleStatusChange(e, intern.id)}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value="current">CURRENT</option>
                    <option value="completed">COMPLETED</option>
                  </select>                    </td>
                <td>
                  {intern.status === 'current' ? (
                    <button
                      className={`${styles.actionButton} ${styles.completeButton}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onStatusChange(intern.id, 'completed', new Date());
                      }}
                    >
                      Mark Complete
                    </button>
                  ) : (
                    <button
                      className={`${styles.actionButton} ${intern.evaluation ? styles.viewButton : styles.evaluateButton}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEvaluate(intern);
                      }}
                    >
                      {intern.evaluation ? 'View Evaluation' : 'Evaluate'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
            </tbody>
          </table>
          </div>
        </>
      ) : (
        <div className={styles.noResults}>
          <div className={styles.noResultsIcon}>
            <User size={40} color="#4c51bf" />
          </div>
          <p>No interns found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default InternsList;