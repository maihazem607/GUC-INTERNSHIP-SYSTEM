import React, { useState, useEffect, useRef } from 'react';
import styles from "./page.module.css";
import { Workshop, Message } from '../../src/components/workshops/types';
import Navigation from '../../src/components/workshops/Navigation';
import SearchBar from '../../src/components/workshops/SearchBar';
import FilterSidebar from '../../src/components/workshops/FilterSidebar';
import WorkshopCard from '../../src/components/workshops/WorkshopCard';
import WorkshopDetailsModal from '../../src/components/workshops/WorkshopDetailsModal';
import LiveSessionModal from '../../src/components/workshops/LiveSessionModal';
import RecordedSessionModal from '../../src/components/workshops/RecordedSessionModal';
import NotificationSystem from '../../src/components/workshops/NotificationSystem';

// Sample data for workshops
const workshops: Workshop[] = [
  {
    id: 1,
    host: 'Microsoft',
    title: 'Introduction to Azure Cloud Services',
    description: 'Learn the basics of cloud computing with Microsoft Azure. This workshop will cover fundamental concepts and provide hands-on experience with key Azure services.',
    date: '15 May 2025',
    time: '2:00 PM - 4:00 PM',
    duration: '2 hours',
    type: 'live',
    category: 'Cloud Computing',
    status: 'upcoming',
    attendees: 245,
    isRegistered: false,
    logo: '/logos/microsoft.png'
  },
  {
    id: 2,
    host: 'Google',
    title: 'Advanced Machine Learning Techniques',
    description: 'Dive deep into advanced machine learning algorithms and techniques. This workshop is designed for those with existing ML knowledge who want to expand their skills.',
    date: '18 May 2025',
    time: '10:00 AM - 1:00 PM',
    duration: '3 hours',
    type: 'live',
    category: 'Machine Learning',
    status: 'upcoming',
    attendees: 178,
    isRegistered: true,
    logo: '/logos/google.png'
  },
  {
    id: 3,
    host: 'Amazon',
    title: 'AWS for Beginners',
    description: 'Start your cloud journey with Amazon Web Services. In this workshop, we will cover the core AWS services and help you build your first cloud application.',
    date: 'Available anytime',
    time: 'Self-paced',
    duration: '2 hours',
    type: 'recorded',
    category: 'Cloud Computing',
    status: 'available',
    attendees: 342,
    isRegistered: true,
    videoUrl: 'https://example.com/workshop-videos/aws-beginners',
    logo: '/logos/amazon.png'
  },
  {
    id: 4,
    host: 'Facebook',
    title: 'React Framework Deep Dive',
    description: 'Explore advanced concepts in React development including hooks, context API, and performance optimization techniques.',
    date: 'Today',
    time: '1:00 PM - 4:00 PM',
    duration: '3 hours',
    type: 'live',
    category: 'Web Development',
    status: 'ongoing',
    attendees: 198,
    isRegistered: false,
    logo: '/logos/facebook.png'
  },
  {
    id: 5,
    host: 'Apple',
    title: 'iOS App Development Fundamentals',
    description: 'Start your journey into iOS app development with Swift. Learn the core concepts needed to build your first iOS application.',
    date: '20 May 2025',
    time: '9:00 AM - 12:00 PM',
    duration: '3 hours',
    type: 'live',
    category: 'Mobile Development',
    status: 'upcoming',
    attendees: 156,
    isRegistered: false,
    logo: '/logos/apple.png'
  },
  {
    id: 6,
    host: 'IBM',
    title: 'Blockchain Technology and Applications',
    description: 'Understand the fundamentals of blockchain technology and explore its applications across various industries.',
    date: 'Available anytime',
    time: 'Self-paced',
    duration: '2 hours',
    type: 'recorded',
    category: 'Blockchain',
    status: 'available',
    attendees: 213,
    isRegistered: true,
    videoUrl: 'https://example.com/workshop-videos/blockchain-tech',
    logo: '/logos/ibm.png',
    progress: 65
  },
  {
    id: 7,
    host: 'Adobe',
    title: 'UX/UI Design Principles',
    description: 'Learn essential UX/UI design principles and best practices for creating intuitive and engaging user interfaces.',
    date: '25 May 2025',
    time: '2:00 PM - 5:00 PM',
    duration: '3 hours',
    type: 'live',
    category: 'Design',
    status: 'upcoming',
    attendees: 187,
    isRegistered: false,
    logo: '/logos/adobe.png'
  },
  {
    id: 8,
    host: 'Salesforce',
    title: 'CRM Strategy and Implementation',
    description: 'Discover effective CRM strategies and implementation techniques using Salesforce platform.',
    date: 'Available anytime',
    time: 'Self-paced',
    duration: '2 hours',
    type: 'recorded',
    category: 'Business',
    status: 'available',
    attendees: 124,
    isRegistered: false,
    videoUrl: 'https://example.com/workshop-videos/salesforce-crm',
    logo: '/logos/salesforce.png'
  },
  {
    id: 9,
    host: 'Tesla',
    title: 'Sustainable Energy Solutions',
    description: 'Explore the future of sustainable energy and learn about the latest innovations in renewable energy technologies.',
    date: 'Today',
    time: '3:00 PM - 5:00 PM',
    duration: '2 hours',
    type: 'live',
    category: 'Technology',
    status: 'ongoing',
    attendees: 215,
    isRegistered: true,
    logo: '/logos/tesla.png'
  },
  {
    id: 10,
    host: 'Netflix',
    title: 'Digital Content Production',
    description: 'Learn about modern digital content production techniques and workflows used in today\'s streaming industry.',
    date: 'Available anytime',
    time: 'Self-paced',
    duration: '3 hours',
    type: 'recorded',
    category: 'Media',
    status: 'available',
    attendees: 276,
    isRegistered: true,
    videoUrl: 'https://example.com/workshop-videos/digital-content',
    logo: '/logos/netflix.png',
    progress: 85
  }
];

