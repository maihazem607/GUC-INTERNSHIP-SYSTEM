import { jsPDF } from 'jspdf';

export interface ReportData {
  title: string;
  company: string;
  position: string;
  duration: string;
  introduction: string;
  body: string;
  coursesApplied: string[];
  finalized: boolean;
  courseNames: string[];
}

// Interface for Resume data
export interface ResumeData {
  name: string;
  email: string;
  phone: string;
  address: string;
  summary: string;
  education: {
    degree: string;
    university: string;
    date: string;
    gpa: string;
  }[];
  experience: {
    position: string;
    company: string;
    date: string;
    description: string;
  }[];
  skills: string[];
  languages: {
    language: string;
    proficiency: string;
  }[];
  projects?: {
    name: string;
    description: string;
    technologies: string;
  }[];
}

// Interface for Cover Letter data
export interface CoverLetterData {
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  applicantAddress: string;
  companyName: string;
  positionTitle: string;
  date: string;
  content: string;
}

// Interface for Company Document data
export interface CompanyDocumentData {
  companyName: string;
  documentTitle: string;
  contentSections: {
    title: string;
    content: string;
  }[];
}

// Interface for Statistics data
export interface StatisticsData {
  reports: {
    accepted: number;
    rejected: number;
    flagged: number;
    total: number;
    trend?: { value: number; isPositive: boolean };
  };
  reviewTime: {
    average: string;
    trend?: { value: number; isPositive: boolean };
  };
  courses: {
    topCourses: Array<{ name: string; count: number }>;
    trend?: { value: number; isPositive: boolean };
  };
  companies: {
    topRated: Array<{ name: string; rating: number }>;
    trend?: { value: number; isPositive: boolean };
  };
  internships: {
    topCompanies: Array<{ name: string; count: number }>;
    total: number;
    trend?: { value: number; isPositive: boolean };
  };
}

// Interface for Student Report data
export interface StudentReportData {
  id: number;
  title: string;
  studentId: number;
  studentName: string;
  major: string;
  companyName: string;
  submissionDate: string;
  status: 'pending' | 'accepted' | 'flagged' | 'rejected';
  content: string;
  supervisorName: string;
  internshipStartDate: string;
  internshipEndDate: string;
  coursesApplied?: string[];
  logo?: string;
  scadFeedback?: string;
  studentResponses?: string[];
  evaluationScore?: number;
  evaluationComments?: string;
}

