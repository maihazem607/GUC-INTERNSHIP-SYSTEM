// Types for the Company dashboard components
export type InternshipPost = {
    id: string;
    title: string;
    description: string;
    department: string;
    postedDate: Date;
    deadline: Date;
    applicationsCount: number;
    duration: string;
    isPaid: boolean;
    expectedSalary?: number;
    skillsRequired: string[];
};

export type Application = {
    id: string;
    internshipPostId: string;
    internshipTitle: string;
    applicantName: string;
    applicantEmail: string;
    applicantUniversity: string;
    applicantMajor: string;
    applicationDate: Date;
    status: 'pending' | 'finalized' | 'accepted' | 'rejected';
    resumeUrl: string;
    coverLetterUrl: string;
};

export type Intern = {
    id: string;
    name: string;
    email: string;
    university: string;
    major: string;
    internshipTitle: string;
    startDate: Date;
    endDate: Date | null;
    status: 'current' | 'completed';
    evaluation?: Evaluation;
};

export type Evaluation = {
    id: string;
    internId: string;
    evaluationDate: Date;
    performanceRating: number;
    skillsRating: number;
    attitudeRating: number;
    comments: string;
};



export type Notification = {
    id: string;
    message: string;
    type: 'application' | 'status-change' | 'system';
    timestamp: Date;
    read: boolean;
    emailSent: boolean;
};
