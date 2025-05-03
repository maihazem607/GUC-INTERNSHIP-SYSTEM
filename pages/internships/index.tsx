import Image from "next/image";
import styles from "./page.module.css";
import React, { useState, useEffect } from 'react';

interface Internship {
  id: number;
  company: string;
  title: string;
  duration: string;
  date: string;
  location: string;
  industry: string;
  isPaid: boolean;
  salary: string;
  logo?: string;
}

const internships: Internship[] = [
  {
    id: 1,
    company: 'Amazon',
    title: 'Senior UI/UX Designer',
    duration: '3 months',
    date: '20 May 2023',
    location: 'San Francisco, CA',
    industry: 'Technology',
    isPaid: true,
    salary: '$250/hr',
    logo: '/logos/amazon.png'
  },
  {
    id: 2,
    company: 'Google',
    title: 'Junior UI/UX Designer',
    duration: '6 months',
    date: '4 Feb 2023',
    location: 'California, CA',
    industry: 'Technology',
    isPaid: true,
    salary: '$150/hr',
    logo: '/logos/google.png'
  },
  {
    id: 3,
    company: 'Dribbble',
    title: 'Senior Motion Designer',
    duration: '3 months',
    date: '29 Jan 2023',
    location: 'New York, NY',
    industry: 'Design',
    isPaid: true,
    salary: '$260/hr',
    logo: '/logos/dribbble.png'
  },
  {
    id: 4,
    company: 'Twitter',
    title: 'UX Designer',
    duration: '4 months',
    date: '11 Apr 2023',
    location: 'California, CA',
    industry: 'Social Media',
    isPaid: true,
    salary: '$120/hr',
    logo: '/logos/twitter.png'
  },
  {
    id: 5,
    company: 'Airbnb',
    title: 'Graphic Designer',
    duration: '6 months',
    date: '2 Apr 2023',
    location: 'New York, NY',
    industry: 'Travel',
    isPaid: true,
    salary: '$300/hr',
    logo: '/logos/airbnb.png'
  },
  {
    id: 6,
    company: 'Apple',
    title: 'Graphic Designer',
    duration: '3 months',
    date: '18 Jan 2023',
    location: 'San Francisco, CA',
    industry: 'Technology',
    isPaid: true,
    salary: '$140/hr',
    logo: '/logos/apple.png'
  },
  {
    id: 7,
    company: 'Google',
    title: 'Senior Data Scientist',
    duration: '6 months',
    date: '19 Feb 2023',
    location: 'California, CA',
    industry: 'Technology',
    isPaid: true,
    salary: '$290/hr',
    logo: '/logos/google.png'
  },
  {
    id: 8,
    company: 'Microsoft',
    title: 'Software Engineer',
    duration: '3 months',
    date: '12 May 2023',
    location: 'Redmond, WA',
    industry: 'Technology',
    isPaid: true,
    salary: '$176/hr',
    logo: '/logos/microsoft.png'
  },
  {
    id: 9,
    company: 'Amazon Web Services (AWS)',
    title: 'Middle DevOps Engineer',
    duration: '6 months',
    date: '29 May 2023',
    location: 'Seattle, WA',
    industry: 'Cloud Computing',
    isPaid: true,
    salary: '$190/hr',
    logo: '/logos/amazon.png'
  },
  {
    id: 10,
    company: 'IBM',
    title: 'Cybersecurity Analyst',
    duration: '3 months',
    date: '11 May 2023',
    location: 'Armonk, NY',
    industry: 'Technology',
    isPaid: true,
    salary: '$140/hr',
    logo: '/logos/ibm.png'
  },
  {
    id: 11,
    company: 'Salesforce',
    title: 'Cloud Solutions Architect',
    duration: '6 months',
    date: '14 Apr 2023',
    location: 'San Francisco, CA',
    industry: 'Cloud Computing',
    isPaid: true,
    salary: '$220/hr',
    logo: '/logos/salesforce.png'
  },
  {
    id: 12,
    company: 'Facebook',
    title: 'Senior Full Stack Developer',
    duration: '3 months',
    date: '18 Jan 2023',
    location: 'Menlo Park, CA',
    industry: 'Social Media',
    isPaid: true,
    salary: '$110/hr',
    logo: '/logos/facebook.png'
  },
  {
    id: 13,
    company: 'Adobe',
    title: 'UI/UX Design Intern',
    duration: '3 months',
    date: '25 Apr 2023',
    location: 'San Jose, CA',
    industry: 'Design',
    isPaid: false,
    salary: 'Unpaid',
    logo: '/logos/adobe.png'
  },
  {
    id: 14,
    company: 'Spotify',
    title: 'Music Data Analyst',
    duration: '6 months',
    date: '30 Mar 2023',
    location: 'New York, NY',
    industry: 'Entertainment',
    isPaid: true,
    salary: '$160/hr',
    logo: '/logos/spotify.png'
  },
  {
    id: 15,
    company: 'Netflix',
    title: 'Content Marketing Intern',
    duration: '3 months',
    date: '22 Feb 2023',
    location: 'Los Gatos, CA',
    industry: 'Entertainment',
    isPaid: false,
    salary: 'Unpaid',
    logo: '/logos/netflix.png'
  },
  {
    id: 16,
    company: 'Tesla',
    title: 'Engineering Intern',
    duration: '6 months',
    date: '10 Mar 2023',
    location: 'Austin, TX',
    industry: 'Automotive',
    isPaid: true,
    salary: '$180/hr',
    logo: '/logos/tesla.png'
  }
];

