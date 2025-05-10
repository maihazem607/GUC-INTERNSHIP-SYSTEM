import Image from "next/image";
import styles from "./Navigation.module.css";

interface NavigationProps {
  title?: string;
  logoSrc?: string;
  notificationCount?: number;
}

export default function Navigation({ title = "GUC Internship System", logoSrc = '/logos/GUCInternshipSystemLogo.png', notificationCount = 0 }: NavigationProps) {
  return (
    <header className={styles.navBar}>
      <div className={styles.navLeft}>
        <div className={styles.logoContainer}>
          <Image src={logoSrc} alt={title} width={150} height={150} style={{ margin: -13 }} />
        </div>        <nav className={styles.mainNav}>
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
          <span className={styles.locationIcon}>📍</span>
          <span>New York, NY</span>
        </div>
        <div className={styles.userControls}>          <div className={styles.userAvatar}></div>
          <button className={styles.settingsButton} suppressHydrationWarning>⚙️</button>
          <button className={styles.notificationsButton} suppressHydrationWarning>
            🔔
            {notificationCount > 0 && (
              <span className={styles.notificationBadge}>{notificationCount}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}