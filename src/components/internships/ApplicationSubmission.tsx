import React, { useState } from 'react';
import styles from './ApplicationSubmission.module.css';
import { Internship, DocumentInfo } from './types';

interface ApplicationSubmissionProps {
  internship: Internship;
  onSubmit: (application: {
    internshipId: number;
    documents: File[];
    additionalNotes?: string;
  }) => Promise<void>;
  onCancel: () => void;
}

const ApplicationSubmission: React.FC<ApplicationSubmissionProps