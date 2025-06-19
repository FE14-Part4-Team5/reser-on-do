import Toast from '@/components/toast/Toast';
import ToastPortal from '@/components/toast/ToastPortal';

import { useToast } from '@/hooks/useToast';

import styles from './ToastContainer.module.css';

const ToastContainer = () => {
  const { toasts } = useToast();

  return (
    <ToastPortal>
      <div className={styles.toastContainer}>
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            label={toast.label}
            iconSrc={toast.iconSrc}
            className={toast.isVisible ? styles.toastEnter : styles.toastExit}
            style={toast.style}
          />
        ))}
      </div>
    </ToastPortal>
  );
};

export default ToastContainer;
