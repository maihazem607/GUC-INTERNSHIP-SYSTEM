"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './AssessmentCard.module.css';
import { Assessment } from './types';
import AssessmentModal from './AssessmentModal';
import { useNotificationContext } from '@/contexts/NotificationContext';

interface AssessmentCardProps {
    assessment: Assessment;
    onStartAssessment: (id: number) => void;
    onViewScore: (id: number, score?: number) => void;
    onPostScore: (id: number) => void;
    onSubmitAssessment: (id: number) => void;
    onSaveProgress: (id: number) => void;
}

const getCardBackground = (id: number): string => {
    const colors = [
        '#ffe8f0', '#e8f3ff', '#e8ffe8', '#fff0e8', '#f0e8ff',
        '#e8fff0', '#fff8e8', '#e8f0ff', '#ffe8e8', '#e8ffea',
        '#f0ffe8', '#fff0f0'
    ];
    return colors[id % colors.length];
};

const AssessmentCard: React.FC<AssessmentCardProps> = ({
    assessment,
    onStartAssessment,
    onViewScore,
    onPostScore,
    onSubmitAssessment,
    onSaveProgress
}) => {
    const { showNotification } = useNotificationContext();
    const cardBackground = getCardBackground(assessment.id);

    // State to manage modals
    const [showViewModal, setShowViewModal] = useState(false);
    const [showStartModal, setShowStartModal] = useState(false);
    const [showContinueModal, setShowContinueModal] = useState(false);
    const [showScoreModal, setShowScoreModal] = useState(false);

    // Handle start assessment button click
    const handleStartClick = () => {
        setShowStartModal(true);
        onStartAssessment(assessment.id);
    };

    // Handle continue assessment button click
    const handleContinueClick = () => {
        setShowContinueModal(true);
        onStartAssessment(assessment.id);
    };

    // Handle view score button click
    const handleViewScoreClick = () => {
        setShowScoreModal(true);
        onViewScore(assessment.id, assessment.score);
    };

    // Handle post score button click
    const handlePostScoreClick = () => {
        onPostScore(assessment.id);

        // Show notification for post score action
        showNotification({
            message: assessment.posted
                ? `Score removed from profile`
                : `Score for "${assessment.title}" posted to your profile`,
            type: "success"
        });
    };

    // Handle submit test answers
    const handleSubmitTest = (answers: Record<string, string>) => {
        console.log('Submitted answers:', answers);

        // Update assessment status to completed and generate score
        onSubmitAssessment(assessment.id);

        // Close the modal
        setShowStartModal(false);
        setShowContinueModal(false);
    };

    // Handle saving progress
    const handleSaveProgress = () => {
        console.log('Saving progress for assessment ID:', assessment.id);
        onSaveProgress(assessment.id);

        // We no longer close the modal after saving progress to allow the user to continue
    };

    return (
        <>
            <div className={styles.card}>
                <div className={styles.cardInner} style={{ backgroundColor: cardBackground }}>
                    <div className={styles.cardDate}>
                        <span>{assessment.date}</span>
                        {assessment.status === 'In Progress' && (
                            <div className={styles.liveIndicator}>ACTIVE</div>
                        )}
                    </div>

                    <div className={styles.hostInfo}>
                        <span className={styles.hostName}>{assessment.company}</span>
                    </div>

                    <div className={styles.assessmentTitleContainer}>
                        <h3
                            className={styles.assessmentTitle}
                            onClick={() => setShowViewModal(true)}
                        >
                            {assessment.title}
                        </h3>
                        {assessment.logo && (
                            <div className={styles.hostLogo}>
                                <Image src={assessment.logo} alt={`${assessment.company} logo`} width={30} height={30} />
                            </div>
                        )}
                    </div>

                    <div className={styles.assessmentTags}>
                        <span className={styles.assessmentTag}>{assessment.status}</span>
                        {assessment.score && (
                            <span className={styles.assessmentTag}>Score: {assessment.score}%</span>
                        )}
                    </div>
                </div>

                <div className={styles.cardFooter}>
                    <div className={styles.assessmentMeta}>
                        <div className={styles.time}>{assessment.time}</div>
                    </div>

                    {assessment.status === 'Available' && (
                        <button
                            className={styles.detailsButton}
                            onClick={handleStartClick}
                        >
                            Start
                        </button>
                    )}

                    {assessment.status === 'In Progress' && (
                        <button
                            className={styles.detailsButton}
                            onClick={handleContinueClick}
                        >
                            Continue
                        </button>
                    )}

                    {assessment.status === 'Completed' && assessment.score && (
                        <div className={styles.buttonsContainer}>
                            <button
                                className={styles.detailsButton}
                                onClick={handleViewScoreClick}
                            >
                                View Score
                            </button>
                            <button
                                className={`${styles.postButton} ${assessment.posted ? styles.postedButton : ''}`}
                                onClick={handlePostScoreClick}
                            >
                                {assessment.posted ? 'Posted' : 'Post Score'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* View Assessment Modal */}
            {showViewModal && (
                <AssessmentModal
                    assessment={assessment}
                    mode="view"
                    onClose={() => setShowViewModal(false)}
                />
            )}

            {/* Start Assessment Modal */}
            {showStartModal && (
                <AssessmentModal
                    assessment={assessment}
                    mode="start"
                    onClose={() => setShowStartModal(false)}
                    onSubmit={handleSubmitTest}
                    onSaveProgress={() => handleSaveProgress()}
                />
            )}

            {/* Continue Assessment Modal */}
            {showContinueModal && (
                <AssessmentModal
                    assessment={assessment}
                    mode="continue"
                    onClose={() => setShowContinueModal(false)}
                    onSubmit={handleSubmitTest}
                    onSaveProgress={() => handleSaveProgress()}
                />
            )}

            {/* Score Modal */}
            {showScoreModal && (
                <AssessmentModal
                    assessment={assessment}
                    mode="score"
                    onClose={() => setShowScoreModal(false)}
                />
            )}
        </>
    );
};

export default AssessmentCard; 