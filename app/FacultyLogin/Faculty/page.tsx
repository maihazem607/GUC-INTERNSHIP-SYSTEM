'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import { useRouter, useSearchParams } from 'next/navigation';
import FilterSidebar from "../../../src/components/global/FilterSidebar";
import SearchBar from "../../../src/components/global/SearchBar";
import { Report } from "../../../src/components/SCAD/ReportList";
import FacultyReportTable from "../../../src/components/Faculty/FacultyReportTable";
import ReportDetailsModal from "../../../src/components/SCAD/ReportDetailsModal";
import EvaluationCard, { Evaluation } from "../../../src/components/SCAD/EvaluationList";
import EvaluationModalAdapter from "../../../src/components/SCAD/EvaluationModalAdapter";
import NotificationSystem, { useNotification } from "../../../src/components/global/NotificationSystemAdapter";
import SCADNavigation from '../Navigation/FacultyNavigationMenu';
import StatisticsSection, { StatisticsData } from "../../../src/components/SCAD/StatisticsSection";
import EvaluationTable from '../../../src/components/SCAD/EvaluationList';
import {
  Building,
  Users,
  FileText,
  Settings,
  ClipboardCheck,
  Briefcase,
  Search,
  AlertCircle,
  Calendar,
  BarChart2,
  BookOpen
} from 'lucide-react';
import FacultyNavigation from '../Navigation/FacultyNavigationMenu';

