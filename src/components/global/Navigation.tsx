import React from "react";
import Image from "next/image";
import styles from "./Navigation.module.css";
import { MapPin, Settings, Bell } from "lucide-react";

interface NavigationProps {
  title?: string;
  logoSrc?: string;
  notificationCount?: number;
  onNotificationClick?: () => void;
}

export default function Navigation({
  title = "GUC Internship System",
  logoSrc = '/logos/GUCInternshipSystemLogo.png',
  notificationCount = 0,
  onNotificationClick
}: NavigationProps) {
  return (
    <header className={styles.navBar}>
      <div className={styles.navLeft}>
        <div className={styles.logoContainer}>
          <Image src={logoSrc} alt={title} width={150} height={150} style={{ margin: -13 }} />
        </div>
        <nav className={styles.mainNav}>
          <a href="#" className={styles.navLink}>Find job</a>
          <a href="/Appointments" className={styles.navLink}>Appointments</a>
          <a href="#" className={styles.navLink}>Messages</a>
          <a href="#" className={styles.navLink}>Hiring</a>
          <a href="#" className={styles.navLink}>Community</a>
          <a href="#" className={styles.navLink}>FAQ</a>
        </nav>
      </div>
      <div className={styles.navRight}>
        <div className={styles.locationDisplay}>
          <MapPin size={16} className={styles.locationIcon} color="#4c51bf" />
          <span>New York, NY</span>
        </div>
        <div className={styles.userControls}>
          <div className={styles.userAvatar}></div>
          <button className={styles.settingsButton} suppressHydrationWarning>
            <Settings size={18} color="#4c51bf" />
          </button>
          <button
            className={styles.notificationsButton}
            suppressHydrationWarning
            onClick={onNotificationClick}
            aria-label={notificationCount > 0 ? `${notificationCount} notifications` : "No notifications"}
          >
            <Bell size={18} color="#4c51bf" />
            {notificationCount > 0 && (
              <span className={styles.notificationBadge}>{notificationCount}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}