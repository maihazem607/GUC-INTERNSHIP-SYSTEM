"use client";
import React, { useState, useEffect } from 'react';
import Navigation from "../../src/components/global/Navigation";
import SearchBar from "../../src/components/global/SearchBar";
import FilterSidebar from "../../src/components/global/FilterSidebar";
import MyInternshipCard from "../../src/components/MyInternships/MyInternshipCard";
import EvaluationModal from "../../src/components/MyInternships/EvaluationModal";
import ReportModal from "../../src/components/MyInternships/ReportModal";
import DashboardTab from "../../src/components/global/DashboardTab";
import { Internship, FilterOptions } from "../../src/components/internships/types";
import NotificationSystem, { useNotification } from "../../src/components/global/NotificationSystem";
import styles from "./page.module.css";

// Extended Internship type to include application status and evaluation
interface MyInternship extends Internship {
  applicationStatus: 'none' | 'pending' | 'finalized' | 'accepted' | 'rejected';
  applicationDate: string;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
  evaluation?: {
    rating: number;
    comment: string;
    recommended: boolean;
  } | null;
  report?: {
    title: string;
    introduction: string;
    body: string;
    coursesApplied?: string[];
    finalized?: boolean;
  } | null;
  major?: string;
}

// Mock function to get courses based on major
const getMajorCourses = (major: string) => {
  const coursesByMajor: Record<string, {id: string, name: string}[]> = {
    'Computer Science': [
      { id: 'cs101', name: 'Introduction to Computer Science' },
      { id: 'cs202', name: 'Data Structures and Algorithms' },
      { id: 'cs303', name: 'Database Systems' },
      { id: 'cs404', name: 'Computer Networks' },
      { id: 'cs505', name: 'Software Engineering' },
      { id: 'cs606', name: 'Artificial Intelligence' },
      { id: 'cs707', name: 'Machine Learning' }
    ],
    'Engineering': [
      { id: 'eng101', name: 'Engineering Principles' },
      { id: 'eng202', name: 'Mechanics' },
      { id: 'eng303', name: 'Circuit Analysis' },
      { id: 'eng404', name: 'Thermodynamics' },
      { id: 'eng505', name: 'Control Systems' }
    ],
    'Business': [
      { id: 'bus101', name: 'Principles of Management' },
      { id: 'bus202', name: 'Marketing' },
      { id: 'bus303', name: 'Finance' },
      { id: 'bus404', name: 'Business Ethics' },
      { id: 'bus505', name: 'Strategic Management' }
    ]
  };
  
  return coursesByMajor[major] || coursesByMajor['Computer Science'];
};

const MyInternshipsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'applications' | 'internships'>('applications');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({
    status: 'All',
    internStatus: 'All',
    date: 'All',
  });
  const [myInternships, setMyInternships] = useState<MyInternship[]>([]);
  const [filteredInternships, setFilteredInternships] = useState<MyInternship[]>([]);
  const [selectedInternship, setSelectedInternship] = useState<MyInternship | null>(null);
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [evaluation, setEvaluation] = useState({
    rating: 0,
    comment: '',
    recommended: false
  });  const [isSubmittingEval, setIsSubmittingEval] = useState(false);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);  const [report, setReport] = useState({
    title: '',
    introduction: '',
    body: '',
    coursesApplied: [] as string[],
    finalized: false
  });
  
  // Mock courses based on major (in a real app, this would come from an API)
  const [availableCourses, setAvailableCourses] = useState<{id: string, name: string}[]>([]);
  const [activeReportTab, setActiveReportTab] = useState<'edit' | 'preview' | 'courses'>('edit');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const { notification, visible, showNotification, hideNotification } = useNotification();
  
  // Filter options
  const statusOptions = ['All', 'Pending', 'Finalized', 'Accepted', 'Rejected'];
  const internStatusOptions = ['All', 'Current Intern', 'Internship Complete'];
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
    } else if (activeTab === 'internships') {
      return [
        {
          title: "Internship Status",
          options: internStatusOptions,
          type: "internStatus",
          value: activeFilters.internStatus || 'All'
        },
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
        applicationStatus: 'rejected',
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
        description: 'Develop frontend components for Google Cloud Platform.',        
        applicationStatus: 'finalized',
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
        applicationStatus: 'pending',
        applicationDate: '10 May 2023',
        skills: ['Java', 'Spring Boot', 'Azure']
      },
      {        id: 4,
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
        applicationStatus: 'finalized',
        applicationDate: '15 May 2023',
        startDate: '1 August 2023',
        endDate: '1 December 2023',
        isActive: false,
        major: 'Computer Science',
        skills: ['Python', 'SQL', 'Data Visualization'],
        report: {
          title: 'Data Analysis Internship Final Report',
          introduction: 'During my internship at Spotify, I worked on user data analysis to improve music recommendations and personalization features.',
          body: 'The internship provided valuable experience in data visualization and analysis. I worked with large datasets and created insightful dashboards.\n\nDuring my four months at Spotify, I collaborated with the data science team to analyze user listening patterns and helped implement algorithms that improved song recommendations by 15%. I used Python, SQL, and various data visualization tools to create detailed reports and interactive dashboards that helped stakeholders understand user engagement metrics.\n\nI also had the opportunity to work on an A/B testing project that measured the impact of UI changes on user retention, which resulted in a 7% increase in daily active users for the test group.',
          coursesApplied: ['cs303', 'cs707'],
          finalized: true
        }
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
      {        id: 6,
        company: 'Tesla',
        title: 'Engineering Intern',
        duration: '3 months',
        date: '15 December 2022',
        location: 'Austin, TX',
        industry: 'Automotive',
        isPaid: true,
        salary: '$29/hr',
        logo: '/logos/tesla.png',
        description: 'Work on electric vehicle battery technology.',
        applicationStatus: 'accepted',
        applicationDate: '15 November 2022',
        startDate: '15 December 2022',
        endDate: '15 March 2023',
        isActive: false,
        major: 'Engineering',
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
        isActive: true,
        skills: ['Java', 'Spring', 'Docker'],
        report: null
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
      // Show ALL applications including accepted ones
      results = myInternships;
      
      // Apply status filter if not "All"
      if (activeFilters.status && activeFilters.status !== 'All') {
        results = results.filter(internship => 
          internship.applicationStatus === activeFilters.status?.toLowerCase()
        );
      }
    } else if (activeTab === 'internships') {
      // Show only accepted internships (both current and past)
      results = myInternships.filter(internship => 
        internship.applicationStatus === 'accepted'
      );
      
      // Apply internship status filter
      if (activeFilters.internStatus && activeFilters.internStatus !== 'All') {
        if (activeFilters.internStatus === 'Current Intern') {
          results = results.filter(internship => internship.isActive === true);
        } else if (activeFilters.internStatus === 'Internship Complete') {
          results = results.filter(internship => internship.isActive === false);
        }
      }
      
      // Apply date filter if not "All"
      if (activeFilters.date && activeFilters.date !== 'All') {
        const currentYear = new Date().getFullYear();
        
        if (activeFilters.date === 'Recent') {
          // Filter for internships in the last 3 months
          const threeMonthsAgo = new Date();
          threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
          
          results = results.filter(internship => {
            if (!internship.startDate) return false;
            const internshipDate = new Date(internship.startDate);
            return internshipDate >= threeMonthsAgo;
          });        
        } else {
          // Filter by specific year
          const year = activeFilters.date;
          results = results.filter(internship => {
            // Check if year is in startDate
            return (internship.startDate && internship.startDate.includes(year));
          });
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
    // Only show details modal when not showing other modals
    if (!showEvaluationModal && !showReportModal) {
      const myInternship = myInternships.find(item => item.id === internship.id) as MyInternship;
      setSelectedInternship(myInternship);
    }
  };
  // Handle closing the details modal
  const handleCloseModal = () => {
    setSelectedInternship(null);
    setShowEvaluationModal(false);
    setShowReportModal(false);
  };

  // Handle opening evaluation modal
  const handleEvaluate = (internship: MyInternship) => {
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
    setSelectedInternship(internship);
  };
  // Handle opening report modal
  const handleReport = (internship: MyInternship) => {
    // Pre-fill existing report if any
    if (internship.report) {
      setReport({
        title: internship.report.title || '',
        introduction: internship.report.introduction || '',
        body: internship.report.body || '',
        coursesApplied: internship.report.coursesApplied || [],
        finalized: internship.report.finalized || false
      });
    } else {
      setReport({
        title: '',
        introduction: '',
        body: '',
        coursesApplied: [],
        finalized: false
      });
    }
    
    // Load courses based on student's major
    const majorCourses = getMajorCourses(internship.major || 'Computer Science');
    setAvailableCourses(majorCourses);
    
    setActiveReportTab('edit');
    setShowReportModal(true);
    setSelectedInternship(internship);
  };// Handle submitting an evaluation
  const handleSubmitEvaluation = () => {
    if (selectedInternship) {
      setIsSubmittingEval(true);
      
      // Simulate API call with a slight delay
      setTimeout(() => {
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
        setFilteredInternships(prev => 
          prev.map(item => 
            item.id === selectedInternship.id 
              ? { ...item, evaluation: evaluation }
              : item
          )
        );
        
        setIsSubmittingEval(false);
        setShowEvaluationModal(false);
        
        // Show success notification
        showNotification({
          message: `Evaluation for ${selectedInternship.title} at ${selectedInternship.company} submitted successfully!`,
          type: 'success'
        });
      }, 800); // Simulate network delay
    }
  };  // Handle submitting a report
  const handleSubmitReport = () => {
    if (selectedInternship) {
      // Add confirmation if report is finalized
      if (report.finalized && !window.confirm('This report is marked as finalized. Submitting it will make it official and it may be reviewed by faculty. Continue?')) {
        return;
      }
      
      setIsSubmittingReport(true);
      
      // Simulate API call with a slight delay
      setTimeout(() => {
        // Update the internship with the new report
        const updatedInternships = myInternships.map(internship => {
          if (internship.id === selectedInternship.id) {
            return {
              ...internship,
              report: report
            };
          }
          return internship;
        });
        
        setMyInternships(updatedInternships);
        setFilteredInternships(prev => 
          prev.map(item => 
            item.id === selectedInternship.id 
              ? { ...item, report: report }
              : item
          )
        );
        
        setIsSubmittingReport(false);
        setShowReportModal(false);
        
        // Show success notification with appropriate message
        showNotification({
          message: report.finalized 
            ? `Finalized report for ${selectedInternship.title} at ${selectedInternship.company} submitted successfully!` 
            : `Draft report for ${selectedInternship.title} at ${selectedInternship.company} saved successfully!`,
          type: 'success'
        });
      }, 800); // Simulate network delay
    }
  };// Handle deleting an evaluation
  const handleDeleteEvaluation = () => {
    if (selectedInternship) {
      // Show confirmation dialog
      const isConfirmed = window.confirm(
        `Are you sure you want to delete your evaluation for "${selectedInternship.title}" at ${selectedInternship.company}? This action cannot be undone.`
      );
      
      if (isConfirmed) {
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
        setFilteredInternships(prev => 
          prev.map(item => 
            item.id === selectedInternship.id 
              ? { ...item, evaluation: null }
              : item
          )
        );
        
        setShowEvaluationModal(false);
        
        // Show notification
        showNotification({
          message: `Evaluation for ${selectedInternship.title} at ${selectedInternship.company} has been deleted.`,
          type: 'info'
        });
      }
    }
  };  // Handle deleting a report
  const handleDeleteReport = () => {
    if (selectedInternship) {
      // Show confirmation dialog
      const isConfirmed = window.confirm(
        `Are you sure you want to delete your report for "${selectedInternship.title}" at ${selectedInternship.company}? This action cannot be undone.`
      );
      
      if (isConfirmed) {
        // Remove the report
        const updatedInternships = myInternships.map(internship => {
          if (internship.id === selectedInternship.id) {
            return {
              ...internship,
              report: null
            };
          }
          return internship;
        });
        
        setMyInternships(updatedInternships);
        setFilteredInternships(prev => 
          prev.map(item => 
            item.id === selectedInternship.id 
              ? { ...item, report: null }
              : item
          )
        );
        
        setShowReportModal(false);
        
        // Show notification
        showNotification({
          message: `Report for ${selectedInternship.title} at ${selectedInternship.company} has been deleted.`,
          type: 'info'
        });
      }
    }
  };
  
  // Handle toggling courses in the report
  const handleToggleCourse = (courseId: string) => {
    setReport(prev => {
      const isCourseSelected = prev.coursesApplied.includes(courseId);
      
      if (isCourseSelected) {
        // Remove the course
        return {
          ...prev,
          coursesApplied: prev.coursesApplied.filter(id => id !== courseId)
        };
      } else {
        // Add the course
        return {
          ...prev,
          coursesApplied: [...prev.coursesApplied, courseId]
        };
      }
    });
  };
    // Get course name by ID
  const getCourseNameById = (courseId: string): string => {
    const course = availableCourses.find(c => c.id === courseId);
    return course ? course.name : courseId;
  };
  // Handle downloading report as PDF
  const handleDownloadPDF = async () => {
    if (selectedInternship) {
      setIsGeneratingPDF(true);
      
      // Check if report is finalized before generating PDF
      if (!report.finalized) {
        const confirmDownload = window.confirm(
          'This report is not finalized yet. You can still download a draft version, but it will be marked as "DRAFT". Continue?'
        );
        
        if (!confirmDownload) {
          setIsGeneratingPDF(false);
          return;
        }
      }
      
      try {
        // Import the PDF utility dynamically to avoid SSR issues
        const pdfUtils = await import('../../src/utils/pdfUtils');
        const generateReportPDF = pdfUtils.default;
        
        // Get course names for the report
        const courseNames = report.coursesApplied.map(id => getCourseNameById(id));
        
        // Generate the PDF
        const fileName = await generateReportPDF({
          title: report.title,
          company: selectedInternship.company,
          position: selectedInternship.title,
          duration: selectedInternship.duration,
          introduction: report.introduction,
          body: report.body,
          coursesApplied: report.coursesApplied,
          finalized: report.finalized,
          courseNames: courseNames
        });
        
        // Show success notification
        showNotification({
          message: `Report "${fileName}" has been downloaded to your device.`,
          type: 'success'
        });
      } catch (error) {
        console.error('Error generating PDF:', error);
        
        // Show error notification
        showNotification({
          message: 'Failed to generate PDF. Please try again.',
          type: 'error'
        });
      } finally {
        setIsGeneratingPDF(false);
      }
    }
  };

  // Handle filter changes
  const handleFilterChange = (filterType: string, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };
  return (
    <div className={styles.pageContainer}>
      {/* Header/Navigation */}
      <Navigation title="My Internships" />
      
      <div className={styles.contentWrapper}>
        {/* Filter Sidebar - Show for both tabs */}
        <FilterSidebar
          filters={getFormattedFilters()}
          onFilterChange={handleFilterChange}
        />

        {/* Main Content */}
        <main className={styles.mainContent}>
          {/* Tab Navigation */}
          <DashboardTab
            tabs={[
              { 
                id: 'applications', 
                label: 'My Applications',
                count: myInternships.filter(app => app.applicationStatus !== 'accepted').length
              },
              { 
                id: 'internships', 
                label: 'My Internships',
                count: myInternships.filter(app => app.applicationStatus === 'accepted').length
              }
            ]}
            activeTab={activeTab}
            onTabChange={(tabId) => setActiveTab(tabId as 'applications' | 'internships')}
            className={styles.dashboardTabs}
          />
          {/* Search Bar */}
          <SearchBar 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
            placeholder="Search by job title or company..."
          />          <div className={styles.internshipListings}>
            <div className={styles.listingHeader}>
              <h2 className={styles.listingTitle}>
                {activeTab === 'applications' ? 'My Applications' : 'My Internships'}
              </h2>
              <span className={styles.internshipCount}>
                {filteredInternships.length} Internship{filteredInternships.length !== 1 ? 's' : ''}
                {activeTab === 'internships' && (
                  <span className={styles.statusIndicator}>
                    <span className={styles.statusDot}></span>
                    {myInternships.filter(app => app.applicationStatus === 'accepted' && app.isActive).length} Active
                  </span>
                )}
              </span>
            </div>            
            {filteredInternships.length > 0 ? (
              <div className={styles.cardsList}>
                {filteredInternships.map((internship) => (
                  <div key={internship.id} className={styles.cardWrapper}>
                    <MyInternshipCard
                      internship={internship}
                      onViewDetails={handleViewDetails}
                      onEvaluate={handleEvaluate}
                      onReport={handleReport}
                      activeTab={activeTab}
                    />
                  </div>
                ))}
              </div>
            ) : (              <div className={styles.noResults}>
                <img 
                  src="assets/images/icons/search.png" 
                  alt="Search Icon" 
                  className={styles.searchIcon} 
                /> 
                <h3>No internships found</h3>
                <p>
                  {activeTab === 'applications' ? 
                    'You haven\'t applied to any internships yet. Browse the internship listings to find opportunities.' : 
                    'You don\'t have any active internships yet. Check your applications status.'
                  }
                </p>
              </div>
            )}
          </div>
        </main>
      </div>      {/* Evaluation Modal */}
      {showEvaluationModal && selectedInternship && (
        <EvaluationModal
          evaluation={evaluation}
          setEvaluation={setEvaluation}
          selectedInternship={selectedInternship}
          onClose={() => setShowEvaluationModal(false)}
          onSubmit={handleSubmitEvaluation}
          onDelete={handleDeleteEvaluation}
          isSubmitting={isSubmittingEval}
        />
      )}{/* Report Modal */}
      {showReportModal && selectedInternship && (
        <div className={styles.modalBackdrop} onClick={() => setShowReportModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()} style={{ width: '95%', maxWidth: '800px' }}>
            <button className={styles.closeButton} onClick={() => setShowReportModal(false)}>×</button>
            
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Internship Report</h2>
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
            
            {/* Report tabs */}
            <div className={styles.reportTabs}>
              <button 
                className={`${styles.reportTab} ${activeReportTab === 'edit' ? styles.activeReportTab : ''}`}
                onClick={() => setActiveReportTab('edit')}
              >
                Edit Report
              </button>
              <button 
                className={`${styles.reportTab} ${activeReportTab === 'courses' ? styles.activeReportTab : ''}`}
                onClick={() => setActiveReportTab('courses')}
              >
                Select Courses
              </button>
              <button 
                className={`${styles.reportTab} ${activeReportTab === 'preview' ? styles.activeReportTab : ''}`}
                onClick={() => setActiveReportTab('preview')}
              >
                Preview & Finalize
              </button>
            </div>
            
            {/* Edit Report Tab */}
            {activeReportTab === 'edit' && (
              <div className={styles.reportForm}>
                
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
            )}
            
            {/* Courses Tab */}
            {activeReportTab === 'courses' && (
              <div className={styles.reportForm}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Select courses that helped you during this internship
                  </label>
                  <p style={{ marginBottom: '20px', color: '#666' }}>
                    Select any courses from your major that provided knowledge or skills applicable to this internship.
                  </p>
                  
                  <div className={styles.coursesContainer}>
                    {availableCourses.map(course => (
                      <div key={course.id} className={styles.courseItem}>
                        <input
                          type="checkbox"
                          id={`course-${course.id}`}
                          className={styles.courseCheckbox}
                          checked={report.coursesApplied.includes(course.id)}
                          onChange={() => handleToggleCourse(course.id)}
                          disabled={report.finalized}
                        />
                        <label 
                          htmlFor={`course-${course.id}`} 
                          className={styles.courseLabel}
                        >
                          {course.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Preview Tab */}
            {activeReportTab === 'preview' && (
              <div className={styles.reportForm}>                <div className={styles.reportPreviewContainer}>
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
                      <strong>Company:</strong> {selectedInternship.company}
                    </div>
                    <div>
                      <strong>Position:</strong> {selectedInternship.title}
                    </div>
                    <div>
                      <strong>Duration:</strong> {selectedInternship.duration}
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
                
                <div style={{ display: 'flex', gap: '20px', marginTop: '20px', justifyContent: 'center' }}>                  <div style={{ display: 'flex', flexDirection: 'column', width: '200px' }}>
                    <button 
                      className={styles.downloadButton}
                      onClick={handleDownloadPDF}
                      disabled={isGeneratingPDF}
                    >
                      {isGeneratingPDF ? 'Generating...' : (
                        <>
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
            )}
            
            {/* Action Buttons */}
            <div className={styles.modalActions}>
              <div>
                {selectedInternship.report && (
                  <button 
                    className={styles.deleteButton}
                    onClick={handleDeleteReport}
                  >
                    Reset
                  </button>
                )}
              </div>
              
              <button 
                className={styles.submitButton}
                onClick={handleSubmitReport}
                disabled={isSubmittingReport || report.title.trim() === '' || report.body.trim() === ''}
              >
                {isSubmittingReport ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    {selectedInternship.report ? 'Update' : 'Submit'}
                  </>
                )}
              </button>
            </div>
          </div>
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
