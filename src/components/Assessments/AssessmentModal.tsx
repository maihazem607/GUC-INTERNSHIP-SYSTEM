"use client";

import React, { useState, useEffect } from 'react';
import styles from './AssessmentModal.module.css';
import { Assessment } from './types';
import Modal from '@/components/global/Modal';
import Image from 'next/image';
import { useNotificationContext } from '@/contexts/NotificationContext';

interface AssessmentModalProps {
    assessment: Assessment;
    onClose: () => void;
    mode: 'start' | 'continue' | 'view' | 'score';
    onSubmit?: (answers: Record<string, string>) => void;
    onSaveProgress?: () => void;
}

// Create a storage for saved answers by assessment ID
const savedAnswersMap: Record<number, Record<string, string>> = {};

const AssessmentModal: React.FC<AssessmentModalProps> = ({
    assessment,
    onClose,
    mode,
    onSubmit,
    onSaveProgress
}) => {
    const { showNotification } = useNotificationContext();

    // Mock questions for demonstration purposes
    const mockQuestions = [
        {
            id: 'q1',
            question: 'What is the primary benefit of using React hooks?',
            options: [
                'Better performance compared to class components',
                'Ability to use state and other React features in functional components',
                'Automatic code splitting',
                'Direct access to the DOM'
            ]
        },
        {
            id: 'q2',
            question: 'Which of the following is NOT a common HTTP status code?',
            options: [
                '200 OK',
                '404 Not Found',
                '500 Internal Server Error',
                '600 Server Timeout'
            ]
        },
        {
            id: 'q3',
            question: 'What does CSS stand for?',
            options: [
                'Cascading Style Sheets',
                'Creative Style System',
                'Computer Style Sheets',
                'Colorful Style Sheets'
            ]
        },
        {
            id: 'q4',
            question: 'Which JavaScript method is used to add an item to the end of an array?',
            options: [
                'push()',
                'pop()',
                'shift()',
                'unshift()'
            ]
        },
        {
            id: 'q5',
            question: 'What does CORS stand for in web development?',
            options: [
                'Cross-Origin Resource Sharing',
                'Cross-Origin Request Service',
                'Create Origin Resource System',
                'Custom Object Request Syntax'
            ]
        },
        {
            id: 'q6',
            question: 'Which of the following is a NoSQL database?',
            options: [
                'MySQL',
                'PostgreSQL',
                'MongoDB',
                'SQLite'
            ]
        },
        {
            id: 'q7',
            question: 'Which CSS property is used to control the spacing between elements?',
            options: [
                'padding',
                'margin',
                'spacing',
                'gap'
            ]
        }
    ];

    // Initialize answers from saved state if available and in continue mode
    const [answers, setAnswers] = useState<Record<string, string>>(
        mode === 'continue' && savedAnswersMap[assessment.id]
            ? { ...savedAnswersMap[assessment.id] }
            : {}
    );

    const [timeLeft, setTimeLeft] = useState<number>(1800); // 30 minutes in seconds

    // Set up timer effect
    useEffect(() => {
        if (mode === 'start' || mode === 'continue') {
            const timer = setInterval(() => {
                setTimeLeft(prevTime => {
                    if (prevTime <= 1) {
                        clearInterval(timer);
                        // Auto-submit when time runs out
                        handleSubmit();
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [mode]);

    // Function to format time as MM:SS
    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    // Handle answer selection
    const handleAnswerSelect = (questionId: string, option: string) => {
        setAnswers({
            ...answers,
            [questionId]: option
        });
    };

    // Handle form submission
    const handleSubmit = () => {
        if (onSubmit) {
            onSubmit(answers);

            // Show notification for submission
            showNotification({
                message: "Assessment submitted successfully!",
                type: "success"
            });
        }
        // Clear saved answers when submitted
        delete savedAnswersMap[assessment.id];
        onClose();
    };

    // Handle saving progress
    const handleSaveProgress = () => {
        // Store answers in the shared map
        savedAnswersMap[assessment.id] = { ...answers };

        // Call the parent component's save function
        if (onSaveProgress) {
            onSaveProgress();
        }

        // Show notification instead of in-modal message
        showNotification({
            message: "Progress saved successfully!",
            type: "success"
        });
    };

    // Calculate progress
    const progress = Object.keys(answers).length / mockQuestions.length * 100;

    // Actions to show at the bottom of the modal
    const actions = (
        <div className={styles.modalActionButtons}>
            {(mode === 'start' || mode === 'continue') && (
                <>
                    <button
                        className={styles.saveButton}
                        onClick={handleSaveProgress}
                    >
                        Save Progress
                    </button>
                    <button
                        className={styles.submitButton}
                        onClick={handleSubmit}
                    >
                        Submit Assessment
                    </button>
                </>
            )}

            {(mode === 'view' || mode === 'score') && (
                <button
                    className={styles.submitButton}
                    onClick={onClose}
                >
                    Close
                </button>
            )}
        </div>
    );

    return (
        <Modal
            title={
                mode === 'start' ? 'Start Assessment' :
                    mode === 'continue' ? 'Continue Assessment' :
                        mode === 'score' ? 'Assessment Score' : 'Assessment Details'
            }
            onClose={onClose}
            actions={actions}
        >
            <div className={styles.assessmentHeader}>
                {assessment.logo && (
                    <div className={styles.companyLogo}>
                        <Image src={assessment.logo} alt={`${assessment.company} logo`} width={40} height={40} />
                    </div>
                )}
                <div className={styles.assessmentInfo}>
                    <h2 className={styles.assessmentTitle}>{assessment.title}</h2>
                    <p className={styles.companyName}>{assessment.company}</p>
                </div>
            </div>

            {(mode === 'start' || mode === 'continue') && (
                <div className={styles.assessmentContent}>
                    <div className={styles.assessmentStats}>
                        <div className={styles.timer}>
                            Time Remaining: <span className={styles.timeLeft}>{formatTime(timeLeft)}</span>
                        </div>
                        <div className={styles.progressIndicator}>
                            <div className={styles.progressText}>
                                Progress: {Object.keys(answers).length}/{mockQuestions.length} questions answered
                            </div>
                            <div className={styles.progressBarContainer}>
                                <div className={styles.progressBar} style={{ width: `${progress}%` }}></div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.questions}>
                        {mockQuestions.map((q) => (
                            <div key={q.id} className={styles.question}>
                                <h3 className={styles.questionText}>{q.question}</h3>
                                <div className={styles.options}>
                                    {q.options.map((option, index) => (
                                        <label key={index} className={styles.optionLabel}>
                                            <input
                                                type="radio"
                                                name={q.id}
                                                value={option}
                                                checked={answers[q.id] === option}
                                                onChange={() => handleAnswerSelect(q.id, option)}
                                            />
                                            <span className={styles.optionText}>{option}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {mode === 'view' && (
                <div className={styles.viewContent}>
                    <div className={styles.infoSection}>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>Status:</span>
                            <span className={`${styles.infoValue} ${styles[`status${assessment.status.replace(/\s+/g, '')}`]}`}>
                                {assessment.status}
                            </span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>Date:</span>
                            <span className={styles.infoValue}>{assessment.date}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>Time:</span>
                            <span className={styles.infoValue}>{assessment.time}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>Duration:</span>
                            <span className={styles.infoValue}>30 minutes</span>
                        </div>
                    </div>

                    <div className={styles.descriptionSection}>
                        <h3 className={styles.sectionTitle}>Assessment Description</h3>
                        <p className={styles.description}>
                            This assessment evaluates your knowledge and skills in the areas relevant to the position.
                            The test consists of multiple-choice questions and should be completed within the allocated time.
                            You can pause the assessment and continue later if needed.
                        </p>
                    </div>

                    <div className={styles.instructionsSection}>
                        <h3 className={styles.sectionTitle}>Instructions</h3>
                        <ul className={styles.instructionsList}>
                            <li>Answer all questions to the best of your ability</li>
                            <li>You have 30 minutes to complete the assessment</li>
                            <li>Use the "Save Progress" button to save your work</li>
                            <li>Your progress will be saved if you need to pause</li>
                            <li>Once submitted, you cannot retake the assessment</li>
                        </ul>
                    </div>
                </div>
            )}

            {mode === 'score' && assessment.score && (
                <div className={styles.scoreContent}>
                    <div className={styles.scoreDisplay}>
                        <div className={styles.scoreCircle}>
                            <span className={styles.scoreNumber}>{assessment.score}</span>
                            <span className={styles.scorePercentage}>%</span>
                        </div>
                    </div>

                    <div className={styles.scoreDetails}>
                        <h3 className={styles.scoreTitle}>
                            {assessment.score >= 90 ? 'Excellent!' :
                                assessment.score >= 75 ? 'Great job!' :
                                    assessment.score >= 60 ? 'Good effort!' : 'Keep practicing!'}
                        </h3>

                        <p className={styles.scoreDescription}>
                            {assessment.score >= 90 ? 'You demonstrated excellent knowledge in this area. Your performance was outstanding.' :
                                assessment.score >= 75 ? 'You showed a solid understanding of the concepts. There\'s room for some improvement.' :
                                    assessment.score >= 60 ? 'You have a basic grasp of the material. Consider studying more to improve your knowledge.' :
                                        'You need to strengthen your understanding in this area. Consider additional study and practice.'}
                        </p>

                        <div className={styles.scoreBreakdown}>
                            <h4 className={styles.breakdownTitle}>Score Breakdown</h4>
                            <div className={styles.breakdownItem}>
                                <span className={styles.categoryName}>Technical Knowledge</span>
                                <div className={styles.progressBar}>
                                    <div className={styles.progress} style={{ width: `${Math.round(assessment.score * 0.9)}%` }}></div>
                                </div>
                                <span className={styles.categoryScore}>{Math.round(assessment.score * 0.9)}%</span>
                            </div>
                            <div className={styles.breakdownItem}>
                                <span className={styles.categoryName}>Problem Solving</span>
                                <div className={styles.progressBar}>
                                    <div className={styles.progress} style={{ width: `${Math.round(assessment.score * 1.1)}%` }}></div>
                                </div>
                                <span className={styles.categoryScore}>{Math.min(100, Math.round(assessment.score * 1.1))}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default AssessmentModal;
