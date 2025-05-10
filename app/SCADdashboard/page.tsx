'use client';
import { useState, useEffect } from 'react';
import styles from './SCADpage.module.css';
import Navigation from "../../src/components/global/Navigation";
import FilterSidebar from "../../src/components/global/FilterSidebar";
import SearchBar from "../../src/components/global/SearchBar";
import CompanyCard from "../../src/components/SCAD/CompanyCard";
import StudentCard from "../../src/components/SCAD/StudentCard";
import ReportTable from "../../src/components/SCAD/ReportCard";
import SettingsCard from "../../src/components/SCAD/SettingsCard";
import CompanyDetailsModal from "../../src/components/SCAD/CompanyDetailsModal";
import StudentDetailsModal from "../../src/components/SCAD/StudentDetailsModal";
import ReportDetailsModal from "../../src/components/SCAD/ReportDetailsModal";
import EvaluationCard, { Evaluation } from "../../src/components/SCAD/EvaluationCard";
import EvaluationDetails from "../../src/components/SCAD/EvaluationDetails";
import InternshipCard from "../../src/components/internships/InternshipCard";
import InternshipDetailsModal from "../../src/components/internships/InternshipDetailsModal";
import { Internship } from "../../src/components/internships/types";
import NotificationSystem, { useNotification } from "../../src/components/global/NotificationSystem";

// Mock data for companies
const industryOptions = ['Technology', 'Finance', 'Healthcare', 'Education', 'Manufacturing', 'Other'];

interface Company {
  id: number;
  name: string;
  industry: string;
  description: string;
  contactPerson: string;
  email: string;
  phone: string;
  applicationDate: string;
  status: 'pending' | 'accepted' | 'rejected';
}

const mockCompanies: Company[] = [
  {
    id: 1,
    name: 'Tech Solutions Inc.',
    industry: 'Technology',
    description: 'Providing innovative software solutions for businesses.',
    contactPerson: 'John Doe',
    email: 'john@techsolutions.com',
    phone: '+1 123-456-7890',
    applicationDate: '2023-05-15',
    status: 'pending'
  },
  {
    id: 2,
    name: 'Global Finance',
    industry: 'Finance',
    description: 'Financial services and investment management.',
    contactPerson: 'Jane Smith',
    email: 'jane@globalfinance.com',
    phone: '+1 987-654-3210',
    applicationDate: '2023-06-02',
    status: 'pending'
  },
  {
    id: 3,
    name: 'Health Partners',
    industry: 'Healthcare',
    description: 'Healthcare management and services.',
    contactPerson: 'Robert Johnson',
    email: 'robert@healthpartners.com',
    phone: '+1 555-123-4567',
    applicationDate: '2023-06-10',
    status: 'pending'
  },
];

// Mock data for students
interface Student {
  id: number;
  name: string;
  email: string;
  major: string;
  gpa: number;
  internshipStatus: 'not started' | 'in progress' | 'completed' | 'not applicable';
  academicYear: string;
  companyName?: string;
  internshipStartDate?: string;
  internshipEndDate?: string;
}

const mockStudents: Student[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.j@student.guc.edu',
    major: 'Computer Science',
    gpa: 3.8,
    internshipStatus: 'in progress',
    academicYear: 'Senior',
    companyName: 'Tech Solutions Inc.',
    internshipStartDate: '2023-06-01',
    internshipEndDate: '2023-08-31'
  },
  {
    id: 2,
    name: 'Mohammed Ali',
    email: 'mohammed.a@student.guc.edu',
    major: 'Electrical Engineering',
    gpa: 3.5,
    internshipStatus: 'not started',
    academicYear: 'Junior'
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    email: 'emily.r@student.guc.edu',
    major: 'Business Administration',
    gpa: 3.7,
    internshipStatus: 'completed',
    academicYear: 'Senior',
    companyName: 'Global Finance',
    internshipStartDate: '2023-01-15',
    internshipEndDate: '2023-04-15'
  },
  {
    id: 4,
    name: 'Ahmed Hassan',
    email: 'ahmed.h@student.guc.edu',
    major: 'Computer Science',
    gpa: 3.9,
    internshipStatus: 'in progress',
    academicYear: 'Senior',
    companyName: 'Health Partners',
    internshipStartDate: '2023-05-15',
    internshipEndDate: '2023-08-15'
  },
  {
    id: 5,
    name: 'Fatima Zahra',
    email: 'fatima.z@student.guc.edu',
    major: 'Mechanical Engineering',
    gpa: 3.6,
    internshipStatus: 'not started',
    academicYear: 'Junior'
  }
];

