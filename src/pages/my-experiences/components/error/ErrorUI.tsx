import { Link } from 'react-router-dom';

import errorImage from '@/assets/images/error-image.png';

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
      <div className={styles.errorText}>
        {' '}
        {/[\u3131-\uD79D]/.test(error.message) ? error.message : '오류가 발생했습니다.'}
      </div>
      <img src={errorImage} alt="슬퍼하는 구름 이미지" className={styles.cryImage} />
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
