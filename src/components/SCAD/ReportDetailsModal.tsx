import React, { useState } from "react";
import styles from "./ReportDetailsModal.module.css";
import Modal from '../global/Modal';
import { CheckCircle, AlertCircle, XCircle, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { StudentReportData, generateStudentReportPDF } from '../../utils/pdfUtils';

export interface ReportDetailsModalProps {
  title: string;
  studentName: string;
  major: string;
  companyName: string;
  supervisorName: string;
  internshipStartDate: string;
  internshipEndDate: string;
  submissionDate: string;
  status: string;
  content: string;
  evaluationScore?: number;
  evaluationComments?: string;
  clarificationComment?: string;
  comments?: string[];
  onClose: () => void;
  onAccept?: () => void;
  onFlag?: (comment: string) => void;
  onReject?: (comment: string) => void;
  onAddComment?: (comment: string) => void;
  onDeleteComment?: (index: number) => void;
  logo?: string;
}

const getStatusColor = (status: string) => {
  switch(status) {
    case 'accepted':
      return '#1aaf5d';
    case 'rejected':
      return '#e74c3c';
    case 'flagged':
      return '#217dbb';  // Changed from yellow to blue
    case 'pending':
      return '#f5b400';  // Changed from default blue to yellow
    default:
      return '#6c757d';  // Changed default to a neutral gray
  }
};

const getStatusIcon = (status: string) => {
  switch(status) {
    case 'accepted':
      return <CheckCircle size={16} color="#1aaf5d" />;
    case 'rejected':
      return <XCircle size={16} color="#e74c3c" />;
    case 'flagged':
      return <AlertCircle size={16} color="#217dbb" />;
    case 'pending':
      return <AlertCircle size={16} color="#f5b400" />;
    default:
      return null;
  }
};

// Get status badge class similar to ReportResultsModal
const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'accepted':
      return styles.acceptedBadge;
    case 'flagged': 
      return styles.flaggedBadge;
    case 'rejected':
      return styles.rejectedBadge;
    default:
      return styles.pendingBadge;
  }
};

// Get status text similar to ReportResultsModal
const getStatusText = (status: string) => {
  switch (status) {
    case 'accepted':
      return 'Accepted by SCAD';
    case 'flagged':
      return 'Flagged by SCAD - Needs Revision';
    case 'rejected': 
      return 'Rejected by SCAD';
    default:
      return 'Pending SCAD Review';
  }
};

