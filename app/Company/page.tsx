"use client";
import { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from './page.module.css';

// Import global components
import Navigation from "../../src/components/global/Navigation";
import NotificationSystem, { useNotification } from "../../src/components/global/NotificationSystem";
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
  };
};

export default function InternshipDashboard() {
    // State for navigation and content
    const [activeTab, setActiveTab] = useState<DashboardTab>('internships');
    
    // Search states for different tabs
    const [internshipSearchTerm, setInternshipSearchTerm] = useState('');
    const [applicationSearchTerm, setApplicationSearchTerm] = useState('');
    const [internSearchTerm, setInternSearchTerm] = useState('');
    
    // Filter states
    const [internshipFilter, setInternshipFilter] = useState('all');
    const [applicationFilter, setApplicationFilter] = useState('all');
    const [internFilter, setInternFilter] = useState('all');
    
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
        department: 'Engineering',
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
    });

    const filteredApplications = applications.filter(app => {
        const matchesSearch = app.applicantName.toLowerCase().includes(applicationSearchTerm.toLowerCase()) || 
                            app.internshipTitle.toLowerCase().includes(applicationSearchTerm.toLowerCase());
        const matchesFilter = applicationFilter === 'all' || 
                            (applicationFilter === 'post' && selectedPost ? app.internshipPostId === selectedPost.id : true) ||
                            app.status === applicationFilter;
        return matchesSearch && matchesFilter;
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
    const internshipPostsCount = internshipPosts.length;

    // CRUD for Internship Posts
    const handleCreateOrUpdatePost = () => {
        if (selectedPost) {
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
            const post: InternshipPost = {
                id: Date.now().toString(),
                ...newPost,
                postedDate: new Date(),
                applicationsCount: 0,
            };
            setInternshipPosts([...internshipPosts, post]);
            
            // Show success notification
            showNotification({
                message: `New internship post "${post.title}" has been created successfully.`,
                type: 'success'
            });
        }
        setShowPostForm(false);
        setNewPost({
            title: '',
            description: '',
            department: 'engineering',
            deadline: new Date(),
            duration: '',
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
    };

    // Status change handlers
    const handleApplicationStatusChange = (applicationId: string, status: Application['status']) => {
        const application = applications.find(app => app.id === applicationId);
        setApplications(applications.map(app => 
            app.id === applicationId ? {...app, status} : app
        ));
        
        // Show notification based on status
        if (application) {
            let message = '';
            let type: 'success' | 'error' | 'warning' | 'info' = 'info';
            
            if (status === 'accepted') {
                message = `Application from ${application.applicantName} has been accepted.`;
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
    };

    // Notification handling
    useEffect(() => {
        const interval = setInterval(() => {
            const newNotification: Notification = {
                id: Date.now().toString(),
                message: 'New application received for ' + 
                        internshipPosts[Math.floor(Math.random() * internshipPosts.length)].title,
                type: 'application',
                timestamp: new Date(),
                read: false,
                emailSent: true
            };
            setNotifications(prev => [newNotification, ...prev]);
        }, 30000);
        return () => clearInterval(interval);
    }, [internshipPosts]);
    
    // Prepare filters for sidebars
    const internshipFilters = [
        {
            title: "Department",
            options: ["All", "Engineering", "Marketing", "Design", "Business"],
            type: "department",
            value: internshipFilter
        }
    ];

    const applicationFilters = [
        {
            title: "Status",
            options: ["All", "Pending", "Accepted", "Rejected"],
            type: "status",
            value: applicationFilter
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
                };
            case 'applications':
                return {
                    filters: applicationFilters,
                    onFilterChange: (type: string, value: string) => setApplicationFilter(value.toLowerCase())
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
    };

    return (
        <div className={styles.pageContainer}>
            <Head>
                <title>Company Dashboard - Internship Management System</title>
            </Head>
            
            {/* Header/Navigation */}
            <Navigation title="Company Internship Dashboard" />
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
                        <div className={styles.internshipListings}>
                            <div className={styles.listingHeader}>
                                <h1 className={styles.listingTitle}>Internship Postings</h1>
                                <div className={styles.headerActions}>
                                    <span className={styles.itemCount}>
                                        {filteredInternshipPosts.length} Posting{filteredInternshipPosts.length !== 1 ? 's' : ''}
                                    </span>
                                    <button 
                                        className={styles.actionButton}
                                        onClick={() => setShowPostForm(true)}
                                    >
                                        + New Posting
                                    </button>
                                </div>
                            </div>
                            <div className={styles.filterControls}>
                                <SearchBar
                                    searchTerm={getSearchProps().searchTerm}
                                    setSearchTerm={getSearchProps().setSearchTerm}
                                    placeholder={getSearchProps().placeholder}
                                />
                            </div>
                            {filteredInternshipPosts.length > 0 ? (
                                <div className={styles.cards}>
                                    {filteredInternshipPosts.map(post => {
                                        const internship = convertToInternshipFormat(post);
                                        return (
                                            <InternshipCard
                                                key={internship.id}
                                                internship={internship}
                                                isStarred={starredInternships.includes(internship.id)}
                                                onToggleStar={() => handleStarInternship(internship.id)}
                                                onViewDetails={() => handleViewInternshipDetails(post, internship)}
                                            />
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
                                <div className={styles.cards}>                                    <InternsList 
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
                                </div>
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
            
            {showPostForm && (
                <InternshipPostModal
                    post={newPost}
                    isEditing={!!selectedPost}
                    onClose={() => { setShowPostForm(false); setSelectedPost(null); }}
                    onSubmit={handleCreateOrUpdatePost}
                    onChange={(post) => setNewPost(post)}
                />
            )}
            
            {/* InternshipDetailsModal with edit and delete buttons */}
            {showInternshipDetails && selectedInternship && selectedPost && (
                <div className={styles.modalBackdrop} onClick={handleCloseInternshipDetails}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <InternshipDetailsModal
                            internship={selectedInternship}
                            onClose={handleCloseInternshipDetails}
                        />
                        <div className={styles.modalCustomActions}>
                            <button 
                                className={styles.actionButton}
                                onClick={() => {
                                    setShowInternshipDetails(false);
                                    setNewPost(selectedPost);
                                    setShowPostForm(true);
                                }}
                            >
                                Edit Internship
                            </button>
                            <button 
                                className={`${styles.actionButtonOutline} ${styles.deleteButton}`}
                                onClick={() => {
                                    handleDeletePost(selectedPost.id);
                                    handleCloseInternshipDetails();
                                }}
                            >
                                Delete Internship
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Global notification system */}
            {notification && (
                <NotificationSystem
                    message={notification.message}
                    type={notification.type}
                    visible={visible}
                    onClose={hideNotification}
                />
            )}
        </div>
    );
}