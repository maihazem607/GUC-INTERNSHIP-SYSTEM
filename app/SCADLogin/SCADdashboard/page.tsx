'use client';
import { useState, useEffect } from 'react';
import styles from './SCADpage.module.css';
import NavigationMenu, { MenuItem } from "../../../src/components/global/NavigationMenu";
import { useRouter, useSearchParams } from 'next/navigation';
import FilterSidebar from "../../../src/components/global/FilterSidebar";
import SearchBar from "../../../src/components/global/SearchBar";
import CompanyApplicationCard from "../../../src/components/SCAD/CompanyApplicationCard";
import CompanyApplicationModal from "../../../src/components/SCAD/CompanyApplicationModal";
import StudentCard from "../../../src/components/SCAD/StudentCard";
import ReportTable from "../../../src/components/SCAD/ReportList";
import SettingsCard from "../../../src/components/SCAD/SettingsCard";
import StudentDetailsModal from "../../../src/components/SCAD/StudentDetailsModal";
import ReportDetailsModal from "../../../src/components/SCAD/ReportDetailsModal";
import EvaluationCard, { Evaluation } from "../../../src/components/SCAD/EvaluationList";
import EvaluationModalAdapter from "../../../src/components/SCAD/EvaluationModalAdapter";
import InternshipCard from "../../../src/components/internships/InternshipCard";
import InternshipDetailsModal from "../../../src/components/internships/InternshipDetailsModal";
import { Internship } from "../../../src/components/internships/types";
import NotificationSystem, { useNotification } from "../../../src/components/global/NotificationSystemAdapter";

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
import StatisticsSection, { StatisticsData } from "../../../src/components/SCAD/StatisticsSection";
import EvaluationTable from '../../../src/components/SCAD/EvaluationList';

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
  size: 'small' | 'medium' | 'large' | 'corporate';
  logo: string;
  documents: Array<{
    id: number;
    name: string;
    type: string;
    url: string;
  }>;
}

