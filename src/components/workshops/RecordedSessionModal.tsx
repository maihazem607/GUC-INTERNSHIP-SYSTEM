import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './RecordedSessionModal.module.css';
import { Workshop, Note, Rating } from './types';
import { Star } from 'lucide-react';
import { useNotification } from '@/components/global/NotificationSystemAdapter';
import { 
  generateWorkshopCertificatePDF, 
  generateWorkshopNotesPDF, 
  generateWorkshopResourcePDF, 
  WorkshopCertificateData, 
  WorkshopNotesData,
  WorkshopResourceData
} from '@/utils/pdfUtils';

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
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  // Get notification functions
  const { showNotification, addNotification } = useNotification();
  const calculateCurrentTime = (progressPercent: number, duration: string | undefined) => {
    // Handle undefined duration
    if (!duration) return 0;

    // Extract the numeric value from duration
    const durationMatch = duration.match(/\d+/);
    if (!durationMatch) return 0;

    const durationValue = parseInt(durationMatch[0], 10);
    return Math.floor((progressPercent / 100) * durationValue);
  };
  // Simulate playback progress
  const handlePlayPause = () => {
    if (isPlaying) {
      // Pause the video by clearing the interval
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      // Start or resume playback
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIntervalId(null);
            setIsPlaying(false);
            if (!showRating) {
              setShowRating(true);
            }
            // Close the modal after a short delay to show the rating
            setTimeout(() => {
              onClose();
            }, 30000); // 30 seconds delay to allow rating
            return 100;
          }
          return prev + 1;
        });
      }, 300); // Update every 300ms for demo purposes

      // Save the interval ID so we can clear it later when pausing
      setIntervalId(interval);
    }
  };

  // Clean up interval on component unmount
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

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
  const handleDownloadNotes = async () => {
    // Create workshop notes data object for PDF generation
    const workshopNotesData: WorkshopNotesData = {
      workshopTitle: workshop.title,
      workshopHost: workshop.host,
      workshopDate: workshop.date,
      workshopTime: workshop.time,
      notes: notes.map(note => ({
        timestamp: note.timestamp,
        content: note.content
      }))
    };

    try {
      // Generate PDF blob
      const pdfBlob = await generateWorkshopNotesPDF(workshopNotesData);
      
      // Create download link
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${workshop.title.replace(/\s+/g, '_')}_Notes.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Show success notification
      showNotification({
        message: `Workshop notes for "${workshop.title}" downloaded as PDF`,
        type: 'success'
      });
    } catch (error) {
      console.error('Error generating notes PDF:', error);
      
      // Show error notification
      showNotification({
        message: `Error generating PDF. Please try again.`,
        type: 'error'
      });
    }
  };  const handleSubmitRating = () => {
    if (rating === 0) return;

    // In a real app, this would send the rating to the backend
    console.log('Rating submitted:', { rating, feedback, workshopId: workshop.id });

    // Show success notification instead of alert
    showNotification({
      message: `Thank you for rating "${workshop.title}"!`,
      type: 'success'
    });

    // Add to persistent notifications
    addNotification({
      title: 'Workshop Rating Submitted',
      message: `You rated "${workshop.title}" ${rating} stars. Thank you for your feedback!`,
      type: 'application'
    });

    setShowRating(false);

    // Show certificate prompt
    setShowCertificate(true);
  };
  
  // Function to handle resource downloads as PDFs
  const handleDownloadResource = async (resourceTitle: string, resourceType: string) => {
    try {
      // Sample content for each resource type
      let content = '';
      switch (resourceType) {
        case 'slides':
          content = `These are the slides for "${workshop.title}" workshop.\n\nThe actual slides would contain detailed content about the workshop topics, visual examples, and instructions.`;
          break;
        case 'code':
          content = `Code examples from "${workshop.title}" workshop.\n\nThis document would contain code snippets, examples, and explanations from the workshop.`;
          break;
        case 'reading':
          content = `Additional reading materials for "${workshop.title}" workshop.\n\nThis document would contain references, articles, books, and other resources for further learning.`;
          break;
        default:
          content = `Resource content for "${workshop.title}" workshop.`;
      }
      
      // Create resource data object
      const resourceData: WorkshopResourceData = {
        title: resourceTitle,
        type: resourceType,
        content: content,
        workshopTitle: workshop.title
      };
      
      // Generate PDF
      const pdfBlob = await generateWorkshopResourcePDF(resourceData);
      
      // Create download link
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${workshop.title.replace(/\s+/g, '_')}_${resourceType}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Show success notification
      showNotification({
        message: `${resourceTitle} for "${workshop.title}" downloaded as PDF`,
        type: 'success'
      });
      
    } catch (error) {
      console.error('Error generating resource PDF:', error);
      
      // Show error notification
      showNotification({
        message: `Error downloading resource. Please try again.`,
        type: 'error'
      });
    }
  };const handleDownloadCertificate = () => {
    // Simulate certificate generation and download with progress
    setIsDownloading(true);
    setDownloadProgress(0);

    // Create a simulated download that takes a few seconds with progress updates
    const totalSteps = 10;
    let currentStep = 0;

    const downloadInterval = setInterval(() => {
      currentStep++;
      const newProgress = Math.floor((currentStep / totalSteps) * 100);
      setDownloadProgress(newProgress);

      if (currentStep >= totalSteps) {
        clearInterval(downloadInterval);
        generateAndDownloadCertificate();
        setIsDownloading(false);
        // Close both the certificate modal and the main modal
        setShowCertificate(false);
        onClose();
      }
    }, 400);
  };
  
  // Function to actually generate and trigger the certificate download
  const generateAndDownloadCertificate = async () => {
    try {
      // Get current date for the completion date
      const now = new Date();
      const formattedDate = now.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      // Create certificate data object for PDF generation
      const certificateData: WorkshopCertificateData = {
        studentName: "Salma Hassan", // In a real app, this would be the logged-in user's name
        workshopTitle: workshop.title,
        workshopHost: workshop.host,
        workshopDate: workshop.date,
        workshopDuration: workshop.duration || "2 hours",
        completionDate: formattedDate
      };
      
      // Generate PDF blob
      const pdfBlob = await generateWorkshopCertificatePDF(certificateData);
      
      // Create download link
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${workshop.title.replace(/\s+/g, '_')}_Certificate.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Show notification for certificate download
      showNotification({
        message: `Certificate for "${workshop.title}" has been downloaded`,
        type: 'success'
      });

      // Add to persistent notifications
      addNotification({
        title: 'Certificate Generated',
        message: `Your certificate for "${workshop.title}" is now available`,
        type: 'application'
      });
    } catch (error) {
      console.error('Error generating certificate PDF:', error);
      
      // Show error notification
      showNotification({
        message: `Error generating certificate. Please try again.`,
        type: 'error'
      });
    }
  };

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>×</button>

        <div className={styles.recordedSessionContainer}>
          {/* Left column: video + certificate progress (stacked) */}
          <div className={styles.leftColumn}>
            {/* Video section takes full height initially */}
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

            {/* Certificate Progress Section - below video, only visible when scrolling */}
            <div className={styles.certificateSection}>
              <div className={styles.certificateSectionInner}>
                <h4 className={styles.certificateHeading}>Certificate Progress</h4>
                <div className={styles.certificateProgressIndicator}>
                  <div className={styles.progressCircle}>
                    <svg viewBox="0 0 36 36" className={styles.circularChart}>
                      <path
                        className={styles.circleBg}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className={styles.circle}
                        strokeDasharray={`${progress}, 100`}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <text x="18" y="20.5" className={styles.percentageText}>{progress}%</text>
                    </svg>
                  </div>
                  <div className={styles.certificateMessage}>
                    {progress < 100 ? (
                      <>
                        <p className={styles.certificateStatus}>
                          <span className={styles.remainingPercentage}>{100 - progress}%</span> remaining to earn your certificate
                        </p>
                        <p className={styles.certificateInstruction}>
                          Complete the full workshop to get your certificate of completion
                        </p>
                      </>
                    ) : (
                      <p className={styles.certificateComplete}>
                        Congratulations! You've completed this workshop and earned your certificate.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column: side panel */}
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
                        {Array(5).fill(0).map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            fill={typeof workshop.avgRating === 'number' ? (i < Math.floor(workshop.avgRating) ? "#FFD700" : "none") : "none"}
                            color={typeof workshop.avgRating === 'number' ? (i < Math.floor(workshop.avgRating) ? "#FFD700" : "#D1D5DB") : "#D1D5DB"}
                          />
                        ))}
                      </span>
                      <span className={styles.ratingValue}>{typeof workshop.avgRating === 'number' ? workshop.avgRating.toFixed(1) : ''}</span>
                    </div>
                  )}
                </div>

                <div className={styles.detailsBody}>
                  <p className={styles.description}>{workshop.description}</p>
                </div>                <div className={styles.resources}>
                  <h3>Resources</h3>
                  <ul className={styles.resourcesList}>
                    <li>
                      <a href="#" onClick={(e) => {
                        e.preventDefault();
                        handleDownloadResource('Workshop Slides', 'slides');
                      }}>Workshop Slides (PDF)</a>
                    </li>
                    <li>
                      <a href="#" onClick={(e) => {
                        e.preventDefault();
                        handleDownloadResource('Code Examples', 'code');
                      }}>Code Examples (PDF)</a>
                    </li>
                    <li>
                      <a href="#" onClick={(e) => {
                        e.preventDefault();
                        handleDownloadResource('Additional Reading', 'reading');
                      }}>Additional Reading (PDF)</a>
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
                    <Star
                      size={24}
                      fill={rating >= star ? "#FFD700" : "none"}
                      color={rating >= star ? "#FFD700" : "#D1D5DB"}
                    />
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
                  <p className={styles.userName}>Salma Hassan</p>
                  <p>has successfully completed</p>
                  <p className={styles.workshopTitle}>{workshop.title}</p>
                  <p>presented by {workshop.host}</p>
                  <p>on {workshop.date}</p>
                </div>
              </div>              {isDownloading ? (
                <div className={styles.downloadProgress}>
                  <div className={styles.progressText}>
                    {downloadProgress}% downloaded
                    {downloadProgress < 100 && downloadProgress >= 70 && (
                      <span className={styles.downloadRemainingText}> - {100 - downloadProgress}% remaining</span>
                    )}
                  </div>
                  <div className={styles.progressBarContainer}>
                    <div
                      className={styles.progressBar}
                      style={{ width: `${downloadProgress}%` }}
                    ></div>
                  </div>
                </div>
              ) : (
                <div className={styles.certificateButtons}>
                  <button
                    className={styles.downloadCertButton}
                    onClick={handleDownloadCertificate}
                  >
                    Download Certificate
                  </button>
                  <button
                    className={styles.closeButton}
                    onClick={onClose}
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecordedSessionModal;