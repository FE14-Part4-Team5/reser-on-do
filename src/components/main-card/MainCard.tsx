import styles from './MainCard.module.css';

import starIcon from '../../assets/icons/icon_active=0n.svg';
import fallbackImage from '@/assets/images/error-image.png';

const MainCard = ({
  bannerImageUrl,
  title,
  rating,
  reviewCount,
  currencySymbol,
  price,
  priceUnit,
  onClick,
}: MainCardProps) => {
  return (
    <div role="button" className={`${styles.mainCard} ${styles.hoverableCard}`} onClick={onClick}>
      <img
        src={bannerImageUrl || fallbackImage}
        alt={`체험 배너 - ${title}`}
        className={styles.img}
        loading="lazy"
        decoding="async"
        onError={e => (e.currentTarget.src = fallbackImage)}
      />
      <div className={styles.contentBox}>
        <div className={styles.title}>{title}</div>
        <div className={styles.ratingReview}>
          <img
            src={starIcon}
            alt="star icon"
            className={styles.star}
            onError={e => (e.currentTarget.src = fallbackImage)}
          />
          <div className={styles.rating}>{rating?.toFixed(1)}</div>
          <div className={styles.reviewCount}>({reviewCount})</div>
        </div>
        <div className={styles.price}>
          <div>{currencySymbol}</div>
          <div>{price.toLocaleString()}</div>
          <div className={styles.priceIn}>{priceUnit}</div>
        </div>
      </div>
    </div>
  );
};

export default MainCard;

export type MainCardProps = Activity & {
  onClick: () => void;
  priceUnit: string;
  currencySymbol: string;
};

export type Activity = {
  id?: number;
  userId?: number;
  title: string;
  description?: string;
  category?: string;
  price: number;
  address?: string;
  bannerImageUrl: string;
  rating: number;
  reviewCount: number;
  createdAt?: string;
  updatedAt?: string;
};