export const generateReportPDF = async ({
  title,
  company,
  position,
  duration,
  introduction,
  body,
  coursesApplied,
  finalized,
  courseNames
}: ReportData) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  
  // Set font and start position
  pdf.setFont('helvetica');
  let yPos = margin;
  
  // Add logo if available
  const logoUrl = '/logos/GUCInternshipSystemLogo.png';
  pdf.addImage(logoUrl, 'PNG', (pageWidth / 2) - 15, yPos, 30, 30);
  yPos += 40;
  
  // Add report title
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  const reportTitle = title || 'Internship Report';
  pdf.text(reportTitle, pageWidth / 2, yPos, { align: 'center' });
  yPos += 10;

  // Add status label if draft
  if (!finalized) {
    pdf.setFontSize(14);
    pdf.setTextColor(255, 102, 0); // Orange color for draft
    pdf.text("DRAFT", pageWidth / 2, yPos, { align: 'center' });
    pdf.setTextColor(0, 0, 0); // Reset to black
    yPos += 10;
  }
  
  // Add metadata section
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  yPos += 5;
  
  // Company info
  pdf.setFont('helvetica', 'bold');
  pdf.text("Company:", margin, yPos);
  pdf.setFont('helvetica', 'normal');
  pdf.text(company, margin + 25, yPos);
  yPos += 7;
  
  // Position info
  pdf.setFont('helvetica', 'bold');
  pdf.text("Position:", margin, yPos);
  pdf.setFont('helvetica', 'normal');
  pdf.text(position, margin + 25, yPos);
  yPos += 7;
  
  // Duration info
  pdf.setFont('helvetica', 'bold');
  pdf.text("Duration:", margin, yPos);
  pdf.setFont('helvetica', 'normal');
  pdf.text(duration, margin + 25, yPos);
  yPos += 7;
  
  // Status info
  pdf.setFont('helvetica', 'bold');
  pdf.text("Status:", margin, yPos);
  pdf.setFont('helvetica', 'normal');
  if (finalized) {
    pdf.setTextColor(46, 125, 50); // Green color for finalized
    pdf.text("FINALIZED", margin + 25, yPos);
    pdf.setTextColor(0, 0, 0); // Reset to black
  } else {
    pdf.setTextColor(255, 102, 0); // Orange color for draft
    pdf.text("DRAFT", margin + 25, yPos);
    pdf.setTextColor(0, 0, 0); // Reset to black
  }
  yPos += 15;
  
  // Add divider
  pdf.setDrawColor(200, 200, 200);
  pdf.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;
  
  // Introduction section
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.text("Introduction", margin, yPos);
  yPos += 8;
  
  // Introduction content
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(11);
  const introLines = pdf.splitTextToSize(introduction || 'No introduction provided.', contentWidth);
  pdf.text(introLines, margin, yPos);
  yPos += (introLines.length * 5) + 10;
  
  // Check if we need a new page
  if (yPos > 250) {
    pdf.addPage();
    yPos = margin;
  }
  
  // Main content section
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.text("Main Content", margin, yPos);
  yPos += 8;
  
  // Main content
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(11);
  const bodyLines = pdf.splitTextToSize(body || 'No content provided.', contentWidth);
  pdf.text(bodyLines, margin, yPos);
  yPos += (bodyLines.length * 5) + 10;
  
  // Check if we need a new page
  if (yPos > 250) {
    pdf.addPage();
    yPos = margin;
  }
  
  // Relevant courses section (if any)
  if (courseNames.length > 0) {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text("Relevant Courses", margin, yPos);
    yPos += 8;
    
    // Course list
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);
    
    courseNames.forEach((courseName, index) => {
      pdf.text(`• ${courseName}`, margin + 5, yPos);
      yPos += 6;
      
      // Check if we need a new page
      if (yPos > 270 && index < courseNames.length - 1) {
        pdf.addPage();
        yPos = margin;
      }
    });
  }
  
  // Add footer with date
  const now = new Date();
  pdf.setFontSize(8);
  pdf.setTextColor(128, 128, 128);
  pdf.text(`Generated on ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`, margin, pdf.internal.pageSize.getHeight() - 10);
  pdf.text('GUC Internship System', pageWidth - margin, pdf.internal.pageSize.getHeight() - 10, { align: 'right' });
  
  // Generate a filename based on report details
  const fileName = `${company.replace(/\s+/g, '_')}_${
    position.replace(/\s+/g, '_')
  }_Report${finalized ? '' : '_DRAFT'}.pdf`;
    // Download the PDF
  pdf.save(fileName);
  
  return fileName;
};

/**
 * Generate a PDF for a student's resume
 */
