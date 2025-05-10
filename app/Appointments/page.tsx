"use client";
import styles from "./page.module.css";
import React, { useState, useEffect, useRef } from 'react';

// Import modular components
import Navigation from "../../src/components/global/Navigation";
import FilterSidebar from "../../src/components/global/FilterSidebar";
import SearchBar from "../../src/components/global/SearchBar";
import AppointmentCard from "../../src/components/Appointments/AppointmentCard";
import AppointmentDetailsModal from "@/components/Appointments/AppointmentDetailsModal";
import VideoCall from "@/components/Appointments/VideoCall";
import NotificationSystem, { NOTIFICATION_CONSTANTS } from "@/components/global/NotificationSystem";
import IncomingCallNotification from "@/components/Appointments/IncomingCallNotification";
import { Appointment } from "@/components/Appointments/types";

// Mock appointment data (would typically come from an API)
const mockAppointments: Appointment[] = [
  {
    id: "1",
    title: "Career Guidance Meeting",
    date: "May 15, 2025",
    time: "10:00 AM - 11:00 AM",
    status: 'pending',
    participantName: "Dr. Sarah Johnson",
    participantType: "scad",
    participantEmail: "sarah.johnson@guc.edu",
    isOnline: true,
    description: "Discuss career options in software engineering and potential internship opportunities.",
  },
  {
    id: "2",
    title: "Course Selection Advice",
    date: "May 17, 2025",
    time: "2:00 PM - 3:00 PM",
    status: 'accepted',
    participantName: "Dr. Ahmed Hassan",
    participantType: "scad",
    participantEmail: "ahmed.hassan@guc.edu",
    isOnline: true,
    description: "Review course options for next semester and discuss prerequisites needed for specialization tracks.",
  },
  {
    id: "3",
    title: "Academic Progress Review",
    date: "May 20, 2025",
    time: "11:30 AM - 12:30 PM",
    status: 'completed',
    participantName: "Dr. Emily Rodriguez",
    participantType: "scad",
    participantEmail: "emily.rodriguez@guc.edu",
    isOnline: false,
    description: "Review academic performance from previous semester and discuss areas for improvement.",
  },
  {
    id: "4",
    title: "Research Opportunities Discussion",
    date: "May 22, 2025",
    time: "3:30 PM - 4:30 PM",
    status: 'rejected',
    participantName: "Dr. Michael Chen",
    participantType: "scad",
    participantEmail: "michael.chen@guc.edu",
    isOnline: true,
    description: "Explore undergraduate research opportunities and faculty-led projects.",
  },
  {
    id: "5",
    title: "Mock Interview Practice",
    date: "May 25, 2025",
    time: "1:00 PM - 2:00 PM",
    status: 'pending',
    participantName: "Dr. Layla Mahmoud",
    participantType: "scad",
    participantEmail: "layla.mahmoud@guc.edu",
    isOnline: true,
    description: "Practice technical interview skills with feedback from SCAD career counselor.",
  }
];