const mockReports = [
  {      id: 1,
    title: 'First Month Progress Report',
    studentId: 1,
    studentName: 'Sarah Johnson',
    major: 'Computer Science',
    companyName: 'Tech Solutions Inc.',
    submissionDate: '2023-07-01',
    status: 'pending' as 'pending',
    content: 'Introduction:\nDuring my first month at Tech Solutions Inc., I have been immersed in mobile application development, focusing primarily on enhancing their flagship product. This internship has provided me with hands-on experience in modern development practices and agile methodologies.\n\nProject Involvement:\nMy primary task has been developing a new feature for their mobile app that allows users to customize their dashboard experience. I learned about React Native, state management with Redux, and established mobile app development workflows. The feature includes user preference persistence, theme customization, and widget reordering capabilities.\n\nSkills Developed:\nI have significantly improved my understanding of component-based architecture and design systems. Working with the design team has also enhanced my ability to translate visual requirements into functional code. I\'ve learned to write unit tests using Jest and implement CI/CD workflows using GitHub Actions.\n\nCollaboration Experience:\nI collaborated with product managers and engineers to identify pain points in the current UI and proposed design solutions to address them. I conducted user research sessions with existing customers to understand their needs better, and created wireframes and high-fidelity prototypes using Figma. Weekly stand-ups and code reviews have been invaluable for getting feedback and improving my implementation approach.\n\nChallenges and Solutions:\nOne major challenge was optimizing performance for older devices while maintaining the visual fidelity of the new dashboard. I researched and implemented memo and useMemo hooks to prevent unnecessary re-renders, which resulted in a 30% performance improvement on target devices.',
    supervisorName: 'John Doe',
    internshipStartDate: '2023-06-01',
    internshipEndDate: '2023-08-31',
    coursesApplied: ['CSCI 401', 'CSCI 331', 'CSCI 386'],
    logo: '/logos/amazon.png',
    scadFeedback: 'Currently under review. Your report contains good technical detail about your project work. Previous reviewers have noted that students should connect their technical work more explicitly to their academic courses. Consider adding references to specific course concepts you\'ve applied.', 
    studentResponses: [] // No responses yet as it's pending review
  },
  {    
    id: 2,
    title: 'Final Internship Report',
    studentId: 3,
    studentName: 'Emily Rodriguez',
    major: 'Business Administration',
    companyName: 'Global Finance',
    submissionDate: '2023-04-15',
    status: 'accepted' as 'accepted',
    content: 'During my three-month internship at Global Finance, I worked in the marketing department assisting with campaign planning and analytics. I gained valuable skills in data analysis and marketing strategy development.\n\nMy internship at Global Finance was focused on improving the effectiveness of digital marketing campaigns. I collaborated with the marketing team to analyze customer data, create targeted campaigns, and measure their impact. I conducted A/B testing on landing pages to optimize conversion rates and created reports that helped the team make data-driven decisions. My designs were implemented in the company\'s latest marketing materials, specifically improving the click-through rates for email campaigns. I also participated in several strategy sessions where I received valuable feedback from senior marketers that significantly improved my analytical skills.',
    supervisorName: 'Jane Smith',
    internshipStartDate: '2023-01-15',
    internshipEndDate: '2023-04-15',    evaluationScore: 4.6,
    evaluationComments: 'Emily was an exceptional intern who demonstrated great analytical skills and creativity. Her work with our marketing team led to measurable improvements in our campaign performance, and her analytical approach to problem-solving was impressive. She integrated well with the team and showed leadership potential when presenting her findings to senior management.',
    coursesApplied: ['MKTG 301', 'FINC 202', 'MGMT 405'],
    logo: '/logos/facebook.png', // Added logo for better display
    scadFeedback: 'This is an excellent report that demonstrates significant learning and contribution to the organization. The detailed analysis of marketing campaigns and measurable results show a strong application of academic knowledge in a professional setting.', // Added for tabbed interface
    studentResponses: ['Thank you for the positive feedback! I really enjoyed my time at Global Finance and learned so much from the marketing team.'] // Added for tabbed interface
  },  
  {      id: 3,
    title: 'Mid-term Progress Report',
    studentId: 4,
    studentName: 'Ahmed Hassan',
    major: 'Computer Science',
    companyName: 'Health Partners',
    submissionDate: '2023-07-01',
    status: 'flagged' as 'flagged',
    content: 'Introduction:\nThis report covers my progress during the midpoint of my internship at Health Partners, where I have been working on developing a patient management system. The focus of my work has been on creating secure and accessible healthcare information systems that comply with industry regulations.\n\nProject Overview:\nI have been working on developing a comprehensive patient management system for Health Partners that will streamline appointment scheduling, medical record access, and communication between patients and healthcare providers. This system will replace their current outdated platform with a modern, responsive solution.\n\nTechnical Implementation:\nMy primary focus has been on implementing the front-end interface for the patient portal using React and TypeScript. I collaborated with UX designers to create an accessible interface that meets WCAG guidelines. The system needs to handle sensitive patient data securely, so I\'ve been researching best practices for data encryption and secure authentication methods. I\'ve implemented JWT token-based authentication and session management to protect user accounts.\n\nLearning Outcomes:\nI\'m learning a lot about healthcare data management and security requirements. Working in the healthcare tech space has taught me about the importance of balancing user experience with rigorous security protocols. I\'ve gained experience with React hooks, context API, and TypeScript interfaces to create a more maintainable codebase.\n\nNext Steps:\nIn the coming weeks, I will work on integrating the front-end with the backend API and implementing data validation. I plan to focus on implementing robust error handling and data validation to ensure data integrity.',
    supervisorName: 'Robert Johnson',
    internshipStartDate: '2023-05-15',
    internshipEndDate: '2023-08-15',
    clarificationComment: 'Please provide more details about the specific security measures you are implementing.',
    comments: [
      'Your report needs to include specific information about how you\'re addressing HIPAA compliance requirements.',
      'Please detail the encryption methods you\'re using for patient data storage and transmission.',
      'The security section needs elaboration on authentication protocols and access control measures implemented.'
    ],
    logo: '/logos/google.png',
    scadFeedback: 'This report has been flagged for revision. While you demonstrate solid technical work on the patient management system, the report lacks critical details regarding security implementation in a healthcare context. Given the sensitive nature of healthcare data, please provide comprehensive information about:\n\n1. Specific HIPAA compliance measures implemented in your code\n2. Encryption standards used for data at rest and in transit\n3. Authentication and authorization protocols\n4. Audit logging mechanisms for regulatory compliance\n\nPlease submit a revised report addressing these security aspects in detail.',
    studentResponses: ['Thank you for the feedback. I\'ll add more details about our encryption methods and HIPAA compliance approach in my revised report. I\'ve been working closely with the security team and can provide specific implementation details.']
  },
  {      id: 4,
    title: 'Initial Progress Report',
    studentId: 1,
    studentName: 'Sarah Johnson',
    major: 'Computer Science',
    companyName: 'Tech Solutions Inc.',
    submissionDate: '2023-06-15',
    status: 'rejected' as 'rejected',
    content: 'First two weeks at Tech Solutions Inc. were focused on onboarding and getting familiar with their codebase.\n\nI attended orientation sessions and was assigned to the mobile app development team. I set up my development environment and started exploring the project structure.',
    supervisorName: 'John Doe',
    internshipStartDate: '2023-06-01',
    internshipEndDate: '2023-08-31',
    clarificationComment: 'The report lacks sufficient detail about your specific contributions and learning experiences.',
    comments: [
      'Your report falls significantly below the minimum word count requirement for internship reports.',
      'Please include specific technologies you worked with during onboarding with concrete examples.',
      'This submission lacks any discussion of learning outcomes or challenges faced.',
      'The report needs substantial revision to meet academic requirements.'
    ],
    logo: '/logos/amazon.png',
    scadFeedback: 'This report has been rejected as it does not meet the minimum academic requirements for an internship report submission. Major issues include:\n\n1. Extremely limited content (less than 100 words when minimum requirement is 750)\n2. No specific details about technologies, methodologies, or tools used\n3. No reflection on learning experiences or challenges\n4. No connection to academic coursework\n5. Missing required sections (project details, skills developed, etc.)\n\nPlease refer to the internship report guidelines and submit a completely revised report that properly documents your internship activities, technical contributions, and learning outcomes. The revised report should include specific examples of your work and detailed reflections on your experience.',
    studentResponses: [
      'I apologize for the brief report. I misunderstood the requirements. I\'ll add details about the React Native components I worked with and the challenges I faced with state management.',
      'I\'ve submitted my revised report with more details about my specific contributions and learning experiences.'
    ]
  }
];

