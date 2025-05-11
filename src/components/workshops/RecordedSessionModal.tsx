import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './RecordedSessionModal.module.css';
import { Workshop, Note, Rating } from './types';

interface RecordedSessionModalProps {
  workshop: Workshop;
  onClose: () => void;
}

const RecordedSessionModal: React.FC<RecordedSessionModalProps> = ({
  workshop,
  onClose
}) => {
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'notes'>('details');
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showCertificate, setShowCertificate] = useState(false);
  
  const calculateCurrentTime = (progressPercent: number, duration: string) => {
    // Extract the numeric value from duration
    const durationMatch = duration.match(/\d+/);
    if (!durationMatch) return 0;
    
    const durationValue = parseInt(durationMatch[0], 10);
    return Math.floor((progressPercent / 100) * durationValue);
  };

  // Simulate playback progress
  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsPlaying(false);
            if (!showRating) {
              setShowRating(true);
            }
            return 100;
          }
          return prev + 1;
        });
      }, 300); // Update every 300ms for demo purposes
    }
  };

  const handleSaveNote = () => {
    if (currentNote.trim() === '') return;
    
    const newNote: Note = {
      id: notes.length + 1,
      workshopId: workshop.id,
      content: currentNote,
      timestamp: `${calculateCurrentTime(progress, workshop.duration)} min`,
    };
    
    setNotes(prev => [...prev, newNote]);
    setCurrentNote('');
  };

  const handleDownloadNotes = () => {
    const notesText = notes.map(note => 
      `[${note.timestamp}] ${note.content}`
    ).join('\n\n');
    
    const notesContent = `
      WORKSHOP NOTES
      ==============
      Title: ${workshop.title}
      Host: ${workshop.host}
      Date: ${workshop.date}
      Time: ${workshop.time}
      ==============
      
      ${notesText}
    `;
    
    const blob = new Blob([notesContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${workshop.title.replace(/\s+/g, '_')}_Notes.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleSubmitRating = () => {
    if (rating === 0) return;
    
    // In a real app, this would send the rating to the backend
    console.log('Rating submitted:', { rating, feedback, workshopId: workshop.id });
    
    // Show success message
    alert('Thank you for your feedback!');
    setShowRating(false);
    
    // Show certificate prompt
    setShowCertificate(true);
  };

  const handleDownloadCertificate = () => {
    // In a real app, this would generate or retrieve a certificate
    alert('Certificate downloaded successfully!');
    setShowCertificate(false);
  };

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        
        <div className={styles.recordedSessionContainer}>
          <div className={styles.videoSection}>
            <div className={styles.videoContainer}>
              <div className={styles.recordedVideo}>
                {/* Placeholder for video player */}
                <div className={styles.videoPlaceholder}>
                  <Image 
                    src={workshop.logo || '/logos/GUCInternshipSystemLogo.png'} 
                    alt={workshop.title} 
                    width={80} 
                    height={80}
                    className={styles.placeholderLogo}
                  />
                  <h3>{workshop.title}</h3>
                  <p>Recorded session by {workshop.host}</p>
                </div>
              </div>
            </div>
            
            <div className={styles.videoControls}>
              <button 
                className={styles.playPauseButton}
                onClick={handlePlayPause}
              >
                {isPlaying ? '⏸️ Pause' : '▶️ Play'}
              </button>
              
              <div className={styles.progressBarContainer}>
                <div 
                  className={styles.progressBar}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              
              <div className={styles.timeDisplay}>
                <span>{calculateCurrentTime(progress, workshop.duration)} min</span>
                <span>{workshop.duration}</span>
              </div>
            </div>
          </div>
          
          <div className={styles.sidePanel}>
            <div className={styles.tabButtons}>
              <button 
                className={`${styles.tabButton} ${activeTab === 'details' ? styles.activeTab : ''}`} 
                onClick={() => setActiveTab('details')}
              >
                Details
              </button>
              <button 
                className={`${styles.tabButton} ${activeTab === 'notes' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('notes')}
              >
                Notes
              </button>
            </div>
            
            {activeTab === 'details' && (
              <div className={styles.workshopDetails}>
                <div className={styles.detailsHeader}>
                  <h2>{workshop.title}</h2>
                  <div className={styles.hostInfo}>
                    {workshop.logo && (
                      <Image 
                        src={workshop.logo} 
                        alt={`${workshop.host} logo`} 
                        width={30} 
                        height={30} 
                        className={styles.hostLogo}
                      />
                    )}
                    <span className={styles.hostName}>{workshop.host}</span>
                  </div>
                  {workshop.avgRating && (
                    <div className={styles.ratingInfo}>
                      <span className={styles.ratingStars}>
                        {'★'.repeat(Math.floor(workshop.avgRating))}
                        {'☆'.repeat(5 - Math.floor(workshop.avgRating))}
                      </span>
                      <span className={styles.ratingValue}>{workshop.avgRating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
                
                <div className={styles.detailsBody}>
                  <p className={styles.description}>{workshop.description}</p>
                </div>
                
                <div className={styles.resources}>
                  <h3>Resources</h3>
                  <ul className={styles.resourcesList}>
                    <li>
                      <a href="#">Workshop Slides (PDF)</a>
                    </li>
                    <li>
                      <a href="#">Code Examples</a>
                    </li>
                    <li>
                      <a href="#">Additional Reading</a>
                    </li>
                  </ul>
                </div>
              </div>
            )}
            
            {activeTab === 'notes' && (
              <div className={styles.notesSection}>
                <div className={styles.notesHeader}>
                  <h3>Workshop Notes</h3>
                  {notes.length > 0 && (
                    <button 
                      className={styles.downloadButton}
                      onClick={handleDownloadNotes}
                    >
                      Download
                    </button>
                  )}
                </div>
                
                <div className={styles.notesContent}>
                  {notes.length > 0 ? (
                    notes.map((note) => (
                      <div key={note.id} className={styles.noteItem}>
                        <div className={styles.noteTimestamp}>{note.timestamp}</div>
                        <p className={styles.noteText}>{note.content}</p>
                      </div>
                    ))
                  ) : (
                    <div className={styles.emptyNotes}>
                      <p>No notes yet. Start taking notes!</p>
                    </div>
                  )}
                </div>
                
                <div className={styles.noteInput}>
                  <textarea
                    placeholder="Take notes at the current timestamp..."
                    value={currentNote}
                    onChange={(e) => setCurrentNote(e.target.value)}
                    rows={4}
                  />
                  <button 
                    className={styles.saveNoteButton}
                    onClick={handleSaveNote}
                    disabled={currentNote.trim() === ''}
                  >
                    Save Note
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Rating Modal */}
        {showRating && (
          <div className={styles.ratingModal}>
            <div className={styles.ratingContent}>
              <h3>Rate This Workshop</h3>
              <p>How would you rate "{workshop.title}"?</p>
              
              <div className={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className={`${styles.starButton} ${rating >= star ? styles.active : ''}`}
                    onClick={() => setRating(star)}
                  >
                    {rating >= star ? '★' : '☆'}
                  </button>
                ))}
              </div>
              
              <textarea
                placeholder="Share your feedback about this workshop (optional)"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className={styles.feedbackInput}
                rows={4}
              />
              
              <div className={styles.ratingButtons}>
                <button
                  className={styles.submitRatingButton}
                  onClick={handleSubmitRating}
                  disabled={rating === 0}
                >
                  Submit Feedback
                </button>
                <button
                  className={styles.skipButton}
                  onClick={() => {
                    setShowRating(false);
                    setShowCertificate(true);
                  }}
                >
                  Skip
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Certificate Modal */}
        {showCertificate && (
          <div className={styles.certificateModal}>
            <div className={styles.certificateContent}>
              <h3>Workshop Completed!</h3>
              <p>Congratulations on completing the workshop: {workshop.title}</p>
              <p>You can now download your certificate of attendance.</p>
              <div className={styles.certificatePreview}>
                <div className={styles.certificateInner}>
                  <h2>Certificate of Completion</h2>
                  <p>This certifies that</p>
                  <p className={styles.userName}>Ahmad Mohammed</p>
                  <p>has successfully completed</p>
                  <p className={styles.workshopTitle}>{workshop.title}</p>
                  <p>presented by {workshop.host}</p>
                  <p>on {workshop.date}</p>
                </div>
              </div>
              <div className={styles.certificateButtons}>
                <button
                  className={styles.downloadCertButton}
                  onClick={handleDownloadCertificate}
                >
                  Download Certificate
                </button>
                <button
                  className={styles.closeButton}
                  onClick={() => setShowCertificate(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecordedSessionModal;