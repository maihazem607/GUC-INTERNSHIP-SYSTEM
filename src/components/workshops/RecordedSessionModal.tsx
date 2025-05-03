import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import styles from './RecordedSessionModal.module.css';
import { Workshop } from './types';

interface RecordedSessionModalProps {
  workshop: Workshop;
  onClose: () => void;
  videoProgress: number;
  isPlaying: boolean;
  notes: string;
  setNotes: React.Dispatch<React.SetStateAction<string>>;
  rating: number;
  setRating: React.Dispatch<React.SetStateAction<number>>;
  feedback: string;
  setFeedback: React.Dispatch<React.SetStateAction<string>>;
  togglePlayPause: () => void;
  addNotification: (message: string) => void;
  submitFeedback: () => void;
  generateCertificate: () => void;
}

const RecordedSessionModal: React.FC<RecordedSessionModalProps> = ({
  workshop,
  onClose,
  videoProgress,
  isPlaying,
  notes,
  setNotes,
  rating,
  setRating,
  feedback,
  setFeedback,
  togglePlayPause,
  addNotification,
  submitFeedback,
  generateCertificate
}) => {
  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{workshop.title}</h2>
          <div className={styles.modalHost}>
            {workshop.logo && (
              <Image 
                src={workshop.logo} 
                alt={`${workshop.host} logo`} 
                width={40} 
                height={40} 
                className={styles.modalHostLogo}
              />
            )}
            <span className={styles.modalHostName}>{workshop.host}</span>
          </div>
        </div>
        
        {/* Video Placeholder */}
        <div className={styles.videoPlaceholder}>
          <div className={styles.videoContent}>
            <div className={styles.videoTitle}>
              {isPlaying ? 'Now Playing: ' : 'Paused: '} {workshop.title}
            </div>
            <div 
              className={styles.playButton}
              onClick={togglePlayPause}
            >
              {isPlaying ? '⏸' : '▶️'}
            </div>
          </div>
        </div>
        
        {/* Video Controls */}
        <div className={styles.mediaControls}>
          <button 
            className={isPlaying ? styles.pauseButton : styles.playButton}
            onClick={togglePlayPause}
          >
            {isPlaying ? '⏸' : '▶️'}
          </button>
          <div className={styles.progressBarContainer}>
            <div className={styles.progressBar}>
              <div 
                className={styles.progress} 
                style={{ width: `${videoProgress}%` }}
              ></div>
            </div>
            <span className={styles.timeDisplay}>
              {Math.floor(videoProgress / 100 * parseInt(workshop.duration.split(' ')[0]))}:
              {String(Math.floor((videoProgress / 100 * parseInt(workshop.duration.split(' ')[0]) % 1) * 60)).padStart(2, '0')} 
              / {workshop.duration}
            </span>
          </div>
          <button 
            className={styles.stopButton}
            onClick={() => {
              addNotification('Workshop video stopped');
            }}
          >
            ■
          </button>
        </div>
        
        {/* Notes Taking Area */}
        <div className={styles.notesArea}>
          <h3>Take Notes</h3>
          <div className={styles.notesActions}>
            <button 
              className={styles.saveButton}
              onClick={() => addNotification('Notes saved successfully')}
            >
              Save Notes
            </button>
            <button 
              className={styles.exportButton}
              onClick={() => addNotification('Notes exported successfully')}
            >
              Export Notes
            </button>
          </div>
          <textarea 
            className={styles.notesTextarea}
            placeholder="Type your notes here while watching the workshop..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          ></textarea>
        </div>
        
        {/* Feedback Section */}
        <div className={styles.feedbackSection}>
          <h3 className={styles.feedbackHeading}>Rate this workshop</h3>
          <div className={styles.ratingStars}>
            {[1, 2, 3, 4, 5].map(star => (
              <span 
                key={star} 
                className={star <= rating ? styles.starActive : styles.star}
                onClick={() => setRating(star)}
              >
                ★
              </span>
            ))}
          </div>
          <textarea 
            className={styles.feedbackTextarea}
            placeholder="Share your feedback about this workshop..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          ></textarea>
          <button 
            className={styles.submitFeedbackButton}
            onClick={submitFeedback}
          >
            Submit Feedback
          </button>
        </div>
        
        {/* Certificate Section */}
        <div className={styles.certificateSection}>
          <h3 className={styles.certificateHeading}>Certificate of Completion</h3>
          <p className={styles.certificateDescription}>
            {videoProgress < 100 ? 
              `You must complete watching the workshop to receive your certificate (${Math.floor(videoProgress)}% completed).` : 
              'Congratulations! You have completed this workshop and can now download your certificate.'}
          </p>
          <button 
            className={styles.downloadCertificateButton}
            onClick={generateCertificate}
            disabled={videoProgress < 100}
            style={{ opacity: videoProgress < 100 ? 0.5 : 1 }}
          >
            {videoProgress < 100 ? `Complete ${Math.floor(100 - videoProgress)}% more to unlock` : 'Download Certificate'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecordedSessionModal;