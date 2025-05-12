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
    finalized?: boolean;
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
  const [showReportModal, setShowReportModal] = useState(false);  // Define the evaluation type to match the interface in EvaluationForm/EvaluationModal
  interface EvaluationType {
    rating: number;
    comment: string;
    recommended: boolean;
    finalized?: boolean;
  }
  
  const [evaluation, setEvaluation] = useState<EvaluationType>({
    rating: 0,
    comment: '',
    recommended: false,
    finalized: false
  });  
  const [isSubmittingEval, setIsSubmittingEval] = useState(false);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);  
  const [report, setReport] = useState({
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
        evaluation: null,
        major: 'Computer Science'
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
        endDate: '15 June 2025', // End date in the future
        isActive: true, // Currently active internship
        skills: ['Java', 'Spring', 'Docker'],
        report: null,
        major: 'Computer Science'
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
        id: 8,
        company: 'Apple',
        title: 'iOS Development Intern',
        duration: '6 months',
        date: '10 September 2024',
        location: 'Cupertino, CA',
        industry: 'Technology',
        isPaid: true,
        salary: '$30/hr',
        logo: '/logos/apple.png',
        description: 'Develop mobile applications for iOS devices.',
        applicationStatus: 'accepted',
        applicationDate: '15 July 2024',
        startDate: '10 September 2024',
        endDate: '10 March 2025',
        isActive: false,
        skills: ['Swift', 'UIKit', 'XCode'],
        major: 'Computer Science',        evaluation: {
          rating: 5,
          comment: 'My internship at Apple was an incredible learning experience. The team was very supportive and I got to work on meaningful projects that actually shipped to customers. The work-life balance was great and I received excellent mentorship.',
          recommended: true,
          finalized: true // This evaluation is finalized and read-only
        },
        report: {
          title: 'iOS Development at Apple: Insights and Learning',
          introduction: 'During my six-month internship at Apple, I worked with the iOS development team on several key features for the upcoming iOS release.',
          body: 'My internship at Apple provided invaluable experience in professional software development practices and cutting-edge mobile technologies.\n\nI was primarily responsible for implementing new UI components and optimizing existing ones for better performance. I collaborated closely with designers and senior developers to ensure that all features met Apple\'s high standards for user experience.\n\nOne of my major contributions was helping to develop a more accessible version of the core navigation system, which improved usability for visually impaired users. This project taught me a lot about the importance of inclusive design in technology.\n\nI also participated in code reviews and testing processes, which helped me understand the importance of quality assurance in commercial software development. The attention to detail required at Apple has significantly improved my own programming practices.',
          coursesApplied: ['cs101', 'cs202', 'cs505'],
          finalized: true
        }
      },
      {
        id: 9,
        company: 'Facebook',
        title: 'Data Science Intern',
        duration: '4 months',
        date: '5 January 2025',
        location: 'Menlo Park, CA',
        industry: 'Technology',
        isPaid: true,
        salary: '$28/hr',
        logo: '/logos/facebook.png',
        description: 'Work on data analysis for user engagement features.',
        applicationStatus: 'accepted',
        applicationDate: '10 November 2024',
        startDate: '5 January 2025',
        endDate: '5 May 2025',
        isActive: false,
        skills: ['Python', 'SQL', 'Machine Learning'],
        major: 'Computer Science',
        evaluation: {
          rating: 3,
          comment: 'The internship had good technical exposure, but work-life balance was challenging. Sometimes the expectations were unclear, and the team was often under tight deadlines which created a stressful environment.',
          recommended: false
        },
        report: {
          title: 'Data Science Internship at Facebook',
          introduction: 'This report outlines my experience as a Data Science Intern at Facebook, focusing on user engagement analysis.',
          body: 'During my internship at Facebook, I worked with massive datasets to extract meaningful insights about user behavior and engagement patterns.\n\nI learned to use Facebook\'s internal data tools which allowed me to process and analyze terabytes of information efficiently. My primary project involved developing models to predict user engagement with new features before they were fully launched.\n\nThe technical skills I gained were substantial, particularly in terms of scaling data processing pipelines and implementing machine learning algorithms in production environments.\n\nI also gained valuable experience in presenting technical findings to non-technical stakeholders, which improved my communication skills significantly.',
          coursesApplied: ['cs303', 'cs707'],
          finalized: false
        }
      },
      {
        id: 10,
        company: 'Salesforce',
        title: 'Software Engineering Intern',
        duration: '3 months',
        date: '1 February 2025',
        location: 'San Francisco, CA',
        industry: 'Technology',
        isPaid: true,
        salary: '$27/hr',
        logo: '/logos/salesforce.png',
        description: 'Develop features for Salesforce CRM platform.',
        applicationStatus: 'accepted',
        applicationDate: '5 December 2024',
        startDate: '1 February 2025',
        endDate: '1 May 2025',
        isActive: false,
        skills: ['JavaScript', 'React', 'Node.js'],
        major: 'Computer Science',
        evaluation: null,
        report: {
          title: '',
          introduction: 'During my internship at Salesforce, I had the opportunity to work on their customer relationship management platform.',
          body: 'My time at Salesforce was focused on developing new features for their enterprise CRM solution. I mainly worked with JavaScript, React, and their proprietary Lightning component framework.',
          coursesApplied: [],
          finalized: false
        }
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
      setEvaluation({
        rating: internship.evaluation.rating,
        comment: internship.evaluation.comment,
        recommended: internship.evaluation.recommended,
        finalized: internship.evaluation.finalized || false
      });
    } else {
      setEvaluation({
        rating: 0,
        comment: '',
        recommended: false,
        finalized: false
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
  };  // Handle submitting an evaluation
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
  };
    // Handle finalizing an evaluation (makes it read-only)
  const handleFinalizeEvaluation = () => {
    if (selectedInternship) {
      // Set evaluation as finalized
      setEvaluation(prev => ({...prev, finalized: true}));
      
      // Submit the evaluation
      handleSubmitEvaluation();
      
      showNotification({
        message: `Your evaluation for ${selectedInternship.title} at ${selectedInternship.company} has been finalized.`,
        type: 'success'
      });
    }
  };
    // Handle finalizing a report (makes it read-only)
  const handleFinalizeReport = () => {
    if (selectedInternship) {
      // Set report as finalized
      setReport(prev => ({...prev, finalized: true}));
      
      // We'll call handleSubmitReport manually after setting finalized to true
      // This ensures the finalized flag is saved properly
      if (selectedInternship) {
        setIsSubmittingReport(true);
        
        // Create a finalized copy of the report
        const finalizedReport = {
          ...report,
          finalized: true
        };
        
        // Simulate API call with a slight delay
        setTimeout(() => {
          // Update the internship with the new report
          const updatedInternships = myInternships.map(internship => {
            if (internship.id === selectedInternship.id) {
              return {
                ...internship,
                report: finalizedReport
              };
            }
            return internship;
          });
          
          setMyInternships(updatedInternships);
          setFilteredInternships(prev => 
            prev.map(item => 
              item.id === selectedInternship.id 
                ? { ...item, report: finalizedReport }
                : item
            )
          );
          
          setIsSubmittingReport(false);
          setShowReportModal(false);
          
          // Show success notification
          showNotification({
            message: `Your report for ${selectedInternship.title} at ${selectedInternship.company} has been finalized and submitted.`,
            type: 'success'
          });
        }, 800); // Simulate network delay
      }
    }
  };// Handle submitting a report
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
          {/* Tab Navigation */}          <DashboardTab
            tabs={[
              { 
                id: 'applications', 
                label: 'My Applications',
                count: myInternships.filter(app => ['pending', 'rejected', 'finalized'].includes(app.applicationStatus)).length
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
      )}      {/* Report Modal */}
      {showReportModal && selectedInternship && (
        <ReportModal
          report={report}
          setReport={setReport}
          selectedInternship={selectedInternship}
          onClose={() => setShowReportModal(false)}
          onSubmit={handleSubmitReport}
          onDelete={handleDeleteReport}
          isSubmitting={isSubmittingReport}
          activeTab={activeReportTab}
          setActiveTab={setActiveReportTab}
          availableCourses={availableCourses}
          onToggleCourse={handleToggleCourse}
          getCourseNameById={getCourseNameById}
          onFinalizeReport={handleFinalizeReport}
          isGeneratingPDF={isGeneratingPDF}
          onDownloadPDF={handleDownloadPDF}
        />
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
