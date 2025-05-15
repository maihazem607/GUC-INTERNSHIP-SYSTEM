"use client";
import React, { useState, useEffect } from 'react';
import styles from './AssessmentPage.module.css';

// Import modular components
import ProStudentNavigationMenu from '../Navigation/ProStudentNavigationMenu';
import FilterSidebar from "@/components/global/FilterSidebar";
import SearchBar from "@/components/global/SearchBar";
import AssessmentList from "@/components/Assessments/AssessmentList";
import AssessmentModal from "@/components/Assessments/AssessmentModal";
import { Assessment } from "@/components/Assessments/types";
import { mockAssessments } from "@/components/Assessments/mockData";
import { useNotificationContext } from "@/contexts/NotificationContext";

export default function AssessmentsPage() {
  const { showNotification } = useNotificationContext();
  const [assessments, setAssessments] = useState<Assessment[]>(mockAssessments);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    status: 'All'
  });
  const [filteredAssessments, setFilteredAssessments] = useState<Assessment[]>(assessments);

  // Filter options
  const statusOptions = ['All', 'Available', 'In Progress', 'Completed'];

  // Format filters for the global FilterSidebar component
  const formattedFilters = [
    {
      title: "Status",
      options: statusOptions,
      type: "status",
      value: activeFilters.status
    }
  ];

  // Apply filters and search
  useEffect(() => {
    let results = [...assessments];

    // Apply status filter
    if (activeFilters.status !== 'All') {
      results = results.filter(assessment => assessment.status === activeFilters.status);
    }

    // Apply search
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        assessment =>
          assessment.title.toLowerCase().includes(term) ||
          assessment.company.toLowerCase().includes(term)
      );
    }

    setFilteredAssessments(results);
  }, [searchTerm, activeFilters, assessments]);

  // Handle filter changes
  const handleFilterChange = (filterType: string, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Handle starting or continuing an assessment
  const handleStartAssessment = (id: number) => {
    console.log(`Starting assessment ID: ${id}`);

    // Get the assessment
    const assessment = assessments.find(a => a.id === id);
    if (!assessment) return;

    // Only show notification if status is changing from Available to In Progress
    if (assessment.status === 'Available') {
      // Update assessment status to "In Progress"
      setAssessments(assessments.map(assessment =>
        assessment.id === id
          ? { ...assessment, status: 'In Progress' }
          : assessment
      ));

      showNotification({
        message: `Started assessment: ${assessment.title}`,
        type: "info"
      });
    }
  };

  // Handle viewing the score
  const handleViewScore = (id: number, score?: number) => {
    if (score) {
      console.log(`Viewing score for assessment ID: ${id} - Score: ${score}%`);
    } else {
      console.log(`No score available for Assessment ID: ${id}`);
    }
  };

  // Handle posting the score to profile
  const handlePostScore = (id: number) => {
    const assessment = assessments.find(a => a.id === id);
    if (!assessment) return;

    // Toggle posted status
    setAssessments(assessments.map(assessment =>
      assessment.id === id ? { ...assessment, posted: !assessment.posted } : assessment
    ));
  };

  // Handle submitting an assessment
  const handleSubmitAssessment = (id: number) => {
    // Generate a random score between 60 and 100
    const randomScore = Math.floor(Math.random() * 41) + 60;

    // Get the assessment
    const assessment = assessments.find(a => a.id === id);
    if (!assessment) return;

    // Update assessment status to "Completed" and add the score
    setAssessments(assessments.map(assessment =>
      assessment.id === id
        ? { ...assessment, status: 'Completed', score: randomScore }
        : assessment
    ));

    console.log(`Assessment ID: ${id} completed with score: ${randomScore}%`);
  };

  // Handle saving progress
  const handleSaveProgress = (id: number) => {
    // In a real app, you would save the actual progress to a database
    console.log(`Progress saved for assessment ID: ${id}`);

    // Get the assessment
    const assessment = assessments.find(a => a.id === id);
    if (!assessment) return;

    // Ensure the assessment status stays as "In Progress"
    setAssessments(assessments.map(assessment =>
      assessment.id === id && assessment.status === 'Available'
        ? { ...assessment, status: 'In Progress' }
        : assessment
    ));
  };

  return (
    <div className={styles.pageContainer}>
      {/* Global Navigation for Pro Student */}
      <ProStudentNavigationMenu />

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
            placeholder="Search assessments..."
          />

          {/* Assessment Listings */}
          <AssessmentList
            assessments={filteredAssessments}
            onStartAssessment={handleStartAssessment}
            onViewScore={handleViewScore}
            onPostScore={handlePostScore}
            onSubmitAssessment={handleSubmitAssessment}
            onSaveProgress={handleSaveProgress}
          />
        </main>
      </div>
    </div>
  );
}