// Mock data for reports

const mockReports = [
  {
    id: 1,
    title: 'First Month Progress Report',
    studentId: 1,
    studentName: 'Sarah Johnson',
    major: 'Computer Science',
    companyName: 'Tech Solutions Inc.',
    submissionDate: '2023-07-01',
    status: 'pending' as 'pending',
    content: 'During my first month at Tech Solutions Inc., I worked on developing a new feature for their mobile app. I learned about React Native and mobile app development workflows.',
    supervisorName: 'John Doe',
    internshipStartDate: '2023-06-01',
    internshipEndDate: '2023-08-31'
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
    content: 'Throughout my internship at Global Finance, I worked in the marketing department assisting with campaign planning and analytics. I gained valuable skills in data analysis and marketing strategy development.',
    supervisorName: 'Jane Smith',
    internshipStartDate: '2023-01-15',
    internshipEndDate: '2023-04-15',
    evaluationScore: 9.2,
    evaluationComments: 'Emily was an exceptional intern who demonstrated great analytical skills and creativity.'
  },
  {
    id: 3,
    title: 'Mid-term Progress Report',
    studentId: 4,
    studentName: 'Ahmed Hassan',
    major: 'Computer Science',
    companyName: 'Health Partners',
    submissionDate: '2023-07-01',
    status: 'flagged' as 'flagged',
    content: 'I have been working on developing a patient management system for Health Partners. I\'m learning a lot about healthcare data management and security requirements.',
    supervisorName: 'Robert Johnson',
    internshipStartDate: '2023-05-15',
    internshipEndDate: '2023-08-15'
  },
  {
    id: 4,
    title: 'Initial Progress Report',
    studentId: 1,
    studentName: 'Sarah Johnson',
    major: 'Computer Science',
    companyName: 'Tech Solutions Inc.',
    submissionDate: '2023-06-15',
    status: 'rejected' as 'rejected',
    content: 'First two weeks at Tech Solutions Inc. were focused on onboarding and getting familiar with their codebase.',
    supervisorName: 'John Doe',
    internshipStartDate: '2023-06-01',
    internshipEndDate: '2023-08-31'
  }
];

// Mock evaluations data
const mockEvaluations: Evaluation[] = [
  {
    id: 1,
    studentName: 'Sarah Johnson',
    studentId: 1,
    companyName: 'Tech Solutions Inc.',
    major: 'Computer Science',
    supervisorName: 'John Doe',
    internshipStartDate: '2023-06-01',
    internshipEndDate: '2023-08-31',
    evaluationDate: '2023-09-05',
    evaluationScore: 9.2,
    status: 'completed'
  },
  {
    id: 2,
    studentName: 'Emily Rodriguez',
    studentId: 3,
    companyName: 'Global Finance',
    major: 'Business Administration',
    supervisorName: 'Jane Smith',
    internshipStartDate: '2023-01-15',
    internshipEndDate: '2023-04-15',
    evaluationDate: '2023-04-20',
    evaluationScore: 8.7,
    status: 'completed'
  },
  {
    id: 3,
    studentName: 'Ahmed Hassan',
    studentId: 4,
    companyName: 'Health Partners',
    major: 'Computer Science',
    supervisorName: 'Robert Johnson',
    internshipStartDate: '2023-05-15',
    internshipEndDate: '2023-08-15',
    evaluationDate: '2023-08-20',
    evaluationScore: 7.8,
    status: 'completed'
  }
];

