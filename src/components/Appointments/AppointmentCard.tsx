import React from "react";
import styles from "./AppointmentCard.module.css";

export interface AppointmentCardProps {
  id: string;
  title: string;
  date: string;
  time: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  participantName: string;
  participantType: 'student' | 'pro-student' | 'scad' | 'faculty';
  participantEmail: string;
  isOnline: boolean;
  onViewDetails: () => void;
  onAccept?: () => void;
  onReject?: () => void;
}

const getStatusColor = (status: string): string => {
  switch(status) {
    case 'pending': return '#FFB800';
    case 'accepted': return '#4CAF50';
    case 'rejected': return '#F44336';
    case 'completed': return '#6200EA';
    default: return '#9E9E9E';
  }
};

const getStatusLabel = (status: string): string => {
  switch(status) {
    case 'pending': return 'Pending';
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
  
  return (
    <div className={styles.card} onClick={onViewDetails}>
      <div className={styles.cardInner}>
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
        
        <div className={styles.statusContainer}>
          <span className={styles.statusBadge} style={{ backgroundColor: statusColor }}>
            {statusLabel}
          </span>
        </div>
        
        {status === 'pending' && (
          <div className={styles.actionButtons} onClick={(e) => e.stopPropagation()}>
            <button 
              className={`${styles.actionButton} ${styles.acceptButton}`}
              onClick={(e) => {
                e.stopPropagation();
                onAccept && onAccept();
              }}
            >
              Accept
            </button>
            <button 
              className={`${styles.actionButton} ${styles.rejectButton}`}
              onClick={(e) => {
                e.stopPropagation();
                onReject && onReject();
              }}
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
