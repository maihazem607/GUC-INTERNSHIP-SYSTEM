import React, { useState, useEffect } from 'react';
import styles from './SCADNewAppointmentForm.module.css';
import { CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';

interface NewAppointmentFormProps {
  onSubmit: (appointmentData: any) => Promise<void>;
}

// Types for calendar
interface TimeSlot {
  id: string;
  time: string;
  isAvailable: boolean;
}

interface Student {
  id: string;
  name: string;
  gpa: number;
  imageUrl?: string;
}

const NewAppointmentForm: React.FC<NewAppointmentFormProps> = ({ onSubmit }) => {
  // Initial student list for selection
  const initialStudents: Student[] = [
    { id: '1', name: 'Alice Johnson', gpa: 3.85 },
    { id: '2', name: 'Bob Smith', gpa: 3.72 },
    { id: '3', name: 'Catherine Lee', gpa: 3.95 }
  ];

  // Visit purpose options
  const visitPurposes = [
    'Career Guidance',
    'Report Clarification',
    'Academic Advising',
    'Internship Consultation',
    'Other'
  ];

  // Current step of form process
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: visitPurposes[0],
    participantId: '',
    participantName: '',
    date: '',
    time: '',
    description: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');

  // Student list and search state
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [searchInput, setSearchInput] = useState('');
  const availableStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    // Handle checkbox special case
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: checkbox.checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error on change
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    // Ensure a student is selected
    if (!formData.participantId) {
      errors.participantId = 'Please select a student';
      setCurrentStep(1);
      return errors;
    }

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }

    if (!formData.date) {
      errors.date = 'Date is required';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        errors.date = 'Date cannot be in the past';
      }
    }

    if (!formData.time) {
      errors.time = 'Time is required';
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Format time for display and add status
      const formattedData = {
        ...formData,
        time: `${formData.time} - ${incrementTimeByOneHour(formData.time)}`,
        status: 'waiting-approval'
      };
      await onSubmit(formattedData);
      // Reset form after successful submission
      setFormData({
        title: visitPurposes[0],
        participantId: '',
        participantName: '',
        date: '',
        time: '',
        description: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to increment time by one hour for end time
  const incrementTimeByOneHour = (timeString: string): string => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const newHours = (hours + 1) % 24;

    return `${newHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  // Function to generate calendar data
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // Get first day of month and last day
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // Get day of week for first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDayOfMonth.getDay();

    // Array to store all days to display
    const days = [];

    // Add days from previous month to fill in first week
    const daysFromPrevMonth = firstDayOfWeek;
    const prevMonth = new Date(year, month, 0); // Last day of previous month
    for (let i = daysFromPrevMonth; i > 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonth.getDate() - i + 1),
        currentMonth: false,
        disabled: true
      });
    }

    // Add all days from current month
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const date = new Date(year, month, day);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      days.push({
        date,
        currentMonth: true,
        disabled: date < today
      });
    }

    // Add days from next month to complete the calendar grid (6 rows x 7 days)
    const daysToAdd = 42 - days.length;
    for (let day = 1; day <= daysToAdd; day++) {
      days.push({
        date: new Date(year, month + 1, day),
        currentMonth: false,
        disabled: true
      });
    }

    return days;
  };

  // Generate mock time slots for a given date
  const generateTimeSlots = (date: Date) => {
    if (!date) return [];

    // Start with all possible time slots from 9 AM to 5 PM
    const slots: TimeSlot[] = [];
    for (let hour = 9; hour <= 16; hour++) {
      // Skip 12-1 PM for lunch
      if (hour === 12) continue;

      const timeStr = `${hour.toString().padStart(2, '0')}:00`;
      const halfTimeStr = `${hour.toString().padStart(2, '0')}:30`;

      // Randomly determine if slot is available (for demo)
      const isRandomlyAvailable = () => Math.random() > 0.3;

      slots.push({
        id: `slot-${hour}-00`,
        time: timeStr,
        isAvailable: isRandomlyAvailable()
      });

      slots.push({
        id: `slot-${hour}-30`,
        time: halfTimeStr,
        isAvailable: isRandomlyAvailable()
      });
    }

    return slots;
  };

  // Handle month navigation
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prevMonth => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(newMonth.getMonth() + (direction === 'next' ? 1 : -1));
      return newMonth;
    });
  };

  // Update time slots when date is selected
  useEffect(() => {
    if (selectedDate) {
      const slots = generateTimeSlots(selectedDate);
      setAvailableTimeSlots(slots);

      // Format date for form field
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setFormData(prev => ({
        ...prev,
        date: formattedDate
      }));
    }
  }, [selectedDate]);

  // Handle time slot selection
  const handleTimeSlotSelect = (slot: TimeSlot) => {
    if (!slot.isAvailable) return;

    setSelectedTimeSlot(slot.id);
    setFormData(prev => ({
      ...prev,
      time: slot.time
    }));
  };

  // Handle date selection
  const handleDateSelect = (day: any) => {
    if (day.disabled) return;

    setSelectedDate(day.date);
    setSelectedTimeSlot(''); // Reset time selection
  };

  return (
    <form className={styles.appointmentForm} onSubmit={handleSubmit}>
      {/* Left panel - Form content */}
      <div className={styles.formContent}>
        {/* Back link - only shown in step 2 */}
        {currentStep === 2 && (
          <a href="#" className={styles.backLink} onClick={(e) => {
            e.preventDefault();
            // Go back to step 1 instead of navigating away
            setCurrentStep(1);
          }}>
            <span className={styles.backIcon}>←</span> Back to list
          </a>
        )}

        <h2>Schedule New Appointment</h2>

        {currentStep === 1 ? (
          /* Step 1: Select a student */
          <>
            <div className={styles.sectionTitle}>Select a Student</div>

            <div className={styles.formGroup}>
              <label htmlFor="searchInput">Search Students</label>
              <input
                id="searchInput"
                name="searchInput"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by name..."
              />
            </div>

            <div className={styles.studentCards}>
              {availableStudents.length > 0 ? (
                availableStudents.map(student => (
                  <div
                    key={student.id}
                    className={`${styles.studentCard} ${formData.participantId === student.id ? styles.selectedStudent : ''}`}
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        participantId: student.id,
                        participantName: student.name
                      }));

                      // Clear any participant selection errors when a student is clicked
                      if (formErrors.participantId) {
                        setFormErrors(prev => ({
                          ...prev,
                          participantId: ''
                        }));
                      }
                    }}
                  >
                    <div className={styles.studentDetails}>
                      <h3>{student.name}</h3>
                      <span className={styles.studentGPA}>GPA: {student.gpa.toFixed(2)}</span>
                    </div>
                    {formData.participantId === student.id && (
                      <div className={styles.selectedIndicator}>
                        <CheckCircle size={16} color="#10b981" />
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className={styles.noStudentsMessage}>
                  No students found
                </div>
              )}
            </div>

            {formErrors.participantId && (
              <div className={styles.errorMessage} style={{ marginTop: '10px' }}>
                {formErrors.participantId}
              </div>
            )}
            <div className={`${styles.formActions} ${styles.formActionsLeft}`}>  {/* align continue button left */}
              <button
                type="button"
                className={styles.submitButton}
                disabled={!formData.participantId}
                onClick={() => {
                  // Validate selection before proceeding
                  if (!formData.participantId) {
                    setFormErrors(prev => ({
                      ...prev,
                      participantId: 'Please select a student to continue'
                    }));
                    return;
                  }

                  // Clear any existing errors and proceed to next step
                  setFormErrors({});
                  setCurrentStep(2);
                }}
              >
                Continue
              </button>
            </div>
          </>
        ) : (
          /* Step 2: Enter appointment details */
          <>
            {/* Selected Participant Information */}
            {formData.participantId && (
              <div className={styles.participantInfo}>
                <div className={styles.selectedStudentCard}>
                  <div className={styles.selectedStudentDetails}>
                    <h3>{formData.participantName}</h3>
                  </div>

                  <button
                    type="button"
                    className={styles.changeButton}
                    onClick={() => setCurrentStep(1)}
                  >
                    Change
                  </button>
                </div>
              </div>
            )}

            <div className={styles.sectionDivider}></div>

            {/* Appointment Details Section */}
            <div className={styles.sectionTitle}>Appointment Details</div>
            <div className={styles.formGroup}>
              <label htmlFor="title">Purpose of your visit</label>
              <select
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={formErrors.title ? styles.inputError : ''}
              >
                {visitPurposes.map((purpose) => (
                  <option key={purpose} value={purpose}>
                    {purpose}
                  </option>
                ))}
              </select>
              {formErrors.title && <span className={styles.errorMessage}>{formErrors.title}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description">Additional details</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Describe what you'd like to discuss in this meeting..."
                className={formErrors.description ? styles.inputError : ''}
              />
              {formErrors.description && <span className={styles.errorMessage}>{formErrors.description}</span>}
            </div>

            <div className={styles.formActions}>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting || !formData.date || !formData.time}
              >
                {isSubmitting ? 'Submitting...' : 'Book an appointment'}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Right panel - Time slot selection (only shown in step 2) */}
      {currentStep === 2 && (
        <div className={styles.timeSlotContainer}>
          {/* Calendar navigation */}
          <div className={styles.calendarHeader}>
            <div className={styles.monthDisplay}>
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
            <div className={styles.calendarNavigation}>
              <button
                className={styles.navButton}
                onClick={() => navigateMonth('prev')}
                type="button"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                className={styles.navButton}
                onClick={() => navigateMonth('next')}
                type="button"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className={styles.weekdayHeader}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className={styles.weekday}>{day}</div>
            ))}
          </div>

          {/* Calendar days */}
          <div className={styles.datePicker}>
            {generateCalendarDays().map((day, index) => {
              const isToday = day.date.toDateString() === new Date().toDateString();
              const isSelected = selectedDate && day.date.toDateString() === selectedDate.toDateString();

              const dateClasses = `${styles.dateCell} 
                ${day.disabled ? styles.disabledDate : ''} 
                ${!day.currentMonth ? styles.otherMonth : ''}
                ${isToday ? styles.currentDate : ''}
                ${isSelected ? styles.selectedDate : ''}
              `;

              return (
                <div
                  key={`day-${index}`}
                  className={dateClasses}
                  onClick={() => !day.disabled && handleDateSelect(day)}
                >
                  {day.date.getDate()}
                </div>
              );
            })}
          </div>

          {/* Time slot selection */}
          {selectedDate ? (
            <>
              <div className={styles.timeSlotHeader}>
                Time slots for {selectedDate.toLocaleDateString('en-US', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short'
                })}
              </div>
              <div className={styles.timeSlots}>
                {availableTimeSlots.length > 0 ? (
                  availableTimeSlots.map((slot) => (
                    <div
                      key={slot.id}
                      className={`${styles.timeSlot} 
                        ${!slot.isAvailable ? styles.disabledTimeSlot : ''} 
                        ${selectedTimeSlot === slot.id ? styles.selectedTimeSlot : ''}`
                      }
                      onClick={() => handleTimeSlotSelect(slot)}
                    >
                      {slot.time}
                    </div>
                  ))
                ) : (
                  <div className={styles.noTimeSlotsMessage}>
                    No available time slots for this date
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className={styles.timeSlotHeader}>
              Please select a date to view available time slots
            </div>
          )}
        </div>
      )}
    </form>
  );
};

export default NewAppointmentForm;
