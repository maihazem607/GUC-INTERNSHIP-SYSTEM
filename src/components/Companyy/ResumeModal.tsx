import React from 'react';
import Modal from '../global/Modal';
import styles from './ResumeModal.module.css';
import { FileText, User, Mail, Phone, MapPin, Calendar, Briefcase, GraduationCap, Download } from 'lucide-react';
import { generateResumePDF, ResumeData } from '../../utils/pdfUtils';

interface ResumeModalProps {
  applicantName: string;
  onClose: () => void;
}

const ResumeModal: React.FC<ResumeModalProps> = ({ applicantName, onClose }) => {
  // Mock resume data for the demonstration
  const resumeData: ResumeData = {
    name: applicantName,
    email: `${applicantName.toLowerCase().replace(' ', '.')}@example.com`,
    phone: '+20 123 456 7890',
    address: 'Cairo, Egypt',
    summary: `Dedicated Computer Science student with a passion for software development and problem-solving. 
              Seeking to leverage my technical skills and academic knowledge in a challenging internship 
              position that allows for professional growth and learning opportunities.`,
    education: [
      {
        degree: 'Bachelor of Science in Computer Science',
        university: 'German University in Cairo (GUC)',
        date: '2020 - 2024',
        gpa: '3.8/4.0'
      }
    ],
    experience: [
      {
        position: 'Web Development Intern',
        company: 'Tech Solutions Ltd.',
        date: 'May 2023 - August 2023',
        description: 'Assisted in developing responsive web applications using React and Node.js. Collaborated with senior developers on implementing new features and fixing bugs.'
      },
      {
        position: 'Student Project Leader',
        company: 'GUC Software Engineering Project',
        date: 'September 2022 - December 2022',
        description: 'Led a team of 4 students in designing and implementing a healthcare management system. Responsible for project planning, task delegation, and quality assurance.'
      }
    ],
    skills: [
      'JavaScript/TypeScript', 'React', 'Node.js', 'Python', 'Java', 'SQL', 
      'HTML/CSS', 'Git', 'Problem Solving', 'Team Leadership'
    ],
    languages: [
      { language: 'English', proficiency: 'Professional' },
      { language: 'Arabic', proficiency: 'Native' }
    ],
    projects: [
      {
        name: 'E-commerce Platform',
        description: 'Developed a full-stack e-commerce application with React, Node.js and MongoDB. Implemented features such as user authentication, product search, shopping cart, and payment integration.',
        technologies: 'React, Node.js, Express, MongoDB'
      },
      {
        name: 'Algorithm Visualizer',
        description: 'Created an interactive web application that visualizes various sorting and pathfinding algorithms. Helps users understand how algorithms work through step-by-step animation.',
        technologies: 'JavaScript, HTML5 Canvas, CSS'
      }
    ]
  };
  const handleDownloadPDF = async () => {
    try {
      await generateResumePDF(resumeData);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <Modal title={`${applicantName}'s Resume`} onClose={onClose} width="800px">
      <div className={styles.modalActions}>
        <button onClick={handleDownloadPDF} className={styles.downloadButton}>
          <Download size={16} />
          Download as PDF
        </button>
      </div>
      <div className={styles.resumeContainer}>
        {/* Header Section */}
        <div className={styles.header}>
          <h1 className={styles.name}>{resumeData.name}</h1>
          <div className={styles.contactInfo}>
            <div className={styles.contactItem}>
              <Mail size={16} />
              <span>{resumeData.email}</span>
            </div>
            <div className={styles.contactItem}>
              <Phone size={16} />
              <span>{resumeData.phone}</span>
            </div>
            <div className={styles.contactItem}>
              <MapPin size={16} />
              <span>{resumeData.address}</span>
            </div>
          </div>
        </div>

        {/* Summary Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <User size={18} />
            <span>Summary</span>
          </h2>
          <p className={styles.summary}>{resumeData.summary}</p>
        </div>

        {/* Education Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <GraduationCap size={18} />
            <span>Education</span>
          </h2>
          {resumeData.education.map((edu, index) => (
            <div key={index} className={styles.educationItem}>
              <div className={styles.educationHeader}>
                <h3 className={styles.degree}>{edu.degree}</h3>
                <span className={styles.date}>{edu.date}</span>
              </div>
              <div className={styles.university}>{edu.university}</div>
              <div className={styles.gpa}>GPA: {edu.gpa}</div>
            </div>
          ))}
        </div>

        {/* Experience Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <Briefcase size={18} />
            <span>Experience</span>
          </h2>
          {resumeData.experience.map((exp, index) => (
            <div key={index} className={styles.experienceItem}>
              <div className={styles.experienceHeader}>
                <h3 className={styles.position}>{exp.position}</h3>
                <span className={styles.date}>{exp.date}</span>
              </div>
              <div className={styles.company}>{exp.company}</div>
              <p className={styles.description}>{exp.description}</p>
            </div>
          ))}
        </div>

        {/* Projects Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <FileText size={18} />
            <span>Projects</span>
          </h2>          {resumeData.projects?.map((project, index) => (
            <div key={index} className={styles.projectItem}>
              <h3 className={styles.projectName}>{project.name}</h3>
              <p className={styles.projectDescription}>{project.description}</p>
              <div className={styles.technologies}>
                <strong>Technologies:</strong> {project.technologies}
              </div>
            </div>
          ))}
        </div>

        {/* Skills Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span>Skills</span>
          </h2>
          <div className={styles.skillsContainer}>
            {resumeData.skills.map((skill, index) => (
              <span key={index} className={styles.skill}>{skill}</span>
            ))}
          </div>
        </div>

        {/* Languages Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <span>Languages</span>
          </h2>
          <div className={styles.languagesContainer}>
            {resumeData.languages.map((lang, index) => (
              <div key={index} className={styles.language}>
                <span className={styles.languageName}>{lang.language}</span>
                <span className={styles.proficiency}>({lang.proficiency})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ResumeModal;
