import React from 'react';
import Image from 'next/image';
import styles from './WorkshopCard.module.css';
import { Workshop } from './types-enhanced';

interface WorkshopCardProps {
  workshop: Workshop;
  onViewDetails: (workshop: Workshop) => void;
}

const getCardBackground = (id: number): string => {
  const colors = [
    '#ffe8f0', '#e8f3ff', '#e8ffe8', '#fff0e8', '#f0e8ff',
    '#e8fff0', '#fff8e8', '#e8f0ff', '#ffe8e8', '#e8ffea',
    '#f0ffe8', '#fff0f0'
  ];
  return colors[id % colors.length];
};

const WorkshopCard: React.FC<WorkshopCardProps> = ({
  workshop,
  onViewDetails
}) => {
  const cardBackground = getCardBackground(workshop.id);

  return (
    <div className={styles.card} onClick={() => onViewDetails(workshop)}>
      <div className={styles.cardInner} style={{ backgroundColor: cardBackground }}>
        <div className={styles.cardDate}>
          <span>{workshop.date}</span>
          {workshop.type === 'live' && workshop.status === 'ongoing' && (
            <div className={styles.liveIndicator}>LIVE</div>
          )}
        </div>
        
        <div className={styles.hostInfo}>
          <span className={styles.hostName}>{workshop.host}</span>
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
          <span className={styles.workshopTag}>{workshop.status}</span>
        </div>
      </div>
      
      <div className={styles.cardFooter}>
        <div className={styles.workshopMeta}>
          <div className={styles.duration}>{workshop.duration}</div>
          <div className={styles.time}>{workshop.time}</div>
        </div>
        <button 
          className={styles.detailsButton}
          onClick={() => onViewDetails(workshop)}
        >
          Details
        </button>
      </div>
    </div>
  );
};

export default WorkshopCard;