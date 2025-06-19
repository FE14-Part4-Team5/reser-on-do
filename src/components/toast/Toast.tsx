import clsx from 'clsx';
import styles from './Toast.module.css';

const Toast = ({ label, className, iconSrc, style }: ToastProps) => {
  return (
    <div className={clsx(styles.toast, className)} style={style}>
      {iconSrc && <img src={iconSrc} className={styles.icon} />}
      <span>{label}</span>
    </div>
  );
};

export default Toast;

interface ToastProps {
  label: string;
  className?: string;
  iconSrc?: string;
  style?: React.CSSProperties;
}