// Mock evaluations data
const mockEvaluations: Evaluation[] = [  {
    id: 1,
    studentName: 'Sarah Johnson',
    studentId: 1,
    companyName: 'Tech Solutions Inc.',
    major: 'Computer Science',
    supervisorName: 'John Doe',
    internshipStartDate: '2023-06-01',
    internshipEndDate: '2023-08-31',    evaluationDate: '2023-09-05',
    evaluationScore: 4.8,
    performanceRating: 5,
    skillsRating: 5,
    attitudeRating: 4.5,
    comments: "Sarah demonstrated exceptional initiative and technical aptitude during her internship. Her problem-solving skills were outstanding, and she quickly adapted to our tech stack. She contributed significantly to our mobile app development, delivering several key features ahead of schedule. Her communication skills were excellent, and she worked well with the team.",
    status: 'completed'
  },  {
    id: 2,
    studentName: 'Emily Rodriguez',
    studentId: 3,
    companyName: 'Global Finance',
    major: 'Business Administration',
    supervisorName: 'Jane Smith',
    internshipStartDate: '2023-01-15',
    internshipEndDate: '2023-04-15',    evaluationDate: '2023-04-20',
    evaluationScore: 4.2,
    performanceRating: 4,
    skillsRating: 5,
    attitudeRating: 3.6,
    comments: "Emily excelled in our financial analysis internship, demonstrating strong analytical skills and attention to detail. She developed an innovative approach to data visualization that we've since implemented company-wide. Her presentations to senior management were professional and well-prepared. She showed great enthusiasm for learning and quickly grasped complex financial concepts.",
    status: 'completed'
  },  {
    id: 3,
    studentName: 'Ahmed Hassan',
    studentId: 4,
    companyName: 'Health Partners',
    major: 'Computer Science',
    supervisorName: 'Robert Johnson',
    internshipStartDate: '2023-05-15',
    internshipEndDate: '2023-08-15',    evaluationDate: '2023-08-20',
    evaluationScore: 3.2,
    performanceRating: 3,
    skillsRating: 3,
    attitudeRating: 3.6,
    comments: "Ahmed made valuable contributions to our healthcare software platform. His coding skills were strong, particularly in backend development. He implemented several important features that improved system performance. Ahmed collaborated well with the development team and showed dedication to meeting project deadlines. He was receptive to feedback and consistently improved his work based on code reviews.",
    status: 'completed'
  },  {
    id: 4,
    studentName: 'Michael Chen',
    studentId: 6,
    companyName: 'Data Innovations',
    major: 'Computer Engineering',
    supervisorName: 'Amelia Patel',
    internshipStartDate: '2023-06-01',
    internshipEndDate: '2023-09-01',    evaluationDate: '2023-09-10',
    evaluationScore: 2.1,
    performanceRating: 2,
    skillsRating: 3,
    attitudeRating: 1.3,
    comments: "Michael struggled with some aspects of the internship. While he showed basic technical understanding, he had difficulty implementing more complex features. His attendance was inconsistent, and he sometimes missed project deadlines. He would benefit from developing better time management and communication skills. That said, he did show improvement in the final weeks and completed his assigned data analysis tasks satisfactorily.",
    status: 'completed'
  },  {
    id: 5,
    studentName: 'Layla Ibrahim',
    studentId: 8,
    companyName: 'Marketing Excellence',
    major: 'Marketing',
    supervisorName: 'David Wilson',
    internshipStartDate: '2023-05-15',
    internshipEndDate: '2023-08-15',    evaluationDate: '2023-08-25',
    evaluationScore: 2.9,
    performanceRating: 3,
    skillsRating: 2.7,
    attitudeRating: 3,
    comments: "Layla performed adequately during her marketing internship. She contributed to our social media campaigns and helped analyze campaign metrics. She has a good understanding of marketing principles and applied them in her work. Layla was reliable and punctual, always meeting basic expectations. With more experience and confidence, she has the potential to develop into a strong marketing professional.",
    status: 'completed'
  }
];
const mockStatisticsData: StatisticsData = {
  reports: {
    accepted: 52,
    rejected: 18,
    flagged: 12,
    total: 82,
    trend: { value: 8.2, isPositive: true }
  },
  reviewTime: {
    average: '2.3 days',
    trend: { value: 15, isPositive: true }
  },
  courses: {
    topCourses: [
      { name: 'CSEN 704 Advanced Computer Lab', count: 87 },
      { name: 'DMET 502 Computer Graphics', count: 62 },
      { name: 'CSEN 603 Software Engineering', count: 58 },
      { name: 'CSEN 401 Computer Programming', count: 45 },
      { name: 'CSEN 501 Data Structures', count: 42 },
      { name: 'CSEN 702 Microprocessors', count: 38 },
      { name: 'CSEN 503 Database Systems', count: 35 },
      { name: 'CSEN 402 Computer Organization', count: 30 }
    ],
    trend: { value: 5, isPositive: true }
  },
  companies: {
    topRated: [
      { name: 'Google', rating: 9.2 },
      { name: 'Microsoft', rating: 9.0 },
      { name: 'Amazon', rating: 8.8 },
      { name: 'IBM', rating: 8.5 },
      { name: 'Apple', rating: 8.4 }
    ],
    trend: { value: 2, isPositive: true }
  },
  internships: {
    topCompanies: [
      { name: 'Google', count: 24 },
      { name: 'Microsoft', count: 18 },
      { name: 'Amazon', count: 16 },
      { name: 'IBM', count: 14 },
      { name: 'Apple', count: 12 },
      { name: 'Facebook', count: 10 },
      { name: 'Tesla', count: 8 }
    ],
    total: 120,
    trend: { value: 12, isPositive: true }
  }
};