const mockCompanies: Company[] = [
  {
    id: 1,
    name: 'Google',
    industry: 'Technology',
    description: 'A leading multinational technology company specializing in Internet-related services and products, including search engine, cloud computing, software, and hardware.',
    contactPerson: 'Sundar Pichai',
    email: 'recruiting@google.com',
    phone: '+1 650-253-0000',
    applicationDate: '2023-05-15',
    status: 'pending',
    size: 'corporate',
    logo: '/logos/google.png',
    documents: [
      {
        id: 1,
        name: 'Business Certificate',
        type: 'PDF',
        url: '/documents/google-registration.pdf'
      },
      {
        id: 2,
        name: 'Tax Certificate',
        type: 'PDF',
        url: '/documents/google-tax-compliance.pdf'
      }
    ]
  },
  {
    id: 2,
    name: 'Microsoft',
    industry: 'Technology',
    description: 'A global technology corporation that develops, manufactures, licenses, supports, and sells computer software, consumer electronics, personal computers, and related services.',
    contactPerson: 'Satya Nadella',
    email: 'careers@microsoft.com',
    phone: '+1 425-882-8080',
    applicationDate: '2023-06-02',
    status: 'accepted',
    size: 'corporate',
    logo: '/logos/microsoft.png',
    documents: [
      {
        id: 3,
        name: 'Business Registration',
        type: 'PDF',
        url: '/documents/microsoft-registration.pdf'
      },
      {
        id: 4,
        name: 'Tax Documents',
        type: 'PDF',
        url: '/documents/microsoft-tax-docs.pdf'
      }
    ]
  },
  {
    id: 3,
    name: 'Amazon',
    industry: 'Technology',
    description: 'An American multinational technology company focusing on e-commerce, cloud computing, digital streaming, and artificial intelligence.',
    contactPerson: 'Andy Jassy',
    email: 'university-recruiting@amazon.com',
    phone: '+1 206-266-1000',
    applicationDate: '2023-06-10',
    status: 'pending',
    size: 'corporate',
    logo: '/logos/amazon.png',
    documents: [
      {
        id: 5,
        name: 'Business License',
        type: 'PDF',
        url: '/documents/amazon-license.pdf'
      },
      {
        id: 6,
        name: 'Corporate Structure',
        type: 'PDF',
        url: '/documents/amazon-structure.pdf'
      }
    ]
  },
  {
    id: 4,
    name: 'IBM',
    industry: 'Technology',
    description: 'International Business Machines Corporation is an American multinational technology corporation specializing in computer hardware, middleware, and software.',
    contactPerson: 'Arvind Krishna',
    email: 'campus@ibm.com',
    phone: '+1 914-499-1900',
    applicationDate: '2023-07-05',
    status: 'rejected',
    size: 'corporate',
    logo: '/logos/ibm.png',
    documents: [
      {
        id: 7,
        name: 'Company Registration',
        type: 'PDF',
        url: '/documents/ibm-registration.pdf'
      }
    ]
  },
  {
    id: 5,
    name: 'Apple',
    industry: 'Technology',
    description: 'An American multinational technology company that designs, develops, and sells consumer electronics, computer software, and online services.',
    contactPerson: 'Tim Cook',
    email: 'students@apple.com',
    phone: '+1 408-996-1010',
    applicationDate: '2023-07-12',
    status: 'pending',
    size: 'corporate',
    logo: '/logos/apple.png',
    documents: [
      {
        id: 8,
        name: 'Business Registration',
        type: 'PDF',
        url: '/documents/apple-registration.pdf'
      },
      {
        id: 9,
        name: 'Tax Documents',
        type: 'PDF',
        url: '/documents/apple-tax-docs.pdf'
      }
    ]
  },
  {
    id: 6,
    name: 'Tesla',
    industry: 'Automotive',
    description: 'An American electric vehicle and clean energy company that designs and manufactures electric cars, battery energy storage, solar panels and solar roof tiles.',
    contactPerson: 'Elon Musk',
    email: 'careers@tesla.com',
    phone: '+1 888-518-3752',
    applicationDate: '2023-08-03',
    status: 'accepted',
    size: 'large',
    logo: '/logos/tesla.png',
    documents: [
      {
        id: 10,
        name: 'Company Registration',
        type: 'PDF',
        url: '/documents/tesla-registration.pdf'
      }
    ]
  }
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
type ActiveMenuItem = 'companies' | 'students' | 'reports' | 'settings' | 'evaluations' | 'internships' | 'appointments' | 'statistics'|'workshops';

// Mock statistics data
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

export default function SCADDashboardPage() {
  // Router and search params for handling URL query parameters
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State for navigation - Get from URL or default to 'companies'
  const [activeItem, setActiveItem] = useState<ActiveMenuItem>(
    (searchParams.get('activeItem') as ActiveMenuItem) || 'companies'
  );
  
  // Update the URL when activeItem changes
  useEffect(() => {
    router.push(`/SCADLogin/SCADdashboard${activeItem !== 'companies' ? `?activeItem=${activeItem}` : ''}`);
  }, [activeItem, router]);

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
    const matchesSearch =
      company.name.toLowerCase().includes(companySearchTerm.toLowerCase()) ||
      company.description.toLowerCase().includes(companySearchTerm.toLowerCase()) ||
      company.industry.toLowerCase().includes(companySearchTerm.toLowerCase());
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

  // Adding missing student filter handler
  const handleStudentFilterChange = (filterType: string, value: string) => {
    if (filterType === 'status') {
      setSelectedInternshipStatus(value.toLowerCase());
    } else if (filterType === 'major') {
      // If major filtering is added in the future
      console.log('Major filtering not implemented yet');
    }
  };
  const handleViewStudentDetails = (student: Student) => {
    // Navigate to the StudentProfile page with the student ID as a query parameter
    router.push(`/SCADLogin/StudentProfile?id=${student.id}`);
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

  // Adding missing internship filter handler
  const handleInternshipFilterChange = (filterType: string, value: string) => {
    if (filterType === 'industry') {
      handleInternshipIndustryChange(filterType, value);
    } else if (filterType === 'duration') {
      handleInternshipDurationChange(filterType, value);
    } else if (filterType === 'paid') {
      handleInternshipPaidChange(filterType, value);
    }
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
  ];  function handleSaveInternshipCycle(): void {
    // In a real application, this would involve an API call to save the internship cycle dates
    console.log('Internship cycle saved:', {
      startDate: internshipCycleStart,
      endDate: internshipCycleEnd,
    });

    // Show success notification instead of alert    
    showNotification({
      message: 'Internship cycle dates have been saved successfully!',
      type: 'success'
    });
  }
  
  // Function to handle report generation from the statistics section
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
    <div className={styles.pageContainer}>      <NavigationMenu
        items={[
          { id: 'companies', label: 'Companies', icon: <Building size={18} />, onClick: () => setActiveItem('companies') },
          { id: 'students', label: 'Students', icon: <Users size={18} />, onClick: () => setActiveItem('students') },
          { id: 'reports', label: 'Reports', icon: <FileText size={18} />, onClick: () => setActiveItem('reports') },
          { id: 'evaluations', label: 'Evaluations', icon: <ClipboardCheck size={18} />, onClick: () => setActiveItem('evaluations') },
          { id: 'internships', label: 'Internships', icon: <Briefcase size={18} />, onClick: () => setActiveItem('internships') },
          { id: 'statistics', label: 'Statistics', icon: <BarChart2 size={18} />, onClick: () => setActiveItem('statistics') },
          { id:'Workshops', label: 'Workshops', icon: <BookOpen size={18} />, onClick:  () => { router.push('/SCADLogin/workshops?activeItem=workshops'); } },
          {
            id: 'appointments',
            label: 'Appointments',
            icon: <Calendar size={18} />,
            dropdownItems: [
              { id: 'my-appointments', label: 'My Appointments', onClick: () => { router.push('/SCADLogin/AppointmentsSCAD'); } },
              { id: 'requests', label: 'Requests', onClick: () => { router.push('/SCADLogin/AppointmentsSCAD?tab=requests'); } },
              { id: 'new-appointment', label: 'New Appointment', onClick: () => { router.push('/SCADLogin/AppointmentsSCAD?tab=new-appointment'); } }
            ]
          },
          { id: 'settings', label: 'Settings', icon: <Settings size={18} />, onClick: () => setActiveItem('settings') }
        ]}
        activeItemId={activeItem}
        logo={{
          src: '/logos/GUCInternshipSystemLogo.png',
          alt: 'GUC Internship System'
        }}
        variant="navigation"
      />      <div className={styles.contentWrapper}>
        {/* Filter Sidebar - shows filters based on active tab, hidden for settings and statistics */}
        {activeItem !== 'settings' && activeItem !== 'statistics' && (
          <FilterSidebar
            filters={
              activeItem === 'companies' ? companyFilters :
                activeItem === 'students' ? studentFilters :
                  activeItem === 'reports' ? reportFilters :
                    activeItem === 'evaluations' ? evaluationFilters :
                      activeItem === 'internships' ? internshipFilters :
                        []
            }
            onFilterChange={
              activeItem === 'companies' ? handleIndustryChange :
                activeItem === 'students' ? handleStudentFilterChange :
                  activeItem === 'reports' ? handleReportFilterChange :
                    activeItem === 'evaluations' ? handleEvaluationFilterChange :
                      activeItem === 'internships' ? handleInternshipFilterChange :
                        () => { }
            }
          />
        )}

        {/* Main Content */}
        <main className={`${styles.mainContent} ${(activeItem === 'settings' || activeItem === 'statistics') ? styles.fullWidth : ''}`}>
          {/* Current section title */}          <div className={styles.sectionTitle}>
            {activeItem === 'companies' && <h2>Companies</h2>}
            {activeItem === 'students' && <h2>Students</h2>}
            {activeItem === 'reports' && <h2>Reports</h2>}
            {activeItem === 'evaluations' && <h2>Evaluations</h2>}
            {activeItem === 'internships' && <h2>Internships</h2>}
            {activeItem === 'statistics' && <h2>Statistics</h2>}
            {activeItem === 'settings' && <h2>Settings</h2>}
          </div>

          {/* COMPANIES TAB */}
          {activeItem === 'companies' && (
            <>
              {/* Search Bar */}
              <SearchBar
                searchTerm={companySearchTerm}
                setSearchTerm={handleCompanySearch}
                placeholder="Search by company name, description or industry..."
              />

              {/* Company Listings */}
              <div className={styles.listings}>
                <div className={styles.listingHeader}>
                  <div className={styles.titleSection}>
                    <h1 className={styles.listingTitle}>Company Applications</h1>
                    <div className={styles.statusCounts}>
                      <span className={`${styles.statusBadge} ${styles.pending}`}>
                        {companies.filter(c => c.status === 'pending').length} Pending
                      </span>
                      <span className={`${styles.statusBadge} ${styles.accepted}`}>
                        {companies.filter(c => c.status === 'accepted').length} Accepted
                      </span>
                      <span className={`${styles.statusBadge} ${styles.rejected}`}>
                        {companies.filter(c => c.status === 'rejected').length} Rejected
                      </span>
                    </div>
                  </div>
                </div>
                {filteredCompanies.length > 0 ? (
                  <div className={styles.cards}>
                    {filteredCompanies.map(company => (
                      <CompanyApplicationCard
                        key={company.id}
                        company={company}
                        onViewDetails={() => handleViewCompanyDetails(company)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className={styles.noResults}>
                    <Search size={48} className={styles.noResultsIcon} />
                    <p>No companies found matching your criteria.</p>
                  </div>
                )}
              </div>
            </>
          )}
          {/* STUDENTS TAB */}
          {activeItem === 'students' && (
            <>
              {/* Search Bar */}
              <SearchBar
                searchTerm={studentSearchTerm}
                setSearchTerm={handleStudentSearch}
                placeholder="Search students by name or email..."
              />

              {/* Student Listings */}              <div className={styles.listings}>
                <div className={styles.listingHeader}>
                  <h1 className={styles.listingTitle}>Students</h1>
                  <span className={styles.studentCount}>
                    {activeInternshipCount} active internships
                  </span>
                </div>                {filteredStudents.length > 0 ? (
                  <div className={styles.studentList}>
                    <table className={styles.studentsTable}>
                      <tbody>
                        {filteredStudents.map(student => (
                          <tr
                            key={student.id}
                            className={styles.studentRow}
                            onClick={() => handleViewStudentDetails(student)}
                          >
                            {/* Student Name and Email Column */}
                            <td>
                              <div className={styles.studentProfile}>
                                <div className={styles.studentAvatar}>
                                  {student.name.charAt(0)}
                                </div>
                                <div className={styles.studentInfo}>
                                  <div className={styles.studentName}>{student.name}</div>
                                  <div className={styles.studentAge}>{student.email}</div>
                                </div>
                              </div>
                            </td>
                            
                            {/* Major Column */}
                            <td>
                              <div className={styles.tagContainer}>
                                <span className={styles.tag}>{student.major}</span>
                              </div>
                            </td>
                            
                            {/* GPA Column */}
                            <td>
                              <div className={styles.majorCell}>
                                {student.gpa} GPA
                              </div>
                            </td>
                            
                            {/* Internship Status Column */}
                            <td>
                              <div className={styles.tagContainer}>
                                <span className={`${styles.statusBadge} ${styles[student.internshipStatus.toLowerCase()]}`}>
                                  {student.internshipStatus.toUpperCase()}
                                </span>
                              </div>
                            </td>
                            
                            {/* Details Button Column */}
                            <td>
                              <button 
                                className={styles.detailsButton}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewStudentDetails(student);
                                }}
                              >
                                Details
                              </button>
                            </td>                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className={styles.noResults}>
                    <Search size={48} className={styles.noResultsIcon} />
                    <p>No students found matching your criteria.</p>
                  </div>
                )}
              </div>
            </>
          )}

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
                </div>
                <ReportTable
                  reports={filteredReports}
                  onViewReport={handleViewReportDetails}
                />
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
                  <span className={styles.evaluationCount}>
                    {completedEvaluationsCount} completed evaluations
                  </span>
                </div>
                {filteredEvaluations.length > 0 ? (
                  <EvaluationTable
                    evaluations={filteredEvaluations}
                    onViewDetails={(evaluation) => handleViewEvaluationDetails(evaluation)}
                  />
                ) : (
                  <div className={styles.noResults}>
                    <Search size={48} className={styles.noResultsIcon} />
                    <p>No evaluations found matching your criteria.</p>
                  </div>
                )}
              </div>
            </>
          )}
                  {/* INTERNSHIPS TAB */}
          {activeItem === 'internships' && (
            <>
              {/* Search Bar */}
              <SearchBar
                searchTerm={internshipSearchTerm}
                setSearchTerm={handleInternshipSearch}
                placeholder="Search internships by title or company..."
              />
              {/* Internship Listings */}
              <div className={styles.listings}>
                <div className={styles.listingHeader}>
                  <h1 className={styles.listingTitle}>Internships</h1>
                  <span className={styles.internshipCount}>
                    {activeInternshipsCount} active internships
                  </span>
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
                    <Search size={48} className={styles.noResultsIcon} />
                    <p>No internships found matching your criteria.</p>
                  </div>
                )}
              </div>
            </>
          )}          {/* STATISTICS TAB */}
          {activeItem === 'statistics' && (
            <StatisticsSection 
              data={mockStatisticsData}
              onGenerateReport={handleGenerateStatisticsReport}
            />
          )}
          
          {/* SETTINGS TAB */}
          {activeItem === 'settings' && (
            <SettingsCard
              cycleName="2023-2024 Academic Year"
              startDate={internshipCycleStart}
              endDate={internshipCycleEnd}
              onStartDateChange={setInternshipCycleStart}
              onEndDateChange={setInternshipCycleEnd}
              onSave={handleSaveInternshipCycle} />
          )}
        </main>
      </div>

      {/* MODALS */}
      {showCompanyDetails && selectedCompany && (
        <CompanyApplicationModal
          company={selectedCompany}
          onClose={handleCloseCompanyDetails}
          onAccept={handleAccept}
          onReject={handleReject}
        />
      )}
      {showStudentDetails && selectedStudent && (
        <StudentDetailsModal
         // studentId={selectedStudent.id}
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
      )}      {showReportDetails && selectedReport && (
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
      {showInternshipDetails && selectedInternship && (
        <InternshipDetailsModal
          internship={selectedInternship}
          onClose={handleCloseInternshipDetails}
        />
      )}  
    </div>
  );
}