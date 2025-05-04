import React from 'react';
import styles from './FilterSidebar.module.css';

interface FilterOption {
  title: string;
  options: string[];
  type: string;
  value: string;
}

interface FilterSidebarProps {
  filters: FilterOption[];
  onFilterChange: (filterType: string, value: string) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
}) => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarContent}>
        <div className={styles.filterSection}>
          <h3 className={styles.filterHeading}>Filters</h3>
          
          {filters.map((filter, filterIndex) => (
            <div key={filterIndex} className={styles.filterGroup}>
              <h4 className={styles.filterGroupTitle}>{filter.title}</h4>
              {filter.options.map((option, index) => (
                <label key={index} className={styles.filterCheckbox}>
                  <input 
                    type="radio" 
                    name={filter.type} 
                    checked={filter.value === option} 
                    onChange={() => onFilterChange(filter.type, option)}
                  /> 
                  {option}
                </label>
              ))}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;