'use client';
import { useState, useEffect } from 'react';
import styles from './page.module.css';

// Storage keys for localStorage
const STORAGE_KEYS = {
    APPLICATIONS: 'company-applications-data',
    INTERNSHIP_POSTS: 'company-internship-posts-data',
    INTERNS: 'company-interns-data'
};

// Helper function to handle date serialization/deserialization
const deserializeDates = (obj: any) => {
    if (obj === null || obj === undefined || typeof obj !== 'object') return obj;
    
    Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(obj[key])) {
            obj[key] = new Date(obj[key]);
        } else if (typeof obj[key] === 'object') {
            obj[key] = deserializeDates(obj[key]);
        }
    });
    
    return obj;
};

// Import global components
import { useNotification } from "@/components/global/NotificationSystemAdapter";
import FilterSidebar from "@/components/global/FilterSidebar";
import SearchBar from "@/components/global/SearchBar";
import CompanyNavigationMenu from '../Navigation/CompanyNavigationMenu';

// Import components
import ApplicationsList from "@/components/Companyy/ApplicationsList";
import ApplicationDetailsModal from "@/components/Companyy/ApplicationDetailsModal";

// Import types
import { Application, InternshipPost, Intern } from "@/components/Companyy/types";

// Applications Page Component
const ApplicationsPage = () => {
    // Search states
    const [applicationSearchTerm, setApplicationSearchTerm] = useState('');
    
    // Filter states
    const [applicationFilter, setApplicationFilter] = useState('all');
    
    // Track active filters separately for status and post
    const [activeStatusFilter, setActiveStatusFilter] = useState<string>('all');
    const [activePostFilter, setActivePostFilter] = useState<string>('All');
    
    // Data states
    const [internshipPosts, setInternshipPosts] = useState<InternshipPost[]>([]);
    const [applications, setApplications] = useState<Application[]>([]);
    
    // Selection states
    const [selectedPost, setSelectedPost] = useState<InternshipPost | null>(null);
    const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
    
    // Using the unified notification context
    const { 
        notification, 
        visible, 
        showNotification, 
        hideNotification,
        addNotification,
        notifications,
        unreadCount
    } = useNotification();

    // Clear all filters function
    const handleClearFilters = () => {
        setApplicationFilter('all');
        setActiveStatusFilter('all');
        setActivePostFilter('All');
        setSelectedPost(null);
        setApplicationSearchTerm('');
    };    // Load data from localStorage or initialize with mock data
    useEffect(() => {
        // Load internship posts
        let storedPosts = localStorage.getItem(STORAGE_KEYS.INTERNSHIP_POSTS);
        let posts: InternshipPost[];
        
        if (storedPosts) {
            try {
                posts = deserializeDates(JSON.parse(storedPosts));
            } catch (e) {
                // Fallback to mock data if parsing fails
                posts = getDefaultInternshipPosts();
            }
        } else {
            posts = getDefaultInternshipPosts();
        }
        
        // Load applications
        let storedApplications = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
        let apps: Application[];
        
        if (storedApplications) {
            try {
                apps = deserializeDates(JSON.parse(storedApplications));
            } catch (e) {
                // Fallback to mock data if parsing fails
                apps = getDefaultApplications();
            }
        } else {
            apps = getDefaultApplications();
        }
        
        setInternshipPosts(posts);
        setApplications(apps);
    }, []);
    
    // Helper function to get default internship posts data
    const getDefaultInternshipPosts = (): InternshipPost[] => {
        return [
            {
                id: '1',
                title: 'Frontend Developer Intern',
                description: 'Work on React-based applications',
                department: 'Engineering',
                postedDate: new Date('2023-05-01'),
                deadline: new Date('2023-06-30'),
                applicationsCount: 12,
                duration: '3 months',
                isPaid: true,
                expectedSalary: 2000,
                skillsRequired: ['React', 'JavaScript', 'CSS'],
            },
            {
                id: '2',
                title: 'Marketing Intern',
                description: 'Social media campaigns',
                department: 'Marketing',
                postedDate: new Date('2023-05-15'),
                deadline: new Date('2023-07-15'),
                applicationsCount: 8,
                duration: '2 months',
                isPaid: false,
                expectedSalary: undefined,
                skillsRequired: ['Social Media', 'Content Creation'],
            },
        ];
    };
    
    // Helper function to get default applications data
    const getDefaultApplications = (): Application[] => {
        return [
            {
                id: '1',
                internshipPostId: '1',
                internshipTitle: 'Frontend Developer Intern',
                applicantName: 'John Doe',
                applicantEmail: 'john@university.edu',
                applicantUniversity: 'GUC',
                applicantMajor: 'Computer Science',
                applicationDate: new Date('2023-05-10'),
                status: 'pending',
                resumeUrl: '#',
                coverLetterUrl: '#',
            },
            {
                id: '2',
                internshipPostId: '1',
                internshipTitle: 'Frontend Developer Intern',
                applicantName: 'Jane Smith',
                applicantEmail: 'jane@university.edu',
                applicantUniversity: 'GUC',
                applicantMajor: 'Interactive Design',
                applicationDate: new Date('2023-05-12'),
                status: 'accepted',
                resumeUrl: '#',
                coverLetterUrl: '#',
            },
        ];
    };

    // Calculate counters
    const pendingApplicationsCount = applications.filter(app => app.status === 'pending').length;    // Status change handler
    const handleApplicationStatusChange = (applicationId: string, status: Application['status']) => {
        const application = applications.find(app => app.id === applicationId);
        
        if (!application) {
            console.error(`Application with ID ${applicationId} not found`);
            return;
        }
        
        // Update applications
        const updatedApplications = applications.map(app => 
            app.id === applicationId ? {...app, status} : app
        );
        setApplications(updatedApplications);
        
        // Save updated applications to localStorage
        localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(updatedApplications));
        
        // Add to interns list when finalized
        if (status === 'finalized') {
            // Retrieve existing interns from localStorage or initialize an empty array
            const storedInterns = localStorage.getItem(STORAGE_KEYS.INTERNS);
            let interns: Intern[] = [];
            
            if (storedInterns) {
                try {
                    interns = JSON.parse(storedInterns);
                } catch (e) {
                    console.error('Error parsing interns from localStorage:', e);
                    interns = [];
                }
            }
            
            // Check if the intern already exists (based on application ID)
            const internExists = interns.some(intern => intern.id === application.id);
            
            if (!internExists) {
                // Create a new intern record from the application
                const newIntern: Intern = {
                    id: application.id,
                    name: application.applicantName,
                    email: application.applicantEmail,
                    university: application.applicantUniversity,
                    major: application.applicantMajor,
                    internshipTitle: application.internshipTitle,
                    startDate: new Date(),
                    endDate: null,
                    status: 'current'
                };
                
                // Add the new intern to the array
                interns.push(newIntern);
                
                // Save updated interns list to localStorage
                localStorage.setItem(STORAGE_KEYS.INTERNS, JSON.stringify(interns));
            }
        }
          
        // Show notification based on status
        if (application) {
            let message = '';
            let type: 'success' | 'error' | 'warning' | 'info' = 'info';
            
            if (status === 'accepted') {
                message = `Application from ${application.applicantName} has been accepted.`;
                type = 'success';
            } else if (status === 'finalized') {
                message = `Application from ${application.applicantName} has been finalized. Added to Current Interns.`;
                type = 'success';
            } else if (status === 'rejected') {
                message = `Application from ${application.applicantName} has been rejected.`;
                type = 'info';
            } else if (status === 'pending') {
                message = `Application from ${application.applicantName} has been marked as pending.`;
                type = 'info';
            } else {
                message = `Application status updated to ${status}.`;
            }
            
            // Use setTimeout for notification and add to bell icon
            setTimeout(() => {
                // Show temporary toast notification
                showNotification({
                    message,
                    type
                });
                
                // Add persistent notification to bell icon
                addNotification({
                    title: `Application ${status.charAt(0).toUpperCase() + status.slice(1)}`,
                    message,
                    type: 'application'
                });
            }, 800); // Simulate network delay
        }
    };

    // Function to create application notification and send email
    const createApplicationNotification = (internshipTitle: string, applicantName: string) => {
        // Use setTimeout for notifications
        setTimeout(() => {
            // Add persistent notification to bell icon
            addNotification({
                title: "New Application",
                message: `New application received from ${applicantName} for "${internshipTitle}"`,
                type: 'application',
                emailSent: false
            });
                
            // Show temporary toast notification
            showNotification({
                message: `New application received from ${applicantName} for "${internshipTitle}"`,
                type: 'info'
            });
                
            // Play notification sound
            const audio = new Audio('/sounds/notification.mp3');
            audio.play().catch(error => console.error('Error playing sound:', error));
        }, 800); // Simulate network delay
            
        // Simulate sending email (in a real application, this would call an API endpoint)
        setTimeout(() => {
            console.log(`Email sent: New application received for ${internshipTitle}`);
            // Email sent notification would be handled by the backend in a real application
        }, 1000);
    };

    // Filtering logic
    const filteredApplications = applications.filter(app => {
        // Search term filter
        const matchesSearch = app.applicantName.toLowerCase().includes(applicationSearchTerm.toLowerCase()) || 
                            app.internshipTitle.toLowerCase().includes(applicationSearchTerm.toLowerCase());
        
        // Status filter
        const matchesStatusFilter = activeStatusFilter === 'all' || 
                                activeStatusFilter === app.status;
        
        // Post filter
        let matchesPostFilter = true;
        if (activePostFilter !== 'All') {
            // Find the corresponding post ID for this title
            const selectedPostByTitle = internshipPosts.find(post => 
                post.title === activePostFilter
            );
            
            // Only include applications for this post
            matchesPostFilter = selectedPostByTitle ? 
                            app.internshipPostId === selectedPostByTitle.id : 
                            true;
        }
        
        // Apply all filters (search, status, and post)
        return matchesSearch && matchesStatusFilter && matchesPostFilter;
    });

    // Prepare filters for sidebar
    const applicationFilters = [
        {
            title: "Status",
            options: ["All", "Pending", "Accepted", "Rejected"],
            type: "status",
            value: applicationFilter === 'all' ? 'All' : applicationFilter.charAt(0).toUpperCase() + applicationFilter.slice(1)
        },
        {
            title: "Internship Post",
            options: ["All", ...internshipPosts.map(post => post.title)],
            type: "post",
            value: selectedPost ? selectedPost.title : "All"
        }
    ];    // Notification handling - simulate random applications for demo purposes
    useEffect(() => {
        if (internshipPosts.length === 0) return;
        
        // For demo purposes, simulate a new application every 30 seconds
        const interval = setInterval(() => {
            // Choose a random internship post
            const randomPost = internshipPosts[Math.floor(Math.random() * internshipPosts.length)];
            // Simulate an application
            const newApplication: Application = {
                id: `app-${Date.now()}`,
                internshipPostId: randomPost.id,
                internshipTitle: randomPost.title,
                applicantName: `Applicant ${Math.floor(Math.random() * 1000)}`,
                applicantEmail: `applicant${Math.floor(Math.random() * 1000)}@guc.edu`,
                applicantUniversity: 'GUC',
                applicantMajor: 'Computer Science',
                applicationDate: new Date(),
                status: 'pending',
                resumeUrl: '#',
                coverLetterUrl: '#',
            };
            
            // Add the new application to the state
            const updatedApplications = [...applications, newApplication];
            setApplications(updatedApplications);
            
            // Save to localStorage
            localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(updatedApplications));
            
            // Update application count for the post
            const updatedPosts = internshipPosts.map(p => 
                p.id === randomPost.id 
                    ? {...p, applicationsCount: p.applicationsCount + 1} 
                    : p
            );
            
            // Update state and save to localStorage
            setInternshipPosts(updatedPosts);
            localStorage.setItem(STORAGE_KEYS.INTERNSHIP_POSTS, JSON.stringify(updatedPosts));
            
            // Create a notification
            createApplicationNotification(randomPost.title, newApplication.applicantName);
        }, 60000); // A longer interval to avoid too many notifications during development
        
        return () => clearInterval(interval);
    }, [internshipPosts, applications]);return (
        <div className={styles.pageContainer}>
            <CompanyNavigationMenu />
            
            <div className={styles.contentWrapper}>
                <FilterSidebar 
                    filters={applicationFilters}
                    onFilterChange={(type: string, value: string) => {
                        if (type === "status") {
                            // Update both filter states for status
                            setActiveStatusFilter(value.toLowerCase());
                            setApplicationFilter(value.toLowerCase());
                        } else if (type === "post") {
                            // Update the visible selection
                            setActivePostFilter(value);
                            
                            if (value === "All") {
                                setApplicationFilter("all");
                                setSelectedPost(null);
                            } else {
                                // Find the post by title and set it as selected
                                const post = internshipPosts.find(p => p.title === value);
                                if (post) {
                                    setSelectedPost(post);
                                    setApplicationFilter(value); // Store the title as filter value
                                }
                            }
                        }
                    }}
                    onClearFilters={handleClearFilters}
                />
                  <main className={styles.mainContent}>
                    {/* Search Bar */}
                    <SearchBar
                        searchTerm={applicationSearchTerm}
                        setSearchTerm={setApplicationSearchTerm}
                        placeholder="Search by applicant name or internship title..."
                    />
                    
                    <div className={styles.applicationListings}>
                        <div className={styles.listingHeader}>
                            <h1 className={styles.listingTitle}>Applications</h1>
                            <span className={styles.applicationCount}>
                                {pendingApplicationsCount} pending applications
                            </span>
                        </div>
                        {filteredApplications.length > 0 ? (
                            <ApplicationsList 
                                applications={filteredApplications}
                                onStatusChange={handleApplicationStatusChange}
                                onViewDetails={(app) => setSelectedApplication(app)}
                            />
                        ) : (
                            <div className={styles.noResults}>
                                <div className={styles.noResultsIcon}></div>
                                <p>No applications found matching your criteria.</p>
                                {(applicationSearchTerm || applicationFilter !== 'all' || activeStatusFilter !== 'all' || activePostFilter !== 'All') && (
                                    <button 
                                        className={styles.shareProfileButton}
                                        onClick={handleClearFilters}
                                        style={{ marginTop: '20px' }}
                                    >
                                        Clear All Filters
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </div>
            
            {/* Modals */}
            {selectedApplication && (
                <ApplicationDetailsModal 
                    application={selectedApplication}
                    onClose={() => setSelectedApplication(null)}
                />
            )}
        </div>
    );
};

// Main component export
export default function ApplicationsDashboard() {
    return <ApplicationsPage />;
}