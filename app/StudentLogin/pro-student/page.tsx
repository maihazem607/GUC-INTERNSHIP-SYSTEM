'use client';

import React, { useState } from 'react';
import { useEffect } from 'react';
import styles from './page.module.css';
import ProStudentNavigationMenu from './Navigation/ProStudentNavigationMenu';
import NotificationSystem, { useNotification } from "@/components/global/NotificationSystemAdapter";

import { 
  initialStudentProfile, 
  StudentProfile as StudentProfileType, 
  majors,
  Major,
  Experience,
  Activity
} from '@/components/StudentInfo/types';
import { Assessment } from '../../../src/components/Assessments/types';

import Image from 'next/image';

export default function StudentProfilePage() {
  const [studentProfile, setStudentProfile] = useState<StudentProfileType>(initialStudentProfile);
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
  
  // Mock assessment data for shared assessments
  const [sharedAssessments, setSharedAssessments] = useState<Assessment[]>([
    {
      id: 1,
      title: "JavaScript Essentials",
      description: "Test your understanding of JavaScript fundamentals including variables, functions, closures, and ES6+ features.",
      category: "Programming",
      difficulty: "Intermediate",
      duration: "45",
      questionCount: 20,
      skillsCovered: ["JavaScript", "ES6", "Functions", "Closures", "Asynchronous Programming"],
      company: "Google",
      companyLogo: "/logos/google.png",
      isCompleted: true,
      score: 17,
      totalPossibleScore: 20,
      isSharedOnProfile: true
    },
    {
      id: 3,
      title: "Data Structures & Algorithms",
      description: "Test your knowledge of common data structures and algorithms including arrays, linked lists, trees, and algorithmic complexity.",
      category: "Computer Science",
      difficulty: "Advanced",
      duration: "75",
      questionCount: 30,
      skillsCovered: ["Data Structures", "Algorithms", "Time Complexity", "Space Complexity", "Problem Solving"],
      company: "Microsoft",
      companyLogo: "/logos/microsoft.png",
      isCompleted: true,
      score: 22,
      totalPossibleScore: 30,
      isSharedOnProfile: true
    }
  ]);
  
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
  
  // Get notification functions
  const { showNotification, addNotification } = useNotification();
  
  // Show internship cycle notifications when the page loads
  useEffect(() => {
    // Set a timeout to simulate backend data fetch
    setTimeout(() => {
      // Current date is May 15, 2025
      const today = new Date();
      
      // Notification about current internship cycle
      showNotification({
        message: "The Summer 2025 Internship Cycle has officially begun! Browse and apply for opportunities now.",
        type: 'success'
      });
      
      // Add to the bell notifications panel for persistent access
      addNotification({
        title: "Internship Cycle Started",
        message: "The Summer 2025 Internship Cycle is now open for applications. Don't miss out on these opportunities!",
        type: 'system'
      });
      
      // Simulate a notification about the upcoming Fall cycle (future notification)
      setTimeout(() => {
        showNotification({
          message: "Fall 2025 Internship Cycle begins in 45 days. Update your profile to be ready!",
          type: 'info'
        });
        
        addNotification({
          title: "Upcoming Internship Cycle",
          message: "The Fall 2025 Internship Cycle will begin on July 1st, 2025. Make sure your profile is up to date.",
          type: 'system'
        });
      }, 5000); // Show this notification 5 seconds after the first one
    }, 1000);
  }, []);
  

  // Mock address data - we'll add this to our profile
  const [address, setAddress] = useState({
    country: 'United Kingdom',
    city: 'Leeds, East London',
    postalCode: 'ER1 1254'
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
  
  return (
    <div className={styles.pageContainer}>
      <ProStudentNavigationMenu />
      
      <div className={styles.contentWrapper}>
        <div className={styles.mainContent}>
          <section className={styles.myProfileSection}>
            <h1 className={styles.pageTitle}>My Profile</h1>
            
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
                <button 
                  onClick={() => handleEditToggle('personal')} 
                  className={styles.editButton}
                >
                  Edit
                </button>
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
            </div>
            
            {/* Address Section */}
            <div className={styles.infoSection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Address</h2>
                <button 
                  onClick={() => handleEditToggle('address')} 
                  className={styles.editButton}
                >
                  Edit
                </button>
              </div>
              
              {isEditing.address ? (
                <div className={styles.editForm}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Country</label>
                      <input 
                        type="text" 
                        value={address.country}
                        onChange={(e) => setAddress({...address, country: e.target.value})}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>City</label>
                      <input 
                        type="text" 
                        value={address.city}
                        onChange={(e) => setAddress({...address, city: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Postal Code</label>
                      <input 
                        type="text" 
                        value={address.postalCode}
                        onChange={(e) => setAddress({...address, postalCode: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className={styles.formActions}>
                    <button 
                      onClick={() => handleEditToggle('address')}
                      className={styles.cancelButton}
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => handleAddressUpdate(address)}
                      className={styles.saveButton}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
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
              )}
            </div>
            
            {/* Academic Information Section */}
            <div className={styles.infoSection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Academic Information</h2>
                <button 
                  onClick={() => handleEditToggle('academic')} 
                  className={styles.editButton}
                >
                  Edit
                </button>
              </div>
              
              {isEditing.academic ? (
                <div className={styles.editForm}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Major</label>
                      <select 
                        value={studentProfile.major?.id || ''}
                        onChange={(e) => {
                          const selectedMajor = majors.find(m => m.id === e.target.value);
                          setStudentProfile({...studentProfile, major: selectedMajor});
                        }}
                      >
                        <option value="">Select a major</option>
                        {majors.map(major => (
                          <option key={major.id} value={major.id}>
                            {major.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label>Semester</label>
                      <select 
                        value={studentProfile.semester || ''}
                        onChange={(e) => {
                          setStudentProfile({
                            ...studentProfile, 
                            semester: e.target.value ? parseInt(e.target.value, 10) : undefined
                          });
                        }}
                        disabled={!studentProfile.major}
                      >
                        <option value="">Select a semester</option>
                        {studentProfile.major?.availableSemesters.map(sem => (
                          <option key={sem} value={sem}>
                            {sem}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className={styles.formActions}>
                    <button 
                      onClick={() => handleEditToggle('academic')}
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
                    <span className={styles.infoLabel}>Major</span>
                    <span className={styles.infoValue}>
                      {studentProfile.major ? studentProfile.major.name : 'Not selected'}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Semester</span>
                    <span className={styles.infoValue}>
                      {studentProfile.semester || 'Not selected'}
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Job Interests Section */}
            <div className={styles.infoSection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Job Interests</h2>
                <button 
                  onClick={() => handleEditToggle('jobInterests')} 
                  className={styles.editButton}
                >
                  Edit
                </button>
              </div>
              
              {isEditing.jobInterests ? (
                <div className={styles.editForm}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Add New Job Interest</label>
                      <div className={styles.interestInputGroup}>
                        <input 
                          type="text" 
                          value={newJobInterest}
                          onChange={(e) => setNewJobInterest(e.target.value)}
                          placeholder="E.g., Web Development"
                        />
                        <button 
                          onClick={handleAddJobInterest}
                          className={styles.addInterestButton}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.currentInterests}>
                    <label>Current Interests:</label>
                    <div className={styles.tagContainer}>
                      {studentProfile.jobInterests.map((interest, index) => (
                        <div key={index} className={styles.interestTagWithRemove}>
                          <span>{interest}</span>
                          <button 
                            onClick={() => handleRemoveJobInterest(index)}
                            className={styles.removeButton}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className={styles.formActions}>
                    <button 
                      onClick={() => handleEditToggle('jobInterests')}
                      className={styles.cancelButton}
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => handleEditToggle('jobInterests')}
                      className={styles.saveButton}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className={styles.tagContainer}>
                  {studentProfile.jobInterests.length > 0 ? (
                    studentProfile.jobInterests.map((interest, index) => (
                      <span key={index} className={styles.interestTag}>{interest}</span>
                    ))
                  ) : (
                    <p className={styles.emptyState}>No job interests added yet</p>
                  )}
                </div>
              )}
            </div>
            
            {/* Work Experience Section */}
            <div className={styles.infoSection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Work Experience</h2>
                <button 
                  onClick={() => openExperienceModal()}
                  className={styles.editButton}
                >
                  Add Experience
                </button>
              </div>
              
              {studentProfile.previousExperiences.length > 0 ? (
                studentProfile.previousExperiences.map((exp) => (
                  <div key={exp.id} className={styles.experienceItem}>
                    <div className={styles.experienceHeader}>
                      <h3>{exp.position} at {exp.companyName}</h3>
                      <div className={styles.experienceActions}>
                        <button 
                          onClick={() => openExperienceModal(exp)}
                          className={styles.actionButton}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleRemoveExperience(exp.id)}
                          className={styles.actionButton}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <p className={styles.experienceDates}>
                      {exp.startDate} - {exp.isCurrentlyWorking ? 'Present' : exp.endDate}
                    </p>
                    <p className={styles.experienceType}>
                      {exp.isInternship ? 'Internship' : 'Part-time Job'}
                    </p>
                    <p className={styles.experienceDesc}>{exp.responsibilities}</p>
                  </div>
                ))
              ) : (
                <p className={styles.emptyState}>No work experience added yet</p>
              )}
            </div>
            
            {/* College Activities Section */}
            <div className={styles.infoSection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>College Activities</h2>
                <button 
                  onClick={() => openActivityModal()}
                  className={styles.editButton}
                >
                  Add Activity
                </button>
              </div>
              
              {studentProfile.collegeActivities.length > 0 ? (
                studentProfile.collegeActivities.map((activity) => (
                  <div key={activity.id} className={styles.activityItem}>
                    <div className={styles.activityHeader}>
                      <h3>{activity.name} - {activity.role}</h3>
                      <div className={styles.activityActions}>
                        <button 
                          onClick={() => openActivityModal(activity)}
                          className={styles.actionButton}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleRemoveActivity(activity.id)}
                          className={styles.actionButton}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <p className={styles.activityDates}>
                      {activity.startDate} - {activity.isCurrentlyActive ? 'Present' : activity.endDate}
                    </p>
                    <p className={styles.activityDesc}>{activity.description}</p>
                  </div>
                ))
              ) : (
                <p className={styles.emptyState}>No college activities added yet</p>
              )}
            </div>
              {/* Shared Assessments Section */}
            <div className={styles.infoSection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Shared Assessments</h2>
                <div className={styles.sectionHeaderInfo}>
                  <span className={styles.infoCaption}>
                    Assessments shared from your profile
                  </span>
                </div>
              </div>
              
              {sharedAssessments.length > 0 ? (
                <div className={styles.assessmentList}>
                  {sharedAssessments.map((assessment) => (
                    <div key={assessment.id} className={styles.assessmentItem}>
                      <div className={styles.assessmentHeader}>
                        <h3>{assessment.title}</h3>                        <div className={styles.scoreDisplay}>
                          <span className={styles.scoreValue}>
                            {assessment.score}/{assessment.totalPossibleScore}
                          </span>
                          <div className={styles.scoreProgressWrapper}>
                            <div 
                              className={styles.scoreProgress}
                              style={{
                                width: `${assessment.score && assessment.totalPossibleScore ? 
                                  Math.round((assessment.score / assessment.totalPossibleScore) * 100) : 0}%`
                              }}
                            ></div>
                          </div>
                          <span className={styles.scorePercentage}>
                            {assessment.score && assessment.totalPossibleScore ? 
                              Math.round((assessment.score / assessment.totalPossibleScore) * 100) : 0}%
                          </span>
                        </div>
                      </div>
                      
                      <div className={styles.assessmentDetails}>
                        <div className={styles.assessmentCompany}>
                          {assessment.companyLogo && (
                            <div className={styles.companyLogoContainer}>
                              <Image 
                                src={assessment.companyLogo} 
                                alt={assessment.company || 'Company logo'} 
                                width={24} 
                                height={24} 
                              />
                            </div>
                          )}
                          <span>{assessment.company}</span>
                        </div>
                        
                        <div className={styles.assessmentInfo}>
                          <span 
                            className={styles.assessmentBadge}
                            data-difficulty={assessment.difficulty}
                          >
                            {assessment.difficulty}
                          </span>
                          <span className={styles.assessmentCategory}>{assessment.category}</span>
                        </div>
                      </div>
                      
                      <div className={styles.skillsList}>
                        {assessment.skillsCovered.map((skill, idx) => (
                          <span key={idx} className={styles.skillBadge}>{skill}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={styles.emptyState}>No assessments have been shared on profile yet</p>
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