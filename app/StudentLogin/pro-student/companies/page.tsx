"use client";
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from "./page.module.css";

// Import modular components
import NavigationMenu, { MenuItem } from "@/components/global/NavigationMenu";
import ProStudentNavigationMenu from '../Navigation/ProStudentNavigationMenu';
import FilterSidebar from "@/components/global/FilterSidebar";
import SearchBar from "@/components/global/SearchBar";
import CompanyCard from "@/components/Companies/CompanyCard";
import CompanyDetailsModal from "@/components/Companies/CompanyDetailsModal";
import ProfileViewsList from "@/components/ProfileViews/ProfileViewsList";
import ProfileViewDetailsModal from "@/components/ProfileViews/ProfileViewDetailsModal";
import { useNotification } from "@/components/global/NotificationSystemAdapter";
import { Company, FilterOptions } from "@/components/Companies/types";
import { Eye, Building } from 'lucide-react';

// Define the profile view interface
interface ProfileView {
  id: number;
  company: string;
  logo: string;
  viewDate: string;
  viewTime: string;
  jobTitle?: string;
  recruiterName?: string;
  industry: string;
  isRecurring: boolean;
}

export default function CompaniesPage() {
  const searchParams = useSearchParams();
  
  // Get initial tab from URL parameters
  const initialTab = searchParams.get('tab') === 'profileViews' ? 'profileViews' : 'companies';
  
  // Tab state - set the initial state based on URL
  const [activeTab, setActiveTab] = useState<'companies' | 'profileViews'>(initialTab);
  
  // Check URL parameters for tab selection updates
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'profileViews') {
      setActiveTab('profileViews');
    } else if (tab === null || tab === '') {
      setActiveTab('companies');
    }
  }, [searchParams]);
  
  // Companies tab states
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({
    industry: 'All',
    recommendation: 'All',
    rating: 'All',
  });
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    // Profile views tab states
  const [profileViews, setProfileViews] = useState<ProfileView[]>([]);
  const [filteredProfileViews, setFilteredProfileViews] = useState<ProfileView[]>([]);
  const [selectedProfileView, setSelectedProfileView] = useState<ProfileView | null>(null);
  const [highlightedViewId, setHighlightedViewId] = useState<number | undefined>(undefined);
  const [profileViewSearchTerm, setProfileViewSearchTerm] = useState('');
  const [profileViewFilters, setProfileViewFilters] = useState({
    industry: 'All',
    viewType: 'All',
    timeRange: 'All'
  });
  
  const { notification, visible, showNotification, hideNotification, addNotification } = useNotification();
  // Filter options
  const industryOptions = ['All', 'Technology', 'Finance', 'Healthcare', 'Education', 'Entertainment', 'Automotive', 'Design', 'Marketing', 'E-commerce'];
  const recommendationOptions = ['All', 'High', 'Medium', 'Low'];
  const ratingOptions = ['All', '5 Stars', '4+ Stars', '3+ Stars'];
  
  // Profile view filter options
  const viewTypeOptions = ['All', 'New Views', 'Recurring Views'];
  const timeRangeOptions = ['All', 'Last 24 Hours', 'Last 7 Days', 'Last 30 Days'];

  // Format filters for the companies tab
  const getFormattedFilters = () => {
    return [
      {
        title: "Industry",
        options: industryOptions,
        type: "industry",
        value: activeFilters.industry || 'All'
      },
      {
        title: "Recommendation",
        options: recommendationOptions,
        type: "recommendation",
        value: activeFilters.recommendation || 'All'
      },
      {
        title: "Rating",
        options: ratingOptions,
        type: "rating",
        value: activeFilters.rating || 'All'
      }
    ];
  };
  
  // Format filters for the profile views tab
  const getFormattedProfileViewFilters = () => {
    return [
      {
        title: "Industry",
        options: industryOptions,
        type: "industry",
        value: profileViewFilters.industry || 'All'
      },
      {
        title: "View Type",
        options: viewTypeOptions,
        type: "viewType",
        value: profileViewFilters.viewType || 'All'
      },
      {
        title: "Time Range",
        options: timeRangeOptions,
        type: "timeRange",
        value: profileViewFilters.timeRange || 'All'
      }
    ];
  };

  // Mock data for companies  
  useEffect(() => {
    // This would typically be an API call to fetch companies
    const mockCompanies: Company[] = [
      {
        id: 1,
        name: 'Amazon',
        industry: 'Technology',
        location: 'Seattle, WA',
        logo: '/logos/amazon.png',
        description: 'Amazon.com, Inc. is an American multinational technology company focusing on e-commerce, cloud computing, online advertising, digital streaming, and artificial intelligence.',
        rating: 4.5,
        recommendationLevel: 'High',
        internshipCount: 156,
        openPositions: 23,
        technologiesUsed: ['AWS', 'Java', 'React', 'Node.js'],
        benefits: ['Competitive salary', 'Flexible hours', 'Health insurance', 'Professional development'],
        pastInternReviews: [
          {
            name: 'Sarah J.',
            position: 'Software Engineering Intern',
            rating: 5,
            comment: 'Amazing experience with great mentorship and real projects.',
            year: 2024
          },
          {
            name: 'Michael R.',
            position: 'UX Design Intern',
            rating: 4,
            comment: 'Learned a lot about user research and prototyping. Great team culture.',
            year: 2023
          }
        ],
        matchScore: 95
      },
      {
        id: 2,
        name: 'Google',
        industry: 'Technology',
        location: 'Mountain View, CA',
        logo: '/logos/google.png',
        description: 'Google LLC is an American multinational technology company focusing on search engine technology, online advertising, cloud computing, computer software, quantum computing, e-commerce, and artificial intelligence.',
        rating: 4.8,
        recommendationLevel: 'High',
        internshipCount: 210,
        openPositions: 42,
        technologiesUsed: ['Python', 'TensorFlow', 'Angular', 'Go', 'Cloud'],
        benefits: ['Competitive pay', 'Free meals', 'Health insurance', 'Transportation', 'Gym'],
        pastInternReviews: [
          {
            name: 'Alex P.',
            position: 'Data Science Intern',
            rating: 5,
            comment: 'Incredible learning environment with cutting-edge projects.',
            year: 2024
          },
          {
            name: 'Jamie L.',
            position: 'Product Management Intern',
            rating: 5,
            comment: 'Got to work on real products with amazing mentorship.',
            year: 2023
          }
        ],
        matchScore: 90
      },
      {
        id: 3,
        name: 'Microsoft',
        industry: 'Technology',
        location: 'Redmond, WA',
        logo: '/logos/microsoft.png',
        description: 'Microsoft Corporation is an American multinational technology corporation producing computer software, consumer electronics, personal computers, and related services.',
        rating: 4.7,
        recommendationLevel: 'High',
        internshipCount: 189,
        openPositions: 35,
        technologiesUsed: ['.NET', 'Azure', 'TypeScript', 'C#', 'React'],
        benefits: ['Competitive salary', 'Health benefits', 'Work-life balance', 'Learning opportunities'],
        pastInternReviews: [
          {
            name: 'Taylor W.',
            position: 'Software Engineering Intern',
            rating: 5,
            comment: 'Great culture and meaningful projects with real impact.',
            year: 2024
          },
          {
            name: 'Jordan K.',
            position: 'Cloud Solutions Intern',
            rating: 4,
            comment: 'Learned a lot about Azure and cloud architecture.',
            year: 2023
          }
        ],
        matchScore: 88
      },
      {
        id: 4,
        name: 'IBM',
        industry: 'Technology',
        location: 'Armonk, NY',
        logo: '/logos/ibm.png',
        description: 'International Business Machines Corporation is an American multinational technology corporation with operations in over 171 countries.',
        rating: 4.2,
        recommendationLevel: 'Medium',
        internshipCount: 120,
        openPositions: 18,
        technologiesUsed: ['Watson', 'Cloud', 'Java', 'AI', 'Blockchain'],
        benefits: ['Competitive pay', 'Flexible work arrangements', 'Health benefits'],
        pastInternReviews: [
          {
            name: 'Sam T.',
            position: 'Data Analytics Intern',
            rating: 4,
            comment: 'Good exposure to enterprise solutions and data science.',
            year: 2023
          },
          {
            name: 'Riley M.',
            position: 'Research Intern',
            rating: 5,
            comment: 'Cutting-edge research opportunities with great mentors.',
            year: 2022
          }
        ],
        matchScore: 82
      },
      {
        id: 5,
        name: 'Apple',
        industry: 'Technology',
        location: 'Cupertino, CA',
        logo: '/logos/apple.png',
        description: 'Apple Inc. is an American multinational technology company that specializes in consumer electronics, software and online services.',
        rating: 4.6,
        recommendationLevel: 'High',
        internshipCount: 178,
        openPositions: 26,
        technologiesUsed: ['Swift', 'iOS', 'macOS', 'Machine Learning', 'UI Design'],
        benefits: ['Competitive salary', 'Product discounts', 'Health benefits', 'Wellness programs'],
        pastInternReviews: [
          {
            name: 'Cameron B.',
            position: 'iOS Development Intern',
            rating: 5,
            comment: 'Amazing culture and learned so much about building polished products.',
            year: 2024
          },
          {
            name: 'Morgan L.',
            position: 'UX Research Intern',
            rating: 4,
            comment: 'Great mentorship and learned a lot about user research methodologies.',
            year: 2023
          }
        ],
        matchScore: 85
      },
      {
        id: 6,
        name: 'Spotify',
        industry: 'Entertainment',
        location: 'New York, NY',
        logo: '/logos/spotify.png',
        description: 'Spotify is a Swedish audio streaming and media services provider that offers music and podcasts from various creators.',
        rating: 4.4,
        recommendationLevel: 'Medium',
        internshipCount: 89,
        openPositions: 12,
        technologiesUsed: ['Python', 'React', 'Data Analytics', 'Machine Learning', 'Audio Engineering'],
        benefits: ['Flexible work environment', 'Spotify Premium', 'Generous vacation policy'],
        pastInternReviews: [
          {
            name: 'Jesse F.',
            position: 'Data Science Intern',
            rating: 4,
            comment: 'Great culture and interesting problems in music recommendation.',
            year: 2024
          },
          {
            name: 'Dana T.',
            position: 'Product Design Intern',
            rating: 5,
            comment: 'Amazing experience designing features for millions of users.',
            year: 2023
          }
        ],
        matchScore: 78
      },
      {
        id: 7,
        name: 'Tesla',
        industry: 'Automotive',
        location: 'Austin, TX',
        logo: '/logos/tesla.png',
        description: 'Tesla, Inc. is an American electric vehicle and clean energy company that designs and manufactures electric vehicles, battery energy storage, and solar products.',
        rating: 4.3,
        recommendationLevel: 'Medium',
        internshipCount: 95,
        openPositions: 15,
        technologiesUsed: ['Embedded Systems', 'Computer Vision', 'AI', 'Mechanical Engineering', 'Battery Tech'],
        benefits: ['Competitive pay', 'Stock options', 'Electric vehicle discount'],
        pastInternReviews: [
          {
            name: 'Casey R.',
            position: 'Engineering Intern',
            rating: 5,
            comment: 'Fast-paced environment with cutting-edge technology.',
            year: 2023
          },
          {
            name: 'Avery S.',
            position: 'Supply Chain Intern',
            rating: 4,
            comment: 'Challenging but rewarding experience with great exposure.',
            year: 2022
          }
        ],
        matchScore: 72
      }
    ];
      // Mock profile views data
    const mockProfileViews: ProfileView[] = [
      {
        id: 1,
        company: 'Google',
        logo: '/logos/google.png',
        viewDate: '2025-05-10',
        viewTime: '10:30 AM',
        jobTitle: 'Software Engineer',
        recruiterName: 'Sarah Johnson',
        industry: 'Technology',
        isRecurring: false
      },
      {
        id: 2,
        company: 'Microsoft',
        logo: '/logos/microsoft.png',
        viewDate: '2025-05-09',
        viewTime: '2:45 PM',
        jobTitle: 'Full Stack Developer',
        recruiterName: 'James Wilson',
        industry: 'Technology',
        isRecurring: true
      },
      {
        id: 3,
        company: 'Amazon',
        logo: '/logos/amazon.png',
        viewDate: '2025-05-05',
        viewTime: '11:15 AM',
        jobTitle: 'Backend Engineer',
        recruiterName: 'Michael Brown',
        industry: 'E-commerce',
        isRecurring: false
      },
      {
        id: 4,
        company: 'Tesla',
        logo: '/logos/tesla.png',
        viewDate: '2025-04-30',
        viewTime: '9:20 AM',
        jobTitle: 'Data Scientist',
        recruiterName: 'Emily Davis',
        industry: 'Automotive',
        isRecurring: true
      }
    ];    setCompanies(mockCompanies);
    setFilteredCompanies(mockCompanies);
    setProfileViews(mockProfileViews);
    setFilteredProfileViews(mockProfileViews);
  }, []);

  // Filter companies based on search term and filters  // Filter companies based on search term and filters
  useEffect(() => {
    let results = [...companies];
    
    // Apply search term (company name or industry)
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        company => 
          company.name.toLowerCase().includes(term) || 
          company.industry.toLowerCase().includes(term)
      );
    }
    
    // Apply industry filter if not "All"
    if (activeFilters.industry && activeFilters.industry !== 'All') {
      results = results.filter(company => 
        company.industry === activeFilters.industry
      );
    }
    
    // Apply recommendation filter if not "All"
    if (activeFilters.recommendation && activeFilters.recommendation !== 'All') {
      results = results.filter(company => 
        company.recommendationLevel === activeFilters.recommendation
      );
    }
    
    // Apply rating filter
    if (activeFilters.rating && activeFilters.rating !== 'All') {
      const ratingFilter = activeFilters.rating;
      
      if (ratingFilter === '5 Stars') {
        results = results.filter(company => company.rating === 5);
      } else if (ratingFilter === '4+ Stars') {
        results = results.filter(company => company.rating >= 4);
      } else if (ratingFilter === '3+ Stars') {
        results = results.filter(company => company.rating >= 3);
      }
    }

    // Sort results by match score (highest first)
    results.sort((a, b) => b.matchScore - a.matchScore);
    
    setFilteredCompanies(results);
  }, [companies, searchTerm, activeFilters]);
  
  // Filter profile views based on search term and filters
  useEffect(() => {
    let results = [...profileViews];
    
    // Apply search term (company name or industry)
    if (profileViewSearchTerm.trim() !== '') {
      const term = profileViewSearchTerm.toLowerCase();
      results = results.filter(
        view => 
          view.company.toLowerCase().includes(term) || 
          view.industry.toLowerCase().includes(term) ||
          (view.recruiterName && view.recruiterName.toLowerCase().includes(term)) ||
          (view.jobTitle && view.jobTitle.toLowerCase().includes(term))
      );
    }
    
    // Apply industry filter if not "All"
    if (profileViewFilters.industry !== 'All') {
      results = results.filter(view => 
        view.industry === profileViewFilters.industry
      );
    }
    
    // Apply view type filter if not "All"
    if (profileViewFilters.viewType !== 'All') {
      if (profileViewFilters.viewType === 'New Views') {
        results = results.filter(view => !view.isRecurring);
      } else if (profileViewFilters.viewType === 'Recurring Views') {
        results = results.filter(view => view.isRecurring);
      }
    }
    
    // Apply time range filter
    if (profileViewFilters.timeRange !== 'All') {
      const now = new Date();
      const viewDate = (dateStr: string) => new Date(dateStr);
      
      if (profileViewFilters.timeRange === 'Last 24 Hours') {
        results = results.filter(view => {
          const date = viewDate(view.viewDate);
          const diffTime = now.getTime() - date.getTime();
          const diffDays = diffTime / (1000 * 3600 * 24);
          return diffDays <= 1;
        });
      } else if (profileViewFilters.timeRange === 'Last 7 Days') {
        results = results.filter(view => {
          const date = viewDate(view.viewDate);
          const diffTime = now.getTime() - date.getTime();
          const diffDays = diffTime / (1000 * 3600 * 24);
          return diffDays <= 7;
        });
      } else if (profileViewFilters.timeRange === 'Last 30 Days') {
        results = results.filter(view => {
          const date = viewDate(view.viewDate);
          const diffTime = now.getTime() - date.getTime();
          const diffDays = diffTime / (1000 * 3600 * 24);
          return diffDays <= 30;
        });
      }
    }
    
    // Sort by view date (newest first)
    results.sort((a, b) => {
      const dateA = new Date(`${a.viewDate} ${a.viewTime}`);
      const dateB = new Date(`${b.viewDate} ${b.viewTime}`);
      return dateB.getTime() - dateA.getTime();
    });
    
    setFilteredProfileViews(results);
  }, [profileViews, profileViewSearchTerm, profileViewFilters]);

  // Handle viewing company details
  const handleViewDetails = (company: Company) => {
    setSelectedCompany(company);
  };

  // Handle closing the details modal
  const handleCloseModal = () => {
    setSelectedCompany(null);
  };
  // Handle filter changes
  const handleFilterChange = (filterType: string, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };
  
  // Clear all company filters
  const handleClearFilters = () => {
    setActiveFilters({
      industry: 'All',
      recommendation: 'All',
      rating: 'All'
    });
    setSearchTerm('');
  };
  
  // Handle profile view filter changes
  const handleProfileViewFilterChange = (filterType: string, value: string) => {
    setProfileViewFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };
  
  // Clear all profile view filters
  const handleClearProfileViewFilters = () => {
    setProfileViewFilters({
      industry: 'All',
      viewType: 'All',
      timeRange: 'All'
    });
    setProfileViewSearchTerm('');
  };  
  
  // Handle saving a company
  const handleSaveCompany = (companyId: number) => {
    // Implement save company functionality (would be API call in real app)
    
    // Find the company by ID
    const company = companies.find(c => c.id === companyId);
    
    setTimeout(() => {
      // Close the modal if it's open
      if (selectedCompany && selectedCompany.id === companyId) {
        setSelectedCompany(null);
      }
      
      // Show temporary toast notification
      showNotification({
        message: 'Company saved to your favorites!',
        type: 'success'
      });
      
      // Add persistent notification to bell icon
      if (company) {
        addNotification({
          title: 'Company Saved',
          message: `${company.name} has been added to your favorites`,
          type: 'application'
        });
      }
    }, 800); // Simulate network delay
  };
  
  // Handle view profile view details
  const handleViewProfileDetails = (view: ProfileView) => {
    setSelectedProfileView(view);
  };
  
  // Handle closing the profile view details modal
  const handleCloseProfileViewModal = () => {
    setSelectedProfileView(null);
  };
  
  // Handle sending a message to a recruiter
  const handleSendMessageToRecruiter = (profileView: ProfileView) => {
    // This would typically send a message via an API call
    const recruiterName = profileView.recruiterName || 'the recruiter';
    const companyName = profileView.company;
    
    // Use setTimeout for closing modal and showing notifications
    setTimeout(() => {
      // Close the profile view modal
      setSelectedProfileView(null);
      
      // Show temporary toast notification
      showNotification({
        message: `Message sent to ${recruiterName} at ${companyName}!`,
        type: 'success'
      });
        // Add persistent notification to bell icon
      addNotification({
        title: 'Message Sent',
        message: `You've contacted ${recruiterName} at ${companyName} about a potential opportunity.`,
        type: 'application'
      });
    }, 800); // Simulate network delay
  };
  
  // Navigation menu items for tabs
  const navItems: MenuItem[] = [
    {
      id: 'companies',
      label: 'Companies',
      icon: <Building size={18} />,
      onClick: () => setActiveTab('companies')
    },
    {
      id: 'profileViews',
      label: 'Profile Views',
      icon: <Eye size={18} />,
      count: profileViews.length,
      onClick: () => setActiveTab('profileViews')
    }
  ];
  
  return (
    <div className={styles.pageContainer}>
      {/* Global Navigation for Pro Student */}
      <ProStudentNavigationMenu />
  
      <div className={styles.contentWrapper}>
        {activeTab === 'companies' ? (
          <>            {/* Left Sidebar with Filters */}
            <FilterSidebar 
              filters={getFormattedFilters()}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />

            {/* Main Content */}
            <main className={styles.mainContent}>
              {/* Search Bar */}
              <SearchBar 
                searchTerm={searchTerm} 
                setSearchTerm={setSearchTerm} 
                placeholder="Search by company name or industry..."
              />

              {/* Company Listings */}
              <div className={styles.companyListings}>
                <div className={styles.listingHeader}>
                  <h2 className={styles.listingTitle}>Suggested Companies</h2>
                  <span className={styles.companyCount}>
                    {filteredCompanies.length} Compan{filteredCompanies.length !== 1 ? 'ies' : 'y'}
                  </span>
                </div>
                
                <div className={styles.cards}>
                  {filteredCompanies.length > 0 ? (
                    filteredCompanies.map((company) => (
                      <CompanyCard
                        key={company.id}
                        company={company}
                        onViewDetails={() => handleViewDetails(company)}
                        onSave={() => handleSaveCompany(company.id)}
                      />
                    ))
                  ) : (                    <div className={styles.noResults}>
                      <img 
                        src="assets/images/icons/search.png" 
                        alt="Search Icon" 
                        className={styles.searchIcon} 
                      /> 
                      <h3>No companies found</h3>
                      <p>Try adjusting your search criteria or filters</p>
                      {(searchTerm || activeFilters.industry !== 'All' || activeFilters.recommendation !== 'All' || activeFilters.rating !== 'All') && (
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
              </div>
            </main>
          </>        
          ) : (
          <>
            {/* Left Sidebar with Filters for Profile Views */}
            <FilterSidebar 
              filters={getFormattedProfileViewFilters()}
              onFilterChange={handleProfileViewFilterChange}
              onClearFilters={handleClearProfileViewFilters}
            />

            <main className={styles.mainContent}>
              {/* Search Bar for Profile Views */}
              <SearchBar 
                searchTerm={profileViewSearchTerm}
                setSearchTerm={setProfileViewSearchTerm}
                placeholder="Search by company, industry, recruiter..."
              />

              <div className={styles.companyListings}>              
                <div className={styles.profileViewsHeaderContainer}>
                  <div className={styles.profileViewsHeader}>
                    <h2 className={styles.listingTitle}>Companies that viewed your profile</h2>
                  </div>
                
                  {/* Profile Views Stats */}
                  <div className={styles.viewsStats}>
                    <span className={styles.viewsCount}>
                      {profileViews.length} Total Views
                    </span>
                    <span className={styles.companyCount}>
                      {profileViews.filter(view => !view.isRecurring).length} New Companies
                    </span>
                    <span className={styles.recurringCount}>
                      {profileViews.filter(view => view.isRecurring).length} Recurring Views
                    </span>
                  </div>
                </div>
                
                <ProfileViewsList
                  profileViews={filteredProfileViews}
                  onViewDetails={handleViewProfileDetails}
                  highlightedViewId={highlightedViewId}
                />
              </div>
            </main>
          </>
        )}
      </div>

      {/* Company Details Modal */}
      {selectedCompany && (
        <CompanyDetailsModal
          company={selectedCompany}
          onClose={handleCloseModal}
          onSave={() => handleSaveCompany(selectedCompany.id)}
        />
      )}
        {/* Profile View Details Modal */}
      {selectedProfileView && (
        <ProfileViewDetailsModal
          view={selectedProfileView}
          onClose={handleCloseProfileViewModal}
          onSendMessage={handleSendMessageToRecruiter}
        />
      )}
      
    </div>
  );
}