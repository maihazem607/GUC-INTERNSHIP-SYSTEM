export interface Assessment {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string; // in minutes
  questionCount: number;
  skillsCovered: string[];
  company?: string;
  companyLogo?: string;
  isCompleted?: boolean;
  score?: number;
  totalPossibleScore?: number;
  isSharedOnProfile?: boolean;
}

export interface Question {
  id: number;
  text: string;
  options: {
    id: string;
    text: string;
  }[];
  correctOptionId?: string;
}

export interface FilterOptions {
  category: string;
  difficulty: string;
  completion: string;
}

export interface Result {
  score: number;
  totalPossibleScore: number;
  timeTaken: string;
  correctAnswers: number;
  totalQuestions: number;
  dateCompleted: string;
}