export const generateResumePDF = async (resumeData: ResumeData) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  
  // Set font and start position
  pdf.setFont('helvetica', 'bold');
  let yPos = margin;
  
  // Add name as title
  pdf.setFontSize(24);
  pdf.text(resumeData.name, pageWidth / 2, yPos, { align: 'center' });
  yPos += 10;
  
  // Add contact information
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  const contactInfo = `${resumeData.email} | ${resumeData.phone} | ${resumeData.address}`;
  pdf.text(contactInfo, pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;
  
  // Add divider
  pdf.setDrawColor(200, 200, 200);
  pdf.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;
  
  // Add summary section
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.text("SUMMARY", margin, yPos);
  yPos += 8;
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(11);
  const summaryLines = pdf.splitTextToSize(resumeData.summary, contentWidth);
  pdf.text(summaryLines, margin, yPos);
  yPos += (summaryLines.length * 5) + 10;
  
  // Add education section
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.text("EDUCATION", margin, yPos);
  yPos += 8;
  
  resumeData.education.forEach(edu => {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text(edu.degree, margin, yPos);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.text(edu.university, margin, yPos + 5);
    
    // Add date and GPA to the right
    pdf.text(edu.date, pageWidth - margin, yPos, { align: 'right' });
    pdf.text(`GPA: ${edu.gpa}`, pageWidth - margin, yPos + 5, { align: 'right' });
    
    yPos += 15;
    
    // Check if we need a new page
    if (yPos > 280) {
      pdf.addPage();
      yPos = margin;
    }
  });
  
  // Add experience section
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.text("EXPERIENCE", margin, yPos);
  yPos += 8;
  
  resumeData.experience.forEach(exp => {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text(`${exp.position}, ${exp.company}`, margin, yPos);
    
    // Add date to the right
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.text(exp.date, pageWidth - margin, yPos, { align: 'right' });
    
    yPos += 6;
    
    // Add description
    const descLines = pdf.splitTextToSize(exp.description, contentWidth);
    pdf.text(descLines, margin, yPos);
    
    yPos += (descLines.length * 5) + 10;
    
    // Check if we need a new page
    if (yPos > 280) {
      pdf.addPage();
      yPos = margin;
    }
  });
  
  // Add skills section
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.text("SKILLS", margin, yPos);
  yPos += 8;
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(11);
  const skillsText = resumeData.skills.join(', ');
  const skillsLines = pdf.splitTextToSize(skillsText, contentWidth);
  pdf.text(skillsLines, margin, yPos);
  
  yPos += (skillsLines.length * 5) + 10;
  
  // Add languages section
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.text("LANGUAGES", margin, yPos);
  yPos += 8;
  
  resumeData.languages.forEach((lang, index) => {
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);
    pdf.text(`${lang.language} (${lang.proficiency})`, margin, yPos);
    yPos += 6;
    
    // Add a comma except for the last item
    if (index < resumeData.languages.length - 1) {
      pdf.text(", ", margin + pdf.getStringUnitWidth(`${lang.language} (${lang.proficiency})`) * 11 / pdf.internal.scaleFactor, yPos - 6);
    }
  });
  
  // Add projects section if available
  if (resumeData.projects && resumeData.projects.length > 0) {
    yPos += 5;
    
    // Check if we need a new page
    if (yPos > 250) {
      pdf.addPage();
      yPos = margin;
    }
    
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text("PROJECTS", margin, yPos);
    yPos += 8;
    
    resumeData.projects.forEach(project => {
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text(project.name, margin, yPos);
      yPos += 6;
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      const projDescLines = pdf.splitTextToSize(project.description, contentWidth);
      pdf.text(projDescLines, margin, yPos);
      yPos += (projDescLines.length * 5) + 3;
      
      pdf.setFontSize(10);
      pdf.text(`Technologies: ${project.technologies}`, margin, yPos);
      yPos += 10;
      
      // Check if we need a new page
      if (yPos > 280 && resumeData.projects && resumeData.projects.indexOf(project) < resumeData.projects.length - 1) {
        pdf.addPage();
        yPos = margin;
      }
    });
  }
  
  // Generate a filename
  const fileName = `${resumeData.name.replace(/\s+/g, '_')}_Resume.pdf`;
  
  // Download the PDF
  pdf.save(fileName);
  
  return fileName;
};

/**
 * Generate a PDF for a student's cover letter
 */
export const generateCoverLetterPDF = async (coverLetterData: CoverLetterData) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 25;
  const contentWidth = pageWidth - (margin * 2);
  
  // Set font and start position
  pdf.setFont('helvetica', 'normal');
  let yPos = margin;
  
  // Add applicant information
  pdf.setFontSize(12);
  pdf.text(coverLetterData.applicantName, margin, yPos);
  yPos += 6;
  pdf.text(coverLetterData.applicantEmail, margin, yPos);
  yPos += 6;
  pdf.text(coverLetterData.applicantPhone, margin, yPos);
  yPos += 6;
  pdf.text(coverLetterData.applicantAddress, margin, yPos);
  yPos += 15;
  
  // Add current date
  pdf.text(coverLetterData.date, margin, yPos);
  yPos += 15;
  
  // Add recipient info
  pdf.text(`${coverLetterData.companyName}`, margin, yPos);
  yPos += 15;
  
  // Add salutation
  pdf.text(`Dear ${coverLetterData.companyName} Hiring Manager,`, margin, yPos);
  yPos += 15;
  
  // Add cover letter content
  const contentLines = pdf.splitTextToSize(coverLetterData.content, contentWidth);
  pdf.text(contentLines, margin, yPos);
  yPos += (contentLines.length * 5) + 20;
  
  // Add closing
  pdf.text("Sincerely,", margin, yPos);
  yPos += 15;
  pdf.text(coverLetterData.applicantName, margin, yPos);
  
  // Generate a filename
  const fileName = `${coverLetterData.applicantName.replace(/\s+/g, '_')}_Cover_Letter_${coverLetterData.companyName.replace(/\s+/g, '_')}.pdf`;
  
  // Download the PDF
  pdf.save(fileName);
  
  return fileName;
};

/**
 * Generate a PDF for company documents
 */
