import React, { useState, useEffect } from 'react';
import styles from './VideoCall.module.css';

interface VideoCallProps {
  isOpen: boolean;
  onClose: () => void;
  participantName: string;
  participantType: 'student' | 'pro-student' | 'scad' | 'faculty';
}

const VideoCall: React.FC<VideoCallProps> = ({
  isOpen,
  onClose,
  participantName,
  participantType
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);  const [otherUserLeft, setOtherUserLeft] = useState(false);
  const [showControls, setShowControls] = useState(true);  
  const [notifications, setNotifications] = useState<string[]>([]);
  const [showEndCallConfirmation, setShowEndCallConfirmation] = useState(false);  useEffect(() => {
    if (!isOpen) return;
    
    // Start timer for call duration
    const timerInterval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    
    // Show notification that the participant joined - only happens once when the call starts
    const joinNotificationTimeout = setTimeout(() => {
      addNotification(`${participantName} joined the call`);
    }, 2000);
    
    // Simulate participant status changes (for demo purposes)
    const simulateParticipantEvents = setTimeout(() => {
      // Notify when participant enables/disables video or audio
      if (participantName === "Dr. Ahmed Hassan") {
        setTimeout(() => addNotification(`${participantName} turned off video`), 20000);
        setTimeout(() => addNotification(`${participantName} muted audio`), 35000);
      }
    }, 5000);
    
    // Auto-hide controls after inactivity
    let controlsTimeout: NodeJS.Timeout;
    const setControlsTimeout = () => {
      controlsTimeout = setTimeout(() => {
        setShowControls(false);
      }, 3000); 
    };
    setControlsTimeout();
    
    // Add mouse movement listener to show controls
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(controlsTimeout);
      setControlsTimeout();
    };
    
    window.addEventListener('mousemove', handleMouseMove);      return () => {
      clearInterval(timerInterval);
      clearTimeout(joinNotificationTimeout);
      clearTimeout(simulateParticipantEvents);
      clearTimeout(controlsTimeout);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isOpen, participantName]);
  
  if (!isOpen) return null;
  
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const toggleMute = () => {
    const newState = !isMuted;
    setIsMuted(newState);
    addNotification(newState ? "Microphone muted" : "Microphone unmuted");
    
    // In a real implementation, this would use WebRTC to mute the actual audio track
    console.log(`Microphone ${newState ? 'muted' : 'unmuted'}`);
  };
  
  const toggleVideo = () => {
    const newState = !isVideoEnabled;
    setIsVideoEnabled(newState);
    addNotification(newState ? "Video enabled" : "Video disabled");
    
    // In a real implementation, this would use WebRTC to enable/disable the video track
    console.log(`Video ${newState ? 'enabled' : 'disabled'}`);
  };
  
  const toggleScreenShare = () => {
    const newState = !isScreenSharing;
    setIsScreenSharing(newState);
    addNotification(newState ? "Screen sharing started" : "Screen sharing stopped");
    
    // In a real implementation, this would use the browser's screen capture API
    // and WebRTC to share the screen
    console.log(`Screen sharing ${newState ? 'started' : 'stopped'}`);
  };
    const handleEndCall = () => {
    // Show confirmation dialog before ending call
    setShowEndCallConfirmation(true);
  };
  
  const confirmEndCall = () => {
    // In a real app, this would notify the other participant
    addNotification("Ending call...");
    setTimeout(() => {
      onClose();
    }, 500);
  };
  
  const cancelEndCall = () => {
    setShowEndCallConfirmation(false);
  };
  
  const addNotification = (message: string) => {
    setNotifications(prev => [...prev, message]);
    
    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(msg => msg !== message));
    }, 5000);
  };

  return (
    <div className={styles.videoCallModalOverlay}>
      <div className={styles.videoCallModal}>
        <div className={styles.videoCallContainer}>
          <div className={styles.callHeader}>
            <div className={styles.callInfo}>
              <h3>Call with {participantName}</h3>
              <span className={styles.duration}>{formatDuration(callDuration)}</span>
            </div>
            {notifications.length > 0 && (
              <div className={styles.notificationsArea}>
                {notifications.map((msg, index) => (
                  <div key={index} className={styles.notification}>
                    {msg}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className={styles.videoStreams}>
            {/* Remote video feed */}
            <div className={styles.remoteVideo}>              {!otherUserLeft ? (
                <div className={styles.videoPlaceholder}>
                  <div className={styles.userInitials}>
                    {participantName.split(' ').map(name => name[0]).join('')}
                  </div>
                  <span className={styles.userName}>{participantName}</span>
                  {isScreenSharing && (
                    <div className={styles.screenShareIndicator}>
                      <span className={styles.shareIcon}>🖥️</span> Sharing screen
                    </div>
                  )}
                </div>
              ) : (
                <div className={styles.leftCallMessage}>
                  <div className={styles.leftCallIcon}>👋</div>
                  <h3>{participantName} has left the call</h3>
                  <p>You can end the call or wait for them to rejoin</p>
                </div>
              )}
            </div>
            
            {/* Local video feed */}
            <div className={styles.localVideo}>
              {isVideoEnabled ? (
                <div className={styles.videoPlaceholder}>
                  <div className={styles.userInitials}>You</div>
                </div>
              ) : (
                <div className={styles.videoDisabled}>
                  <span>Video Off</span>
                </div>
              )}
              {/* Display microphone status on local video */}
              {isMuted && (
                <div className={styles.micStatus}>
                  <img 
                  src="/assets/images/icons/mute.png" 
                  alt="Mute Icon" 
                  className={styles.searchIcon} 
                />
                </div>
              )}
            </div>
          </div>
          
          {/* Call controls - conditionally shown based on activity */}
          <div className={`${styles.callControls} ${showControls ? styles.visible : styles.hidden}`}>            <button 
              className={`${styles.controlButton} ${isMuted ? styles.active : ''}`} 
              onClick={toggleMute}
              title={isMuted ? "Unmute microphone" : "Mute microphone"}
            >
              <span className={styles.controlIcon}>{isMuted ?
               <img 
                  src="/assets/images/icons/mute.png" 
                  alt="Mute Icon" 
                  className={styles.controlIcon} 
                />
                 : 
                 <img 
                src="/assets/images/icons/unmute.png" 
                alt="Unmute Icon" 
                className={styles.controlIcon} 
              /> 
              }
              </span>
              <span className={styles.controlLabel}>{isMuted ? 'Unmute' : 'Mute'}</span>
            </button>
            
            <button 
              className={`${styles.controlButton} ${!isVideoEnabled ? styles.active : ''}`} 
              onClick={toggleVideo}
              title={isVideoEnabled ? "Turn off video" : "Turn on video"}
            >
              <span className={styles.controlIcon}>{isVideoEnabled ? '📹' : '🚫'}</span>
              <span className={styles.controlLabel}>{isVideoEnabled ? 'Video Off' : 'Video On'}</span>
            </button>
            
            <button 
              className={`${styles.controlButton} ${isScreenSharing ? styles.active : ''}`} 
              onClick={toggleScreenShare}
              title={isScreenSharing ? "Stop sharing screen" : "Share screen"}
            >
              <span className={styles.controlIcon}>{isScreenSharing ? '⏹️' : '📊'}</span>
              <span className={styles.controlLabel}>{isScreenSharing ? 'Stop Share' : 'Share'}</span>
            </button>
            
            <button 
              className={`${styles.controlButton} ${styles.endCallButton}`} 
              onClick={handleEndCall}
              title="End call"
            >
              <span className={styles.controlIcon}>📞</span>
              <span className={styles.controlLabel}>End Call</span>
            </button>          </div>
          
          {/* End call confirmation dialog */}
          {showEndCallConfirmation && (
            <div className={styles.confirmationOverlay}>
              <div className={styles.confirmationDialog}>
                <h3>End the call?</h3>
                <p>Are you sure you want to leave this call?</p>
                <div className={styles.confirmationButtons}>
                  <button 
                    className={styles.cancelButton} 
                    onClick={cancelEndCall}
                  >
                    Cancel
                  </button>
                  <button 
                    className={styles.confirmButton} 
                    onClick={confirmEndCall}
                  >
                    End Call
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
