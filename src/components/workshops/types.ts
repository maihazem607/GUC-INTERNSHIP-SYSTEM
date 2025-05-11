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