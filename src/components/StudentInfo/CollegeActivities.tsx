'use client';

import React, { useState } from 'react';
import { StudentProfile, Activity } from './types';
import styles from './CollegeActivities.module.css';

interface CollegeActivitiesProps {
  profile: StudentProfile;
  onUpdate: (updatedProfile: StudentProfile) => void;
}

const CollegeActivities: React.FC<CollegeActivitiesProps> = ({ profile, onUpdate }) => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  
  const [newActivity, setNewActivity] = useState<Activity>({
    id: '',
    name: '',
    description: '',
    role: '',
    startDate: '',
    endDate: '',
    isCurrentlyActive: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (editingActivity) {
      setEditingActivity({
        ...editingActivity,
        [name]: value
      });
    } else {
      setNewActivity({
        ...newActivity,
        [name]: value
      });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    if (editingActivity) {
      setEditingActivity({
        ...editingActivity,
        [name]: checked
      });
    } else {
      setNewActivity({
        ...newActivity,
        [name]: checked
      });
    }
  };

  const handleAddActivity = () => {
    const activityToAdd = {
      ...newActivity,
      id: Date.now().toString()
    };
    
    const updatedProfile = {
      ...profile,
      collegeActivities: [...profile.collegeActivities, activityToAdd]
    };
    
    onUpdate(updatedProfile);
    setNewActivity({
      id: '',
      name: '',
      description: '',
      role: '',
      startDate: '',
      endDate: '',
      isCurrentlyActive: false
    });
    setIsAddingNew(false);
  };

  const handleUpdateActivity = () => {
    if (!editingActivity) return;
    
    const updatedActivities = profile.collegeActivities.map(activity => 
      activity.id === editingActivity.id ? editingActivity : activity
    );
    
    onUpdate({
      ...profile,
      collegeActivities: updatedActivities
    });
    
    setEditingActivity(null);
  };

  const handleDeleteActivity = (id: string) => {
    const updatedActivities = profile.collegeActivities.filter(activity => activity.id !== id);
    
    onUpdate({
      ...profile,
      collegeActivities: updatedActivities
    });
    
    if (editingActivity?.id === id) {
      setEditingActivity(null);
    }
  };

  const cancelEdit = () => {
    setEditingActivity(null);
    setIsAddingNew(false);
  };

  const startEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setIsAddingNew(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.sectionHeader}>
        <h2>College Activities</h2>
        {!isAddingNew && !editingActivity && (
          <button 
            className={styles.addButton} 
            onClick={() => setIsAddingNew(true)}
          >
            Add Activity
          </button>
        )}
      </div>

      {(isAddingNew || editingActivity) && (
        <div className={styles.formContainer}>
          <h3>{editingActivity ? 'Edit Activity' : 'Add New Activity'}</h3>
          
          <div className={styles.formGroup}>
            <label htmlFor="name">Activity Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={editingActivity ? editingActivity.name : newActivity.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="role">Your Role</label>
            <input
              type="text"
              id="role"
              name="role"
              value={editingActivity ? editingActivity.role : newActivity.role}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={editingActivity ? editingActivity.description : newActivity.description}
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
                value={editingActivity ? editingActivity.startDate : newActivity.startDate}
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
                value={editingActivity ? editingActivity.endDate : newActivity.endDate}
                onChange={handleInputChange}
                disabled={(editingActivity?.isCurrentlyActive || newActivity.isCurrentlyActive)}
                required={!(editingActivity?.isCurrentlyActive || newActivity.isCurrentlyActive)}
              />
            </div>
          </div>

          <div className={styles.checkboxGroup}>
            <div className={styles.checkbox}>
              <input
                type="checkbox"
                id="isCurrentlyActive"
                name="isCurrentlyActive"
                checked={editingActivity ? editingActivity.isCurrentlyActive : newActivity.isCurrentlyActive}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="isCurrentlyActive">I am currently active in this activity</label>
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
              onClick={editingActivity ? handleUpdateActivity : handleAddActivity}
            >
              {editingActivity ? 'Update' : 'Save'}
            </button>
          </div>
        </div>
      )}

      {!isAddingNew && !editingActivity && (
        <div className={styles.activityList}>
          {profile.collegeActivities.length === 0 ? (
            <p className={styles.noActivity}>No college activities added yet</p>
          ) : (
            profile.collegeActivities.map(activity => (
              <div key={activity.id} className={styles.activityCard}>
                <div className={styles.activityHeader}>
                  <h3>{activity.name}</h3>
                </div>
                <h4>{activity.role}</h4>
                <p className={styles.activityDates}>
                  {new Date(activity.startDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                  })} - {activity.isCurrentlyActive ? 'Present' : new Date(activity.endDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                  })}
                </p>
                <p className={styles.activityDesc}>{activity.description}</p>
                <div className={styles.activityActions}>
                  <button 
                    className={styles.editActivityButton}
                    onClick={() => startEdit(activity)}
                  >
                    Edit
                  </button>
                  <button 
                    className={styles.deleteActivityButton}
                    onClick={() => handleDeleteActivity(activity.id)}
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

export default CollegeActivities;