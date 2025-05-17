import React from 'react';
import styles from './ReportModal.module.css';
import Modal from '../global/Modal';
import ReportTabs from './ReportTabs';
import ReportEditForm from './ReportEditForm';
import CourseSelectionForm from './CourseSelectionForm';
import ReportPreview from './ReportPreview';
import { Internship } from '../../components/internships/types';

interface MyInternship extends Internship {
  applicationStatus: "none" | "pending" | "accepted" | "rejected" | "finalized" | undefined;
  applicationDate: string;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
  major?: string;
  duration: string;
  report?: {
    title: string;
    introduction: string;
    body: string;
    coursesApplied?: string[];
    finalized?: boolean;
  } | null;
}

interface ReportModalProps {
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
  selectedInternship: MyInternship;
  onClose: () => void;
  onSubmit: () => void;
  onDelete: () => void;
  isSubmitting: boolean;
  activeTab: 'edit' | 'courses' | 'preview';
  setActiveTab: React.Dispatch<React.SetStateAction<'edit' | 'courses' | 'preview'>>;
  availableCourses: { id: string; name: string }[];
  onToggleCourse: (courseId: string) => void;
  getCourseNameById: (courseId: string) => string;
  onFinalizeReport: () => void;
  isGeneratingPDF: boolean;
  onDownloadPDF: () => void;
}

const ReportModal: React.FC<ReportModalProps> = ({
  report,
  setReport,
  selectedInternship,
  onClose,
  onSubmit,
  onDelete,
  isSubmitting,
  activeTab,
  setActiveTab,
  availableCourses,
  onToggleCourse,
  getCourseNameById,
  onFinalizeReport,
  isGeneratingPDF,
  onDownloadPDF
}) => {  // Prepare action buttons for the modal
  const actions = (
    <>
      <div>
        {/* Only show delete button if report exists and is not finalized */}
        {selectedInternship.report && !report.finalized && (
          <button 
            className={styles.deleteButton}
            onClick={onDelete}
          >
            Reset
          </button>
        )}
      </div>
      
      {/* If report is finalized, show a "Finalized" badge instead of buttons */}
      {report.finalized ? (
        <div className={styles.finalizedBadge}>
          <span>Finalized</span>
          <span className={styles.finalizedNote}>(Read-only)</span>
        </div>
      ) : (
        <div className={styles.actionButtonsGroup}>
          <button 
            className={styles.saveDraftButton}
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            Save Draft
          </button>            
            <button 
              className={styles.submitButton}
              onClick={() => {
                if (window.confirm('Once submitted, this report will become read-only and cannot be edited. Continue?')) {
                  // Call the finalize function to properly set the report as finalized
                  onFinalizeReport();
                }
              }}
              disabled={isSubmitting || report.title.trim() === '' || report.body.trim() === ''}
            >
              Submit
            </button>
        </div>
      )}
    </>
  );

  return (
    <Modal
      title="Internship Report"
      onClose={onClose}
      width="800px"
      actions={actions}
    >
      <div className={styles.modalHost}>
        {selectedInternship.logo && (
          <img 
            src={selectedInternship.logo} 
            alt={`${selectedInternship.company} logo`} 
            width={40} 
            height={40} 
            className={styles.modalHostLogo}
          />
        )}
        <span className={styles.modalHostName}>{selectedInternship.company} - {selectedInternship.title}</span>
      </div>
      
      {/* Report tabs */}
      <ReportTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Tab Content */}
      {activeTab === 'edit' && (
        <ReportEditForm report={report} setReport={setReport} />
      )}
      
      {activeTab === 'courses' && (
        <CourseSelectionForm 
          availableCourses={availableCourses}
          report={report}
          onToggleCourse={onToggleCourse}
        />
      )}
      
      {activeTab === 'preview' && (
        <ReportPreview 
          report={report}
          internship={selectedInternship}
          getCourseNameById={getCourseNameById}
          isGeneratingPDF={isGeneratingPDF}
          onDownloadPDF={onDownloadPDF}
          onFinalizeReport={onFinalizeReport}
        />
      )}
    </Modal>
  );
};

export default ReportModal;
