'use client';

import React, { useState } from 'react';
import { StudentProfile } from './types';
import styles from './JobInterests.module.css';

interface JobInterestsProps {
  profile: StudentProfile;
  onUpdate: (updatedProfile: StudentProfile) => void;
}

const JobInterests: React.FC<JobInterestsProps> = ({ profile, onUpdate }) => {
  const [newInterest, setNewInterest] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleAddInterest = () => {
    if (newInterest.trim() && !profile.jobInterests.includes(newInterest.trim())) {
      const updatedProfile = {
        ...profile,
        jobInterests: [...profile.jobInterests, newInterest.trim()]
      };
      onUpdate(updatedProfile);
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interestToRemove: string) => {
    const updatedProfile = {
      ...profile,
      jobInterests: profile.jobInterests.filter(interest => interest !== interestToRemove)
    };
    onUpdate(updatedProfile);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddInterest();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.sectionHeader}>
        <h2>Job Interests</h2>
        <button 
          className={styles.editButton} 
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Done' : 'Edit'}
        </button>
      </div>

      {isEditing ? (
        <div className={styles.editSection}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a new job interest"
              className={styles.interestInput}
            />
            <button 
              onClick={handleAddInterest}
              className={styles.addButton}
              disabled={!newInterest.trim()}
            >
              Add
            </button>
          </div>
          
          {profile.jobInterests.length > 0 ? (
            <div className={styles.interestsList}>
              {profile.jobInterests.map((interest, index) => (
                <div key={index} className={styles.interestTag}>
                  <span>{interest}</span>
                  <button
                    className={styles.removeButton}
                    onClick={() => handleRemoveInterest(interest)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.noInterests}>No job interests added yet</p>
          )}
        </div>
      ) : (
        <div className={styles.displaySection}>
          {profile.jobInterests.length > 0 ? (
            <div className={styles.interestsDisplay}>
              {profile.jobInterests.map((interest, index) => (
                <span key={index} className={styles.interestBadge}>
                  {interest}
                </span>
              ))}
            </div>
          ) : (
            <p className={styles.noInterests}>No job interests added yet</p>
          )}
        </div>
      )}
    </div>
  );
};

export default JobInterests;