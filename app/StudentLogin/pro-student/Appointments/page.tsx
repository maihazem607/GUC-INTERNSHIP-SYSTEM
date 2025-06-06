"use client";
import styles from "./page.module.css";
import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

// Import modular components
import { Calendar, Clock, PlusCircle, Search } from 'lucide-react';
import ProStudentNavigationMenu from '../Navigation/ProStudentNavigationMenu';
import FilterSidebar from "@/components/global/FilterSidebar";
import SearchBar from "@/components/global/SearchBar";
import AppointmentCard from "@/components/Appointments/AppointmentCard";
import AppointmentDetailsModal from "@/components/Appointments/AppointmentDetailsModal";
import VideoCall from "@/components/Appointments/VideoCall";
import NotificationSystem, { useNotification, NOTIFICATION_CONSTANTS } from "@/components/global/NotificationSystemAdapter";
import IncomingCallNotification from "@/components/Appointments/IncomingCallNotification";
import { Appointment } from "@/components/Appointments/types";
import NewAppointmentForm from "@/components/Appointments/NewAppointmentForm";

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
    status: 'waiting-approval',
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

  // Get URL parameters
  const searchParams = useSearchParams();

  // Use the tab parameter from URL if available, otherwise default to 'my-appointments'
  const initialTab = searchParams.get('tab') || 'my-appointments';

  // Tab navigation state
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  // Use the unified notification system with both toast and persistent notifications
  const { showNotification, addNotification } = useNotification();

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

  // Update active tab when URL parameters change
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['my-appointments', 'requests', 'new-appointment'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Listen for custom tab change events from the appointment form
  useEffect(() => {
    const handleTabChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ tab: string }>;
      if (customEvent.detail && customEvent.detail.tab) {
        setActiveTab(customEvent.detail.tab);
      }
    };

    window.addEventListener('changeTab', handleTabChange);

    return () => {
      window.removeEventListener('changeTab', handleTabChange);
    };
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    status: 'All',
    date: 'All'
  });
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>(
    mockAppointments.filter(app =>
      app.status === 'waiting-approval' ||
      app.status === 'accepted' ||
      app.status === 'rejected' ||
      app.status === 'completed'
    )
  );
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showAppointmentDetails, setShowAppointmentDetails] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [incomingCall, setIncomingCall] = useState<Appointment | null>(null);
  const [activeCall, setActiveCall] = useState<Appointment | null>(null);  // Show notification on initial load that someone accepted your appointment
  
  const notificationShownRef = React.useRef(false);
  
  useEffect(() => {
    // Display an initial notification that someone accepted your appointment
    
    // Prevent duplicate notifications by checking if notifications were already shown
    if (notificationShownRef.current) return;
    
    // Set the ref to true to prevent showing notifications again
    notificationShownRef.current = true;
    
    setTimeout(() => {
      // Find Dr. Emily Rodriguez's appointment and update its status
      const appointmentId = appointments.find(app =>
        app.participantName === "Dr. Emily Rodriguez" &&
        app.title === "Academic Progress Review"
      )?.id;

      if (appointmentId) {
        // Update the appointment status with a visual notification
        setAppointments(prevAppointments =>
          prevAppointments.map(app =>
            app.participantName === "Dr. Emily Rodriguez" && app.title === "Academic Progress Review"
              ? { ...app, status: 'accepted' }
              : app
          )
        );
        // Show toast notification
        showNotification({
          message: "Dr. Emily Rodriguez has accepted your appointment request for \"Academic Progress Review\"",
          type: 'success'
        });

        // Add notification to the bell
        addNotification({
          title: "Appointment Accepted",
          message: "Dr. Emily Rodriguez has accepted your appointment request for \"Academic Progress Review\"",
          type: 'appointment'
        });

        // Add a temporary highlight class to the accepted appointment card
        const appointmentCard = document.querySelector(`[data-appointment-id="${appointmentId}"]`);
        if (appointmentCard) {
          appointmentCard.classList.add(styles.highlightCard);
          setTimeout(() => {
            appointmentCard.classList.remove(styles.highlightCard);
          }, 1100);
        }
      }
    }, 2000); // Show 2 seconds after page load
  }, []);
  // Auto-dismiss is now handled by the unified notification system

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
  ];  // Apply filters and search - using useLayoutEffect to run before browser paint
  useLayoutEffect(() => {
    let results = [...appointments];

    // First apply tab-specific filters
    if (activeTab === 'my-appointments') {
      // Show only appointments with waiting-approval, accepted, rejected, or completed status
      results = results.filter(appointment =>
        appointment.status === 'waiting-approval' ||
        appointment.status === 'accepted' ||
        appointment.status === 'rejected' ||
        appointment.status === 'completed'
      );
    } else if (activeTab === 'requests') {
      // Show only appointments with pending status
      results = results.filter(appointment => appointment.status === 'pending');
    }

    // Then apply user-selected status filter
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

        switch (activeFilters.date) {
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
  }, [searchTerm, activeFilters, appointments, activeTab]);
    // Handle filter changes
  const handleFilterChange = (filterType: string, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType.toLowerCase()]: value
    }));
  };

  // Clear all filters
  const handleClearFilters = () => {
    setActiveFilters({
      status: 'All',
      date: 'All'
    });
    setSearchTerm('');
  };

 // Function to play notification sounds with autoplay fallback
  const playNotificationSound = (type: 'call') => {
    const attemptPlaySound = () => {
      try {
        if (callNotificationSoundRef.current) {
          const playPromise = callNotificationSoundRef.current.play();

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
            playNotificationSound(pendingSound as 'call');

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
        app.id === appointmentId ? { ...app, status: 'accepted' } : app
      )
    ); const app = appointments.find(a => a.id === appointmentId);

    // Only show notifications in my-appointments tab
    if (activeTab === 'my-appointments') {
      // Show toast notification
      showNotification({
        message: app ? `You have accepted the appointment request from ${app.participantName}` : `Appointment accepted successfully`,
        type: 'success'
      });

      // Add to bell notifications
      addNotification({
        title: "Appointment Accepted",
        message: app ? `You have accepted the appointment request from ${app.participantName}` : `Appointment accepted successfully`,
        type: 'appointment'
      });
    }

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
        app.id === appointmentId ? { ...app, status: 'rejected' } : app
      )
    ); const app = appointments.find(a => a.id === appointmentId);

    // Only show notifications in my-appointments tab
    if (activeTab === 'my-appointments') {
      // Show toast notification
      showNotification({
        message: app ? `You have declined the appointment request from ${app.participantName}` : `Appointment rejected`,
        type: 'warning'
      });

      // Add to bell notifications
      addNotification({
        title: "Appointment Declined",
        message: app ? `You have declined the appointment request from ${app.participantName}` : `Appointment rejected`,
        type: 'appointment'
      });
    }

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
  }; const handleEndCall = () => {
    setShowVideoCall(false);
    // Notify that call has ended
    if (selectedAppointment) {
      // Show toast notification
      showNotification({
        message: `Call with ${selectedAppointment.participantName} has ended`,
        type: 'info'
      });

      // Add to bell notifications
      addNotification({
        title: "Call Ended",
        message: `Call with ${selectedAppointment.participantName} has ended`,
        type: 'appointment'
      });

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

  // Simulate Dr. Hassan ending the call after 25 seconds of being in the call
  useEffect(() => {
    if (showVideoCall && selectedAppointment?.participantName === "Dr. Ahmed Hassan") {
      // Simulate Dr. Hassan muting his microphone after 15 seconds
      const simulateMuting = setTimeout(() => {
        // Show notification that Dr. Hassan muted his microphone
        showNotification({
          message: `Dr. Ahmed Hassan has muted his microphone`,
          type: 'info'
        });

        // Add to bell notifications
        addNotification({
          title: "Participant Muted",
          message: `Dr. Ahmed Hassan has muted his microphone`,
          type: 'appointment'
        });
      }, 15000); // 15 seconds

      // Simulate Dr. Hassan ending the call after 25 seconds
      const simulateCallEnding = setTimeout(() => {
        // End the call automatically
        setShowVideoCall(false);

        // Show notification that Dr. Hassan left the call
        showNotification({
          message: `Dr. Ahmed Hassan has left the call`,
          type: 'info'
        });

        // Add to bell notifications
        addNotification({
          title: "Call Ended",
          message: `Dr. Ahmed Hassan has left the call`,
          type: 'appointment'
        });

      }, 25000); // 25 seconds

      return () => {
        clearTimeout(simulateMuting);
        clearTimeout(simulateCallEnding);
      };
    }
  }, [showVideoCall, selectedAppointment]);

  // Handle incoming call actions
  const handleAcceptIncomingCall = () => {
    if (incomingCall) {
      setSelectedAppointment(incomingCall);
      setIncomingCall(null);
      setShowVideoCall(true);
      // Show notification that we joined the call
      showNotification({
        message: `You joined a call with ${incomingCall.participantName}`,
        type: 'info'
      });

      // Add to bell notifications
      addNotification({
        title: "Call Started",
        message: `You joined a call with ${incomingCall.participantName}`,
        type: 'appointment'
      });
    }
  };
  const handleRejectIncomingCall = () => {
    setIncomingCall(null);
    // Show toast notification
    showNotification({
      message: `Call declined`,
      type: 'info'
    });

    // Add to bell notifications
    addNotification({
      title: "Call Declined",
      message: `Call declined`,
      type: 'appointment'
    });
  };
  // Simulate notification to the other user (in a real app, this would use websockets or other real-time tech)
  const simulateNotificationToOtherUser = (appointmentId: string, status: string) => {
    console.log(`Notification sent to other user about appointment ${appointmentId} being ${status}`);
    // In a real app, this would send a notification through your backend

    // Update the appointment status in our local state
    setAppointments(prevAppointments =>
      prevAppointments.map(app =>
        app.id === appointmentId
          ? { ...app, status: status as 'pending' | 'accepted' | 'rejected' | 'completed' }
          : app
      )
    );

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
        }
        // Show toast notification
        showNotification({
          message: notificationMessage,
          type: notificationType
        });

        // Add to bell notifications
        addNotification({
          title: status === 'accepted' ? "Appointment Accepted" : "Appointment Declined",
          message: notificationMessage,
          type: 'appointment'
        });

      }
    }, 2000); // Delayed to simulate network latency
  };// Handle creating a new appointment
  const handleCreateAppointment = async (appointmentData: any) => {    // Check if this is a navigation request from the "Back to list" link
    if (appointmentData.navigateBack) {
      // Return back to the previous tab - my-appointments
      setActiveTab('my-appointments');
      return;
    }
    // This would typically be an API call
    const newAppointment: Appointment = {
      id: `${appointments.length + 1}`,
      title: appointmentData.title,
      date: formatDate(appointmentData.date),
      time: appointmentData.time,
      status: 'waiting-approval', // New appointments in My Appointments use waiting-approval
      participantName: appointmentData.participantName,
      participantType: appointmentData.participantType,
      participantEmail: `${appointmentData.participantName.toLowerCase().replace(' ', '.')}@guc.edu`,
      isOnline: false, // Since we removed the online checkbox
      description: appointmentData.description
    };

    // Add the new appointment to the list
    setAppointments(prev => [...prev, newAppointment]);    // Show success notification
    showNotification({
      message: `Appointment request sent to ${newAppointment.participantName}`,
      type: 'success'
    });

    // Add to bell notifications
    addNotification({
      title: "Appointment Request Sent",
      message: `Appointment request sent to ${newAppointment.participantName}`,
      type: 'appointment'
    });

    // Switch to the My Appointments tab
    setActiveTab('my-appointments');

    return Promise.resolve();
  };

  // Helper function to format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric'
    });
  };

  return (
    <div className={styles.pageContainer}>
      {/* Global Navigation for Pro Student */}
      <ProStudentNavigationMenu />

      <div className={styles.contentWrapper}>
        {/* Left Sidebar with Filters - Only show in appointment listing tabs */}

        {activeTab !== 'new-appointment' && (          
          <FilterSidebar 
            filters={formattedFilters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        )}

        {/* Main Content */}
        <main className={styles.mainContent}>          {/* Tab Navigation is now handled by NavigationMenu */}

          {/* Tab content based on which tab is active */}
          {(activeTab === 'my-appointments' || activeTab === 'requests') && (
            <>
              {/* Search Bar */}
              <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                placeholder="Search appointments by title or participant name..."
              />

              {/* Appointment Listings */}
              <div className={styles.appointmentListings}>
                <div className={styles.listingHeader}>
                  <h2 className={styles.listingTitle}>
                    {activeTab === 'my-appointments' ? 'Your Appointments' : 'Appointment Requests'}
                  </h2>
                  <span className={styles.appointmentCount}>
                    {filteredAppointments.length} appointment{filteredAppointments.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <div className={styles.cards}>
                  {filteredAppointments.length > 0 ? (
                    filteredAppointments.map(appointment => (
                      <div
                        key={appointment.id}
                        data-appointment-id={appointment.id}
                        className={styles.appointmentCardWrapper}
                      >
                        <AppointmentCard
                          id={appointment.id}
                          title={appointment.title}
                          date={appointment.date}
                          time={appointment.time}
                          status={appointment.status}
                          participantName={appointment.participantName}
                          participantType={appointment.participantType}
                          participantEmail={appointment.participantEmail}
                          isOnline={appointment.isOnline}
                          onViewDetails={() => handleViewDetails(appointment)} onAccept={() => handleAcceptAppointment(appointment.id)}
                          onReject={() => handleRejectAppointment(appointment.id)}
                        />
                      </div>
                    ))
                  ) : (
                    <div className={styles.noResults}>
                      <Search
                        size={48}
                        className={styles.searchIcon}
                      />
                      <h3>No appointments found</h3>
                      <p>Try adjusting your search criteria or filters</p>
                      <button 
                        className={styles.shareProfileButton} 
                        onClick={handleClearFilters} 
                        style={{ marginTop: '20px' }}
                      >
                        Clear All Filters
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* New Appointment Form */}
          {activeTab === 'new-appointment' && (
            <NewAppointmentForm onSubmit={handleCreateAppointment} />
          )}
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
