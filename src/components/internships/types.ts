// Common filter types
export interface FilterOptions {
  industry?: string;
  duration?: string;
  isPaid?: string;
  status?: string;
  type?: string;
  date?: string;
  internStatus?: string;
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
  skills?: string[]; 
  applicationStatus?: 'none' | 'pending' | 'accepted' | 'rejected' | 'finalized'; 
  applicationType?: 'standard' | 'pro';
  requiredDocuments?: DocumentInfo[]; 
  applicationsCount?: number;
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