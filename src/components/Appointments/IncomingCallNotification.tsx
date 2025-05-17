import React, { useState, useEffect } from 'react';
import styles from './IncomingCallNotification.module.css';
import { PhoneIncoming, XCircle, CheckCircle, UserCircle } from 'lucide-react';

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
  // Animation effect when component mounts
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Small delay to trigger animation after component is mounted
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`${styles.incomingCallContainer} ${isVisible ? styles.visible : ''}`}>
      <div className={styles.incomingCallCard}>
        

        <div className={styles.userIconContainer}>
          <UserCircle size={56} strokeWidth={1.5} />
        </div>

        <div className={styles.callInfo}>
          <span className={styles.callLabel}>Incoming Call</span>
          <h3 className={styles.callerName}>{callerName}</h3>
        </div>

        <div className={styles.incomingCallActions}>
          <button
            className={`${styles.callActionButton} ${styles.rejectCallButton}`}
            onClick={onReject}
            aria-label="Decline call"
          >
            <XCircle size={18} />
            <span>Decline</span>
          </button>

          <button
            className={`${styles.callActionButton} ${styles.acceptCallButton}`}
            onClick={onAccept}
            aria-label="Accept call"
          >
            <CheckCircle size={18} />
            <span>Accept</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallNotification;
