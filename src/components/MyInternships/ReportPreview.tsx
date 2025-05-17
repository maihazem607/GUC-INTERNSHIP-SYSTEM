import React from 'react';
import styles from './ReportPreview.module.css';
import { Internship } from '../../components/internships/types';

interface MyInternship extends Internship {
  duration: string;
  major?: string;
}

interface ReportPreviewProps {
  report: {
    title: string;
    introduction: string;
    body: string;
    coursesApplied: string[];
    finalized: boolean;
  };
  internship: MyInternship;
  getCourseNameById: (courseId: string) => string;
  isGeneratingPDF: boolean;
  onDownloadPDF: () => void;
  onFinalizeReport: () => void;
}

const ReportPreview: React.FC<ReportPreviewProps> = ({
  report,
  internship,
  getCourseNameById,
  isGeneratingPDF,
  onDownloadPDF,
  onFinalizeReport
}) => {
  return (
    <div className={styles.reportForm}>
      <div className={styles.reportPreviewContainer}>
        <h2 className={styles.reportPreviewTitle}>{report.title || 'Untitled Report'}</h2>
        
        {/* Report metadata */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          borderBottom: '1px solid #eee',
          paddingBottom: '15px',
          marginBottom: '20px',
          fontSize: '14px',
          color: '#666'
        }}>
          <div>
            <strong>Company:</strong> {internship.company}
          </div>
          <div>
            <strong>Position:</strong> {internship.title}
          </div>
          <div>
            <strong>Duration:</strong> {internship.duration}
          </div>
          <div>
            <strong>Status:</strong> <span style={{
              color: report.finalized ? '#2e7d32' : '#f57c00', 
              fontWeight: 'bold'
            }}>
              {report.finalized ? 'FINALIZED' : 'DRAFT'}
            </span>
          </div>
        </div>
        
        <div className={styles.reportPreviewSection}>
          <h3>Introduction</h3>
          <p>{report.introduction || 'No introduction provided.'}</p>
        </div>
        
        <div className={styles.reportPreviewSection}>
          <h3>Main Content</h3>
          <p>{report.body || 'No content provided.'}</p>
        </div>
          {report.coursesApplied.length > 0 && (
          <div className={styles.reportPreviewSection}>
            <h3>Relevant Courses</h3>
            <div className={styles.reportPreviewCourses}>
              {report.coursesApplied.map(courseId => (
                <div key={courseId} className={styles.reportPreviewCourse}>
                  {getCourseNameById(courseId)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
          <button 
            className={styles.downloadButton}
            onClick={onDownloadPDF}
            disabled={isGeneratingPDF}
          >
            {isGeneratingPDF ? 'Generating...' : (
              <>
                <span>📥</span>
                Download as PDF
              </>
            )}
          </button>
          
          {/* PDF generation progress bar */}
          {isGeneratingPDF && (
            <div className={styles.pdfProgressBar}>
              <div className={styles.pdfProgressFill} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportPreview;
