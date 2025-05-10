import React, { ReactNode } from 'react';
import styles from './Modal.module.css';

interface ModalProps {
  onClose: () => void;
  title: string;
  children: ReactNode;
  width?: number | string;
  actions?: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, title, children, width = "600px", actions }) => {
  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div 
        className={styles.modalContent} 
        onClick={e => e.stopPropagation()} 
        style={{ maxWidth: width }}
      >
        <button className={styles.closeButton} onClick={onClose}>×</button>
        
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{title}</h2>
        </div>
        
        {children}
        
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
