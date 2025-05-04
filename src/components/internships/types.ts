export interface Internship {
  id: number;
  company: string;
  title: string;
  duration: string;
  date: string;
  location: string;
  industry: string;
  isPaid: boolean;
  salary: string;
  logo?: string;
  description?: string;
}

export interface FilterOptions {
  industry: string;
  duration: string;
  isPaid: string;
}