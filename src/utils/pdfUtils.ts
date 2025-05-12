import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

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

/**
 * Generates a PDF from report data and downloads it to the user's device
 */
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
  
  // Add logo if available (commented out for now)
  // const logoUrl = '/logos/GUCInternshipSystemLogo.png';
  // pdf.addImage(logoUrl, 'PNG', (pageWidth / 2) - 15, yPos, 30, 30);
  // yPos += 40;
  
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

// Also export as default for backward compatibility
export default generateReportPDF;