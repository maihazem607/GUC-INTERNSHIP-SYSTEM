export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  gpa: number;
  major?: Major;
  semester?: number;
  jobInterests: string[];
  previousExperiences: Experience[];
  collegeActivities: Activity[];
  profilePicture?: string;
}

export interface Major {
  id: string;
  name: string;
  availableSemesters: number[];
}

export interface Experience {
  id: string;
  companyName: string;
  position: string;
  responsibilities: string;
  startDate: string;
  endDate: string;
  isCurrentlyWorking?: boolean;
  isInternship: boolean; // true for internship, false for part-time job
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  role: string;
  startDate: string;
  endDate: string;
  isCurrentlyActive?: boolean;
}

// Mock data
export const majors: Major[] = [
  { id: '1', name: 'Computer Science', availableSemesters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  { id: '2', name: 'Computer Engineering', availableSemesters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  { id: '3', name: 'Electronics Engineering', availableSemesters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  { id: '4', name: 'Communications Engineering', availableSemesters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  { id: '5', name: 'Media Engineering', availableSemesters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
];

// Sample initial profile data for pro-student and standard student
export const initialStudentProfile: StudentProfile = {
  id: '1',
  name: 'Salma Hassan', // default pro-student profile
  email: 'salma.hassan@student.guc.edu.eg',
  phone: '+201234567890',
  gpa: 3.5,
  jobInterests: ['Web Development', 'Mobile Development'],
  previousExperiences: [],
  collegeActivities: [],
};

// Alternative profile for standard student login
export const initialStandardStudentProfile: StudentProfile = {
  id: '2',
  name: 'Ahmed Mostafa',
  email: 'ahmed.mostafa@student.guc.edu.eg',
  phone: '+201234567890',
  gpa: 3.5,
  jobInterests: ['Web Development', 'Mobile Development'],
  previousExperiences: [],
  collegeActivities: [],
};