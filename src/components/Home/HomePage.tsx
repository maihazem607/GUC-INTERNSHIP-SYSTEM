"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Briefcase, GraduationCap, ShieldCheck } from 'lucide-react';
import styles from './HomePage.module.css';
import Navigation from '../global/Navigation';
import Image from 'next/image';

interface UserType {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  colorClass: string;
  bgColor: string;
}

const HomePage: React.FC = () => {
  const [hoveredUser, setHoveredUser] = useState<string | null>(null);
  const router = useRouter();

  // Color palette for user cards and UI elements
  const colors = [
    '#ffe8f0', '#e8f3ff', '#e8ffe8', '#fff0e8', '#f0e8ff',
    '#e8fff0', '#fff8e8', '#e8f0ff', '#ffe8e8', '#e8ffea',
    '#f0ffe8', '#fff0f0'
  ]; const userTypes: UserType[] = [
    {
      id: 'student',
      title: 'Student',
      icon: <GraduationCap size={48} className={styles.icon} />,
      colorClass: styles.bgPurple,
      bgColor: colors[1], // Light blue
      description: 'Access internship opportunities and manage applications',
    },
    {
      id: 'company',
      title: 'Company',
      icon: <Briefcase size={48} className={styles.icon} />,
      colorClass: styles.bgGold,
      bgColor: colors[3], // Light orange
      description: 'Post internships and review student applications',
    },
    {
      id: 'faculty',
      title: 'Faculty Academic',
      icon: <User size={48} className={styles.icon} />,
      colorClass: styles.bgLavender,
      bgColor: colors[2], // Light green
      description: 'Supervise student internships and approve reports',
    },
    {
      id: 'admin',
      title: 'SCAD Officer',
      icon: <ShieldCheck size={48} className={styles.icon} />,
      colorClass: styles.bgGray,
      bgColor: colors[4], // Light purple
      description: 'Administer system and manage all users',
    }
  ];

  const handleUserClick = (userId: string) => {
    if (userId === 'company') {
      router.push('/CompanyLogin');
    } else if (userId === 'student') {
      router.push("/StudentLogin");
    } else if (userId === 'faculty') {
      router.push("/FacultyLogin");
    } else if (userId === 'admin') {
      router.push("/SCADLogin");
    } else {
      console.log(`User selected: ${userId}`);
    }
  }; return (
    <div className={styles.pageContainer}>
      {/* Use the global Navigation component */}
      <Navigation title="GUC Internship System" />

      {/* Main Content */}
      <div className={styles.contentWrapper}>
        <main className={styles.mainContent}>          
          <div className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 className={styles.title}>Welcome to GUC Internship System</h1>
            <p className={styles.subtitle}>Connecting Students, Companies, and Faculty for Successful Internships</p>

            <div className={styles.heroCTA}>
              <p className={styles.ctaText}>Get started by selecting your role below</p>
              <div className={styles.arrowDown}></div>
            </div>
          </div>
          <div className={styles.heroImageContainer}>
            <Image
              src="/assets/Jobhunt.svg"
              alt="Job Hunt Illustration"
              width={600}
              height={500}
              className={styles.heroImage}
            />
          </div>
        </div>

          <section className={styles.userSelection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Who Are You?</h2>
              <p className={styles.sectionDescription}>Select your user type to continue</p>
            </div>

            <div className={styles.cards}>
              {userTypes.map(user => (
                <div
                  key={user.id}
                  className={styles.userCard}
                  onMouseEnter={() => setHoveredUser(user.id)}
                  onMouseLeave={() => setHoveredUser(null)}
                >
                  <div className={styles.cardContent}>
                    <div
                      className={`${styles.iconContainer} ${user.colorClass}`}
                      onClick={() => handleUserClick(user.id)}
                    >
                      {user.icon}
                    </div>
                    <h3 className={styles.userTitle}>{user.title}</h3>
                    <p className={styles.userDescription}>
                      {user.description}
                    </p>
                    <button
                      className={styles.actionButton}
                      onClick={() => handleUserClick(user.id)}
                    >
                      Continue as {user.title}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>          <section className={styles.infoSection}>
            <div className={styles.infoCard}>
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
            </div>
          </section>
        </main>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
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

export default HomePage;