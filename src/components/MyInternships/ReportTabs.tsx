import React from 'react';
import styles from './ReportTabs.module.css';

export type ReportTabType = 'edit' | 'courses' | 'preview';

interface ReportTabsProps {
  activeTab: ReportTabType;
  setActiveTab: (tab: ReportTabType) => void;
}

const ReportTabs: React.FC<ReportTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className={styles.reportTabs}>
      <button 
        className={`${styles.reportTab} ${activeTab === 'edit' ? styles.activeReportTab : ''}`}
        onClick={() => setActiveTab('edit')}
      >
        Edit Report
      </button>
      <button 
        className={`${styles.reportTab} ${activeTab === 'courses' ? styles.activeReportTab : ''}`}
        onClick={() => setActiveTab('courses')}
      >
        Select Courses
      </button>
      <button 
        className={`${styles.reportTab} ${activeTab === 'preview' ? styles.activeReportTab : ''}`}
        onClick={() => setActiveTab('preview')}
      >
        Preview & Finalize
      </button>
    </div>
  );
};

export default ReportTabs;
