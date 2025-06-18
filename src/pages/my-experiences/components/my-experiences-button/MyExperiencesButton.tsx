import { Link } from 'react-router-dom';

import clsx from 'clsx';

import styles from './MyExperiencesButton.module.css';

type Props = {
  children: React.ReactNode;
  variant: 'edit' | 'delete';
  onClick?: () => void;
  to?: string;
};

const MyExperiencesButton = ({ children, variant, onClick, to }: Props) => {
  const buttonClass = clsx(styles.button, styles[variant]);

  if (to) {
    return (
      <Link
        to={to}
        role="button"
        className={buttonClass}
        onClick={e => {
          e.stopPropagation();
          onClick?.();
        }}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      className={buttonClass}
      onClick={e => {
        e.stopPropagation();
        onClick?.();
      }}
      type="button"
    >
      {children}
    </button>
  );
};

export default MyExperiencesButton;