type ActiveMenuItem = 'reports' | 'evaluations' | 'statistics';

export default function FacultyPage() {

    const router = useRouter();
      const searchParams = useSearchParams();
      
      const [activeItem, setActiveItem] = useState<ActiveMenuItem>(
        (searchParams.get('activeItem') as ActiveMenuItem) || 'reports'
      );
      
     // Update the URL when activeItem changes
      useEffect(() => {
        router.push(`/FacultyLogin/Faculty${activeItem !== 'reports' ? `?activeItem=${activeItem}` : ''}`);
      }, [activeItem, router]);

     const [reports, setReports] = useState<any[]>([]);
      const [reportSearchTerm, setReportSearchTerm] = useState('');
      const [selectedReportStatus, setSelectedReportStatus] = useState('');
      const [selectedReportMajor, setSelectedReportMajor] = useState('');
      const [selectedReport, setSelectedReport] = useState<any | null>(null);
      const [showReportDetails, setShowReportDetails] = useState(false);
    
      // Evaluations states
      const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
      const [evaluationSearchTerm, setEvaluationSearchTerm] = useState('');
      const [selectedEvaluationStatus, setSelectedEvaluationStatus] = useState('');
      const [selectedEvaluationMajor, setSelectedEvaluationMajor] = useState('');
      const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null);
      const [showEvaluationDetails, setShowEvaluationDetails] = useState(false);

      // Global notification state
    const { notification, visible, showNotification, hideNotification } = useNotification();
      const handleClearFilters = () => {
    switch (activeItem) {
      case 'reports':
        setReportSearchTerm('');
        setSelectedReportStatus('');
        setSelectedReportMajor('');
        break;
      case 'evaluations':
        setEvaluationSearchTerm('');
        setSelectedEvaluationStatus('');
        setSelectedEvaluationMajor('');
        break
      default:
        break;
    }
  };
    // Load mock data
      useEffect(() => {
        setReports(mockReports);
        setEvaluations(mockEvaluations);
      }, []);

      const handleReportSearch = (term: string) => {
    setReportSearchTerm(term);
  };

  const handleReportStatusChange = (filterType: string, value: string) => {
    if (filterType === 'status') {
      setSelectedReportStatus(value.toLowerCase());
    } else if (filterType === 'major') {
      setSelectedReportMajor(value);
    }
  };

  // Adding missing report filter handler
  const handleReportFilterChange = (filterType: string, value: string) => {
    if (filterType === 'status') {
      setSelectedReportStatus(value.toLowerCase());
    } else if (filterType === 'major') {
      setSelectedReportMajor(value);
    }
  };

  const handleViewReportDetails = (report: any) => {
    setSelectedReport(report);
    setShowReportDetails(true);
  };

  const handleCloseReportDetails = () => {
    setShowReportDetails(false);
    setSelectedReport(null);
  };
  const handleUpdateReportStatus = (id: number, newStatus: 'pending' | 'flagged' | 'rejected' | 'accepted') => {
    const report = reports.find(report => report.id === id);
    setReports(reports.map((report: any) =>
      report.id === id ? { ...report, status: newStatus } : report
    ));

    // Show notification based on action
    if (report) {
      const statusMessages = {
        'accepted': {
          message: `Report "${report.title}" has been accepted.`,
          type: 'success'
        },
        'rejected': {
          message: `Report "${report.title}" has been rejected.`,
          type: 'info'
        },
        'flagged': {
          message: `Report "${report.title}" has been flagged for review.`,
          type: 'warning'
        },
        'pending': {
          message: `Report "${report.title}" has been marked as pending.`,
          type: 'info'
        }
      };

      showNotification({
        message: statusMessages[newStatus].message,
        type: statusMessages[newStatus].type as 'success' | 'error' | 'warning' | 'info'
      });
    }
  };

  // Filter reports
  const filteredReports = reports.filter((report: any) => {
    const matchesSearch = report.title.toLowerCase().includes(reportSearchTerm.toLowerCase()) ||
      report.studentName.toLowerCase().includes(reportSearchTerm.toLowerCase());
    const matchesStatus = selectedReportStatus === '' || report.status === selectedReportStatus;
    const matchesMajor = selectedReportMajor === '' || report.major === selectedReportMajor;
    return matchesSearch && matchesStatus && matchesMajor;
  });

