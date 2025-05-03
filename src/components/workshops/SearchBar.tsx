import React from 'react';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className={styles.searchBarContainer}>
      <div className={styles.searchInputWrapper}>
        <span className={styles.searchIcon}>🔍</span>
        <input 
          type="text" 
          className={styles.searchInput} 
          placeholder="Search by workshop title or host..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button 
            className={styles.clearSearchButton}
            onClick={() => setSearchTerm('')}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;