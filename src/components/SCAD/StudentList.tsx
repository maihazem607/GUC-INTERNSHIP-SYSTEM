import React from 'react';
import styles from './StudentList.module.css';
import { Search, Calendar, MapPin, Briefcase, BookOpen, Award } from 'lucide-react';

export interface Student {
  id: number;
  name: string;
  email: string;
  major: string;
  gpa: number;
  academicYear: string;
  internshipStatus: 'not started' | 'in progress' | 'completed' | 'deferred';
  companyName?: string;
  internshipStartDate?: string;
  internshipEndDate?: string;
  profileImage?: string;
}

export interface StudentListProps {
  students: Student[];
  onViewDetails: (student: Student) => void;
}

// Helper function to get row background color based on row index
const getRowBackground = (id: number): string => {
  const pastelColors = [
    'rgba(230, 230, 250, 0.3)', // Pastel Purple
    'rgba(255, 255, 224, 0.3)', // Pastel Yellow
    'rgba(240, 255, 240, 0.3)', // Pastel Green
    'rgba(230, 240, 255, 0.3)', // Pastel Blue
  ];
  return pastelColors[id % pastelColors.length];
};

// Helper function for getting GPA color classes
const getGpaColorClass = (gpa: number): string => {
  if (gpa >= 3.7) {
    return 'gpa-excellent';  // 3.7-4.0
  } else if (gpa >= 3.0) {
    return 'gpa-good';       // 3.0-3.6
  } else if (gpa >= 2.5) {
    return 'gpa-average';    // 2.5-2.9
  } else {
    return 'gpa-low';        // Below 2.5
  }
};

// Helper function to get status color classes
const getStatusColorClass = (status: string): string => {
  switch (status) {
    case 'completed':
      return 'status-completed';
    case 'in progress':
      return 'status-inProgress';
    case 'not started':
      return 'status-notStarted';
    case 'deferred':
      return 'status-deferred';
    default:
      return '';
  }
};

const StudentList: React.FC<StudentListProps> = ({ students, onViewDetails }) => (
  <div className={styles.reportCardContainer}>
    {students && students.length > 0 ? (
      <table className={styles.studentsTable}>
        <tbody>
          {students.map((student) => (
            <tr 
              key={student.id} 
              className={styles.studentRow}
              onClick={() => onViewDetails(student)}
              style={{ backgroundColor: getRowBackground(student.id) }}
            >
              {/* Student Name and Email Column */}
              <td>
                <div className={styles.studentProfile}>
                  <div className={styles.studentAvatar}>
                    {student.profileImage ? (
                      <img 
                        src={student.profileImage} 
                        alt={`${student.name}`} 
                        className={styles.avatarImage}
                      />
                    ) : (
                      student.name.charAt(0)
                    )}
                  </div>
                  <div className={styles.studentInfo}>
                    <div className={styles.studentName}>{student.name}</div>
                    <div className={styles.studentAge}>
                      <a href={`mailto:${student.email}`} className={styles.emailLink}>
                        {student.email}
                      </a>
                    </div>
                  </div>
                </div>
              </td>
              
              {/* Major as Tag */}
              <td>
                <div className={styles.tagContainer}>
                  <span className={styles.tag}>{student.major}</span>
                </div>
              </td>
              
              {/* Academic Year - Simple text */}
              <td>
                <div className={styles.majorCell}>
                  {student.academicYear}
                </div>
              </td>
              
              {/* GPA with submission tag styling */}
              <td>
                <div className={styles.dateCell}>
                  GPA: {student.gpa.toFixed(1)}
                  <div className={styles.submissionTag}>
                    {getGpaColorClass(student.gpa).replace('gpa-', '').toUpperCase()}
                  </div>
                </div>
              </td>
              
              {/* Status Badge */}
              <td>
                <div className={styles.tagContainer}>
                  <span className={`${styles.statusBadge} ${styles[getStatusColorClass(student.internshipStatus)]}`}>
                    {student.internshipStatus.toUpperCase()}
                  </span>
                </div>
              </td>
              
              {/* Actions - removed separate button */}
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <div className={styles.noResults}>
        <Search size={48} className={styles.searchIcon} />
        <p>No students found matching your criteria.</p>
      </div>
    )}
  </div>
);

export default StudentList;
