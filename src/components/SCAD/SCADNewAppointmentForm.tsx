import React, { useState, useEffect } from 'react';
import styles from '../Appointments/NewAppointmentForm.module.css';
import { ChevronLeft, ChevronRight, Search as SearchIcon, CheckCircle } from 'lucide-react';

interface SCADNewAppointmentFormProps {
  onSubmit: (data: any) => Promise<void>;
}

// Sample SCAD students list
const students = [
  { id: '1', name: 'Sarah Johnson', email: 'sarah.johnson@student.guc.edu', gpa: 3.8 },
  { id: '2', name: 'Mohammed Ali', email: 'mohammed.ali@student.guc.edu', gpa: 3.5 },
  { id: '3', name: 'Emily Rodriguez', email: 'emily.rodriguez@student.guc.edu', gpa: 3.7 },
  { id: '4', name: 'Ahmed Hassan', email: 'ahmed.hassan@student.guc.edu', gpa: 3.9 },
  { id: '5', name: 'Fatima Zahra', email: 'fatima.zahra@student.guc.edu', gpa: 3.6 }
];

const purposes = [
  'Career Guidance',
  'Academic Progress Review',
  'Report Clarification',
  'Internship Feedback',
  'General Consultation'
];

// Add types and utility for time slots
interface TimeSlot {
  id: string;
  time: string;
  isAvailable: boolean;
}

const generateTimeSlots = (date: Date): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const isRandomlyAvailable = () => Math.random() > 0.3;
  for (let hour = 9; hour <= 17; hour++) {
    const timeStr = `${hour.toString().padStart(2, '0')}:00`;
    const halfTimeStr = `${hour.toString().padStart(2, '0')}:30`;
    slots.push({ id: `slot-${hour}-00`, time: timeStr, isAvailable: isRandomlyAvailable() });
    slots.push({ id: `slot-${hour}-30`, time: halfTimeStr, isAvailable: isRandomlyAvailable() });
  }
  return slots;
};

const SCADNewAppointmentForm: React.FC<SCADNewAppointmentFormProps> = ({ onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [purpose, setPurpose] = useState(purposes[0]);
  const [description, setDescription] = useState('');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const filteredStudents = students.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  useEffect(() => {
    if (selectedDate) {
      const slots = generateTimeSlots(selectedDate);
      setAvailableTimeSlots(slots);
    }
  }, [selectedDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ participantId: selectedStudentId, title: purpose, date: selectedDate?.toISOString().split('T')[0] || '', time: selectedTimeSlot, description });
  };

  return (
    <form className={styles.appointmentForm} onSubmit={handleSubmit}>
      <div className={styles.formContent}>
        {currentStep === 1 && (
          <>
            <h2>Select Student</h2>
            <div className={styles.formGroup}>
              <label>Search Students</label>
              <div className={styles.formRow}>
                <SearchIcon />
                <input type="text" placeholder="Search students..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
            </div>
            <div className={styles.advisorCards}>
              {filteredStudents.length > 0 ? (
                filteredStudents.map(student => (
                  <div key={student.id}
                    className={`${styles.advisorCard} ${student.id === selectedStudentId ? styles.selectedAdvisor : ''}`}
                    onClick={() => {
                      setSelectedStudentId(student.id);
                      setFormErrors({});
                    }}>
                    <div className={styles.advisorDetails}>
                      <h3>{student.name}</h3>
                      <span className={styles.advisorTitle}>{`GPA: ${student.gpa.toFixed(2)}`}</span>
                    </div>
                    {student.id === selectedStudentId && (
                      <div className={styles.selectedIndicator}><CheckCircle size={16} color="#10b981" /></div>
                    )}
                  </div>
                ))
              ) : (
                <div className={styles.noAdvisorsMessage}>No students found</div>
              )}
            </div>
            <div className={styles.formActions}>
              <button type="button" onClick={() => window.history.back()}>
                <ChevronLeft /> Back
              </button>
              <button type="button" onClick={() => {
                if (!selectedStudentId) {
                  setFormErrors({ participant: 'Please select a student' });
                  return;
                }
                setCurrentStep(2);
              }}>
                Continue <ChevronRight />
              </button>
            </div>
          </>
        )}

        {currentStep === 2 && (
          <>
            <a href="#" className={styles.backLink} onClick={e => { e.preventDefault(); setCurrentStep(1); }}>
              <ChevronLeft /> Change Student
            </a>
            <h2>Choose Date & Time</h2>
            <div className={styles.formGroup}>
              <label htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
                onChange={e => setSelectedDate(new Date(e.target.value))}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="timeSlot">Time Slot</label>
              <select
                id="timeSlot"
                name="timeSlot"
                value={selectedTimeSlot}
                onChange={e => setSelectedTimeSlot(e.target.value)}
              >
                {availableTimeSlots.map(slot => (
                  <option key={slot.id} value={slot.time}>{slot.time}</option>
                ))}
              </select>
            </div>

            <div className={styles.sectionDivider}></div>
            <h2>Appointment Details</h2>
            <div className={styles.formGroup}>
              <label htmlFor="purpose">Purpose</label>
              <select id="purpose" name="purpose" value={purpose} onChange={e => setPurpose(e.target.value)}>
                {purposes.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="description">Description</label>
              <textarea id="description" name="description" rows={4} value={description} onChange={e => setDescription(e.target.value)} placeholder="Enter meeting details..." />
            </div>
            <div className={styles.formActions}>
              <button type="button" onClick={() => setCurrentStep(1)}>
                <ChevronLeft /> Back
              </button>
              <button type="submit" disabled={!selectedTimeSlot}>
                Schedule <ChevronRight />
              </button>
            </div>
          </>
        )}
      </div>
    </form>
  );
};

export default SCADNewAppointmentForm;
