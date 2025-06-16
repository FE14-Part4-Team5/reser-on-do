import MainCard from '@/components/main-card/MainCard';
import useViewPortSize from '@/hooks/useViewPortSize';
import useHorizontalScroll from '@/hooks/useHorizontalScroll';
import IconRight from '@/assets/icons/icon_arrow_right.svg?react';
import IconLeft from '@/assets/icons/icon_back.svg?react';
import styles from './HorizontalCardList.module.css';

import type { MainCardProps } from '@/components/main-card/MainCard';

interface HorizontalCardListProps {
  cardList: MainCardProps[];
}

const HorizontalCardList = ({ cardList }: HorizontalCardListProps) => {
  const { viewportSize } = useViewPortSize();
  const { scrollRef, scroll } = useHorizontalScroll<HTMLDivElement>();

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
