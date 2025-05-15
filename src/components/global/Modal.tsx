"use client";

import React, { ReactNode, useEffect } from 'react';
import styles from './Modal.module.css';

interface ModalProps {
  onClose: () => void;
  title: string;
  children: ReactNode;
  width?: number | string;
  actions?: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, title, children, width = "600px", actions }) => {
  // Prevent body scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Stop propagation for modal content clicks
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className={styles.modalBackdrop}
    >
      <div
        className={styles.modalContent}
        onClick={handleContentClick}
        style={{ maxWidth: width }}
      >
        <button className={styles.closeButton} onClick={onClose}>×</button>

        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{title}</h2>
        </div>

        <div className={styles.modalBody}>
          {children}
        </div>

        {actions && (
          <div className={styles.modalActions}>
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
