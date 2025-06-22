import { useState } from 'react';
import clsx from 'clsx';
import 'react-calendar/dist/Calendar.css';

import IconPlus from '@/assets/icons/icon_plus.svg?react';
import IconMinus from '@/assets/icons/icon_minus.svg?react';
import useViewPortSize from '@/hooks/useViewPortSize';
import { formatDateToYMD } from '@/utils/datetime';

import styles from './Reservation.module.css';
import CalendarSection from '../calendar/CalendarSection';
import ReservationFooter from './ReservationFooter';
import Button from '../Button/Button';

interface ScheduleSlot {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
}

interface ReservationProps {
  price: number;
  schedules: ScheduleSlot[];
  onReserve: (payload: { scheduleId: number; headCount: number }) => void;
}

const Reservation = ({ price, schedules, onReserve }: ReservationProps) => {
  const { viewportSize } = useViewPortSize();

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeId, setSelectedTimeId] = useState<number | null>(null);
  const [headCount, setHeadCount] = useState(0);

  const handleCountChange = (count: number) => {
    setHeadCount(prev => Math.max(0, prev + count));
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setSelectedTimeId(null);
    setHeadCount(0);
  };

  const selectedDateStr = selectedDate ? formatDateToYMD(selectedDate) : '';
  const filteredSchedules = schedules.filter(s => s.date === selectedDateStr);
  const scheduledDates = new Set(schedules.map(s => s.date));

  const total = price * headCount;
  const selectedTime = schedules.find(s => s.id === selectedTimeId);

  return (
    <section className={styles.reservation}>
      {viewportSize !== 'desktop' && calendarOpen && (
        <div className={styles.dimmedBackground} onClick={() => setCalendarOpen(false)} />
      )}
      {(viewportSize === 'desktop' || calendarOpen) && (
        <div className={styles.container}>
          {viewportSize === 'desktop' && (
            <div className={styles.price}>
              ₩ {price.toLocaleString()}
              <span className={styles.unit}>/ 인</span>
            </div>
          )}

          <CalendarSection
            selectedDate={selectedDate}
            onChange={handleDateChange}
            scheduledDates={scheduledDates}
          />

          <div className={styles.contentBox}>
            {selectedDate && filteredSchedules.length !== 0 && (
              <div className={styles.countWrapper}>
                <div className={styles.countLabel}>참여 인원 수</div>
                <div className={styles.counterBox}>
                  <button onClick={() => handleCountChange(-1)}>
                    <IconMinus width={20} height={20} />
                  </button>
                  <span className={styles.countValue}>{headCount}</span>
                  <button onClick={() => handleCountChange(1)}>
                    <IconPlus width={20} height={20} />
                  </button>
                </div>
              </div>
            )}

            <div className={styles.timeWrapper}>
              <div className={styles.timeLabel}>예약 가능한 시간</div>
              <div className={styles.timeList}>
                {selectedDate ? (
                  filteredSchedules.length > 0 ? (
                    filteredSchedules.map(time => (
                      <button
                        key={time.id}
                        className={clsx(
                          styles.timeButton,
                          selectedTimeId === time.id && styles.timeButtonSelected
                        )}
                        onClick={() => setSelectedTimeId(time.id)}
                      >
                        {time.startTime} ~ {time.endTime}
                      </button>
                    ))
                  ) : (
                    <p className={styles.timeNotice}>해당 날짜에 예약 가능한 시간이 없습니다.</p>
                  )
                ) : (
                  <p className={styles.timeNotice}>날짜를 선택해주세요.</p>
                )}
              </div>
            </div>

            {viewportSize === 'desktop' && (
              <div className={styles.totalRow}>
                <div className={styles.totalPrice}>
                  총 합계
                  <strong>₩ {total.toLocaleString()}</strong>
                </div>
                <Button
                  variant="primary"
                  isActive={
                    !(
                      selectedTime === undefined ||
                      filteredSchedules.length === 0 ||
                      headCount === 0
                    )
                  }
                  onClick={() => {
                    if (selectedTimeId && headCount > 0) {
                      onReserve({ scheduleId: selectedTimeId, headCount });
                    }
                  }}
                  className={styles.inlineReserveButton}
                >
                  예약하기
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {viewportSize !== 'desktop' &&
        (calendarOpen ? (
          <div className={styles.reserveButtonWrapper}>
            <Button
              variant="primary"
              isActive={!!selectedTime && headCount > 0}
              onClick={() => setCalendarOpen(false)}
              className={styles.reserveButton}
            >
              확인
            </Button>
          </div>
        ) : (
          <ReservationFooter
            price={price}
            headCount={headCount}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onClickDateSelect={() => setCalendarOpen(true)}
            onClickReserve={() => {
              if (selectedTimeId && headCount > 0) {
                onReserve({ scheduleId: selectedTimeId, headCount });
              }
            }}
          />
        ))}
    </section>
  );
};

export default Reservation;
