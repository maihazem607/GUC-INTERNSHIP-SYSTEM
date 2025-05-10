import React, { useState, useEffect } from 'react';
import Image from "next/image";
import styles from "./WorkshopDetailsModal.module.css";
import { Workshop } from './types';
import NotificationSystem, { useNotification } from '../global/NotificationSystem';

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
}) => {  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { notification, visible, showNotification, hideNotification } = useNotification();
  
  // Handler with network error handling
  const handleAction = async (actionFn: (workshop: Workshop) => void, message: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await actionFn(workshop);
      
      // Close modal immediately first
      onClose();
      
      // Then show success notification after a small delay
      setTimeout(() => {
        showNotification({
          message: message,
          type: 'success'
        });
      }, 100); // Small delay to ensure modal closing animation starts first
      
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
          <div>
            <h2 className={styles.modalTitle}>{workshop.title}</h2>
          </div>
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
          {workshop.type && (
            <div className={styles.modalInfoItem}>
              <div className={styles.modalInfoLabel}>Type</div>
              <div className={styles.modalInfoValue}>
                <span className={
                  workshop.type === 'live' ? styles.liveBadge : styles.recordedBadge
                }>
                  {workshop.type === 'live' ? 'Live Session' : 'Recorded'}
                </span>
              </div>
            </div>
          )}
        </div>
        
        <div className={styles.modalSection}>
          <h3 className={styles.sectionTitle}>About this workshop</h3>
          <p className={styles.modalDescription}>{workshop.description}</p>
        </div>
          {error && (
          <div className={styles.error}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            {error}
          </div>
        )}
        
        <div className={styles.modalActions}>
          {!workshop.isRegistered && workshop.status === 'upcoming' && (
            <button 
              className={styles.registerButton}              
              onClick={() => handleAction(onRegister, 'Successfully registered for workshop!')}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Register Now'}
            </button>
          )}
          
          {workshop.isRegistered && workshop.status === 'upcoming' && (
            <div className={styles.registeredStatus}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              You're registered for this workshop
            </div>
          )}
          
          {workshop.isRegistered && workshop.type === 'live' && workshop.status === 'ongoing' && (
            <button 
              className={styles.joinButton}
              onClick={() => handleAction(onJoinLive, 'Joining live session...')}
              disabled={isLoading}
            >
              {isLoading ? 'Connecting...' : 'Join Live Session'}
            </button>
          )}
            {workshop.isRegistered && workshop.type === 'recorded' && (
            <button 
              className={styles.joinButton}
              onClick={() => handleAction(onWatch, 'Loading workshop...')}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Watch Recording'}
            </button>
          )}
          
          {workshop.isRegistered && (
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className={styles.cancelBtn}
            >
              Cancel
            </button>
          )}</div>
      </div>
        {notification && (
        <NotificationSystem
          message={notification.message}
          type={notification.type}
          visible={visible}
          onClose={hideNotification}
        />
      )}
    </div>
  );
};

export default WorkshopDetailsModal;