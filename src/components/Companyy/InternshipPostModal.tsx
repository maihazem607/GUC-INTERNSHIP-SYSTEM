import React from 'react';
import styles from './InternshipPostModal.module.css';
import Modal from '../global/Modal';
import { InternshipPost } from './types';

interface InternshipPostModalProps {
  post: Omit<InternshipPost, 'id' | 'postedDate' | 'applicationsCount'>;
  isEditing: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onChange: (post: Omit<InternshipPost, 'id' | 'postedDate' | 'applicationsCount'>) => void;
}

const InternshipPostModal: React.FC<InternshipPostModalProps> = ({ 
  post, 
  isEditing, 
  onClose, 
  onSubmit,
  onChange
}) => {
  const handleAddSkill = () => {
    const skill = prompt("Enter a required skill:");
    if (skill && skill.trim()) {
      onChange({
        ...post,
        skillsRequired: [...post.skillsRequired, skill.trim()]
      });
    }
  };

  const handleRemoveSkill = (index: number) => {
    onChange({
      ...post,
      skillsRequired: post.skillsRequired.filter((_, i) => i !== index)
    });
  };

  return (
    <Modal
      title={isEditing ? 'Edit Internship Post' : 'Create Internship Post'}
      onClose={onClose}
      width="600px"
    >
      <div className={styles.postForm}>
        <div className={styles.formField}>
          <label className={styles.label}>Title</label>
          <input
            type="text"
            className={styles.input}
            value={post.title}
            onChange={(e) => onChange({...post, title: e.target.value})}
            placeholder="e.g. Frontend Developer Intern"
          />
        </div>

        <div className={styles.formField}>
          <label className={styles.label}>Description</label>
          <textarea
            className={styles.textarea}
            rows={4}
            value={post.description}
            onChange={(e) => onChange({...post, description: e.target.value})}
            placeholder="Describe the internship role and responsibilities"
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formField}>
            <label className={styles.label}>Department</label>
            <select
              className={styles.select}
              value={post.department}
              onChange={(e) => onChange({...post, department: e.target.value})}
            >
              <option value="Engineering">Engineering</option>
              <option value="Marketing">Marketing</option>
              <option value="Design">Design</option>
              <option value="Business">Business</option>
              <option value="HR">HR</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div className={styles.formField}>
            <label className={styles.label}>Duration</label>
            <input
              type="text"
              className={styles.input}
              value={post.duration}
              onChange={(e) => onChange({...post, duration: e.target.value})}
              placeholder="e.g. 3 months"
            />
          </div>
        </div>
        
        <div className={styles.formRow}>
          <div className={styles.formField}>
            <label className={styles.label}>Application Deadline</label>
            <input
              type="date"
              className={styles.input}
              value={post.deadline.toISOString().substr(0, 10)}
              onChange={(e) => onChange({...post, deadline: new Date(e.target.value)})}
            />
          </div>
          
          <div className={styles.formField}>
            <div className={styles.checkboxGroup}>
              <input
                type="checkbox"
                id="isPaid"
                checked={post.isPaid}
                onChange={(e) => onChange({...post, isPaid: e.target.checked})}
              />
              <label htmlFor="isPaid" className={styles.checkboxLabel}>Paid Internship</label>
            </div>
            
            {post.isPaid && (
              <div className={styles.formField}>
                <label className={styles.label}>Monthly Stipend ($)</label>
                <input
                  type="number"
                  className={styles.input}
                  value={post.expectedSalary || ''}
                  onChange={(e) => onChange({...post, expectedSalary: Number(e.target.value) || undefined})}
                  placeholder="e.g. 1500"
                />
              </div>
            )}
          </div>
        </div>
        
        <div className={styles.formField}>
          <label className={styles.label}>Required Skills</label>
          <div className={styles.skillsContainer}>
            {post.skillsRequired.map((skill, index) => (
              <div key={index} className={styles.skillTag}>
                {skill}
                <button 
                  className={styles.removeSkill}
                  onClick={() => handleRemoveSkill(index)}
                  type="button"
                >
                  ×
                </button>
              </div>
            ))}
            <button 
              className={styles.addSkillButton}
              onClick={handleAddSkill}
              type="button"
            >
              + Add Skill
            </button>
          </div>
        </div>

        <div className={styles.formActions}>
          <button 
            className={styles.cancelButton} 
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className={styles.submitButton} 
            onClick={onSubmit}
            disabled={!post.title || !post.description || !post.duration}
          >
            {isEditing ? 'Update Post' : 'Create Post'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default InternshipPostModal;
