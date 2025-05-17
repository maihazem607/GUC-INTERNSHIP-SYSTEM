import React from 'react';
import styles from './StatsCard.module.css';
import { BarChart2, Clock, Award, TrendingUp, FileText } from 'lucide-react';

// Define the types of statistics we can show
export type StatType = 
  | 'reports' 
  | 'reviewTime' 
  | 'courses' 
  | 'companies' 
  | 'internships';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  type: StatType;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onClick?: () => void;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  type,
  trend,
  onClick
}) => {
  // Function to get the appropriate icon based on stat type
  const getIcon = () => {
    switch (type) {
      case 'reports':
        return <FileText size={24} />;
      case 'reviewTime':
        return <Clock size={24} />;
      case 'courses':
        return <Award size={24} />;
      case 'companies':
        return <BarChart2 size={24} />;
      case 'internships':
        return <TrendingUp size={24} />;
      default:
        return <BarChart2 size={24} />;
    }
  };

  // Function to get appropriate color class based on stat type
  const getColorClass = () => {
    switch (type) {
      case 'reports':
        return styles.blueCard;
      case 'reviewTime':
        return styles.greenCard;
      case 'courses':
        return styles.purpleCard;
      case 'companies':
        return styles.orangeCard;
      case 'internships':
        return styles.tealCard;
      default:
        return '';
    }
  };

  return (
    <div 
      className={`${styles.statsCard} ${getColorClass()}`} 
      onClick={onClick}
    >
      <div className={styles.cardHeader}>
        <div className={styles.iconContainer}>
          {getIcon()}
        </div>
        <h3 className={styles.title}>{title}</h3>
      </div>
      <div className={styles.cardContent}>
        <span className={styles.value}>{value}</span>
        {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
      </div>
      {trend && (
        <div className={styles.trendContainer}>
          <div className={`${styles.trend} ${trend.isPositive ? styles.positive : styles.negative}`}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </div>
          <span className={styles.trendPeriod}>vs last cycle</span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;