// Common filter types
export interface FilterOptions {
  industry?: string;
  duration?: string;
  isPaid?: string;
  status?: string;
  type?: string;
}

// Internship types
export interface Internship {
  id: number;
  company: string;
  title: string;
  duration: string;
  date: string;
  location: string;
  industry: string;
  isPaid: boolean;
  salary: string;
  logo: string;
  description: string;
  skills?: string[]; // New property for skills required
  applicationStatus?: 'none' | 'applied' | 'reviewing' | 'accepted' | 'rejected'; // New property
  applicationType?: 'standard' | 'pro'; // Distinguish between regular and PRO applications
}

// Workshop types
export interface Workshop {
  id: number;
  title: string;
  date: string;
  time: string;
  duration: string;
  host: string;
  description: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  type: 'live' | 'recorded';
  isRegistered: boolean;
  logo: string;
}

// Application types
export interface InternshipApplication {
  internshipId: number;
  studentId: string;
  documents: DocumentInfo[];
  status: 'submitted' | 'under review' | 'accepted' | 'rejected';
  submittedDate: string;
}

export interface DocumentInfo {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: string;
  documentType: 'cv' | 'coverLetter' | 'certificate' | 'other';
}

// User types
export type UserType = 'Student' | 'PRO Student' | 'Company' | 'SCAD Office';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  type: UserType;
  department?: string;
  year?: number;
  gpa?: number;
}