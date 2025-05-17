'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from './page.module.css';
import SCADNavigation from '../Navigation/SCADNavigation';
import { 
  initialStudentProfile, 
  StudentProfile as StudentProfileType, 
  majors,
  Major,
  Experience,
  Activity
} from '@/components/StudentInfo/types'; // Adjusted to use an alias for the correct path.
import Image from 'next/image';
import {
  Building,
  Users,
  FileText,
  Settings,
  ClipboardCheck,
  Briefcase,
  Calendar,
  BarChart2,
  BookOpen
} from 'lucide-react';

// Student data type from SCAD dashboard
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
  address?: {
    country: string;
    city: string;
    postalCode: string;
  };
  jobInterests?: string[];
  collegeActivities?: Activity[];
}

export default function StudentProfilePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const handleLogout = () => router.push('/');
  const handleNavChange = (itemId: string) => {
    router.push(`/SCADLogin/SCADdashboard${itemId !== 'companies' ? `?activeItem=${itemId}` : ''}`);
  };

  const studentId = searchParams.get('id') ? parseInt(searchParams.get('id')!, 10) : null;
  
  const [studentProfile, setStudentProfile] = useState<StudentProfileType>(initialStudentProfile);
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  // Fetch student data based on ID
  useEffect(() => {
    if (studentId === null) {
      setLoading(false);
      return;
    }
    
    // Simulate fetching student data - in a real app this would be an API call
    setTimeout(() => {
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
          internshipEndDate: '2023-08-31',
          address: {
            country: 'Egypt',
            city: 'Cairo, Maadi',
            postalCode: '11728'
          },
          jobInterests: ['Software Development', 'Mobile Applications', 'Artificial Intelligence', 'Cloud Computing', 'UI/UX Design'],
          collegeActivities: [
            {
              id: 'act-1-1',
              name: 'Google Developer Students Club (GDC)',
              role: 'Technical Team Leader',
              startDate: '2022-09-01',
              endDate: '',
              isCurrentlyActive: true,
              description: 'Leading a team of 5 developers in creating web and mobile applications for university events. Organizing technical workshops and hackathons.'
            },
            {
              id: 'act-1-2',
              name: 'Competitive Programming Team',
              role: 'Team Captain',
              startDate: '2022-03-15',
              endDate: '2023-05-20',
              isCurrentlyActive: false,
              description: 'Led a team that participated in ACM-ICPC and Google Code Jam competitions. Conducted training sessions for new members.'
            }
          ]
        },
        {
          id: 2,
          name: 'Mohammed Ali',
          email: 'mohammed.a@student.guc.edu',
          major: 'Electrical Engineering',
          gpa: 3.5,
          internshipStatus: 'not started',
          academicYear: 'Junior',
          address: {
            country: 'Egypt',
            city: 'Alexandria, Smouha',
            postalCode: '21615'
          },
          jobInterests: ['Electrical Circuit Design', 'Power Systems', 'Renewable Energy', 'Embedded Systems', 'Robotics'],
          collegeActivities: [
            {
              id: 'act-2-1',
              name: 'IEEE Student Branch',
              role: 'Vice President',
              startDate: '2023-01-10',
              endDate: '',
              isCurrentlyActive: true,
              description: 'Organizing technical workshops, seminars, and competitions for engineering students. Managing a team of 8 committee members.'
            },
            {
              id: 'act-2-2',
              name: 'Robotics Team',
              role: 'Technical Lead',
              startDate: '2021-09-15',
              endDate: '',
              isCurrentlyActive: true,
              description: 'Designing and programming robots for university competitions. Teaching new members about Arduino programming and sensor integration.'
            }
          ]
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
          internshipEndDate: '2023-04-15',
          address: {
            country: 'Egypt',
            city: 'New Cairo, 5th Settlement',
            postalCode: '11835'
          },
          jobInterests: ['Marketing', 'Finance', 'Investment Banking', 'Project Management', 'Business Analytics'],
          collegeActivities: [
            {
              id: 'act-3-1',
              name: 'Business Leaders Association',
              role: 'President',
              startDate: '2022-09-01',
              endDate: '',
              isCurrentlyActive: true,
              description: 'Leading university business club with over 100 members. Organizing networking events with industry professionals and career fairs.'
            },
            {
              id: 'act-3-2',
              name: 'MUN (Model United Nations)',
              role: 'Committee Chair',
              startDate: '2021-08-15',
              endDate: '2022-12-20',
              isCurrentlyActive: false,
              description: 'Chaired the Economic and Finance Committee. Organized international conferences with over 500 participants.'
            },
            {
              id: 'act-3-3',
              name: 'Student Entrepreneurship Society',
              role: 'Founding Member',
              startDate: '2021-02-10',
              endDate: '2023-06-01',
              isCurrentlyActive: false,
              description: 'Helped create a platform for student entrepreneurs to pitch ideas and receive mentorship from industry professionals.'
            }
          ]
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
          internshipEndDate: '2023-08-15',
          address: {
            country: 'Egypt',
            city: 'Giza, Dokki',
            postalCode: '12611'
          },
          jobInterests: ['Health Informatics', 'Data Science', 'Machine Learning', 'Bioinformatics', 'Web Development'],
          collegeActivities: [
            {
              id: 'act-4-1',
              name: 'AI Research Club',
              role: 'Research Lead',
              startDate: '2022-10-01',
              endDate: '',
              isCurrentlyActive: true,
              description: 'Leading research projects in machine learning for healthcare. Published two papers in student conferences on medical image processing.'
            },
            {
              id: 'act-4-2',
              name: 'Scientific Computing Society',
              role: 'Workshop Coordinator',
              startDate: '2021-11-15',
              endDate: '2023-03-20',
              isCurrentlyActive: false,
              description: 'Organized workshops on Python, R, and MATLAB for scientific computing applications. Created educational content for club members.'
            }
          ]
        },
        {
          id: 5,
          name: 'Fatima Zahra',
          email: 'fatima.z@student.guc.edu',
          major: 'Mechanical Engineering',
          gpa: 3.6,
          internshipStatus: 'not started',
          academicYear: 'Junior',
          address: {
            country: 'Egypt',
            city: '6th of October, Al Motamayez District',
            postalCode: '12573'
          },
          jobInterests: ['Automotive Engineering', 'Aerospace Design', 'Thermodynamics', 'HVAC Systems', 'Manufacturing'],
          collegeActivities: [
            {
              id: 'act-5-1',
              name: 'Formula GUC Racing Team',
              role: 'Aerodynamics Team Member',
              startDate: '2022-08-01',
              endDate: '',
              isCurrentlyActive: true,
              description: 'Designing and testing aerodynamic components for the university\'s Formula-style race car. Conducting wind tunnel simulations.'
            },
            {
              id: 'act-5-2',
              name: 'Women in Engineering',
              role: 'Outreach Coordinator',
              startDate: '2021-09-15',
              endDate: '',
              isCurrentlyActive: true,
              description: 'Organizing workshops and mentoring programs to encourage high school girls to pursue engineering careers. Partnering with local schools.'
            },
            {
              id: 'act-5-3',
              name: 'Sustainability Initiative',
              role: 'Project Manager',
              startDate: '2021-03-10',
              endDate: '2022-12-15',
              isCurrentlyActive: false,
              description: 'Led projects to improve campus sustainability, including a solar-powered charging station and water conservation systems.'
            }
          ]
        }
      ];
      
      const foundStudent = mockStudents.find(s => s.id === studentId) || null;
      setStudentData(foundStudent);
        if (foundStudent) {
        // Update the studentProfile with the found student's data
        const updatedProfile: StudentProfileType = {
          ...initialStudentProfile,
          name: foundStudent.name,
          email: foundStudent.email,
          gpa: foundStudent.gpa,
          major: majors.find(m => m.name === foundStudent.major) || undefined
        };
        
        // Add job interests if available
        if (foundStudent.jobInterests && foundStudent.jobInterests.length > 0) {
          updatedProfile.jobInterests = foundStudent.jobInterests;
        }
        
        // Add college activities if available
        if (foundStudent.collegeActivities && foundStudent.collegeActivities.length > 0) {
          updatedProfile.collegeActivities = foundStudent.collegeActivities;
        }
        
        setStudentProfile(updatedProfile);
        
        // Set address if available
        if (foundStudent.address) {
          setAddress(foundStudent.address);
        }
      }
      
      setLoading(false);
    }, 500);
  }, [studentId]);
  const [isEditing, setIsEditing] = useState<{
    personal: boolean;
    address: boolean;
    academic: boolean;
    jobInterests: boolean;
  }>({
    personal: false,
    address: false,
    academic: false,
    jobInterests: false
  });
  
  // Modal states for adding/editing experiences and activities
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [currentExperience, setCurrentExperience] = useState<Experience | null>(null);
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
  
  // Form states
  const [newJobInterest, setNewJobInterest] = useState('');
  const [experienceForm, setExperienceForm] = useState<Omit<Experience, 'id'>>({
    companyName: '',
    position: '',
    responsibilities: '',
    startDate: '',
    endDate: '',
    isCurrentlyWorking: false,
    isInternship: true
  });
  const [activityForm, setActivityForm] = useState<Omit<Activity, 'id'>>({
    name: '',
    description: '',
    role: '',
    startDate: '',
    endDate: '',
    isCurrentlyActive: false
  });
    // Address data - initially set default then update based on student data
  const [address, setAddress] = useState({
    country: 'Egypt',
    city: 'Cairo',
    postalCode: '11111'
  });

  const handleEditToggle = (section: keyof typeof isEditing) => {
    setIsEditing({
      ...isEditing,
      [section]: !isEditing[section]
    });
  };

  const handleProfileUpdate = (updatedProfile: Partial<StudentProfileType>) => {
    setStudentProfile({
      ...studentProfile,
      ...updatedProfile
    });
    setIsEditing({ personal: false, address: false, academic: false, jobInterests: false });
    // In a real application, you would save this to a database
    console.log('Profile updated:', updatedProfile);
  };

  const handleAddressUpdate = (updatedAddress: typeof address) => {
    setAddress(updatedAddress);
    setIsEditing({ ...isEditing, address: false });
  };
  
  const handleAddJobInterest = () => {
    if (newJobInterest.trim()) {
      handleProfileUpdate({
        jobInterests: [...studentProfile.jobInterests, newJobInterest.trim()]
      });
      setNewJobInterest('');
    }
  };
  
  const handleRemoveJobInterest = (index: number) => {
    const updatedInterests = [...studentProfile.jobInterests];
    updatedInterests.splice(index, 1);
    handleProfileUpdate({ jobInterests: updatedInterests });
  };
  
  const openExperienceModal = (experience?: Experience) => {
    if (experience) {
      setCurrentExperience(experience);
      setExperienceForm({
        companyName: experience.companyName,
        position: experience.position,
        responsibilities: experience.responsibilities,
        startDate: experience.startDate,
        endDate: experience.endDate,
        isCurrentlyWorking: experience.isCurrentlyWorking || false,
        isInternship: experience.isInternship
      });
    } else {
      setCurrentExperience(null);
      setExperienceForm({
        companyName: '',
        position: '',
        responsibilities: '',
        startDate: '',
        endDate: '',
        isCurrentlyWorking: false,
        isInternship: true
      });
    }
    setShowExperienceModal(true);
  };
  
  const openActivityModal = (activity?: Activity) => {
    if (activity) {
      setCurrentActivity(activity);
      setActivityForm({
        name: activity.name,
        description: activity.description,
        role: activity.role,
        startDate: activity.startDate,
        endDate: activity.endDate,
        isCurrentlyActive: activity.isCurrentlyActive || false
      });
    } else {
      setCurrentActivity(null);
      setActivityForm({
        name: '',
        description: '',
        role: '',
        startDate: '',
        endDate: '',
        isCurrentlyActive: false
      });
    }
    setShowActivityModal(true);
  };
  
  const handleExperienceSave = () => {
    const newExperience = {
      ...experienceForm,
      id: currentExperience?.id || `exp-${Date.now()}`
    };
    
    const updatedExperiences = currentExperience
      ? studentProfile.previousExperiences.map(exp => 
          exp.id === currentExperience.id ? newExperience : exp
        )
      : [...studentProfile.previousExperiences, newExperience];
    
    handleProfileUpdate({ previousExperiences: updatedExperiences });
    setShowExperienceModal(false);
  };
  
  const handleActivitySave = () => {
    const newActivity = {
      ...activityForm,
      id: currentActivity?.id || `act-${Date.now()}`
    };
    
    const updatedActivities = currentActivity
      ? studentProfile.collegeActivities.map(act => 
          act.id === currentActivity.id ? newActivity : act
        )
      : [...studentProfile.collegeActivities, newActivity];
    
    handleProfileUpdate({ collegeActivities: updatedActivities });
    setShowActivityModal(false);
  };
  
  const handleRemoveExperience = (id: string) => {
    const updatedExperiences = studentProfile.previousExperiences.filter(exp => exp.id !== id);
    handleProfileUpdate({ previousExperiences: updatedExperiences });
  };
  
  const handleRemoveActivity = (id: string) => {
    const updatedActivities = studentProfile.collegeActivities.filter(act => act.id !== id);
    handleProfileUpdate({ collegeActivities: updatedActivities });
  };
  
  // Display loading state
  if (loading) {
    return (
      <div className={styles.pageContainer}>        <SCADNavigation
          activeItem="students"
          onActiveItemChange={handleNavChange}
          onLogout={handleLogout}
        />
        <div className={styles.contentWrapper}>
          <div className={styles.mainContent}>
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner}></div>
              <p>Loading student profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Display error if student not found
  if (!studentData && studentId !== null) {
    return (
      <div className={styles.pageContainer}>        <SCADNavigation
          activeItem="students"
          onActiveItemChange={handleNavChange}
          onLogout={handleLogout}
        />
        <div className={styles.contentWrapper}>
          <div className={styles.mainContent}>
            <div className={styles.errorContainer}>
              <h2>Student Not Found</h2>
              <p>We couldn't find the student you're looking for. The ID may be invalid.</p>
              <button 
                className={styles.backButton}
                onClick={() => router.push('/SCADLogin/SCADdashboard?activeItem=students')}
              >
                Back to Student List
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>      <SCADNavigation
        activeItem="students"
        onActiveItemChange={handleNavChange}
        onLogout={handleLogout}
      />
      
      <div className={styles.contentWrapper}>
        <div className={styles.mainContent}>
          <section className={styles.myProfileSection}>
            <h1 className={styles.pageTitle}>Student Profile</h1>
            
            {/* Profile Header Card */}
            <div className={styles.profileCard}>
              <div className={styles.profileHeader}>
                <div className={styles.profileImageContainer}>
                  {studentProfile.profilePicture ? (
                    <img 
                      className={styles.profileImage} 
                      src={studentProfile.profilePicture} 
                      alt={studentProfile.name} 
                    />
                  ) : (
                    <div className={styles.profileImagePlaceholder}>
                      {studentProfile.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className={styles.profileHeaderInfo}>
                  <h2>{studentProfile.name}</h2>
                  <p className={styles.roleLabel}>
                    {studentProfile.major ? studentProfile.major.name : 'Student'}
                  </p>
                  <p className={styles.locationLabel}>
                    {address.city}, {address.country}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Personal Information Section */}
            <div className={styles.infoSection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Personal Information</h2>
                
              </div>
              
              {isEditing.personal ? (
                <div className={styles.editForm}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>First Name</label>
                      <input 
                        type="text" 
                        value={studentProfile.name.split(' ')[0]}
                        onChange={(e) => {
                          const lastName = studentProfile.name.includes(' ') ? 
                            studentProfile.name.split(' ').slice(1).join(' ') : '';
                          handleProfileUpdate({ name: `${e.target.value} ${lastName}` });
                        }}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Last Name</label>
                      <input 
                        type="text" 
                        value={studentProfile.name.includes(' ') ? 
                          studentProfile.name.split(' ').slice(1).join(' ') : ''}
                        onChange={(e) => {
                          const firstName = studentProfile.name.split(' ')[0];
                          handleProfileUpdate({ name: `${firstName} ${e.target.value}` });
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Date of Birth</label>
                      <input type="date" placeholder="Date of Birth" />
                    </div>
                  </div>
                  
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Email Address</label>
                      <input 
                        type="email" 
                        value={studentProfile.email}
                        onChange={(e) => setStudentProfile({...studentProfile, email: e.target.value})}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Phone Number</label>
                      <input 
                        type="tel" 
                        value={studentProfile.phone}
                        onChange={(e) => setStudentProfile({...studentProfile, phone: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>User Role</label>
                      <input type="text" value="Student" disabled />
                    </div>
                    <div className={styles.formGroup}>
                      <label>GPA</label>
                      <input 
                        type="number" 
                        min="0" 
                        max="4" 
                        step="0.01"
                        value={studentProfile.gpa}
                        onChange={(e) => setStudentProfile({...studentProfile, gpa: parseFloat(e.target.value)})}
                      />
                    </div>
                  </div>
                  
                  <div className={styles.formActions}>
                    <button 
                      onClick={() => handleEditToggle('personal')}
                      className={styles.cancelButton}
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => handleProfileUpdate(studentProfile)}
                      className={styles.saveButton}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>First Name</span>
                    <span className={styles.infoValue}>
                      {studentProfile.name.split(' ')[0]}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Last Name</span>
                    <span className={styles.infoValue}>
                      {studentProfile.name.includes(' ') ? 
                        studentProfile.name.split(' ').slice(1).join(' ') : ''}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Date of Birth</span>
                    <span className={styles.infoValue}>12-10-1990</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Email Address</span>
                    <span className={styles.infoValue}>{studentProfile.email}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Phone Number</span>
                    <span className={styles.infoValue}>{studentProfile.phone}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>User Role</span>
                    <span className={styles.infoValue}>Student</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>GPA</span>
                    <span className={styles.infoValue}>{studentProfile.gpa}</span>
                  </div>
                </div>
              )}
            </div>              {/* Address Section */}
            <div className={styles.infoSection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Address</h2>
              </div>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Country</span>
                  <span className={styles.infoValue}>{address.country}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>City</span>
                  <span className={styles.infoValue}>{address.city}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Postal Code</span>
                  <span className={styles.infoValue}>{address.postalCode}</span>
                </div>
              </div>
            </div>              {/* Academic Information Section */}
            <div className={styles.infoSection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Academic Information</h2>
                {/* <button 
                  onClick={() => handleEditToggle('academic')} 
                  className={styles.editButton}
                >
                  Edit
                </button> */}
              </div>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>University</span>
                  <span className={styles.infoValue}>German University in Cairo</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Faculty</span>
                  <span className={styles.infoValue}>{studentData?.major === "Computer Science" ? "Media Engineering & Technology" : studentData?.major === "Business Administration" ? "Management Technology" : "Engineering & Materials Science"}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Major</span>
                  <span className={styles.infoValue}>{studentProfile.major?.name || studentData?.major || "Not specified"}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Academic Year</span>
                  <span className={styles.infoValue}>{studentData?.academicYear || "Senior"}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Semester</span>
                  <span className={styles.infoValue}>8</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Expected Graduation</span>
                  <span className={styles.infoValue}>Summer 2025</span>
                </div>
              </div>
            </div>              {/* Job Interests Section */}
            <div className={styles.infoSection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Job Interests</h2>
                {/* <button 
                  onClick={() => handleEditToggle('jobInterests')} 
                  className={styles.editButton}
                >
                  Edit
                </button> */}
              </div>
              <div className={styles.tagContainer}>                {studentProfile.jobInterests.length > 0 ? (
                  studentProfile.jobInterests.map((interest, index) => (
                    <div key={index} className={styles.interestTag}>
                      <span>{interest}</span>
                    </div>
                  ))
                ) : (
                  <div className={styles.emptyState}>
                    <div className={styles.interestTag}><span>No job interests listed</span></div>
                  </div>
                )}
              </div>
            </div>              {/* Work Experience Section */}
            <div className={styles.infoSection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Work Experience</h2>
              </div>              {studentProfile.previousExperiences.length > 0 ? (
                <div className={styles.experienceList}>
                  {studentProfile.previousExperiences.map(exp => (
                    <div key={exp.id} className={styles.experienceCard}>
                      <div className={styles.experienceHeader}>
                        <h3>{exp.companyName}</h3>
                        <span className={styles.experienceType}>{exp.isInternship ? 'Internship' : 'Part-time'}</span>
                      </div>
                      <p className={styles.experiencePosition}>{exp.position}</p>
                      <p className={styles.experienceDuration}>
                        {exp.startDate} - {exp.isCurrentlyWorking ? 'Present' : exp.endDate}
                      </p>
                      <p className={styles.experienceDescription}>{exp.responsibilities}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.experienceList}>
                  {studentData?.internshipStatus ? (
                    <div className={styles.experienceCard}>
                      <div className={styles.experienceHeader}>
                        <h3>{studentData?.companyName || "Tech Solutions Inc."}</h3>
                        <span className={styles.experienceType}>Internship</span>
                      </div>
                      <p className={styles.experiencePosition}>{studentData?.major === "Computer Science" ? "Software Developer Intern" : 
                                                             studentData?.major === "Business Administration" ? "Business Analyst Intern" :
                                                             "Engineering Intern"}</p>
                      <p className={styles.experienceDuration}>
                        {studentData?.internshipStartDate || "June 2023"} - {studentData?.internshipStatus === "completed" ? 
                                                                           (studentData?.internshipEndDate || "August 2023") : 
                                                                           (studentData?.internshipStatus === "in progress" ? "Present" : "Not started")}
                      </p>
                      <p className={styles.experienceDescription}>
                        {studentData?.major === "Computer Science" ? 
                          "Contributed to the development of client-facing web applications using React, Node.js, and MongoDB. Worked in an agile team and participated in daily stand-ups and sprint planning." :
                         studentData?.major === "Business Administration" ?
                          "Analyzed financial data and created reports for stakeholders. Assisted in the development of business strategies and marketing campaigns." :
                          "Participated in the design and implementation of engineering solutions. Worked with a team of engineers to solve complex technical problems."
                        }
                      </p>
                    </div>
                  ) : (
                    <div className={styles.emptyState}>No work experience listed</div>
                  )}
                </div>
              )}
            </div>              {/* College Activities Section */}
            <div className={styles.infoSection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>College Activities</h2>
              </div>              {studentProfile.collegeActivities.length > 0 ? (
                <div className={styles.activityList}>
                  {studentProfile.collegeActivities.map(activity => (
                    <div key={activity.id} className={styles.activityCard}>
                      <div className={styles.activityHeader}>
                        <h3>{activity.name}</h3>
                        <span className={styles.activityRole}>{activity.role}</span>
                      </div>
                      <p className={styles.activityDuration}>
                        {activity.startDate} - {activity.isCurrentlyActive ? 'Present' : activity.endDate}
                      </p>
                      <p className={styles.activityDescription}>{activity.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>No college activities listed</div>
              )}
            </div>
          </section>
        </div>
      </div>
      
      {/* Experience Modal */}
      {showExperienceModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>{currentExperience ? 'Edit Experience' : 'Add New Experience'}</h2>
              <button 
                onClick={() => setShowExperienceModal(false)}
                className={styles.modalCloseButton}
              >
                ×
              </button>
            </div>
            <div className={styles.modalContent}>
              <div className={styles.formGroup}>
                <label>Company Name</label>
                <input 
                  type="text" 
                  value={experienceForm.companyName}
                  onChange={(e) => setExperienceForm({...experienceForm, companyName: e.target.value})}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Position</label>
                <input 
                  type="text" 
                  value={experienceForm.position}
                  onChange={(e) => setExperienceForm({...experienceForm, position: e.target.value})}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Type</label>
                <div className={styles.radioGroup}>
                  <label>
                    <input 
                      type="radio" 
                      checked={experienceForm.isInternship}
                      onChange={() => setExperienceForm({...experienceForm, isInternship: true})}
                    /> 
                    Internship
                  </label>
                  <label>
                    <input 
                      type="radio" 
                      checked={!experienceForm.isInternship}
                      onChange={() => setExperienceForm({...experienceForm, isInternship: false})}
                    /> 
                    Part-time Job
                  </label>
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Start Date</label>
                  <input 
                    type="date" 
                    value={experienceForm.startDate}
                    onChange={(e) => setExperienceForm({...experienceForm, startDate: e.target.value})}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>End Date</label>
                  <input 
                    type="date" 
                    value={experienceForm.endDate}
                    onChange={(e) => setExperienceForm({...experienceForm, endDate: e.target.value})}
                    disabled={experienceForm.isCurrentlyWorking}
                    required={!experienceForm.isCurrentlyWorking}
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input 
                    type="checkbox" 
                    checked={experienceForm.isCurrentlyWorking}
                    onChange={(e) => setExperienceForm({
                      ...experienceForm, 
                      isCurrentlyWorking: e.target.checked
                    })}
                  /> 
                  I currently work here
                </label>
              </div>
              <div className={styles.formGroup}>
                <label>Responsibilities</label>
                <textarea 
                  value={experienceForm.responsibilities}
                  onChange={(e) => setExperienceForm({...experienceForm, responsibilities: e.target.value})}
                  rows={4}
                  required
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button 
                onClick={() => setShowExperienceModal(false)}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button 
                onClick={handleExperienceSave}
                className={styles.saveButton}
                disabled={!experienceForm.companyName || !experienceForm.position || !experienceForm.startDate || (!experienceForm.endDate && !experienceForm.isCurrentlyWorking)}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Activity Modal */}
      {showActivityModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>{currentActivity ? 'Edit Activity' : 'Add New Activity'}</h2>
              <button 
                onClick={() => setShowActivityModal(false)}
                className={styles.modalCloseButton}
              >
                ×
              </button>
            </div>
            <div className={styles.modalContent}>
              <div className={styles.formGroup}>
                <label>Activity Name</label>
                <input 
                  type="text" 
                  value={activityForm.name}
                  onChange={(e) => setActivityForm({...activityForm, name: e.target.value})}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Role</label>
                <input 
                  type="text" 
                  value={activityForm.role}
                  onChange={(e) => setActivityForm({...activityForm, role: e.target.value})}
                  required
                />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Start Date</label>
                  <input 
                    type="date" 
                    value={activityForm.startDate}
                    onChange={(e) => setActivityForm({...activityForm, startDate: e.target.value})}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>End Date</label>
                  <input 
                    type="date" 
                    value={activityForm.endDate}
                    onChange={(e) => setActivityForm({...activityForm, endDate: e.target.value})}
                    disabled={activityForm.isCurrentlyActive}
                    required={!activityForm.isCurrentlyActive}
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input 
                    type="checkbox" 
                    checked={activityForm.isCurrentlyActive}
                    onChange={(e) => setActivityForm({
                      ...activityForm, 
                      isCurrentlyActive: e.target.checked
                    })}
                  /> 
                  I am currently involved in this activity
                </label>
              </div>
              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea 
                  value={activityForm.description}
                  onChange={(e) => setActivityForm({...activityForm, description: e.target.value})}
                  rows={4}
                  required
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button 
                onClick={() => setShowActivityModal(false)}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button 
                onClick={handleActivitySave}
                className={styles.saveButton}
                disabled={!activityForm.name || !activityForm.role || !activityForm.startDate || (!activityForm.endDate && !activityForm.isCurrentlyActive)}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}