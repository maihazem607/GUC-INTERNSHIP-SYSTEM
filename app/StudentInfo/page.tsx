'use client';

import React, { useState } from 'react';
import styles from './page.module.css';
import Navigation from '../../src/components/global/Navigation';
import StudentProfile from '../../src/components/StudentInfo/StudentProfile';
import JobInterests from '../../src/components/StudentInfo/JobInterests';
import PreviousExperience from '../../src/components/StudentInfo/PreviousExperience';
import CollegeActivities from '../../src/components/StudentInfo/CollegeActivities';
import MajorSelection from '../../src/components/StudentInfo/MajorSelection';
import { initialStudentProfile, StudentProfile as StudentProfileType } from '../../src/components/StudentInfo/types';

enum TabType {
  Profile = 'profile',
  JobInterests = 'job-interests',
  Experience = 'experience',
  Activities = 'activities',
  Major = 'major',
}

export default function StudentInfo() {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.Profile);
  const [studentProfile, setStudentProfile] = useState<StudentProfileType>(initialStudentProfile);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const handleProfileUpdate = (updatedProfile: StudentProfileType) => {
    setStudentProfile(updatedProfile);
    // In a real application, you would save this to a database
    console.log('Profile updated:', updatedProfile);
  };

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    let completed = 0;
    let total = 4; // Basic profile, job interests, major, and at least one work experience or college activity

    // Check if basic profile is filled
    if (studentProfile.name && studentProfile.email && studentProfile.phone) {
      completed++;
    }

    // Check if job interests are added
    if (studentProfile.jobInterests.length > 0) {
      completed++;
    }

    // Check if major is selected
    if (studentProfile.major && studentProfile.semester) {
      completed++;
    }

    // Check if work experience or college activities are added
    if (studentProfile.previousExperiences.length > 0 || studentProfile.collegeActivities.length > 0) {
      completed++;
    }

    return Math.round((completed / total) * 100);
  };

  const profileCompletion = calculateProfileCompletion();
  
  return (
    <div className={styles.pageContainer}>
      <Navigation />
      
      <div className={styles.contentWrapper}>
        <div className={styles.mainContent}>
          <div className={styles.sectionHeader}>
            <h1 className={styles.sectionTitle}>Student Information</h1>
            <span className={`${styles.statusIndicator} ${profileCompletion === 100 ? styles.statusComplete : styles.statusIncomplete}`}>
              {profileCompletion}% Complete
            </span>
          </div>
          
          <div className={styles.tabContainer}>
            <div className={styles.tabs}>
              <button 
                className={`${styles.tab} ${activeTab === TabType.Profile ? styles.tabActive : ''}`}
                onClick={() => handleTabChange(TabType.Profile)}
              >
                Profile
              </button>
              <button 
                className={`${styles.tab} ${activeTab === TabType.JobInterests ? styles.tabActive : ''}`}
                onClick={() => handleTabChange(TabType.JobInterests)}
              >
                Job Interests
              </button>
              <button 
                className={`${styles.tab} ${activeTab === TabType.Experience ? styles.tabActive : ''}`}
                onClick={() => handleTabChange(TabType.Experience)}
              >
                Work Experience
              </button>
              <button 
                className={`${styles.tab} ${activeTab === TabType.Activities ? styles.tabActive : ''}`}
                onClick={() => handleTabChange(TabType.Activities)}
              >
                College Activities
              </button>
              <button 
                className={`${styles.tab} ${activeTab === TabType.Major ? styles.tabActive : ''}`}
                onClick={() => handleTabChange(TabType.Major)}
              >
                Major Selection
              </button>
            </div>

            <div className={styles.tabContent}>
              {activeTab === TabType.Profile && (
                <StudentProfile profile={studentProfile} onUpdate={handleProfileUpdate} />
              )}
              
              {activeTab === TabType.JobInterests && (
                <JobInterests profile={studentProfile} onUpdate={handleProfileUpdate} />
              )}
              
              {activeTab === TabType.Experience && (
                <PreviousExperience profile={studentProfile} onUpdate={handleProfileUpdate} />
              )}
              
              {activeTab === TabType.Activities && (
                <CollegeActivities profile={studentProfile} onUpdate={handleProfileUpdate} />
              )}
              
              {activeTab === TabType.Major && (
                <MajorSelection profile={studentProfile} onUpdate={handleProfileUpdate} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}