export const generateCompanyDocumentPDF = async (documentData: CompanyDocumentData) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  
  // Set font and start position
  pdf.setFont('helvetica', 'bold');
  let yPos = margin;
  
  // Add company name
  pdf.setFontSize(20);
  pdf.text(documentData.companyName, pageWidth / 2, yPos, { align: 'center' });
  yPos += 10;
  
  // Add document title
  pdf.setFontSize(16);
  pdf.text(documentData.documentTitle, pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;
  
  // Add divider
  pdf.setDrawColor(100, 100, 100);
  pdf.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;
  
  // Add content sections
  documentData.contentSections.forEach(section => {
    // Check if we need a new page
    if (yPos > 270) {
      pdf.addPage();
      yPos = margin;
    }
    
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text(section.title, margin, yPos);
    yPos += 8;
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(12);
    const contentLines = pdf.splitTextToSize(section.content, contentWidth);
    pdf.text(contentLines, margin, yPos);
    yPos += (contentLines.length * 5) + 15;
  });
  
  // Add footer with date
  const now = new Date();
  pdf.setFontSize(8);
  pdf.setTextColor(128, 128, 128);
  pdf.text(`Document generated on ${now.toLocaleDateString()}`, margin, pdf.internal.pageSize.getHeight() - 10);
  pdf.text(documentData.companyName, pageWidth - margin, pdf.internal.pageSize.getHeight() - 10, { align: 'right' });
  
  // Generate a filename
  const fileName = `${documentData.companyName.replace(/\s+/g, '_')}_${documentData.documentTitle.replace(/\s+/g, '_')}.pdf`;
  
  // Download the PDF
  pdf.save(fileName);
  
  return fileName;
};

/**
 * Generate a PDF for statistics
 */
