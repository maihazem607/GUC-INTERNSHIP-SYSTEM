import React from 'react';
import Image from 'next/image';
import styles from './SCADWorkshopDetailedView.module.css';
import { Workshop, AgendaItem } from './types-enhanced';
import { 
  Calendar, Clock, Users, MapPin, User, BookOpen, 
  Share2, MessageCircle, CheckCircle, XCircle
} from 'lucide-react';

interface SCADWorkshopDetailedViewProps {
  workshop: Workshop;
  onClose: () => void;
  onEdit: (workshop: Workshop) => void;
}

const SCADWorkshopDetailedView: React.FC<SCADWorkshopDetailedViewProps> = ({
  workshop,
  onClose,
  onEdit
}) => {
  // Helper to format date range
  const formatDateRange = () => {
    if (!workshop.startDate && !workshop.endDate) {
      return workshop.date;
    }
    
    const startDate = workshop.startDate || workshop.date;
    const endDate = workshop.endDate || workshop.date;
    
    if (startDate === endDate) {
      return startDate;
    }
    
    return `${startDate} to ${endDate}`;
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
        
        <div className={styles.statusBar}>
          <div className={`${styles.statusBadge} ${styles[workshop.status]}`}>
            {workshop.status}
          </div>
          <div className={`${styles.typeBadge} ${styles[workshop.type]}`}>
            {workshop.type === 'live' ? 'Live Session' : 'Recorded'}
          </div>
          {workshop.isPublished === false && (
            <div className={styles.draftBadge}>Draft</div>
          )}
        </div>
        
        <div className={styles.modalInfo}>
          <div className={styles.modalInfoItem}>
            <div className={styles.modalInfoIcon}>
              <Calendar size={18} />
            </div>
            <div>
              <div className={styles.modalInfoLabel}>Date</div>
              <div className={styles.modalInfoValue}>{formatDateRange()}</div>
            </div>
          </div>
          
          <div className={styles.modalInfoItem}>
            <div className={styles.modalInfoIcon}>
              <Clock size={18} />
            </div>
            <div>
              <div className={styles.modalInfoLabel}>Time</div>
              <div className={styles.modalInfoValue}>{workshop.time}</div>
            </div>
          </div>
          
          <div className={styles.modalInfoItem}>
            <div className={styles.modalInfoIcon}>
              <Clock size={18} />
            </div>
            <div>
              <div className={styles.modalInfoLabel}>Duration</div>
              <div className={styles.modalInfoValue}>{workshop.duration}</div>
            </div>
          </div>
          
          {workshop.registrationLimit && (
            <div className={styles.modalInfoItem}>
              <div className={styles.modalInfoIcon}>
                <Users size={18} />
              </div>
              <div>
                <div className={styles.modalInfoLabel}>Registration Limit</div>
                <div className={styles.modalInfoValue}>
                  {workshop.registrationCount || 0}/{workshop.registrationLimit}
                </div>
              </div>
            </div>
          )}
          
          {workshop.location && (
            <div className={styles.modalInfoItem}>
              <div className={styles.modalInfoIcon}>
                <MapPin size={18} />
              </div>
              <div>
                <div className={styles.modalInfoLabel}>Location</div>
                <div className={styles.modalInfoValue}>{workshop.location}</div>
              </div>
            </div>
          )}
        </div>
        
        <div className={styles.modalSection}>
          <h3 className={styles.sectionTitle}>About this workshop</h3>
          <p className={styles.modalDescription}>{workshop.description}</p>
        </div>
        
        {workshop.speakerBio && (
          <div className={styles.modalSection}>
            <h3 className={styles.sectionTitle}>Speaker Information</h3>
            <div className={styles.speakerInfo}>
              <div className={styles.speakerIcon}>
                <User size={24} />
              </div>
              <div className={styles.speakerBio}>
                {workshop.speakerBio}
              </div>
            </div>
          </div>
        )}
        
        {workshop.agenda && workshop.agenda.length > 0 && (
          <div className={styles.modalSection}>
            <h3 className={styles.sectionTitle}>Workshop Agenda</h3>
            <div className={styles.agenda}>
              {workshop.agenda.map((item, index) => (
                <div key={item.id} className={styles.agendaItem}>
                  <div className={styles.agendaTime}>
                    <div className={styles.agendaTimeBox}>
                      {item.startTime}
                    </div>
                    <div className={styles.agendaTimeDivider}></div>
                    <div className={styles.agendaTimeBox}>
                      {item.endTime}
                    </div>
                  </div>
                  <div className={styles.agendaContent}>
                    <h4 className={styles.agendaTitle}>{item.title || `Session ${index + 1}`}</h4>
                    {item.description && (
                      <p className={styles.agendaDescription}>{item.description}</p>
                    )}
                    {item.presenter && (
                      <div className={styles.agendaPresenter}>
                        <User size={14} />
                        <span>{item.presenter}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className={styles.modalSection}>
          <h3 className={styles.sectionTitle}>Visibility Status</h3>
          <div className={styles.visibilityStatus}>
            {workshop.isPublished !== false ? (
              <div className={styles.publishedStatus}>
                <CheckCircle size={18} color="#16a34a" />
                <span>This workshop is published and visible to students</span>
              </div>
            ) : (
              <div className={styles.draftStatus}>
                <XCircle size={18} color="#ca8a04" />
                <span>This workshop is a draft and not visible to students</span>
              </div>
            )}
          </div>
        </div>
        
        {workshop.createdAt && (
          <div className={styles.metadataSection}>
            <div className={styles.metadataItem}>
              <span>Created:</span> {workshop.createdAt}
              {workshop.createdBy && <span> by {workshop.createdBy}</span>}
            </div>
            {workshop.lastModifiedAt && (
              <div className={styles.metadataItem}>
                <span>Last Modified:</span> {workshop.lastModifiedAt}
                {workshop.lastModifiedBy && <span> by {workshop.lastModifiedBy}</span>}
              </div>
            )}
          </div>
        )}
        
        <div className={styles.modalActions}>
          <button
            className={styles.editButton}
            onClick={() => onEdit(workshop)}
          >
            Edit Workshop
          </button>
          <button
            className={styles.closeActionButton}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SCADWorkshopDetailedView;
