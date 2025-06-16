import { useRef } from 'react';

export type ScrollDirection = 'left' | 'right';

export default function useHorizontalScroll<T extends HTMLElement>() {
  const scrollRef = useRef<T>(null);

  const scroll = (direction: ScrollDirection) => {
    const container = scrollRef.current;
    if (!container) return;

    const cardElement = container.querySelector<HTMLElement>('*');
    if (!cardElement) return;

    const cardWidth = cardElement.offsetWidth;
    const gap = parseFloat(getComputedStyle(container).columnGap || '0');

    const scrollAmount = cardWidth + gap;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return { scrollRef, scroll };
}