export const generateStatisticsPDF = async (statisticsData: StatisticsData) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  
  // Set font and start position
  pdf.setFont('helvetica', 'bold');
  let yPos = margin;
  
  // Add title
  pdf.setFontSize(20);
  pdf.text('Internship System Statistics Report', pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;
  
  // Add date
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  const now = new Date();
  pdf.text(`Generated on: ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`, pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;
  
  // Add divider
  pdf.setDrawColor(200, 200, 200);
  pdf.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 15;
  
  // Reports summary section
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(16);
  pdf.text('Reports Summary', margin, yPos);
  yPos += 10;
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(12);
  pdf.text(`Total Reports: ${statisticsData.reports.total}`, margin, yPos);
  yPos += 8;
  pdf.text(`Accepted: ${statisticsData.reports.accepted} (${((statisticsData.reports.accepted / statisticsData.reports.total) * 100).toFixed(1)}%)`, margin, yPos);
  yPos += 8;
  pdf.text(`Rejected: ${statisticsData.reports.rejected} (${((statisticsData.reports.rejected / statisticsData.reports.total) * 100).toFixed(1)}%)`, margin, yPos);
  yPos += 8;
  pdf.text(`Flagged: ${statisticsData.reports.flagged} (${((statisticsData.reports.flagged / statisticsData.reports.total) * 100).toFixed(1)}%)`, margin, yPos);
  yPos += 8;
  
  if (statisticsData.reports.trend) {
    const trendIndicator = statisticsData.reports.trend.isPositive ? '↑' : '↓';
    pdf.text(`Trend: ${trendIndicator} ${statisticsData.reports.trend.value}% from previous period`, margin, yPos);
  }
  yPos += 15;
  
  // Review time section
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(16);
  pdf.text('Review Time', margin, yPos);
  yPos += 10;
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(12);
  pdf.text(`Average Review Time: ${statisticsData.reviewTime.average}`, margin, yPos);
  yPos += 8;
  
  if (statisticsData.reviewTime.trend) {
    const trendIndicator = statisticsData.reviewTime.trend.isPositive ? '↑' : '↓';
    pdf.text(`Trend: ${trendIndicator} ${statisticsData.reviewTime.trend.value}% from previous period`, margin, yPos);
  }
  yPos += 15;
  
  // Check if we need a new page
  if (yPos > 250) {
    pdf.addPage();
    yPos = margin;
  }
  
  // Top courses section
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(16);
  pdf.text('Top Courses Applied in Internships', margin, yPos);
  yPos += 10;
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(12);
  
  statisticsData.courses.topCourses.forEach((course, index) => {
    if (index < 10) { // Limit to top 10 courses for space
      pdf.text(`${index + 1}. ${course.name}: ${course.count} applications`, margin, yPos);
      yPos += 8;
      
      // Check if we need a new page
      if (yPos > 270 && index < statisticsData.courses.topCourses.length - 1) {
        pdf.addPage();
        yPos = margin;
      }
    }
  });
  yPos += 7;
  
  if (statisticsData.courses.trend) {
    const trendIndicator = statisticsData.courses.trend.isPositive ? '↑' : '↓';
    pdf.text(`Trend: ${trendIndicator} ${statisticsData.courses.trend.value}% from previous period`, margin, yPos);
  }
  yPos += 15;
  
  // Check if we need a new page
  if (yPos > 250) {
    pdf.addPage();
    yPos = margin;
  }
  
  // Top rated companies section
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(16);
  pdf.text('Top Rated Companies', margin, yPos);
  yPos += 10;
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(12);
  
  statisticsData.companies.topRated.forEach((company, index) => {
    if (index < 10) { // Limit to top 10 companies
      pdf.text(`${index + 1}. ${company.name}: ${company.rating.toFixed(1)}/10`, margin, yPos);
      yPos += 8;
      
      // Check if we need a new page
      if (yPos > 270 && index < statisticsData.companies.topRated.length - 1) {
        pdf.addPage();
        yPos = margin;
      }
    }
  });
  yPos += 7;
  
  if (statisticsData.companies.trend) {
    const trendIndicator = statisticsData.companies.trend.isPositive ? '↑' : '↓';
    pdf.text(`Trend: ${trendIndicator} ${statisticsData.companies.trend.value}% from previous period`, margin, yPos);
  }
  yPos += 15;
  
  // Check if we need a new page
  if (yPos > 250) {
    pdf.addPage();
    yPos = margin;
  }
  
  // Internships section
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(16);
  pdf.text('Internship Statistics', margin, yPos);
  yPos += 10;
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(12);
  pdf.text(`Total Internships: ${statisticsData.internships.total}`, margin, yPos);
  yPos += 10;
  
  pdf.text('Top Companies Offering Internships:', margin, yPos);
  yPos += 8;
  
  statisticsData.internships.topCompanies.forEach((company, index) => {
    if (index < 10) { // Limit to top 10
      pdf.text(`${index + 1}. ${company.name}: ${company.count} internships`, margin, yPos);
      yPos += 8;
      
      // Check if we need a new page
      if (yPos > 270 && index < statisticsData.internships.topCompanies.length - 1) {
        pdf.addPage();
        yPos = margin;
      }
    }
  });
  yPos += 7;
  
  if (statisticsData.internships.trend) {
    const trendIndicator = statisticsData.internships.trend.isPositive ? '↑' : '↓';
    pdf.text(`Trend: ${trendIndicator} ${statisticsData.internships.trend.value}% from previous period`, margin, yPos);
  }
  
  // Add footer with page numbers
  // Need to cast internal to any since getNumberOfPages is not recognized in TypeScript types
  const totalPages = (pdf.internal as any).getNumberOfPages();
  
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(128, 128, 128);
    pdf.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pdf.internal.pageSize.getHeight() - 10, { align: 'right' });
    pdf.text('GUC Internship System', margin, pdf.internal.pageSize.getHeight() - 10);
  }
  
  // Generate a filename
  const fileName = `Statistics_Report_${now.toISOString().split('T')[0]}.pdf`;
  
  // Download the PDF
  pdf.save(fileName);
  
  return fileName;
};

/**
 * Generate a PDF for student reports
 */
