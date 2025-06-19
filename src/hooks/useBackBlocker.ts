import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const useBackBlocker = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      setIsModalOpen(true);
      window.history.pushState(null, '', window.location.href);
    };
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const closeModal = useCallback(() => setIsModalOpen(false), []);
  const confirmNavigation = useCallback(() => navigate('/my-experiences'), [navigate]);
  return { isModalOpen, closeModal, confirmNavigation };
};

export default useBackBlocker;
