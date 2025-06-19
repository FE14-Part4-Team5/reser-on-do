import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { ReactNode } from 'react';

interface ToastPortalProps {
  children: ReactNode;
}

const ToastPortal = ({ children }: ToastPortalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (typeof window === 'undefined') return null;

  const el = document.getElementById('toast-root');
  if (!el || !mounted) return null;

  return createPortal(children, el);
};

export default ToastPortal;
