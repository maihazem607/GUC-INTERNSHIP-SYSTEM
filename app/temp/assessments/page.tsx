"use client";
import React, { useState, useEffect } from 'react';
import styles from "./page.module.css";

// Import modular components
import { Award, BookOpen, CheckSquare, Filter, Grid, InfoIcon, LayoutGrid, Search, SortAsc, Briefcase, Calendar, Building } from 'lucide-react';
import NavigationMenu, { MenuItem } from "@/components/global/NavigationMenu";
import FilterSidebar from "@/components/global/FilterSidebar";
import SearchBar from "@/components/global/SearchBar";
import NotificationSystem from "@/components/global/NotificationSystem";
import { Assessment, FilterOptions } from "@/components/Assessments/types";
import AssessmentCard from '@/components/Assessments/AssessmentCard';
import AssessmentDetailsModal from '@/components/Assessments/AssessmentDetailsModal';

// Mock assessment data
const mockAssessments: Assessment[] = [
  {
    id: 1,
    title: "JavaScript Essentials",
    description: "Test your understanding of JavaScript fundamentals including variables, functions, closures, and ES6+ features.",
    category: "Programming",
    difficulty: "Intermediate",
    duration: "45",
    questionCount: 20,
    skillsCovered: ["JavaScript", "ES6", "Functions", "Closures", "Asynchronous Programming"],
    company: "Google",
    companyLogo: "/logos/google.png",
    isCompleted: true,
    score: 17,
    totalPossibleScore: 20,
    isSharedOnProfile: true
  },
  {
    id: 3,
    title: "Data Structures & Algorithms",
    description: "Test your knowledge of common data structures and algorithms including arrays, linked lists, trees, and algorithmic complexity.",
    category: "Computer Science",
    difficulty: "Advanced",
    duration: "75",
    questionCount: 30,
    skillsCovered: ["Data Structures", "Algorithms", "Time Complexity", "Space Complexity", "Problem Solving"],
    company: "Microsoft",
    companyLogo: "/logos/microsoft.png",
    isCompleted: true,
    score: 22,
    totalPossibleScore: 30,
    isSharedOnProfile: false
  },
  {
    id: 2,
    title: "React Development",
    description: "Assessment covering React core concepts, hooks, state management, and best practices for building modern web applications.",
    category: "Web Development",
    difficulty: "Advanced",
    duration: "60",
    questionCount: 25,
    skillsCovered: ["React", "Hooks", "State Management", "Component Architecture", "React Router"],
    company: "Facebook",
    companyLogo: "/logos/facebook.png"
  },
  {
    id: 4,
    title: "Database Management",
    description: "Comprehensive assessment on database concepts including SQL queries, database design, normalization, and transaction management.",
    category: "Databases",
    difficulty: "Intermediate",
    duration: "50",
    questionCount: 25,
    company: "Tesla",
    companyLogo: "/logos/tesla.png",
    skillsCovered: ["SQL", "Database Design", "Normalization", "Indexing", "Transactions"]
  },
  {
    id: 5,
    title: "DevOps & CI/CD",
    description: "Test your knowledge of DevOps practices, continuous integration/deployment, containerization, and cloud infrastructure.",
    category: "DevOps",
    difficulty: "Advanced",
    duration: "60",
    questionCount: 25,
    skillsCovered: ["Docker", "Kubernetes", "CI/CD", "Jenkins", "Cloud Infrastructure"],
    company: "Amazon",
    companyLogo: "/logos/amazon.png"
  },
  {
    id: 6,
    title: "Python Programming",
    description: "Assessment covering Python syntax, data structures, object-oriented programming, and common libraries.",
    category: "Programming",
    difficulty: "Beginner",
    duration: "40",
    questionCount: 20,
    skillsCovered: ["Python", "Data Structures", "OOP", "Libraries", "Best Practices"],
    company: "Netflix",
    companyLogo: "/logos/netflix.png",
    isCompleted: true,
    score: 18,
    totalPossibleScore: 20,
    isSharedOnProfile: true
  },
  {
    id: 7,
    title: "UI/UX Principles",
    description: "Test your understanding of user interface design principles, user experience best practices, and accessibility standards.",
    category: "Design",
    difficulty: "Intermediate",
    duration: "45",
    questionCount: 20,
    skillsCovered: ["UI Design", "UX Principles", "Accessibility", "Design Systems", "User Research"],
    company: "Airbnb",
    companyLogo: "/logos/airbnb.png"
  },
  {
    id: 8,
    title: "Cloud Architecture",
    description: "Assessment on cloud architecture principles, services, security best practices, and scalable infrastructure design.",
    category: "Cloud Computing",
    difficulty: "Advanced",
    duration: "60",
    questionCount: 25,
    skillsCovered: ["AWS", "Azure", "GCP", "Serverless", "Microservices", "Cloud Security"],
    company: "IBM",
    companyLogo: "/logos/ibm.png"
  },
  {
    id: 9,
    title: "Mobile App Development",
    description: "Comprehensive assessment on mobile app development principles, frameworks, and best practices for iOS and Android.",
    category: "Mobile Development",
    difficulty: "Intermediate",
    duration: "50",
    questionCount: 22,
    skillsCovered: ["React Native", "Flutter", "iOS", "Android", "Mobile UX"],
    company: "Apple",
    companyLogo: "/logos/apple.png"
  },
  {
    id: 10,
    title: "Software Testing & QA",
    description: "Test your knowledge of software testing methodologies, quality assurance processes, and test automation.",
    category: "Quality Assurance",
    difficulty: "Intermediate",
    duration: "45",
    questionCount: 20,
    company: "Spotify",
    companyLogo: "/logos/spotify.png",
    skillsCovered: ["Unit Testing", "Integration Testing", "Manual Testing", "Test Automation", "QA Processes"]
  }
];

