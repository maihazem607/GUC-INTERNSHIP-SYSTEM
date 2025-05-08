import React from "react";
import styles from "./CompanyDetailsModal.module.css";

export interface CompanyDetailsModalProps {
  name: string;
  industry: string;
  description: string;
  contactPerson: string;
  email: string;
  phone: string;
  applicationDate: string;
  status: "pending" | "accepted" | "rejected";
  onClose: () => void;
  onAccept?: () => void;
  onReject?: () => void;
}

const CompanyDetailsModal: React.FC<CompanyDetailsModalProps> = ({
  name,
  industry,
  description,
  contactPerson,
  email,
  phone,
  applicationDate,
  status,
  onClose,
  onAccept,
  onReject
}) => (
  <div className={styles.modalBackdrop}>
    <div className={styles.modalContent}>
      <button className={styles.closeButton} onClick={onClose}>&times;</button>
      <div className={styles.modalHeader}>
        <h2 className={styles.modalTitle}>{name}</h2>
        <div className={styles.modalCompany}>
          <span className={styles.modalCompanyName}>{industry}</span>
        </div>
      </div>
      <div className={styles.modalInfo}>
        <div className={styles.modalInfoItem}>
          <div className={styles.modalInfoLabel}>Contact Person</div>
          <div className={styles.modalInfoValue}>{contactPerson}</div>
        </div>
        <div className={styles.modalInfoItem}>
          <div className={styles.modalInfoLabel}>Email</div>
          <div className={styles.modalInfoValue}>{email}</div>
        </div>
        <div className={styles.modalInfoItem}>
          <div className={styles.modalInfoLabel}>Phone</div>
          <div className={styles.modalInfoValue}>{phone}</div>
        </div>
        <div className={styles.modalInfoItem}>
          <div className={styles.modalInfoLabel}>Application Date</div>
          <div className={styles.modalInfoValue}>{applicationDate}</div>
        </div>
        <div className={styles.modalInfoItem}>
          <div className={styles.modalInfoLabel}>Status</div>
          <div className={styles.modalInfoValue}>{status}</div>
        </div>
      </div>
      <div className={styles.modalDescription}>
        <h3>Description</h3>
        <p>{description}</p>
      </div>
      <div className={styles.modalActions}>
        {status === "pending" && (
          <>
            {onAccept && <button className={styles.applyButton} onClick={onAccept}>Accept Application</button>}
            {onReject && <button className={styles.applyButton} style={{backgroundColor:'#e74c3c'}} onClick={onReject}>Reject Application</button>}
          </>
        )}
      </div>
    </div>
  </div>
);

export default CompanyDetailsModal;
