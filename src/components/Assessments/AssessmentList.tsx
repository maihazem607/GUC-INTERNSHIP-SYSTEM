import React from 'react';
import styles from './AssessmentList.module.css';
import AssessmentCard from './AssessmentCard';
import { Assessment } from './types';

interface AssessmentListProps {
    assessments: Assessment[];
    onStartAssessment: (id: number) => void;
    onViewScore: (id: number, score?: number) => void;
    onPostScore: (id: number) => void;
    onSubmitAssessment: (id: number) => void;
    onSaveProgress: (id: number) => void;
}

const AssessmentList: React.FC<AssessmentListProps> = ({
    assessments,
    onStartAssessment,
    onViewScore,
    onPostScore,
    onSubmitAssessment,
    onSaveProgress
}) => {
    return (
        <div className={styles.assessmentListings}>
            <div className={styles.listingHeader}>
                <h2 className={styles.listingTitle}>Online Assessments</h2>
                <span className={styles.assessmentCount}>
                    {assessments.length} assessment{assessments.length !== 1 ? 's' : ''}
                </span>
            </div>

            <div className={styles.cards}>
                {assessments.length > 0 ? (
                    assessments.map(assessment => (
                        <AssessmentCard
                            key={assessment.id}
                            assessment={assessment}
                            onStartAssessment={onStartAssessment}
                            onViewScore={onViewScore}
                            onPostScore={onPostScore}
                            onSubmitAssessment={onSubmitAssessment}
                            onSaveProgress={onSaveProgress}
                        />
                    ))
                ) : (
                    <div className={styles.noResults}>
                        <div className={styles.noResultsIcon}>🔍</div>
                        <h3>No assessments found</h3>
                        <p>Try adjusting your search criteria or filters</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssessmentList; 