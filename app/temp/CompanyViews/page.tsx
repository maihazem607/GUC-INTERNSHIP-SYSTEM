'use client';
import React, { useState } from 'react';
import { Eye } from 'lucide-react';
import styles from './page.module.css';

interface CompanyView {
  date: string;
  company: string;
  status: 'Viewed' | 'Pending' | 'Contacted';
  time: string;
  logo?: string;
}

export default function CompanyViewsPage() {
  const [views] = useState<CompanyView[]>([
    {
      date: 'June 15, 2023',
      company: 'Adobe Creative Team',
      status: 'Viewed',
      time: 'June 15, 2023 2:00 PM EST',
      logo: '/logos/adobe.png',
    },
    {
      date: 'June 18, 2023',
      company: 'Facebook Engineers',
      status: 'Contacted',
      time: 'June 18, 2023 1:00 PM EST',
      logo: '/logos/facebook.png',
    },
    {
      date: 'June 10, 2023',
      company: 'Amazon AWS Team',
      status: 'Viewed',
      time: 'June 10, 2023 11:00 AM EST',
      logo: '/logos/aws.png',
    },
    {
      date: 'June 5, 2023',
      company: 'Google AI Team',
      status: 'Pending',
      time: 'June 5, 2023 10:00 AM EST',
      logo: '/logos/google.png',
    },
    {
      date: 'June 3, 2023',
      company: 'Airbnb Design Team',
      status: 'Viewed',
      time: 'June 3, 2023 3:00 PM EST',
      logo: '/logos/airbnb.png',
    },
    {
      date: 'June 20, 2023',
      company: 'Apple Developer Team',
      status: 'Contacted',
      time: 'June 20, 2023 2:00 PM EST',
      logo: '/logos/apple.png',
    },
    {
      date: 'June 12, 2023',
      company: 'Microsoft Azure Team',
      status: 'Viewed',
      time: 'June 12, 2023 1:00 PM EST',
      logo: '/logos/microsoft.png',
    },
    {
      date: 'June 25, 2023',
      company: 'Netflix Engineering',
      status: 'Pending',
      time: 'June 25, 2023 10:00 AM EST',
      logo: '/logos/netflix.png',
    },
  ]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>Company Views</h1>
        </div>
        <span className={styles.viewCount}>8 views</span>
      </div>

      <div className={styles.viewGrid}>
        {views.map((view, index) => (
          <div key={index} className={`${styles.viewCard} ${styles[`card${view.status}`]}`}>
            <div className={styles.cardHeader}>
              <span className={styles.date}>{view.date}</span>
              <div className={styles.statusBadges}>
                {view.status === 'Viewed' && <span className={styles.viewedBadge}>Viewed</span>}
                {view.status === 'Contacted' && <span className={styles.contactedBadge}>Contacted</span>}
                {view.status === 'Pending' && <span className={styles.pendingBadge}>Pending</span>}
              </div>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.logoContainer}>
                {view.logo ? (
                  <img src={view.logo} alt={`${view.company} logo`} className={styles.logo} />
                ) : (
                  <span className={styles.logoPlaceholder}>?</span>
                )}
              </div>
              <div className={styles.viewInfo}>
                <p className={styles.company}>{view.company}</p>
              </div>
            </div>
            <div className={styles.cardFooter}>
              <span className={styles.time}>{view.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}