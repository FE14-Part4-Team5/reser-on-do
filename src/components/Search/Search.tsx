import React, { useState } from 'react';
import styles from './Search.module.css';
import Button from '../Button/Button';
import SearchIcon from '../../assets/icons/icon_search.svg';

interface SearchProps {
  explaination?: string;
  placeholder?: string;
  onSearch?: (query: string) => void;
  buttonText?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const Search = ({
  explaination = '무엇을 체험하고 싶으신가요?',
  placeholder = '내가 원하는 체험은 ',
  onSearch,
  buttonText = '검색하기',
  value,
  onChange,
}: SearchProps) => {
  const [internalValue, setInternalValue] = useState('');
  const searchQuery = value ?? internalValue;
  const setSearchQuery = onChange ?? setInternalValue;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchClick = () => {
    const trimmed = searchQuery.trim();
    if (trimmed && onSearch) {
      onSearch(trimmed);
    }
  };

  return (
    <div className={styles.searchContainer}>
      <div className={styles.explainationContainer}>{explaination}</div>
      <div className={styles.searchInputContainer}>
        <img
          src={SearchIcon}
          alt="돋보기 아이콘"
          width={24}
          height={24}
          className={styles.searchIcon}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={styles.searchInput}
        />
        <Button
          variant="primary"
          className={styles.searchButton}
          onClick={handleSearchClick}
          isActive={!!searchQuery.trim()}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
};

export default Search;
