"use client";
import { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from './page.module.css';

type InternshipPost = {
    id: string;
    title: string;
    description: string;
    department: string;
    postedDate: Date;
    deadline: Date;
    applicationsCount: number;
    duration: string;
    isPaid: boolean;
    expectedSalary?: number;
    skillsRequired: string[];
};

type Application = {
    id: string;
    internshipPostId: string;
    internshipTitle: string;
    applicantName: string;
    applicantEmail: string;
    applicantUniversity: string;
    applicantMajor: string;
    applicationDate: Date;
    status: 'pending' | 'finalized' | 'accepted' | 'rejected' | 'current' | 'completed';
    resumeUrl: string;
    coverLetterUrl: string;
};

type Intern = {
    id: string;
    name: string;
    email: string;
    university: string;
    major: string;
    internshipTitle: string;
    startDate: Date;
    endDate: Date | null;
    status: 'current' | 'completed';
    evaluation?: Evaluation;
};

type Evaluation = {
    id: string;
    internId: string;
    evaluationDate: Date;
    performanceRating: number;
    skillsRating: number;
    attitudeRating: number;
    comments: string;
};

type Notification = {
    id: string;
    message: string;
    type: 'application' | 'status-change' | 'system';
    timestamp: Date;
    read: boolean;
    emailSent: boolean;
};

export default function InternshipDashboard() {
    const [activeTab, setActiveTab] = useState<'internships' | 'applications' | 'interns'>('internships');
    const [internshipPosts, setInternshipPosts] = useState<InternshipPost[]>([]);
    const [applications, setApplications] = useState<Application[]>([]);
    const [interns, setInterns] = useState<Intern[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<string>('all');
    const [selectedPost, setSelectedPost] = useState<InternshipPost | null>(null);
    const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
    const [selectedIntern, setSelectedIntern] = useState<Intern | null>(null);
    const [showEvaluationForm, setShowEvaluationForm] = useState(false);
    const [showPostForm, setShowPostForm] = useState(false);
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
        department: 'engineering',
        deadline: new Date(),
        duration: '',
        isPaid: false,
        expectedSalary: undefined,
        skillsRequired: [],
    });
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);

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
                status: 'completed',
            },
        ];

        setInternshipPosts(mockPosts);
        setApplications(mockApplications);
        setInterns(mockInterns);
    }, []);

    // Filtering logic
    const filteredInternshipPosts = internshipPosts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            post.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' || post.department.toLowerCase() === filter.toLowerCase();
        return matchesSearch && matchesFilter;
    });

    const filteredApplications = applications.filter(app => {
        const matchesSearch = app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            app.internshipTitle.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' || 
                            (filter === 'post' && selectedPost ? app.internshipPostId === selectedPost.id : true) ||
                            app.status === filter;
        return matchesSearch && matchesFilter;
    });

    const filteredInterns = interns.filter(intern => {
        const matchesSearch = intern.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            intern.internshipTitle.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' || intern.status === filter;
        return matchesSearch && matchesFilter;
    });

    // CRUD for Internship Posts
    const handleCreateOrUpdatePost = () => {
        if (selectedPost) {
            setInternshipPosts(internshipPosts.map(post => 
                post.id === selectedPost.id ? { ...post, ...newPost, postedDate: new Date(), applicationsCount: post.applicationsCount } : post
            ));
            setSelectedPost(null);
        } else {
            const post: InternshipPost = {
                id: Date.now().toString(),
                ...newPost,
                postedDate: new Date(),
                applicationsCount: 0,
            };
            setInternshipPosts([...internshipPosts, post]);
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
        setInternshipPosts(internshipPosts.filter(post => post.id !== postId));
    };

    // Status change handlers
    const handleApplicationStatusChange = (applicationId: string, status: Application['status']) => {
        setApplications(applications.map(app => 
            app.id === applicationId ? {...app, status} : app
        ));
    };

    const handleInternStatusChange = (internId: string, status: Intern['status'], endDate?: Date) => {
        setInterns(interns.map(intern => 
            intern.id === internId 
                ? {...intern, status, endDate: status === 'completed' ? endDate || new Date() : null}
                : intern
        ));
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

    return (
        <div className="min-h-screen bg-[var(--background)] flex">
            <Head>
                <title>Internship Management System</title>
            </Head>

            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <h1 className="text-xl font-bold text-white">Internship Management</h1>
                </div>
                <nav className={styles.sidebarNav}>
                    <button
                        className={`${styles.sidebarLink} ${activeTab === 'internships' ? styles.active : ''}`}
                        onClick={() => setActiveTab('internships')}
                    >
                        Internship Posts
                    </button>
                    <button
                        className={`${styles.sidebarLink} ${activeTab === 'applications' ? styles.active : ''}`}
                        onClick={() => setActiveTab('applications')}
                    >
                        Applications
                    </button>
                    <button
                        className={`${styles.sidebarLink} ${activeTab === 'interns' ? styles.active : ''}`}
                        onClick={() => setActiveTab('interns')}
                    >
                        Current Interns
                    </button>
                </nav>
                <button className={styles.addButton} onClick={() => setShowPostForm(true)}>
                    + Add Internship Post
                </button>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className={styles.header}>
                    <div className="relative">
                        <button 
                            className="p-2 rounded-full hover:bg-[var(--secondary)] relative"
                            onClick={() => setShowNotifications(!showNotifications)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            {notifications.filter(n => !n.read).length > 0 && (
                                <span className="absolute top-0 right-0 bg-[var(--accent)] text-[var(--primary)] rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                                    {notifications.filter(n => !n.read).length}
                                </span>
                            )}
                        </button>
                        
                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg overflow-hidden z-50 border border-[var(--light-gray)]">
                                <div className="bg-[var(--primary)] text-white px-4 py-2 flex justify-between items-center">
                                    <h3 className="font-medium">Notifications</h3>
                                    <button 
                                        className="text-sm text-white/80 hover:text-white"
                                        onClick={() => {
                                            setNotifications(prev => prev.map(n => ({...n, read: true})));
                                        }}
                                    >
                                        Mark all as read
                                    </button>
                                </div>
                                <div className="max-h-60 overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <div className="px-4 py-3 text-sm text-gray-500">No notifications</div>
                                    ) : (
                                        notifications.map(notification => (
                                            <div 
                                                key={notification.id}
                                                className={`px-4 py-3 border-b border-[var(--light-gray)]/50 ${!notification.read ? 'bg-[var(--background)]' : 'bg-white'}`}
                                            >
                                                <div className="flex justify-between">
                                                    <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                                                    {notification.emailSent && (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {notification.timestamp.toLocaleTimeString()} - {notification.timestamp.toLocaleDateString()}
                                                </p>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div className="bg-[var(--background)] px-4 py-2 text-center">
                                    <button 
                                        className="text-sm text-[var(--primary)] hover:text-[var(--secondary)]"
                                        onClick={() => setShowNotifications(false)}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                {/* Search and Filter */}
                <div className={styles.searchFilter}>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder={`Search ${activeTab === 'internships' ? 'internship posts' : activeTab === 'applications' ? 'applications' : 'interns'}...`}
                            className="w-full pl-8 pr-3 py-2 text-sm border border-[var(--light-gray)] rounded focus:outline-none focus:ring-1 focus:ring-[var(--light-purple)]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <svg
                            className="h-4 w-4 text-gray-400 absolute left-3 top-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <select
                        className="w-full sm:w-48 px-3 py-2 text-sm border border-[var(--light-gray)] rounded focus:outline-none focus:ring-1 focus:ring-[var(--light-purple)]"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="all">All</option>
                        {activeTab === 'internships' && (
                            <>
                                <option value="engineering">Engineering</option>
                                <option value="marketing">Marketing</option>
                            </>
                        )}
                        {activeTab === 'applications' && (
                            <>
                                <option value="pending">Pending</option>
                                <option value="finalized">Finalized</option>
                                <option value="accepted">Accepted</option>
                                <option value="rejected">Rejected</option>
                                <option value="current">Current</option>
                                <option value="completed">Completed</option>
                                <option value="post">Filter by Post</option>
                            </>
                        )}
                        {activeTab === 'interns' && (
                            <>
                                <option value="current">Current</option>
                                <option value="completed">Completed</option>
                            </>
                        )}
                    </select>
                </div>

                {/* Content Sections */}
                <div className={styles.mainContent}>
                    {/* Internship Posts */}
                    {activeTab === 'internships' && (
                        <div className={styles.section}>
                            <div className="space-y-4">
                                {filteredInternshipPosts.map((post) => (
                                    <div key={post.id} className="border border-[var(--light-gray)] rounded p-4 hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-medium text-[var(--primary)]">{post.title}</h3>
                                                <p className="text-sm text-gray-600 mt-1">{post.description}</p>
                                                <div className="flex gap-4 mt-2 text-xs text-gray-500">
                                                    <span>{post.department}</span>
                                                    <span>{post.postedDate.toLocaleDateString()} - {post.deadline.toLocaleDateString()}</span>
                                                    <span>Duration: {post.duration}</span>
                                                    <span>{post.isPaid ? `Paid: $${post.expectedSalary}` : 'Unpaid'}</span>
                                                    <span>Skills: {post.skillsRequired.join(', ')}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <span className="bg-[var(--light-purple)] text-[var(--primary)] px-2 py-1 rounded-full text-xs font-medium mr-2">
                                                    {post.applicationsCount} applications
                                                </span>
                                                <button 
                                                    className="text-[var(--primary)] hover:text-[var(--secondary)] text-xs mr-2"
                                                    onClick={() => {
                                                        setSelectedPost(post);
                                                        setNewPost(post);
                                                        setShowPostForm(true);
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    className="text-red-600 hover:text-red-800 text-xs"
                                                    onClick={() => handleDeletePost(post.id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Applications */}
                    {activeTab === 'applications' && (
                        <div className={styles.section}>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-[var(--light-gray)] text-sm">
                                    <thead className="bg-[var(--background)]">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-[var(--primary)] uppercase">Applicant</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-[var(--primary)] uppercase">Internship</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-[var(--primary)] uppercase">Status</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-[var(--primary)] uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[var(--light-gray)]">
                                        {filteredApplications.map((app) => (
                                            <tr key={app.id} className="hover:bg-[var(--background)]">
                                                <td className="px-4 py-3">
                                                    <div className="font-medium">{app.applicantName}</div>
                                                    <div className="text-xs text-gray-500">{app.applicantUniversity}</div>
                                                </td>
                                                <td className="px-4 py-3">{app.internshipTitle}</td>
                                                <td className="px-4 py-3">
                                                    <select
                                                        className={`text-xs px-2 py-1 rounded ${
                                                            app.status === 'pending' ? 'bg-[var(--accent)]/20 text-[var(--accent)]' :
                                                            app.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                                            app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                            app.status === 'current' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-[var(--light-purple)] text-[var(--primary)]'
                                                        }`}
                                                        value={app.status}
                                                        onChange={(e) => handleApplicationStatusChange(app.id, e.target.value as Application['status'])}
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="finalized">Finalized</option>
                                                        <option value="accepted">Accepted</option>
                                                        <option value="rejected">Rejected</option>
                                                        <option value="current">Current</option>
                                                        <option value="completed">Completed</option>
                                                    </select>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <button 
                                                        className="text-[var(--primary)] hover:text-[var(--secondary)] text-xs"
                                                        onClick={() => setSelectedApplication(app)}
                                                    >
                                                        View Details
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Current Interns */}
                    {activeTab === 'interns' && (
                        <div className={styles.section}>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-[var(--light-gray)] text-sm">
                                    <thead className="bg-[var(--background)]">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-[var(--primary)] uppercase">Intern</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-[var(--primary)] uppercase">Position</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-[var(--primary)] uppercase">Status</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-[var(--primary)] uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[var(--light-gray)]">
                                        {filteredInterns.map((intern) => (
                                            <tr key={intern.id} className="hover:bg-[var(--background)]">
                                                <td className="px-4 py-3">
                                                    <div className="font-medium">{intern.name}</div>
                                                    <div className="text-xs text-gray-500">{intern.email}</div>
                                                </td>
                                                <td className="px-4 py-3">{intern.internshipTitle}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`text-xs px-2 py-1 rounded ${
                                                        intern.status === 'current' ? 'bg-[var(--purple)]/20 text-[var(--purple)]' : 'bg-[var(--secondary)]/20 text-[var(--secondary)]'
                                                    }`}>
                                                        {intern.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    {intern.status === 'completed' && !intern.evaluation && (
                                                        <button
                                                            className="text-[var(--primary)] hover:text-[var(--secondary)] text-xs"
                                                            onClick={() => {
                                                                setSelectedIntern(intern);
                                                                setShowEvaluationForm(true);
                                                            }}
                                                        >
                                                            Evaluate
                                                        </button>
                                                    )}
                                                    {intern.evaluation && (
                                                        <button
                                                            className="text-[var(--primary)] hover:text-[var(--secondary)] text-xs"
                                                            onClick={() => {
                                                                setSelectedIntern(intern);
                                                                setNewEvaluation({
                                                                    internId: intern.id,
                                                                    performanceRating: intern.evaluation?.performanceRating ?? 0,
                                                                    skillsRating: intern.evaluation?.skillsRating ?? 0,
                                                                    attitudeRating: intern.evaluation?.attitudeRating ?? 0,
                                                                    comments: intern.evaluation?.comments ?? '',
                                                                });
                                                                setShowEvaluationForm(true);
                                                            }}
                                                        >
                                                            Update Evaluation
                                                        </button>
                                                    )}
                                                    {intern.evaluation && (
                                                        <button
                                                            className="text-red-600 hover:text-red-800 text-xs ml-2"
                                                            onClick={() => {
                                                                setInterns(interns.map(i => 
                                                                    i.id === intern.id ? {...i, evaluation: undefined} : i
                                                                ));
                                                            }}
                                                        >
                                                            Delete Evaluation
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            {selectedApplication && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-lg font-bold text-[var(--primary)]">Application Details</h2>
                            <button onClick={() => setSelectedApplication(null)} className="text-gray-500 hover:text-gray-700">
                                ×
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-medium text-gray-900">{selectedApplication.applicantName}</h3>
                                <p className="text-sm text-gray-500">{selectedApplication.applicantEmail}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-700">University</h4>
                                <p>{selectedApplication.applicantUniversity} - {selectedApplication.applicantMajor}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-700">Applied For</h4>
                                <p>{selectedApplication.internshipTitle}</p>
                            </div>
                            <div className="flex space-x-2">
                                <a href={selectedApplication.resumeUrl} className="text-[var(--primary)] hover:text-[var(--secondary)] text-sm">
                                    View Resume
                                </a>
                                <a href={selectedApplication.coverLetterUrl} className="text-[var(--primary)] hover:text-[var(--secondary)] text-sm">
                                    View Cover Letter
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showEvaluationForm && selectedIntern && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-lg font-bold text-[var(--primary)]">Evaluate {selectedIntern.name}</h2>
                            <button onClick={() => setShowEvaluationForm(false)} className="text-gray-500 hover:text-gray-700">
                                ×
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Performance Rating</label>
                                <select
                                    className="w-full px-3 py-2 border border-[var(--light-gray)] rounded text-sm"
                                    value={newEvaluation.performanceRating}
                                    onChange={(e) => setNewEvaluation({...newEvaluation, performanceRating: Number(e.target.value)})}
                                >
                                    {[1, 2, 3, 4, 5].map((num) => (
                                        <option key={num} value={num}>{num} - {num === 1 ? 'Poor' : num === 5 ? 'Excellent' : 'Average'}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Skills Rating</label>
                                <select
                                    className="w-full px-3 py-2 border border-[var(--light-gray)] rounded text-sm"
                                    value={newEvaluation.skillsRating}
                                    onChange={(e) => setNewEvaluation({...newEvaluation, skillsRating: Number(e.target.value)})}
                                >
                                    {[1, 2, 3, 4, 5].map((num) => (
                                        <option key={num} value={num}>{num} - {num === 1 ? 'Poor' : num === 5 ? 'Excellent' : 'Average'}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
                                <textarea
                                    className="w-full px-3 py-2 border border-[var(--light-gray)] rounded text-sm"
                                    rows={3}
                                    value={newEvaluation.comments}
                                    onChange={(e) => setNewEvaluation({...newEvaluation, comments: e.target.value})}
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={() => setShowEvaluationForm(false)}
                                    className="px-4 py-2 text-sm border border-[var(--light-gray)] rounded text-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmitEvaluation}
                                    className="px-4 py-2 text-sm bg-[var(--primary)] text-white rounded hover:bg-[var(--secondary)]"
                                >
                                    Submit Evaluation
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showPostForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-lg font-bold text-[var(--primary)]">{selectedPost ? 'Edit Internship Post' : 'Create Internship Post'}</h2>
                            <button onClick={() => { setShowPostForm(false); setSelectedPost(null); }} className="text-gray-500 hover:text-gray-700">
                                ×
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-[var(--light-gray)] rounded text-sm"
                                    value={newPost.title}
                                    onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    className="w-full px-3 py-2 border border-[var(--light-gray)] rounded text-sm"
                                    rows={3}
                                    value={newPost.description}
                                    onChange={(e) => setNewPost({...newPost, description: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                <select
                                    className="w-full px-3 py-2 border border-[var(--light-gray)] rounded text-sm"
                                    value={newPost.department}
                                    onChange={(e) => setNewPost({...newPost, department: e.target.value})}
                                >
                                    <option value="engineering">Engineering</option>
                                    <option value="marketing">Marketing</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                                <input
                                    type="date"
                                    className="w-full px-3 py-2 border border-[var(--light-gray)] rounded text-sm"
                                    value={newPost.deadline.toISOString().split('T')[0]}
                                    onChange={(e) => setNewPost({...newPost, deadline: new Date(e.target.value)})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-[var(--light-gray)] rounded text-sm"
                                    value={newPost.duration}
                                    onChange={(e) => setNewPost({...newPost, duration: e.target.value})}
                                    placeholder="e.g., 3 months"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Paid?</label>
                                <select
                                    className="w-full px-3 py-2 border border-[var(--light-gray)] rounded text-sm"
                                    value={newPost.isPaid ? 'true' : 'false'}
                                    onChange={(e) => setNewPost({...newPost, isPaid: e.target.value === 'true', expectedSalary: newPost.isPaid ? newPost.expectedSalary : undefined})}
                                >
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                </select>
                            </div>
                            {newPost.isPaid && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Expected Salary ($)</label>
                                    <input
                                        type="number"
                                        className="w-full px-3 py-2 border border-[var(--light-gray)] rounded text-sm"
                                        value={newPost.expectedSalary || ''}
                                        onChange={(e) => setNewPost({...newPost, expectedSalary: Number(e.target.value) || undefined})}
                                    />
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Skills Required (comma-separated)</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-[var(--light-gray)] rounded text-sm"
                                    value={newPost.skillsRequired.join(', ')}
                                    onChange={(e) => setNewPost({...newPost, skillsRequired: e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill)})}
                                    placeholder="e.g., React, JavaScript, CSS"
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={() => { setShowPostForm(false); setSelectedPost(null); }}
                                    className="px-4 py-2 text-sm border border-[var(--light-gray)] rounded text-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateOrUpdatePost}
                                    className="px-4 py-2 text-sm bg-[var(--primary)] text-white rounded hover:bg-[var(--secondary)]"
                                >
                                    {selectedPost ? 'Update Post' : 'Create Post'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showEvaluationForm && selectedIntern && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-lg font-bold text-[var(--primary)]">Evaluate {selectedIntern.name}</h2>
                            <button onClick={() => setShowEvaluationForm(false)} className="text-gray-500 hover:text-gray-700">
                                ×
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Performance Rating</label>
                                <select
                                    className="w-full px-3 py-2 border border-[var(--light-gray)] rounded text-sm"
                                    value={newEvaluation.performanceRating}
                                    onChange={(e) => setNewEvaluation({...newEvaluation, performanceRating: Number(e.target.value)})}
                                >
                                    {[1, 2, 3, 4, 5].map((num) => (
                                        <option key={num} value={num}>{num} - {num === 1 ? 'Poor' : num === 5 ? 'Excellent' : 'Average'}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Skills Rating</label>
                                <select
                                    className="w-full px-3 py-2 border border-[var(--light-gray)] rounded text-sm"
                                    value={newEvaluation.skillsRating}
                                    onChange={(e) => setNewEvaluation({...newEvaluation, skillsRating: Number(e.target.value)})}
                                >
                                    {[1, 2, 3, 4, 5].map((num) => (
                                        <option key={num} value={num}>{num} - {num === 1 ? 'Poor' : num === 5 ? 'Excellent' : 'Average'}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
                                <textarea
                                    className="w-full px-3 py-2 border border-[var(--light-gray)] rounded text-sm"
                                    rows={3}
                                    value={newEvaluation.comments}
                                    onChange={(e) => setNewEvaluation({...newEvaluation, comments: e.target.value})}
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={() => setShowEvaluationForm(false)}
                                    className="px-4 py-2 text-sm border border-[var(--light-gray)] rounded text-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmitEvaluation}
                                    className="px-4 py-2 text-sm bg-[var(--primary)] text-white rounded hover:bg-[var(--secondary)]"
                                >
                                    Submit Evaluation
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}