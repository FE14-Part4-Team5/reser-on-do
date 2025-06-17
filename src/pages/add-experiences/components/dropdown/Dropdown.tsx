import styles from './Dropdown.module.css';

const Dropdown = ({ options, selected, onSelect }: DropdownProps) => {
  const handleClick = (option: string) => (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onSelect(option);
  };
  return (
    <div className={styles.root}>
      {options.map(option => (
        <div
          key={option}
          className={`${styles.item} ${selected === option ? styles.selected : ''}`}
          onClick={handleClick(option)}
        >
          {option}
        </div>
      ))}
    </div>
  );
};

export default Dropdown;

type DropdownProps = {
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
};