export default function AssessmentsPage() {
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({
    category: 'All',
    difficulty: 'All',
    completion: 'All'
  });
  const [assessments, setAssessments] = useState<Assessment[]>(mockAssessments);
  const [filteredAssessments, setFilteredAssessments] = useState<Assessment[]>(mockAssessments);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [sortOption, setSortOption] = useState('newest');

  // Prepare navigation menu items
  const navigationItems: MenuItem[] = [
    { id: 'internships', label: 'Internships', href: '/temp/internships', icon: <Briefcase size={18} /> },
    { id: 'appointments', label: 'Appointments', href: '/temp/AppointmentsStudent', icon: <Calendar size={18} /> },
    { id: 'companies', label: 'Companies', href: '/temp/companies', icon: <Building size={18} /> },
    { id: 'assessments', label: 'Assessments', href: '/temp/assessments', icon: <CheckSquare size={18} /> },
    { id: 'workshops', label: 'Workshops', href: '/temp/workshops', icon: <BookOpen size={18} /> },
  ];

  // Collect unique values for filters
  const categoryOptions = ['All', ...Array.from(new Set(assessments.map(a => a.category)))];
  const difficultyOptions = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const completionOptions = ['All', 'Completed', 'Not Completed'];

  // Filter options for sidebar
  const filterOptions = [
    {
      title: 'Difficulty Level',
      options: difficultyOptions,
      type: 'difficulty',
      value: activeFilters.difficulty,
      counts: difficultyOptions.reduce((acc, difficulty) => ({
        ...acc,
        [difficulty]: difficulty === 'All' 
          ? assessments.length
          : assessments.filter(a => a.difficulty === difficulty).length
      }), {} as Record<string, number>)
    },
    {
      title: 'Completion Status',
      options: completionOptions,
      type: 'completion',
      value: activeFilters.completion,
      counts: completionOptions.reduce((acc, status) => ({
        ...acc,
        [status]: status === 'All' 
          ? assessments.length
          : status === 'Completed' 
            ? assessments.filter(a => a.isCompleted).length 
            : assessments.filter(a => !a.isCompleted).length
      }), {} as Record<string, number>)
    },
    {
      title: 'Categories',
      options: categoryOptions,
      type: 'category',
      value: activeFilters.category,
      counts: categoryOptions.reduce((acc, category) => ({
        ...acc,
        [category]: category === 'All' 
          ? assessments.length
          : assessments.filter(a => a.category === category).length
      }), {} as Record<string, number>)
    }
  ];

  // Apply filters and search
  useEffect(() => {
    let filtered = [...assessments];

    // Apply search term
    if (searchTerm) {
      filtered = filtered.filter(
        assessment => 
          assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          assessment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          assessment.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          assessment.skillsCovered.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply category filter
    if (activeFilters.category !== 'All') {
      filtered = filtered.filter(assessment => assessment.category === activeFilters.category);
    }

    // Apply difficulty filter
    if (activeFilters.difficulty !== 'All') {
      filtered = filtered.filter(assessment => assessment.difficulty === activeFilters.difficulty);
    }

    // Apply completion status filter
    if (activeFilters.completion !== 'All') {
      filtered = filtered.filter(assessment => 
        activeFilters.completion === 'Completed' ? assessment.isCompleted : !assessment.isCompleted
      );
    }

    // Apply sorting
    switch (sortOption) {
      case 'newest':
        // In a real app, would sort by date
        break;
      case 'oldest':
        // In a real app, would sort by date
        filtered = [...filtered].reverse();
        break;
      case 'difficulty-asc':
        filtered = [...filtered].sort((a, b) => {
          const difficultyOrder = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        });
        break;
      case 'difficulty-desc':
        filtered = [...filtered].sort((a, b) => {
          const difficultyOrder = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3 };
          return difficultyOrder[b.difficulty] - difficultyOrder[a.difficulty];
        });
        break;
      case 'questions-asc':
        filtered = [...filtered].sort((a, b) => a.questionCount - b.questionCount);
        break;
      case 'questions-desc':
        filtered = [...filtered].sort((a, b) => b.questionCount - a.questionCount);
        break;
      default:
        break;
    }

    setFilteredAssessments(filtered);
  }, [searchTerm, activeFilters, assessments, sortOption]);

  // Handle filter changes
  const handleFilterChange = (filterType: string, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Clear all filters
  const handleClearFilters = () => {
    setActiveFilters({
      category: 'All',
      difficulty: 'All',
      completion: 'All'
    });
    setSearchTerm('');
    setSortOption('newest');
  };

  // Handle completed assessment
  const handleCompleteAssessment = (assessmentId: number, score: number, totalScore: number) => {
    const updatedAssessments = assessments.map(assessment => {
      if (assessment.id === assessmentId) {
        return {
          ...assessment,
          isCompleted: true,
          score,
          totalPossibleScore: totalScore
        };
      }
      return assessment;
    });

    setAssessments(updatedAssessments); 
};

  return (
    <div className={styles.pageContainer}>
      <NavigationMenu
        items={navigationItems}
        activeItemId="assessments"
      />
      
      <div className={styles.contentWrapper}>
        <FilterSidebar
          filters={filterOptions}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        <div className={styles.mainContent}>
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder="Search assessments by title, skills, or category..."
          />

          <div className={styles.assessmentListings}>            <div className={styles.listingHeader}>
              <h2 className={styles.listingTitle}>Online Assessments</h2>
              <div className={styles.headerControls}>
                <div className={styles.filterControls}>
                  <select 
                    className={styles.sortSelect}
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="difficulty-asc">Difficulty: Low to High</option>
                    <option value="difficulty-desc">Difficulty: High to Low</option>
                    <option value="questions-asc">Questions: Low to High</option>
                    <option value="questions-desc">Questions: High to Low</option>
                  </select>
                </div>
                <div className={styles.assessmentCount}>
                  {filteredAssessments.length} {filteredAssessments.length === 1 ? 'Assessment' : 'Assessments'}
                </div>
              </div>
            </div>

            {filteredAssessments.length > 0 ? (
              <div className={styles.grid}>
                {filteredAssessments.map((assessment) => (
                  <AssessmentCard
                    key={assessment.id}
                    assessment={assessment}
                    onClick={() => setSelectedAssessment(assessment)}
                  />
                ))}
              </div>
            ) : (
              <div className={styles.noResults}>
                <Search size={48} className={styles.noResultsIcon} />
                <p>No assessments found matching your criteria.</p>
                <p>Try adjusting your filters or search terms.</p>
                <button 
                  className={styles.shareProfileButton} 
                  onClick={handleClearFilters} 
                  style={{ marginTop: '20px' }}
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedAssessment && (
        <AssessmentDetailsModal
          assessment={selectedAssessment}
          onClose={() => setSelectedAssessment(null)}
          onComplete={(score, totalScore) => {
            handleCompleteAssessment(selectedAssessment.id, score, totalScore);
          }}
        />
      )}      
    </div>
  );
}