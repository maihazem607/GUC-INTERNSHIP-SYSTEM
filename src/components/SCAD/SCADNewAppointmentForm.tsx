import React, { useState } from 'react';
import styles from '../Appointments/NewAppointmentForm.module.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
  { id: '1', name: 'Sarah Johnson', email: 'sarah.johnson@student.guc.edu' },
  { id: '2', name: 'Mohammed Ali', email: 'mohammed.ali@student.guc.edu' },
  { id: '3', name: 'Emily Rodriguez', email: 'emily.rodriguez@student.guc.edu' },
  { id: '4', name: 'Ahmed Hassan', email: 'ahmed.hassan@student.guc.edu' },
  { id: '5', name: 'Fatima Zahra', email: 'fatima.zahra@student.guc.edu' }
];

const purposes = [
  'Career Guidance',
  'Academic Progress Review',
  'Report Clarification',
  'Internship Feedback',
  'General Consultation'
];

const SCADNewAppointmentForm: React.FC<SCADNewAppointmentFormProps> = ({ onSubmit }) => {
  const [studentId, setStudentId] = useState(students[0].id);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [purpose, setPurpose] = useState(purposes[0]);
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ participantId: studentId, title: purpose, date, time, description });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>Select Student</h2>
      <select
        name="studentId"
        value={studentId}
        onChange={e => setStudentId(e.target.value)}
      >
        {students.map(s => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
      </select>

      <h2>Select Purpose</h2>
      <select
        name="purpose"
        value={purpose}
        onChange={e => setPurpose(e.target.value)}
      >
        {purposes.map(p => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>

      <h2>Choose Date & Time</h2>
      <input
        type="date"
        name="date"
        value={date}
        onChange={e => setDate(e.target.value)}
      />
      <input
        type="time"
        name="time"
        value={time}
        onChange={e => setTime(e.target.value)}
      />

      <h2>Description</h2>
      <textarea
        name="description"
        rows={4}
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Enter meeting details..."
      />

      <div className={styles.formActions}>
        <button type="button" onClick={() => window.history.back()}>
          <ChevronLeft /> Back
        </button>
        <button type="submit">
          Schedule <ChevronRight />
        </button>
      </div>
    </form>
  );
};

export default SCADNewAppointmentForm;
