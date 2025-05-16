import React, { useState } from 'react';
import { Company, CompanyDocument } from './types';
import styles from './CompanyDetailsModal.module.css';
import { ThumbsUp, MapPin, Clock, CheckCircle, Star, FileText, Download } from 'lucide-react';
import { generateCompanyDocumentPDF } from '../../utils/pdfUtils';

interface Props {
  company: Company;
  onClose: () => void;
  onSave: () => void;
}

const CompanyDetailsModal: React.FC<Props> = ({ company, onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'positions' | 'documents'>('overview');

  const renderStarRating = (rating: number) => {
    return (
      <div className={styles.starRating}>
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            size={16}
            fill={i < Math.floor(rating) ? "#FFD700" : i < rating ? "#FFD700" : "none"}
            color={i < Math.floor(rating) ? "#FFD700" : "#D1D5DB"}
            className={`${styles.star} ${i < Math.floor(rating) ? styles.filled : i < rating ? styles.halfFilled : ''}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.companyBranding}>
            <div className={styles.logoContainer}>
              <img src={company.logo} alt={`${company.name} logo`} className={styles.logo} />
            </div>
            <div className={styles.companyInfo}>
              <h2 className={styles.companyName}>{company.name}</h2>
              <div className={styles.companyMeta}>
                <span>{company.industry}</span>
                <span className={styles.separator}>•</span>
                <span>{company.location}</span>
                <span className={styles.separator}>•</span>
                <div className={styles.ratingDisplay}>
                  <span className={styles.ratingNumber}>{company.rating.toFixed(1)}</span>
                  {renderStarRating(company.rating)}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.matchScore}>
            <div className={styles.matchPercentCircle}>
              <svg viewBox="0 0 36 36" className={styles.circularChart}>
                <path
                  className={styles.circleBg}
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={styles.circle}
                  strokeDasharray={`${company.matchScore}, 100`}
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <text x="18" y="20.35" className={styles.percentage}>{company.matchScore}%</text>
              </svg>
            </div>
            <span className={styles.matchLabel}>Match Score</span>
          </div>

          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tabButton} ${activeTab === 'overview' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Company Overview
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'reviews' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Intern Reviews ({company.pastInternReviews.length})
          </button>          <button
            className={`${styles.tabButton} ${activeTab === 'positions' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('positions')}
          >
            Open Positions ({company.openPositions})
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'documents' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('documents')}
          >
            Documents {company.documents ? `(${company.documents.length})` : ''}
          </button>
        </div>

        <div className={styles.tabContent}>
          {activeTab === 'overview' && (
            <div className={styles.overviewTab}>
              <div className={styles.recommendationTag} data-level={company.recommendationLevel.toLowerCase()}>
                <span className={styles.recommendIcon}>
                  <ThumbsUp size={18} color="#4c51bf" />
                </span>
                <span className={styles.recommendText}>
                  <strong>{company.recommendationLevel} Recommendation</strong> based on past intern feedback
                </span>
              </div>

              <h3 className={styles.sectionTitle}>About {company.name}</h3>
              <p className={styles.description}>{company.description}</p>

              <div className={styles.twoColumnSection}>
                <div className={styles.column}>
                  <h3 className={styles.sectionTitle}>Technologies Used</h3>
                  <div className={styles.tagsList}>
                    {company.technologiesUsed.map((tech, index) => (
                      <span key={index} className={styles.tag}>{tech}</span>
                    ))}
                  </div>
                </div>

                <div className={styles.column}>
                  <h3 className={styles.sectionTitle}>Benefits</h3>
                  <ul className={styles.benefitsList}>
                    {company.benefits.map((benefit, index) => (
                      <li key={index} className={styles.benefitItem}>
                        <span className={styles.benefitIcon}>
                          <CheckCircle size={16} color="#4c51bf" />
                        </span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className={styles.statsSection}>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>{company.internshipCount}</span>
                  <span className={styles.statLabel}>Past Interns</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>{company.openPositions}</span>
                  <span className={styles.statLabel}>Open Positions</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>{company.rating.toFixed(1)}</span>
                  <span className={styles.statLabel}>Avg. Rating</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className={styles.reviewsTab}>
              {company.pastInternReviews.length > 0 ? (
                company.pastInternReviews.map((review, index) => (
                  <div key={index} className={styles.reviewCard}>
                    <div className={styles.reviewHeader}>
                      <div className={styles.reviewerInfo}>
                        <h4 className={styles.reviewerName}>{review.name}</h4>
                        <span className={styles.reviewPosition}>{review.position}</span>
                      </div>
                      <div className={styles.reviewMeta}>
                        <div className={styles.reviewRating}>
                          {renderStarRating(review.rating)}
                          <span className={styles.ratingValue}>{review.rating.toFixed(1)}</span>
                        </div>
                        <span className={styles.reviewYear}>{review.year}</span>
                      </div>
                    </div>
                    <p className={styles.reviewComment}>{review.comment}</p>
                  </div>
                ))
              ) : (
                <div className={styles.noReviews}>
                  <p>No reviews available yet for this company.</p>
                </div>
              )}

              <div className={styles.reviewsDisclaimer}>
                <p>Reviews are from past GUC interns who completed internships at this company.</p>
              </div>
            </div>
          )}

          {activeTab === 'positions' && (
            <div className={styles.positionsTab}>
              <div className={styles.positionsDisclaimer}>
                <p>
                  <strong>Note:</strong> This is a sample of positions that may be available.
                  Check the company's careers page or internship applications for the most current openings.
                </p>
              </div>

              {/* Mock positions - in a real app, these would come from an API */}
              <div className={styles.positionsList}>
                <div className={styles.positionCard}>
                  <h4 className={styles.positionTitle}>Software Engineering Intern</h4>
                  <div className={styles.positionMeta}>
                    <span className={styles.positionLocation}>
                      <span className={styles.iconLocation}>
                        <MapPin size={16} color="#666" />
                      </span> {company.location}
                    </span>
                    <span className={styles.positionDuration}>
                      <span className={styles.iconDuration}>
                        <Clock size={16} color="#666" />
                      </span> 3-6 months
                    </span>
                  </div>
                  <div className={styles.positionSkills}>
                    <span className={styles.positionSkill}>JavaScript</span>
                    <span className={styles.positionSkill}>React</span>
                    <span className={styles.positionSkill}>Node.js</span>
                  </div>
                  <a href="#" className={styles.positionLink}>View Details</a>
                </div>

                <div className={styles.positionCard}>
                  <h4 className={styles.positionTitle}>Data Science Intern</h4>
                  <div className={styles.positionMeta}>
                    <span className={styles.positionLocation}>
                      <span className={styles.iconLocation}>
                        <MapPin size={16} color="#666" />
                      </span> {company.location}
                    </span>
                    <span className={styles.positionDuration}>
                      <span className={styles.iconDuration}>
                        <Clock size={16} color="#666" />
                      </span> 4 months
                    </span>
                  </div>
                  <div className={styles.positionSkills}>
                    <span className={styles.positionSkill}>Python</span>
                    <span className={styles.positionSkill}>Machine Learning</span>
                    <span className={styles.positionSkill}>SQL</span>
                  </div>
                  <a href="#" className={styles.positionLink}>View Details</a>
                </div>

                <div className={styles.positionCard}>
                  <h4 className={styles.positionTitle}>UX/UI Design Intern</h4>
                  <div className={styles.positionMeta}>
                    <span className={styles.positionLocation}>
                      <span className={styles.iconLocation}>
                        <MapPin size={16} color="#666" />
                      </span> {company.location}
                    </span>
                    <span className={styles.positionDuration}>
                      <span className={styles.iconDuration}>
                        <Clock size={16} color="#666" />
                      </span> 3 months
                    </span>
                  </div>
                  <div className={styles.positionSkills}>
                    <span className={styles.positionSkill}>Figma</span>
                    <span className={styles.positionSkill}>Adobe XD</span>
                    <span className={styles.positionSkill}>UI Design</span>
                  </div>
                  <a href="#" className={styles.positionLink}>View Details</a>
                </div>
              </div>

              <div className={styles.viewAllPositions}>
                <button className={styles.viewAllButton}>
                  View All {company.openPositions} Open Positions
                </button>              </div>
            </div>
          )}
          
          {activeTab === 'documents' && (
            <div className={styles.documentsTab}>
              <div className={styles.documentsDisclaimer}>
                <p>
                  <strong>Company Documents:</strong> These resources provide additional information about the company, 
                  internship programs, and application guidelines. Click to download.
                </p>
              </div>
              
              {/* Add mock documents if they don't exist */}
              {(!company.documents || company.documents.length === 0) ? (
                // Create sample documents for demonstration
                (() => {
                  const sampleDocuments: CompanyDocument[] = [
                    {
                      id: 1,
                      title: "Internship Program Overview",
                      type: "PDF",
                      description: "Details about our internship program structure, duration, and benefits.",
                      sections: [
                        {
                          title: "Program Introduction",
                          content: `${company.name}'s Internship Program is designed to provide students with hands-on experience in a professional environment. Our program runs for 3-6 months and offers exposure to real-world projects and challenges.`
                        },
                        {
                          title: "Program Benefits",
                          content: "Participants in our internship program receive competitive compensation, mentorship from industry experts, networking opportunities, and the possibility of full-time employment after graduation."
                        },
                        {
                          title: "Application Process",
                          content: "The application process includes an online application, resume review, technical or skill assessment, and interviews with the hiring team and potential mentors."
                        }
                      ]
                    },
                    {
                      id: 2,
                      title: "Student Guidelines",
                      type: "PDF",
                      description: "Information for students about expectations, code of conduct, and tips for success.",
                      sections: [
                        {
                          title: "Expectations",
                          content: "Interns are expected to work approximately 40 hours per week, contribute meaningfully to assigned projects, attend team meetings and company events, and maintain professional conduct."
                        },
                        {
                          title: "Code of Conduct",
                          content: "All interns must adhere to our company values of integrity, respect, innovation, and excellence. Confidentiality of company information must be maintained at all times."
                        },
                        {
                          title: "Tips for Success",
                          content: "Be proactive in seeking feedback, ask questions when needed, network across departments, maintain a positive attitude, and document your achievements for your final report."
                        }
                      ]
                    }
                  ];
                  
                  // Display the sample documents
                  return (
                    <div className={styles.documentsList}>
                      {sampleDocuments.map((doc) => (
                        <div key={doc.id} className={styles.documentCard}>
                          <div className={styles.documentInfo}>
                            <div className={styles.documentIcon}>
                              <FileText size={24} />
                            </div>
                            <div className={styles.documentDetails}>
                              <h4 className={styles.documentTitle}>{doc.title}</h4>
                              <p className={styles.documentDescription}>{doc.description}</p>
                            </div>
                          </div>
                          <button 
                            className={styles.downloadDocumentButton}
                            onClick={() => generateCompanyDocumentPDF({
                              companyName: company.name,
                              documentTitle: doc.title,
                              contentSections: doc.sections
                            })}
                          >
                            <Download size={16} />
                            Download
                          </button>
                        </div>
                      ))}
                    </div>
                  );
                })()
              ) : (
                // Display actual company documents
                <div className={styles.documentsList}>
                  {company.documents.map((doc) => (
                    <div key={doc.id} className={styles.documentCard}>
                      <div className={styles.documentInfo}>
                        <div className={styles.documentIcon}>
                          <FileText size={24} />
                        </div>
                        <div className={styles.documentDetails}>
                          <h4 className={styles.documentTitle}>{doc.title}</h4>
                          <p className={styles.documentDescription}>{doc.description}</p>
                        </div>
                      </div>
                      <button 
                        className={styles.downloadDocumentButton}
                        onClick={() => generateCompanyDocumentPDF({
                          companyName: company.name,
                          documentTitle: doc.title,
                          contentSections: doc.sections
                        })}
                      >
                        <Download size={16} />
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.saveButton} onClick={onSave}>
            Save to Favorites
          </button>
          <button className={styles.websiteButton}>
            Visit Company Website
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailsModal;
