import React, { useState } from 'react';
import styles from './FilterSidebar.module.css';
import { Filter, ChevronDown, ChevronUp, X } from 'lucide-react';

interface FilterOption {
  title: string;
  options: string[];
  type: string;
  value: string;
  counts?: Record<string, number>;
}

interface FilterSidebarProps {
  filters: FilterOption[];
  onFilterChange: (filterType: string, value: string) => void;
  onClearFilters?: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  onClearFilters
}) => {
  const [expandedGroups, setExpandedGroups] = useState<Record<number, boolean>>(
    filters.reduce((acc, _, index) => ({ ...acc, [index]: true }), {})
  );

  const hasActiveFilters = filters.some(filter => filter.value !== '');

  const toggleGroup = (index: number) => {
    setExpandedGroups(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarContent}>
        <div className={styles.filterSection}>
          <h3 className={styles.filterHeading}>
            <Filter size={18} color="#4c51bf" style={{ marginRight: '8px' }} />
            Filters
          </h3>

          {filters.map((filter, filterIndex) => (
            <div key={filterIndex} className={styles.filterGroup}>
              <h4
                className={styles.filterGroupTitle}
                onClick={() => toggleGroup(filterIndex)}
                style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                {filter.title}
                {expandedGroups[filterIndex] ?
                  <ChevronUp size={16} color="#4c51bf" style={{ transition: 'all 0.3s ease' }} /> :
                  <ChevronDown size={16} color="#4c51bf" style={{ transition: 'all 0.3s ease' }} />
                }
              </h4>

              {expandedGroups[filterIndex] && filter.options.map((option, index) => (
                <label key={index} className={styles.filterCheckbox}>
                  <input
                    type="radio"
                    name={filter.type}
                    checked={filter.value === option}
                    onChange={() => onFilterChange(filter.type, option)}
                  />
                  <span style={{ flex: 1 }}>{option}</span>
                  {filter.counts && (
                    <span className={styles.filterCount}>{filter.counts[option] || 0}</span>
                  )}
                </label>
              ))}
            </div>
          ))}

          {hasActiveFilters && onClearFilters && (
            <button
              className={styles.clearFilters}
              onClick={onClearFilters}
            >
              <X size={14} style={{ marginRight: '5px' }} />
              Clear all filters
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;