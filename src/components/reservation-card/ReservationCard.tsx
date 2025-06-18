import styles from './ReservationCard.module.css';

import StateBadge from '../state-badge/StateBadge';
import fallbackImage from '@/assets/images/error-image.png';

const ReservationCard = ({
  activity,
  status,
  date,
  dateDot,
  startTime,
  timedash,
  endTime,
  currencySymbol,
  totalPrice,
  headCount,
  headCountUnit,
  reviewSubmitted,
  reviewSubmittedButton,
  editReservationButton,
  cancelReservationButton,
}: ReservationCardProps) => {
  return (
    <div>
      <div className={styles.card}>
        <div className={styles.dateTabletMobile}>{date}</div>
        <div className={styles.contentsImageCard}>
          <div className={styles.contents}>
            <div>
              <StateBadge status={status} label={statusLabelMap[status]} />
            </div>
            <div className={styles.title}>{activity.title}</div>
            <div className={styles.time}>
              <div className={styles.datePc}>{date}</div>
              <div className={styles.dateDotPc}>{dateDot}</div>
              <div>{startTime}</div>
              <div>{timedash}</div>
              <div>{endTime}</div>
            </div>
            <div className={styles.priceGroup}>
              <div className={styles.priceUnit}>
                <div className={styles.currencySymbol}>{currencySymbol}</div>
                <div className={styles.totalPrice}>{totalPrice.toLocaleString()}</div>
                <div className={styles.headCount}>{headCount}</div>
                <div className={styles.headCountUnit}>{headCountUnit}</div>
              </div>
              <div className={styles.buttonsPc}>
                {status === 'pending' ? (
                  <div className={styles.editCancleButton}>
                    <div>{editReservationButton}</div>
                    <div>{cancelReservationButton}</div>
                  </div>
                ) : null}
                {!reviewSubmitted && status === 'completed' ? reviewSubmittedButton : null}
              </div>
            </div>
          </div>
          <div className={styles.imageParents}>
            <img
              src={activity.bannerImageUrl}
              alt={`배너 이미지- ${activity.title}`}
              className={styles.image}
              onError={e => (e.currentTarget.src = fallbackImage)}
            />
          </div>
        </div>

        <div className={styles.buttonsTabletMobile}>
          {status === 'pending' ? (
            <div className={styles.editCancleButton}>
              <div>{editReservationButton}</div>
              <div>{cancelReservationButton}</div>
            </div>
          ) : null}
          <div className={styles.reviewSubmittedButton}>
            {!reviewSubmitted && status === 'completed' ? reviewSubmittedButton : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationCard;

type ReservationCardProps = MyReservation & {
  currencySymbol: string;
  headCountUnit: string;
  editReservationButton: React.ReactNode;
  cancelReservationButton: React.ReactNode;
  reviewSubmittedButton: React.ReactNode;
  timedash: string;
  dateDot: string;
};

type MyReservation = {
  id?: number;
  teamId?: string;
  userId?: number;
  activity: {
    id: number;
    bannerImageUrl: string;
    title: string;
  };
  status: ReservationStatus;
  reviewSubmitted: boolean;
  totalPrice: number;
  headCount: number;
  date: string;
  startTime: string;
  endTime: string;
  createdAt?: string;
  updatedAt?: string;
};

type ReservationStatus = 'pending' | 'confirmed' | 'declined' | 'canceled' | 'completed';

const statusLabelMap = {
  pending: '예약 완료',
  confirmed: '예약 승인',
  declined: '예약 거절',
  canceled: '예약 취소',
  completed: '체험 완료',
};
