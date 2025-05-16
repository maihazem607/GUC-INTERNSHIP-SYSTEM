"use client";
import styles from "./page.module.css";
import React, { useState, useEffect } from 'react';

// Import modular components
import SCADNavigation from "../Navigation/SCADNavigation";
import FilterSidebar from "@/components/global/FilterSidebar";
import SearchBar from "@/components/global/SearchBar";
import WorkshopCard from "@/components/workshops/WorkshopCard";
import WorkshopDetailsModal from "@/components/workshops/WorkshopDetailsModal";
import LiveSessionModal from "@/components/workshops/LiveSessionModal";
import RecordedSessionModal from "@/components/workshops/RecordedSessionModal";
import NotificationSystem, { useNotification } from "@/components/global/NotificationSystemAdapter";
import { Workshop } from "@/components/workshops/types";
import SCADWorkshopCard from "../../../src/components/workshops/SCADWorkshopCard";
import { useRouter, useSearchParams } from 'next/navigation';
import { Building, Users, FileText, Settings, ClipboardCheck, Briefcase, Calendar, BookOpen, BarChart2, Search } from 'lucide-react';

// Workshop data (would typically come from an API)
const workshops: Workshop[] = [
  {
    id: 1,
    title: "Introduction to UX Design Principles",
    date: "June 15, 2023",
    time: "2:00 PM - 4:00 PM EST",
    duration: "2 hours",
    host: "Adobe Creative Team",
    description: "Learn the fundamental principles of UX design in this introductory workshop. We'll cover user research, wireframing, prototyping, and usability testing fundamentals.",
    status: "upcoming",
    type: "live",
    isRegistered: false,
    logo: "/logos/adobe.png"
  },
  {
    id: 2,
    title: "Advanced React Patterns",
    date: "June 18, 2023",
    time: "1:00 PM - 3:30 PM EST",
    duration: "2.5 hours",
    host: "Facebook Engineers",
    description: "Dive deep into advanced React patterns including custom hooks, context optimization, and performance tuning for complex applications.",
    status: "upcoming",
    type: "live",
    isRegistered: true,
    logo: "/logos/facebook.png"
  },
  {
    id: 3,
    title: "Cloud Architecture Fundamentals",
    date: "June 10, 2023",
    time: "11:00 AM - 1:00 PM EST",
    duration: "2 hours",
    host: "Amazon AWS Team",
    description: "Get started with cloud architecture principles. We'll explore AWS services, deployment strategies, and best practices for scalable applications.",
    status: "ongoing",
    type: "live",
    isRegistered: true,
    logo: "/logos/amazon.png"
  },
  {
    id: 4,
    title: "Machine Learning for Beginners",
    date: "June 5, 2023",
    time: "10:00 AM - 12:00 PM EST",
    duration: "2 hours",
    host: "Google AI Team",
    description: "An introduction to machine learning concepts for beginners. Learn about supervised learning, neural networks, and implementing ML models.",
    status: "completed",
    type: "recorded",
    isRegistered: true,
    logo: "/logos/google.png"
  },
  {
    id: 5,
    title: "Design Systems at Scale",
    date: "June 3, 2023",
    time: "3:00 PM - 5:00 PM EST",
    duration: "2 hours",
    host: "Airbnb Design Team",
    description: "Discover how to create and maintain design systems at scale. Topics include component libraries, documentation, and cross-team collaboration.",
    status: "completed",
    type: "recorded",
    isRegistered: true,
    logo: "/logos/airbnb.png"
  },
  {
    id: 6,
    title: "iOS App Development Masterclass",
    date: "June 20, 2023",
    time: "1:00 PM - 4:00 PM EST",
    duration: "3 hours",
    host: "Apple Developer Team",
    description: "Master iOS development with Swift and SwiftUI. This workshop covers app architecture, UI design, and submitting to the App Store.",
    status: "upcoming",
    type: "live",
    isRegistered: false,
    logo: "/logos/apple.png"
  },
  {
    id: 7,
    title: "Data Science with Python",
    date: "June 25, 2023",
    time: "11:00 AM - 1:00 PM EST",
    duration: "2 hours",
    host: "IBM Data Scientists",
    description: "Learn how to analyze and visualize data using Python libraries like Pandas, NumPy, and Matplotlib in this hands-on workshop.",
    status: "upcoming",
    type: "live",
    isRegistered: false,
    logo: "/logos/ibm.png"
  },
  {
    id: 8,
    title: "Cybersecurity Essentials",
    date: "June 30, 2023",
    time: "2:00 PM - 4:00 PM EST",
    duration: "2 hours",
    host: "Microsoft Security Team",
    description: "Understand the fundamentals of cybersecurity including threat detection, encryption, and implementing security best practices.",
    status: "upcoming",
    type: "live",
    isRegistered: false,
    logo: "/logos/microsoft.png"
  }
];

