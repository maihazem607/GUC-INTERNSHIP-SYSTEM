import { useState, useEffect } from 'react';
import React from 'react';
import Image from "next/image";
import styles from "./InternshipDetailsModal.module.css";
import { Internship, DocumentInfo } from './types';

interface DetailsModalProps {
  internship: Internship;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onApply?: (application: {
    internshipId: number;
    documents: File[];
    additionalNotes?: string;
  }) => Promise<void>;
}

const InternshipDetailsModal: React.FC<DetailsModalProps> = ({
  internship,
  onClose,
  onEdit,
  onDelete,
  onApply
}) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [documents, setDocuments] = useState<File[]>([]);
  const [showApplicationSection, setShowApplicationSection] = useState(false);
  const [additionalNotes, setAdditionalNotes] = useState<string>('');
    // Skills display
  const skills = internship.skills || ['UI/UX Design', 'Figma', 'Adobe XD', 'Prototyping'];
  
  // Clear error when documents are added
  useEffect(() => {
    if (documents.length > 0 && error === 'Please upload at least one document') {
      setError(null);
    }
  }, [documents, error]);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const fileList = Array.from(event.target.files);
      setDocuments(prev => [...prev, ...fileList]);
      // Clear any error messages when files are uploaded
      setError(null);
    }
  };

  const removeDocument = (indexToRemove: number) => {
    setDocuments(documents.filter((_, index) => index !== indexToRemove));
  };  
    // Reference for upload area to scroll into view on error
  const uploadAreaRef = React.useRef<HTMLDivElement>(null);
  
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (documents.length === 0) {
      setError('Please upload at least one document');
      // Scroll to the upload area with a small delay to ensure the error tooltip is rendered
      setTimeout(() => {
        uploadAreaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    try {
      if (onApply) {
        await onApply({
          internshipId: internship.id,
          documents,
          additionalNotes: additionalNotes.trim() || undefined,
        });
      }
      
    } catch (error) {
      console.error('Error submitting application:', error);
      setError('Failed to submit application. Please check your internet connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{internship.title}</h2>
          <div className={styles.modalHost}>
            {internship.logo && (
              <Image 
                src={internship.logo} 
                alt={`${internship.company} logo`} 
                width={40} 
                height={40} 
                className={styles.modalHostLogo}
              />
            )}
            <span className={styles.modalHostName}>{internship.company}</span>
          </div>
        </div>
        
        <div className={styles.modalSection}>
          <div className={styles.modalInfo}>
            <div className={styles.modalInfoItem}>
              <div className={styles.modalInfoLabel}>Duration</div>
              <div className={styles.modalInfoValue}>{internship.duration}</div>
            </div>
            <div className={styles.modalInfoItem}>
              <div className={styles.modalInfoLabel}>Location</div>
              <div className={styles.modalInfoValue}>{internship.location}</div>
            </div>            <div className={styles.modalInfoItem}>
              <div className={styles.modalInfoLabel}>Compensation</div>
              <div className={styles.modalInfoValue}>
                {internship.isPaid ? 
                  <span className={styles.paidBadge}>Paid: {internship.salary}</span> : 
                  <span className={styles.unpaidBadge}>Unpaid</span>
                }
              </div>
            </div>
            <div className={styles.modalInfoItem}>
              <div className={styles.modalInfoLabel}>Start Date</div>
              <div className={styles.modalInfoValue}>{internship.date}</div>
            </div>
            <div className={styles.modalInfoItem}>
              <div className={styles.modalInfoLabel}>Applications</div>
              <div className={styles.modalInfoValue}>
                {internship.applicationsCount || 0} applicant{(internship.applicationsCount !== 1) ? 's' : ''}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.modalSection}>
          <h3 className={styles.sectionTitle}>Job Description</h3>
          <p className={styles.modalDescription}>{internship.description}</p>
        </div>
        
        <div className={styles.modalSection}>
          <h3 className={styles.sectionTitle}>Required Skills</h3>
          <div className={styles.skillsContainer}>
            {skills.map((skill, index) => (
              <span key={index} className={styles.skillBadge}>{skill}</span>
            ))}
          </div>
        </div>        
          {onApply && showApplicationSection && (
          <>
            <div className={styles.modalSection}>
              <h3 className={styles.sectionTitle}>Application Documents</h3>
              
              {internship.requiredDocuments && internship.requiredDocuments.length > 0 && (
                <div className={styles.requiredDocumentsSection}>
                  <h4>Required Documents</h4>
                  <ul className={styles.requiredDocsList}>
                    {internship.requiredDocuments.map((doc: DocumentInfo, idx: number) => (
                      <li key={idx}>{doc.name}</li>
                    ))}
                  </ul>
                </div>
              )}
                <p className={styles.uploadDescription}>
                Upload documents to support your application (CV, cover letter, certificates)
              </p>
                <div 
                ref={uploadAreaRef}
                className={`${styles.uploadArea} ${error ? styles.uploadAreaError : ''}`}
              >
                {error && (
                  <div className={styles.errorTooltip}>
                    {error}
                  </div>
                )}
                <label htmlFor="document-upload" className={styles.uploadButton}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  Upload Documents
                  <input 
                    type="file" 
                    id="document-upload" 
                    multiple 
                    onChange={handleFileChange}
                    className={styles.fileInput}
                    disabled={isSubmitting}
                  />
                </label>
              </div>
                {documents.length > 0 && (
                <ul className={styles.documentList}>
                  {documents.map((doc, index) => (
                    <li key={index} className={styles.documentItem}>
                      <div className={styles.documentInfo}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px', color: '#1976d2'}}>
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <line x1="16" y1="13" x2="8" y2="13"></line>
                          <line x1="16" y1="17" x2="8" y2="17"></line>
                          <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                        <span>{doc.name}</span>
                      </div>
                      <button 
                        type="button"
                        onClick={() => removeDocument(index)}
                        className={styles.removeButton}
                        disabled={isSubmitting}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className={styles.modalSection}>
              <h3 className={styles.sectionTitle}>Additional Notes</h3>
              <textarea
                className={styles.notesTextarea}
                placeholder="Add any additional information that might support your application..."
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                disabled={isSubmitting}
                rows={4}
              />
            </div>
            
            <div className={styles.modalActions}>
              <button
                type="button"
                onClick={() => setShowApplicationSection(false)}
                disabled={isSubmitting}
                className={styles.cancelBtn}
              >
                Cancel
              </button>
              <button 
                className={styles.applyButton}
                disabled={isSubmitting}
                onClick={handleSubmit}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </>
        )}
          {onApply && !showApplicationSection && (
          <div className={styles.modalActions}>
            <button 
              className={styles.applyButton}
              onClick={() => setShowApplicationSection(true)}
            >
              Apply Now
            </button>
          </div>
        )}          {(onEdit || onDelete) && !showApplicationSection && (
          <div className={styles.modalActions} style={{ justifyContent: 'space-between' }}>
              {onDelete && (
              <button 
                className={`${styles.cancelBtn}`}
                onClick={onDelete}
              >
                Delete Internship
              </button>
            )}
            {onEdit && (
              <button 
                className={styles.applyButton}
                onClick={onEdit}
              >
                Edit Internship
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InternshipDetailsModal;