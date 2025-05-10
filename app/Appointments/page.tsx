"use client";
import styles from "./page.module.css";
import React, { useState, useEffect } from 'react';

// Import modular components
import Navigation from "../../src/components/global/Navigation";
import FilterSidebar from "../../src/components/global/FilterSidebar";
import SearchBar from "../../src/components/global/SearchBar";
import AppointmentCard from "../../src/components/Appointments/AppointmentCard";
import AppointmentDetailsModal from "@/components/Appointments/AppointmentDetailsModal";
import VideoCall from "@/components/Appointments/VideoCall";
import NotificationSystem from "@/components/Appointments/NotificationSystem";
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
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    status: 'All',
    date: 'All'
  });
  
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>(appointments);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showAppointmentDetails, setShowAppointmentDetails] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error' | 'info' | 'warning'} | null>(null);
  const [incomingCall, setIncomingCall] = useState<Appointment | null>(null);
  
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
    
    setNotification({
      message: `Appointment accepted successfully`,
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
    
    setNotification({
      message: `Appointment rejected`,
      type: 'info'
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
  };
  
  const handleEndCall = () => {
    setShowVideoCall(false);
    
    // Notify that call has ended
    setNotification({
      message: `Call ended`,
      type: 'info'
    });
  };
  
  // Simulate an incoming call (for demonstration purposes)
  useEffect(() => {
    const simulateIncomingCall = setTimeout(() => {
      // Find an online and accepted appointment to simulate an incoming call
      const acceptedAppointments = appointments.filter(
        app => app.status === 'accepted' && app.isOnline
      );
      
      if (acceptedAppointments.length > 0) {
        const randomAppointment = acceptedAppointments[Math.floor(Math.random() * acceptedAppointments.length)];
        setIncomingCall(randomAppointment);
      }
    }, 15000); // Simulate after 15 seconds
    
    return () => clearTimeout(simulateIncomingCall);
  }, [appointments]);
  
  // Handle incoming call actions
  const handleAcceptIncomingCall = () => {
    if (incomingCall) {
      setSelectedAppointment(incomingCall);
      setIncomingCall(null);
      setShowVideoCall(true);
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
          />

          {/* Appointment Listings */}
          <div className={styles.appointmentListings}>
            <div className={styles.listingHeader}>
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
      )}

      {/* Notification Component */}
      {notification && (
        <NotificationSystem
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
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
    </div>
  );
}
