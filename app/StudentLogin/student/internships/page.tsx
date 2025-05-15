"use client";
import styles from "./page.module.css";
import React, { useState, useEffect } from 'react';

// Import modular components
import Navigation from "@/components/global/Navigation";
import FilterSidebar from "@/components/global/FilterSidebar";
import SearchBar from "@/components/global/SearchBar";
import InternshipCard from "@/components/internships/InternshipCard";
import InternshipDetailsModal from "@/components/internships/InternshipDetailsModal";
import InternshipHelpPopup from "@/components/internships/InternshipHelpPopup";
import NotificationSystem, { useNotification } from "@/components/global/NotificationSystemAdapter";
import { Internship, FilterOptions } from "@/components/internships/types";

// Internship data (would typically come from an API)
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
    logo: '/logos/amazon.png',
    description: `Join Amazon's design team to create world-class user experiences. You'll work on high-impact projects and collaborate with product managers and engineers to deliver intuitive interfaces for millions of customers.`
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
    logo: '/logos/google.png',
    description: `Google is looking for a Junior UI/UX Designer to join their team. You will work on exciting projects that impact millions of users worldwide.`
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
    logo: '/logos/dribbble.png',
    description: `Dribbble is seeking a Senior Motion Designer to create stunning animations and motion graphics for their platform.`
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
    logo: '/logos/twitter.png',
    description: `Twitter is hiring a UX Designer to improve user experience across their platform. Collaborate with cross-functional teams to deliver impactful designs.`
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
    logo: '/logos/airbnb.png',
    description: `Airbnb is looking for a Graphic Designer to create visually appealing designs for their marketing campaigns.`
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
    logo: '/logos/apple.png',
    description: `Apple is seeking a Graphic Designer to join their creative team. Work on innovative projects that define the future of technology.`
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
    logo: '/logos/google.png',
    description: `Google is hiring a Senior Data Scientist to analyze complex datasets and provide actionable insights for their products.`
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
    logo: '/logos/microsoft.png',
    description: `Microsoft is looking for a Software Engineer to develop cutting-edge software solutions for their clients.`
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
    logo: '/logos/amazon.png',
    description: `AWS is seeking a Middle DevOps Engineer to optimize their cloud infrastructure and improve system reliability.`
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
    logo: '/logos/ibm.png',
    description: `IBM is hiring a Cybersecurity Analyst to protect their systems and data from cyber threats.`
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
    logo: '/logos/salesforce.png',
    description: `Salesforce is looking for a Cloud Solutions Architect to design and implement cloud-based solutions for their clients.`
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
    logo: '/logos/facebook.png',
    description: `Facebook is hiring a Senior Full Stack Developer to build scalable web applications for their platform.`
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
    logo: '/logos/adobe.png',
    description: `Adobe is offering a UI/UX Design Internship for students to gain hands-on experience in designing user interfaces.`
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
    logo: '/logos/spotify.png',
    description: `Spotify is hiring a Music Data Analyst to analyze music trends and provide insights for their platform.`
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
    logo: '/logos/netflix.png',
    description: `Netflix is offering a Content Marketing Internship for students to learn about marketing strategies in the entertainment industry.`
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
    logo: '/logos/tesla.png',
    description: `Tesla is seeking an engineering intern to join our innovative team. You'll work on cutting-edge electric vehicle technology and sustainable energy solutions alongside world-class engineers.`
  }
];

