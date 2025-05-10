"use client";
import React, { useState, useEffect } from 'react';
import Navigation from "../../src/components/global/Navigation";
import SearchBar from "../../src/components/global/SearchBar";
import FilterSidebar from "../../src/components/global/FilterSidebar";
import InternshipCard from "../../src/components/internships/InternshipCard";
import InternshipDetailsModal from "../../src/components/internships/InternshipDetailsModal";
import { Internship, FilterOptions } from "../../src/components/internships/types";
import NotificationSystem, { useNotification } from "../../src/components/global/NotificationSystem";
import styles from "./page.module.css";

// Extended Internship type to include application status and evaluation
interface MyInternship extends Internship {
  applicationStatus: 'none' | 'applied' | 'reviewing' | 'accepted' | 'rejected';
  applicationDate: string;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
  evaluation?: {
    rating: number;
    comment: string;
    recommended: boolean;
  } | null;
}

const MyInternshipsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'applications' | 'current' | 'past'>('applications');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({
    status: 'All',
    date: 'All',
  });
  const [myInternships, setMyInternships] = useState<MyInternship[]>([]);
  const [filteredInternships, setFilteredInternships] = useState<MyInternship[]>([]);
  const [selectedInternship, setSelectedInternship] = useState<MyInternship | null>(null);
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [evaluation, setEvaluation] = useState({
    rating: 0,
    comment: '',
    recommended: false
  });
  const { notification, visible, showNotification, hideNotification } = useNotification();
  
  // Filter options
  const statusOptions = ['All', 'Pending', 'Finalized', 'Accepted', 'Rejected'];
  const dateOptions = ['All', 'Recent', '2023', '2022'];
  
  // Format filters for the global FilterSidebar component based on active tab
  const getFormattedFilters = () => {
    if (activeTab === 'applications') {
      return [
        {
          title: "Status",
          options: statusOptions,
          type: "status",
          value: activeFilters.status || 'All'
        }
      ];
    } else if (activeTab === 'past') {
      return [
        {
          title: "Date",
          options: dateOptions,
          type: "date",
          value: activeFilters.date || 'All'
        }
      ];
    }
    return [];
  };

  // Mock data for internships
  useEffect(() => {
    // This would typically be an API call to fetch the user's internships
    const mockInternships: MyInternship[] = [
      {
        id: 1,
        company: 'Amazon',
        title: 'UI/UX Design Intern',
        duration: '3 months',
        date: '20 May 2023',
        location: 'San Francisco, CA',
        industry: 'Technology',
        isPaid: true,
        salary: '$25/hr',
        logo: '/logos/amazon.png',
        description: 'Design user interfaces for Amazon web services products.',
        applicationStatus: 'accepted',
        applicationDate: '15 April 2023',
        startDate: '20 May 2023',
        endDate: '20 August 2023',
        isActive: false,
        skills: ['UI/UX Design', 'Figma', 'Adobe XD'],
        evaluation: null
      },
      {
        id: 2,
        company: 'Google',
        title: 'Frontend Developer Intern',
        duration: '6 months',
        date: '10 June 2023',
        location: 'Mountain View, CA',
        industry: 'Technology',
        isPaid: true,
        salary: '$30/hr',
        logo: '/logos/google.png',
        description: 'Develop frontend components for Google Cloud Platform.',        applicationStatus: 'applied',
        applicationDate: '1 May 2023',
        skills: ['React', 'TypeScript', 'CSS']
      },
      {
        id: 3,
        company: 'Microsoft',
        title: 'Software Engineer Intern',
        duration: '3 months',
        date: '15 July 2023',
        location: 'Redmond, WA',
        industry: 'Technology',
        isPaid: true,
        salary: '$28/hr',
        logo: '/logos/microsoft.png',
        description: 'Work on backend systems for Microsoft Azure.',        
        applicationStatus: 'reviewing',
        applicationDate: '10 May 2023',
        skills: ['Java', 'Spring Boot', 'Azure']
      },
      {
        id: 4,
        company: 'Spotify',
        title: 'Data Analyst Intern',
        duration: '4 months',
        date: '1 August 2023',
        location: 'New York, NY',
        industry: 'Entertainment',
        isPaid: true,
        salary: '$26/hr',
        logo: '/logos/spotify.png',
        description: 'Analyze user data to improve music recommendations.',
        applicationStatus: 'rejected',
        applicationDate: '15 May 2023',
        skills: ['Python', 'SQL', 'Data Visualization']
      },
      {
        id: 5,
        company: 'Adobe',
        title: 'Product Design Intern',
        duration: '6 months',
        date: '1 September 2023',
        location: 'San Jose, CA',
        industry: 'Design',
        isPaid: true,
        salary: '$27/hr',
        logo: '/logos/adobe.png',
        description: 'Design user interfaces for Creative Cloud applications.',
        applicationStatus: 'accepted',
        applicationDate: '20 May 2023',
        startDate: '1 September 2023',
        isActive: true,
        skills: ['UI Design', 'UX Research', 'Adobe CC']
      },
      {
        id: 6,
        company: 'Tesla',
        title: 'Engineering Intern',
        duration: '3 months',
        date: '1 January 2023',
        location: 'Austin, TX',
        industry: 'Automotive',
        isPaid: true,
        salary: '$29/hr',
        logo: '/logos/tesla.png',
        description: 'Work on electric vehicle battery technology.',
        applicationStatus: 'accepted',
        applicationDate: '15 November 2022',
        startDate: '1 January 2023',
        endDate: '1 April 2023',
        isActive: false,
        skills: ['Mechanical Engineering', 'CAD', 'Battery Tech'],
        evaluation: {
          rating: 4,
          comment: 'Great experience with cutting-edge technology, but long working hours.',
          recommended: true
        }
      },
      {
        id: 7,
        company: 'IBM',
        title: 'Backend Developer Intern',
        duration: '4 months',
        date: '15 February 2023',
        location: 'Armonk, NY',
        industry: 'Technology',
        isPaid: true,
        salary: '$25/hr',
        logo: '/logos/ibm.png',
        description: 'Develop microservices for IBM Cloud.',
        applicationStatus: 'accepted',
        applicationDate: '1 December 2022',
        startDate: '15 February 2023',
        endDate: '15 June 2023',
        isActive: false,
        skills: ['Java', 'Spring', 'Docker'],
        evaluation: null
      }
    ];
    
    setMyInternships(mockInternships);
    setFilteredInternships(mockInternships);
  }, []);

  // Filter internships based on active tab, search term, and filters
  useEffect(() => {
    let results = [...myInternships];
    
    // Filter by tab
    if (activeTab === 'applications') {
      // Show all applications
      results = myInternships.filter(internship => 
        ['pending', 'finalized', 'accepted', 'rejected'].includes(internship.applicationStatus)
      );
        // Apply status filter if not "All"
      if (activeFilters.status && activeFilters.status !== 'All') {
        results = results.filter(internship => 
          internship.applicationStatus === activeFilters.status?.toLowerCase()
        );
      }
    } else if (activeTab === 'current') {
      // Show only active internships
      results = myInternships.filter(internship => 
        internship.isActive === true
      );
    } else if (activeTab === 'past') {
      // Show completed internships
      results = myInternships.filter(internship => 
        internship.applicationStatus === 'accepted' && internship.isActive === false
      );
        // Apply date filter if not "All"
      if (activeFilters.date && activeFilters.date !== 'All') {
        // Implementation would depend on how dates are stored
        // For this example, we're just checking if there's a filter applied
        if (activeFilters.date === 'Recent') {
          // Example: filter for internships completed in the last 3 months
          // This would need actual date logic in a real implementation
          results = results.slice(0, 2); // Just for demonstration
        }
      }
    }
    
    // Apply search term (company or job title)
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        internship => 
          internship.title.toLowerCase().includes(term) || 
          internship.company.toLowerCase().includes(term)
      );
    }
    
    setFilteredInternships(results);
  }, [myInternships, activeTab, searchTerm, activeFilters]);

  // Handle viewing details of an internship
  const handleViewDetails = (internship: Internship) => {
    const myInternship = myInternships.find(item => item.id === internship.id) as MyInternship;
    setSelectedInternship(myInternship);
  };

  // Handle closing the details modal
  const handleCloseModal = () => {
    setSelectedInternship(null);
  };

  // Handle opening evaluation modal
  const handleEvaluate = (internship: MyInternship) => {
    setSelectedInternship(internship);
    
    // Pre-fill existing evaluation if any
    if (internship.evaluation) {
      setEvaluation(internship.evaluation);
    } else {
      setEvaluation({
        rating: 0,
        comment: '',
        recommended: false
      });
    }
    
    setShowEvaluationModal(true);
  };  // Handle submitting an evaluation
  const handleSubmitEvaluation = () => {
    if (selectedInternship) {
      // Update the internship with the new evaluation
      const updatedInternships = myInternships.map(internship => {
        if (internship.id === selectedInternship.id) {
          return {
            ...internship,
            evaluation: evaluation
          };
        }
        return internship;
      });
      
      setMyInternships(updatedInternships);
      setShowEvaluationModal(false);
      setSelectedInternship(null);
      
      // Show success notification
      showNotification({
        message: `Evaluation for ${selectedInternship.title} at ${selectedInternship.company} submitted successfully!`,
        type: 'success'
      });
    }
  };
  // Handle deleting an evaluation
  const handleDeleteEvaluation = () => {
    if (selectedInternship) {
      // Remove the evaluation
      const updatedInternships = myInternships.map(internship => {
        if (internship.id === selectedInternship.id) {
          return {
            ...internship,
            evaluation: null
          };
        }
        return internship;
      });
      
      setMyInternships(updatedInternships);
      setShowEvaluationModal(false);
      setSelectedInternship(null);
      
            // Show notification
      showNotification({
        message: `Evaluation for ${selectedInternship.title} at ${selectedInternship.company} has been deleted.`,
        type: 'info'
      });
    }
  };

  // Handle filter changes
  const handleFilterChange = (filterType: string, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Get the appropriate status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'accepted':
        return styles.acceptedBadge;
      case 'rejected':
        return styles.rejectedBadge;
      case 'finalized':
        return styles.finalizedBadge;
      case 'pending':
      default:
        return styles.pendingBadge;
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* Header/Navigation */}
      <Navigation title="My Internships" />      <div className={styles.contentWrapper}>
        {/* Tabs Navigation */}
        <div className={styles.tabsContainer}>
          <button 
            className={`${styles.tabButton} ${activeTab === 'applications' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('applications')}
          >
            My Applications
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'current' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('current')}
          >
            Current Internships
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'past' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('past')}
          >
            Past Internships
          </button>
        </div>

        {/* Filter Sidebar - Only show for tabs that need filtering */}
        {(activeTab === 'applications' || activeTab === 'past') && (
          <FilterSidebar
            filters={getFormattedFilters()}
            onFilterChange={handleFilterChange}
          />
        )}

        {/* Main Content */}
        <main className={styles.mainContent}>
          {/* Search Bar */}
          <div className={styles.toolbarContainer}>
            <SearchBar 
              searchTerm={searchTerm} 
              setSearchTerm={setSearchTerm} 
              placeholder="Search by job title or company..."
            />
          </div>

          {/* Internship Listings */}
          <div className={styles.internshipListings}>
            <div className={styles.listingHeader}>
              <h2 className={styles.listingTitle}>
                {activeTab === 'applications' && 'My Applications'}
                {activeTab === 'current' && 'Current Internships'}
                {activeTab === 'past' && 'Past Internships'}
              </h2>
              <span className={styles.internshipCount}>{filteredInternships.length}</span>
            </div>

            {filteredInternships.length > 0 ? (
              <div className={styles.cardsList}>
                {filteredInternships.map((internship) => (
                  <div key={internship.id} className={styles.cardWrapper}>
                    <InternshipCard
                      internship={internship}
                      isStarred={false} // We don't use starring in this view
                      onToggleStar={() => {}} // Empty function as we don't need starring
                      onViewDetails={handleViewDetails}
                    />
                    
                    {/* Status badge for applications */}
                    {activeTab === 'applications' && (
                      <div className={`${styles.statusBadge} ${getStatusBadgeClass(internship.applicationStatus)}`}>
                        {internship.applicationStatus.charAt(0).toUpperCase() + internship.applicationStatus.slice(1)}
                      </div>
                    )}
                    
                    {/* Evaluation button for past internships */}
                    {activeTab === 'past' && (
                      <div className={styles.evaluationContainer}>
                        {internship.evaluation ? (
                          <div className={styles.evaluationSummary}>
                            <div className={styles.ratingStars}>
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span key={star} className={star <= internship.evaluation!.rating ? styles.filledStar : styles.emptyStar}>
                                  ★
                                </span>
                              ))}
                            </div>
                            <button 
                              className={styles.editEvaluationButton}
                              onClick={() => handleEvaluate(internship)}
                            >
                              Edit Evaluation
                            </button>
                          </div>
                        ) : (
                          <button 
                            className={styles.evaluateButton}
                            onClick={() => handleEvaluate(internship)}
                          >
                            Add Evaluation
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.noResults}>
                <div className={styles.noResultsIcon}>🔍</div>
                <h3>No internships found</h3>
                <p>
                  {activeTab === 'applications' && 'You haven\'t applied to any internships yet.'}
                  {activeTab === 'current' && 'You don\'t have any active internships.'}
                  {activeTab === 'past' && 'You don\'t have any past internships.'}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>      {/* Details Modal */}
      {selectedInternship && !showEvaluationModal && (
        <InternshipDetailsModal
          internship={selectedInternship}
          onClose={handleCloseModal}
          onApply={async (application) => {
            console.log(`Viewing details for ${selectedInternship.title} at ${selectedInternship.company}`);
            return Promise.resolve();
          }}
        />
      )}

      {/* Evaluation Modal */}
      {showEvaluationModal && selectedInternship && (
        <div className={styles.modalBackdrop} onClick={() => setShowEvaluationModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={() => setShowEvaluationModal(false)}>×</button>
            
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Evaluate Your Internship Experience</h2>
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
            </div>
            
            <div className={styles.evaluationForm}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Rating</label>
                <div className={styles.starRating}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={star <= evaluation.rating ? styles.starActive : styles.star}
                      onClick={() => setEvaluation({...evaluation, rating: star})}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="evaluation-comment">Comments</label>
                <textarea
                  id="evaluation-comment"
                  className={styles.commentTextarea}
                  placeholder="Share your experience with this internship..."
                  value={evaluation.comment}
                  onChange={(e) => setEvaluation({...evaluation, comment: e.target.value})}
                  rows={5}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.recommendationLabel}>
                  <input
                    type="checkbox"
                    checked={evaluation.recommended}
                    onChange={(e) => setEvaluation({...evaluation, recommended: e.target.checked})}
                  />
                  I recommend this internship to other students
                </label>
              </div>
            </div>
            
            <div className={styles.modalActions}>
              {selectedInternship.evaluation && (
                <button 
                  className={styles.deleteButton}
                  onClick={handleDeleteEvaluation}
                >
                  Delete Evaluation
                </button>
              )}
              <button 
                className={styles.submitButton}
                onClick={handleSubmitEvaluation}
                disabled={evaluation.rating === 0 || evaluation.comment.trim() === ''}
              >
                Submit Evaluation
              </button>
            </div>          </div>
        </div>
      )}
      
      {/* Global notification system */}
      {notification && (
        <NotificationSystem
          message={notification.message}
          type={notification.type}
          visible={visible}
          onClose={hideNotification}
        />
      )}
    </div>
  );
};

export default MyInternshipsPage;