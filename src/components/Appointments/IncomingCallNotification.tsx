import React from 'react';
import styles from './IncomingCallNotification.module.css';

interface IncomingCallNotificationProps {
  callerName: string;
  onAccept: () => void;
  onReject: () => void;
}

const IncomingCallNotification: React.FC<IncomingCallNotificationProps> = ({
  callerName,
  onAccept,
  onReject
}) => {
  return (
    <div className={styles.incomingCallContainer}>
      <div className={styles.incomingCallCard}>
        <div className={styles.callRinging}>
          <div className={styles.ringIcon}></div>
        </div>
        
        <div className={styles.incomingCallHeader}>
          <h3>Incoming Call</h3>
          <span className={styles.callerInfo}>From {callerName}</span>
        </div>
        
        <div className={styles.incomingCallActions}>
          <button 
            className={`${styles.callActionButton} ${styles.acceptCallButton}`}
            onClick={onAccept}
          >
            <span className={styles.actionIcon}>✓</span>
            Accept
          </button>
          <button 
            className={`${styles.callActionButton} ${styles.rejectCallButton}`}
            onClick={onReject}
          >
            <span className={styles.actionIcon}>✕</span>
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallNotification;
