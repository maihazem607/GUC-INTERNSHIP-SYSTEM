import React, { useState, useEffect } from 'react';
import styles from './AssessmentDetailsModal.module.css';
import { Clock, Calendar, BarChart2, Award, Share2, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Assessment, Question, Result } from './types';

interface AssessmentDetailsModalProps {
  assessment: Assessment;
  onClose: () => void;
  onComplete: (score: number, totalScore: number) => void;
}

const AssessmentDetailsModal: React.FC<AssessmentDetailsModalProps> = ({
  assessment,
  onClose,
  onComplete
}) => {
  const [currentView, setCurrentView] = useState<'details' | 'questions' | 'results'>(
    assessment.isCompleted ? 'results' : 'details'
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [timeRemaining, setTimeRemaining] = useState<number>(parseInt(assessment.duration) * 60);
  const [isAssessmentShared, setIsAssessmentShared] = useState<boolean>(assessment.isSharedOnProfile || false);
  const [assessmentResult, setAssessmentResult] = useState<Result | null>(null);

  // Mock questions for the assessment
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    // In a real application, this would be an API call to get the questions
    if (currentView === 'questions') {
      // Generate mock questions based on the assessment's questionCount
      const mockQuestions: Question[] = Array.from({ length: assessment.questionCount }).map((_, index) => ({
        id: index + 1,
        text: `Question ${index + 1}: What is the correct approach for ${getRandomTopic()} in ${assessment.category}?`,
        options: [
          { id: `${index}_a`, text: `Option A: ${getRandomAnswer()}` },
          { id: `${index}_b`, text: `Option B: ${getRandomAnswer()}` },
          { id: `${index}_c`, text: `Option C: ${getRandomAnswer()}` },
          { id: `${index}_d`, text: `Option D: ${getRandomAnswer()}` },
        ],
        correctOptionId: `${index}_${getRandomOptionLetter()}`
      }));
      
      setQuestions(mockQuestions);
    }
  }, [currentView, assessment]);

  // Timer for the assessment
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (currentView === 'questions' && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && currentView === 'questions') {
      // Auto-submit when time runs out
      handleSubmitAssessment();
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [currentView, timeRemaining]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleStartAssessment = () => {
    setCurrentView('questions');
  };

  const handleSelectAnswer = (questionId: number, optionId: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: optionId
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitAssessment = () => {
    // Calculate score
    let correctAnswers = 0;
    
    questions.forEach((question) => {
      if (selectedAnswers[question.id] === question.correctOptionId) {
        correctAnswers++;
      }
    });

    const score = correctAnswers;
    const totalPossibleScore = questions.length;
    const timeTaken = `${parseInt(assessment.duration) - Math.floor(timeRemaining / 60)} min ${59 - (timeRemaining % 60)} sec`;

    // Create result object
    const result: Result = {
      score,
      totalPossibleScore,
      timeTaken,
      correctAnswers,
      totalQuestions: questions.length,
      dateCompleted: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };

    setAssessmentResult(result);
    setCurrentView('results');
    onComplete(score, totalPossibleScore);
  };

  const handleShareToProfile = () => {
    setIsAssessmentShared(!isAssessmentShared);
    // In a real app, would make an API call to update the user profile
  };

  const handleGoToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const currentQuestion = questions[currentQuestionIndex];

  // Helper functions for generating random content
  function getRandomTopic() {
    const topics = [
      'data structures', 'algorithms', 'system design', 'object-oriented programming',
      'functional programming', 'database optimization', 'front-end development',
      'back-end architecture', 'cloud computing', 'security practices'
    ];
    return topics[Math.floor(Math.random() * topics.length)];
  }

  function getRandomAnswer() {
    const answers = [
      'Implement a recursive solution for optimal performance',
      'Use dynamic programming to avoid redundant calculations',
      'Apply the Observer pattern to maintain loose coupling',
      'Utilize a hash table for O(1) lookup time',
      'Create a factory method for object instantiation',
      'Leverage asynchronous processing for I/O operations',
      'Apply the Singleton pattern for shared resources',
      'Implement dependency injection for better testability',
      'Use a distributed cache for improved scalability',
      'Create an immutable data structure to prevent side effects'
    ];
    return answers[Math.floor(Math.random() * answers.length)];
  }

  function getRandomOptionLetter() {
    return ['a', 'b', 'c', 'd'][Math.floor(Math.random() * 4)];
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={24} />
        </button>

        {currentView === 'details' && (
          <div className={styles.assessmentDetails}>
            <h2 className={styles.assessmentTitle}>{assessment.title}</h2>
            
            <div className={styles.assessmentMeta}>
              <div className={styles.metaItem}>
                <Clock size={18} className={styles.metaIcon} />
                <span>{assessment.duration} minutes</span>
              </div>
              <div className={styles.metaItem}>
                <Award size={18} className={styles.metaIcon} />
                <span>{assessment.difficulty}</span>
              </div>
              <div className={styles.metaItem}>
                <BarChart2 size={18} className={styles.metaIcon} />
                <span>{assessment.questionCount} questions</span>
              </div>
            </div>

            <div className={styles.description}>
              <h3>About this Assessment</h3>
              <p>{assessment.description}</p>
            </div>

            <div className={styles.skillsSection}>
              <h3>Skills Covered</h3>
              <div className={styles.skillTags}>
                {assessment.skillsCovered.map((skill, index) => (
                  <span key={index} className={styles.skillTag}>{skill}</span>
                ))}
              </div>
            </div>

            <div className={styles.instructionsSection}>
              <h3>Instructions</h3>
              <ul className={styles.instructionsList}>
                <li>You will have <strong>{assessment.duration} minutes</strong> to complete this assessment.</li>
                <li>The assessment contains <strong>{assessment.questionCount} multiple-choice questions</strong>.</li>
                <li>You can navigate between questions during the assessment.</li>
                <li>Your progress is saved as you go.</li>
                <li>Once time runs out or you submit, you cannot retake the assessment.</li>
                <li>After completion, you can choose to add this certification to your profile.</li>
              </ul>
            </div>

            <div className={styles.startButtonContainer}>
              <button 
                className={styles.startButton} 
                onClick={handleStartAssessment}
              >
                Start Assessment
              </button>
            </div>
          </div>
        )}

        {currentView === 'questions' && currentQuestion && (
          <div className={styles.questionsContainer}>
            <div className={styles.questionHeader}>
              <div className={styles.questionProgress}>
                <div className={styles.progressText}>Question {currentQuestionIndex + 1}/{questions.length}</div>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressIndicator}
                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className={styles.timeRemaining}>
                <Clock size={16} className={styles.timeIcon} />
                <span>{formatTime(timeRemaining)}</span>
              </div>
            </div>

            <div className={styles.questionContent}>
              <h3 className={styles.questionText}>{currentQuestion.text}</h3>
              
              <div className={styles.options}>
                {currentQuestion.options.map((option) => (
                  <div
                    key={option.id}
                    className={`${styles.option} ${selectedAnswers[currentQuestion.id] === option.id ? styles.selected : ''}`}
                    onClick={() => handleSelectAnswer(currentQuestion.id, option.id)}
                  >
                    <div className={styles.optionSelect}>
                      {selectedAnswers[currentQuestion.id] === option.id ? (
                        <div className={styles.optionSelected}></div>
                      ) : null}
                    </div>
                    <span className={styles.optionText}>{option.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.navigationButtons}>
              <button
                className={styles.navButton}
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </button>
              
              <div className={styles.questionNav}>
                {questions.map((_, index) => (
                  <button
                    key={index}
                    className={`${styles.questionDot} ${
                      index === currentQuestionIndex ? styles.currentQuestionDot : ''
                    } ${selectedAnswers[questions[index].id] ? styles.answeredQuestionDot : ''}`}
                    onClick={() => handleGoToQuestion(index)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              
              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  className={styles.navButton}
                  onClick={handleNextQuestion}
                >
                  Next
                </button>
              ) : (
                <button
                  className={styles.submitButton}
                  onClick={handleSubmitAssessment}
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        )}

        {currentView === 'results' && (assessmentResult || assessment.isCompleted) && (
          <div className={styles.resultsContainer}>
            <h2 className={styles.resultTitle}>Assessment Results</h2>
            
            <div className={styles.scoreCircle}>
              <div className={styles.scoreNumber}>
                {assessment.score !== undefined 
                  ? Math.round((assessment.score / (assessment.totalPossibleScore || 1)) * 100) 
                  : assessmentResult 
                    ? Math.round((assessmentResult.score / assessmentResult.totalPossibleScore) * 100)
                    : 0}%
              </div>
              <div className={styles.scoreLabel}>Score</div>
            </div>
            
            <div className={styles.resultDetails}>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Correct Answers:</span>
                <span className={styles.resultValue}>
                  {assessmentResult?.correctAnswers || assessment.score || 0} / 
                  {assessmentResult?.totalQuestions || assessment.totalPossibleScore || 0}
                </span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Time Taken:</span>
                <span className={styles.resultValue}>
                  {assessmentResult?.timeTaken || assessment.duration}
                </span>
              </div>
              <div className={styles.resultItem}>
                <span className={styles.resultLabel}>Completed On:</span>
                <span className={styles.resultValue}>
                  {assessmentResult?.dateCompleted || new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
            
            <div className={styles.shareSection}>
              <div className={styles.shareToggle}>
                <label className={styles.shareLabel}>
                  <input
                    type="checkbox"
                    checked={isAssessmentShared}
                    onChange={handleShareToProfile}
                    className={styles.shareCheckbox}
                  />
                  <div className={styles.shareCheckboxCustom}>
                    {isAssessmentShared && <CheckCircle size={14} />}
                  </div>
                  <span>Show this assessment on my profile</span>
                </label>
              </div>
              
              <button 
                className={styles.shareButton}
                onClick={handleShareToProfile}
              >
                <Share2 size={16} />
                {isAssessmentShared ? 'Remove from Profile' : 'Add to Profile'}
              </button>
            </div>
            
            <div className={styles.certificatePreview}>
              <h3>Certification Preview</h3>
              <div className={styles.certificate}>
                <div className={styles.certificateHeader}>
                  <h4 className={styles.certificateTitle}>{assessment.title}</h4>
                  <div className={styles.certificateLogo}>
                    {assessment.companyLogo && (
                      <img 
                        src={assessment.companyLogo} 
                        alt={assessment.company || ''} 
                        width={40}
                        height={40}
                      />
                    )}
                  </div>
                </div>
                <div className={styles.certificateContent}>
                  <div className={styles.certificateScore}>
                    <span className={styles.certificateScoreValue}>
                      {assessmentResult 
                        ? `${Math.round((assessmentResult.score / assessmentResult.totalPossibleScore) * 100)}%`
                        : assessment.score !== undefined
                          ? `${Math.round((assessment.score / (assessment.totalPossibleScore || 1)) * 100)}%`
                          : '0%'}
                    </span>
                    <span className={styles.certificateScoreLabel}>Score</span>
                  </div>
                  <div className={styles.certificateSkills}>
                    <h5>Skills Verified:</h5>
                    <div className={styles.skillsList}>
                      {assessment.skillsCovered.map((skill, index) => (
                        <span key={index} className={styles.certSkillTag}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentDetailsModal;
