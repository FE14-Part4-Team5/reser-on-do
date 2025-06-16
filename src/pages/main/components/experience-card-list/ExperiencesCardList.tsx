import MainCard from '@/components/main-card/MainCard';
import styles from './ExperienceCardList.module.css';

import type { MainCardProps } from '@/components/main-card/MainCard';

interface ExperiencesCardListProps {
  cardList: MainCardProps[];
}

const ExperiencesCardList = ({ cardList }: ExperiencesCardListProps) => {
  return (
    <div className={styles.wrapper}>
      {cardList.map(card => (
        <MainCard key={card.id} {...card} />
      ))}
    </div>
  );
};

export default ExperiencesCardList;
