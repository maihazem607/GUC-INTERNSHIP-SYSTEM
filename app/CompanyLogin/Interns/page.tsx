'use client';
import { useState, useEffect } from 'react';
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
import InternsList from "@/components/Companyy/InternsList";
import EvaluationModal from "@/components/Companyy/EvaluationModal";
import EvaluationDetailsModal from "@/components/Companyy/EvaluationDetailsModal";
import { Evaluation as SCADEvaluation } from "@/components/SCAD/EvaluationList";

// Import types
import { Intern, Evaluation } from "@/components/Companyy/types";

// Interns Page Component
const InternsPage = () => {
    // Search states
    const [internSearchTerm, setInternSearchTerm] = useState('');
    
    // Filter states
    const [internFilter, setInternFilter] = useState('all');
    
    // Data states
    const [interns, setInterns] = useState<Intern[]>([]);
    
    // Selection states
    const [selectedIntern, setSelectedIntern] = useState<Intern | null>(null);
    
    // Modal states
    const [showEvaluationForm, setShowEvaluationForm] = useState(false);
    const [isEditingEvaluation, setIsEditingEvaluation] = useState(false); // State for edit mode
    
    // Form states
    const [newEvaluation, setNewEvaluation] = useState<Omit<Evaluation, 'id' | 'evaluationDate'>>({
        internId: '',
        performanceRating: 0,
        skillsRating: 0,
        attitudeRating: 0,
        comments: '',
    });
    
    // Using the unified notification context
    const { 
        showNotification, 
        addNotification,
        unreadCount
    } = useNotification();

    // Clear all filters function
    const handleClearFilters = () => {
        setInternFilter('all');
        setInternSearchTerm('');
    };    // Load interns from localStorage or initialize with mock data
    useEffect(() => {
        // Check if there's data in localStorage
        const storedInterns = localStorage.getItem(STORAGE_KEYS.INTERNS);
        
        if (storedInterns) {
            try {
                // Parse and deserialize dates
                const parsedInterns = deserializeDates(JSON.parse(storedInterns));
                setInterns(parsedInterns);
            } catch (error) {
                console.error('Error loading interns from localStorage:', error);
                // Use mock data as fallback
                setInterns(getDefaultInterns());
            }
        } else {
            // No data in localStorage, use mock data
            setInterns(getDefaultInterns());
        }
    }, []);
    
    // Helper function to get default interns data
    const getDefaultInterns = (): Intern[] => {
        return [
            {
                id: '2',
                name: 'Jane Smith',
                email: 'jane@university.edu',
                university: 'GUC',
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
                university: 'GUC',
                major: 'Computer Science',
                internshipTitle: 'Backend Developer Intern',
                startDate: new Date('2025-06-01'),
                endDate: new Date('2026-08-31'),
                status: 'current',
            },
        ];
    };

    // Calculate counters
    const currentInternsCount = interns.filter(intern => intern.status === 'current').length;

    // Filtering logic
    const filteredInterns = interns.filter(intern => {
        const matchesSearch = intern.name.toLowerCase().includes(internSearchTerm.toLowerCase()) || 
                             intern.internshipTitle.toLowerCase().includes(internSearchTerm.toLowerCase());
        const matchesFilter = internFilter === 'all' || intern.status === internFilter;
        return matchesSearch && matchesFilter;
    });
      // Status change handler
    const handleInternStatusChange = (internId: string, status: Intern['status'], endDate?: Date) => {
        const intern = interns.find(intern => intern.id === internId);
        const updatedInterns = interns.map(intern => 
            intern.id === internId 
                ? {...intern, status, endDate: status === 'completed' ? endDate || new Date() : null}
                : intern
        );
        
        // Update state
        setInterns(updatedInterns);
        
        // Save to localStorage
        localStorage.setItem(STORAGE_KEYS.INTERNS, JSON.stringify(updatedInterns));
        
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
            
            // Use setTimeout for notification
            setTimeout(() => {
                showNotification({
                    message,
                    type
                });
                
                // Also add to bell notifications
                addNotification({
                    title: status === 'current' ? "Intern Status Updated" : "Internship Completed",
                    message,
                    type: 'status-change'
                });
            }, 800);
        }
    };    // This function handles evaluation submission with direct data
    const handleSubmitEvaluationWithData = (evalData: Omit<Evaluation, 'id' | 'evaluationDate'>) => {
        if (!selectedIntern) return;
        
        // Create a new evaluation or preserve the existing ID when editing
        const evaluation: Evaluation = {
            id: isEditingEvaluation && selectedIntern.evaluation 
                ? selectedIntern.evaluation.id 
                : Date.now().toString(),
            evaluationDate: new Date(),
            ...evalData,
        };
        
        // Update interns array with the evaluation
        const updatedInterns = interns.map(intern => 
            intern.id === selectedIntern.id 
                ? {...intern, evaluation} 
                : intern
        );
        
        // Update state
        setInterns(updatedInterns);
        
        // Save to localStorage
        localStorage.setItem(STORAGE_KEYS.INTERNS, JSON.stringify(updatedInterns));
        
        // Close the form and reset form fields
        setShowEvaluationForm(false);
        setIsEditingEvaluation(false); // Reset edit mode
        setNewEvaluation({
            internId: '',
            performanceRating: 0,
            skillsRating: 0,
            attitudeRating: 0,
            comments: '',
        });
        
        // Show success notification with appropriate message
        showNotification({
            message: `Evaluation for ${selectedIntern.name} has been updated successfully.`,
            type: 'success'
        });
    };    const handleSubmitEvaluation = () => {
        if (!selectedIntern) return;
        
        // Create a new evaluation or preserve the existing ID when editing
        const evaluation: Evaluation = {
            id: isEditingEvaluation && selectedIntern.evaluation 
                ? selectedIntern.evaluation.id 
                : Date.now().toString(),
            evaluationDate: new Date(),
            ...newEvaluation,
        };
        
        // Update interns array with the evaluation
        const updatedInterns = interns.map(intern => 
            intern.id === selectedIntern.id 
                ? {...intern, evaluation} 
                : intern
        );
        
        // Update state
        setInterns(updatedInterns);
        
        // Save to localStorage
        localStorage.setItem(STORAGE_KEYS.INTERNS, JSON.stringify(updatedInterns));
          
        // Use setTimeout for closing form and showing notification
        setTimeout(() => {
            // Close the form and reset form fields
            setShowEvaluationForm(false);
            setIsEditingEvaluation(false); // Reset edit mode
            setNewEvaluation({
                internId: '',
                performanceRating: 0,
                skillsRating: 0,
                attitudeRating: 0,
                comments: '',
            });
            
            // Show success notification with appropriate message
            showNotification({
                message: isEditingEvaluation 
                    ? `Evaluation for ${selectedIntern.name} has been updated successfully.`
                    : `Evaluation for ${selectedIntern.name} has been submitted successfully.`,
                type: 'success'
            });
            
            // Add to bell notifications
            addNotification({
                title: isEditingEvaluation ? "Evaluation Updated" : "Evaluation Submitted",
                message: `Evaluation for ${selectedIntern.name} has been ${isEditingEvaluation ? 'updated' : 'submitted'} successfully.`,
                type: 'application'
            });
        }, 800);
    };    // Handler to delete an evaluation
    const handleDeleteEvaluation = () => {
        if (!selectedIntern || !selectedIntern.evaluation) return;
        
        // Update the interns array by removing the evaluation
        const updatedInterns = interns.map(intern => 
            intern.id === selectedIntern.id 
                ? {...intern, evaluation: undefined} 
                : intern
        );
        
        // Update state
        setInterns(updatedInterns);
        
        // Save to localStorage
        localStorage.setItem(STORAGE_KEYS.INTERNS, JSON.stringify(updatedInterns));
            
        // Use setTimeout for closing form and showing notification
        setTimeout(() => {
            // Close the form
            setShowEvaluationForm(false);
            
            // Show success notification
            showNotification({
                message: `Evaluation for ${selectedIntern.name} has been deleted.`,
                type: 'info'
            });
            
            // Add to bell notifications
            addNotification({
                title: "Evaluation Deleted",
                message: `Evaluation for ${selectedIntern.name} has been deleted.`,
                type: 'application'
            });
        }, 800);
    };

    // Prepare filters for sidebar
    const internFilters = [
        {
            title: "Status",
            options: ["All", "Current", "Completed"],
            type: "status",
            value: internFilter === 'all' ? 'All' : internFilter.charAt(0).toUpperCase() + internFilter.slice(1)
        }
    ];

    // Use the imported EvaluationDetailsModal component with EvaluationDetails from SCAD folder
    const renderEvaluationModal = () => {
        if (!showEvaluationForm || !selectedIntern) return null;
        
        // Check if we're viewing or editing an existing evaluation
        if (selectedIntern.evaluation) {
            // Transform company evaluation to the format expected by EvaluationDetailsModal
            const evaluation: SCADEvaluation = {
                id: parseInt(selectedIntern.evaluation.id),
                studentName: selectedIntern.name,
                studentId: parseInt(selectedIntern.id),
                companyName: "Your Company", // Could be replaced with actual company name from context
                major: selectedIntern.major,
                supervisorName: "Supervisor", // Could be replaced with actual supervisor name from context
                internshipStartDate: selectedIntern.startDate.toLocaleDateString(),
                internshipEndDate: selectedIntern.endDate ? selectedIntern.endDate.toLocaleDateString() : "Present",
                evaluationDate: selectedIntern.evaluation.evaluationDate.toLocaleDateString(),
                performanceRating: isEditingEvaluation ? newEvaluation.performanceRating : selectedIntern.evaluation.performanceRating,
                skillsRating: isEditingEvaluation ? newEvaluation.skillsRating : selectedIntern.evaluation.skillsRating,
                attitudeRating: isEditingEvaluation ? newEvaluation.attitudeRating : selectedIntern.evaluation.attitudeRating,
                comments: isEditingEvaluation ? newEvaluation.comments : selectedIntern.evaluation.comments,
                evaluationScore: Math.round((
                    (isEditingEvaluation ? newEvaluation.performanceRating : selectedIntern.evaluation.performanceRating) + 
                    (isEditingEvaluation ? newEvaluation.skillsRating : selectedIntern.evaluation.skillsRating) + 
                    (isEditingEvaluation ? newEvaluation.attitudeRating : selectedIntern.evaluation.attitudeRating)
                ) / 3 * 2), // Convert 5-point scale to 10-point
                status: 'completed' as 'completed',
            };            
            
            // Use EvaluationDetailsModal for both viewing and editing
            return (
                <EvaluationDetailsModal
                    evaluation={evaluation}
                    isEditingEvaluation={isEditingEvaluation}
                    onClose={() => {
                        setShowEvaluationForm(false);
                        setIsEditingEvaluation(false);
                    }}                    
                    onUpdate={(id, performanceRating, skillsRating, attitudeRating, comments) => {
                        if (isEditingEvaluation) {
                            // When update button is clicked in edit mode, save the changes directly
                            const updatedEvaluation = {
                                internId: selectedIntern.id,
                                performanceRating,
                                skillsRating,
                                attitudeRating,
                                comments,
                            };
                            
                            // Update the state first
                            setNewEvaluation(updatedEvaluation);
                            
                            // Then call a modified version of handleSubmitEvaluation with the new values
                            handleSubmitEvaluationWithData(updatedEvaluation);
                        } else {
                            // Switch to edit mode when edit button is clicked
                            setIsEditingEvaluation(true);
                            setNewEvaluation({
                                internId: selectedIntern.id,
                                performanceRating,
                                skillsRating,
                                attitudeRating,
                                comments: comments || selectedIntern.evaluation?.comments || '',
                            });
                        }
                    }}
                    onDelete={handleDeleteEvaluation ? () => handleDeleteEvaluation() : undefined}
                />
            );
        }

        // If creating a new evaluation (intern doesn't have an evaluation yet)
        let modalTitle = `Evaluate ${selectedIntern.name}`;
        
        return (
            <EvaluationModal
                title={modalTitle}
                onClose={() => {
                    setShowEvaluationForm(false);
                    setIsEditingEvaluation(false); // Reset edit mode when closing
                    // Reset evaluation data
                    setNewEvaluation({
                        internId: '',
                        performanceRating: 0,
                        skillsRating: 0,
                        attitudeRating: 0,
                        comments: '',
                    });
                }}
                onSubmit={handleSubmitEvaluation}
                intern={selectedIntern}
                evaluation={newEvaluation}
                setEvaluation={setNewEvaluation}
                onEditMode={() => setIsEditingEvaluation(true)}
                onDelete={handleDeleteEvaluation}
            />
        );
    };    return (
        <div className={styles.pageContainer}>
            <CompanyNavigationMenu />
            
            <div className={styles.contentWrapper}>
                <FilterSidebar 
                    filters={internFilters}
                    onFilterChange={(type: string, value: string) => {
                        // Update the filter with proper capitalization preserved
                        setInternFilter(value.toLowerCase());
                    }}
                    onClearFilters={handleClearFilters}
                />
                  <main className={styles.mainContent}>
                    {/* Search Bar */}
                    <SearchBar
                        searchTerm={internSearchTerm}
                        setSearchTerm={setInternSearchTerm}
                        placeholder="Search by intern name or position..."
                    />
                    
                    <div className={styles.internListings}>
                        <div className={styles.listingHeader}>
                            <h1 className={styles.listingTitle}>Current Interns</h1>
                            <span className={styles.internCount}>
                                {currentInternsCount} active interns
                            </span>
                        </div>
                        {filteredInterns.length > 0 ? (
                            <InternsList 
                                interns={filteredInterns}
                                onStatusChange={handleInternStatusChange}
                                onEvaluate={(intern) => {
                                    setSelectedIntern(intern);
                                    // Reset the editing state
                                    setIsEditingEvaluation(false);
                                    // Set the evaluation form values based on existing evaluation or defaults
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
                        ) : (
                            <div className={styles.noResults}>
                                <div className={styles.noResultsIcon}>👨‍💼</div>
                                <p>No interns found matching your criteria.</p>
                                {(internSearchTerm || internFilter !== 'all') && (
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
                </main>
            </div>
            
            {/* Render custom evaluation modal */}
            {renderEvaluationModal()}
        </div>
    );
};

// Main component export
export default function InternsDashboard() {
    return <InternsPage />;
}