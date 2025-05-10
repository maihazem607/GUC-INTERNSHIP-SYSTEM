import React, { useState } from 'react';
import styles from './AppointmentDetailsModal.module.css';

interface AppointmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: {
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
  };
  onAccept?: () => void;
  onReject?: () => void;
  onStartCall?: () => void;
  currentUserType: 'student' | 'pro-student' | 'scad' | 'faculty';
}

const AppointmentDetailsModal: React.FC<AppointmentDetailsModalProps> = ({
  isOpen,
  onClose,
  appointment,
  onAccept,
  onReject,
  onStartCall,
  currentUserType
}) => {
  if (!isOpen) return null;
  
  const canAcceptReject = appointment.status === 'pending' &&
    ((currentUserType === 'pro-student' && appointment.participantType === 'scad') ||
     (currentUserType === 'scad' && appointment.participantType === 'pro-student'));
  
  const canStartCall = appointment.status === 'accepted' && appointment.isOnline;
  
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

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Appointment Details</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        
        <div className={styles.modalBody}>
          <div className={styles.statusBanner} style={{ backgroundColor: getStatusColor(appointment.status) }}>
            {getStatusLabel(appointment.status)}
          </div>
          
          <div className={styles.appointmentTitle}>
            <h3>{appointment.title}</h3>
          </div>
          
          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Date:</span>
              <span className={styles.detailValue}>{appointment.date}</span>
            </div>
            
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Time:</span>
              <span className={styles.detailValue}>{appointment.time}</span>
            </div>
            
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Participant:</span>
              <span className={styles.detailValue}>{appointment.participantName}</span>
            </div>
            
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Email:</span>
              <span className={styles.detailValue}>{appointment.participantEmail}</span>
            </div>
            
            {appointment.location && (
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Location:</span>
                <span className={styles.detailValue}>{appointment.location}</span>
              </div>
            )}
            
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Status:</span>
              <div className={styles.onlineStatus}>
                <span className={`${styles.statusIndicator} ${appointment.isOnline ? styles.online : styles.offline}`}></span>
                <span>{appointment.isOnline ? 'Online' : 'Offline'}</span>
              </div>
            </div>
          </div>
          
          <div className={styles.description}>
            <h4>Description</h4>
            <p>{appointment.description}</p>
          </div>
          
          <div className={styles.actionsContainer}>
            {canAcceptReject && (
              <>
                <button 
                  className={`${styles.actionButton} ${styles.acceptButton}`}
                  onClick={onAccept}
                >
                  Accept
                </button>
                <button 
                  className={`${styles.actionButton} ${styles.rejectButton}`}
                  onClick={onReject}
                >
                  Reject
                </button>
              </>
            )}
            
            {canStartCall && (
              <button 
                className={`${styles.actionButton} ${styles.callButton}`}
                onClick={onStartCall}
              >
                Start Video Call
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetailsModal;
