import React from "react";
import styles from "./SettingsCard.module.css";

export interface SettingsCardProps {
  cycleName: string;
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onSave: () => void;
}

const SettingsCard: React.FC<SettingsCardProps> = ({ cycleName, startDate, endDate, onStartDateChange, onEndDateChange, onSave }) => (
  <div className={styles.settingsCard}>
    <h1 className={styles.settingsTitle}>Internship Cycle Settings</h1>
    <div className={styles.settingsForm}>
      <div className={styles.formGroup}>
        <label htmlFor="cycleName">Current Cycle Name</label>
        <input
          type="text"
          id="cycleName"
          value={cycleName}
          className={styles.formInput}
          readOnly
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="startDate">Start Date</label>
        <input
          type="date"
          id="startDate"
          value={startDate}
          onChange={e => onStartDateChange(e.target.value)}
          className={styles.formInput}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="endDate">End Date</label>
        <input
          type="date"
          id="endDate"
          value={endDate}
          onChange={e => onEndDateChange(e.target.value)}
          className={styles.formInput}
        />
      </div>
      <button className={styles.saveButton} onClick={onSave}>
        Save Changes
      </button>
    </div>
  </div>
);

export default SettingsCard;