// Sample chat messages
const sampleMessages: Message[] = [
  {
    id: 1,
    sender: 'John Doe',
    text: 'Hello everyone! Excited for this workshop.',
    time: '2:03 PM'
  },
  {
    id: 2,
    sender: 'Sarah Miller',
    text: 'Does anyone know if there will be hands-on exercises?',
    time: '2:05 PM'
  },
  {
    id: 3,
    sender: 'Workshop Host',
    text: 'Yes, we\'ll have practical exercises in the second half. Make sure you have your environment set up as mentioned in the pre-workshop email.',
    time: '2:06 PM'
  },
  {
    id: 4,
    sender: 'Alex Johnson',
    text: 'Is there a GitHub repo with the materials?',
    time: '2:08 PM'
  }
];

export default function WorkshopListPage() {
  // State variables
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    category: 'All Categories',
    type: 'All Types',
    status: 'All Statuses'
  });
  const [filteredWorkshops, setFilteredWorkshops] = useState<Workshop[]>(workshops);
  const [starredWorkshops, setStarredWorkshops] = useState<number[]>([]);
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isLiveModalOpen, setIsLiveModalOpen] = useState(false);
  const [isRecordedModalOpen, setIsRecordedModalOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(sampleMessages);
  const [newMessage, setNewMessage] = useState('');
  const [videoProgress, setVideoProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [notifications, setNotifications] = useState<string[]>([]);
  
  // References
  const videoIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Available filter options
  const categories = ['All Categories', 'Cloud Computing', 'Machine Learning', 'Web Development', 'Mobile Development', 'Blockchain', 'Design', 'Business', 'Technology', 'Media'];
  const types = ['All Types', 'Live', 'Recorded'];
  const statuses = ['All Statuses', 'Upcoming', 'Ongoing', 'Past', 'Available'];

  // Apply filters and search
  useEffect(() => {
    let results = [...workshops];
    
    // Apply category filter
    if (activeFilters.category !== 'All Categories') {
      results = results.filter(workshop => workshop.category === activeFilters.category);
    }
    
    // Apply type filter
    if (activeFilters.type !== 'All Types') {
      const type = activeFilters.type.toLowerCase() as 'live' | 'recorded';
      results = results.filter(workshop => workshop.type === type);
    }
    
    // Apply status filter
    if (activeFilters.status !== 'All Statuses') {
      const status = activeFilters.status.toLowerCase() as 'upcoming' | 'ongoing' | 'past' | 'available';
      results = results.filter(workshop => workshop.status === status);
    }
    
    // Apply search term (title or host)
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

  // Handle starring/unstarring workshops
  const toggleStar = (id: number) => {
    setStarredWorkshops(prev =>
      prev.includes(id)
        ? prev.filter(starredId => starredId !== id)
        : [...prev, id]
    );
  };

  // Show workshop details
  const showWorkshopDetails = (workshop: Workshop) => {
    setSelectedWorkshop(workshop);
    setIsDetailsModalOpen(true);
  };

  // Handle registration for a workshop
  const registerForWorkshop = (workshop: Workshop) => {
    // In a real application, this would make an API call
    const updatedWorkshops = workshops.map(w => {
      if (w.id === workshop.id) {
        return { ...w, isRegistered: true };
      }
      return w;
    });
    
    // Update filtered workshops with the registration changes
    setFilteredWorkshops(
      filteredWorkshops.map(w => {
        if (w.id === workshop.id) {
          return { ...w, isRegistered: true };
        }
        return w;
      })
    );
    
    // Show notification
    addNotification(`Successfully registered for "${workshop.title}"`);
  };

  // Join a live workshop
  const joinLiveWorkshop = (workshop: Workshop) => {
    setSelectedWorkshop(workshop);
    setIsLiveModalOpen(true);
    addNotification(`You've joined the live workshop: ${workshop.title}`);
  };

  // Watch a recorded workshop
  const watchRecordedWorkshop = (workshop: Workshop) => {
    setSelectedWorkshop(workshop);
    setIsRecordedModalOpen(true);
    
    // Initialize with existing progress if available
    if (workshop.progress) {
      setVideoProgress(workshop.progress);
    } else {
      setVideoProgress(0);
    }
    
    setIsPlaying(true);
    
    // Simulate video progress
    if (videoIntervalRef.current) {
      clearInterval(videoIntervalRef.current);
    }
    
    videoIntervalRef.current = setInterval(() => {
      setVideoProgress(prev => {
        const newProgress = prev + 0.5; // Slower progression for more realistic video playback
        
        if (newProgress >= 100) {
          if (videoIntervalRef.current) {
            clearInterval(videoIntervalRef.current);
            setIsPlaying(false);
            // Add notification that workshop is complete and certificate is available
            addNotification(`You've completed the "${workshop.title}" workshop! Your certificate is ready.`);
            return 100;
          }
        }
        return newProgress;
      });
    }, 1000);
  };

  // Toggle play/pause for recorded workshop
  const togglePlayPause = () => {
    if (isPlaying) {
      // Pause the video
      if (videoIntervalRef.current) {
        clearInterval(videoIntervalRef.current);
        addNotification('Workshop video paused');
      }
    } else {
      // Resume or start the video
      videoIntervalRef.current = setInterval(() => {
        setVideoProgress(prev => {
          const newProgress = prev + 0.5;
          if (newProgress >= 100) {
            if (videoIntervalRef.current) {
              clearInterval(videoIntervalRef.current);
              setIsPlaying(false);
              addNotification('Workshop completed! Your certificate is now available.');
              return 100;
            }
          }
          return newProgress;
        });
      }, 1000);
      
      addNotification('Workshop video playing');
    }
    setIsPlaying(!isPlaying);
  };

  // Handle sending a chat message
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    
    const message: Message = {
      id: messages.length + 1,
      sender: 'You',
      text: newMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, message]);
    setNewMessage('');
    
    // Simulate a response after a delay
    setTimeout(() => {
      const responseMessage: Message = {
        id: messages.length + 2,
        sender: 'Workshop Host',
        text: `Thanks for your question! We'll address it shortly.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, responseMessage]);
      
      // Show notification
      addNotification('New message from Workshop Host');
    }, 2000);
    
    // Simulate random participant messages in live chat
    if (Math.random() > 0.5) {
      const participants = ['Alex Smith', 'Maria Garcia', 'James Wilson', 'Workshop Assistant'];
      const randomMessages = [
        'Great point!',
        'Could you elaborate on that topic further?',
        'Thanks for sharing that perspective!',
        'Does anyone have examples from their experience?',
        'I found this article related to the topic: https://example.com/resource'
      ];
      
      // Random delay between 5-15 seconds
      const randomDelay = 5000 + Math.floor(Math.random() * 10000);
      
      setTimeout(() => {
        const randomParticipant = participants[Math.floor(Math.random() * participants.length)];
        const randomText = randomMessages[Math.floor(Math.random() * randomMessages.length)];
        
        const participantMessage: Message = {
          id: Date.now(),
          sender: randomParticipant,
          text: randomText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setMessages(prev => [...prev, participantMessage]);
        
        // Show notification for new message
        addNotification(`New message from ${randomParticipant}`);
      }, randomDelay);
    }
  };

  // Clean up interval on unmount or when modal closes
  useEffect(() => {
    return () => {
      if (videoIntervalRef.current) {
        clearInterval(videoIntervalRef.current);
      }
    };
  }, []);

  // Handle submitting feedback for a workshop
  const submitFeedback = () => {
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    
    // In a real application, this would make an API call
    addNotification('Thank you for your feedback!');
    
    // Reset feedback form
    setRating(0);
    setFeedback('');
    setIsLiveModalOpen(false);
    setIsRecordedModalOpen(false);
  };

  // Generate a certificate
  const generateCertificate = () => {
    if (selectedWorkshop) {
      const workshopTitle = selectedWorkshop.title;
      const host = selectedWorkshop.host;
      
      // In a real application, this would generate a real certificate with user details
      addNotification(`Your certificate for "${workshopTitle}" has been generated`);
      
      // Simulate certificate download by showing a confirmation dialog
      setTimeout(() => {
        if (confirm(`Download your certificate for "${workshopTitle}" by ${host}?`)) {
          // This would be a real download in a production app
          addNotification('Certificate downloaded successfully');
        }
      }, 1000);
    }
  };

  // Add a notification
  const addNotification = (message: string) => {
    setNotifications(prev => [...prev, message]);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n !== message));
    }, 5000);
  };

  // Get background color for cards
  const getCardBackground = (id: number): string => {
    const colors = [
      '#ffe8f0', '#e8f3ff', '#e8ffe8', '#fff0e8', '#f0e8ff',
      '#e8fff0', '#fff8e8', '#e8f0ff', '#ffe8e8', '#e8ffea',
      '#f0ffe8', '#fff0f0'
    ];
    return colors[id % colors.length];
  };

  return (
    <div className={styles.pageContainer}>
      {/* Navigation Component */}
      <Navigation />

      <div className={styles.contentWrapper}>
        {/* Filter Sidebar Component */}
        <FilterSidebar 
          activeFilters={activeFilters}
          handleFilterChange={handleFilterChange}
          categories={categories}
          types={types}
          statuses={statuses}
        />

        {/* Main Content */}
        <main className={styles.mainContent}>
          {/* Search Bar Component */}
          <SearchBar 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />

          {/* Workshop Listings */}
          <div className={styles.workshopListings}>
            <div className={styles.listingHeader}>
              <h2 className={styles.listingTitle}>Available Workshops</h2>
              <span className={styles.workshopCount}>{filteredWorkshops.length}</span>
            </div>

            <div className={styles.cards}>
              {filteredWorkshops.length > 0 ? (
                filteredWorkshops.map((workshop) => (
                  <WorkshopCard 
                    key={workshop.id}
                    workshop={workshop}
                    isStarred={starredWorkshops.includes(workshop.id)}
                    toggleStar={toggleStar}
                    showDetails={showWorkshopDetails}
                    onRegister={registerForWorkshop}
                    onJoinLive={joinLiveWorkshop}
                    onWatch={watchRecordedWorkshop}
                    cardBackground={getCardBackground(workshop.id)}
                  />
                ))
              ) : (
                <div className={styles.noResults}>
                  <div className={styles.noResultsIcon}>🔍</div>
                  <h3>No workshops found</h3>
                  <p>Try adjusting your search criteria or filters</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Workshop Details Modal */}
      {isDetailsModalOpen && selectedWorkshop && (
        <WorkshopDetailsModal
          workshop={selectedWorkshop}
          onClose={() => setIsDetailsModalOpen(false)}
          onRegister={(workshop) => {
            registerForWorkshop(workshop);
            setIsDetailsModalOpen(false);
          }}
          onJoinLive={(workshop) => {
            joinLiveWorkshop(workshop);
            setIsDetailsModalOpen(false);
          }}
          onWatch={(workshop) => {
            watchRecordedWorkshop(workshop);
            setIsDetailsModalOpen(false);
          }}
        />
      )}

      {/* Live Workshop Modal */}
      {isLiveModalOpen && selectedWorkshop && (
        <LiveSessionModal
          workshop={selectedWorkshop}
          onClose={() => setIsLiveModalOpen(false)}
          messages={messages}
          setMessages={setMessages}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          notes={notes}
          setNotes={setNotes}
          rating={rating}
          setRating={setRating}
          feedback={feedback}
          setFeedback={setFeedback}
          addNotification={addNotification}
          submitFeedback={submitFeedback}
          generateCertificate={generateCertificate}
          sendMessage={sendMessage}
        />
      )}

      {/* Recorded Workshop Modal */}
      {isRecordedModalOpen && selectedWorkshop && (
        <RecordedSessionModal
          workshop={selectedWorkshop}
          onClose={() => {
            setIsRecordedModalOpen(false);
            if (videoIntervalRef.current) {
              clearInterval(videoIntervalRef.current);
            }
          }}
          videoProgress={videoProgress}
          isPlaying={isPlaying}
          notes={notes}
          setNotes={setNotes}
          rating={rating}
          setRating={setRating}
          feedback={feedback}
          setFeedback={setFeedback}
          togglePlayPause={togglePlayPause}
          addNotification={addNotification}
          submitFeedback={submitFeedback}
          generateCertificate={generateCertificate}
        />
      )}

      {/* Notifications System */}
      <NotificationSystem notifications={notifications} />
    </div>
  );
}