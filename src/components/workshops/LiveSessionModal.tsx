import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './LiveSessionModal.module.css';
import { Workshop, Message, Note } from './types';

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

  // Simulate workshop ending after 1 minute
  useEffect(() => {
    const timer = setTimeout(() => {
      if (workshop.status === 'ongoing') {
        setShowCertificatePrompt(true);
      }
    }, 60000); // 1 minute
    
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
      
      // Increment unread messages count if user is in notes tab
      if (activeTab === 'notes') {
        setUnreadMessages(prev => prev + 1);
      }
    }, 1500);
    
    // Simulate other participant response after 3 seconds
    setTimeout(() => {
      const participantResponse = {
        id: messages.length + 3,
        sender: 'Jane Smith',
        text: 'I had the same question!',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isNew: true
      };
      
      setMessages(prev => [...prev, participantResponse]);
      
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

  const handleDownloadCertificate = () => {
    // In a real application, this would generate or retrieve a certificate
    alert('Certificate downloaded successfully');
    setShowCertificatePrompt(false);
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
          <div className={styles.certificatePrompt}>
            <div className={styles.certificateContent}>
              <h3>Workshop Completed!</h3>
              <p>Congratulations on completing the workshop: {workshop.title}</p>
              <p>You can now download your certificate of attendance.</p>
              <div className={styles.certificateButtons}>
                <button
                  className={styles.downloadCertButton}
                  onClick={handleDownloadCertificate}
                >
                  Download Certificate
                </button>
                <button
                  className={styles.laterButton}
                  onClick={() => setShowCertificatePrompt(false)}
                >
                  Maybe Later
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