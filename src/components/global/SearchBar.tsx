import React from 'react';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  setSearchTerm,
  placeholder = "Search..."
}) => {
  return (
    <div className={styles.searchBarContainer}>
      <div className={styles.searchInputWrapper}>
        <span className={styles.searchIcon}>🔍</span>        <input 
          type="text" 
          className={styles.searchInput} 
          placeholder={placeholder} 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          suppressHydrationWarning
        />
        {searchTerm && (          <button 
            className={styles.clearSearchButton}
            onClick={() => setSearchTerm('')}
            suppressHydrationWarning
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;