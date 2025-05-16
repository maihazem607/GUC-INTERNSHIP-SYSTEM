import React from 'react';
import Modal from '../global/Modal';
import styles from './CoverLetterModal.module.css';
import { Calendar, Download } from 'lucide-react';
import { generateCoverLetterPDF, CoverLetterData } from '../../utils/pdfUtils';

interface CoverLetterModalProps {
  applicantName: string;
  internshipTitle: string;
  onClose: () => void;
}

const CoverLetterModal: React.FC<CoverLetterModalProps> = ({ 
  applicantName, 
  internshipTitle, 
  onClose 
}) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Create a mock company name from the internship title
  const companyName = internshipTitle.includes('at') 
    ? internshipTitle.split(' at ')[1] 
    : 'Your Company';
  // Generate mock cover letter data
  const coverLetterData: CoverLetterData = {
    applicantName,
    applicantEmail: `${applicantName.toLowerCase().replace(' ', '.')}@example.com`,
    applicantPhone: '+20 123 456 7890',
    applicantAddress: 'Cairo, Egypt',
    companyName,
    positionTitle: internshipTitle,
    date: currentDate,
    content: `Dear Hiring Manager,

I am writing to express my interest in the ${internshipTitle} position at ${companyName}. As a Computer Science student at the German University in Cairo, I am eager to apply my academic knowledge and technical skills in a professional environment that fosters growth and innovation.

Throughout my academic journey, I have developed strong programming skills in various languages and frameworks. I have worked on several projects that have enhanced my problem-solving abilities and teamwork skills. These experiences have prepared me to contribute effectively to your organization.

I am particularly drawn to ${companyName} because of your commitment to technological advancement and innovation. Your company's work in [specific field/technology] aligns perfectly with my career aspirations and academic focus.

I am confident that my technical skills, enthusiasm for learning, and dedication to quality work make me a strong candidate for this internship. I am excited about the opportunity to contribute to your team and gain valuable industry experience.

Thank you for considering my application. I look forward to the possibility of discussing how my skills and experiences align with your needs.

Sincerely,
${applicantName}`
  };

  const handleDownloadPDF = async () => {
    try {
      await generateCoverLetterPDF(coverLetterData);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <Modal title="Cover Letter" onClose={onClose} width="800px">
      <div className={styles.modalActions}>
        <button onClick={handleDownloadPDF} className={styles.downloadButton}>
          <Download size={16} />
          Download as PDF
        </button>
      </div>
      <div className={styles.coverLetterContainer}>
        <div className={styles.letterHeader}>
          <div className={styles.applicantInfo}>
            <h2 className={styles.applicantName}>{applicantName}</h2>
            <p className={styles.applicantEmail}>{applicantName.toLowerCase().replace(' ', '.')}@example.com</p>
            <p className={styles.applicantPhone}>+20 123 456 7890</p>
            <p className={styles.applicantAddress}>Cairo, Egypt</p>
          </div>
          <div className={styles.dateSection}>
            <Calendar size={16} />
            <span>{currentDate}</span>
          </div>
        </div>

        <div className={styles.recipientInfo}>
          <p className={styles.recipientName}>Hiring Manager</p>
          <p className={styles.companyName}>{companyName}</p>
          <p className={styles.companyAddress}>Cairo, Egypt</p>
        </div>

        <div className={styles.greeting}>
          <p>Dear Hiring Manager,</p>
        </div>

        <div className={styles.content}>
          <p className={styles.paragraph}>
            I am writing to express my interest in the {internshipTitle} position at {companyName}. 
            As a Computer Science student at the German University in Cairo with a solid foundation in 
            programming and software development, I am excited about the opportunity to contribute my 
            skills and learn from experienced professionals at your organization.
          </p>

          <p className={styles.paragraph}>
            Throughout my academic journey, I have developed strong analytical skills and technical 
            proficiency in several programming languages including JavaScript, Python, and Java. 
            I have also gained valuable hands-on experience through academic projects and a previous 
            internship where I worked on developing web applications using modern frameworks and technologies.
          </p>

          <p className={styles.paragraph}>
            What particularly draws me to {companyName} is your commitment to innovation and the 
            opportunity to work on impactful projects. I am impressed by your company's recent 
            achievements and growth in the technology sector, and I am eager to be part of a team 
            that values creativity and excellence.
          </p>

          <p className={styles.paragraph}>
            I believe that my technical skills, combined with my enthusiasm for learning and problem-solving 
            abilities, make me a strong candidate for this position. I am confident that I can contribute 
            effectively to your team while growing professionally in a fast-paced environment.
          </p>

          <p className={styles.paragraph}>
            Thank you for considering my application. I look forward to the opportunity to discuss how 
            my background, skills, and experiences would benefit {companyName}. Please feel free to contact 
            me at your convenience to arrange an interview.
          </p>
        </div>

        <div className={styles.closing}>
          <p>Sincerely,</p>
          <div className={styles.signature}>{applicantName}</div>
        </div>
      </div>
    </Modal>
  );
};

export default CoverLetterModal;
