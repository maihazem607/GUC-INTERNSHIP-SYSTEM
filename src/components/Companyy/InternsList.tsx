import React from 'react';
import styles from './InternsList.module.css';
import { Intern } from "./types";

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
  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Current Interns</h2>
      {interns.length > 0 ? (
        <>
          {/* Table view for interns */}
          <div className={styles.applicationCardContainer}>
            <table className={styles.applicationsTable}>
              <tbody>
                {interns.map((intern) => (
                  <tr key={intern.id} className={styles.applicationRow}>
                    {/* Profile Column */}
                    <td>
                      <div className={styles.applicantProfile}>
                        <div className={styles.applicantAvatar}>
                          {intern.name.charAt(0)}
                        </div>
                        <div className={styles.applicantDetails}>
                          <div className={styles.applicantName}>{intern.name}</div>
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
                        <div>{intern.university}</div>
                        <div className={styles.universityTag}>{intern.major}</div>
                      </div>
                    </td>
                    
                    {/* Date Range */}
                    <td>
                      <div>
                        {new Date(intern.startDate).toLocaleDateString()} - {
                          intern.endDate 
                            ? new Date(intern.endDate).toLocaleDateString() 
                            : 'Present'
                        }
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
                      </select>
                    </td>
                    
                    {/* Actions */}
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
                          className={`${styles.actionButton} ${styles.evaluateButton}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEvaluate(intern);
                          }}
                        >
                          Evaluate
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
          <div className={styles.noResultsIcon}>👨‍💼</div>
          <p>No interns found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default InternsList;