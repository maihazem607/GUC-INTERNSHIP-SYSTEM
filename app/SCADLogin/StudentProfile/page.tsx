'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from '../page.module.css';
import NavigationMenu from "@/components/global/NavigationMenu";
import { Building, Users, FileText, ClipboardCheck, Briefcase, BarChart2, Calendar, Settings, BookOpen, ArrowLeft, Calendar as CalendarIcon, Award, User } from 'lucide-react';
import Image from 'next/image';
import { 
  initialStudentProfile, 
  StudentProfile as StudentProfileType, 
  majors,
  Major,
  Experience,
  Activity
} from '@/components/StudentInfo/types';

// Student data type
interface Student {
  id: number;
  name: string;
  email: string;
  major: string;
  gpa: number;
  internshipStatus: string;
  academicYear: string;
  companyName?: string;
  internshipStartDate?: string;
  internshipEndDate?: string;
}

// Mock report type
interface Report {
  id: number;
  title: string;
  studentId: number;
  submissionDate: string;
  status: 'pending' | 'accepted' | 'rejected' | 'flagged';
}

// Mock evaluation type
interface Evaluation {
  id: number;
  studentId: number;
  companyName: string;
  evaluationDate: string;
  evaluationScore: number;
  status: string;
}

// Address data type
interface Address {
  country: string;
  city: string;
  postalCode: string;
}

