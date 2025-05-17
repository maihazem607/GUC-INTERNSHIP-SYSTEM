'use client';
import React, { useState, useEffect } from 'react';
import { GraduationCap, Video, X } from 'lucide-react';
import styles from './page.module.css';   
import ProStudentNavigationMenu from '../Navigation/ProStudentNavigationMenu';

interface MajorInfo {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  videoSrc: string;
}

export default function InternshipRequirements() {
  const [mounted, setMounted] = useState(false);
  const [selectedMajor, setSelectedMajor] = useState<MajorInfo | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const majors: MajorInfo[] = [
    {
      id: 'engineering',
      name: 'Engineering',
      icon: <GraduationCap size={38} />,
      color: '#3B82F6',
      description: 'Engineering internships should focus on practical application of engineering principles in real-world settings, such as software development, electrical systems, mechanical design, or civil engineering projects.',
      videoSrc: 'https://youtu.be/BCobr9OnqAc'
    },
    {
      id: 'pharmacy',
      name: 'Pharmacy',
      icon: <GraduationCap size={38} />,
      color: '#34D399',
      description: 'Pharmacy internships should involve pharmaceutical practice, patient care, or research in settings such as hospitals, community pharmacies, or pharmaceutical companies.',
      videoSrc: 'https://youtu.be/EjE2YN_OyVI'
    },
    {
      id: 'applied-arts',
      name: 'Applied Arts',
      icon: <GraduationCap size={38} />,
      color: '#A855F7',
      description: 'Applied Arts internships should provide experience in creative design, artistic production, media creation, or other creative fields related to your specific area of study.',
      videoSrc: 'https://youtu.be/csTe_jKrZKY'
    },
    {
      id: 'management',
      name: 'Management',
      icon: <GraduationCap size={38} />,
      color: '#FBBF24',
      description: 'Management internships should develop skills in leadership, organization, and business operations through experience in corporate settings, non-profits, or entrepreneurial ventures.',
      videoSrc: 'https://youtu.be/gFtH8KCQzP4'
    },
    {
      id: 'business-informatics',
      name: 'Business Informatics',
      icon: <GraduationCap size={38} />,
      color: '#EF4444',
      description: 'Business Informatics internships should focus on IT systems in business contexts, such as data analytics, information systems implementation, or digital transformation projects.',
      videoSrc: 'https://youtu.be/v6GfmPrJMEo'
    },
    {
      id: 'law',
      name: 'Law',
      icon: <GraduationCap size={38} />,
      color: '#6366F1',
      description: 'Law internships should provide practical legal experience in various fields of law, including positions at law firms, corporate legal departments, or judicial clerkships.',
      videoSrc: 'https://youtu.be/E9cJUuYhemY'
    }
  ];

  const handleMajorSelect = (major: MajorInfo) => {
    setSelectedMajor(major);
  };

  const handleCloseVideo = () => {
    setSelectedMajor(null);
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.split('youtu.be/')[1] || url.split('v=')[1]?.split('&')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  };
  
  if (!mounted) {
    return null;
  }
  
  return (
    <div className={styles.pageContainer}>      {/* Global Navigation for Pro Student */}
      <ProStudentNavigationMenu />

      <main className={styles.mainContent}>

        <div className={styles.header}>
          <div className={styles.titleContainer}>
            <GraduationCap className={styles.titleIcon} size={30} />
            <h1 className={styles.title}>Internship Requirements by Major</h1>
          </div>
          <p className={styles.subtitle}>
            Select your major to learn more about what types of internships count towards your degree requirements.
            Each field has specific criteria that must be met for your internship to qualify.
          </p>
        </div>

        <div className={styles.majorsGrid}>
          {majors.map((major) => (
            <button
              key={major.id}
              className={styles.majorButton}
              onClick={() => handleMajorSelect(major)}
              style={{ '--major-color': major.color, '--major-color-light': `${major.color}40` } as React.CSSProperties}
            >
              <div 
                className={styles.majorIcon} 
                style={{ backgroundColor: `${major.color}15`, color: major.color }}
              >
                {major.icon}
              </div>
              <span className={styles.majorName}>{major.name}</span>
            </button>
          ))}
        </div>
        
        {selectedMajor && (
          <div className={styles.videoOverlay}>
            <div className={styles.videoContainer}>              
              <div className={styles.videoHeader}>                
                <div className={styles.videoHeaderContent}>
                  <h2 className={styles.videoTitle}>
                    {selectedMajor.name} Internship Requirements
                  </h2>
                  <Video size={40} className={styles.videoPlaceholder} />
                </div>
                <button className={styles.closeButton} onClick={handleCloseVideo} aria-label="Close">
                  <X size={24} />
                </button>
              </div>
              
              <div className={styles.videoWrapper}>
                <iframe
                  className={styles.video}
                  src={getYouTubeEmbedUrl(selectedMajor.videoSrc)}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={`${selectedMajor.name} Internship Video`}
                />
                
                <div className={styles.approvedTypes}>
                  <h3 className={styles.approvedTypesTitle}>Approved Internship Types</h3>
                  <ul className={styles.approvedTypesList}>
                    <li>Industry placements at approved organizations</li>
                    <li>Research positions related to your field of study</li>
                    <li>Practical training under qualified supervision</li>
                    <li>Field work at accredited institutions</li>
                    <li>Professional development programs with structured learning outcomes</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
        </main>
      </div>
  
  );
}
