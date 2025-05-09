'use client';

import React, { useState, useEffect } from 'react';
import { StudentProfile, Major, majors } from './types';
import styles from './MajorSelection.module.css';

interface MajorSelectionProps {
  profile: StudentProfile;
  onUpdate: (updatedProfile: StudentProfile) => void;
}

const MajorSelection: React.FC<MajorSelectionProps> = ({ profile, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedMajorId, setSelectedMajorId] = useState<string>(profile.major?.id || '');
  const [selectedSemester, setSelectedSemester] = useState<number | undefined>(profile.semester);
  const [availableSemesters, setAvailableSemesters] = useState<number[]>([]);

  useEffect(() => {
    // Update available semesters when a major is selected
    if (selectedMajorId) {
      const major = majors.find(m => m.id === selectedMajorId);
      if (major) {
        setAvailableSemesters(major.availableSemesters);
        
        // If the currently selected semester is not valid for this major, reset it
        if (selectedSemester && !major.availableSemesters.includes(selectedSemester)) {
          setSelectedSemester(undefined);
        }
      }
    } else {
      setAvailableSemesters([]);
      setSelectedSemester(undefined);
    }
  }, [selectedMajorId, selectedSemester]);

  const handleSave = () => {
    const selectedMajor = majors.find(m => m.id === selectedMajorId);
    
    onUpdate({
      ...profile,
      major: selectedMajor,
      semester: selectedSemester
    });
    
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset to the current profile values
    setSelectedMajorId(profile.major?.id || '');
    setSelectedSemester(profile.semester);
    setIsEditing(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.sectionHeader}>
        <h2>Major and Semester</h2>
        {!isEditing ? (
          <button 
            className={styles.editButton} 
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
        ) : (
          <div className={styles.headerActions}>
            <button 
              className={styles.cancelButton} 
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button 
              className={styles.saveButton} 
              onClick={handleSave}
              disabled={!selectedMajorId || !selectedSemester}
            >
              Save
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className={styles.editSection}>
          <div className={styles.formGroup}>
            <label htmlFor="major">Select Your Major</label>
            <select
              id="major"
              value={selectedMajorId}
              onChange={(e) => setSelectedMajorId(e.target.value)}
              className={styles.selectInput}
            >
              <option value="">Select a major</option>
              {majors.map((major) => (
                <option key={major.id} value={major.id}>
                  {major.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="semester">Select Semester</label>
            <select
              id="semester"
              value={selectedSemester || ''}
              onChange={(e) => setSelectedSemester(e.target.value ? Number(e.target.value) : undefined)}
              className={styles.selectInput}
              disabled={!selectedMajorId}
            >
              <option value="">Select a semester</option>
              {availableSemesters.map((semester) => (
                <option key={semester} value={semester}>
                  Semester {semester}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : (
        <div className={styles.displaySection}>
          {profile.major ? (
            <div className={styles.currentSelection}>
              <p><strong>Major:</strong> {profile.major.name}</p>
              {profile.semester && <p><strong>Current Semester:</strong> {profile.semester}</p>}
            </div>
          ) : (
            <p className={styles.noSelection}>No major or semester selected yet</p>
          )}
        </div>
      )}
      
      <div className={styles.majorsList}>
        <h3>Available Majors</h3>
        <div className={styles.majorCards}>
          {majors.map((major) => (
            <div key={major.id} className={styles.majorCard}>
              <h4>{major.name}</h4>
              <p>Available Semesters: {major.availableSemesters.join(', ')}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MajorSelection;