// EVALUATIONS SECTION HANDLERS
  const handleEvaluationSearch = (term: string) => {
    setEvaluationSearchTerm(term);
  };

  const handleEvaluationFilterChange = (filterType: string, value: string) => {
    if (filterType === 'status') {
      setSelectedEvaluationStatus(value.toLowerCase());
    } else if (filterType === 'major') {
      setSelectedEvaluationMajor(value);
    }
  };

  const handleViewEvaluationDetails = (evaluation: Evaluation) => {
    setSelectedEvaluation(evaluation);
    setShowEvaluationDetails(true);
  };

  const handleCloseEvaluationDetails = () => {
    setShowEvaluationDetails(false);
    setSelectedEvaluation(null);
  };    const handleUpdateEvaluation = (id: number, performanceRating: number, skillsRating: number, attitudeRating: number, comments: string, recommended: boolean) => {
    // In a real app, you would call an API here
    const evaluation = evaluations.find(evaluation => evaluation.id === id);
    
    // Calculate the overall score as average of the three ratings (to keep it out of 5)
    const overallScore = Math.round((performanceRating + skillsRating + attitudeRating) / 3 * 10) / 10;
    
    setEvaluations(evaluations.map(evaluation =>
      evaluation.id === id ? { 
        ...evaluation, 
        evaluationScore: overallScore,
        performanceRating,
        skillsRating,
        attitudeRating,
        comments
      } : evaluation
    ));

    // Close the modal or keep it open with updated data
    setSelectedEvaluation(prev => prev ? { 
      ...prev, 
      evaluationScore: overallScore,
      performanceRating,
      skillsRating,
      attitudeRating,
      comments
    } : null);

    // Show success notification
    if (evaluation) {
      showNotification({
        message: `Evaluation for ${evaluation.studentName} has been updated successfully.`,
        type: 'success'
      });
    }
  };

  const handleDeleteEvaluation = (id: number) => {
    // In a real app, you would call an API here
    const evaluation = evaluations.find(evaluation => evaluation.id === id);
    setEvaluations(evaluations.filter(evaluation => evaluation.id !== id));
    setShowEvaluationDetails(false);

    // Show info notification
    if (evaluation) {
      showNotification({
        message: `Evaluation for ${evaluation.studentName} has been deleted.`,
        type: 'info'
      });
    }
  };

  // Filter evaluations
  const filteredEvaluations = evaluations.filter((evaluation: Evaluation) => {
    const matchesSearch =
      evaluation.studentName.toLowerCase().includes(evaluationSearchTerm.toLowerCase()) ||
      evaluation.companyName.toLowerCase().includes(evaluationSearchTerm.toLowerCase());
    const matchesStatus = selectedEvaluationStatus === '' || evaluation.status === selectedEvaluationStatus;
    const matchesMajor = selectedEvaluationMajor === '' || evaluation.major === selectedEvaluationMajor;
    return matchesSearch && matchesStatus && matchesMajor;
  });


    const pendingReportsCount = reports.filter((report: any) => report.status === 'pending').length;
    const completedEvaluationsCount = evaluations.filter((evaluation: Evaluation) => evaluation.status === 'completed').length;

