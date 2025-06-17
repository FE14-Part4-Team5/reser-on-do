import MainCard from '@/components/main-card/MainCard';
import useViewPortSize from '@/hooks/useViewPortSize';
import useHorizontalScroll from '@/hooks/useHorizontalScroll';
import IconRight from '@/assets/icons/icon_arrow_right.svg?react';
import IconLeft from '@/assets/icons/icon_back.svg?react';
import styles from './HorizontalCardList.module.css';
import { useInView } from 'react-intersection-observer';
import type { MainCardProps } from '@/components/main-card/MainCard';
import { useEffect } from 'react';

interface HorizontalCardListProps {
  cardList: MainCardProps[];
  onLoadMore?: () => void;
  hasNext?: boolean;
  isLoading?: boolean;
}

const HorizontalCardList = ({
  cardList,
  onLoadMore,
  hasNext,
  isLoading,
}: HorizontalCardListProps) => {
  const { viewportSize } = useViewPortSize();
  const { scrollRef, scroll } = useHorizontalScroll<HTMLDivElement>();
  const { ref, inView } = useInView({ threshold: 0.5 });

  useEffect(() => {
    if (inView && hasNext && !isLoading) {
      onLoadMore?.();
    }
  }, [inView, hasNext, isLoading, onLoadMore]);
  return (
    <div className={styles.wrapper}>
      {viewportSize !== 'mobile' && (
        <button className={`${styles.arrowButton} ${styles.left}`} onClick={() => scroll('left')}>
          <IconLeft />
        </button>
      )}
      <div className={`${styles.scrollContainer}`} ref={scrollRef}>
        {cardList.map(card => (
          <MainCard key={card.id} {...card} />
        ))}
        {hasNext && <div ref={ref} className={styles.loadMoreTrigger} />}
        {isLoading && (
          <div className={styles.spinnerWrapper}>
            <span className={styles.spinner} />
          </div>
        )}
      </div>
      {viewportSize !== 'mobile' && (
        <button className={`${styles.arrowButton} ${styles.right}`} onClick={() => scroll('right')}>
          <IconRight />
        </button>
      )}
    </div>
  );
};

export default HorizontalCardList;
