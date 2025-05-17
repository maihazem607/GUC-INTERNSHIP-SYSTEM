import React from "react";
import styles from "./AppointmentCard.module.css";
import { Clock, CheckCircle, X, CheckCheck } from "lucide-react";

export interface AppointmentCardProps {
  id: string;
  title: string;
  date: string;
  time: string;
  status: 'pending' | 'waiting-approval' | 'accepted' | 'rejected' | 'completed';
  participantName: string;
  participantType: 'student' | 'pro-student' | 'scad' | 'faculty';
  participantEmail: string;
  isOnline: boolean;
  onViewDetails: () => void;
  onAccept?: () => void;
  onReject?: () => void;
}

const getCardBackground = (id: string): string => {
  const colors = [
    '#ffe8f0', '#e8f3ff', '#e8ffe8', '#fff0e8', '#f0e8ff',
    '#e8fff0', '#fff8e8', '#e8f0ff', '#ffe8e8', '#e8ffea',
    '#f0ffe8', '#fff0f0'
  ];
  // Use the first character of the ID to get a consistent color
  const num = parseInt(id.charAt(0), 16) || 0;
  return colors[num % colors.length];
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'pending': return '#FF9800';
    case 'waiting-approval': return '#4c51bf'; // Blue color for waiting approval
    case 'accepted': return '#4CAF50';
    case 'rejected': return '#F44336';
    case 'completed': return '#3F51B5';
    default: return '#9E9E9E';
  }
};

const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'pending': return 'Pending';
    case 'waiting-approval': return 'Waiting for Approval';
    case 'accepted': return 'Accepted';
    case 'rejected': return 'Rejected';
    case 'completed': return 'Completed';
    default: return 'Unknown';
  }
};

const formatTime = (time: string): string => {
  return time;
};

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  id,
  title,
  date,
  time,
  status,
  participantName,
  participantType,
  participantEmail,
  isOnline,
  onViewDetails,
  onAccept,
  onReject
}) => {
  const statusColor = getStatusColor(status);
  const statusLabel = getStatusLabel(status);
  const formattedTime = formatTime(time);
  const cardBackground = getCardBackground(id);

  return (
    <div className={styles.card} onClick={onViewDetails}>
      <div className={styles.cardInner} style={{ backgroundColor: cardBackground }}>
        <div className={styles.cardDate}>
          <span>{date}</span>
          <span className={styles.time}>{formattedTime}</span>
        </div>

        <div className={styles.titleContainer}>
          <h3 className={styles.title}>{title}</h3>
        </div>

        <div className={styles.participantInfo}>
          <div className={styles.participantDetails}>
            <span className={styles.participantName}>{participantName}</span>
            <span className={styles.participantEmail}>{participantEmail}</span>
          </div>
          <div className={styles.onlineStatus}>
            <span className={`${styles.statusIndicator} ${isOnline ? styles.online : styles.offline}`}></span>
            <span>{isOnline ? 'Online' : 'Offline'}</span>
          </div>
        </div>
        <div className={styles.statusContainer}>          <span className={styles.statusBadge} style={{ backgroundColor: statusColor }}>
          <span className={styles.statusIcon}>
            {status === 'pending' && <Clock size={16} />}
            {status === 'waiting-approval' && <Clock size={16} />}
            {status === 'accepted' && <CheckCircle size={16} />}
            {status === 'rejected' && <X size={16} />}
            {status === 'completed' && <CheckCheck size={16} />}
          </span>
          {statusLabel}
        </span>
        </div>
        {(status === 'pending') && (
          <div className={styles.actionButtons} onClick={(e) => e.stopPropagation()}>            <button
            className={`${styles.actionButton} ${styles.acceptButton}`}
            onClick={(e) => {
              e.stopPropagation();
              onAccept && onAccept();
            }}
            suppressHydrationWarning
          >
            Accept
          </button>
            <button
              className={`${styles.actionButton} ${styles.rejectButton}`}
              onClick={(e) => {
                e.stopPropagation();
                onReject && onReject();
              }}
              suppressHydrationWarning
            >
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;
