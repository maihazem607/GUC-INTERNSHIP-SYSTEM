import React from 'react';
import InternshipDetailsModal from '../internships/InternshipDetailsModal';
import { Internship } from '../internships/types';

interface CompanyInternshipDetailsModalProps {
  internship: Internship;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onAddTestApplication?: () => void;
}

/**
 * A wrapper component around InternshipDetailsModal specifically for the Company context
 * This allows showing the applications count in the Company page without modifying the base modal.
 */
const CompanyInternshipDetailsModal: React.FC<CompanyInternshipDetailsModalProps> = ({
  internship,
  onClose,
  onEdit,
  onDelete,
  onAddTestApplication
}) => {
  return (
    <InternshipDetailsModal
      internship={{
        ...internship,
        // Ensure applicationsCount gets passed here, as it might be in the internship object
        // already from the convertToInternshipFormat function
        applicationsCount: internship.applicationsCount
      }}
      onClose={onClose}
      onEdit={onEdit}
      onDelete={onDelete}
      additionalActions={onAddTestApplication && (
        <button 
          style={{ 
            background: '#4caf50', 
            color: 'white', 
            border: 'none', 
            padding: '8px 12px', 
            borderRadius: '4px', 
            cursor: 'pointer',
            marginRight: '8px' 
          }} 
          onClick={onAddTestApplication}
        >
          Add Test Application
        </button>
      )}
    />
  );
};

export default CompanyInternshipDetailsModal;
