// Extended Workshop types for SCAD administrators

export interface Workshop {
  id: number;
  host: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  type: 'live' | 'recorded';
  status: 'upcoming' | 'ongoing' | 'completed';
  isRegistered: boolean;
  logo?: string;
  videoUrl?: string;
  avgRating?: number;
  attendeesCount?: number;
  hasAttendanceCertificate?: boolean;
  
  // New fields for enhanced workshop management
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  speakerBio?: string;
  agenda?: AgendaItem[];
  registrationLimit?: number;
  registrationCount?: number;
  location?: string; // For physical workshops or virtual meeting link
  isPublished?: boolean; // Whether the workshop is visible to students
  createdBy?: string;
  createdAt?: string;
  lastModifiedBy?: string;
  lastModifiedAt?: string;
}

export interface AgendaItem {
  id: number;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  presenter?: string;
}

export interface Message {
  id: number;
  sender: string;
  text: string;
  time: string;
  isNew?: boolean;
}

export interface Note {
  id: number;
  workshopId: number;
  content: string;
  timestamp: string;
}

export interface Rating {
  rating: number;
  feedback: string;
}

export interface SpeakerProfile {
  id: number;
  name: string;
  title?: string;
  organization?: string;
  bio: string;
  profileImage?: string;
  expertise?: string[];
  socialLinks?: Record<string, string>;
}
