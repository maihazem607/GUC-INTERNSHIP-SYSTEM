'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import InternshipPostModal from "@/components/Companyy/InternshipPostModal";
import InternshipCard from "@/components/internships/InternshipCard";
import CompanyInternshipDetailsModal from "@/components/Companyy/CompanyInternshipDetailsModal";

// Import types
import { InternshipPost, Notification } from "@/components/Companyy/types";
import { Internship } from "@/components/internships/types";

// Helper function to convert InternshipPost to Internship format
const convertToInternshipFormat = (post: InternshipPost): Internship => {
  // Get company name from localStorage or use a default
  const companyName = typeof window !== 'undefined' 
    ? localStorage.getItem('companyName') || "Company Name" 
    : "Company Name";
    
  return {
    id: parseInt(post.id),
    company: companyName,
    title: post.title,
    description: post.description,
    duration: post.duration,
    date: post.postedDate.toLocaleDateString(),
    location: typeof window !== 'undefined' 
      ? localStorage.getItem('companyLocation') || "Company Location" 
      : "Company Location",
    industry: post.department,
    isPaid: post.isPaid,
    salary: post.isPaid && post.expectedSalary ? `$${post.expectedSalary}` : "Unpaid",
    logo: "/logos/google.png", // Default logo
    skills: post.skillsRequired,
    applicationsCount: post.applicationsCount,
  };
};

