import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './LiveSessionModal.module.css';
import { Workshop, Message, Note, Rating } from './types';
import { useNotification } from '@/components/global/NotificationSystemAdapter';
import { Star } from 'lucide-react';

interface LiveSessionModalProps {
  workshop: Workshop;
  onClose: () => void;
}

const LiveSessionModal: React.FC<LiveSessionModalProps> = ({
  workshop,
  onClose
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'System',
      text: 'Welcome to the live session! The host will begin shortly.',
      time: '2:00 PM'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isLive, setIsLive] = useState(true);
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'notes'>('chat');
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [showCertificatePrompt, setShowCertificatePrompt] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  // Get notification functions
  const { showNotification, addNotification } = useNotification();

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Detect when user is focused on notes to track unread chat messages
  useEffect(() => {
    if (activeTab === 'chat') {
      setUnreadMessages(0);
    }
  }, [activeTab]);

  // We'll use a single useEffect to initialize the welcome message
  useEffect(() => {
    // After a small delay, add the host greeting
    const timer = setTimeout(() => {
      const hostWelcome = {
        id: messages.length + 1,
        sender: workshop.host,
        text: `Welcome everyone to our workshop on ${workshop.title}! Let's get started with today's session.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isNew: true
      };

      setMessages(prev => [...prev, hostWelcome]);

      // Show notification regardless of which tab is active
      showNotification({
        message: `${workshop.host} started the session!`,
        type: 'info'
      });

      // Add to persistent notifications
      addNotification({
        title: `Workshop Started: ${workshop.title}`,
        message: `${workshop.host} has started the session. Join now!`,
        type: 'application'
      });

      // Only increment unread count if user is in notes tab
      if (activeTab === 'notes') {
        setUnreadMessages(prev => prev + 1);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []); // Empty dependency array means this runs only once on component mount

  // Simulate workshop ending after 20 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (workshop.status === 'ongoing') {
        // Show rating modal first
        setShowRating(true);
      }
    }, 15000); // 15 seconds

    return () => clearTimeout(timer);
  }, [workshop]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (newMessage.trim() === '') return;

    // Add new message
    setMessages(prev => [
      ...prev,
      {
        id: prev.length + 1,
        sender: 'You',
        text: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    setNewMessage('');

    // Simulate response from host after 1.5 seconds
    setTimeout(() => {
      const hostResponse = {
        id: messages.length + 2,
        sender: workshop.host,
        text: 'Thanks for your question! I\'ll address that in a moment.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isNew: true
      };

      setMessages(prev => [...prev, hostResponse]);

      // Always show notifications for better user experience
      showNotification({
        message: `${workshop.host} sent a message: "Thanks for your question! I'll address that in a moment."`,
        type: 'info'
      });

      // Add to persistent notifications
      addNotification({
        title: `New Message in ${workshop.title}`,
        message: `${workshop.host}: Thanks for your question! I'll address that in a moment.`,
        type: 'application'
      });

      // Increment unread messages count if user is in notes tab
      if (activeTab === 'notes') {
        setUnreadMessages(prev => prev + 1);
      }
    }, 1500);    // Only simulate one participant response to avoid too many messages
    setTimeout(() => {
      const participantResponse = {
        id: messages.length + 3,
        sender: 'Jane Smith',
        text: 'I had the same question!',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isNew: true
      };

      setMessages(prev => [...prev, participantResponse]);

      // Always show notifications for better user experience
      showNotification({
        message: `Jane Smith sent a message: "I had the same question!"`,
        type: 'info'
      });

      // Add to persistent notifications
      addNotification({
        title: `New Message in ${workshop.title}`,
        message: `Jane Smith: I had the same question!`,
        type: 'application'
      });

      // Increment unread messages count if user is in notes tab
      if (activeTab === 'notes') {
        setUnreadMessages(prev => prev + 1);
      }
    }, 3000);
  };

  const handleSaveNote = () => {
    if (currentNote.trim() === '') return;

    const newNote: Note = {
      id: notes.length + 1,
      workshopId: workshop.id,
      content: currentNote,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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

    // Show success notification
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
    setShowCertificatePrompt(true);
  };

  const handleDownloadCertificate = () => {
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
        // Close the modal immediately after download completes
        setShowCertificatePrompt(false);
        onClose();
      }
    }, 400);
  };

  // Function to actually generate and trigger the certificate download
  const generateAndDownloadCertificate = () => {
    // In a real app, this would generate an actual PDF certificate
    // For this example, we'll create a simple text file as a placeholder
    const certificateContent = `
    ====================================
    CERTIFICATE OF COMPLETION
    ====================================
    
    This certifies that
    
    Ahmad Mohammed
    
    has successfully completed
    
    ${workshop.title}
    
    presented by ${workshop.host}
    on ${workshop.date}
    
    Duration: ${workshop.duration || '1 hour'}
    ====================================
    `;

    const blob = new Blob([certificateContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${workshop.title.replace(/\s+/g, '_')}_Certificate.txt`;
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
  };

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>×</button>

        <div className={styles.liveSessionContainer}>
          <div className={styles.videoSection}>
            <div className={styles.videoContainer}>
              {isLive ? (
                <div className={styles.liveVideo}>
                  <div className={styles.liveIndicator}>
                    <span className={styles.liveDot}></span>
                    LIVE
                  </div>
                  {/* Placeholder for video stream */}
                  <div className={styles.videoPlaceholder}>
                    <Image
                      src={workshop.logo || '/logos/GUCInternshipSystemLogo.png'}
                      alt={workshop.title}
                      width={80}
                      height={80}
                      className={styles.placeholderLogo}
                    />
                    <h3>{workshop.title}</h3>
                    <p>Live session in progress...</p>
                  </div>
                </div>
              ) : (
                <div className={styles.disconnected}>
                  <div className={styles.disconnectedMessage}>
                    <span>⚠️</span>
                    <h3>Connection Lost</h3>
                    <p>Please check your internet connection and try again</p>
                    <button
                      className={styles.reconnectButton}
                      onClick={() => setIsLive(true)}
                    >
                      Reconnect
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className={styles.sidePanel}>
            <div className={styles.tabButtons}>
              <button
                className={`${styles.tabButton} ${activeTab === 'chat' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('chat')}
              >
                Chat
                {unreadMessages > 0 && <span className={styles.unreadBadge}>{unreadMessages}</span>}
              </button>
              <button
                className={`${styles.tabButton} ${activeTab === 'notes' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('notes')}
              >
                Notes
              </button>
            </div>

            {activeTab === 'chat' && (
              <div className={styles.chatSection}>
                <div className={styles.chatHeader}>
                  <div className={styles.participants}>
                    <span className={styles.participantCount}>{workshop.attendeesCount || 24} participants</span>
                  </div>
                </div>

                <div className={styles.chatMessages}>
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`${styles.message} ${message.sender === 'You' ? styles.ownMessage : ''} ${message.isNew ? styles.newMessage : ''}`}
                    >
                      <div className={styles.messageSender}>{message.sender}</div>
                      <div className={styles.messageContent}>
                        <p>{message.text}</p>
                        <span className={styles.messageTime}>{message.time}</span>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                <form className={styles.chatInput} onSubmit={handleSendMessage}>
                  <input
                    type="text"
                    placeholder="Type your message or question..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button type="submit">Send</button>
                </form>
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
                    placeholder="Take notes here..."
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

        {/* Certificate Prompt Modal */}
        {showCertificatePrompt && (
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

              {isDownloading ? (
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
                    onClick={() => {
                      setShowCertificatePrompt(false);
                      onClose();
                    }}
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

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
                    setShowCertificatePrompt(true);
                  }}
                >
                  Skip
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveSessionModal;