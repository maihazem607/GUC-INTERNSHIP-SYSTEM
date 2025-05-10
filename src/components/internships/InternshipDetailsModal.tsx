import React from 'react';
import Image from "next/image";
import styles from "./InternshipDetailsModal.module.css";
import { Internship } from './types';

interface DetailsModalProps {
  internship: Internship;
  onClose: () => void;
  onApply?: (internship: Internship) => Promise<void>; // Make onApply optional
}

const InternshipDetailsModal: React.FC<DetailsModalProps> = ({
  internship,
  onClose,
  onApply
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedDocuments, setUploadedDocuments] = useState<File[]>([]);
  const [showUploadSection, setShowUploadSection] = useState(false);
  const [additionalNotes, setAdditionalNotes] = useState('');
  
  // Skills display (assuming skills are added to Internship type)
  const skills = internship.skills || ['UI/UX Design', 'Figma', 'Adobe XD', 'Prototyping'];

  // Handler with network error handling
  const handleApply = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await onApply(internship);
      // You could potentially send the documents to your backend here
      // For example: await uploadDocuments(internship.id, uploadedDocuments);
      onClose();
    } catch (err) {
      console.error('Network error:', err);
      setError('Network connection error. Please check your internet connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setUploadedDocuments(prev => [...prev, ...newFiles]);
    }
  };

  const removeDocument = (index: number) => {
    setUploadedDocuments(prev => prev.filter((_, i) => i !== index));
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
        
        <div className={styles.modalInfo}>
          <div className={styles.modalInfoItem}>
            <div className={styles.modalInfoLabel}>Duration</div>
            <div className={styles.modalInfoValue}>{internship.duration}</div>
          </div>
          <div className={styles.modalInfoItem}>
            <div className={styles.modalInfoLabel}>Location</div>
            <div className={styles.modalInfoValue}>{internship.location}</div>
          </div>
          <div className={styles.modalInfoItem}>
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
        
        {showUploadSection ? (
          <div className={styles.modalSection}>
            <h3 className={styles.sectionTitle}>Upload Documents</h3>
            <p className={styles.uploadDescription}>
              Enhance your application by uploading additional documents (CV, cover letter, certificates)
            </p>
            
            <div className={styles.uploadArea}>
              <input 
                type="file" 
                id="document-upload" 
                multiple 
                onChange={handleFileChange}
                className={styles.fileInput}
              />
              <label htmlFor="document-upload" className={styles.uploadButton}>
                Select Files
              </label>
            </div>
            
            {uploadedDocuments.length > 0 && (
              <div className={styles.documentList}>
                <h4>Selected Documents:</h4>
                <ul>
                  {uploadedDocuments.map((doc, index) => (
                    <li key={index} className={styles.documentItem}>
                      <span>{doc.name}</span>
                      <button 
                        onClick={() => removeDocument(index)}
                        className={styles.removeButton}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className={styles.notesSection}>
              <h4>Additional Notes</h4>
              <textarea
                className={styles.notesTextarea}
                placeholder="Add any additional information that might support your application..."
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                rows={4}
              />
            </div>
          </div>
        ) : (
          <div className={styles.uploadPrompt}>
            Want to include additional documents with your application?
            <button 
              className={styles.secondaryButton}
              onClick={() => setShowUploadSection(true)}
            >
              Add Documents
            </button>
          </div>
        )}
        
        {showUploadSection ? (
          <div className={styles.modalSection}>
            <h3 className={styles.sectionTitle}>Upload Documents</h3>
            <p className={styles.uploadDescription}>
              Enhance your application by uploading additional documents (CV, cover letter, certificates)
            </p>
            
            <div className={styles.uploadArea}>
              <input 
                type="file" 
                id="document-upload" 
                multiple 
                onChange={handleFileChange}
                className={styles.fileInput}
              />
              <label htmlFor="document-upload" className={styles.uploadButton}>
                Select Files
              </label>
            </div>
            
            {uploadedDocuments.length > 0 && (
              <div className={styles.documentList}>
                <h4>Selected Documents:</h4>
                <ul>
                  {uploadedDocuments.map((doc, index) => (
                    <li key={index} className={styles.documentItem}>
                      <span>{doc.name}</span>
                      <button 
                        onClick={() => removeDocument(index)}
                        className={styles.removeButton}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className={styles.notesSection}>
              <h4>Additional Notes</h4>
              <textarea
                className={styles.notesTextarea}
                placeholder="Add any additional information that might support your application..."
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                rows={4}
              />
            </div>
          </div>
        ) : (
          <div className={styles.uploadPrompt}>
            Want to include additional documents with your application?
            <button 
              className={styles.secondaryButton}
              onClick={() => setShowUploadSection(true)}
            >
              Add Documents
            </button>
          </div>
        )}
        
        {/* Apply button is removed from SCAD view but kept for student view */}
        {onApply && (
          <div className={styles.modalActions}>
            <button 
              className={styles.applyButton}
              disabled={isLoading}
              onClick={async () => {
                try {
                  await onApply(internship);
                  onClose();
                } catch (err) {
                  console.error('Network error:', err);
                }
              }}
            >
              {isLoading ? 'Processing...' : 'Apply Now'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InternshipDetailsModal;