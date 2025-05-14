import React from 'react';
import Image from 'next/image';
import styles from '../../../src/components/workshops/WorkshopCard.module.css';
import { Workshop } from './types';

interface SCADWorkshopCardProps {
  workshop: Workshop;
  onViewDetails?: (workshop: Workshop) => void; // Made optional
}

const getCardBackground = (id: number): string => {
  const colors = [
    '#ffe8f0', '#e8f3ff', '#e8ffe8', '#fff0e8', '#f0e8ff',
    '#e8fff0', '#fff8e8', '#e8f0ff', '#ffe8e8', '#e8ffea',
    '#f0ffe8', '#fff0f0'
  ];
  return colors[id % colors.length];
};

const SCADWorkshopCard: React.FC<SCADWorkshopCardProps> = ({
  workshop,
  onViewDetails
}) => {
  const cardBackground = getCardBackground(workshop.id);

  return (
    <div className={styles.card}>
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
        <div className={styles.workshopMeta} style={{ width: '100%' }}>
          <div className={styles.duration}>{workshop.duration}</div>
          <div className={styles.time}>{workshop.time}</div>
        </div>
        {/* Details button removed */}
      </div>
    </div>
  );
};

export default SCADWorkshopCard;