export default function InternshipListPage() {  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({
    industry: 'All',
    duration: 'All',
    isPaid: 'All'
  });
  const [filteredInternships, setFilteredInternships] = useState<Internship[]>(internships);
  const [starredInternships, setStarredInternships] = useState<number[]>([]);
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  const [showHelpPopup, setShowHelpPopup] = useState(true);
  
  // Add notification system at page level
  const { notification, visible, showNotification, hideNotification, addNotification } = useNotification();

  // Filter options
  const industries = ['All', 'Technology', 'Finance', 'Marketing', 'Design', 'Healthcare'];
  const durations = ['All', '2-3 months', '3-6 months', '6+ months'];
  const paidOptions = ['All', 'Paid', 'Unpaid'];
  
  // Format filters for the global FilterSidebar component
  const formattedFilters = [
    {
      title: "Industry",
      options: industries,
      type: "industry",
      value: activeFilters.industry || 'All'
    },
    {
      title: "Duration",
      options: durations,
      type: "duration",
      value: activeFilters.duration || 'All'
    },
    {
      title: "Compensation",
      options: paidOptions,
      type: "isPaid",
      value: activeFilters.isPaid || 'All'
    }
  ];

  // Apply filters and search
  useEffect(() => {
    let results = [...internships];
    
    // Apply industry filter
    if (activeFilters.industry !== 'All') {
      results = results.filter(internship => internship.industry === activeFilters.industry);
    }
    
    // Apply duration filter
    if (activeFilters.duration !== 'All') {
      results = results.filter(internship => {
        // Extract the duration value (number) from the string
        const durationValue = parseInt(internship.duration.split(' ')[0]);
        
        // Match based on the selected duration range
        switch(activeFilters.duration) {
          case '2-3 months':
            return durationValue >= 2 && durationValue <= 3;
          case '3-6 months':
            return durationValue >= 3 && durationValue <= 6;
          case '6+ months':
            return durationValue >= 6;
          default:
            return true;
        }
      });
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

  // Handle opening the details modal
  const handleViewDetails = (internship: Internship) => {
    setSelectedInternship(internship);
  };

  // Handle closing the details modal
  const handleCloseModal = () => {
    setSelectedInternship(null);
  };
  
  // Handle applying for an internship
  const handleApply = async (application: {
    internshipId: number;
    documents: File[];
    additionalNotes?: string;
  }) => {
    // This would typically be an API call
    const appliedInternship = internships.find(intern => intern.id === application.internshipId);
    if (appliedInternship) {
      console.log(`Applied for internship: ${appliedInternship.title} at ${appliedInternship.company}`);
      console.log(`Submitted ${application.documents.length} documents`);
      if (application.additionalNotes) {
        console.log(`Additional notes: ${application.additionalNotes}`);
      }
        // Use setTimeout for notification and closing the modal
      setTimeout(() => {
        // Show success notification at the page level
        showNotification({
          message: 'Application submitted successfully!',
          type: 'success'
        });
        
        // Add to bell notifications
        addNotification({
          title: "Application Submitted",
          message: `Your application for ${appliedInternship.title} at ${appliedInternship.company} has been submitted.`,
          type: 'application'
        });

        // Close the modal after successful submission
        setSelectedInternship(null);
      }, 800);
    }
    
    return new Promise<void>(resolve => setTimeout(resolve, 1000));
  };

  return (
    <div className={styles.pageContainer}>
      {/* Header/Navigation */}
      <Navigation title="GUC Internship Portal" />

      <div className={styles.contentWrapper}>
        {/* Left Sidebar with Filters */}
        <FilterSidebar 
          filters={formattedFilters}
          onFilterChange={handleFilterChange}
        />

        {/* Main Content */}
        <main className={styles.mainContent}>
          {/* Search Bar */}
          <SearchBar 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
            placeholder="Search by job title or company..."
          />

          {/* Internship Listings */}
          <div className={styles.internshipListings}>
            <div className={styles.listingHeader}>
              <h2 className={styles.listingTitle}>Recommended jobs</h2>
              <span className={styles.internshipCount}>
                {filteredInternships.length} Internship{filteredInternships.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className={styles.cards}>
              {filteredInternships.length > 0 ? (
                filteredInternships.map((internship) => (
                  <InternshipCard
                    key={internship.id}
                    internship={internship}
                    isStarred={starredInternships.includes(internship.id)}
                    onToggleStar={toggleStar}
                    onViewDetails={handleViewDetails}
                  />
                ))
              ) : (
                <div className={styles.noResults}>
                  <img 
                    src="assets/images/icons/search.png" 
                    alt="Search Icon" 
                    className={styles.searchIcon} 
                  /> 
                  <h3>No internships found</h3>
                  <p>Try adjusting your search criteria or filters</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Details Modal */}
      {selectedInternship && (
        <InternshipDetailsModal
          internship={selectedInternship}
          onClose={handleCloseModal}
          onApply={handleApply}
        />
      )}
      {/* Help popup for internship requirements */}
      {showHelpPopup && (
        <InternshipHelpPopup onClose={() => setShowHelpPopup(false)} />
      )}
    </div>
  );
}
 