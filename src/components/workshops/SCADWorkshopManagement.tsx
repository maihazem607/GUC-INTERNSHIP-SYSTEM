import React, { useState, useEffect } from 'react';
import styles from './SCADWorkshopManagement.module.css';
import { Workshop, AgendaItem, SpeakerProfile } from './types-enhanced';
import { 
  PlusCircle, Edit, Trash2, Calendar, Clock, Users, 
  X, ChevronDown, ChevronUp, Globe, Tag, Save
} from 'lucide-react';
import Image from 'next/image';
import { useNotification } from '@/components/global/NotificationSystemAdapter';

interface SCADWorkshopManagementProps {
  workshops: Workshop[];
  onCreateWorkshop: (workshop: Omit<Workshop, 'id'>) => Promise<void>;
  onUpdateWorkshop: (workshop: Workshop) => Promise<void>;
  onDeleteWorkshop: (id: number) => Promise<void>;
}

const defaultAgendaItem: AgendaItem = {
  id: 1,
  title: '',
  description: '',
  startTime: '10:00 AM',
  endTime: '10:30 AM',
};

const SCADWorkshopManagement: React.FC<SCADWorkshopManagementProps> = ({
  workshops,
  onCreateWorkshop,
  onUpdateWorkshop,
  onDeleteWorkshop
}) => {
  const { showNotification } = useNotification();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [workshopList, setWorkshopList] = useState<Workshop[]>(workshops);
  const [formExpandedSections, setFormExpandedSections] = useState({
    basicInfo: true,
    timeAndLocation: true,
    speakerAndAgenda: false,
    marketing: false
  });
  
  // Form state
  const [formData, setFormData] = useState<Omit<Workshop, 'id'>>({
    title: '',
    host: '',
    description: '',
    date: '',
    time: '',
    duration: '',
    type: 'live',
    status: 'upcoming',
    isRegistered: false,
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    speakerBio: '',
    agenda: [defaultAgendaItem],
    registrationLimit: 50,
    registrationCount: 0,
    location: '',
    isPublished: false,
    logo: '/logos/GUCInternshipSystemLogo.png',
  });

  // Update local workshop list when props change
  useEffect(() => {
    setWorkshopList(workshops);
  }, [workshops]);

  // Reset form when creating a new workshop
  const handleCreateNew = () => {
    setFormData({
      title: '',
      host: '',
      description: '',
      date: '',
      time: '',
      duration: '',
      type: 'live',
      status: 'upcoming',
      isRegistered: false,
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      speakerBio: '',
      agenda: [defaultAgendaItem],
      registrationLimit: 50,
      registrationCount: 0,
      location: '',
      isPublished: false,
      logo: '/logos/GUCInternshipSystemLogo.png',
    });
    setSelectedWorkshop(null);
    setShowCreateForm(true);
    setShowEditForm(false);
    
    // Expand basic sections
    setFormExpandedSections({
      basicInfo: true,
      timeAndLocation: true,
      speakerAndAgenda: false,
      marketing: false
    });
  };

  // Handle edit workshop
  const handleEditWorkshop = (workshop: Workshop) => {
    setSelectedWorkshop(workshop);
    
    // Pre-populate form with workshop data
    setFormData({
      title: workshop.title,
      host: workshop.host,
      description: workshop.description,
      date: workshop.date,
      time: workshop.time,
      duration: workshop.duration,
      type: workshop.type,
      status: workshop.status,
      isRegistered: workshop.isRegistered,
      startDate: workshop.startDate || workshop.date,
      startTime: workshop.startTime || workshop.time.split(' - ')[0],
      endDate: workshop.endDate || workshop.date,
      endTime: workshop.endTime || workshop.time.split(' - ')[1],
      speakerBio: workshop.speakerBio || '',
      agenda: workshop.agenda || [defaultAgendaItem],
      registrationLimit: workshop.registrationLimit || 50,
      registrationCount: workshop.registrationCount || 0,
      location: workshop.location || '',
      isPublished: workshop.isPublished !== false, // Default to true if not specified
      logo: workshop.logo || '/logos/GUCInternshipSystemLogo.png',
    });
    
    setShowEditForm(true);
    setShowCreateForm(false);
    
    // Expand all sections when editing
    setFormExpandedSections({
      basicInfo: true,
      timeAndLocation: true,
      speakerAndAgenda: true,
      marketing: true
    });
  };

  // Handle delete workshop
  const handleDeleteWorkshop = async (workshop: Workshop) => {
    if (!confirm(`Are you sure you want to delete "${workshop.title}"? This action cannot be undone.`)) {
      return;
    }
    
    setIsLoading(true);
    try {
      await onDeleteWorkshop(workshop.id);
      
      // Update local state
      setWorkshopList(prev => prev.filter(w => w.id !== workshop.id));
      
      showNotification({
        message: `Workshop "${workshop.title}" deleted successfully`,
        type: 'info',
      });
    } catch (error) {
      console.error('Error deleting workshop:', error);
      showNotification({
        message: 'Failed to delete workshop. Please try again.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Format times
      const formattedData = {
        ...formData,
        time: `${formData.startTime} - ${formData.endTime}`,
        date: formData.startDate, // Use start date as main date
      };
      
      // Calculate duration in hours and minutes
      if (formData.startTime && formData.endTime) {
        // Simple calculation assuming format like "2:00 PM"
        const start = new Date(`01/01/2023 ${formData.startTime}`);
        const end = new Date(`01/01/2023 ${formData.endTime}`);
        
        // If end is earlier than start, assume it's the next day
        if (end < start) {
          end.setDate(end.getDate() + 1);
        }
        
        const diffInHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        const hours = Math.floor(diffInHours);
        const minutes = Math.round((diffInHours - hours) * 60);
        
        formattedData.duration = hours > 0 
          ? minutes > 0 
            ? `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} min` 
            : `${hours} hour${hours !== 1 ? 's' : ''}`
          : `${minutes} min`;
      }
      
      if (selectedWorkshop) {
        // Update existing workshop
        await onUpdateWorkshop({ ...formattedData, id: selectedWorkshop.id });
        
        // Update local state
        setWorkshopList(prev => 
          prev.map(w => w.id === selectedWorkshop.id ? { ...formattedData, id: selectedWorkshop.id } : w)
        );
        
        showNotification({
          message: `Workshop "${formattedData.title}" updated successfully`,
          type: 'success',
        });
      } else {
        // Create new workshop
        await onCreateWorkshop(formattedData);
        
        // In a real app, the API would return the new ID
        // For now, we'll simulate it with a random ID
        const newId = Math.max(0, ...workshopList.map(w => w.id)) + 1;
        
        // Update local state
        setWorkshopList(prev => [...prev, { ...formattedData, id: newId }]);
        
        showNotification({
          message: `Workshop "${formattedData.title}" created successfully`,
          type: 'success',
        });
      }
      
      // Reset forms
      setShowCreateForm(false);
      setShowEditForm(false);
      setSelectedWorkshop(null);
    } catch (error) {
      console.error('Error saving workshop:', error);
      showNotification({
        message: 'Failed to save workshop. Please check your inputs and try again.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : value
    }));
  };

  // Handle agenda changes
  const handleAgendaChange = (index: number, field: keyof AgendaItem, value: string) => {
    setFormData(prev => {
      const updatedAgenda = [...(prev.agenda || [])];
      updatedAgenda[index] = {
        ...updatedAgenda[index],
        [field]: value
      };
      return { ...prev, agenda: updatedAgenda };
    });
  };

  // Add agenda item
  const addAgendaItem = () => {
    setFormData(prev => {
      const lastItem = prev.agenda?.[prev.agenda.length - 1];
      const newId = lastItem ? lastItem.id + 1 : 1;
      
      // Try to set reasonable default times based on the last item
      const newStartTime = lastItem ? lastItem.endTime : '10:00 AM';
      
      // Estimate end time 30 minutes after start time (simplified)
      const newEndTime = lastItem ? calculateTimeAfterMinutes(lastItem.endTime, 30) : '10:30 AM';
      
      return {
        ...prev,
        agenda: [
          ...(prev.agenda || []),
          {
            id: newId,
            title: '',
            description: '',
            startTime: newStartTime,
            endTime: newEndTime,
          }
        ]
      };
    });
  };

  // Simple time calculation helper
  const calculateTimeAfterMinutes = (time: string, minutesToAdd: number): string => {
    // This is a simplified implementation that works for common time formats
    // A more robust solution would use a library like date-fns
    try {
      const date = new Date(`01/01/2023 ${time}`);
      date.setMinutes(date.getMinutes() + minutesToAdd);
      
      // Format time back to AM/PM format
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes.toString().padStart(2, '0');
      
      return `${formattedHours}:${formattedMinutes} ${ampm}`;
    } catch (error) {
      console.error('Error calculating time:', error);
      return time; // Return original if calculation fails
    }
  };

  // Remove agenda item
  const removeAgendaItem = (index: number) => {
    setFormData(prev => {
      const updatedAgenda = [...(prev.agenda || [])];
      updatedAgenda.splice(index, 1);
      return { ...prev, agenda: updatedAgenda };
    });
  };

  // Toggle section expansion
  const toggleSection = (section: keyof typeof formExpandedSections) => {
    setFormExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Render workshop form
  const renderWorkshopForm = () => {
    const isEditing = !!selectedWorkshop;
    
    return (
      <form onSubmit={handleSubmit} className={styles.workshopForm}>
        <div className={styles.formHeader}>
          <h2>{isEditing ? 'Edit Workshop' : 'Create New Workshop'}</h2>
          <button 
            type="button" 
            className={styles.closeButton}
            onClick={() => {
              setShowCreateForm(false);
              setShowEditForm(false);
            }}
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Basic Information Section */}
        <div className={styles.formSection}>
          <div 
            className={styles.sectionHeader} 
            onClick={() => toggleSection('basicInfo')}
          >
            <h3>Basic Information</h3>
            {formExpandedSections.basicInfo ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
          
          {formExpandedSections.basicInfo && (
            <div className={styles.sectionContent}>
              <div className={styles.formGroup}>
                <label htmlFor="title">Workshop Title*</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter workshop title"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="description">Description*</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  placeholder="Provide a detailed description of the workshop"
                  rows={4}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="host">Host Organization/Company*</label>
                <input
                  type="text"
                  id="host"
                  name="host"
                  value={formData.host}
                  onChange={handleInputChange}
                  required
                  placeholder="Organization or company hosting the workshop"
                />
              </div>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="type">Workshop Type*</label>
                  <select 
                    id="type" 
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="live">Live Session</option>
                    <option value="recorded">Recorded</option>
                  </select>
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="status">Status*</label>
                  <select 
                    id="status" 
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="registrationLimit">Registration Limit</label>
                  <input
                    type="number"
                    id="registrationLimit"
                    name="registrationLimit"
                    value={formData.registrationLimit}
                    onChange={handleInputChange}
                    min={1}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Date, Time & Location Section */}
        <div className={styles.formSection}>
          <div 
            className={styles.sectionHeader} 
            onClick={() => toggleSection('timeAndLocation')}
          >
            <h3>Date, Time & Location</h3>
            {formExpandedSections.timeAndLocation ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
          
          {formExpandedSections.timeAndLocation && (
            <div className={styles.sectionContent}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="startDate">Start Date*</label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="startTime">Start Time*</label>
                  <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    value={formData.startTime?.replace(' AM', '').replace(' PM', '')}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="endDate">End Date*</label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="endTime">End Time*</label>
                  <input
                    type="time"
                    id="endTime"
                    name="endTime"
                    value={formData.endTime?.replace(' AM', '').replace(' PM', '')}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="location">Location / Meeting Link</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Physical venue or online meeting link"
                />
              </div>
            </div>
          )}
        </div>
        
        {/* Speaker & Agenda Section */}
        <div className={styles.formSection}>
          <div 
            className={styles.sectionHeader} 
            onClick={() => toggleSection('speakerAndAgenda')}
          >
            <h3>Speaker & Agenda</h3>
            {formExpandedSections.speakerAndAgenda ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
          
          {formExpandedSections.speakerAndAgenda && (
            <div className={styles.sectionContent}>
              <div className={styles.formGroup}>
                <label htmlFor="speakerBio">Speaker Biography</label>
                <textarea
                  id="speakerBio"
                  name="speakerBio"
                  value={formData.speakerBio}
                  onChange={handleInputChange}
                  placeholder="Provide information about the speaker(s)"
                  rows={3}
                />
              </div>
              
              <div className={styles.agendaSection}>
                <div className={styles.agendaHeader}>
                  <h4>Workshop Agenda</h4>
                  <button 
                    type="button" 
                    className={styles.addAgendaButton}
                    onClick={addAgendaItem}
                  >
                    <PlusCircle size={18} /> Add Item
                  </button>
                </div>
                
                {formData.agenda?.map((item, index) => (
                  <div key={item.id} className={styles.agendaItem}>
                    <div className={styles.agendaItemHeader}>
                      <h5>Agenda Item {index + 1}</h5>
                      {formData.agenda!.length > 1 && (
                        <button 
                          type="button" 
                          className={styles.removeAgendaButton}
                          onClick={() => removeAgendaItem(index)}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label>Title</label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handleAgendaChange(index, 'title', e.target.value)}
                        placeholder="e.g., Introduction, Main Topic, Q&A"
                      />
                    </div>
                    
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Start Time</label>
                        <input
                          type="text"
                          value={item.startTime}
                          onChange={(e) => handleAgendaChange(index, 'startTime', e.target.value)}
                          placeholder="e.g., 10:00 AM"
                        />
                      </div>
                      
                      <div className={styles.formGroup}>
                        <label>End Time</label>
                        <input
                          type="text"
                          value={item.endTime}
                          onChange={(e) => handleAgendaChange(index, 'endTime', e.target.value)}
                          placeholder="e.g., 10:30 AM"
                        />
                      </div>
                    </div>
                    
                    <div className={styles.formGroup}>
                      <label>Description</label>
                      <textarea
                        value={item.description || ''}
                        onChange={(e) => handleAgendaChange(index, 'description', e.target.value)}
                        placeholder="Brief description of this agenda item"
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Marketing & Visibility */}
        <div className={styles.formSection}>
          <div 
            className={styles.sectionHeader} 
            onClick={() => toggleSection('marketing')}
          >
            <h3>Marketing & Visibility</h3>
            {formExpandedSections.marketing ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
          
          {formExpandedSections.marketing && (
            <div className={styles.sectionContent}>
              <div className={styles.formGroup}>
                <label htmlFor="logo">Logo URL</label>
                <input
                  type="text"
                  id="logo"
                  name="logo"
                  value={formData.logo}
                  onChange={handleInputChange}
                  placeholder="URL for company/organization logo"
                />
                
                {formData.logo && (
                  <div className={styles.logoPreview}>
                    <Image 
                      src={formData.logo} 
                      alt="Logo preview" 
                      width={50} 
                      height={50}
                      onError={(e) => {
                        // If image fails to load, set a default
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = '/logos/GUCInternshipSystemLogo.png';
                      }}
                    />
                  </div>
                )}
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="isPublished" className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    id="isPublished"
                    name="isPublished"
                    checked={formData.isPublished}
                    onChange={(e) => handleInputChange(e as React.ChangeEvent<HTMLInputElement>)}
                  />
                  Publish workshop (visible to students)
                </label>
              </div>
            </div>
          )}
        </div>
        
        <div className={styles.formActions}>
          <button 
            type="button" 
            className={styles.cancelButton}
            onClick={() => {
              setShowCreateForm(false);
              setShowEditForm(false);
            }}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : (isEditing ? 'Update Workshop' : 'Create Workshop')}
          </button>
        </div>
      </form>
    );
  };
  return (
    <div className={styles.workshopManagement} id="workshop-management">
      {/* Management Header */}
      <div className={styles.managementHeader}>
        <div className={styles.managementHeaderLeft}>
          <h2>Workshop Management</h2>
          <button
            className={styles.backButton}
            onClick={() => {
              document.dispatchEvent(new CustomEvent('backToWorkshops'));
            }}
          >
            Back to Workshops
          </button>
        </div>
        <button
          className={styles.createButton}
          onClick={handleCreateNew}
          disabled={showCreateForm || showEditForm}
        >
          <PlusCircle size={18} /> Create Workshop
        </button>
      </div>
      
      {/* Workshop Forms */}
      {(showCreateForm || showEditForm) && renderWorkshopForm()}
      
      {/* Workshop List */}
      {!showCreateForm && !showEditForm && (
        <div className={styles.workshopList}>
          <div className={styles.workshopListHeader}>
            <div className={styles.column}>Title</div>
            <div className={styles.column}>Date & Time</div>
            <div className={styles.column}>Status</div>
            <div className={styles.column}>Type</div>
            <div className={styles.column}>Actions</div>
          </div>
          
          {workshopList.length === 0 ? (
            <div className={styles.noWorkshops}>
              <p>No workshops found. Click 'Create Workshop' to add your first workshop.</p>
            </div>
          ) : (
            workshopList.map(workshop => (
              <div key={workshop.id} className={styles.workshopItem}>
                <div className={styles.column}>
                  <div className={styles.workshopTitle}>
                    {workshop.logo && (
                      <Image 
                        src={workshop.logo} 
                        alt={`${workshop.host} logo`} 
                        width={24} 
                        height={24} 
                        className={styles.miniLogo}
                        onError={(e) => {
                          // If image fails to load, set a default
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = '/logos/GUCInternshipSystemLogo.png';
                        }}
                      />
                    )}
                    <span>{workshop.title}</span>
                  </div>
                  <div className={styles.workshopHost}>{workshop.host}</div>
                </div>
                
                <div className={styles.column}>
                  <div className={styles.dateTime}>
                    <Calendar size={14} className={styles.icon} />
                    <span>{workshop.date}</span>
                  </div>
                  <div className={styles.dateTime}>
                    <Clock size={14} className={styles.icon} />
                    <span>{workshop.time}</span>
                  </div>
                </div>
                
                <div className={styles.column}>
                  <span className={`${styles.statusBadge} ${styles[workshop.status]}`}>
                    {workshop.status}
                  </span>
                  {workshop.isPublished === false && (
                    <span className={styles.draftBadge}>Draft</span>
                  )}
                </div>
                
                <div className={styles.column}>
                  <span className={`${styles.typeBadge} ${styles[workshop.type]}`}>
                    {workshop.type === 'live' ? 'Live Session' : 'Recorded'}
                  </span>
                </div>
                
                <div className={styles.column}>
                  <div className={styles.actions}>
                    <button
                      className={styles.actionButton}
                      onClick={() => handleEditWorkshop(workshop)}
                      title="Edit workshop"
                    >
                      <Edit size={16} />
                    </button>
                    
                    <button
                      className={`${styles.actionButton} ${styles.deleteButton}`}
                      onClick={() => handleDeleteWorkshop(workshop)}
                      title="Delete workshop"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SCADWorkshopManagement;
