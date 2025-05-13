"use client";
import React, { useState, useEffect } from 'react';
import styles from "./page.module.css";

// Import modular components
import Navigation from "../../../src/components/global/Navigation";
import FilterSidebar from "../../../src/components/global/FilterSidebar";
import SearchBar from "../../../src/components/global/SearchBar";
import CompanyCard from "../../../src/components/Companies/CompanyCard";
import CompanyDetailsModal from "../../../src/components/Companies/CompanyDetailsModal";
import NotificationSystem, { useNotification } from "../../../src/components/global/NotificationSystem";
import { Company, FilterOptions } from "../../../src/components/Companies/types";

export default function CompaniesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({
    industry: 'All',
    recommendation: 'All',
    rating: 'All',
  });
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const { notification, visible, showNotification, hideNotification } = useNotification();

  // Filter options
  const industryOptions = ['All', 'Technology', 'Finance', 'Healthcare', 'Education', 'Entertainment', 'Automotive', 'Design', 'Marketing'];
  const recommendationOptions = ['All', 'High', 'Medium', 'Low'];
  const ratingOptions = ['All', '5 Stars', '4+ Stars', '3+ Stars'];

  // Format filters for the global FilterSidebar component
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
    
    setCompanies(mockCompanies);
    setFilteredCompanies(mockCompanies);
  }, []);

  // Filter companies based on search term and filters
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

  // Handle saving a company
  const handleSaveCompany = (companyId: number) => {
    // Implement save company functionality (would be API call in real app)
    showNotification({
      message: 'Company saved to your favorites!',
      type: 'success'
    });
  };
  return (
    <div className={styles.pageContainer}>
      {/* Header/Navigation */}
      <Navigation title="GUC Internship Portal" />

      <div className={styles.contentWrapper}>
        {/* Left Sidebar with Filters */}
        <FilterSidebar 
          filters={getFormattedFilters()}
          onFilterChange={handleFilterChange}
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
              ) : (
                <div className={styles.noResults}>
                  <img 
                    src="assets/images/icons/search.png" 
                    alt="Search Icon" 
                    className={styles.searchIcon} 
                  /> 
                  <h3>No companies found</h3>
                  <p>Try adjusting your search criteria or filters</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
        {/* Details Modal */}
      {selectedCompany && (
        <CompanyDetailsModal
          company={selectedCompany}
          onClose={handleCloseModal}
          onSave={() => handleSaveCompany(selectedCompany.id)}
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
      )}
    </div>
  );
}