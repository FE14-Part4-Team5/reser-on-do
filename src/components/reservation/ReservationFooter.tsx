import styles from './ReservationFooter.module.css';

import { formatDateTime } from '@/utils/datetime';
import type { ReservationFooterProps } from '@/types/reservation';
import Button from '../Button/Button';

export const ReservationFooter = ({
  price,
  headCount,
  selectedDate,
  selectedTime,
  onClickDateSelect,
  onClickReserve,
}: ReservationFooterProps) => {
  return (
    <div className={styles.footerWrapper}>
      <div className={styles.footerTopRow}>
        <div className={styles.priceText}>
          ₩ {price.toLocaleString()}
          <span className={styles.priceUnit}>/ 1명</span>
        </div>
        <button className={styles.dateSelector} onClick={onClickDateSelect}>
          {selectedDate && selectedTime
            ? formatDateTime(selectedDate, selectedTime.startTime, selectedTime.endTime)
            : '날짜 선택하기'}
        </button>
      </div>
      <Button
        variant="primary"
        isActive={!(selectedTime === undefined || headCount === 0)}
        onClick={onClickReserve}
        className={styles.confirmButton}
      >
        예약하기
      </Button>
    </div>
  );
};

export default ReservationFooter;
