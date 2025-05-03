import React from 'react';
import styles from './FilterSidebar.module.css';

interface FilterSidebarProps {
  activeFilters: {
    category: string;
    type: string;
    status: string;
  };
  handleFilterChange: (filterType: string, value: string) => void;
  categories: string[];
  types: string[];
  statuses: string[];
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  activeFilters,
  handleFilterChange,
  categories,
  types,
  statuses
}) => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarContent}>
        <div className={styles.filterSection}>
          <h3 className={styles.filterHeading}>Filters</h3>
          
          {/* Category Filter */}
          <div className={styles.filterGroup}>
            <h4 className={styles.filterGroupTitle}>Category</h4>
            {categories.map((category, index) => (
              <label key={index} className={styles.filterCheckbox}>
                <input 
                  type="radio" 
                  name="category" 
                  checked={activeFilters.category === category} 
                  onChange={() => handleFilterChange('category', category)}
                /> 
                {category}
              </label>
            ))}
          </div>

          {/* Type Filter */}
          <div className={styles.filterGroup}>
            <h4 className={styles.filterGroupTitle}>Type</h4>
            {types.map((type, index) => (
              <label key={index} className={styles.filterCheckbox}>
                <input 
                  type="radio" 
                  name="type" 
                  checked={activeFilters.type === type} 
                  onChange={() => handleFilterChange('type', type)}
                /> 
                {type}
              </label>
            ))}
          </div>

          {/* Status Filter */}
          <div className={styles.filterGroup}>
            <h4 className={styles.filterGroupTitle}>Status</h4>
            {statuses.map((status, index) => (
              <label key={index} className={styles.filterCheckbox}>
                <input 
                  type="radio" 
                  name="status" 
                  checked={activeFilters.status === status} 
                  onChange={() => handleFilterChange('status', status)}
                /> 
                {status}
              </label>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;