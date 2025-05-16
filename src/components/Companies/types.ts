// Types for Companies
export interface CompanyDocument {
  id: number;
  title: string;
  type: string;
  description: string;
  sections: {
    title: string;
    content: string;
  }[];
}

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
  documents?: CompanyDocument[]; // Optional array of company documents
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