export default function AppointmentsPage() {
  // Current user type - in a real app, this would be from authentication
  const currentUserType = 'pro-student'; // or 'scad', depending on who is logged in
    // State for notifications
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error' | 'info' | 'warning'} | null>(null);
  
  // Audio references for notification sounds
  const notificationSoundRef = useRef<HTMLAudioElement | null>(null);
  const callNotificationSoundRef = useRef<HTMLAudioElement | null>(null);
  
  // Track user interaction to enable sound playback
  useEffect(() => {
    const markUserInteraction = () => {
      document.documentElement.dataset.hasUserInteracted = 'true';
      // Remove event listeners once interaction is detected
      document.removeEventListener('click', markUserInteraction);
      document.removeEventListener('keydown', markUserInteraction);
      document.removeEventListener('touchstart', markUserInteraction);
    };
    
    // Add event listeners to detect user interaction
    document.addEventListener('click', markUserInteraction);
    document.addEventListener('keydown', markUserInteraction);
    document.addEventListener('touchstart', markUserInteraction);
    
    return () => {
      // Clean up event listeners
      document.removeEventListener('click', markUserInteraction);
      document.removeEventListener('keydown', markUserInteraction);
      document.removeEventListener('touchstart', markUserInteraction);
    };
  }, []);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    status: 'All',
    date: 'All'
  });
  
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>(appointments);  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showAppointmentDetails, setShowAppointmentDetails] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [incomingCall, setIncomingCall] = useState<Appointment | null>(null);
  const [activeCall, setActiveCall] = useState<Appointment | null>(null);
  // Show notification on initial load that someone accepted your appointment
  useEffect(() => {
    // Display an initial notification that someone accepted your appointment
    setTimeout(() => {
      setNotification({
        message: "Dr. Emily Rodriguez has accepted your appointment request for \"Academic Progress Review\"",
        type: 'success'
      });
      
      // Try to play notification sound
      playNotificationSound('notification');
    }, 2000); // Show 2 seconds after page load
  }, []);
  
  // Auto-dismiss notifications after the specified time
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, NOTIFICATION_CONSTANTS.AUTO_DISMISS_TIME);
      
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Filter options
  const statusOptions = ['All', 'Pending', 'Accepted', 'Rejected', 'Completed'];
  const dateOptions = ['All', 'Today', 'This Week', 'This Month', 'Future'];
  
  // Format filters for the global FilterSidebar component
  const formattedFilters = [
    {
      title: "Status",
      options: statusOptions,
      type: "status",
      value: activeFilters.status
    },
    {
      title: "Date",
      options: dateOptions,
      type: "date",
      value: activeFilters.date
    }
  ];
  
  // Apply filters and search
  useEffect(() => {
    let results = [...appointments];
    
    // Apply status filter
    if (activeFilters.status !== 'All') {
      const statusLower = activeFilters.status.toLowerCase();
      results = results.filter(appointment => appointment.status === statusLower);
    }
    
    // Apply date filter
    if (activeFilters.date !== 'All') {
      const today = new Date();
      const thisWeekStart = new Date(today.setDate(today.getDate() - today.getDay()));
      const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      
      results = results.filter(appointment => {
        const appointmentDate = new Date(appointment.date);
        
        switch(activeFilters.date) {
          case 'Today':
            return appointmentDate.toDateString() === new Date().toDateString();
          case 'This Week':
            return appointmentDate >= thisWeekStart;
          case 'This Month':
            return appointmentDate >= thisMonthStart;
          case 'Future':
            return appointmentDate > new Date();
          default:
            return true;
        }
      });
    }
    
    // Apply search term
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        appointment => 
          appointment.title.toLowerCase().includes(term) || 
          appointment.participantName.toLowerCase().includes(term)
      );
    }
    
    setFilteredAppointments(results);
  }, [searchTerm, activeFilters, appointments]);
  
  // Handle filter changes
  const handleFilterChange = (filterType: string, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType.toLowerCase()]: value
    }));
  };    // Function to play notification sounds with autoplay fallback
  const playNotificationSound = (type: 'notification' | 'call') => {
    const hasUserInteracted = document.documentElement.dataset.hasUserInteracted === 'true';
    
    const attemptPlaySound = () => {
      try {
        if (type === 'call' && callNotificationSoundRef.current) {
          const playPromise = callNotificationSoundRef.current.play();
          
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.log("Notification sound error:", error);
              setupPlayOnFirstInteraction();
            });
          }
        } else if (type === 'notification' && notificationSoundRef.current) {
          const playPromise = notificationSoundRef.current.play();
          
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.log("Notification sound error:", error);
              setupPlayOnFirstInteraction();
            });
          }
        }
      } catch (error) {
        console.log("Error playing notification sound:", error);
        setupPlayOnFirstInteraction();
      }
    };
    
    // Setup event listeners to play sound on first interaction if autoplay fails
    const setupPlayOnFirstInteraction = () => {
      if (!document.documentElement.dataset.soundPendingPlay) {
        document.documentElement.dataset.soundPendingPlay = type;
        
        const playOnFirstInteraction = () => {
          const pendingSound = document.documentElement.dataset.soundPendingPlay;
          if (pendingSound) {
            document.documentElement.dataset.hasUserInteracted = 'true';
            document.documentElement.dataset.soundPendingPlay = '';
            playNotificationSound(pendingSound as 'notification' | 'call');
            
            // Remove event listeners
            document.removeEventListener('click', playOnFirstInteraction);
            document.removeEventListener('keydown', playOnFirstInteraction);
            document.removeEventListener('touchstart', playOnFirstInteraction);
          }
        };
        
        // Add event listeners for first interaction
        document.addEventListener('click', playOnFirstInteraction, { once: true });
        document.addEventListener('keydown', playOnFirstInteraction, { once: true });
        document.addEventListener('touchstart', playOnFirstInteraction, { once: true });
      }
    };
    
    // Try to play immediately, with fallback to play on first interaction
    attemptPlaySound();
  };
  
  // Appointment action handlers
  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowAppointmentDetails(true);
  };
  
  const handleCloseModal = () => {
    setSelectedAppointment(null);
    setShowAppointmentDetails(false);
  };
  
  const handleAcceptAppointment = async (appointmentId: string) => {
    // This would typically be an API call
    setAppointments(prev => 
      prev.map(app => 
        app.id === appointmentId ? {...app, status: 'accepted'} : app
      )
    );
      const app = appointments.find(a => a.id === appointmentId);
    setNotification({
      message: app ? `You have accepted the appointment request from ${app.participantName}` : `Appointment accepted successfully`,
      type: 'success'
    });
    
    // If accepting from modal, close it
    if (showAppointmentDetails) {
      setShowAppointmentDetails(false);
    }
    
    // Simulate notification to the other user
    simulateNotificationToOtherUser(appointmentId, 'accepted');
    
    return new Promise<void>(resolve => setTimeout(resolve, 500));
  };
  
  const handleRejectAppointment = async (appointmentId: string) => {
    // This would typically be an API call
    setAppointments(prev => 
      prev.map(app => 
        app.id === appointmentId ? {...app, status: 'rejected'} : app
      )
    );
      const app = appointments.find(a => a.id === appointmentId);
    setNotification({
      message: app ? `You have declined the appointment request from ${app.participantName}` : `Appointment rejected`,
      type: 'warning'
    });
    
    // If rejecting from modal, close it
    if (showAppointmentDetails) {
      setShowAppointmentDetails(false);
    }
    
    // Simulate notification to the other user
    simulateNotificationToOtherUser(appointmentId, 'rejected');
    
    return new Promise<void>(resolve => setTimeout(resolve, 500));
  };
  
  const handleStartCall = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowVideoCall(true);
    setShowAppointmentDetails(false);
  };  const handleEndCall = () => {
    setShowVideoCall(false);
    
    // Notify that call has ended
    if (selectedAppointment) {
      setNotification({
        message: `Call with ${selectedAppointment.participantName} has ended`,
        type: 'info'
      });
      
      // Play sound with fallback handling
      playNotificationSound('notification');
    }
    
    // No demo notification needed since we'll simulate Dr. Hassan ending the call
  };// Simulate an incoming call from Dr. Ahmed Hassan specifically (for demonstration purposes)
  useEffect(() => {
    // Only run once, find Dr. Hassan's appointment
    const drHassanAppointment = appointments.find(
      app => app.participantName === "Dr. Ahmed Hassan" && app.isOnline
    );
      if (drHassanAppointment) {
      const simulateIncomingCall = setTimeout(() => {
        setIncomingCall(drHassanAppointment);
        setActiveCall(drHassanAppointment);
        playNotificationSound('call');
      }, 10000); // Simulate after 10 seconds
      
      return () => clearTimeout(simulateIncomingCall);
    }
  }, []); // Empty dependency array ensures it only runs once
  // Simulate Dr. Hassan ending the call after 1 minute of being in the call
  useEffect(() => {
    if (showVideoCall && selectedAppointment?.participantName === "Dr. Ahmed Hassan") {
      const simulateCallEnding = setTimeout(() => {
        // End the call automatically
        setShowVideoCall(false);
        
        // Show notification that Dr. Hassan left the call
        setNotification({
          message: `Dr. Ahmed Hassan has left the call`,
          type: 'info'
        });
        
        // Play notification sound with fallback handling
        playNotificationSound('notification');
      }, 60000); // 1 minute (60 seconds)
      
      return () => clearTimeout(simulateCallEnding);
    }
  }, [showVideoCall, selectedAppointment]);
  
  // Handle incoming call actions
  const handleAcceptIncomingCall = () => {
    if (incomingCall) {
      setSelectedAppointment(incomingCall);
      setIncomingCall(null);
      setShowVideoCall(true);
      
      // Show notification that we joined the call
      setNotification({
        message: `You joined a call with ${incomingCall.participantName}`,
        type: 'info'
      });
    }
  };
  
  const handleRejectIncomingCall = () => {
    setIncomingCall(null);
    setNotification({
      message: `Call declined`,
      type: 'info'
    });
  };
  // Simulate notification to the other user (in a real app, this would use websockets or other real-time tech)
  const simulateNotificationToOtherUser = (appointmentId: string, status: string) => {
    console.log(`Notification sent to other user about appointment ${appointmentId} being ${status}`);
    // In a real app, this would send a notification through your backend
    
    // For demonstration purposes, show a mockup of the notification the other party would receive
    setTimeout(() => {
      const app = appointments.find(a => a.id === appointmentId);
      if (app) {
        let notificationMessage = '';
        let notificationType: 'success' | 'info' | 'warning' = 'info';
          if (status === 'accepted') {
          notificationMessage = `${app.participantName} has accepted your appointment request for "${app.title}"`;
          notificationType = 'success';
        } else if (status === 'rejected') {
          notificationMessage = `${app.participantName} has declined your appointment request for "${app.title}"`;
          notificationType = 'warning';
        }        setNotification({
          message: notificationMessage,
          type: notificationType
        });
        
        // Play notification sound with fallback handling
        playNotificationSound('notification');
      }
    }, 2000); // Delayed to simulate network latency
  };

  return (
    <div className={styles.pageContainer}>
      {/* Header/Navigation */}
      <Navigation 
        title="Appointments" 
        notificationCount={(incomingCall ? 1 : 0) + (notification ? 1 : 0)} 
      />

      <div className={styles.contentWrapper}>
        {/* Left Sidebar with Filters */}
        <FilterSidebar 
          filters={formattedFilters}
          onFilterChange={handleFilterChange}
        />

        {/* Main Content */}
        <main className={styles.mainContent}>
          {/* Search Bar */}
          <SearchBar 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
            placeholder="Search appointments by title or participant name..."
          />          {/* Appointment Listings */}
          <div className={styles.appointmentListings}>            <div className={styles.listingHeader}>
              <h2 className={styles.listingTitle}>Your Appointments</h2>
              <span className={styles.appointmentCount}>
                {filteredAppointments.length} appointment{filteredAppointments.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className={styles.cards}>
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map(appointment => (
                  <AppointmentCard
                    key={appointment.id}
                    id={appointment.id}
                    title={appointment.title}
                    date={appointment.date}
                    time={appointment.time}
                    status={appointment.status}
                    participantName={appointment.participantName}
                    participantType={appointment.participantType}
                    participantEmail={appointment.participantEmail}
                    isOnline={appointment.isOnline}
                    onViewDetails={() => handleViewDetails(appointment)}
                    onAccept={() => handleAcceptAppointment(appointment.id)}
                    onReject={() => handleRejectAppointment(appointment.id)}
                  />
                ))
              ) : (
                <div className={styles.noResults}>
                  <div className={styles.noResultsIcon}>🔍</div>
                  <h3>No appointments found</h3>
                  <p>Try adjusting your search criteria or filters</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Appointment Details Modal */}
      {selectedAppointment && showAppointmentDetails && (
        <AppointmentDetailsModal
          isOpen={showAppointmentDetails}
          onClose={handleCloseModal}
          appointment={selectedAppointment}
          onAccept={() => handleAcceptAppointment(selectedAppointment.id)}
          onReject={() => handleRejectAppointment(selectedAppointment.id)}
          onStartCall={() => handleStartCall(selectedAppointment)}
          currentUserType={currentUserType}
        />
      )}

      {/* Video Call Modal */}
      {selectedAppointment && showVideoCall && (
        <VideoCall
          isOpen={showVideoCall}
          onClose={handleEndCall}
          participantName={selectedAppointment.participantName}
          participantType={selectedAppointment.participantType}
        />
      )}      {/* Notification Component - Using useEffect for auto-dismiss */}
      {notification && (
        <NotificationSystem
          message={notification.message}
          type={notification.type}
          visible={true}
          onClose={() => {
            // This creates a smooth fade-out animation before removing notification
            setTimeout(() => {
              setNotification(null);
            }, NOTIFICATION_CONSTANTS.HIDE_ANIMATION_TIME);
          }}
        />
      )}

      {/* Incoming Call Notification */}
      {incomingCall && (
        <IncomingCallNotification
          callerName={incomingCall.participantName}
          onAccept={handleAcceptIncomingCall}
          onReject={handleRejectIncomingCall}
        />
      )}
        {/* Audio elements for sounds (hidden) */}
      <audio 
        ref={notificationSoundRef} 
        src="/sounds/notification.mp3" 
        preload="auto"
        style={{ display: 'none' }}
      />
      <audio 
        ref={callNotificationSoundRef} 
        src="/sounds/notification.mp3" 
        preload="auto"
        style={{ display: 'none' }}
      />
    </div>
  );
}
