import { Link } from 'react-router-dom';

import cryImage from '@/assets/images/cry.png';

import styles from './ErrorUI.module.css';

const ErrorUI = ({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) => {
  return (
    <div className={styles.error}>
      <div className={styles.errorText}>{error.message}</div>
      <img src={cryImage} alt="슬퍼하는 구름 이미지" className={styles.cryImage} />
      <div className={styles.button}>
        <Link onClick={resetErrorBoundary} to={'/'} className={styles.errorRetry}>
          홈으로
        </Link>
        <button onClick={resetErrorBoundary} className={styles.errorRetry}>
          다시 시도
        </button>
      </div>
    </div>
  );
};

export default ErrorUI;
