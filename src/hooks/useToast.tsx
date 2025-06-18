import { create } from 'zustand';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const useToast = create<ToastState>(set => ({
  toasts: [],
  showToast: async ({ label, className, iconSrc, style }) => {
    const id = Date.now();
    set(state => ({
      toasts: [...state.toasts, { id, label, className, iconSrc, style, isVisible: true }],
    }));

    await delay(600);
    set(state => ({
      toasts: state.toasts.map(toast => (toast.id === id ? { ...toast, isVisible: false } : toast)),
    }));

    await delay(500);
    set(state => ({
      toasts: state.toasts.filter(toast => toast.id !== id),
    }));
  },
  removeToast: id =>
    set(state => ({
      toasts: state.toasts.filter(toast => toast.id !== id),
    })),
}));

interface ToastItem {
  id: number;
  label: string;
  isVisible: boolean;
  className?: string;
  iconSrc?: string;
  style?: React.CSSProperties;
}

interface ToastState {
  toasts: ToastItem[];
  showToast: (params: {
    label: string;
    className?: string;
    iconSrc?: string;
    style?: React.CSSProperties;
  }) => Promise<void>;
  removeToast: (id: number) => void;
}