// Mock internships data
const mockInternships: Internship[] = [
  {
    id: 1,
    company: 'Tech Solutions Inc.',
    title: 'Frontend Developer',
    duration: '3 months',
    date: '2023-05-01',
    location: 'Cairo, Egypt',
    industry: 'Technology',
    isPaid: true,
    salary: 'EGP 5000/month',
    logo: '/logos/google.png',
    description: 'We are looking for a frontend developer to join our team for a summer internship. You will work on developing user interfaces for our web applications using React and Next.js. This is a great opportunity to gain hands-on experience in a fast-paced tech company.',
  },
  {
    id: 2,
    company: 'Global Finance',
    title: 'Financial Analyst',
    duration: '6 months',
    date: '2023-04-15',
    location: 'Alexandria, Egypt',
    industry: 'Finance',
    isPaid: true,
    salary: 'EGP 6500/month',
    logo: '/logos/ibm.png',
    description: 'As a Financial Analyst intern, you will assist in financial forecasting, budgeting, and reporting. You will work with our finance team to analyze financial data and provide insights to improve business performance.',
  },
  {
    id: 3,
    company: 'Health Partners',
    title: 'Data Scientist',
    duration: '4 months',
    date: '2023-06-01',
    location: 'Cairo, Egypt',
    industry: 'Healthcare',
    isPaid: true,
    salary: 'EGP 7000/month',
    logo: '/logos/microsoft.png',
    description: 'Join our data science team to analyze healthcare data and develop predictive models. You will work with large datasets and apply machine learning techniques to extract insights that can improve patient care.',
  },
  {
    id: 4,
    company: 'EduTech Academy',
    title: 'Content Developer',
    duration: '2 months',
    date: '2023-05-20',
    location: 'Remote',
    industry: 'Education',
    isPaid: false,
    salary: 'Unpaid',
    logo: '/logos/amazon.png',
    description: 'Create engaging educational content for our online learning platform. You will work with our curriculum team to develop course materials, quizzes, and interactive exercises for students.',
  },
  {
    id: 5,
    company: 'AutoMech Industries',
    title: 'Mechanical Engineering Intern',
    duration: '3 months',
    date: '2023-06-15',
    location: 'Giza, Egypt',
    industry: 'Manufacturing',
    isPaid: true,
    salary: 'EGP 4500/month',
    logo: '/logos/tesla.png',
    description: 'Work with our engineering team on product design and development. You will participate in the entire product lifecycle from concept to manufacturing.',
  }
];

// Dashboard tabs type
type DashboardTab = 'companies' | 'students' | 'reports' | 'settings' | 'evaluations' | 'internships';

