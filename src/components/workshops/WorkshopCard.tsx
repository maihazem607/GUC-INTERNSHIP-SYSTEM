import React from 'react';
import Image from 'next/image';
import styles from './WorkshopCard.module.css';
import { Workshop } from './types';

interface WorkshopCardProps {
  workshop: Workshop;
  isStarred: boolean;
  toggleStar: (id: number) => void;
  showDetails: (workshop: Workshop) => void;
  onRegister: (workshop: Workshop) => void;
  onJoinLive: (workshop: Workshop) => void;
  onWatch: (workshop: Workshop) => void;
  cardBackground: string;
}

const WorkshopCard: React.FC<WorkshopCardProps> = ({
  workshop,
  isStarred,
  toggleStar,
  showDetails,
  onRegister,
  onJoinLive,
  onWatch,
  cardBackground
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardInner} style={{ backgroundColor: cardBackground }}>
        <div className={styles.cardDate}>
          <span>{workshop.date}</span>
          <button 
            className={isStarred ? styles.bookmarkActive : styles.bookmark}
            onClick={() => toggleStar(workshop.id)}
          >
            {isStarred ? '⭐' : '☆'}
          </button>
        </div>
        
        <div className={styles.hostInfo}>
          <span className={styles.hostName}>{workshop.host}</span>
          {workshop.type === 'live' && workshop.status === 'ongoing' && (
            <div className={styles.liveIndicator}>LIVE</div>
          )}
        </div>
        
        <div className={styles.workshopTitleContainer}>
          <h3 className={styles.workshopTitle}>{workshop.title}</h3>
          {workshop.logo && (
            <div className={styles.hostLogo}>
              <Image src={workshop.logo} alt={`${workshop.host} logo`} width={30} height={30} />
            </div>
          )}
        </div>
        
        <div className={styles.workshopTags}>
          <span className={styles.workshopTag}>{workshop.type}</span>
          <span className={styles.workshopTag}>{workshop.category}</span>
          <span className={styles.workshopTag}>{workshop.status}</span>
        </div>
      </div>
      
      <div className={styles.cardFooter}>
        <div className={styles.workshopMeta}>
          <div className={styles.duration}>{workshop.duration}</div>
          <div className={styles.time}>{workshop.time}</div>
        </div>
        <div className={styles.cardActions}>
          {!workshop.isRegistered && workshop.status === 'upcoming' && (
            <button 
              className={styles.registerButton}
              onClick={() => onRegister(workshop)}
            >
              Register
            </button>
          )}
          
          {workshop.isRegistered && workshop.type === 'live' && workshop.status === 'ongoing' && (
            <button 
              className={styles.joinButton}
              onClick={() => onJoinLive(workshop)}
            >
              Join
            </button>
          )}
          
          {workshop.isRegistered && workshop.type === 'recorded' && (
            <button 
              className={styles.joinButton}
              onClick={() => onWatch(workshop)}
            >
              Watch
            </button>
          )}
          
          <button 
            className={styles.detailsButton}
            onClick={() => showDetails(workshop)}
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkshopCard;