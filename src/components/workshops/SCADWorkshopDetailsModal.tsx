import React from 'react';
import Image from "next/image";
import styles from "./WorkshopDetailsModal.module.css";
import { Workshop } from './types-enhanced';

interface SCADDetailsModalProps {
  workshop: Workshop;
  onClose: () => void;
}

const SCADWorkshopDetailsModal: React.FC<SCADDetailsModalProps> = ({
  workshop,
  onClose
}) => {
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
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = '/logos/GUCInternshipSystemLogo.png';
                }}
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
        
        {/* Display speaker bio if available */}
        {workshop.speakerBio && (
          <div className={styles.modalSection}>
            <h3 className={styles.sectionTitle}>Speaker Information</h3>
            <p className={styles.modalDescription}>{workshop.speakerBio}</p>
          </div>
        )}
        
        {/* Display agenda if available */}
        {workshop.agenda && workshop.agenda.length > 0 && (
          <div className={styles.modalSection}>
            <h3 className={styles.sectionTitle}>Workshop Agenda</h3>
            <div className={styles.agendaList}>
              {workshop.agenda.map(item => (
                <div key={item.id} className={styles.agendaItem}>
                  <div className={styles.agendaTime}>
                    {item.startTime} - {item.endTime}
                  </div>
                  <div className={styles.agendaContent}>
                    <h4>{item.title}</h4>
                    {item.description && <p>{item.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className={styles.modalActions}>
          <button
            type="button"
            onClick={onClose}
            className={styles.cancelBtn}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SCADWorkshopDetailsModal;
