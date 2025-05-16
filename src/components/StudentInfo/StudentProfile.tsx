'use client';

import React, { useState } from 'react';
import { StudentProfile as StudentProfileType } from './types';
import styles from './StudentProfile.module.css';

interface StudentProfileProps {
  profile: StudentProfileType;
  onUpdate: (updatedProfile: StudentProfileType) => void;
}

const StudentProfile: React.FC<StudentProfileProps> = ({ profile, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<StudentProfileType>(profile);
  const [showProfileViews, setShowProfileViews] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedProfile({ ...editedProfile, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(editedProfile);
    setIsEditing(false);
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <div className={styles.headerLeft}>
          <h2>Student Profile</h2>
          <button 
            className={styles.viewsToggle}
            onClick={() => setShowProfileViews(!showProfileViews)}
          >
            {showProfileViews ? 'Hide Profile Views' : 'Show Profile Views'}
          </button>
        </div>
        <button 
          className={styles.editButton}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className={styles.profileForm}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={editedProfile.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={editedProfile.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={editedProfile.phone}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="gpa">GPA</label>
            <input
              type="number"
              id="gpa"
              name="gpa"
              min="0"
              max="4"
              step="0.01"
              value={editedProfile.gpa}
              onChange={(e) => setEditedProfile({ 
                ...editedProfile, 
                gpa: parseFloat(e.target.value) 
              })}
              required
            />
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={styles.saveButton}>
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className={styles.profileInfo}>
            <div className={styles.profilePicture}>
              {profile.profilePicture ? (
                <img src={profile.profilePicture} alt={profile.name} />
              ) : (
                <div className={styles.placeholderImage}>
                  {profile.name.charAt(0)}
                </div>
              )}
            </div>
            <div className={styles.profileDetails}>
              <p><strong>Name:</strong> {profile.name}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Phone:</strong> {profile.phone}</p>
              <p><strong>GPA:</strong> {profile.gpa}</p>
              {profile.major && <p><strong>Major:</strong> {profile.major.name}</p>}
              {profile.semester && <p><strong>Semester:</strong> {profile.semester}</p>}
            </div>
          </div>

           
        </>
      )}
    </div>
  );
};

export default StudentProfile;