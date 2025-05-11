import React, { useState } from 'react';
import Image from "next/image";
import styles from "./WorkshopDetailsModal.module.css";
import { Workshop } from './types';

interface DetailsModalProps {
  workshop: Workshop;
  onClose: () => void;
  onRegister: (workshop: Workshop) => void;
  onJoinLive: (workshop: Workshop) => void;
  onWatch: (workshop: Workshop) => void;
}

const WorkshopDetailsModal: React.FC<DetailsModalProps> = ({
  workshop,
  onClose,
  onRegister,
  onJoinLive,
  onWatch
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handler with network error handling
  const handleAction = async (actionFn: (workshop: Workshop) => void) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await actionFn(workshop);
      onClose();
    } catch (err) {
      console.error('Network error:', err);
      setError('Network connection error. Please check your internet connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{workshop.title}</h2>
          <div className={styles.modalHost}>
            {workshop.logo && (
              <Image 
                src={workshop.logo} 
                alt={`${workshop.host} logo`} 
                width={40} 
                height={40} 
                className={styles.modalHostLogo}
              />
            )}
            <span className={styles.modalHostName}>{workshop.host}</span>
          </div>
        </div>
        
        <div className={styles.modalInfo}>
          <div className={styles.modalInfoItem}>
            <div className={styles.modalInfoLabel}>Date</div>
            <div className={styles.modalInfoValue}>{workshop.date}</div>
          </div>
          <div className={styles.modalInfoItem}>
            <div className={styles.modalInfoLabel}>Time</div>
            <div className={styles.modalInfoValue}>{workshop.time}</div>
          </div>
          <div className={styles.modalInfoItem}>
            <div className={styles.modalInfoLabel}>Duration</div>
            <div className={styles.modalInfoValue}>{workshop.duration}</div>
          </div>
        </div>
        
        <div className={styles.modalDescription}>
          <h3>About this workshop</h3>
          <p>{workshop.description}</p>
        </div>
        
        {error && (
          <div className={styles.errorMessage || "error-message"}>
            {error}
          </div>
        )}
        
        <div className={styles.modalActions}>
          {!workshop.isRegistered && workshop.status === 'upcoming' && (
            <button 
              className={styles.registerButton}
              onClick={() => handleAction(onRegister)}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Register Now'}
            </button>
          )}
          
          {workshop.isRegistered && workshop.type === 'live' && workshop.status === 'ongoing' && (
            <button 
              className={styles.joinButton}
              onClick={() => handleAction(onJoinLive)}
              disabled={isLoading}
            >
              {isLoading ? 'Connecting...' : 'Join Live Session'}
            </button>
          )}
          
          {workshop.isRegistered && workshop.type === 'recorded' && (
            <button 
              className={styles.joinButton}
              onClick={() => handleAction(onWatch)}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Watch Recording'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkshopDetailsModal;