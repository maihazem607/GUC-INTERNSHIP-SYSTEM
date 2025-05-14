'use client';
import React, { useState } from 'react';
import { CheckCircle, Clock } from 'lucide-react';
import styles from './page.module.css';

interface Assessment {
  id: number;
  title: string;
  company: string;
  status: 'Available' | 'In Progress' | 'Completed';
  date: string;
  time: string;
  score?: number;
  logo?: string;
  posted?: boolean;
}

export default function AssessmentsPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([
    {
      id: 1,
      title: 'Frontend Developer Test',
      company: 'Adobe Creative Team',
      status: 'Available',
      date: 'June 15, 2023',
      time: 'June 15, 2023 10:00 AM EST',
      logo: '/logos/adobe.png',
    },
    {
      id: 2,
      title: 'React Coding Challenge',
      company: 'Facebook Engineers',
      status: 'In Progress',
      date: 'June 18, 2023',
      time: 'June 18, 2023 1:00 PM EST',
      logo: '/logos/facebook.png',
    },
    {
      id: 3,
      title: 'Cloud Architecture Quiz',
      company: 'Amazon AWS Team',
      status: 'Completed',
      date: 'June 10, 2023',
      time: 'June 10, 2023 11:00 AM EST',
      score: 85,
      logo: '/logos/aws.png',
      posted: false,
    },
    {
      id: 4,
      title: 'Machine Learning Basics',
      company: 'Google AI Team',
      status: 'Available',
      date: 'June 5, 2023',
      time: 'June 5, 2023 2:00 PM EST',
      logo: '/logos/google.png',
    },
    {
      id: 5,
      title: 'UI/UX Design Assessment',
      company: 'Airbnb Design Team',
      status: 'Completed',
      date: 'June 3, 2023',
      time: 'June 3, 2023 3:00 PM EST',
      score: 92,
      logo: '/logos/airbnb.png',
      posted: false,
    },
    {
      id: 6,
      title: 'iOS Development Test',
      company: 'Apple Developer Team',
      status: 'In Progress',
      date: 'June 20, 2023',
      time: 'June 20, 2023 1:00 PM EST',
      logo: '/logos/apple.png',
    },
    {
      id: 7,
      title: 'Azure Security Exam',
      company: 'Microsoft Azure Team',
      status: 'Available',
      date: 'June 12, 2023',
      time: 'June 12, 2023 10:00 AM EST',
      logo: '/logos/microsoft.png',
    },
    {
      id: 8,
      title: 'Microservices Evaluation',
      company: 'Netflix Engineering',
      status: 'Completed',
      date: 'June 25, 2023',
      time: 'June 25, 2023 9:00 AM EST',
      score: 78,
      logo: '/logos/netflix.png',
      posted: false,
    },
  ]);

  const handleStartAssessment = (id: number) => {
    alert(`Starting assessment ID: ${id}`);
    // Logic to start assessment can be added here
  };

  const handleViewScore = (id: number, score?: number) => {
    if (score) {
      alert(`Assessment ID: ${id} - Score: ${score}%`);
    } else {
      alert(`No score available for Assessment ID: ${id}`);
    }
  };

  const handlePostScore = (id: number) => {
    setAssessments(assessments.map(assessment =>
      assessment.id === id ? { ...assessment, posted: !assessment.posted } : assessment
    ));
    alert(`Score for assessment ID: ${id} has been ${assessments.find(a => a.id === id)?.posted ? 'removed from' : 'posted to'} profile`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>Online Assessments</h1>
        </div>
        <span className={styles.assessmentCount}>8 assessments</span>
      </div>

      <div className={styles.assessmentGrid}>
        {assessments.map((assessment) => (
          <div key={assessment.id} className={`${styles.assessmentCard} ${styles[`card${assessment.status}`]}`}>
            <div className={styles.cardHeader}>
              <span className={styles.date}>{assessment.date}</span>
              <div className={styles.statusBadges}>
                {assessment.status === 'Available' && <span className={styles.availableBadge}>Available</span>}
                {assessment.status === 'In Progress' && <span className={styles.inProgressBadge}>In Progress</span>}
                {assessment.status === 'Completed' && <span className={styles.completedBadge}>Completed</span>}
              </div>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.logoContainer}>
                {assessment.logo ? (
                  <img src={assessment.logo} alt={`${assessment.company} logo`} className={styles.logo} />
                ) : (
                  <span className={styles.logoPlaceholder}>?</span>
                )}
              </div>
              <div className={styles.assessmentInfo}>
                <p className={styles.company}>{assessment.company}</p>
                <h3 className={styles.assessmentTitle}>{assessment.title}</h3>
              </div>
            </div>
            <div className={styles.cardFooter}>
              <span className={styles.time}>{assessment.time}</span>
              {assessment.status === 'Available' && (
                <button className={styles.startButton} onClick={() => handleStartAssessment(assessment.id)}>
                  Start <Clock size={16} />
                </button>
              )}
              {assessment.status === 'Completed' && assessment.score && (
                <>
                  <button className={styles.viewScoreButton} onClick={() => handleViewScore(assessment.id, assessment.score)}>
                    View Score <CheckCircle size={16} />
                  </button>
                  <button
                    className={`${styles.postButton} ${assessment.posted ? styles.postedButton : ''}`}
                    onClick={() => handlePostScore(assessment.id)}
                  >
                    {assessment.posted ? 'Posted' : 'Post Score'}
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
 