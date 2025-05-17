import React from 'react';
import styles from './ReportEditForm.module.css';

interface ReportEditFormProps {
  report: {
    title: string;
    introduction: string;
    body: string;
    coursesApplied: string[];
    finalized: boolean;
  };
  setReport: React.Dispatch<React.SetStateAction<{
    title: string;
    introduction: string;
    body: string;
    coursesApplied: string[];
    finalized: boolean;
  }>>;
}

const ReportEditForm: React.FC<ReportEditFormProps> = ({ 
  report, 
  setReport 
}) => {
  return (
    <div className={styles.reportForm}>
      {report.finalized && (
        <div className={styles.finalizedBadge}>
          <span>✓</span>
          Report Finalized
        </div>
      )}
      
      <div className={styles.formGroup}>
        <label className={styles.formLabel} htmlFor="report-title">Report Title</label>
        <input
          id="report-title"
          className={styles.textInput}
          placeholder="Enter a title for your report..."
          value={report.title}
          onChange={(e) => setReport({...report, title: e.target.value})}
          readOnly={report.finalized}
        />
      </div>
      
      <div className={styles.formGroup}>
        <label className={styles.formLabel} htmlFor="report-introduction">Introduction</label>
        <textarea
          id="report-introduction"
          className={styles.commentTextarea}
          placeholder="Provide a brief introduction about your internship..."
          value={report.introduction}
          onChange={(e) => setReport({...report, introduction: e.target.value})}
          rows={3}
          readOnly={report.finalized}
        />
      </div>
        
      <div className={styles.formGroup}>
        <label className={styles.formLabel} htmlFor="report-body">Report Body</label>
        <textarea
          id="report-body"
          className={styles.commentTextarea}
          placeholder="Describe your experience, tasks performed, skills learned..."
          value={report.body}
          onChange={(e) => setReport({...report, body: e.target.value})}
          rows={6}
          readOnly={report.finalized}
        />
      </div>
    </div>
  );
};

export default ReportEditForm;