// Define available majors for filtering
const majors = Array.from(new Set(evaluations.map((evaluation: Evaluation) => evaluation.major)));

     const reportFilters = [
    {
      title: "Status",
      options: ['', 'Pending', 'Flagged', 'Rejected', 'Accepted'],
      type: "status",
      value: selectedReportStatus ? selectedReportStatus.charAt(0).toUpperCase() + selectedReportStatus.slice(1) : ''
    },
    {
      title: "Major",
      options: ['', ...majors],
      type: "major",
      value: selectedReportMajor
    }
  ];

  const evaluationFilters = [
    {
      title: "Status",
      options: ['', 'Completed', 'Pending'],
      type: "status",
      value: selectedEvaluationStatus ? selectedEvaluationStatus.charAt(0).toUpperCase() + selectedEvaluationStatus.slice(1) : ''
    },
    {
      title: "Major",
      options: ['', ...majors],
      type: "major",
      value: selectedEvaluationMajor
    }
  ];
  
  const handleLogout = () => {
    router.push('/');
  };


  // Removed erroneous showNotification call outside of component scope.
  

  // Move this function inside the FacultyPage component so it can access showNotification
  function handleGenerateStatisticsReport(): void {
    // In a real application, this would generate and potentially download a PDF report
    console.log('Generating statistics report...');
    
    // Show a success notification when the "report" is generated
    showNotification({
      message: 'Statistics report generated successfully! Ready for download.',
      type: 'success'
    });
  }


   return (
    <div className={styles.pageContainer}>     
     <FacultyNavigation
        activeItem={activeItem}
        onActiveItemChange={setActiveItem}
        onLogout={handleLogout}
      />      
      <div className={styles.contentWrapper}>        
        {/* Filter Sidebar - shows filters based on active tab, hidden for settings and statistics */}
        { activeItem !== 'statistics' && (
          <FilterSidebar
            filters={
                  activeItem === 'reports' ? reportFilters :
                    activeItem === 'evaluations' ? evaluationFilters :
                    
                        []
            }
            onFilterChange={
                  activeItem === 'reports' ? handleReportFilterChange :
                    activeItem === 'evaluations' ? handleEvaluationFilterChange :
                        () => { }
            }
            onClearFilters={handleClearFilters}
          />
        )}
            {/* Main Content */}
                <main className={`${styles.mainContent} ${( activeItem === 'statistics') ? styles.fullWidth : ''}`}>
                  {/* Current section title */}          <div className={styles.sectionTitle}>
                    
                    {activeItem === 'reports' && <h2>Reports</h2>}
                    {activeItem === 'evaluations' && <h2>Evaluations</h2>}
                    {activeItem === 'statistics' && <h2>Statistics</h2>}
                  </div>
         {/* REPORTS TAB */}
          {activeItem === 'reports' && (
            <>
              {/* Search Bar */}
              <SearchBar
                searchTerm={reportSearchTerm}
                setSearchTerm={handleReportSearch}
                placeholder="Search reports by title or student name..."
              />

              {/* Report Listings */}
              <div className={styles.listings}>
                <div className={styles.listingHeader}>
                  <h1 className={styles.listingTitle}>Internship Reports</h1>
                  <span className={styles.reportCount}>
                    {pendingReportsCount} pending reviews
                  </span>
                </div>                {filteredReports.length > 0 ? (
                  <FacultyReportTable
                    reports={filteredReports}
                    onViewReport={handleViewReportDetails}
                    onStatusChange={handleUpdateReportStatus}
                  />
                ) : (
                  <div className={styles.noResults}>
                    <Search size={48} className={styles.noResultsIcon} />
                    <p>No reports found matching your criteria.</p>
                    {(reportSearchTerm || selectedReportStatus || selectedReportMajor) && (
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
            </>
          )}
          {/* EVALUATIONS TAB */}
          {activeItem === 'evaluations' && (
            <>
              {/* Search Bar */}
              <SearchBar
                searchTerm={evaluationSearchTerm}
                setSearchTerm={handleEvaluationSearch}
                placeholder="Search evaluations by student or company..."
              />
              {/* Evaluation Listings */}
              <div className={styles.listings}>                <div className={styles.listingHeader}>
                  <h1 className={styles.listingTitle}>Internship Evaluations</h1>
                  <span className={styles.reportCount}>
                    {completedEvaluationsCount} completed evaluations
                  </span>
                </div>
                {filteredEvaluations.length > 0 ? (
                  <EvaluationTable
                    evaluations={filteredEvaluations}
                    onViewDetails={(evaluation) => handleViewEvaluationDetails(evaluation)}
                  />                ) : (
                  <div className={styles.noResults}>
                    <Search size={48} className={styles.noResultsIcon} />
                    <p>No evaluations found matching your criteria.</p>
                    {(evaluationSearchTerm || selectedEvaluationStatus || selectedEvaluationMajor) && (
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
            </>
          )}
           {/* STATISTICS TAB */}
          {activeItem === 'statistics' && (
            <StatisticsSection 
              data={mockStatisticsData}
              onGenerateReport={handleGenerateStatisticsReport}
            />
          )}
           </main>
      </div>

      {/* MODALS */}
       {showReportDetails && selectedReport && (
        <ReportDetailsModal
          title={selectedReport.title}
          studentName={selectedReport.studentName}
          major={selectedReport.major}
          companyName={selectedReport.companyName}
          supervisorName={selectedReport.supervisorName}
          internshipStartDate={selectedReport.internshipStartDate}
          internshipEndDate={selectedReport.internshipEndDate}
          submissionDate={selectedReport.submissionDate}
          status={selectedReport.status}
          content={selectedReport.content}
          evaluationScore={selectedReport.evaluationScore}
          evaluationComments={selectedReport.evaluationComments}
          clarificationComment={selectedReport.clarificationComment}
          comments={selectedReport.comments || []}
          onClose={handleCloseReportDetails}
          logo={selectedReport.logo}          onAddComment={(comment) => {
            console.log("Adding comment:", comment);
            
            // Add comment to the report
            const updatedReport = { 
              ...selectedReport,
              scadFeedback: selectedReport.scadFeedback ? 
                `${selectedReport.scadFeedback}\n\n${comment}` : 
                comment,
              comments: [...(selectedReport.comments || []), comment] 
            };
            setSelectedReport(updatedReport);
            
            // Update the report in the reports array
            setReports(reports.map((report: any) => 
              report.id === selectedReport.id ? updatedReport : report
            ));
            
            // Show confirmation notification
            showNotification({
              message: `Feedback added to "${selectedReport.title}"`,
              type: 'info'
            });
          }}
          onDeleteComment={(index) => {
            // Remove comment from the report
            const currentComments = [...(selectedReport.comments || [])];
            currentComments.splice(index, 1);
            
            const updatedReport = {
              ...selectedReport,
              comments: currentComments
            };
            setSelectedReport(updatedReport);
            
            // Update the report in the reports array
            setReports(reports.map((report: any) => 
              report.id === selectedReport.id ? updatedReport : report
            ));
            
            // Show notification
            showNotification({
              message: `Comment deleted from "${selectedReport.title}"`,
              type: 'info'
            });
          }}
          onAccept={() => {
            handleUpdateReportStatus(selectedReport.id, 'accepted');
            handleCloseReportDetails();
          }}
          onFlag={(comment) => {
            const updatedReport = { 
              ...selectedReport,
              status: 'flagged',
              clarificationComment: comment,
            };
            setSelectedReport(updatedReport);
            
            // Update the report in the reports array
            setReports(reports.map((report: any) => 
              report.id === selectedReport.id ? updatedReport : report
            ));
            
            // Show notification
            showNotification({
              message: `Report "${selectedReport.title}" has been flagged for review.`,
              type: 'warning'
            });
          }}
          onReject={(comment) => {
            const updatedReport = { 
              ...selectedReport,
              status: 'rejected',
              clarificationComment: comment,
            };
            setSelectedReport(updatedReport);
            
            // Update the report in the reports array
            setReports(reports.map((report: any) => 
              report.id === selectedReport.id ? updatedReport : report
            ));
            
            // Show notification
            showNotification({
              message: `Report "${selectedReport.title}" has been rejected.`,
              type: 'error'
            });
          }}
        />
      )}      {showEvaluationDetails && selectedEvaluation && (
        <EvaluationModalAdapter
          evaluation={selectedEvaluation}
          onClose={handleCloseEvaluationDetails}
          onUpdate={handleUpdateEvaluation}
          onDelete={handleDeleteEvaluation}
          hideActions={true}
        />
      )} 
    </div>
  );
}


