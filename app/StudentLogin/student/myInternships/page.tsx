"use client";
import StudentNavigationMenu from '../Navigation/StudentNavigationMenu';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import NavigationMenu, { MenuItem } from "@/components/global/NavigationMenu";
import { Clipboard, ClipboardCheck, FileText, Search } from 'lucide-react';
import SearchBar from "@/components/global/SearchBar";
import FilterSidebar from "@/components/global/FilterSidebar";
import MyInternshipCard from "@/components/MyInternships/MyInternshipCard";
import EvaluationModal from "@/components/MyInternships/EvaluationModal";
import ReportModal from "@/components/MyInternships/ReportModal";
import ReportsList from "@/components/MyInternships/ReportsList";
import ReportResultsModal from "@/components/MyInternships/ReportResultsModal";
import { Internship, FilterOptions } from "@/components/internships/types";
import { useNotification } from "@/components/global/NotificationSystemAdapter";
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
    status?: 'pending' | 'accepted' | 'flagged' | 'rejected';
    scadComments?: string;
    appealMessage?: string;
    appealDate?: string;
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
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as 'applications' | 'internships' | 'reports') || 'applications';
  const [activeTab, setActiveTab] = useState<'applications' | 'internships' | 'reports'>(initialTab);
  // Update active tab when URL parameters change

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['applications', 'internships', 'reports'].includes(tabParam)) {
      setActiveTab(tabParam as 'applications' | 'internships' | 'reports');
    }
  }, [searchParams]);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({
    status: 'All',
    internStatus: 'All',
    reportStatus: 'All',
    date: 'All',
  });
  const [myInternships, setMyInternships] = useState<MyInternship[]>([]);
  const [filteredInternships, setFilteredInternships] = useState<MyInternship[]>([]);
  const [selectedInternship, setSelectedInternship] = useState<MyInternship | null>(null);
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showReportResultsModal, setShowReportResultsModal] = useState(false);
  const [isSubmittingAppeal, setIsSubmittingAppeal] = useState(false);// Define the evaluation type to match the interface in EvaluationForm/EvaluationModal
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
  const [highlightedReportId, setHighlightedReportId] = useState<number | undefined>(undefined);
  const [hasShownReportNotification, setHasShownReportNotification] = useState(false);
  const { notification, visible, showNotification, hideNotification, addNotification } = useNotification();
  // Filter options  
  const statusOptions = ['All', 'Pending', 'Finalized', 'Accepted', 'Rejected'];
  const internStatusOptions = ['All', 'Current Intern', 'Internship Complete'];
  const reportStatusOptions = ['All', 'Pending', 'Accepted', 'Flagged', 'Rejected'];
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
    } else if (activeTab === 'reports') {
      return [
        {
          title: "Report Status",
          options: reportStatusOptions,
          type: "reportStatus",
          value: activeFilters.reportStatus || 'All'
        }
      ];
    }
    return [];
  };  // Mock data for internships
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
        evaluation: {
          rating: 4,
          comment: 'Great opportunity to work with talented designers on real products. The team was supportive and I learned a lot about user-centric design approaches.',
          recommended: true,
          finalized: true
        },
        report: {
          title: 'UI/UX Design Internship at Amazon',
          introduction: 'During my three-month internship at Amazon, I worked on designing user interfaces for AWS products and gained valuable experience in user research and prototyping.',
          body: 'My internship at Amazon was focused on improving the user experience of AWS console interfaces. I collaborated with product managers and engineers to identify pain points in the current UI and proposed design solutions to address them.\n\nI conducted user research sessions with existing customers to understand their needs better, and created wireframes and high-fidelity prototypes using Figma. My designs were implemented in the AWS Management Console, specifically improving the navigation experience for first-time users.\n\nI also participated in several design critique sessions where I received valuable feedback from senior designers that significantly improved my design thinking process.',
          coursesApplied: ['cs101', 'cs505'],
          finalized: true,
          status: 'accepted',
          scadComments: 'Excellent report that clearly demonstrates the application of software engineering principles and UI design concepts from your coursework.'
        },
        major: 'Computer Science'
      },      {
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
        applicationStatus: 'pending',
        applicationDate: '1 May 2023',
        major: 'Computer Science',
        skills: ['React', 'TypeScript', 'CSS'],        evaluation: null,
        report: null
      },      {
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
        applicationStatus: 'accepted',
        applicationDate: '10 May 2023',
        startDate: '15 July 2023',
        endDate: '15 October 2023',
        isActive: false,
        major: 'Computer Science',
        skills: ['Java', 'Spring Boot', 'Azure'],
        evaluation: {
          rating: 5,
          comment: 'My internship at Microsoft was outstanding. I worked on critical backend services for Azure and gained valuable experience in building scalable cloud systems. The team was extremely supportive and I had the opportunity to learn from experienced engineers.',
          recommended: true,
          finalized: true
        },        report: {
          title: 'Backend Development for Microsoft Azure',
          introduction: 'During my internship at Microsoft, I worked on developing and optimizing backend services for the Azure cloud platform using Java and Spring Boot.',
          body: 'My time at Microsoft was focused on developing microservices that power critical Azure functions. I implemented several REST APIs that handle resource provisioning and management within the Azure ecosystem.\n\nA major project I worked on was optimizing the database access layer to improve response times for high-traffic API endpoints. By implementing connection pooling and query optimizations, I helped reduce average response time by 35%.\n\nI also contributed to the internal monitoring tools that track service health and performance metrics. This involved implementing custom metrics collection and designing dashboards that help the team quickly identify and respond to potential issues.\n\nThe experience gave me practical insights into building enterprise-grade distributed systems and allowed me to apply database concepts from my coursework in a real-world setting.',
          coursesApplied: ['cs303', 'cs404'],
          finalized: true,
          status: 'pending',
          scadComments: 'The report provides good details about the technical work, but needs more specific examples of how database concepts from CS303 were applied. Please include more details about the database schema design, query optimization techniques, and how they relate to concepts covered in the course.'
        }
      },      {        id: 4,
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
        applicationStatus: 'pending',
        applicationDate: '15 May 2023',
        major: 'Computer Science',
        skills: ['Python', 'SQL', 'Data Visualization'],        report: null
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
      },      {
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
        major: 'Computer Science',
        evaluation: {
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
          finalized: true,
          status: 'accepted'
        }
      },      {
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
          finalized: true,
          status: 'flagged',
          scadComments: 'The report needs more specific details about how the learning outcomes align with the course objectives. Please provide more concrete examples of how you applied the database concepts from CS303 in your work. Also, the machine learning section needs more technical depth to satisfy the CS707 requirements.'
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
      },
      {
        id: 11,
        company: 'Twitter',
        title: 'Machine Learning Intern',
        duration: '4 months',
        date: '1 February 2025',
        location: 'San Francisco, CA',
        industry: 'Technology',
        isPaid: true,
        salary: '$29/hr',
        logo: '/logos/twitter.png',
        description: 'Develop ML algorithms for content recommendation.',
        applicationStatus: 'pending',
        applicationDate: '15 December 2024',
        skills: ['Python', 'TensorFlow', 'NLP']
      },
      {
        id: 12,
        company: 'Netflix',
        title: 'Recommendation Algorithm Intern',
        duration: '6 months',
        date: '15 March 2025',
        location: 'Los Gatos, CA',
        industry: 'Entertainment',
        isPaid: true,
        salary: '$32/hr',
        logo: '/logos/netflix.png',
        description: 'Improve content recommendation algorithms.',
        applicationStatus: 'finalized',
        applicationDate: '10 January 2025',
        skills: ['Python', 'Machine Learning', 'Recommendation Systems']
      },      {
        id: 13,
        company: 'Airbnb',
        title: 'UX Research Intern',
        duration: '3 months',
        date: '1 June 2025',
        location: 'San Francisco, CA',
        industry: 'Technology',
        isPaid: true,
        salary: '$28/hr',
        logo: '/logos/airbnb.png',
        description: 'Conduct user research to improve product experience.',
        applicationStatus: 'rejected',
        applicationDate: '15 April 2025',
        major: 'Computer Science',
        skills: ['User Research', 'Prototyping', 'Data Analysis'],
        evaluation: null,
        report: null
      },      {
        id: 14,
        company: 'Dribbble',
        title: 'UI Design Intern',
        duration: '4 months',
        date: '15 January 2024',
        location: 'Remote',
        industry: 'Design',
        isPaid: true,
        salary: '$25/hr',
        logo: '/logos/dribbble.png',
        description: 'Create user interface designs for web and mobile applications.',
        applicationStatus: 'rejected',
        applicationDate: '20 November 2023',
        major: 'Computer Science',
        skills: ['UI Design', 'Figma', 'Visual Design'],        evaluation: null,
        report: null
      },
      {
        id: 15,
        company: 'IBM',
        title: 'Cybersecurity Intern',
        duration: '3 months',
        date: '1 March 2024',
        location: 'Armonk, NY',
        industry: 'Technology',
        isPaid: true,
        salary: '$27/hr',
        logo: '/logos/ibm.png',
        description: 'Work on security vulnerability assessment and mitigation.',
        applicationStatus: 'accepted',
        applicationDate: '15 January 2024',
        startDate: '1 March 2024',
        endDate: '1 June 2024',
        isActive: false,
        major: 'Computer Science',
        skills: ['Network Security', 'Cryptography', 'Vulnerability Assessment'],
        evaluation: {
          rating: 5,
          comment: 'This internship provided exceptional exposure to enterprise-level security practices. The team was knowledgeable and supportive, and I gained invaluable hands-on experience with security tools and methodologies.',
          recommended: true,
          finalized: true
        },
        report: {
          title: 'Cybersecurity Practices at IBM',
          introduction: 'During my three-month internship at IBM, I worked with the cybersecurity team to identify, assess, and mitigate security vulnerabilities in enterprise systems.',
          body: 'My internship at IBM gave me comprehensive exposure to enterprise cybersecurity practices. I was involved in conducting vulnerability assessments for client systems, analyzing potential security threats, and developing mitigation strategies.\n\nA significant project I worked on was developing an automated scanning tool that identifies common security misconfigurations in cloud deployments. This tool integrated with IBM\'s existing security monitoring systems and helped reduce the manual effort required for routine security checks.\n\nI also participated in red team exercises where we simulated cyber attacks to test the effectiveness of security measures. This gave me practical insights into how attackers think and operate, which is crucial for designing effective security systems.\n\nThe internship allowed me to apply network security concepts from my coursework, particularly in understanding how different security controls work together to protect enterprise systems.',
          coursesApplied: ['cs404', 'cs505'],
          finalized: true,
          status: 'rejected',
          scadComments: 'The report fails to adequately demonstrate application of Computer Networks (CS404) concepts. While security is mentioned, there is insufficient technical detail about network protocols, architecture, or how specific network security measures were implemented. Please revise with more technical content directly related to the course material.'
        }
      }
    ];
    
    setMyInternships(mockInternships);
    setFilteredInternships(mockInternships);
    
  }, []); 

  // Simulate a report status change (available for internal testing purposes)
  const simulateReportStatusChange = (reportId: number, newStatus: 'pending' | 'accepted' | 'flagged' | 'rejected') => {
    // Find the internship with the matching report
    const internshipIndex = myInternships.findIndex(i => i.id === reportId && i.report);
    
    if (internshipIndex === -1) return;
    
    const internship = myInternships[internshipIndex];
    
    if (!internship.report) return;

    // Update the internship report with new status
    const updatedInternship = {
      ...internship,
      report: {
        ...internship.report,
        status: newStatus
      }
    };
    
    // Update the internships list
    const updatedInternships = [...myInternships];
    updatedInternships[internshipIndex] = updatedInternship;
    
    setMyInternships(updatedInternships);
    setFilteredInternships(prev => 
      prev.map(item => 
        item.id === reportId ? updatedInternship : item
      )
    );
    
    // Highlight the row with the changed report
    setHighlightedReportId(reportId);
    setTimeout(() => {
      setHighlightedReportId(undefined);
    }, 3000); // Clear highlight after animation completes
    
    // Set the active tab to reports to show the change
    setActiveTab('reports');
    
    // Show notification based on the status change
    if (newStatus === 'pending') {
      showNotification({
        message: `Your report for ${internship.title} at ${internship.company} is now under review.`,
        type: 'info'
      });
      
      addNotification({
        title: "Report Status Changed",
        message: `Your report for "${internship.title}" at ${internship.company} is now being reviewed by SCAD.`,
        type: 'status-change'
      });
    } else if (newStatus === 'rejected') {
      showNotification({
        message: `Your report for ${internship.title} at ${internship.company} has been rejected. Please check the feedback.`,
        type: 'warning'
      });
      
      addNotification({
        title: "Report Rejected",
        message: `Your report for "${internship.title}" at ${internship.company} has been rejected. Please review SCAD comments and consider submitting an appeal.`,
        type: 'status-change'
      });
    } else if (newStatus === 'accepted') {
      showNotification({
        message: `Congratulations! Your report for ${internship.title} at ${internship.company} has been accepted.`,
        type: 'success'
      });
      
      addNotification({
        title: "Report Accepted",
        message: `Your report for "${internship.title}" at ${internship.company} has been approved by SCAD.`,
        type: 'status-change'
      });
    } else if (newStatus === 'flagged') {
      showNotification({
        message: `Your report for ${internship.title} at ${internship.company} has been flagged for revision.`,
        type: 'warning'
      });
      
      addNotification({
        title: "Report Flagged",
        message: `Your report for "${internship.title}" at ${internship.company} has been flagged and requires revision. Please check SCAD comments.`,
        type: 'status-change'
      });
    }
  };

  // Update active tab when URL parameters change
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['applications', 'internships', 'reports'].includes(tabParam)) {
      setActiveTab(tabParam as 'applications' | 'internships' | 'reports');
    }
  }, [searchParams]);

  // Simulate a report status change when the reports tab is clicked (only once)
  useEffect(() => {
    // Only run when reports tab is active and notification hasn't been shown yet
    if (activeTab === 'reports' && !hasShownReportNotification) {
      // Find the Microsoft internship (id: 3) with pending status
      const internshipIndex = myInternships.findIndex(i => i.id === 3);
      
      if (internshipIndex >= 0 && myInternships[internshipIndex].report) {
        // Wait a moment after tab switch before showing the notification
        const timer = setTimeout(() => {
          const internship = myInternships[internshipIndex];
          
          // Create updated internship with rejected status
          const updatedInternship: MyInternship = {
            ...internship,
            report: {
              ...internship.report!,
              status: 'rejected' as 'pending' | 'accepted' | 'flagged' | 'rejected'
            }
          };
          
          // Update the internships array
          const updatedInternships = [...myInternships];
          updatedInternships[internshipIndex] = updatedInternship;
          
          setMyInternships(updatedInternships);
          setFilteredInternships(prev => 
            prev.map(item => 
              item.id === 3 ? updatedInternship : item
            )
          );
          
          // Highlight the changed report with pulse animation
          setHighlightedReportId(3);
          
          // Clear highlight after animation completes
          setTimeout(() => {
            setHighlightedReportId(undefined);
          }, 3000);
          
          // Show notification about the status change
          showNotification({
            message: `Your report for ${updatedInternship.title} at ${updatedInternship.company} has been rejected. Please check the feedback.`,
            type: 'warning'
          });
          
          // Add to persistent notifications
          addNotification({
            title: "Report Status Changed (Pro Student)",
            message: `Your report for "${updatedInternship.title}" at ${updatedInternship.company} has been rejected. Please review SCAD comments and consider submitting an appeal.`,
            type: 'status-change'
          });
          
          // Mark that we've shown the notification
          setHasShownReportNotification(true);
        }, 1000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [activeTab, hasShownReportNotification, myInternships, showNotification, addNotification]);

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
      }    } else if (activeTab === 'reports') {
      // Show only internships with finalized reports that have a status
      results = myInternships.filter(internship => 
        internship.report?.finalized && 
        internship.report?.status && 
        ['pending', 'accepted', 'flagged', 'rejected'].includes(internship.report.status)
      );
        // Apply report status filter if not "All"
      if (activeFilters.reportStatus && activeFilters.reportStatus !== 'All') {
        const reportStatus = activeFilters.reportStatus.toLowerCase();
        results = results.filter(internship => 
          internship.report?.status === reportStatus
        );
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
          // Show success notification and add to bell icon
        showNotification({
          message: `Evaluation for ${selectedInternship.title} at ${selectedInternship.company} submitted successfully!`,
          type: 'success'
        });
        
        // Add persistent notification to bell icon
        addNotification({
          title: "Evaluation Submitted",
          message: `You've successfully submitted an evaluation for ${selectedInternship.title} at ${selectedInternship.company}.`,
          type: 'application'
        });
      }, 800); // Simulate network delay
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
          // Create a finalized copy of the report with pending status
        const finalizedReport = {
          ...report,
          finalized: true,
          status: 'pending' as const
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
            // Show success notification and add to bell icon
          showNotification({
            message: `Your report for ${selectedInternship.title} at ${selectedInternship.company} has been finalized and submitted.`,
            type: 'success'
          });
          
          // Add persistent notification to bell icon
          addNotification({
            title: "Report Submitted",
            message: `Your report for ${selectedInternship.title} at ${selectedInternship.company} has been finalized and is now under review.`,
            type: 'application'
          });
            // First set the highlighted report ID, then change the active tab
          setHighlightedReportId(selectedInternship.id);
          setActiveTab('reports');
          
          // Clear the highlight after animation completes (3 seconds)
          setTimeout(() => {
            setHighlightedReportId(undefined);
          }, 3000);
        }, 800); // Simulate network delay
      }
    }
  };
  // Handle submitting a report
  const handleSubmitReport = () => {
    if (selectedInternship) {
      // Add confirmation if report is finalized
      if (report.finalized && !window.confirm('This report is marked as finalized. Submitting it will make it official and it may be reviewed by faculty. Continue?')) {
        return;
      }
      
      setIsSubmittingReport(true);
        // Simulate API call with a slight delay
      setTimeout(() => {
        // Create updated report with status if finalized
        const updatedReport = {
          ...report,
          // Always set status to 'pending' if report is finalized
          status: report.finalized ? 'pending' as const : undefined
        };
        
        // Update the internship with the new report
        const updatedInternships = myInternships.map(internship => {
          if (internship.id === selectedInternship.id) {
            return {
              ...internship,
              report: updatedReport
            };
          }
          return internship;
        });
        
        setMyInternships(updatedInternships);
        setFilteredInternships(prev => 
          prev.map(item => 
            item.id === selectedInternship.id 
              ? { ...item, report: updatedReport }
              : item
          )
        );
        
        setIsSubmittingReport(false);
        setShowReportModal(false);
          // Show success notification with appropriate message
        showNotification({
          message: report.finalized 
            ? `Your report for ${selectedInternship.title} at ${selectedInternship.company} has been submitted for review!` 
            : `Draft report for ${selectedInternship.title} at ${selectedInternship.company} saved successfully!`,
          type: 'success'
        });
        
        // Add persistent notification to bell icon
        addNotification({
          title: report.finalized ? "Report Submitted" : "Report Saved",
          message: report.finalized
            ? `Your report for ${selectedInternship.title} at ${selectedInternship.company} has been submitted for review.`
            : `Your draft report for ${selectedInternship.title} at ${selectedInternship.company} was saved.`,
          type: 'application'
        });
          // If the report is finalized, redirect to reports tab and highlight the new report
        if (report.finalized) {
          // First set the highlighted report ID
          setHighlightedReportId(selectedInternship.id);
          
          // Then change the active tab to reports
          setActiveTab('reports');
          
          // Clear the highlight after animation completes (3 seconds)
          setTimeout(() => {
            setHighlightedReportId(undefined);
          }, 3000);
        }
      }, 800); // Simulate network delay
    }
  };
  
  // Handle deleting an evaluation
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
        
        // Add persistent notification to bell icon
        addNotification({
          title: "Evaluation Deleted",
          message: `Your evaluation for ${selectedInternship.title} at ${selectedInternship.company} has been removed.`,
          type: 'application'
        });
      }
    }
  };  
  
  // Handle deleting a report
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
        
        // Add persistent notification to bell icon
        addNotification({
          title: "Report Deleted",
          message: `Your report for ${selectedInternship.title} at ${selectedInternship.company} has been removed.`,
          type: 'application'
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
    const course = availableCourses.find((c: {id: string, name: string}) => c.id === courseId);
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
        const pdfUtils = await import('@/utils/pdfUtils');
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
        
        // Add persistent notification to bell icon
        addNotification({
          title: "Report Downloaded",
          message: `Your report for ${selectedInternship.title} at ${selectedInternship.company} has been downloaded as "${fileName}".`,
          type: 'application'
        });
      } catch (error) {
        console.error('Error generating PDF:', error);
          // Show error notification
        showNotification({
          message: 'Failed to generate PDF. Please try again.',
          type: 'error'
        });
        
        // Add persistent notification to bell icon
        addNotification({
          title: "PDF Generation Failed",
          message: `We couldn't generate the PDF for your report at ${selectedInternship.company}. Please try again later.`,
          type: 'application'
        });
      } finally {
        setIsGeneratingPDF(false);
      }
    }
  };
  // Handle viewing report results
  const handleViewReportResults = (report: any) => {
    const internship = myInternships.find(i => i.id === report.id);
    if (internship) {
      setSelectedInternship(internship);
      setShowReportResultsModal(true);
    }
  };
  // Handle submitting an appeal for a flagged or rejected report
  const handleSubmitAppeal = (internshipId: number, appealMessage: string) => {
    setIsSubmittingAppeal(true);
    
    // Find the internship to get its details for better notifications
    const internship = myInternships.find(intern => intern.id === internshipId);
      if (!internship) {
      setIsSubmittingAppeal(false);
      showNotification({
        message: "Error: Could not find the internship to submit appeal.",
        type: 'error'
      });
      
      // Add persistent notification to bell icon
      addNotification({
        title: "Appeal Submission Error",
        message: "We couldn't process your appeal because the internship details couldn't be found.",
        type: 'application'
      });
      return;
    }
    
    // Simulate API call with a slight delay
    setTimeout(() => {
      // Update the internship with the appeal
      const now = new Date();
      const appealDate = now.toISOString();
      const formattedDate = `${now.getDate()} ${now.toLocaleString('default', { month: 'long' })} ${now.getFullYear()}`;
      
      const updatedInternships = myInternships.map(internship => {
        if (internship.id === internshipId && internship.report) {
          return {
            ...internship,
            report: {
              ...internship.report,
              appealMessage,
              appealDate
            }
          };
        }
        return internship;
      });
      
      setMyInternships(updatedInternships);
      setFilteredInternships(prev => 
        prev.map(item => 
          item.id === internshipId && item.report
            ? { ...item, report: { ...item.report, appealMessage, appealDate } }
            : item
        )
      );
      
      setIsSubmittingAppeal(false);
        // Show success notification with specific details
      showNotification({
        message: `Appeal for "${internship.report?.title}" at ${internship.company} has been submitted successfully! SCAD will review your appeal and respond within 5-7 business days.`,
        type: 'success'
      });
      
      // Add persistent notification to bell icon
      addNotification({
        title: "Appeal Submitted",
        message: `Your appeal for the report "${internship.report?.title}" at ${internship.company} has been submitted for review by SCAD.`,
        type: 'application'
      });
      
      // Close modal after a brief delay so user can see the changes
      setTimeout(() => {
        setShowReportResultsModal(false);
      }, 1000);
    }, 800); // Simulate network delay
  };
  // Handle filter changes
  const handleFilterChange = (filterType: string, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };
  
  // Clear all filters
  const handleClearFilters = () => {
    setActiveFilters({
      status: 'All',
      internStatus: 'All',
      reportStatus: 'All',
      date: 'All'
    });
    setSearchTerm('');
  };
  
  return (
    <div className={styles.pageContainer}>
      {/* Global Navigation for Pro Student */}
      <StudentNavigationMenu />
      
      <div className={styles.contentWrapper}>
        {/* Filter Sidebar - Show for both tabs */}        <FilterSidebar
          filters={getFormattedFilters()}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        {/* Main Content */}        
        <main className={styles.mainContent}>
          {/* Search Bar */}
          <SearchBar
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
            placeholder="Search by job title or company..."
          />          
          <div className={styles.internshipListings}>
            <div className={styles.listingHeader}>
              <h2 className={styles.listingTitle}>
                {activeTab === 'applications' ? 'My Applications' : 
                 activeTab === 'internships' ? 'My Internships' : 'Report Results'}
              </h2>
              <span className={styles.internshipCount}>
                {filteredInternships.length} {activeTab === 'reports' ? 'Report' : 'Internship'}{filteredInternships.length !== 1 ? 's' : ''}
              </span>
            </div>            
            {filteredInternships.length > 0 ? (              
              activeTab === 'reports' ? (
                <ReportsList 
                  reports={filteredInternships} 
                  onViewReportResults={handleViewReportResults}
                  highlightedReportId={highlightedReportId}
                />
              ) : (
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
              )            ) : (              <div className={styles.noResults}>
                <Search 
                  size={64} 
                  className={styles.searchIcon} 
                  strokeWidth={1.5}
                  color="#888"
                />
                <h3>No {activeTab === 'reports' ? 'reports' : 'internships'} found</h3>
                <p>
                  {activeTab === 'applications' ? 
                    'You haven\'t applied to any internships yet. Browse the internship listings to find opportunities.' : 
                   activeTab === 'internships' ?
                    'You don\'t have any active internships yet. Check your applications status.' :
                    'You don\'t have any report results yet. Make sure to finalize and submit your internship reports.'
                  }
                </p>
                {(searchTerm || activeFilters.status !== 'All' || activeFilters.internStatus !== 'All' || 
                  activeFilters.reportStatus !== 'All' || activeFilters.date !== 'All') && (
                  <button 
                    className={styles.shareProfileButton} 
                    onClick={handleClearFilters} 
                    style={{ marginTop: '20px' }}
                  >
                    Clear All Filters
                  </button>
                )}
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
      
      {/* Report Results Modal */}
      {showReportResultsModal && selectedInternship && (
        <ReportResultsModal
          internship={selectedInternship}
          onClose={() => setShowReportResultsModal(false)}
          onSubmitAppeal={handleSubmitAppeal}
          isSubmittingAppeal={isSubmittingAppeal}
        />
      )}
    </div>
  );
};

export default MyInternshipsPage;