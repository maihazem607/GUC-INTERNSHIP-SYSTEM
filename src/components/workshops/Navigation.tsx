import React from 'react';
import Image from "next/image";
import styles from './Navigation.module.css';

const Navigation: React.FC = () => {
  return (
    <header className={styles.navBar}>
      <div className={styles.navLeft}>
        <div className={styles.logoContainer}>
          <Image src='/logos/GUCInternshipSystemLogo.png' alt="GUC Logo" width={100} height={100} style={{ margin: -13 }} />
        </div>
        <nav className={styles.mainNav}>
          <a href="#" className={styles.navLink}>Find job</a>
          <a href="#" className={styles.navLink}>Messages</a>
          <a href="#" className={styles.navLink}>Workshops</a>
          <a href="#" className={styles.navLink}>Community</a>
          <a href="#" className={styles.navLink}>FAQ</a>
        </nav>
      </div>
      <div className={styles.navRight}>
        <div className={styles.locationDisplay}>
          <span className={styles.locationIcon}>📍</span>
          <span>New York, NY</span>
        </div>
        <div className={styles.userControls}>
          <div className={styles.userAvatar}></div>
          <button className={styles.settingsButton}>⚙️</button>
          <button className={styles.notificationsButton}>🔔</button>
        </div>
      </div>
    </header>
  );
};

export default Navigation;