import React from 'react';
import styles from './InternshipPostModal.module.css';
import Modal from '../global/Modal';
import { InternshipPost } from './types';

interface InternshipPostModalProps {
  post: Omit<InternshipPost, 'id' | 'postedDate' | 'applicationsCount'>;
  isEditing: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onChange: (post: Omit<InternshipPost, 'id' | 'postedDate' | 'applicationsCount'>) => void;
}

const InternshipPostModal: React.FC<InternshipPostModalProps> = ({ 
  post, 
  isEditing, 
  onClose, 
  onSubmit,
  onChange
}) => {
  // State to track if we're using custom values
  const [isCustomDepartment, setIsCustomDepartment] = React.useState(false);
  const [isCustomDuration, setIsCustomDuration] = React.useState(false);
  const [customDepartment, setCustomDepartment] = React.useState("");
  const [customDuration, setCustomDuration] = React.useState("");

  React.useEffect(() => {
    // Check if the initial department value is custom
    if (post.department && !["Engineering", "Marketing", "Design", "Business", "HR"].includes(post.department)) {
      setIsCustomDepartment(true);
      setCustomDepartment(post.department);
    }
    
    // Check if the initial duration value is custom
    if (post.duration && !["1 month", "2 months", "3 months", "6 months", ""].includes(post.duration)) {
      setIsCustomDuration(true);
      setCustomDuration(post.duration);
    }
  }, []);  const handleRemoveSkill = (index: number) => {
    onChange({
      ...post,
      skillsRequired: post.skillsRequired.filter((_, i) => i !== index)
    });
  };  
  
  // Handle department change
  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "Other") {
      setIsCustomDepartment(true);
      onChange({...post, department: customDepartment || ""});
    } else {
      setIsCustomDepartment(false);
      onChange({...post, department: value});
    }
  };

  // Handle duration change
  const handleDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "Other") {
      setIsCustomDuration(true);
      onChange({...post, duration: customDuration || ""});
    } else {
      setIsCustomDuration(false);
      onChange({...post, duration: value});
    }
  };
  
  // Handle custom department input
  const handleCustomDepartmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomDepartment(e.target.value);
    onChange({...post, department: e.target.value});
  };

  // Handle custom duration input
  const handleCustomDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomDuration(e.target.value);
    onChange({...post, duration: e.target.value});
  };
  
  // Check if all required fields are filled
  const canSubmit = post.title && post.description && post.duration;

  // For debugging purposes
  React.useEffect(() => {
    console.log("Form validation:", {
      title: !!post.title,
      description: !!post.description,
      duration: !!post.duration,
      formValid: canSubmit
    });
  }, [post.title, post.description, post.duration, canSubmit]);  return (
    <Modal
      title={isEditing ? 'Edit Internship Post' : 'Create Internship Post'}
      onClose={onClose}
      width="800px"
    >    <div className={`${styles.postForm} ${styles.fadeInAnimation}`}>
        <div className={styles.formContent}>          <div className={styles.helperText} style={{ marginBottom: '25px', fontSize: '14px', color: '#666', backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '10px', borderLeft: '4px solid #e74c3c', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            Fields marked with <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>*</span> are required
          </div>

          <div className={styles.sectionHeading}>Basic Information</div>
          
          <div className={styles.formField}>
            <label className={`${styles.label} ${styles.requiredField}`}>Title</label>
            <input
              type="text"
              className={styles.input}
              value={post.title}
              onChange={(e) => onChange({...post, title: e.target.value})}
              placeholder="e.g. Frontend Developer Intern"
              required
              autoFocus
            />
            <div className={styles.helperText}>This will be displayed as the main title of your internship post</div>
          </div>
          
          <div className={styles.formField}>
            <label className={`${styles.label} ${styles.requiredField}`}>Description</label>
            <textarea
              className={styles.textarea}
              rows={4}
              maxLength={500}
              value={post.description}
              onChange={(e) => onChange({...post, description: e.target.value})}
              placeholder="Describe the internship role, responsibilities, and what candidates can expect to learn"
              required
            />
            <div className={styles.helperText} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Be clear and concise about expectations and responsibilities</span>
              <span>{post.description?.length || 0}/500</span>
            </div>
          </div>
            <div className={styles.sectionHeading}>Internship Details</div>
            <div className={styles.formRow}>
            <div className={styles.formField}>
              <label className={styles.label}>Department</label>
              <select
                className={styles.select}
                value={isCustomDepartment ? "Other" : post.department}
                onChange={handleDepartmentChange}
              >
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
                <option value="Design">Design</option>
                <option value="Business">Business</option>
                <option value="HR">HR</option>
                <option value="Technology">Technology</option>
                <option value="Other">Other</option>
              </select>
              {isCustomDepartment && (
                <input
                  type="text"
                  className={styles.input}
                  value={post.department}
                  onChange={handleCustomDepartmentChange}
                  placeholder="Specify department"
                  style={{ marginTop: '12px' }}
              />              )}
            </div>          
            <div className={styles.formField}>
              <label className={`${styles.label} ${styles.requiredField}`}>Duration</label>
              <select
                className={styles.select}
                value={isCustomDuration ? "Other" : post.duration}
                onChange={handleDurationChange}
                required
              >
                <option value="">Select duration</option>
                <option value="1 month">1 month</option>
                <option value="2 months">2 months</option>
                <option value="3 months">3 months</option>
                <option value="6 months">6 months</option>
                <option value="Other">Other</option>
              </select>
              {isCustomDuration && (
                <input
                  type="text"
                  className={styles.input}
                  value={post.duration}
                  onChange={handleCustomDurationChange}
                  placeholder="Specify duration (e.g. 4 months)"                  style={{ marginTop: '12px' }}
                />
              )}
              <div className={styles.helperText}>How long will this internship position last?</div>
            </div>
          </div>
            <div className={styles.formField}>
            <label className={styles.label}>Application Deadline</label>
            <input
              type="date"
              className={styles.input}
              value={post.deadline.toISOString().substr(0, 10)}
              onChange={(e) => onChange({...post, deadline: new Date(e.target.value)})}
            />
            <div className={styles.helperText}>Last day students can apply for this position</div>
          </div>
          
          <div className={styles.formField}>            <div className={styles.checkboxGroup} style={{ marginTop: '10px' }}>
              <input
                type="checkbox"
                id="isPaid"
                checked={post.isPaid}
                onChange={(e) => onChange({...post, isPaid: e.target.checked})}
              />
              <label htmlFor="isPaid" className={styles.checkboxLabel}>Paid Internship</label>
            </div>
            
            {post.isPaid && (
              <div className={styles.formField} style={{ marginTop: '12px' }}>
                <label className={styles.label}>Salary (USD)</label>
                <input
                  type="number"
                  className={styles.input}
                  value={post.expectedSalary || ''}
                  onChange={(e) => onChange({...post, expectedSalary: Number(e.target.value) || undefined})}
                  placeholder="e.g. 1500"
                />
                <div className={styles.helperText}>Monthly compensation in USD</div>
              </div>
            )}
          </div>
          
          <div className={styles.sectionHeading}>Skills & Qualifications</div>
          
          <div className={styles.formField}>
            <label className={styles.label}>Skills needed for this position</label>            <div className={styles.helperText} style={{ marginBottom: '15px', fontSize: '14px' }}>
              Select relevant skills that applicants should possess
            </div>
            
            <div className={styles.skillsContainer}>              {post.skillsRequired.length === 0 && (
                <div style={{ color: '#888', padding: '15px 0', fontStyle: 'italic', textAlign: 'center' }}>
                  No skills selected yet. Choose from the dropdown below.
                </div>
              )}
              
              {post.skillsRequired.map((skill, index) => (
                <div key={index} className={styles.skillTag}>
                  {skill}
                  <button 
                    className={styles.removeSkill}
                    onClick={() => handleRemoveSkill(index)}
                    type="button"
                    title="Remove skill"
                    aria-label={`Remove ${skill} skill`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            
            <div className={styles.skillsSelectionContainer} style={{ marginTop: '12px' }}>              <select 
                className={styles.skillSelect}
                onChange={(e) => {
                  if (e.target.value && !post.skillsRequired.includes(e.target.value)) {
                    onChange({
                      ...post,
                      skillsRequired: [...post.skillsRequired, e.target.value]
                    });
                    e.target.value = ""; // Reset select after adding
                  }
                }}
                value=""
                style={{ maxWidth: '100%' }}
              >
                <option value="">+ Add a required skill...</option>
                
                <optgroup label="Programming Languages">
                  <option value="JavaScript">JavaScript</option>
                  <option value="TypeScript">TypeScript</option>
                  <option value="Python">Python</option>
                  <option value="Java">Java</option>
                  <option value="C#">C#</option>
                  <option value="C++">C++</option>
                  <option value="PHP">PHP</option>
                  <option value="Ruby">Ruby</option>
                  <option value="Swift">Swift</option>
                  <option value="Kotlin">Kotlin</option>
                  <option value="Go">Go</option>
                  <option value="Rust">Rust</option>
                </optgroup>
                
                <optgroup label="Frontend Technologies">
                  <option value="React">React</option>
                  <option value="Angular">Angular</option>
                  <option value="Vue.js">Vue.js</option>
                  <option value="Next.js">Next.js</option>
                  <option value="HTML5">HTML5</option>
                  <option value="CSS3">CSS3</option>
                  <option value="SASS/SCSS">SASS/SCSS</option>
                  <option value="Tailwind CSS">Tailwind CSS</option>
                  <option value="Bootstrap">Bootstrap</option>
                  <option value="Material UI">Material UI</option>
                  <option value="Redux">Redux</option>
                </optgroup>
                
                <optgroup label="Backend Technologies">
                  <option value="Node.js">Node.js</option>
                  <option value="Express.js">Express.js</option>
                  <option value="Django">Django</option>
                  <option value="Flask">Flask</option>
                  <option value="Spring Boot">Spring Boot</option>
                  <option value="Laravel">Laravel</option>
                  <option value="ASP.NET">ASP.NET</option>
                  <option value="Ruby on Rails">Ruby on Rails</option>
                  <option value="GraphQL">GraphQL</option>
                  <option value="REST API">REST API</option>
                </optgroup>
                  <optgroup label="Database">
                  <option value="MySQL">MySQL</option>
                  <option value="PostgreSQL">PostgreSQL</option>
                  <option value="MongoDB">MongoDB</option>
                  <option value="SQLite">SQLite</option>
                  <option value="Oracle">Oracle</option>
                  <option value="SQL Server">SQL Server</option>
                  <option value="Firebase">Firebase</option>
                  <option value="Redis">Redis</option>
                  <option value="Elasticsearch">Elasticsearch</option>
                </optgroup>
                
                <optgroup label="DevOps & Cloud">
                  <option value="Docker">Docker</option>
                  <option value="Kubernetes">Kubernetes</option>
                  <option value="AWS">AWS</option>
                  <option value="Azure">Azure</option>
                  <option value="Google Cloud">Google Cloud</option>
                  <option value="Jenkins">Jenkins</option>
                  <option value="GitHub Actions">GitHub Actions</option>
                  <option value="Terraform">Terraform</option>
                  <option value="Linux">Linux</option>
                </optgroup>
                
                <optgroup label="UI/UX Design">
                  <option value="Figma">Figma</option>
                  <option value="Adobe XD">Adobe XD</option>
                  <option value="Sketch">Sketch</option>
                  <option value="Prototyping">Prototyping</option>
                  <option value="Wireframing">Wireframing</option>
                  <option value="User Research">User Research</option>
                  <option value="Usability Testing">Usability Testing</option>
                </optgroup>
                
                <optgroup label="Data Science">
                  <option value="Machine Learning">Machine Learning</option>
                  <option value="Data Analysis">Data Analysis</option>
                  <option value="Pandas">Pandas</option>
                  <option value="NumPy">NumPy</option>
                  <option value="TensorFlow">TensorFlow</option>
                  <option value="PyTorch">PyTorch</option>
                  <option value="R">R</option>
                  <option value="Data Visualization">Data Visualization</option>
                  <option value="Power BI">Power BI</option>
                  <option value="Tableau">Tableau</option>
                </optgroup>
                
                <optgroup label="Mobile Development">
                  <option value="iOS Development">iOS Development</option>
                  <option value="Android Development">Android Development</option>
                  <option value="React Native">React Native</option>
                  <option value="Flutter">Flutter</option>
                  <option value="Xamarin">Xamarin</option>
                  <option value="Mobile UI Design">Mobile UI Design</option>
                </optgroup>
                
                <optgroup label="Testing & QA">
                  <option value="Jest">Jest</option>
                  <option value="Mocha">Mocha</option>
                  <option value="Cypress">Cypress</option>
                  <option value="Selenium">Selenium</option>
                  <option value="JUnit">JUnit</option>
                  <option value="Manual Testing">Manual Testing</option>
                  <option value="Automated Testing">Automated Testing</option>
                  <option value="Test Planning">Test Planning</option>
                </optgroup>
                
                <optgroup label="Soft Skills">
                  <option value="Communication">Communication</option>
                  <option value="Teamwork">Teamwork</option>
                  <option value="Problem Solving">Problem Solving</option>
                  <option value="Time Management">Time Management</option>
                  <option value="Critical Thinking">Critical Thinking</option>
                  <option value="Adaptability">Adaptability</option>
                  <option value="Leadership">Leadership</option>
                  <option value="Creativity">Creativity</option>
                  <option value="Attention to Detail">Attention to Detail</option>
                  <option value="Project Management">Project Management</option>
                </optgroup>
                
                <optgroup label="Business Skills">
                  <option value="Agile Methodology">Agile Methodology</option>
                  <option value="Scrum">Scrum</option>
                  <option value="Presentation Skills">Presentation Skills</option>
                  <option value="Client Communication">Client Communication</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Content Creation">Content Creation</option>
                  <option value="SEO">SEO</option>
                  <option value="Business Analysis">Business Analysis</option>
                </optgroup>              </select>
            </div>
          </div>
        </div>
        {/* Form actions are rendered outside the main form to prevent disappearing */}
        <div className={styles.fixedActionBar}>
          <button 
            className={styles.cancelButton} 
            onClick={onClose}
          >
            Cancel
          </button>
            <button            id="createPostButton"
            className={`${styles.submitButton} ${!post.title || !post.description || !post.duration ? styles.disabledButton : ''}`}
            onClick={() => {
              console.log('Submit button clicked');
              console.log('Form data:', { title: post.title, description: post.description, duration: post.duration });
              if (post.title && post.description && post.duration) {
                onSubmit();
              } else {
                console.log("Cannot submit form: missing required fields");
                alert("Please fill in all required fields marked with *");
              }
            }}
            disabled={!post.title || !post.description || !post.duration}
            type="button"
          >
            {isEditing ? 'Update Internship' : 'Post Internship'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default InternshipPostModal;