export const generateStudentReportPDF = async (reportData: StudentReportData) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  
  // Set font and start position
  pdf.setFont('helvetica', 'bold');
  let yPos = margin;
  
  // Add title
  pdf.setFontSize(18);
  pdf.text(reportData.title, pageWidth / 2, yPos, { align: 'center' });
  yPos += 10;
  
  // Add student name and company
  pdf.setFontSize(14);
  pdf.text(`${reportData.studentName} - ${reportData.companyName}`, pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;
  
  // Add status banner
  let statusColor: [number, number, number];
  switch(reportData.status) {
    case 'accepted': statusColor = [26, 175, 93]; break;
    case 'rejected': statusColor = [231, 76, 60]; break;
    case 'flagged': statusColor = [33, 125, 187]; break;
    case 'pending': 
    default: statusColor = [245, 180, 0]; break;
  }
  
  // Draw status banner - use individual values instead of spread operator
  pdf.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
  pdf.rect(margin, yPos, contentWidth, 10, 'F');
  
  // Add status text
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(10);
  let statusText = '';
  switch(reportData.status) {
    case 'accepted': statusText = 'ACCEPTED BY SCAD'; break;
    case 'rejected': statusText = 'REJECTED BY SCAD'; break;
    case 'flagged': statusText = 'FLAGGED BY SCAD - NEEDS REVISION'; break;
    case 'pending': 
    default: statusText = 'PENDING SCAD REVIEW'; break;
  }
  pdf.text(statusText, pageWidth / 2, yPos + 6, { align: 'center' });
  pdf.setTextColor(0, 0, 0);
  yPos += 15;
  
  // Add report metadata
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(11);
  
  pdf.setFont('helvetica', 'bold');
  pdf.text('Student Information', margin, yPos);
  yPos += 7;
  
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Major: ${reportData.major}`, margin, yPos);
  yPos += 6;
  pdf.text(`Submission Date: ${reportData.submissionDate}`, margin, yPos);
  yPos += 6;
  pdf.text(`Supervisor: ${reportData.supervisorName}`, margin, yPos);
  yPos += 6;
  pdf.text(`Internship Period: ${reportData.internshipStartDate} to ${reportData.internshipEndDate}`, margin, yPos);
  yPos += 10;
  
  if (reportData.evaluationScore !== undefined) {
    pdf.text(`Evaluation Score: ${reportData.evaluationScore.toFixed(1)}/5`, margin, yPos);
    yPos += 6;
  }
  
  // Add divider
  yPos += 5;
  pdf.setDrawColor(200, 200, 200);
  pdf.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;
  
  // Report content
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.text('Report Content', margin, yPos);
  yPos += 8;
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(11);
  const contentLines = pdf.splitTextToSize(reportData.content, contentWidth);
  pdf.text(contentLines, margin, yPos);
  yPos += (contentLines.length * 5) + 10;
  
  // Check if we need a new page
  if (yPos > 250) {
    pdf.addPage();
    yPos = margin;
  }
  
  // Add SCAD feedback if available
  if (reportData.scadFeedback) {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text('SCAD Feedback', margin, yPos);
    yPos += 8;
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);
    const feedbackLines = pdf.splitTextToSize(reportData.scadFeedback, contentWidth);
    pdf.text(feedbackLines, margin, yPos);
    yPos += (feedbackLines.length * 5) + 10;
  }
  
  // Check if we need a new page
  if (yPos > 250) {
    pdf.addPage();
    yPos = margin;
  }
  
  // Add student responses if available
  if (reportData.studentResponses && reportData.studentResponses.length > 0) {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text('Student Responses', margin, yPos);
    yPos += 8;
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);
    
    reportData.studentResponses.forEach((response: string, index: number) => {
      const responseLines = pdf.splitTextToSize(`Response ${index+1}: ${response}`, contentWidth);
      pdf.text(responseLines, margin, yPos);
      yPos += (responseLines.length * 5) + 5;
      
      // Check if we need a new page
      if (yPos > 270 && index < reportData.studentResponses!.length - 1) {
        pdf.addPage();
        yPos = margin;
      }
    });
    yPos += 5;
  }
  
  // Add courses applied if available
  if (reportData.coursesApplied && reportData.coursesApplied.length > 0) {
    // Check if we need a new page
    if (yPos > 250) {
      pdf.addPage();
      yPos = margin;
    }
    
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text('Courses Applied', margin, yPos);
    yPos += 8;
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);
    
    reportData.coursesApplied.forEach((course: string, index: number) => {
      pdf.text(`• ${course}`, margin, yPos);
      yPos += 6;
      
      // Check if we need a new page
      if (yPos > 270 && index < reportData.coursesApplied!.length - 1) {
        pdf.addPage();
        yPos = margin;
      }
    });
  }
  
  // Add footer with date and page numbers
  // Need to cast internal to any since getNumberOfPages is not recognized in TypeScript types
  const totalPages = (pdf.internal as any).getNumberOfPages();
  
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(128, 128, 128);
    pdf.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pdf.internal.pageSize.getHeight() - 10, { align: 'right' });
    pdf.text('GUC Internship System', margin, pdf.internal.pageSize.getHeight() - 10);
  }
  
  // Generate a filename
  const fileName = `Student_Report_${reportData.studentName.replace(/\s+/g, '_')}_${reportData.companyName.replace(/\s+/g, '_')}.pdf`;
  
  // Download the PDF
  pdf.save(fileName);
  
  return fileName;
};

export default generateReportPDF;