type ActiveMenuItem = 'companies' | 'students' | 'reports' | 'settings' | 'evaluations' | 'internships' | 'appointments'| 'workshops' | 'internship-requests' | 'internship-reports' | 'internship-evaluations' | 'internship-settings'| 'internship-statistics' ;



// Mock data for appointments dropdown counts

const appointments = [
  {
    id: "1",
    title: "Career Counseling Session",
    date: "May 15, 2025",
    time: "10:00 AM - 11:00 AM",
    status: 'waiting-approval',
    participantName: "Dr. Ahmed Hassan",
    participantType: "pro-student",
    participantEmail: "ahmed.hassan@guc.edu",
    isOnline: true,
    description: "Discuss career options after graduation and strategies for job applications.",
  },
  {
    id: "2",
    title: "Internship Application Review",
    date: "May 18, 2025",
    time: "2:00 PM - 3:00 PM",
    status: 'accepted',
    participantName: "Dr. Sarah Johnson",
    participantType: "student",
    participantEmail: "sarah.johnson@guc.edu",
    isOnline: false,
    description: "Review internship applications and provide feedback on resume and cover letter.",
  },
  {
    id: "3",
    title: "Academic Advising",
    date: "May 20, 2025",
    time: "11:00 AM - 12:00 PM",
    status: 'pending',
    participantName: "Dr. Emily Rodriguez",
    participantType: "scad",
    participantEmail: "emily.rodriguez@guc.edu",
    isOnline: false,
    description: "Review academic performance from previous semester and discuss areas for improvement.",
  }
];