const ReportDetailsModal: React.FC<ReportDetailsModalProps> = ({
  title,
  studentName,
  major,
  companyName,
  supervisorName,
  internshipStartDate,
  internshipEndDate,
  submissionDate,
  status,
  content,
  evaluationScore,
  evaluationComments,
  clarificationComment,
  comments = [], // Default to empty array if not provided
  onClose,
  onAccept,
  onFlag,
  onReject,
  onAddComment,
  onDeleteComment,
  logo = '/logos/GUCInternshipSystemLogo.png' // Default logo
}) => {
  const [comment, setComment] = React.useState(clarificationComment || '');
  const [allComments, setAllComments] = React.useState<string[]>(comments);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  // Update active tab state to only include 'details' and 'feedback'
  const [activeTab, setActiveTab] = useState<'details' | 'feedback'>('details');

  // Split content into introduction and main content sections for better organization
  const contentParts = content.split('\n\n');
  const introduction = contentParts[0] || '';
  const mainContent = contentParts.slice(1).join('\n\n') || '';
  
  const handleDeleteComment = (index: number) => {
    // Create a new array without the deleted comment
    const updatedComments = [...allComments];
    updatedComments.splice(index, 1);
    setAllComments(updatedComments);
    
    // If parent component provided a delete handler, call it
    if (onDeleteComment) {
      onDeleteComment(index);
    }
  };
  const handleDownloadPDF = () => {
    setIsGeneratingPDF(true);
    
    try {
      // Create the student report data structure
      const reportData: StudentReportData = {
        id: 0, // Since we don't have ID in the props, use 0 as default
        title,
        studentId: 0, // Since we don't have student ID in the props, use 0 as default
        studentName,
        major,
        companyName,
        submissionDate,
        status: status as 'pending' | 'accepted' | 'flagged' | 'rejected',
        content,
        supervisorName,
        internshipStartDate,
        internshipEndDate,
        scadFeedback: clarificationComment,
        studentResponses: allComments,
        evaluationScore,
        evaluationComments,
        logo,
      };
      
      // Generate PDF using the utility function
      generateStudentReportPDF(reportData);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };
    // Removed action buttons as requested
  const actions = null;

  return (
    <Modal
      title="Student Internship Report"
      onClose={onClose}
      width="800px"
      actions={actions}
    >
      <div className={styles.reportContainer}>
        {/* Add tabbed interface header similar to ReportResultsModal */}
        <div className={styles.modalHeader}>
          <div className={styles.headerTop}>
            <h2 className={styles.reportTitle}>{title || 'Untitled Report'}</h2>
            <div className={styles.statusContainer}>
              <span className={`${styles.statusBadge} ${getStatusBadgeClass(status)}`}>
                {getStatusText(status)}
              </span>
            </div>
          </div>

          <div className={styles.tabsContainer}>
            <button 
              className={`${styles.tabButton} ${activeTab === 'details' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('details')}
            >
              Report Details
            </button>
            <button 
              className={`${styles.tabButton} ${activeTab === 'feedback' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('feedback')}
            >
              Feedback
            </button>
            {/* Removed the third tab (Student Appeal) */}
          </div>
        </div>

        {/* Report Details Tab Content */}
        {activeTab === 'details' && (
          <div className={styles.reportDetails}>
            {/* Report metadata */}
            <div className={styles.reportSection}>
              <h3 className={styles.sectionTitle}>Internship Information</h3>
              <div className={styles.internshipInfo}>
                <div className={styles.companyHeader}>
                  {logo && (
                    <img src={logo} alt={`${companyName} logo`} className={styles.companyLogo} />
                  )}
                  <h4 className={styles.companyName}>{companyName}</h4>
                </div>
                
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Position:</span>
                    <span className={styles.value}>UI/UX Design Intern</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Student:</span>
                    <span className={styles.value}>{studentName}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Major:</span>
                    <span className={styles.value}>{major}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Supervisor:</span>
                    <span className={styles.value}>{supervisorName}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Start Date:</span>
                    <span className={styles.value}>{internshipStartDate}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>End Date:</span>
                    <span className={styles.value}>{internshipEndDate}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Submission Date:</span>
                    <span className={styles.value}>{submissionDate}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.reportSection}>
              <h3 className={styles.sectionTitle}>Report Content</h3>
              <div className={styles.reportSummary}>
                <div className={styles.summaryItem}>
                  <h4 className={styles.summaryTitle}>Introduction</h4>
                  <p className={styles.summaryText}>{introduction || 'No introduction provided.'}</p>
                </div>
                
                <div className={styles.summaryItem}>
                  <h4 className={styles.summaryTitle}>Main Content</h4>
                  <div className={styles.reportContent}>
                    <p className={styles.reportParagraph}>{mainContent || 'No content provided.'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Download button section */}
            <div className={styles.downloadButtonContainer}>
              <button 
                className={styles.downloadButton}
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF}
              >
                {isGeneratingPDF ? 'Generating...' : (
                  <>
                    <Download size={16} />
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
        )}

        {/* SCAD Feedback Tab Content */}
        {activeTab === 'feedback' && (
          <div className={styles.feedbackTab}>
            <div className={styles.feedbackHeader}>
              <div 
                className={`${styles.statusIndicator} ${
                  status === 'accepted' ? styles.acceptedIndicator :
                  status === 'flagged' ? styles.flaggedIndicator :
                  status === 'rejected' ? styles.rejectedIndicator :
                  styles.pendingIndicator
                }`}
              ></div>
              <div className={styles.feedbackTitle}>
                {getStatusText(status)}
                {status !== 'pending' && (
                  <span className={styles.feedbackDate}>
                    Reviewed on {submissionDate}
                  </span>
                )}
              </div>
            </div>            {status === 'pending' ? (
              <div className={styles.feedbackContent}>
                <div className={styles.commentBlock}>
                  <h4 className={styles.commentTitle}>Pending Review</h4>
                  <div className={styles.commentText}>
                    <p>This report is currently under review. Please provide feedback below before making a decision.</p>
                  </div>
                </div>
                
                {/* Comments section */}
                {allComments.length > 0 && (
                  <div className={styles.commentBlock}>
                    <h4 className={styles.commentTitle}>Previous Comments</h4>
                    <div className={styles.existingComments}>
                      {allComments.map((commentText, index) => (
                        <div key={index} className={styles.commentItem}>
                          <div className={styles.commentHeader}>
                            <span className={styles.commentAuthor}>SCAD</span>
                            <button 
                              className={styles.deleteCommentButton}
                              onClick={() => handleDeleteComment(index)}
                              aria-label="Delete comment"
                            >
                              &times;
                            </button>
                          </div>
                          <p className={styles.commentText}>{commentText}</p>
                          <span className={styles.commentDate}>
                            {new Date().toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Add new comment form for SCAD staff */}
                <div className={styles.addCommentForm}>
                  <textarea
                    className={styles.commentTextarea}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add your feedback or review comments..."
                    rows={4}
                  />
                    <button 
                    className={styles.submitCommentButton}
                    onClick={() => {
                      if (comment.trim() && onAddComment) {
                        onAddComment(comment);
                        setAllComments([...allComments, comment]);
                        setComment('');
                      }
                    }}
                    disabled={!comment.trim()}
                  >
                    Add Feedback
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.feedbackContent}>                {/* Decision Feedback Section */}
                {evaluationComments && (
                  <div className={styles.commentBlock}>
                    <h4 className={styles.commentTitle}>Review Decision</h4>
                    <div className={styles.commentText}>
                      <p>{evaluationComments}</p>
                    </div>
                  </div>
                )}

                {/* Comments section - merged from the removed Student Appeal tab */}
                {allComments.length > 0 && (
                  <div className={styles.commentBlock}>
                    <h4 className={styles.commentTitle}>Previous Comments</h4>
                    <div className={styles.existingComments}>
                      {allComments.map((commentText, index) => (
                        <div key={index} className={styles.commentItem}>
                          <div className={styles.commentHeader}>
                            <span className={styles.commentAuthor}>SCAD</span>
                            <button 
                              className={styles.deleteCommentButton}
                              onClick={() => handleDeleteComment(index)}
                              aria-label="Delete comment"
                            >
                              &times;
                            </button>
                          </div>
                          <p className={styles.commentText}>{commentText}</p>
                          <span className={styles.commentDate}>
                            {new Date().toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add new comment form for SCAD staff */}
                <div className={styles.addCommentForm}>
                  <textarea
                    className={styles.commentTextarea}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add your feedback or review comments..."
                    rows={4}
                  />
                  <button 
                    className={styles.submitCommentButton}
                    onClick={() => {
                      if (comment.trim() && onAddComment) {
                        onAddComment(comment);
                        setAllComments([...allComments, comment]);
                        setComment('');
                      }
                    }}
                    disabled={!comment.trim()}
                  >
                    Add Feedback
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        {/* Removed the Student Response tab content entirely */}
      </div>
    </Modal>
  );
};

export default ReportDetailsModal;
