import React from 'react';
import Modal from '../global/Modal';
import styles from './CoverLetterModal.module.css';
import { Calendar } from 'lucide-react';

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

  return (
    <Modal title="Cover Letter" onClose={onClose} width="800px">
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