export default function WorkshopListPage() {
  const router = useRouter();
  const searchParams = useSearchParams(); 
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    status: 'All',
    type: 'All'
  });
  const [filteredWorkshops, setFilteredWorkshops] = useState<Workshop[]>(workshops);
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [liveSession, setLiveSession] = useState<Workshop | null>(null);
  const [recordedSession, setRecordedSession] = useState<Workshop | null>(null);  // Get notification handling from the unified system
  const { notification, visible, showNotification, hideNotification, addNotification } = useNotification();

  // Get active item from URL parameter or default to 'workshops'
  const [activeItem, setActiveItem] = useState<ActiveMenuItem>(
    (searchParams.get('activeItem') as ActiveMenuItem) || 'workshops'
  );

  // For handling appointments dropdown
  const [activeTab, setActiveTab] = useState<string>('my-appointments');

  // Filter options
  const statusOptions = ['All', 'Upcoming', 'Ongoing', 'Completed'];
  const typeOptions = ['All', 'Live', 'Recorded'];

  // Format filters for the global FilterSidebar component
  const formattedFilters = [
    {
      title: "Status",
      options: statusOptions,
      type: "status",
      value: activeFilters.status
    },
    {
      title: "Type",
      options: typeOptions,
      type: "type",
      value: activeFilters.type
    }
  ];

  // Apply filters and search
  useEffect(() => {
    let results = [...workshops];
    
    // Apply status filter
    if (activeFilters.status !== 'All') {
      const status = activeFilters.status.toLowerCase();
      results = results.filter(workshop => workshop.status === status);
    }
    
    // Apply type filter
    if (activeFilters.type !== 'All') {
      const type = activeFilters.type.toLowerCase();
      results = results.filter(workshop => workshop.type === type);
    }
    
    // Apply search
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        workshop => 
          workshop.title.toLowerCase().includes(term) || 
          workshop.host.toLowerCase().includes(term)
      );
    }
    
    setFilteredWorkshops(results);
  }, [searchTerm, activeFilters]);
    // Handle filter changes
  const handleFilterChange = (filterType: string, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };
  
  // Clear all filters
  const handleClearFilters = () => {
    setActiveFilters({
      status: 'All',
      type: 'All'
    });
    setSearchTerm('');
  };

  // Update URL when tab changes
  useEffect(() => {
    if (activeTab) {
      const current = new URLSearchParams(window.location.search);
      current.set('tab', activeTab);
      const newSearch = current.toString();
      router.push(`/SCADLogin/workshops?${newSearch}`);
    }

  }, [activeTab, router]);

  // Workshop action handlers
  const handleViewDetails = (workshop: Workshop) => {
    setSelectedWorkshop(workshop);
  };
  
  const handleCloseModal = () => {
    setSelectedWorkshop(null);
  };

  const handleRegister = async (workshop: Workshop) => {
    // This would typically be an API call
    console.log(`Registered for workshop: ${workshop.title}`);
    
    // Use setTimeout for notification and closing windows
    setTimeout(() => {
      // Close modal if it was open
      if (selectedWorkshop && selectedWorkshop.id === workshop.id) {
        setSelectedWorkshop(null);
      }
      
      // Show success notification
      showNotification({
        message: `Successfully registered for "${workshop.title}"`,
        type: 'success'
      });
      
      // Add persistent notification to bell icon
      addNotification({
        title: "Workshop Registration",
        message: `You've successfully registered for "${workshop.title}" on ${workshop.date}`,
        type: 'application'
      });
    }, 800); // Simulate network delay
    
    return new Promise<void>(resolve => setTimeout(resolve, 1000));
  };
    
  const handleJoinLive = async (workshop: Workshop) => {
    // This would typically connect to a live session
    setTimeout(() => {
      setLiveSession(workshop);
      
      // Show success notification
      showNotification({
        message: `Joining live session for "${workshop.title}"`,
        type: 'info'
      });
      
      // Add to bell notifications
      addNotification({
        title: "Joining Workshop",
        message: `You've joined the live session for "${workshop.title}"`,
        type: 'application'
      });
      
      // Close the details modal if it was open
      if (selectedWorkshop && selectedWorkshop.id === workshop.id) {
        setSelectedWorkshop(null);
      }
    }, 800);
    
    return new Promise<void>(resolve => setTimeout(resolve, 1000));
  };
    
  const handleWatchRecording = async (workshop: Workshop) => {
    // This would typically fetch a recording
    setTimeout(() => {
      setRecordedSession(workshop);
      
      // Show success notification
      showNotification({
        message: `Loading recording for "${workshop.title}"`,
        type: 'info'
      });
      
      // Add to bell notifications
      addNotification({
        title: "Workshop Recording",
        message: `You've started watching the recording for "${workshop.title}"`,
        type: 'application'
      });
      
      // Close the details modal if it was open
      if (selectedWorkshop && selectedWorkshop.id === workshop.id) {
        setSelectedWorkshop(null);
      }
    }, 800);
    
    return new Promise<void>(resolve => setTimeout(resolve, 1000));
  };

  return (
    <div className={styles.pageContainer}>
      {/* Header/Navigation */}
      <SCADNavigation
        activeItem="workshops"
        onActiveItemChange={(itemId) => router.push(`/SCADLogin/SCADdashboard?activeItem=${itemId}`)}
        onLogout={() => router.push('/')}
      />

      <div className={styles.contentWrapper}>
        {/* Left Sidebar with Filters */}        <FilterSidebar 
          filters={formattedFilters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        {/* Main Content */}
        <main className={styles.mainContent}>
          {/* Search Bar */}
          <SearchBar 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
            placeholder="Search workshops by title or host..."
          />

          {/* Workshop Listings */}
          <div className={styles.workshopListings}>
            <div className={styles.listingHeader}>
                <h2 className={styles.listingTitle}>Career Workshops Management</h2>              <span className={styles.workshopCount}>
                {filteredWorkshops.length} workshop{filteredWorkshops.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className={styles.cards}>
              {filteredWorkshops.length > 0 ? (
                filteredWorkshops.map(workshop => (
                  <SCADWorkshopCard
                    key={workshop.id}
                    workshop={workshop}
                    onViewDetails={handleViewDetails}
                  />
                ))
              ) : (
                <div className={styles.noResults}>
                 <Search 
                    size={48} 
                    className={styles.searchIcon} 
                  /> 
                  <h3>No workshops found</h3>
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
        </main>
      </div> 
      {/* Details Modal */}
      {selectedWorkshop && (
        <WorkshopDetailsModal
          workshop={selectedWorkshop}
          onClose={handleCloseModal}
          onRegister={handleRegister}
          onJoinLive={handleJoinLive}
          onWatch={handleWatchRecording}
        />
      )}

      {/* Live Session Modal */}
      {liveSession && (
        <LiveSessionModal
          workshop={liveSession}
          onClose={() => setLiveSession(null)}
        />
      )}

      {/* Recorded Session Modal */}
      {recordedSession && (
        <RecordedSessionModal
          workshop={recordedSession}
          onClose={() => setRecordedSession(null)}
        />
      )}
    </div>
  );
}