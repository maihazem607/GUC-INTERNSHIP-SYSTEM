"use client";
import { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from './page.module.css';

// Import global components
import Navigation from "../../src/components/global/Navigation";
import NotificationSystem, { useNotification } from "../../src/components/global/NotificationSystem";
import NotificationsPanel from "../../src/components/global/NotificationsPanel";
import FilterSidebar from "../../src/components/global/FilterSidebar";
import SearchBar from "../../src/components/global/SearchBar";
import Modal from "../../src/components/global/Modal";
import DashboardTab from "../../src/components/global/DashboardTab";

// Import components
import ApplicationsList from "../../src/components/Companyy/ApplicationsList";
import InternsList from "../../src/components/Companyy/InternsList";
import ApplicationDetailsModal from "../../src/components/Companyy/ApplicationDetailsModal";
import InternshipPostModal from "../../src/components/Companyy/InternshipPostModal";
import InternshipCard from "../../src/components/internships/InternshipCard";
import InternshipDetailsModal from "../../src/components/internships/InternshipDetailsModal";
import CompanyInternshipDetailsModal from "../../src/components/Companyy/CompanyInternshipDetailsModal";

// Import types
import { 
  InternshipPost,
  Application, 
  Intern, 
  Evaluation, 
  Notification 
} from "../../src/components/Companyy/types";
import { Internship } from "../../src/components/internships/types";

// Dashboard tabs type
type DashboardTab = 'internships' | 'applications' | 'interns';

// Helper function to convert InternshipPost to Internship format
const convertToInternshipFormat = (post: InternshipPost): Internship => {
  return {
    id: parseInt(post.id),
    company: "Your Company",
    title: post.title,
    description: post.description,
    duration: post.duration,
    date: post.postedDate.toLocaleDateString(),
    location: "Company Location",
    industry: post.department,
    isPaid: post.isPaid,
    salary: post.isPaid && post.expectedSalary ? `$${post.expectedSalary}` : "Unpaid",
    logo: "/logos/google.png", // Default logo
    skills: post.skillsRequired,
    applicationsCount: post.applicationsCount,
  };
};

export default function InternshipDashboard() {
    // State for navigation and content
    const [activeTab, setActiveTab] = useState<DashboardTab>('internships');
    
    // Search states for different tabs
    const [internshipSearchTerm, setInternshipSearchTerm] = useState('');
    const [applicationSearchTerm, setApplicationSearchTerm] = useState('');
    const [internSearchTerm, setInternSearchTerm] = useState('');    // Filter states
    const [internshipFilter, setInternshipFilter] = useState('all');
    const [applicationFilter, setApplicationFilter] = useState('all');
    const [internFilter, setInternFilter] = useState('all');
    
    // Track active filters separately for status and post
    const [activeStatusFilter, setActiveStatusFilter] = useState<string>('all');
    const [activePostFilter, setActivePostFilter] = useState<string>('All');
    
    // Data states
    const [internshipPosts, setInternshipPosts] = useState<InternshipPost[]>([]);
    const [applications, setApplications] = useState<Application[]>([]);
    const [interns, setInterns] = useState<Intern[]>([]);
    
    // Selection states
    const [selectedPost, setSelectedPost] = useState<InternshipPost | null>(null);
    const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
    const [selectedIntern, setSelectedIntern] = useState<Intern | null>(null);
    const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
    
    // Modal states
    const [showEvaluationForm, setShowEvaluationForm] = useState(false);
    const [showPostForm, setShowPostForm] = useState(false);
    const [showInternshipDetails, setShowInternshipDetails] = useState(false);
    const [showNotificationsPanel, setShowNotificationsPanel] = useState(false);
    
    // Star tracking
    const [starredInternships, setStarredInternships] = useState<number[]>([]);
    
    // Form states
    const [newEvaluation, setNewEvaluation] = useState<Omit<Evaluation, 'id' | 'evaluationDate'>>({
        internId: '',
        performanceRating: 0,
        skillsRating: 0,
        attitudeRating: 0,
        comments: '',
    });
    const [newPost, setNewPost] = useState<Omit<InternshipPost, 'id' | 'postedDate' | 'applicationsCount'>>({
        title: '',
        description: '',
        department: '',
        deadline: new Date(),
        duration: '',
        isPaid: false,
        expectedSalary: undefined,
        skillsRequired: [],
    });
    
    // Notification states
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const { notification, visible, showNotification, hideNotification } = useNotification();

    // Mock data initialization
    useEffect(() => {
        const mockPosts: InternshipPost[] = [
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

        const mockApplications: Application[] = [
            {
                id: '1',
                internshipPostId: '1',
                internshipTitle: 'Frontend Developer Intern',
                applicantName: 'John Doe',
                applicantEmail: 'john@university.edu',
                applicantUniversity: 'SCAD',
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
                applicantUniversity: 'SCAD',
                applicantMajor: 'Interactive Design',
                applicationDate: new Date('2023-05-12'),
                status: 'accepted',
                resumeUrl: '#',
                coverLetterUrl: '#',
            },
        ];

        const mockInterns: Intern[] = [
            {
                id: '2',
                name: 'Jane Smith',
                email: 'jane@university.edu',
                university: 'SCAD',
                major: 'Interactive Design',
                internshipTitle: 'Frontend Developer Intern',
                startDate: new Date('2023-06-01'),
                endDate: new Date('2023-08-31'),
                status: 'current',
            },
             {
                id: '3',
                name: 'Grace Morgen',
                email: 'grace@university.edu',
                university: 'SCAD',
                major: 'Computer Science',
                internshipTitle: 'Backend Developer Intern',
                startDate: new Date('2025-06-01'),
                endDate: new Date('2026-08-31'),
                status: 'current',
            },
        ];

        setInternshipPosts(mockPosts);
        setApplications(mockApplications);
        setInterns(mockInterns);
    }, []);    
    
    // Handle InternshipCard actions
    const handleStarInternship = (id: number) => {
        setStarredInternships(prev => 
            prev.includes(id) ? prev.filter(starId => starId !== id) : [...prev, id]
        );
    };

    const handleViewInternshipDetails = (post: InternshipPost, internship: Internship) => {
        setSelectedPost(post);
        setSelectedInternship(internship);
        setShowInternshipDetails(true);
    };
    
    const handleCloseInternshipDetails = () => {
        setShowInternshipDetails(false);
        setSelectedInternship(null);
        setSelectedPost(null);
    };

    // Filtering logic
    const filteredInternshipPosts = internshipPosts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(internshipSearchTerm.toLowerCase()) || 
                            post.description.toLowerCase().includes(internshipSearchTerm.toLowerCase());
        const matchesFilter = internshipFilter === 'all' || post.department.toLowerCase() === internshipFilter.toLowerCase();
        return matchesSearch && matchesFilter;
    });    const filteredApplications = applications.filter(app => {
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

    const filteredInterns = interns.filter(intern => {
        const matchesSearch = intern.name.toLowerCase().includes(internSearchTerm.toLowerCase()) || 
                            intern.internshipTitle.toLowerCase().includes(internSearchTerm.toLowerCase());
        const matchesFilter = internFilter === 'all' || intern.status === internFilter;
        return matchesSearch && matchesFilter;
    });
    
    const unreadNotificationsCount = notifications.filter(n => !n.read).length;
    
    // Calculate counters
    const pendingApplicationsCount = applications.filter(app => app.status === 'pending').length;
    const currentInternsCount = interns.filter(intern => intern.status === 'current').length;
    const internshipPostsCount = internshipPosts.length;    // CRUD for Internship Posts
    const handleCreateOrUpdatePost = () => {
        console.log('handleCreateOrUpdatePost called');
        console.log('Current form data:', newPost);
        
        // Check if required fields are filled
        if (!newPost.title || !newPost.description || !newPost.duration) {
            console.error("Cannot create/update post: missing required fields");
            showNotification({
                message: "Please fill in all required fields (Title, Description, Duration)",
                type: 'error'
            });
            return;
        }
        
        if (selectedPost) {
            // Update existing post
            setInternshipPosts(internshipPosts.map(post => 
                post.id === selectedPost.id ? { ...post, ...newPost, postedDate: new Date(), applicationsCount: post.applicationsCount } : post
            ));
            setSelectedPost(null);
            
            // Show success notification
            showNotification({
                message: `Internship post "${newPost.title}" has been updated successfully.`,
                type: 'success'
            });
        } else {
            // Create new post with a unique ID
            const post: InternshipPost = {
                id: `post-${Date.now()}`, // Ensure unique ID
                ...newPost,
                postedDate: new Date(),
                applicationsCount: 0,
            };
            
            console.log("Creating new internship post:", post);
            
            // Add the new post to the list
            setInternshipPosts(prev => {
                const updated = [...prev, post];
                console.log("Updated internships list:", updated);
                return updated;
            });
            
            // Show success notification
            showNotification({
                message: `New internship post "${post.title}" has been created successfully.`,
                type: 'success'
            });
        }
        
        // Close the form and reset data
        setShowPostForm(false);        setNewPost({
            title: '',
            description: '',
            department: 'Technology',
            deadline: new Date(),
            duration: '', // Empty string to show "Select duration" option
            isPaid: false,
            expectedSalary: undefined,
            skillsRequired: [],
        });
    };

    const handleDeletePost = (postId: string) => {
        const post = internshipPosts.find(post => post.id === postId);
        setInternshipPosts(internshipPosts.filter(post => post.id !== postId));
        
        // Show info notification
        if (post) {
            showNotification({
                message: `Internship post "${post.title}" has been deleted.`,
                type: 'info'
            });
        }
    };    // Status change handlers
    const handleApplicationStatusChange = (applicationId: string, status: Application['status']) => {
        const application = applications.find(app => app.id === applicationId);
        setApplications(applications.map(app => 
            app.id === applicationId ? {...app, status} : app
        ));
        
        // Add to interns list when finalized
        if (application && status === 'finalized') {
            // Create a new intern object from the application data
            const newIntern: Intern = {
                id: application.id,
                name: application.applicantName,
                email: application.applicantEmail,
                university: application.applicantUniversity,
                major: application.applicantMajor,
                internshipTitle: application.internshipTitle,
                startDate: new Date(), // Start date is today
                endDate: null, // End date will be set when completed
                status: 'current' // New interns start with 'current' status
            };
            
            // Check if intern already exists
            const internExists = interns.some(intern => intern.id === newIntern.id);
            if (!internExists) {
                setInterns(prevInterns => [...prevInterns, newIntern]);
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
            
            showNotification({
                message,
                type
            });
        }
    };

    const handleInternStatusChange = (internId: string, status: Intern['status'], endDate?: Date) => {
        const intern = interns.find(intern => intern.id === internId);
        setInterns(interns.map(intern => 
            intern.id === internId 
                ? {...intern, status, endDate: status === 'completed' ? endDate || new Date() : null}
                : intern
        ));
        
        // Show notification based on status
        if (intern) {
            let message = '';
            let type: 'success' | 'error' | 'warning' | 'info' = 'info';
            
            if (status === 'current') {
                message = `${intern.name} is now marked as a current intern.`;
                type = 'success';
            } else if (status === 'completed') {
                message = `${intern.name}'s internship has been marked as completed.`;
                type = 'success';
            }
            
            showNotification({
                message,
                type
            });
        }
    };

    const handleSubmitEvaluation = () => {
        if (!selectedIntern) return;
        
        const evaluation: Evaluation = {
            id: Date.now().toString(),
            evaluationDate: new Date(),
            ...newEvaluation,
        };
        
        setInterns(interns.map(intern => 
            intern.id === selectedIntern.id 
                ? {...intern, evaluation} 
                : intern
        ));
        
        setShowEvaluationForm(false);
        setNewEvaluation({
            internId: '',
            performanceRating: 0,
            skillsRating: 0,
            attitudeRating: 0,
            comments: '',
        });
        
        // Show success notification
        showNotification({
            message: `Evaluation for ${selectedIntern.name} has been submitted successfully.`,
            type: 'success'
        });
    };    // Notification handling - simulate random applications for demo purposes
    useEffect(() => {
        if (internshipPosts.length === 0) return;
        
        // For demo purposes, simulate a new application every 30 seconds
        const interval = setInterval(() => {
            // Choose a random internship post
            const randomPost = internshipPosts[Math.floor(Math.random() * internshipPosts.length)];
            // Simulate an application
            handleNewApplication(randomPost.id);
        }, 30000);
        
        return () => clearInterval(interval);
    }, [internshipPosts]);
    
    // Prepare filters for sidebars
    const internshipFilters = [
        {
            title: "Department",
            options: ["All", "Engineering", "Marketing", "Design", "Business", "HR","Technology"],
            type: "department",
            value: internshipFilter
        }    ];
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
    ];

    const internFilters = [
        {
            title: "Status",
            options: ["All", "Current", "Completed"],
            type: "status",
            value: internFilter
        }
    ];
    
    // Get current search term and setter based on active tab
    const getSearchProps = () => {
        switch (activeTab) {
            case 'internships':
                return {
                    searchTerm: internshipSearchTerm,
                    setSearchTerm: setInternshipSearchTerm,
                    placeholder: "Search internship posts..."
                };
            case 'applications':
                return {
                    searchTerm: applicationSearchTerm,
                    setSearchTerm: setApplicationSearchTerm,
                    placeholder: "Search applications..."
                };
            case 'interns':
                return {
                    searchTerm: internSearchTerm,
                    setSearchTerm: setInternSearchTerm,
                    placeholder: "Search interns..."
                };
            default:
                return {
                    searchTerm: '',
                    setSearchTerm: () => {},
                    placeholder: "Search..."
                };
        }
    };
    
    // Get current filters based on active tab
    const getCurrentFilters = () => {
        switch (activeTab) {
            case 'internships':
                return {
                    filters: internshipFilters,
                    onFilterChange: (type: string, value: string) => setInternshipFilter(value.toLowerCase())
                };            case 'applications':
                return {
                    filters: applicationFilters,
                    onFilterChange: (type: string, value: string) => {
                        if (type === "status") {
                            setActiveStatusFilter(value.toLowerCase());
                            setApplicationFilter(value.toLowerCase());
                        } else if (type === "post") {
                            setActivePostFilter(value); // Update the visible selection
                            
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
                    }
                };
            case 'interns':
                return {
                    filters: internFilters,
                    onFilterChange: (type: string, value: string) => setInternFilter(value.toLowerCase())
                };
            default:
                return {
                    filters: [],
                    onFilterChange: () => {}
                };
        }
    };

    // Custom Evaluation Modal using generic Modal component
    const renderEvaluationModal = () => {
        if (!showEvaluationForm || !selectedIntern) return null;
        
        return (
            <Modal 
                title={`Evaluate ${selectedIntern.name}`}
                onClose={() => setShowEvaluationForm(false)}
                width="600px"
                actions={
                    <div className={styles.modalActions}>
                        <button 
                            className={styles.actionButton} 
                            onClick={handleSubmitEvaluation}
                        >
                            Submit Evaluation
                        </button>
                        <button 
                            className={styles.actionButtonOutline}
                            onClick={() => setShowEvaluationForm(false)}
                        >
                            Cancel
                        </button>
                    </div>
                }
            >
                <div className={styles.evaluationForm}>
                    <div className={styles.formGroup}>
                        <label>Performance Rating (1-5)</label>
                        <input
                            type="range"
                            min="1"
                            max="5"
                            value={newEvaluation.performanceRating}
                            onChange={(e) => setNewEvaluation({
                                ...newEvaluation,
                                performanceRating: parseInt(e.target.value)
                            })}
                        />
                        <span>{newEvaluation.performanceRating}/5</span>
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label>Skills Rating (1-5)</label>
                        <input
                            type="range"
                            min="1"
                            max="5"
                            value={newEvaluation.skillsRating}
                            onChange={(e) => setNewEvaluation({
                                ...newEvaluation,
                                skillsRating: parseInt(e.target.value)
                            })}
                        />
                        <span>{newEvaluation.skillsRating}/5</span>
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label>Attitude Rating (1-5)</label>
                        <input
                            type="range"
                            min="1"
                            max="5"
                            value={newEvaluation.attitudeRating}
                            onChange={(e) => setNewEvaluation({
                                ...newEvaluation,
                                attitudeRating: parseInt(e.target.value)
                            })}
                        />
                        <span>{newEvaluation.attitudeRating}/5</span>
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label>Comments</label>
                        <textarea
                            value={newEvaluation.comments}
                            onChange={(e) => setNewEvaluation({
                                ...newEvaluation,
                                comments: e.target.value
                            })}
                            rows={5}
                            placeholder="Provide detailed feedback about the intern's performance..."
                        />
                    </div>
                </div>
            </Modal>
        );
    };    // Notification handling functions
    const markNotificationAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => 
            n.id === id ? {...n, read: true} : n
        ));
    };

    const markAllNotificationsAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    // Function to handle new application submission (simulation)
    const handleNewApplication = (postId: string) => {
        // Find the internship post
        const post = internshipPosts.find(p => p.id === postId);
        if (!post) return;
        
        // Create new application
        const newApplication: Application = {
            id: `app-${Date.now()}`,
            internshipPostId: postId,
            internshipTitle: post.title,
            applicantName: `Applicant ${Math.floor(Math.random() * 1000)}`,
            applicantEmail: `applicant${Math.floor(Math.random() * 1000)}@university.edu`,
            applicantUniversity: 'SCAD',
            applicantMajor: 'Computer Science',
            applicationDate: new Date(),
            status: 'pending',
            resumeUrl: '#',
            coverLetterUrl: '#',
        };
        
        // Update applications list
        setApplications(prev => [...prev, newApplication]);
        
        // Update application count for the post
        setInternshipPosts(internshipPosts.map(p => 
            p.id === postId 
                ? {...p, applicationsCount: p.applicationsCount + 1} 
                : p
        ));
        
        // Create a notification
        createApplicationNotification(post.title, newApplication.applicantName);
    };
    
    // Function to create application notification and send email
    const createApplicationNotification = (internshipTitle: string, applicantName: string) => {
        // Create notification
        const newNotification: Notification = {
            id: Date.now().toString(),
            message: `New application received from ${applicantName} for "${internshipTitle}"`,
            type: 'application',
            timestamp: new Date(),
            read: false,
            emailSent: false
        };
        
        // Add to notifications list
        setNotifications(prev => [newNotification, ...prev]);
        
        // Show toast notification
        showNotification({
            message: `New application received from ${applicantName} for "${internshipTitle}"`,
            type: 'info'
        });
        
        // Play notification sound
        const audio = new Audio('/sounds/notification.mp3');
        audio.play().catch(error => console.error('Error playing sound:', error));
        
        // Simulate sending email (in a real application, this would call an API endpoint)
        setTimeout(() => {
            console.log(`Email sent: New application received for ${internshipTitle}`);
            // Update notification to reflect email sent
            setNotifications(prev => prev.map(n => 
                n.id === newNotification.id 
                    ? {...n, emailSent: true} 
                    : n
            ));
        }, 1000);
    };    // Using the markNotificationAsRead function defined earlier

    return (
        <div className={styles.pageContainer}>
            <Head>
                <title>Company Dashboard - Internship Management System</title>
            </Head>            {/* Header/Navigation */}
            <Navigation 
                title="Company Internship Dashboard"
                notificationCount={unreadNotificationsCount}
                onNotificationClick={() => setShowNotificationsPanel(!showNotificationsPanel)}
            />
              {/* Tab Navigation */}
            <DashboardTab
                tabs={[
                    { 
                        id: 'internships', 
                        label: 'Internship Posts', 
                        count: internshipPostsCount 
                    },
                    { 
                        id: 'applications', 
                        label: 'Applications', 
                        count: pendingApplicationsCount 
                    },
                    { 
                        id: 'interns', 
                        label: 'Current Interns', 
                        count: currentInternsCount 
                    }
                ]}
                activeTab={activeTab}
                onTabChange={(tabId) => setActiveTab(tabId as DashboardTab)}
            />

            <div className={styles.contentWrapper}>
                {/* Left Sidebar with Filters */}
                <FilterSidebar 
                    filters={getCurrentFilters().filters}
                    onFilterChange={getCurrentFilters().onFilterChange}
                />

                {/* Main Content */}
                <div className={styles.mainContent}>
                    {/* INTERNSHIPS TAB */}
                    {activeTab === 'internships' && (
                        <div className={styles.internshipListings}>                            <div className={styles.listingHeader}>
                                <h1 className={styles.listingTitle}>Internship Postings</h1>
                                <div className={styles.headerActions}>
                                    <span className={styles.itemCount}>
                                        {filteredInternshipPosts.length} Posting{filteredInternshipPosts.length !== 1 ? 's' : ''}
                                    </span>                                    <button 
                                        className={`${styles.actionButton} ${styles.createButton}`}
                                        onClick={() => {
                                            console.log("Create New Internship button clicked");                                            // Reset form data to ensure we're creating a new post
                                            setNewPost({
                                                title: '',
                                                description: '',
                                                department: '',
                                                deadline: new Date(),
                                                duration: '', // Empty string to show "Select duration" as default
                                                isPaid: false,
                                                expectedSalary: undefined,
                                                skillsRequired: [],
                                            });
                                            setSelectedPost(null);
                                            setShowPostForm(true);
                                            console.log("showPostForm set to", true);
                                            setTimeout(() => console.log("Form visible state after timeout:", showPostForm), 100);
                                        }}
                                    >
                                        + Create New Internship
                                    </button>
                                </div>
                            </div>
                            <div className={styles.filterControls}>
                                <SearchBar
                                    searchTerm={getSearchProps().searchTerm}
                                    setSearchTerm={getSearchProps().setSearchTerm}
                                    placeholder={getSearchProps().placeholder}
                                />
                            </div>                            {filteredInternshipPosts.length > 0 ? (
                                <div className={styles.cards}>
                                    {filteredInternshipPosts.map(post => {
                                        const internship = convertToInternshipFormat(post);
                                        return (
                                            <div key={internship.id} className={styles.cardWrapper}>
                                                <InternshipCard
                                                    internship={internship}
                                                    isStarred={starredInternships.includes(internship.id)}
                                                    onToggleStar={() => handleStarInternship(internship.id)}
                                                    onViewDetails={() => handleViewInternshipDetails(post, internship)}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className={styles.noResults}>
                                    <div className={styles.noResultsIcon}>📋</div>
                                    <p>No internship postings found matching your criteria.</p>
                                </div>
                            )}
                        </div>
                    )}
                    
                    {/* APPLICATIONS TAB */}
                    {activeTab === 'applications' && (
                        <div className={styles.applicationListings}>
                            <div className={styles.listingHeader}>
                                <h1 className={styles.listingTitle}>Applications</h1>
                                <span className={styles.applicationCount}>
                                    {pendingApplicationsCount} pending applications
                                </span>
                            </div>
                            <div className={styles.filterControls}>
                                <SearchBar
                                    searchTerm={getSearchProps().searchTerm}
                                    setSearchTerm={getSearchProps().setSearchTerm}
                                    placeholder={getSearchProps().placeholder}
                                />
                            </div>
                            {filteredApplications.length > 0 ? (
                                <ApplicationsList 
                                    applications={filteredApplications}
                                    onStatusChange={handleApplicationStatusChange}
                                    onViewDetails={(app) => setSelectedApplication(app)}
                                />
                            ) : (
                                <div className={styles.noResults}>
                                    <div className={styles.noResultsIcon}>📝</div>
                                    <p>No applications found matching your criteria.</p>
                                </div>
                            )}
                        </div>
                    )}
                    
                    {/* INTERNS TAB */}
                    {activeTab === 'interns' && (
                        <div className={styles.internListings}>
                            <div className={styles.listingHeader}>
                                <h1 className={styles.listingTitle}>Current Interns</h1>
                                <span className={styles.internCount}>
                                    {currentInternsCount} active interns
                                </span>
                            </div>
                            <div className={styles.filterControls}>
                                <SearchBar
                                    searchTerm={getSearchProps().searchTerm}
                                    setSearchTerm={getSearchProps().setSearchTerm}
                                    placeholder={getSearchProps().placeholder}
                                />
                            </div>
                            {filteredInterns.length > 0 ? (
                               // <div className={styles.cards}>  
                               <InternsList 
                                        interns={filteredInterns}
                                        onStatusChange={handleInternStatusChange}
                                        onEvaluate={(intern: any) => {
                                            setSelectedIntern(intern);
                                            setNewEvaluation({
                                                internId: intern.id,
                                                performanceRating: intern.evaluation?.performanceRating ?? 3,
                                                skillsRating: intern.evaluation?.skillsRating ?? 3,
                                                attitudeRating: intern.evaluation?.attitudeRating ?? 3,
                                                comments: intern.evaluation?.comments ?? '',
                                            });
                                            setShowEvaluationForm(true);
                                        }}
                                    />
                               // </div>
                            ) : (
                                <div className={styles.noResults}>
                                    <div className={styles.noResultsIcon}>👨‍💼</div>
                                    <p>No interns found matching your criteria.</p>
                                </div>
                            )}
                        </div>                    
                    )}
                </div>
            </div>
            
            {/* Modals */}
            {selectedApplication && (
                <ApplicationDetailsModal 
                    application={selectedApplication}
                    onClose={() => setSelectedApplication(null)}
                />
            )}            
            
            {/* Render custom evaluation modal */}
            {renderEvaluationModal()}
              {showPostForm && (                <InternshipPostModal
                    post={newPost}
                    isEditing={!!selectedPost}
                    onClose={() => { 
                        console.log("Modal closed");
                        setShowPostForm(false); 
                        setSelectedPost(null); 
                    }}
                    onSubmit={() => {
                        console.log("Modal submit button clicked");
                        handleCreateOrUpdatePost();
                    }}
                    onChange={(post) => {
                        console.log("Form data changed:", post);
                        setNewPost(post);
                        // Debug validation status after each change
                        const isValid = post.title && post.description && post.duration;
                        console.log(`Form validation status: ${isValid ? 'VALID' : 'INVALID'}`);
                    }}
                />
            )}            {/* InternshipDetailsModal with edit and delete buttons */}
            {showInternshipDetails && selectedInternship && selectedPost && (
                <CompanyInternshipDetailsModal
                    internship={selectedInternship}
                    onClose={handleCloseInternshipDetails}
                    onEdit={() => {
                        setShowInternshipDetails(false);
                        setNewPost(selectedPost);
                        setShowPostForm(true);
                    }}
                    onDelete={() => {
                        handleDeletePost(selectedPost.id);
                        handleCloseInternshipDetails();
                    }}
                />
            )}
            
            {/* Global notification system */}
            {notification && (
                <NotificationSystem
                    message={notification.message}
                    type={notification.type}
                    visible={visible}
                    onClose={hideNotification}
                />
            )}            {/* Notifications panel - show when state is true */}
            {showNotificationsPanel && (
                <NotificationsPanel
                    notifications={notifications}
                    onClose={() => setShowNotificationsPanel(false)}
                    onMarkAsRead={(id) => {
                        setNotifications(prev => prev.map(n => 
                            n.id === id ? {...n, read: true} : n
                        ));
                    }}
                    onMarkAllAsRead={() => {
                        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                    }}
                />
            )}
        </div>
    );
}