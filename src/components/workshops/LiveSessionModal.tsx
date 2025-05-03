import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import styles from './LiveSessionModal.module.css';
import { Workshop, Message } from './types';

interface LiveSessionModalProps {
  workshop: Workshop;
  onClose: () => void;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  newMessage: string;
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
  notes: string;
  setNotes: React.Dispatch<React.SetStateAction<string>>;
  rating: number;
  setRating: React.Dispatch<React.SetStateAction<number>>;
  feedback: string;
  setFeedback: React.Dispatch<React.SetStateAction<string>>;
  addNotification: (message: string) => void;
  submitFeedback: () => void;
  generateCertificate: () => void;
  sendMessage: (e: React.FormEvent) => void;
}

const LiveSessionModal: React.FC<LiveSessionModalProps> = ({
  workshop,
  onClose,
  messages,
  setMessages,
  newMessage,
  setNewMessage,
  notes,
  setNotes,
  rating,
  setRating,
  feedback,
  setFeedback,
  addNotification,
  submitFeedback,
  generateCertificate,
  sendMessage
}) => {
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            <span className={styles.liveIndicator}>LIVE</span>
            {workshop.title}
          </h2>
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
        
        <div className={styles.modalLayout}>
          <div className={styles.leftSection}>
            {/* Video Placeholder */}
            <div className={styles.videoPlaceholder}>
              <div className={styles.videoContent}>
                <div className={styles.videoTitle}>Live Workshop Stream</div>
                <div className={styles.videoInfo}>Broadcasting now • {workshop.attendees} attendees</div>
              </div>
            </div>
            
            {/* Notes Taking Area */}
            <div className={styles.notesArea}>
              <div className={styles.notesHeader}>
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
              </div>
              <textarea 
                className={styles.notesTextarea}
                placeholder="Type your notes here during the workshop..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              ></textarea>
            </div>
          </div>
          
          {/* Live Chat */}
          <div className={styles.rightSection}>
            <div className={styles.chatSection}>
              <div className={styles.chatHeader}>
                <h3 className={styles.chatTitle}>Live Chat</h3>
                <div className={styles.chatBadge}>
                  {messages.length} messages
                </div>
              </div>
              
              <div 
                className={styles.chatMessages} 
                ref={chatMessagesRef}
              >
                {messages.map(message => (
                  <div key={message.id} className={styles.message}>
                    <div className={styles.messageAvatar} style={{ 
                      backgroundColor: message.sender === 'You' ? '#3e9fff' : 
                                      message.sender === 'Workshop Host' ? '#e53935' : 
                                      `hsl(${message.sender.charCodeAt(0) * 10 % 360}, 70%, 80%)`
                    }}>
                      {message.sender[0]}
                    </div>
                    <div className={styles.messageContent}>
                      <div className={styles.messageSender}>
                        {message.sender} 
                        {message.sender === 'Workshop Host' && (
                          <span className={styles.hostBadge}>
                            Host
                          </span>
                        )}
                        <small className={styles.messageTime}>{message.time}</small>
                      </div>
                      <div className={styles.messageText}>{message.text}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <form 
                className={styles.chatInput} 
                onSubmit={sendMessage}
              >
                <textarea 
                  className={styles.chatTextarea}
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage(e);
                    }
                  }}
                ></textarea>
                <button 
                  type="submit" 
                  className={styles.sendButton}
                  disabled={!newMessage.trim()}
                  style={{ opacity: newMessage.trim() ? 1 : 0.5 }}
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
        
        <div className={styles.bottomSection}>
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
            <h3 className={styles.certificateHeading}>Certificate of Attendance</h3>
            <p className={styles.certificateDescription}>
              You can download your certificate after completing the workshop.
            </p>
            <button 
              className={styles.downloadCertificateButton}
              onClick={generateCertificate}
            >
              Generate Certificate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveSessionModal;