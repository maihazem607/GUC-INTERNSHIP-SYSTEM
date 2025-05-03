export interface Workshop {
  id: number;
  host: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  type: 'live' | 'recorded';
  category: string;
  status: 'upcoming' | 'ongoing' | 'past' | 'available';
  attendees: number;
  isRegistered: boolean;
  videoUrl?: string;
  logo?: string;
  progress?: number;
}

export interface Message {
  id: number;
  sender: string;
  text: string;
  time: string;
}