export default function StudentProfilePage() {
  const params = useParams();
  const router = useRouter();
  const studentId = typeof params.id === 'string' ? parseInt(params.id) : null;
  
  const [student, setStudent] = useState<Student | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');
  
  // Mock data for demonstration - in a real app, fetch this from your API
  useEffect(() => {
    // Simulate API request
    setTimeout(() => {
      if (studentId) {
        // This is mock data - in a real app, you would fetch the student with the matching ID
        const mockStudents = [
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
        ] as Student[];

        // Find the student with the matching ID
        const foundStudent = mockStudents.find(s => s.id === studentId) || null;
        setStudent(foundStudent);

        // Mock reports for this student
        if (foundStudent) {
          setReports([
            {
              id: 1,
              title: 'First Month Progress Report',
              studentId: foundStudent.id,
              submissionDate: '2023-07-01',
              status: 'accepted'
            },
            {
              id: 2,
              title: 'Mid-term Progress Report',
              studentId: foundStudent.id,
              submissionDate: '2023-07-15',
              status: 'pending'
            }
          ]);

          // Mock evaluations for this student
          setEvaluations([
            {
              id: 1,
              studentId: foundStudent.id,
              companyName: foundStudent.companyName || 'Unknown Company',
              evaluationDate: '2023-07-20',
              evaluationScore: 4.5,
              status: 'completed'
            }
          ]);
        }
        
        setLoading(false);
      }
    }, 500); // Simulating a network delay
  }, [studentId]);
  // Handler for going back to the dashboard
  const handleBackToDashboard = () => {
    router.push('/SCADLogin/SCADdashboard?activeItem=students');
  };

  // Common navigation menu items
  const navigationMenuItems = [
    { id: 'companies', label: 'Companies', icon: <Building size={18} />, onClick: () => router.push('/SCADLogin/SCADdashboard?activeItem=companies') },
    { id: 'students', label: 'Students', icon: <Users size={18} />, onClick: () => router.push('/SCADLogin/SCADdashboard?activeItem=students') },
    { id: 'reports', label: 'Reports', icon: <FileText size={18} />, onClick: () => router.push('/SCADLogin/SCADdashboard?activeItem=reports') },
    { id: 'evaluations', label: 'Evaluations', icon: <ClipboardCheck size={18} />, onClick: () => router.push('/SCADLogin/SCADdashboard?activeItem=evaluations') },
    { id: 'internships', label: 'Internships', icon: <Briefcase size={18} />, onClick: () => router.push('/SCADLogin/SCADdashboard?activeItem=internships') },
    { id: 'statistics', label: 'Statistics', icon: <BarChart2 size={18} />, onClick: () => router.push('/SCADLogin/SCADdashboard?activeItem=statistics') },
    { id:'Workshops', label: 'Workshops', icon: <BookOpen size={18} />, onClick: () => router.push('/SCADLogin/workshops?activeItem=workshops') },
    {
      id: 'appointments',
      label: 'Appointments',
      icon: <Calendar size={18} />,
      dropdownItems: [
        { id: 'my-appointments', label: 'My Appointments', onClick: () => router.push('/SCADLogin/AppointmentsSCAD') },
        { id: 'requests', label: 'Requests', onClick: () => router.push('/SCADLogin/AppointmentsSCAD?tab=requests') },
        { id: 'new-appointment', label: 'New Appointment', onClick: () => router.push('/SCADLogin/AppointmentsSCAD?tab=new-appointment') }
      ]
    },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} />, onClick: () => router.push('/SCADLogin/SCADdashboard?activeItem=settings') }
  ];

  // If student ID is invalid or not provided
  if (!studentId) {
    return (
      <div className={styles.pageContainer}>
        <NavigationMenu
          items={[
            { id: 'companies', label: 'Companies', icon: <Building size={18} />, onClick: () => router.push('/SCADLogin/SCADdashboard?activeItem=companies') },
            { id: 'students', label: 'Students', icon: <Users size={18} />, onClick: () => router.push('/SCADLogin/SCADdashboard?activeItem=students') },
            { id: 'reports', label: 'Reports', icon: <FileText size={18} />, onClick: () => router.push('/SCADLogin/SCADdashboard?activeItem=reports') },
            { id: 'evaluations', label: 'Evaluations', icon: <ClipboardCheck size={18} />, onClick: () => router.push('/SCADLogin/SCADdashboard?activeItem=evaluations') },
            { id: 'internships', label: 'Internships', icon: <Briefcase size={18} />, onClick: () => router.push('/SCADLogin/SCADdashboard?activeItem=internships') },
            { id: 'statistics', label: 'Statistics', icon: <BarChart2 size={18} />, onClick: () => router.push('/SCADLogin/SCADdashboard?activeItem=statistics') },
            { id:'Workshops', label: 'Workshops', icon: <BookOpen size={18} />, onClick: () => router.push('/SCADLogin/workshops?activeItem=workshops') },
            {
              id: 'appointments',
              label: 'Appointments',
              icon: <Calendar size={18} />,
              dropdownItems: [
                { id: 'my-appointments', label: 'My Appointments', onClick: () => router.push('/SCADLogin/AppointmentsSCAD') },
                { id: 'requests', label: 'Requests', onClick: () => router.push('/SCADLogin/AppointmentsSCAD?tab=requests') },
                { id: 'new-appointment', label: 'New Appointment', onClick: () => router.push('/SCADLogin/AppointmentsSCAD?tab=new-appointment') }
              ]
            },
            { id: 'settings', label: 'Settings', icon: <Settings size={18} />, onClick: () => router.push('/SCADLogin/SCADdashboard?activeItem=settings') }
          ]}
          activeItemId='students'
          logo={{
            src: '/logos/GUCInternshipSystemLogo.png',
            alt: 'GUC Internship System'
          }}
          variant="navigation"
        />

        <div className={styles.contentWrapper}>
          <main className={styles.mainContent}>
            <div className={styles.errorContainer}>
              <h2>Invalid Student ID</h2>
              <p>We couldn't find the student you're looking for. The ID may be invalid.</p>
              <button className={styles.backButton} onClick={handleBackToDashboard}>
                Back to Student List
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading || !student) {
    return (
      <div className={styles.pageContainer}>
        <NavigationMenu
          items={[
            { id: 'companies', label: 'Companies', icon: <Building size={18} />, onClick: () => router.push('/SCADLogin/SCADdashboard?activeItem=companies') },
            { id: 'students', label: 'Students', icon: <Users size={18} />, onClick: () => router.push('/SCADLogin/SCADdashboard?activeItem=students') },
            { id: 'reports', label: 'Reports', icon: <FileText size={18} />, onClick: () => router.push('/SCADLogin/SCADdashboard?activeItem=reports') },
            { id: 'evaluations', label: 'Evaluations', icon: <ClipboardCheck size={18} />, onClick: () => router.push('/SCADLogin/SCADdashboard?activeItem=evaluations') },
            { id: 'internships', label: 'Internships', icon: <Briefcase size={18} />, onClick: () => router.push('/SCADLogin/SCADdashboard?activeItem=internships') },
            { id: 'statistics', label: 'Statistics', icon: <BarChart2 size={18} />, onClick: () => router.push('/SCADLogin/SCADdashboard?activeItem=statistics') },
            { id:'Workshops', label: 'Workshops', icon: <BookOpen size={18} />, onClick: () => router.push('/SCADLogin/workshops?activeItem=workshops') },
            {
              id: 'appointments',
              label: 'Appointments',
              icon: <Calendar size={18} />,
              dropdownItems: [
                { id: 'my-appointments', label: 'My Appointments', onClick: () => router.push('/SCADLogin/AppointmentsSCAD') },
                { id: 'requests', label: 'Requests', onClick: () => router.push('/SCADLogin/AppointmentsSCAD?tab=requests') },
                { id: 'new-appointment', label: 'New Appointment', onClick: () => router.push('/SCADLogin/AppointmentsSCAD?tab=new-appointment') }
              ]
            },
            { id: 'settings', label: 'Settings', icon: <Settings size={18} />, onClick: () => router.push('/SCADLogin/SCADdashboard?activeItem=settings') }
          ]}
          activeItemId='students'
          logo={{
            src: '/logos/GUCInternshipSystemLogo.png',
            alt: 'GUC Internship System'
          }}
          variant="navigation"
        />

        <div className={styles.contentWrapper}>
          <main className={styles.mainContent}>
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner}></div>
              <p>Loading student profile...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <NavigationMenu
        items={[
          { id: 'companies', label: 'Companies', icon: <Building size={18} />, onClick: () => router.push('/SCADLogin/SCADdashboard?activeItem=companies') },
          { id: 'students', label: 'Students', icon: <Users size={18} />, onClick: () => router.push('/SCADLogin/SCADdashboard?activeItem=students') },
          { id: 'reports', label: 'Reports', icon: <FileText size={18} />, onClick: () => router.push('/SCADLogin/SCADdashboard?activeItem=reports') },
          { id: 'evaluations', label: 'Evaluations', icon: <ClipboardCheck size={18} />, onClick: () => router.push('/SCADLogin/SCADdashboard?activeItem=evaluations') },
          { id: 'internships', label: 'Internships', icon: <Briefcase size={18} />, onClick: () => router.push('/SCADLogin/SCADdashboard?activeItem=internships') },
          { id: 'statistics', label: 'Statistics', icon: <BarChart2 size={18} />, onClick: () => router.push('/SCADLogin/SCADdashboard?activeItem=statistics') },
          { id:'Workshops', label: 'Workshops', icon: <BookOpen size={18} />, onClick: () => router.push('/SCADLogin/workshops?activeItem=workshops') },
          {
            id: 'appointments',
            label: 'Appointments',
            icon: <Calendar size={18} />,
            dropdownItems: [
              { id: 'my-appointments', label: 'My Appointments', onClick: () => router.push('/SCADLogin/AppointmentsSCAD') },
              { id: 'requests', label: 'Requests', onClick: () => router.push('/SCADLogin/AppointmentsSCAD?tab=requests') },
              { id: 'new-appointment', label: 'New Appointment', onClick: () => router.push('/SCADLogin/AppointmentsSCAD?tab=new-appointment') }
            ]
          },
          { id: 'settings', label: 'Settings', icon: <Settings size={18} />, onClick: () => router.push('/SCADLogin/SCADdashboard?activeItem=settings') }
        ]}
        activeItemId='students'
        logo={{
          src: '/logos/GUCInternshipSystemLogo.png',
          alt: 'GUC Internship System'
        }}
        variant="navigation"
      />

      <div className={styles.contentWrapper}>
        <main className={styles.mainContent}>
          <div className={styles.backNavigation}>
            <button className={styles.backButton} onClick={handleBackToDashboard}>
              <ArrowLeft size={18} className={styles.backIcon} /> Back to Student List
            </button>
          </div>
          
          {/* Student Profile Header */}
          <div className={styles.profileHeader}>
            <div className={styles.studentAvatarLarge}>
              {student.name.charAt(0)}
            </div>
            <div className={styles.profileInfo}>
              <h1>{student.name}</h1>
              <div className={styles.profileMeta}>
                <span className={styles.studentMajorTag}>{student.major}</span>
                <span className={styles.studentGpaTag}>{student.gpa} GPA</span>
                <span className={`${styles.statusBadge} ${styles[student.internshipStatus.replace(' ', '')]}`}>
                  {student.internshipStatus.toUpperCase()}
                </span>
              </div>
              <p className={styles.studentEmail}>{student.email}</p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className={styles.tabNavigation}>
            {/* <button 
              className={`${styles.tabButton} ${activeTab === 'info' ? styles.activeTab : ''}`} 
              onClick={() => setActiveTab('info')}
            >
              Student Information
            </button> */}
            {/* <button 
              className={`${styles.tabButton} ${activeTab === 'reports' ? styles.activeTab : ''}`} 
              onClick={() => setActiveTab('reports')}
            >
              Reports ({reports.length})
            </button> */}
            {/* <button 
              className={`${styles.tabButton} ${activeTab === 'evaluations' ? styles.activeTab : ''}`} 
              onClick={() => setActiveTab('evaluations')}
            >
              Evaluations ({evaluations.length})
            </button> */}
          </div>

          {/* Tab Content */}
          <div className={styles.tabContent}>
            {/* Student Information Tab */}
            {activeTab === 'info' && (
              <div className={styles.infoTab}>
                <div className={styles.infoSection}>
                  <h2>Academic Information</h2>
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <h3>Academic Year</h3>
                      <p>{student.academicYear}</p>
                    </div>
                    <div className={styles.infoItem}>
                      <h3>Major</h3>
                      <p>{student.major}</p>
                    </div>
                    <div className={styles.infoItem}>
                      <h3>GPA</h3>
                      <p>{student.gpa}</p>
                    </div>
                  </div>
                </div>

                <div className={styles.infoSection}>
                  <h2>Internship Status</h2>
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <h3>Status</h3>
                      <p className={`${styles.statusText} ${styles[student.internshipStatus.replace(' ', '')]}`}>
                        {student.internshipStatus.toUpperCase()}
                      </p>
                    </div>
                    {student.companyName && (
                      <>
                        <div className={styles.infoItem}>
                          <h3>Company</h3>
                          <p>{student.companyName}</p>
                        </div>
                        <div className={styles.infoItem}>
                          <h3>Start Date</h3>
                          <p>{student.internshipStartDate}</p>
                        </div>
                        <div className={styles.infoItem}>
                          <h3>End Date</h3>
                          <p>{student.internshipEndDate}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Additional info sections can be added here */}
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <div className={styles.reportsTab}>
                <h2>Submitted Reports</h2>
                {reports.length > 0 ? (
                  <div className={styles.reportsList}>
                    {reports.map(report => (
                      <div key={report.id} className={styles.reportCard}>
                        <div className={styles.reportHeader}>
                          <h3>{report.title}</h3>
                          <span className={`${styles.reportStatus} ${styles[report.status]}`}>
                            {report.status.toUpperCase()}
                          </span>
                        </div>
                        <p className={styles.reportMeta}>Submitted on: {report.submissionDate}</p>
                        <button 
                          className={styles.viewReportButton}
                          onClick={() => router.push(`/SCADLogin/SCADdashboard?activeItem=reports&report=${report.id}`)}
                        >
                          View Report
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={styles.noDataMessage}>No reports submitted yet.</p>
                )}
              </div>
            )}

            {/* Evaluations Tab */}
            {activeTab === 'evaluations' && (
              <div className={styles.evaluationsTab}>
                <h2>Performance Evaluations</h2>
                {evaluations.length > 0 ? (
                  <div className={styles.evaluationsList}>
                    {evaluations.map(evaluation => (
                      <div key={evaluation.id} className={styles.evaluationCard}>
                        <div className={styles.evaluationHeader}>
                          <h3>{evaluation.companyName} Evaluation</h3>
                          <div className={styles.evaluationScore}>
                            <span className={styles.scoreValue}>{evaluation.evaluationScore}</span>
                            <span className={styles.scoreMax}>/5</span>
                          </div>
                        </div>
                        <p className={styles.evaluationMeta}>Evaluated on: {evaluation.evaluationDate}</p>
                        <button 
                          className={styles.viewEvaluationButton}
                          onClick={() => router.push(`/SCADLogin/SCADdashboard?activeItem=evaluations&evaluation=${evaluation.id}`)}
                        >
                          View Full Evaluation
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={styles.noDataMessage}>No evaluations available yet.</p>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
