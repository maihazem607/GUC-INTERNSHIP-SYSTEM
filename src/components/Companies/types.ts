// Types for Companies
export interface Company {
  id: number;
  name: string;
  industry: string;
  location: string;
  logo: string;
  description: string;
  rating: number;
  recommendationLevel: 'High' | 'Medium' | 'Low';
  internshipCount: number;
  openPositions: number;
  technologiesUsed: string[];
  benefits: string[];
  pastInternReviews: Review[];
  matchScore: number; // Score to determine how good the match is for the student (0-100)
}

export interface Review {
  name: string;
  position: string;
  rating: number;
  comment: string;
  year: number;
}

export interface FilterOptions {
  industry?: string;
  recommendation?: string;
  rating?: string;
}
