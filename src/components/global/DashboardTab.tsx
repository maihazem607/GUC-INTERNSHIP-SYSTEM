import React from 'react';
import styles from './DashboardTab.module.css';

export interface TabItem {
  id: string;
  label: React.ReactNode;
  count?: number;
  icon?: React.ReactNode;
}

interface DashboardTabProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

/**
 * A generic dashboard tab navigation component with enhanced styling
 * 
 * @param props.tabs - Array of tab items with id, label, optional count, and optional icon
 * @param props.activeTab - ID of the currently active tab
 * @param props.onTabChange - Function called when a tab is clicked
 * @param props.className - Optional additional CSS class name
 */
const DashboardTab: React.FC<DashboardTabProps> = ({ 
  tabs, 
  activeTab, 
  onTabChange,
  className = ''
}) => {
  
  return (
    <div className={`${styles.tabNavigation} ${className}`}>
      {tabs.map((tab) => {        const isActive = activeTab === tab.id;
        
        return (
          <button 
            key={tab.id}
            className={`${styles.tabButton} ${isActive ? styles.activeTab : ''}`}
            onClick={() => onTabChange(tab.id)}
            aria-selected={isActive}
            role="tab"
          >
            {tab.icon && <span className={styles.tabIcon}>{tab.icon}</span>}
            {tab.label} 
            {tab.count !== undefined && (
              <span className={styles.tabCount}>
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default DashboardTab;
