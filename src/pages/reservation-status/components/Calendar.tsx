import { useEffect, useState, useRef } from 'react';
import styles from './Calendar.module.css';
import { CalendarModal } from './CalendarModal';
import { myActivitiesService } from '@/apis/myActivities';
import * as MyActivitiesType from '@/types/api/myActivitiesType';

interface CalendarProps {
  selectedActivityId: number | null;
}

const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export const Calendar = ({ selectedActivityId }: CalendarProps) => {
  const cellRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const [reservationDashboard, setReservationDashboard] = useState<
    MyActivitiesType.ReservationDashboardResponse[]
  >([]);

  const daysInMonth = new Date(year, month, 0).getDate();
  const startDay = new Date(year, month - 1, 1).getDay();

  const movePrevMonth = () => {
    setCurrentDate(new Date(year, month - 2, 1));
  };
  const moveNextMonth = () => {
    setCurrentDate(new Date(year, month, 1));
  };

  const fetchDashboard = async () => {
    if (!selectedActivityId) return;

    try {
      const response = await myActivitiesService.getReservationDashboard({
        activityId: selectedActivityId,
        year: year.toString(),
        month: month.toString().padStart(2, '0'),
      });
      setReservationDashboard(response);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [selectedActivityId, year, month]);

  const handleDateClick = (day: number) => {
    setSelectedDate(day);
  };

  const dateCells = [];

  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const daysInPrevMonth = new Date(prevYear, prevMonth, 0).getDate();

  for (let i = 0; i < startDay; i++) {
    const prevDay = daysInPrevMonth - (startDay - 1 - i);
    dateCells.push(
      <div key={`prev-${i}`} className={styles.adjacentMonthCell}>
        {prevDay}
      </div>
    );
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${year}-${month.toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
    const reservationForDay = reservationDashboard.find(item => item.date === dateStr);

    const pendingCount = reservationForDay?.reservations.pending ?? 0;
    const confirmedCount = reservationForDay?.reservations.confirmed ?? 0;
    const completedCount = reservationForDay?.reservations.completed ?? 0;

    const hasAnyReservation = pendingCount + confirmedCount + completedCount > 0;

    dateCells.push(
      <div
        key={i}
        className={styles.dateCell}
        onClick={() => handleDateClick(i)}
        ref={el => void (cellRefs.current[i] = el)}
      >
        <div className={styles.dateNumberWrapper}>
          <span>{i}</span>
          {hasAnyReservation && <span className={styles.dot} />}
        </div>

        <div className={styles.badgeContainer}>
          {completedCount > 0 && (
            <div className={`${styles.badge} ${styles.completed}`}>완료 {completedCount}</div>
          )}
          {pendingCount > 0 && (
            <div className={`${styles.badge} ${styles.pending}`}>예약 {pendingCount}</div>
          )}
          {confirmedCount > 0 && (
            <div className={`${styles.badge} ${styles.confirmed}`}>승인 {confirmedCount}</div>
          )}

          {completedCount === 0 && pendingCount === 0 && confirmedCount === 0 && (
            <div className={`${styles.badge} ${styles.placeholder}`}>&nbsp;</div>
          )}
        </div>
      </div>
    );
  }

  const totalCells = startDay + daysInMonth;
  const nextDays = Math.max(0, 35 - totalCells);

  for (let i = 1; i <= nextDays; i++) {
    dateCells.push(
      <div key={`next-${i}`} className={styles.adjacentMonthCell}>
        {i}
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <button onClick={movePrevMonth}>{'◀'}</button>
        <div>
          {year}년 {month}월
        </div>
        <button onClick={moveNextMonth}>{'▶'}</button>
      </div>
      <div className={styles.grid}>
        {days.map((d, i) => (
          <div key={`${d}-${i}`} className={styles.dayLabel}>
            {d}
          </div>
        ))}

        {dateCells}
      </div>
      {selectedDate && selectedActivityId && (
        <>
          <div className={styles.overlay}>
            <CalendarModal
              year={year}
              month={month}
              day={selectedDate}
              activityId={selectedActivityId}
              onClose={() => setSelectedDate(null)}
              onRefreshDashboard={fetchDashboard}
            />
          </div>

          <div
            className={styles.modalAbsolutePC}
            style={{
              top: cellRefs.current[selectedDate]?.offsetTop ?? 0,
              left: cellRefs.current[selectedDate]?.offsetLeft ?? 0,
            }}
          >
            <CalendarModal
              year={year}
              month={month}
              day={selectedDate}
              activityId={selectedActivityId}
              onClose={() => setSelectedDate(null)}
              onRefreshDashboard={fetchDashboard}
            />
          </div>
        </>
      )}
    </div>
  );
};