export default function SCADDashboardPage() {
  // State for tab navigation
  const [activeTab, setActiveTab] = useState<DashboardTab>('companies');
  
  // Companies states
  const [companies, setCompanies] = useState<Company[]>([]);
  const [companySearchTerm, setCompanySearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showCompanyDetails, setShowCompanyDetails] = useState(false);

  // Students states
  const [students, setStudents] = useState<Student[]>([]);
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [selectedInternshipStatus, setSelectedInternshipStatus] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showStudentDetails, setShowStudentDetails] = useState(false);

  // Reports states
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
  
  // Internships states
  const [internships, setInternships] = useState<Internship[]>([]);
  const [internshipSearchTerm, setInternshipSearchTerm] = useState('');
  const [selectedInternshipIndustry, setSelectedInternshipIndustry] = useState('');
  const [selectedInternshipDuration, setSelectedInternshipDuration] = useState('');
  const [selectedInternshipPaid, setSelectedInternshipPaid] = useState('');
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  const [showInternshipDetails, setShowInternshipDetails] = useState(false);
  const [starredInternships, setStarredInternships] = useState<number[]>([]);
    // Settings states
  const [internshipCycleStart, setInternshipCycleStart] = useState('2023-09-01');
  const [internshipCycleEnd, setInternshipCycleEnd] = useState('2024-06-30');
  
  // Global notification state
  const { notification, visible, showNotification, hideNotification } = useNotification();

  // Load mock data
  useEffect(() => {
    setCompanies(mockCompanies);
    setStudents(mockStudents);
    setReports(mockReports);
    setEvaluations(mockEvaluations);
    setInternships(mockInternships);
  }, []);
  
  // COMPANIES SECTION HANDLERS
  const handleCompanySearch = (term: string) => {
    setCompanySearchTerm(term);
  };

  const handleIndustryChange = (filterType: string, value: string) => {
    setSelectedIndustry(value);
  };

  const handleViewCompanyDetails = (company: Company) => {
    setSelectedCompany(company);
    setShowCompanyDetails(true);
  };

  const handleCloseCompanyDetails = () => {
    setShowCompanyDetails(false);
    setSelectedCompany(null);
  };
  const handleAccept = (id: number) => {
    const company = companies.find(company => company.id === id);
    setCompanies(companies.map((company: Company) => 
      company.id === id ? { ...company, status: 'accepted' } : company
    ));
    setShowCompanyDetails(false);
      // Show success notification
    if (company) {
      showNotification({
        message: `${company.name} has been accepted successfully.`,
        type: 'success'
      });
    }
  };

  const handleReject = (id: number) => {
    const company = companies.find(company => company.id === id);
    setCompanies(companies.map((company: Company) => 
      company.id === id ? { ...company, status: 'rejected' } : company
    ));
    setShowCompanyDetails(false);
      // Show info notification
    if (company) {
      showNotification({
        message: `${company.name} has been rejected.`,
        type: 'info'
      });
    }
  };

  // Filter companies
  const filteredCompanies = companies.filter((company: Company) => {
    const matchesSearch = company.name.toLowerCase().includes(companySearchTerm.toLowerCase());
    const matchesIndustry = selectedIndustry === '' || company.industry === selectedIndustry;
    return matchesSearch && matchesIndustry;
  });

  // STUDENTS SECTION HANDLERS
  const handleStudentSearch = (term: string) => {
    setStudentSearchTerm(term);
  };

  const handleInternshipStatusChange = (filterType: string, value: string) => {
    setSelectedInternshipStatus(value.toLowerCase());
  };

  const handleViewStudentDetails = (student: Student) => {
    setSelectedStudent(student);
    setShowStudentDetails(true);
  };

  const handleCloseStudentDetails = () => {
    setShowStudentDetails(false);
    setSelectedStudent(null);
  };

  // Filter students
  const filteredStudents: Student[] = students.filter((student: Student) => {
    const matchesSearch: boolean = student.name.toLowerCase().includes(studentSearchTerm.toLowerCase()) || 
                                   student.email.toLowerCase().includes(studentSearchTerm.toLowerCase());
    const matchesStatus: boolean = selectedInternshipStatus === '' || student.internshipStatus === selectedInternshipStatus;
    return matchesSearch && matchesStatus;
  });

  // REPORTS SECTION HANDLERS
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
  };
    const handleUpdateEvaluation = (id: number, score: number, comments: string) => {
    // In a real app, you would call an API here
    const evaluation = evaluations.find(evaluation => evaluation.id === id);
    setEvaluations(evaluations.map(evaluation => 
      evaluation.id === id ? { ...evaluation, evaluationScore: score } : evaluation
    ));
    
    // Close the modal or keep it open with updated data
    setSelectedEvaluation(prev => prev ? { ...prev, evaluationScore: score } : null);
    
    // Show success notification
    if (evaluation) {      showNotification({
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
    if (evaluation) {      showNotification({
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

  // INTERNSHIPS SECTION HANDLERS
  const handleInternshipSearch = (term: string) => {
    setInternshipSearchTerm(term);
  };

  const handleInternshipIndustryChange = (filterType: string, value: string) => {
    setSelectedInternshipIndustry(value);
  };

  const handleInternshipDurationChange = (filterType: string, value: string) => {
    setSelectedInternshipDuration(value);
  };

  const handleInternshipPaidChange = (filterType: string, value: string) => {
    setSelectedInternshipPaid(value);
  };

  const handleViewInternshipDetails = (internship: Internship) => {
    setSelectedInternship(internship);
    setShowInternshipDetails(true);
  };

  const handleCloseInternshipDetails = () => {
    setShowInternshipDetails(false);
    setSelectedInternship(null);
  };

  const handleStarInternship = (id: number) => {
    setStarredInternships(prev => 
      prev.includes(id) ? prev.filter(starId => starId !== id) : [...prev, id]
    );
  };

  // Filter internships
  const filteredInternships = internships.filter((internship: Internship) => {
    const matchesSearch = internship.title.toLowerCase().includes(internshipSearchTerm.toLowerCase()) ||
                          internship.company.toLowerCase().includes(internshipSearchTerm.toLowerCase());
    const matchesIndustry = selectedInternshipIndustry === '' || internship.industry === selectedInternshipIndustry;
    const matchesDuration = selectedInternshipDuration === '' || internship.duration === selectedInternshipDuration;
    const matchesPaid = selectedInternshipPaid === '' || (selectedInternshipPaid === 'true' ? internship.isPaid : !internship.isPaid);
    return matchesSearch && matchesIndustry && matchesDuration && matchesPaid;
  });

  // Get unique majors for filter
  const majors = Array.from(new Set(evaluations.map((evaluation: Evaluation) => evaluation.major)));

  // Calculate counters
  const pendingCompanyCount = companies.filter((company: Company) => company.status === 'pending').length;
  const activeInternshipCount = students.filter((student: Student) => student.internshipStatus === 'in progress').length;
  const pendingReportsCount = reports.filter((report: any) => report.status === 'pending').length;
  const completedEvaluationsCount = evaluations.filter((evaluation: Evaluation) => evaluation.status === 'completed').length;
  const activeInternshipsCount = internships.filter((internship: Internship) => internship.isPaid).length;

  // Prepare filters for sidebars
  const companyFilters = [
    {
      title: "Industry",
      options: ['', ...industryOptions],
      type: "industry",
      value: selectedIndustry
    }
  ];

  const studentFilters = [
    {
      title: "Internship Status",
      options: ['', 'Not Started', 'In Progress', 'Completed', 'Not Applicable'],
      type: "status",
      value: selectedInternshipStatus ? selectedInternshipStatus.charAt(0).toUpperCase() + selectedInternshipStatus.slice(1) : ''
    }
  ];

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

  const internshipFilters = [
    {
      title: "Industry",
      options: ['', ...industryOptions],
      type: "industry",
      value: selectedInternshipIndustry
    },
    {
      title: "Duration",
      options: ['', '1 month', '2 months', '3 months', '4 months', '6 months'],
      type: "duration",
      value: selectedInternshipDuration
    },
    {
      title: "Paid",
      options: ['', 'Yes', 'No'],
      type: "paid",
      value: selectedInternshipPaid
    }
  ];
  function handleSaveInternshipCycle(): void {
    // In a real application, this would involve an API call to save the internship cycle dates
    console.log('Internship cycle saved:', {
      startDate: internshipCycleStart,
      endDate: internshipCycleEnd,
    });
    
    // Show success notification instead of alert    showNotification({
      message: 'Internship cycle dates have been saved successfully!',
      type: 'success'
    });
  }

  return (
    <div className={styles.pageContainer}>
      <Navigation title="SCAD Dashboard" />
      
      {/* Tab Navigation */}
      <div className={styles.tabNavigation}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'companies' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('companies')}
        >
          Companies <span className={styles.tabCount}>{pendingCompanyCount}</span>
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'students' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('students')}
        >
          Students <span className={styles.tabCount}>{activeInternshipCount}</span>
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'reports' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          Reports <span className={styles.tabCount}>{pendingReportsCount}</span>
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'evaluations' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('evaluations')}
        >
          Evaluations <span className={styles.tabCount}>{completedEvaluationsCount}</span>
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'internships' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('internships')}
        >
          Internships <span className={styles.tabCount}>{activeInternshipsCount}</span>
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'settings' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>
      
      <div className={styles.contentWrapper}>
        {/* COMPANIES TAB */}
        {activeTab === 'companies' && (
          <>
            <FilterSidebar 
              filters={companyFilters}
              onFilterChange={handleIndustryChange}
            />
            <div className={styles.mainContent}>
              <div className={styles.companyListings}>
                <div className={styles.listingHeader}>
                  <h1 className={styles.listingTitle}>Company Applications</h1>
                  <span className={styles.companyCount}>
                    {pendingCompanyCount} pending applications
                  </span>
                </div>
                <div className={styles.filterControls}>
                  <SearchBar
                    searchTerm={companySearchTerm}
                    setSearchTerm={handleCompanySearch}
                    placeholder="Search companies..."
                  />
                </div>
                {filteredCompanies.length > 0 ? (
                  <div className={styles.cards}>
                    {filteredCompanies.map(company => (
                      <CompanyCard
                        key={company.id}
                        name={company.name}
                        industry={company.industry}
                        applicationDate={company.applicationDate}
                        status={company.status}
                        onViewDetails={() => handleViewCompanyDetails(company)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className={styles.noResults}>
                    <div className={styles.noResultsIcon}>🔍</div>
                    <p>No companies found matching your criteria.</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* STUDENTS TAB */}
        {activeTab === 'students' && (
          <>
            <FilterSidebar 
              filters={studentFilters}
              onFilterChange={handleInternshipStatusChange}
            />
            <div className={styles.mainContent}>
              <div className={styles.studentListings}>
                <div className={styles.listingHeader}>
                  <h1 className={styles.listingTitle}>Students</h1>
                  <span className={styles.studentCount}>
                    {activeInternshipCount} active internships
                  </span>
                </div>
                <div className={styles.filterControls}>
                  <SearchBar
                    searchTerm={studentSearchTerm}
                    setSearchTerm={handleStudentSearch}
                    placeholder="Search students by name or email..."
                  />
                </div>
                {filteredStudents.length > 0 ? (
                  <div className={styles.cards}>
                    {filteredStudents.map(student => (
                      <StudentCard
                        key={student.id}
                        name={student.name}
                        email={student.email}
                        major={student.major}
                        gpa={student.gpa}
                        internshipStatus={student.internshipStatus}
                        academicYear={student.academicYear}
                        companyName={student.companyName}
                        onViewProfile={() => handleViewStudentDetails(student)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className={styles.noResults}>
                    <div className={styles.noResultsIcon}>🔍</div>
                    <p>No students found matching your criteria.</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* REPORTS TAB */}
        {activeTab === 'reports' && (
          <>
            <FilterSidebar 
              filters={reportFilters}
              onFilterChange={handleReportStatusChange}
            />
            <div className={styles.mainContent}>
              <div className={styles.reportListings}>
                <div className={styles.listingHeader}>
                  <h1 className={styles.listingTitle}>Internship Reports</h1>
                  <span className={styles.reportCount}>
                    {pendingReportsCount} pending reviews
                  </span>
                </div>
                <div className={styles.filterControls}>
                  <SearchBar
                    searchTerm={reportSearchTerm}
                    setSearchTerm={handleReportSearch}
                    placeholder="Search reports by title or student name..."
                  />
                </div>
                <ReportTable
                  reports={filteredReports}
                  onViewReport={handleViewReportDetails}
                />
              </div>
            </div>
          </>
        )}

        {/* EVALUATIONS TAB */}
        {activeTab === 'evaluations' && (
          <>
            <FilterSidebar 
              filters={evaluationFilters}
              onFilterChange={handleEvaluationFilterChange}
            />
            <div className={styles.mainContent}>
              <div className={styles.evaluationListings}>
                <div className={styles.listingHeader}>
                  <h1 className={styles.listingTitle}>Internship Evaluations</h1>
                  <span className={styles.evaluationCount}>
                    {completedEvaluationsCount} completed evaluations
                  </span>
                </div>
                <div className={styles.filterControls}>
                  <SearchBar
                    searchTerm={evaluationSearchTerm}
                    setSearchTerm={handleEvaluationSearch}
                    placeholder="Search evaluations by student or company..."
                  />
                </div>
                {filteredEvaluations.length > 0 ? (
                  <div className={styles.cards}>
                    {filteredEvaluations.map((evaluation: Evaluation) => (
                      <EvaluationCard
                        key={evaluation.id}
                        evaluation={evaluation}
                        onViewDetails={() => handleViewEvaluationDetails(evaluation)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className={styles.noResults}>
                    <div className={styles.noResultsIcon}>🔍</div>
                    <p>No evaluations found matching your criteria.</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* INTERNSHIPS TAB */}
        {activeTab === 'internships' && (
          <>
            <FilterSidebar 
              filters={internshipFilters}
              onFilterChange={(filterType, value) => {
                if (filterType === 'industry') {
                  handleInternshipIndustryChange(filterType, value);
                } else if (filterType === 'duration') {
                  handleInternshipDurationChange(filterType, value);
                } else if (filterType === 'paid') {
                  handleInternshipPaidChange(filterType, value);
                }
              }}
            />
            <div className={styles.mainContent}>
              <div className={styles.internshipListings}>
                <div className={styles.listingHeader}>
                  <h1 className={styles.listingTitle}>Internships</h1>
                  <span className={styles.internshipCount}>
                    {activeInternshipsCount} active internships
                  </span>
                </div>
                <div className={styles.filterControls}>
                  <SearchBar
                    searchTerm={internshipSearchTerm}
                    setSearchTerm={handleInternshipSearch}
                    placeholder="Search internships by title or company..."
                  />
                </div>
                {filteredInternships.length > 0 ? (
                  <div className={styles.cards}>
                    {filteredInternships.map(internship => (
                      <InternshipCard
                        key={internship.id}
                        internship={internship}
                        isStarred={starredInternships.includes(internship.id)}
                        onToggleStar={() => handleStarInternship(internship.id)}
                        onViewDetails={() => handleViewInternshipDetails(internship)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className={styles.noResults}>
                    <div className={styles.noResultsIcon}>🔍</div>
                    <p>No internships found matching your criteria.</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <SettingsCard
            cycleName="2023-2024 Academic Year"
            startDate={internshipCycleStart}
            endDate={internshipCycleEnd}
            onStartDateChange={setInternshipCycleStart}
            onEndDateChange={setInternshipCycleEnd}
            onSave={handleSaveInternshipCycle}
          />
        )}
      </div>
      
      {/* MODALS */}
      {showCompanyDetails && selectedCompany && (
        <CompanyDetailsModal
          name={selectedCompany.name}
          industry={selectedCompany.industry}
          description={selectedCompany.description}
          contactPerson={selectedCompany.contactPerson}
          email={selectedCompany.email}
          phone={selectedCompany.phone}
          applicationDate={selectedCompany.applicationDate}
          status={selectedCompany.status}
          onClose={handleCloseCompanyDetails}
          onAccept={() => handleAccept(selectedCompany.id)}
          onReject={() => handleReject(selectedCompany.id)}
        />
      )}
      {showStudentDetails && selectedStudent && (
        <StudentDetailsModal
          name={selectedStudent.name}
          email={selectedStudent.email}
          major={selectedStudent.major}
          academicYear={selectedStudent.academicYear}
          gpa={selectedStudent.gpa}
          internshipStatus={selectedStudent.internshipStatus}
          companyName={selectedStudent.companyName}
          internshipStartDate={selectedStudent.internshipStartDate}
          internshipEndDate={selectedStudent.internshipEndDate}
          reports={reports.filter(r => r.studentId === selectedStudent.id).map(r => ({
            id: r.id,
            title: r.title,
            status: r.status,
            submissionDate: r.submissionDate,
            onView: () => {
              handleCloseStudentDetails();
              handleViewReportDetails(r);
            }
          }))}
          onClose={handleCloseStudentDetails}
        />
      )}
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
          onClose={handleCloseReportDetails}
          onAccept={() => handleUpdateReportStatus(selectedReport.id, 'accepted')}
          onFlag={() => handleUpdateReportStatus(selectedReport.id, 'flagged')}
          onReject={() => handleUpdateReportStatus(selectedReport.id, 'rejected')}
        />
      )}
      {showEvaluationDetails && selectedEvaluation && (
        <EvaluationDetails
          evaluation={selectedEvaluation}
          onClose={handleCloseEvaluationDetails}
          onUpdate={handleUpdateEvaluation}
          onDelete={handleDeleteEvaluation}
        />
      )}
      {showInternshipDetails && selectedInternship && (        <InternshipDetailsModal
          internship={selectedInternship}
          onClose={handleCloseInternshipDetails}
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
}