// Appointment type definitions
export interface Appointment {
  id: string;
  title: string;
  date: string;
  time: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  participantName: string;
  participantType: 'student' | 'pro-student' | 'scad' | 'faculty';
  participantEmail: string;
  isOnline: boolean;
  description: string;
  location?: string;
}

// This should match the interface in global/NotificationSystem.tsx
// For consistency across the application
export interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
}

export interface IncomingCallProps {
  caller: {
    name: string;
    type: 'student' | 'pro-student' | 'scad' | 'faculty';
  };
  appointmentId: string;
  onAccept: () => void;
  onReject: () => void;
}