// CompanyInternships Page
const CompanyInternshipsPage = () => {
    // Router for navigation
    const router = useRouter();
    
    // Search states for internships
    const [internshipSearchTerm, setInternshipSearchTerm] = useState('');
    
    // Filter states
    const [internshipFilter, setInternshipFilter] = useState('all');
    
    // Data states
    const [internshipPosts, setInternshipPosts] = useState<InternshipPost[]>([]);
    
    // Selection states
    const [selectedPost, setSelectedPost] = useState<InternshipPost | null>(null);
    const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
    
    // Modal states
    const [showPostForm, setShowPostForm] = useState(false);
    const [showInternshipDetails, setShowInternshipDetails] = useState(false);
    
    // Star tracking
    const [starredInternships, setStarredInternships] = useState<number[]>([]);
    
    // Form states
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
    
    // Clear all filters function
    const handleClearFilters = () => {
        setInternshipFilter('all');
        setInternshipSearchTerm('');
    };
    
    // Using the unified notification context
    const { 
        notification,
        visible,
        addNotification,
       // clearNotifications,
       // markNotificationAsRead,
        markAllAsRead,
        showNotification
    } = useNotification();

    // Initialize notifications array to track unread items
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const unreadCount = notifications.filter(n => !n.read).length;

    // Counts for badge numbers
    const internshipPostsCount = internshipPosts.length;
    
    // Initializing mock data
    useEffect(() => {
        // Check if there's data in localStorage
        const storedPosts = localStorage.getItem(STORAGE_KEYS.INTERNSHIP_POSTS);
        
        if (storedPosts) {
            try {
                // Parse and deserialize dates
                const parsedPosts = deserializeDates(JSON.parse(storedPosts));
                setInternshipPosts(parsedPosts);
            } catch (error) {
                console.error('Error loading internship posts from localStorage:', error);
                // Use mock data as fallback
                setInternshipPosts(getDefaultInternshipPosts());
            }
        } else {
            // No data in localStorage, use mock data
            setInternshipPosts(getDefaultInternshipPosts());
        }
    }, []);
    
    // Helper function to get default internship posts data
    const getDefaultInternshipPosts = (): InternshipPost[] => {
        return [
            {
                id: '1',
                title: 'Frontend Developer Intern',
                description: 'Work on our customer-facing web applications using React and TypeScript.',
                department: 'Engineering',
                deadline: new Date('2023-12-31'),
                duration: '3 months',
                isPaid: true,
                expectedSalary: 1200,
                skillsRequired: ['JavaScript', 'React', 'HTML/CSS'],
                postedDate: new Date('2023-05-01'),
                applicationsCount: 12,
            },
            {
                id: '2',
                title: 'UX/UI Design Intern',
                description: 'Help design intuitive user interfaces for our products.',
                department: 'Design',
                deadline: new Date('2023-11-30'),
                duration: '6 months',
                isPaid: true,
                expectedSalary: 1000,
                skillsRequired: ['Figma', 'Adobe XD', 'UI/UX Principles'],
                postedDate: new Date('2023-05-15'),
                applicationsCount: 8,
            },
            {
                id: '3',
                title: 'Data Science Intern',
                description: 'Apply machine learning techniques to our product data.',
                department: 'Technology',
                deadline: new Date('2023-12-15'),
                duration: '4 months',
                isPaid: true,
                expectedSalary: 1500,
                skillsRequired: ['Python', 'Machine Learning', 'Data Analysis'],
                postedDate: new Date('2023-05-10'),
                applicationsCount: 15,
            },
        ];
    };

    // Filtering for Internship Posts
    const filteredInternshipPosts = internshipPosts.filter(post => {
        // Handle search term
        const matchesSearch = post.title.toLowerCase().includes(internshipSearchTerm.toLowerCase()) || 
                             post.description.toLowerCase().includes(internshipSearchTerm.toLowerCase()) ||
                             post.department.toLowerCase().includes(internshipSearchTerm.toLowerCase());
        
        // Handle department filter
        const matchesDepartment = internshipFilter === 'all' || post.department.toLowerCase() === internshipFilter.toLowerCase();
        
        return matchesSearch && matchesDepartment;
    });

    // Handle view internship details
    const handleViewInternshipDetails = (post: InternshipPost, internship: Internship) => {
        setSelectedPost(post);
        setSelectedInternship(internship);
        setShowInternshipDetails(true);
    };

    // Handle closing internship details modal
    const handleCloseInternshipDetails = () => {
        setShowInternshipDetails(false);
        setSelectedInternship(null);
        setSelectedPost(null);
    };

    // Handle creating a new internship post
    const handleCreateOrUpdatePost = () => {
        // Check if required fields are filled
        if (!newPost.title || !newPost.description || !newPost.duration) {
            // Use setTimeout for notification to ensure it's visible after form may be closed
            setTimeout(() => {
                showNotification({
                    message: "Please fill in all required fields (Title, Description, Duration)",
                    type: 'error'
                });
            }, 500);
            return;
        }
        
        if (selectedPost) {
            // Update existing post
            setInternshipPosts(internshipPosts.map(post => 
                post.id === selectedPost.id ? { ...post, ...newPost, postedDate: new Date(), applicationsCount: post.applicationsCount } : post
            ));            
            
            setSelectedPost(null);
            
            // Use setTimeout for notification and closing windows
            setTimeout(() => {
                // Show success notification
                showNotification({
                    message: `Internship post "${newPost.title}" has been updated successfully.`,
                    type: 'success'
                });
                
                // Close the form and reset data
                setShowPostForm(false);
            }, 800); // Simulate network delay
        } else {
            // Create new post with a unique ID
            const post: InternshipPost = {
                id: `post-${Date.now()}`, // Ensure unique ID
                ...newPost,
                postedDate: new Date(),
                applicationsCount: 0,
            };
            
            // Add the new post to the list
            setInternshipPosts(prev => [...prev, post]);
              
            // Use setTimeout for notification and closing windows
            setTimeout(() => {
                // Show success notification
                showNotification({
                    message: `New internship post "${post.title}" has been created successfully.`,
                    type: 'success'
                });
                
                // Add persistent notification for bell icon
                addNotification({
                    title: "New Internship Posted",
                    message: `You've successfully posted "${post.title}" internship.`,
                    type: 'application'
                });
                
                // Close the form and reset data
                setShowPostForm(false);
            }, 800); // Simulate network delay
        }
        
        // Reset form data
        setNewPost({
            title: '',
            description: '',
            department: '',
            deadline: new Date(),
            duration: '',
            isPaid: false,
            expectedSalary: undefined,
            skillsRequired: [],
        });
    };

    // Handle deleting an internship post
    const handleDeletePost = (postId: string) => {
        const post = internshipPosts.find(post => post.id === postId);
        setInternshipPosts(internshipPosts.filter(post => post.id !== postId));
          
        // Use setTimeout for notification
        if (post) {
            setTimeout(() => {
                // Show temporary toast notification
                showNotification({
                    message: `Internship post "${post.title}" has been deleted.`,
                    type: 'info'
                });
                
                // Add persistent notification to bell icon
                addNotification({
                    title: "Internship Deleted",
                    message: `Your "${post.title}" internship post has been removed.`,
                    type: 'application'
                });
            }, 800); // Simulate network delay
        }
    };

    // Handler for starring internships
    const handleStarInternship = (internshipId: number) => {
        if (starredInternships.includes(internshipId)) {
            setStarredInternships(starredInternships.filter(id => id !== internshipId));
        } else {
            setStarredInternships([...starredInternships, internshipId]);
        }
    };

    // Prepare current filters
    const getCurrentFilters = () => {
        // Gather unique departments for filter options
        const departmentsSet = new Set(internshipPosts.map(post => post.department));
        const departmentOptions = ["All", ...[...departmentsSet]];
            
        return {
            filters: [
                {
                    title: "Department",
                    options: departmentOptions,
                    type: "department",
                    value: internshipFilter === 'all' ? 'All' : 
                          internshipFilter.charAt(0).toUpperCase() + internshipFilter.slice(1)
                }
            ],
            onFilterChange: (type: string, value: string) => {
                if (type === "department") {
                    setInternshipFilter(value === "All" ? 'all' : value.toLowerCase());
                }
            },
            onClearFilters: handleClearFilters
        };
    };

    return (
        <div className={styles.pageContainer}>
            <CompanyNavigationMenu />
            
            <div className={styles.contentWrapper}>
                <FilterSidebar 
                    filters={getCurrentFilters().filters}
                    onFilterChange={getCurrentFilters().onFilterChange}
                    onClearFilters={getCurrentFilters().onClearFilters}
                />                <main className={styles.mainContent}>
                    {/* Search Bar */}
                    <SearchBar
                        searchTerm={internshipSearchTerm}
                        setSearchTerm={setInternshipSearchTerm}
                        placeholder="Search by job title or department..."
                    />

                    <div className={styles.internshipListings}>
                        <div className={styles.listingHeader}>
                            <h1 className={styles.listingTitle}>Internship Postings</h1>
                            <div className={styles.headerActions}>
                                <span className={styles.itemCount}>
                                    {filteredInternshipPosts.length} Posting{filteredInternshipPosts.length !== 1 ? 's' : ''}
                                </span>
                                <button 
                                    className={`${styles.actionButton} ${styles.createButton}`}
                                    onClick={() => {
                                        // Reset form data to ensure we're creating a new post
                                        setNewPost({
                                            title: '',
                                            description: '',
                                            department: '',
                                            deadline: new Date(),
                                            duration: '',
                                            isPaid: false,
                                            expectedSalary: undefined,
                                            skillsRequired: [],
                                        });
                                        setSelectedPost(null);
                                        setShowPostForm(true);
                                    }}
                                >
                                    + Create New Internship
                                </button>
                            </div>
                        </div>
                        
                        {filteredInternshipPosts.length > 0 ? (
                            <div className={styles.internshipGrid}>
                                {filteredInternshipPosts.map(post => {
                                    const internshipFormat = convertToInternshipFormat(post);
                                    return (
                                        <div key={internshipFormat.id} className={styles.cardWrapper}>
                                            <InternshipCard
                                                internship={internshipFormat}
                                                isStarred={starredInternships.includes(internshipFormat.id)}
                                                onToggleStar={() => handleStarInternship(internshipFormat.id)}
                                                onViewDetails={() => handleViewInternshipDetails(post, internshipFormat)}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className={styles.noResults}>
                                <div className={styles.noResultsIcon}>📋</div>
                                <h3>No Internship Postings</h3>
                                <p>You haven't created any internship postings yet or none match your filters.</p>
                                <button 
                                    className={`${styles.actionButton} ${styles.createButton}`}
                                    onClick={() => {
                                        setShowPostForm(true);
                                    }}
                                >
                                    Create New Post
                                </button>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Modals */}
            {showPostForm && (
                <InternshipPostModal
                    post={newPost}
                    isEditing={!!selectedPost}
                    onClose={() => { 
                        setShowPostForm(false); 
                        setSelectedPost(null); 
                    }}
                    onSubmit={handleCreateOrUpdatePost}
                    onChange={(post) => {
                        setNewPost(post);
                    }}
                />
            )}
            
            {/* InternshipDetailsModal with edit and delete buttons */}
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
        </div>
    );
};

export default CompanyInternshipsPage;