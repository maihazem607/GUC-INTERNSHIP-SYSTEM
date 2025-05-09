'use client';

import React, { useState } from 'react';
import { StudentProfile, Experience } from './types';
import styles from './PreviousExperience.module.css';

interface PreviousExperienceProps {
  profile: StudentProfile;
  onUpdate: (updatedProfile: StudentProfile) => void;
}

const PreviousExperience: React.FC<PreviousExperienceProps> = ({ profile, onUpdate }) => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  
  const [newExperience, setNewExperience] = useState<Experience>({
    id: '',
    companyName: '',
    position: '',
    responsibilities: '',
    startDate: '',
    endDate: '',
    isCurrentlyWorking: false,
    isInternship: true
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (editingExperience) {
      setEditingExperience({
        ...editingExperience,
        [name]: value
      });
    } else {
      setNewExperience({
        ...newExperience,
        [name]: value
      });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    if (editingExperience) {
      setEditingExperience({
        ...editingExperience,
        [name]: checked
      });
    } else {
      setNewExperience({
        ...newExperience,
        [name]: checked
      });
    }
  };

  const handleAddExperience = () => {
    const experienceToAdd = {
      ...newExperience,
      id: Date.now().toString()
    };
    
    const updatedProfile = {
      ...profile,
      previousExperiences: [...profile.previousExperiences, experienceToAdd]
    };
    
    onUpdate(updatedProfile);
    setNewExperience({
      id: '',
      companyName: '',
      position: '',
      responsibilities: '',
      startDate: '',
      endDate: '',
      isCurrentlyWorking: false,
      isInternship: true
    });
    setIsAddingNew(false);
  };

  const handleUpdateExperience = () => {
    if (!editingExperience) return;
    
    const updatedExperiences = profile.previousExperiences.map(exp => 
      exp.id === editingExperience.id ? editingExperience : exp
    );
    
    onUpdate({
      ...profile,
      previousExperiences: updatedExperiences
    });
    
    setEditingExperience(null);
  };

  const handleDeleteExperience = (id: string) => {
    const updatedExperiences = profile.previousExperiences.filter(exp => exp.id !== id);
    
    onUpdate({
      ...profile,
      previousExperiences: updatedExperiences
    });
    
    if (editingExperience?.id === id) {
      setEditingExperience(null);
    }
  };

  const cancelEdit = () => {
    setEditingExperience(null);
    setIsAddingNew(false);
  };

  const startEdit = (experience: Experience) => {
    setEditingExperience(experience);
    setIsAddingNew(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.sectionHeader}>
        <h2>Previous Experience</h2>
        {!isAddingNew && !editingExperience && (
          <button 
            className={styles.addButton} 
            onClick={() => setIsAddingNew(true)}
          >
            Add Experience
          </button>
        )}
      </div>

      {(isAddingNew || editingExperience) && (
        <div className={styles.formContainer}>
          <h3>{editingExperience ? 'Edit Experience' : 'Add New Experience'}</h3>
          
          <div className={styles.formGroup}>
            <label htmlFor="companyName">Company Name</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={editingExperience ? editingExperience.companyName : newExperience.companyName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="position">Position</label>
            <input
              type="text"
              id="position"
              name="position"
              value={editingExperience ? editingExperience.position : newExperience.position}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="responsibilities">Responsibilities</label>
            <textarea
              id="responsibilities"
              name="responsibilities"
              value={editingExperience ? editingExperience.responsibilities : newExperience.responsibilities}
              onChange={handleInputChange}
              rows={4}
              required
            />
          </div>

          <div className={styles.dateGroup}>
            <div className={styles.formGroup}>
              <label htmlFor="startDate">Start Date</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={editingExperience ? editingExperience.startDate : newExperience.startDate}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="endDate">End Date</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={editingExperience ? editingExperience.endDate : newExperience.endDate}
                onChange={handleInputChange}
                disabled={(editingExperience?.isCurrentlyWorking || newExperience.isCurrentlyWorking)}
                required={!(editingExperience?.isCurrentlyWorking || newExperience.isCurrentlyWorking)}
              />
            </div>
          </div>

          <div className={styles.checkboxGroup}>
            <div className={styles.checkbox}>
              <input
                type="checkbox"
                id="isCurrentlyWorking"
                name="isCurrentlyWorking"
                checked={editingExperience ? editingExperience.isCurrentlyWorking : newExperience.isCurrentlyWorking}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="isCurrentlyWorking">I currently work here</label>
            </div>
          </div>

          <div className={styles.radioGroup}>
            <label className={styles.radioGroupLabel}>Experience Type:</label>
            <div className={styles.radio}>
              <input
                type="radio"
                id="isInternship"
                name="isInternship"
                checked={editingExperience ? editingExperience.isInternship : newExperience.isInternship}
                onChange={() => {
                  if (editingExperience) {
                    setEditingExperience({...editingExperience, isInternship: true});
                  } else {
                    setNewExperience({...newExperience, isInternship: true});
                  }
                }}
              />
              <label htmlFor="isInternship">Internship</label>
            </div>
            <div className={styles.radio}>
              <input
                type="radio"
                id="isPartTime"
                name="isInternship"
                checked={editingExperience ? !editingExperience.isInternship : !newExperience.isInternship}
                onChange={() => {
                  if (editingExperience) {
                    setEditingExperience({...editingExperience, isInternship: false});
                  } else {
                    setNewExperience({...newExperience, isInternship: false});
                  }
                }}
              />
              <label htmlFor="isPartTime">Part-time Job</label>
            </div>
          </div>

          <div className={styles.formActions}>
            <button 
              className={styles.cancelButton} 
              onClick={cancelEdit}
            >
              Cancel
            </button>
            <button 
              className={styles.saveButton} 
              onClick={editingExperience ? handleUpdateExperience : handleAddExperience}
            >
              {editingExperience ? 'Update' : 'Save'}
            </button>
          </div>
        </div>
      )}

      {!isAddingNew && !editingExperience && (
        <div className={styles.experienceList}>
          {profile.previousExperiences.length === 0 ? (
            <p className={styles.noExperience}>No work experience added yet</p>
          ) : (
            profile.previousExperiences.map(experience => (
              <div key={experience.id} className={styles.experienceCard}>
                <div className={styles.experienceHeader}>
                  <h3>{experience.position}</h3>
                  <span className={`${styles.experienceBadge} ${experience.isInternship ? styles.internshipBadge : styles.jobBadge}`}>
                    {experience.isInternship ? 'Internship' : 'Part-time Job'}
                  </span>
                </div>
                <h4>{experience.companyName}</h4>
                <p className={styles.experienceDates}>
                  {new Date(experience.startDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                  })} - {experience.isCurrentlyWorking ? 'Present' : new Date(experience.endDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                  })}
                </p>
                <p className={styles.experienceDesc}>{experience.responsibilities}</p>
                <div className={styles.experienceActions}>
                  <button 
                    className={styles.editExperienceButton}
                    onClick={() => startEdit(experience)}
                  >
                    Edit
                  </button>
                  <button 
                    className={styles.deleteExperienceButton}
                    onClick={() => handleDeleteExperience(experience.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default PreviousExperience;