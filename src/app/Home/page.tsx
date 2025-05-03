"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // ✅ Import for navigation
import { User, Briefcase, GraduationCap, ShieldCheck } from 'lucide-react';
import styles from './Homepage.module.css';

interface UserType {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  colorClass: string;
}

const Home: React.FC = () => {
  const [hoveredUser, setHoveredUser] = useState<string | null>(null);
  const router = useRouter(); // ✅ Hook for navigation

  const userTypes: UserType[] = [
    {
      id: 'student',
      title: 'Student',
      icon: <GraduationCap size={48} className={styles.icon} />,
      colorClass: styles.bgPurple,
      description: 'Access internship opportunities and manage applications',
    },
    {
      id: 'company',
      title: 'Company',
      icon: <Briefcase size={48} className={styles.icon} />,
      colorClass: styles.bgGold,
      description: 'Post internships and review student applications',
    },
    {
      id: 'faculty',
      title: 'Faculty Academic',
      icon: <User size={48} className={styles.icon} />,
      colorClass: styles.bgLavender,
      description: 'Supervise student internships and approve reports',
    },
    {
      id: 'admin',
      title: 'SCAD Officer',
      icon: <ShieldCheck size={48} className={styles.icon} />,
      colorClass: styles.bgGray,
      description: 'Administer system and manage all users',
    }
  ];

  const handleUserClick = (userId: string) => {
    if (userId === 'company') {
      router.push('/Registration'); 
    } else if (userId === 'student') {
      router.push("/StudentLogin"); }
      else if (userId === 'faculty') {
      router.push("/FacultyLogin"); }
      else if (userId === 'admin') {  
      router.push("/SCADLogin"); }
    else {
      console.log(`User selected: ${userId}`);
    }
  };

  

  return (
    <div className={styles.home}>
      {/* Header */}
      <header className={styles.header}>
        <div className={`${styles.container} ${styles.headerContainer}`}>
          <div className={styles.logoContainer}>
            <img src="/logo.png" alt="GUC Logo" className={styles.logo} />
            <span className={styles.siteTitle}>GUC Internship System</span>
          </div>
          <nav>
            <ul className={styles.navLinks}>
              <li><a href="#" className={styles.navLink}>Home</a></li>
              <li><a href="#" className={styles.navLink}>About</a></li>
              <li><a href="#" className={styles.navLink}>Support</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className={styles.main}>
        <section className={styles.welcome}>
          <h1 className={styles.title}>Welcome to GUC Internship System</h1>
          <p className={styles.subtitle}>Connecting Students, Companies, and Faculty for Successful Internships</p>
        </section>

        <section className={styles.selection}>
          <h2 className={styles.sectionTitle}>Who Are You?</h2>
          <div className={styles.cards}>
            {userTypes.map(user => (
              <div
                key={user.id}
                className={styles.userTypeCard}
                onMouseEnter={() => setHoveredUser(user.id)}
                onMouseLeave={() => setHoveredUser(null)}
              >
                <div
                  className={`${styles.iconContainer} ${user.colorClass} ${hoveredUser === user.id ? styles.hovered : ''}`}
                  onClick={() => handleUserClick(user.id)}
                >
                  {user.icon}
                </div>
                <button className={styles.userButton} onClick={() => handleUserClick(user.id)}>
                  {user.title}
                </button>
                {hoveredUser === user.id && (
                  <div className={styles.tooltip}>{user.description}</div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className={styles.infoCard}>
          <div className={styles.infoContent}>
            <div className={styles.infoIconContainer}>
              <Briefcase className={styles.infoIcon} />
            </div>
            <div className={styles.infoText}>
              <h3 className={styles.infoTitle}>Ready to get started?</h3>
              <p className={styles.infoDescription}>
                Select your user type above to access specialized features designed for your role in the internship process.
              </p>
              <p className={styles.infoDescription}>
                Need help deciding? Contact our support team for assistance.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={`${styles.container} ${styles.footerContainer}`}>
          <p>© {new Date().getFullYear()} GUC Internship System</p>
          <div className={styles.footerLinks}>
            <a href="#" className={styles.footerLink}>Terms</a>
            <a href="#" className={styles.footerLink}>Privacy</a>
            <a href="#" className={styles.footerLink}>Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
