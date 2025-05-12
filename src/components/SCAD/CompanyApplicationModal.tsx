import React from 'react';
import styles from './CompanyApplicationModal.module.css';
import {
  Clock, CheckCircle, X as XIcon,
  Building, Phone, User, Mail, Smartphone,
  FileText, FileImage, FileSpreadsheet, FileArchive,
  Download, Check, X
} from 'lucide-react';

interface CompanyApplicationModalProps {
  company: {
    id: number;
    name: string;
    industry: string;
    description: string;
    contactPerson: string;
    email: string;
    phone: string;
    applicationDate: string;
    status: 'pending' | 'accepted' | 'rejected';
    size?: 'small' | 'medium' | 'large' | 'corporate';
    logo?: string;
    documents?: Array<{
      id: number;
      name: string;
      type: string;
      url: string;
    }>;
  };
  onClose: () => void;
  onAccept: (id: number) => void;
  onReject: (id: number) => void;
}

// Helper function to generate a consistent logo placeholder
const getCompanyInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Helper function to get background color based on company name
const getLogoBackground = (name: string): string => {
  const colors = [
    '#3182ce', '#805ad5', '#d53f8c', '#dd6b20', '#38b2ac',
    '#3182ce', '#2b6cb0', '#4c51bf', '#667eea', '#00b5d8'
  ];
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

const CompanyApplicationModal: React.FC<CompanyApplicationModalProps> = ({
  company,
  onClose,
  onAccept,
  onReject
}) => {
  // Format date to be more readable
  const formattedDate = new Date(company.applicationDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const initials = getCompanyInitials(company.name);
  const logoBackground = getLogoBackground(company.name);

  // Format company size for display
  const formatCompanySize = (size?: string) => {
    if (!size) return 'Unknown size';

    switch (size) {
      case 'small': return 'Small (≤50 employees)';
      case 'medium': return 'Medium (51-100 employees)';
      case 'large': return 'Large (101-500 employees)';
      case 'corporate': return 'Corporate (500+ employees)';
      default: return size;
    }
  };

  const getStatusIcon = () => {
    switch (company.status) {
      case 'pending':
        return <span className={styles.statusIcon}><Clock size={16} color="#f59e0b" /></span>;
      case 'accepted':
        return <span className={styles.statusIcon}><CheckCircle size={16} color="#10b981" /></span>;
      case 'rejected':
        return <span className={styles.statusIcon}><XIcon size={16} color="#ef4444" /></span>;
      default:
        return null;
    }
  };

  const getStatusMessage = () => {
    const commonText = "Application submitted on " + formattedDate;

    switch (company.status) {
      case 'pending':
        return `${commonText}. This application is awaiting your review.`;
      case 'accepted':
        return `${commonText}. This company has been approved to join the SCAD system.`;
      case 'rejected':
        return `${commonText}. This company's application has been declined.`;
      default:
        return commonText;
    }
  };

  // Function to get document type icon and short name
  const getDocumentTypeInfo = (docName: string, docType: string) => {
    const lowerType = docType.toLowerCase();
    let icon = <FileText size={16} color="#4c51bf" />; // Default

    if (lowerType.includes('pdf')) icon = <FileText size={16} color="#e53e3e" />;
    else if (lowerType.includes('doc') || lowerType.includes('docx')) icon = <FileText size={16} color="#3182ce" />;
    else if (lowerType.includes('jpg') || lowerType.includes('jpeg') || lowerType.includes('png')) icon = <FileImage size={16} color="#805ad5" />;
    else if (lowerType.includes('xls') || lowerType.includes('xlsx')) icon = <FileSpreadsheet size={16} color="#2f855a" />;
    else if (lowerType.includes('ppt') || lowerType.includes('pptx')) icon = <FileSpreadsheet size={16} color="#dd6b20" />;
    else if (lowerType.includes('zip') || lowerType.includes('rar')) icon = <FileArchive size={16} color="#718096" />;

    // Get shortened version of the type for display
    let displayType = docType;
    if (docType.length > 10) {
      const extension = docName.split('.').pop() || '';
      displayType = extension.toUpperCase();
    }

    return { icon, displayType };
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <button className={styles.closeButton} onClick={onClose}>×</button>
          <div className={styles.companyBanner}>
            {company.logo ? (
              <img
                src={company.logo}
                alt={`${company.name} logo`}
                className={styles.companyImage}
              />
            ) : (
              <div className={styles.companyLogo} style={{ backgroundColor: logoBackground }}>
                {initials}
              </div>
            )}

            <div className={styles.companyInfo}>
              <h2 className={styles.companyName}>{company.name}</h2>
              <div className={styles.companyMeta}>
                <span className={styles.industryBadge}>{company.industry}</span>
                {company.size && (
                  <span className={styles.sizeBadge}>{formatCompanySize(company.size)}</span>
                )}
                <span className={styles.applicationDate}>Applied on {formattedDate}</span>
              </div>
            </div>

            <div className={styles.statusBadge} data-status={company.status}>
              {getStatusIcon()}
              {company.status.charAt(0).toUpperCase() + company.status.slice(1)}
            </div>
          </div>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.statusSummary} data-status={company.status}>
            <p>{getStatusMessage()}</p>
          </div>

          <div className={styles.contentGrid}>
            <div className={styles.contentColumn}>
              <div className={styles.sectionCard}>
                <h3 className={styles.sectionTitle}>
                  <span className={styles.sectionIcon}><Building size={18} color="#4c51bf" /></span>
                  Company Description
                </h3>
                <p className={styles.description}>{company.description}</p>
              </div>
            </div>

            <div className={styles.contentColumn}>
              <div className={styles.sectionCard}>
                <h3 className={styles.sectionTitle}>
                  <span className={styles.sectionIcon}><Phone size={18} color="#4c51bf" /></span>
                  Contact Information
                </h3>
                <div className={styles.contactInfo}>
                  <div className={styles.contactItem}>
                    <span className={styles.contactIcon}><User size={16} color="#4c51bf" /></span>
                    <span className={styles.contactLabel}>Contact Person</span>
                    <span className={styles.contactValue}>{company.contactPerson}</span>
                  </div>
                  <div className={styles.contactItem}>
                    <span className={styles.contactIcon}><Mail size={16} color="#4c51bf" /></span>
                    <span className={styles.contactLabel}>Email</span>
                    <span className={styles.contactValue}>{company.email}</span>
                  </div>
                  <div className={styles.contactItem}>
                    <span className={styles.contactIcon}><Smartphone size={16} color="#4c51bf" /></span>
                    <span className={styles.contactLabel}>Phone</span>
                    <span className={styles.contactValue}>{company.phone}</span>
                  </div>
                </div>
              </div>

              {company.documents && company.documents.length > 0 && (
                <div className={styles.sectionCard}>
                  <h3 className={styles.sectionTitle}>
                    <span className={styles.sectionIcon}><FileText size={18} color="#4c51bf" /></span>
                    Verification Documents
                  </h3>
                  <div className={styles.documentsList}>
                    {company.documents.map(doc => {
                      const { icon, displayType } = getDocumentTypeInfo(doc.name, doc.type);
                      return (
                        <div key={doc.id} className={styles.documentItem}>
                          <div className={styles.documentInfo}>
                            <span className={styles.documentIcon}>{icon}</span>
                            <span className={styles.documentName} title={doc.name}>
                              {doc.name.length > 20 ? `${doc.name.substring(0, 18)}...` : doc.name}
                            </span>
                          </div>
                          <a
                            href={doc.url}
                            className={styles.documentDownload}
                            download={doc.name}
                            onClick={(e) => {
                              if (!doc.url.startsWith('blob:') && !doc.url.startsWith('data:')) {
                                e.preventDefault();
                                const link = document.createElement('a');
                                link.href = doc.url;
                                link.download = doc.name;
                                link.target = '_blank';
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              }
                            }}
                          >
                            <span className={styles.downloadIcon}><Download size={16} color="#4c51bf" /></span>
                            Download
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          {company.status === 'pending' && (
            <div className={styles.decisionActions}>
              <p className={styles.decisionText}>Please review the application details carefully before making a decision.</p>
              <div className={styles.buttonGroup}>
                <button
                  className={`${styles.actionButton} ${styles.rejectButton}`}
                  onClick={() => onReject(company.id)}
                >
                  <span className={styles.buttonIcon}><X size={16} /></span> Reject Application
                </button>
                <button
                  className={`${styles.actionButton} ${styles.acceptButton}`}
                  onClick={() => onAccept(company.id)}
                >
                  <span className={styles.buttonIcon}><Check size={16} /></span> Accept Application
                </button>
              </div>
            </div>
          )}
          {company.status !== 'pending' && (
            <button
              className={`${styles.actionButton} ${styles.closeModalButton}`}
              onClick={onClose}
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyApplicationModal;
