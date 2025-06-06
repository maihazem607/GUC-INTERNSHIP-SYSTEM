import React from 'react';
import { Company } from './types';
import styles from './CompanyCard.module.css';
import { Building, MapPin, Users, Briefcase, Star } from 'lucide-react';

interface Props {
  company: Company;
  onViewDetails: () => void;
  onSave: () => void;
}

const CompanyCard: React.FC<Props> = ({ company, onViewDetails, onSave }) => {
  return (
    <div className={styles.card}>
      <div className={styles.matchScoreBadge}>
        <span className={styles.matchPercentage}>{company.matchScore}% Match</span>
      </div>

      <div className={styles.logoContainer}>
        <img src={company.logo} alt={`${company.name} logo`} className={styles.logo} />
      </div>

      <div className={styles.header}>
        <h3 className={styles.companyName}>{company.name}</h3>
        <div className={styles.ratingContainer}>
          <span className={styles.ratingValue}>{company.rating.toFixed(1)}</span>
          <div className={styles.starRating}>
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                size={14}
                fill={i < Math.floor(company.rating) ? "#FFD700" : i < company.rating ? "#FFD700" : "none"}
                color={i < Math.floor(company.rating) ? "#FFD700" : "#D1D5DB"}
                className={`${styles.star} ${i < Math.floor(company.rating) ? styles.filled : i < company.rating ? styles.halfFilled : ''}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className={styles.details}>
        <div className={styles.detailItem}>
          <span className={styles.icon}><Building size={16} color="#4c51bf" /></span>
          <span>{company.industry}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.icon}><MapPin size={16} color="#4c51bf" /></span>
          <span>{company.location}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.icon}><Users size={16} color="#4c51bf" /></span>
          <span>{company.internshipCount} Past Interns</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.icon}><Briefcase size={16} color="#4c51bf" /></span>
          <span>{company.openPositions} Open Positions</span>
        </div>
      </div>

      <div className={styles.recommendationBadge} data-level={company.recommendationLevel.toLowerCase()}>
        {company.recommendationLevel} Recommendation
      </div>

      <div className={styles.techTags}>
        {company.technologiesUsed.slice(0, 3).map((tech, index) => (
          <span key={index} className={styles.techTag}>{tech}</span>
        ))}
        {company.technologiesUsed.length > 3 && (
          <span className={styles.moreTechTag}>+{company.technologiesUsed.length - 3}</span>
        )}
      </div>

      <p className={styles.description}>
        {company.description.length > 120
          ? `${company.description.substring(0, 120)}...`
          : company.description
        }
      </p>

      <div className={styles.actions}>
        <button
          className={`${styles.button} ${styles.detailsButton}`}
          onClick={onViewDetails}
        >
          View Details
        </button>
        <button
          className={`${styles.button} ${styles.saveButton}`}
          onClick={onSave}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default CompanyCard;
