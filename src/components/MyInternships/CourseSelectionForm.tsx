import React from 'react';
import styles from './CourseSelectionForm.module.css';

interface Course {
  id: string;
  name: string;
}

interface CourseSelectionFormProps {
  availableCourses: Course[];
  report: {
    coursesApplied: string[];
    finalized: boolean;
  };
  onToggleCourse: (courseId: string) => void;
}

const CourseSelectionForm: React.FC<CourseSelectionFormProps> = ({ 
  availableCourses,
  report,
  onToggleCourse
}) => {
  return (
    <div className={styles.reportForm}>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>
          Select courses that helped you during this internship
        </label>
        <p style={{ marginBottom: '20px', color: '#666' }}>
          Select any courses from your major that provided knowledge or skills applicable to this internship.
        </p>
        
        <div className={styles.coursesContainer}>
          {availableCourses.map(course => (
            <div key={course.id} className={styles.courseItem}>
              <input
                type="checkbox"
                id={`course-${course.id}`}
                className={styles.courseCheckbox}
                checked={report.coursesApplied.includes(course.id)}
                onChange={() => onToggleCourse(course.id)}
                disabled={report.finalized}
              />
              <label 
                htmlFor={`course-${course.id}`} 
                className={styles.courseLabel}
              >
                {course.name}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseSelectionForm;
