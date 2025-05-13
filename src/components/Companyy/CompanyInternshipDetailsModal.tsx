import React from 'react';
import InternshipDetailsModal from '../internships/InternshipDetailsModal';
import { Internship } from '../internships/types';

interface CompanyInternshipDetailsModalProps {
  internship: Internship;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

/**
 * A wrapper component around InternshipDetailsModal specifically for the Company context
 * This allows showing the applications count in the Company page without modifying the base modal.
 */
const CompanyInternshipDetailsModal: React.FC<CompanyInternshipDetailsModalProps> = ({
  internship,
  onClose,
  onEdit,
  onDelete
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
    />
  );
};

export default CompanyInternshipDetailsModal;