export default function InternshipListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    industry: 'All Industries',
    duration: 'All Durations',
    isPaid: 'All'
  });
  const [filteredInternships, setFilteredInternships] = useState<Internship[]>(internships);
  const [starredInternships, setStarredInternships] = useState<number[]>([]);

  // Available filter options
  const industries = ['All Industries', 'Technology', 'Design', 'Social Media', 'Travel', 'Cloud Computing', 'Entertainment', 'Automotive'];
  const durations = ['All Durations', '3 months', '4 months', '6 months'];
  const paidOptions = ['All', 'Paid', 'Unpaid'];

  // Apply filters and search
  useEffect(() => {
    let results = [...internships];
    
    // Apply industry filter
    if (activeFilters.industry !== 'All Industries') {
      results = results.filter(internship => internship.industry === activeFilters.industry);
    }
    
    // Apply duration filter
    if (activeFilters.duration !== 'All Durations') {
      results = results.filter(internship => internship.duration === activeFilters.duration);
    }
    
    // Apply paid/unpaid filter
    if (activeFilters.isPaid !== 'All') {
      const isPaid = activeFilters.isPaid === 'Paid';
      results = results.filter(internship => internship.isPaid === isPaid);
    }
    
    // Apply search term (title or company)
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        internship => 
          internship.title.toLowerCase().includes(term) || 
          internship.company.toLowerCase().includes(term)
      );
    }
    
    setFilteredInternships(results);
  }, [searchTerm, activeFilters]);

  // Handle filter changes
  const handleFilterChange = (filterType: string, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Handle starring/unstarring internships
  const toggleStar = (id: number) => {
    setStarredInternships(prev =>
      prev.includes(id)
        ? prev.filter(starredId => starredId !== id)
        : [...prev, id]
    );
  };

  return (
    <div className={styles.pageContainer}>
      {/* Header/Navigation */}
      <header className={styles.navBar}>
        <div className={styles.navLeft}>
          <div className={styles.logoContainer}>
            <Image src='/logos/GUCInternshipSystemLogo.png' alt="" width={100} height={100} style={{ margin: -13 }} />
          </div>
          <nav className={styles.mainNav}>
            <a href="#" className={styles.navLink}>Find job</a>
            <a href="#" className={styles.navLink}>Messages</a>
            <a href="#" className={styles.navLink}>Hiring</a>
            <a href="#" className={styles.navLink}>Community</a>
            <a href="#" className={styles.navLink}>FAQ</a>
          </nav>
        </div>
        <div className={styles.navRight}>
          <div className={styles.locationDisplay}>
            <span className={styles.locationIcon}>📍</span>
            <span>New York, NY</span>
          </div>
          <div className={styles.userControls}>
            <div className={styles.userAvatar}></div>
            <button className={styles.settingsButton}>⚙️</button>
            <button className={styles.notificationsButton}>🔔</button>
          </div>
        </div>
      </header>

      <div className={styles.contentWrapper}>
        {/* Left Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarContent}>
            <div className={styles.filterSection}>
              <h3 className={styles.filterHeading}>Filters</h3>
              
              {/* Industry Filter */}
              <div className={styles.filterGroup}>
                <h4 className={styles.filterGroupTitle}>Industry</h4>
                {industries.map((industry, index) => (
                  <label key={index} className={styles.filterCheckbox}>
                    <input 
                      type="radio" 
                      name="industry" 
                      checked={activeFilters.industry === industry} 
                      onChange={() => handleFilterChange('industry', industry)}
                    /> 
                    {industry}
                  </label>
                ))}
              </div>

              {/* Duration Filter */}
              <div className={styles.filterGroup}>
                <h4 className={styles.filterGroupTitle}>Duration</h4>
                {durations.map((duration, index) => (
                  <label key={index} className={styles.filterCheckbox}>
                    <input 
                      type="radio" 
                      name="duration" 
                      checked={activeFilters.duration === duration} 
                      onChange={() => handleFilterChange('duration', duration)}
                    /> 
                    {duration}
                  </label>
                ))}
              </div>

              {/* Paid/Unpaid Filter */}
              <div className={styles.filterGroup}>
                <h4 className={styles.filterGroupTitle}>Compensation</h4>
                {paidOptions.map((option, index) => (
                  <label key={index} className={styles.filterCheckbox}>
                    <input 
                      type="radio" 
                      name="isPaid" 
                      checked={activeFilters.isPaid === option} 
                      onChange={() => handleFilterChange('isPaid', option)}
                    /> 
                    {option}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className={styles.mainContent}>
          {/* Search Bar */}
          <div className={styles.searchBarContainer}>
            <div className={styles.searchInputWrapper}>
              <span className={styles.searchIcon}>🔍</span>
              <input 
                type="text" 
                className={styles.searchInput} 
                placeholder="Search by job title or company..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  className={styles.clearSearchButton}
                  onClick={() => setSearchTerm('')}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Job Listings */}
          <div className={styles.jobListings}>
            <div className={styles.listingHeader}>
              <h2 className={styles.listingTitle}>Recommended jobs</h2>
              <span className={styles.jobCount}>{filteredInternships.length}</span>
            </div>

            <div className={styles.cards}>
              {filteredInternships.length > 0 ? (
                filteredInternships.map((internship) => (
                  <div key={internship.id} className={styles.card}>
                    <div className={styles.cardInner} style={{ backgroundColor: getCardBackground(internship.id) }}>
                      <div className={styles.cardDate}>
                        <span>{internship.date}</span>
                        <button 
                          className={starredInternships.includes(internship.id) ? styles.bookmarkActive : styles.bookmark}
                          onClick={() => toggleStar(internship.id)}
                        >
                          {starredInternships.includes(internship.id) ? '⭐' : '☆'}
                        </button>
                      </div>
                      
                      <div className={styles.companyInfo}>
                        <span className={styles.companyName}>{internship.company}</span>
                      </div>
                      
                      <div className={styles.jobTitleContainer}>
                        <h3 className={styles.jobTitle}>{internship.title}</h3>
                        {internship.logo && (
                          <div className={styles.companyLogo}>
                            <Image src={internship.logo} alt={`${internship.company} logo`} width={30} height={30} />
                          </div>
                        )}
                      </div>
                      
                      <div className={styles.jobTags}>
                        <span className={styles.jobTag}>{internship.duration}</span>
                        <span className={styles.jobTag}>{internship.industry}</span>
                        <span className={styles.jobTag}>{internship.isPaid ? 'Paid' : 'Unpaid'}</span>
                      </div>
                    </div>
                    
                    <div className={styles.cardFooter}>
                      <div className={styles.jobMeta}>
                        <div className={styles.salary}>{internship.salary}</div>
                        <div className={styles.location}>{internship.location}</div>
                      </div>
                      <button className={styles.detailsButton}>Details</button>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.noResults}>
                  <div className={styles.noResultsIcon}>🔍</div>
                  <h3>No internships found</h3>
                  <p>Try adjusting your search criteria or filters</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function getCardBackground(id: number): string {
  const colors = [
    '#ffe8f0', '#e8f3ff', '#e8ffe8', '#fff0e8', '#f0e8ff',
    '#e8fff0', '#fff8e8', '#e8f0ff', '#ffe8e8', '#e8ffea',
    '#f0ffe8', '#fff0f0'
  ];
  return colors[id % colors.length];
}