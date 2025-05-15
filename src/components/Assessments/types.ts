export interface Assessment {
    id: number;
    title: string;
    company: string;
    status: 'Available' | 'In Progress' | 'Completed';
    date: string;
    time: string;
    score?: number;
    logo?: string;
    posted?: boolean;
} 