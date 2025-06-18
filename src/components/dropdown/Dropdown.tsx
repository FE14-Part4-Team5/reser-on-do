import { useState } from 'react';
import styles from './Dropdown.module.css';

interface DropdownProps {
  label: string;
  options: string[];
  selected?: string;
  onSelect: (value: string) => void;
}

const Dropdown = ({ label, options, selected, onSelect }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(prev => !prev);
  };

  const handleOptionClick = (option: string) => {
    setIsOpen(false);
    onSelect(option);
  };

  return (
    <div>
      <button onClick={toggleDropdown} className={styles.dropdownButton}>
        {selected || label} ▼
      </button>
      {isOpen && (
        <ul className={styles.dropdownMenu}>
          {options.map(option => (
            <li
              key={option}
              className={styles.dropdownItem}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
