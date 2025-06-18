import styles from './CalendarModal.module.css';
import { useEffect, useState } from 'react';
import { myActivitiesService } from '@/apis/myActivities';
import * as MyActivitiesType from '@/types/api/myActivitiesType';

interface Props {
  year: number;
  month: number;
  day: number;
  activityId: number;
  onClose: () => void;
  onRefreshDashboard: () => void;
  reservationCount?: {
    pending: number;
    confirmed: number;
    declined: number;
  };
}

const STATUS_TABS = ['pending', 'confirmed', 'declined'] as const;
type StatusType = (typeof STATUS_TABS)[number];

export const CalendarModal = ({
  year,
  month,
  day,
  activityId,
  onClose,
  onRefreshDashboard,
  reservationCount,
}: Props) => {
  const [scheduleList, setScheduleList] = useState<MyActivitiesType.ReservedScheduleResponse[]>([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(null);
  const [reservations, setReservations] = useState<MyActivitiesType.ReservationDetail[]>([]);
  const [activeTab, setActiveTab] = useState<StatusType>('pending');

  const [tabCounts, setTabCounts] = useState<Record<StatusType, number>>({
    pending: 0,
    confirmed: 0,
    declined: 0,
  });

  const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const data = await myActivitiesService.getReservedSchedule({
          activityId,
          date: dateStr,
        });

        if (Array.isArray(data) && data.length > 0) {
          setScheduleList(data);
          setSelectedScheduleId(data[0].scheduleId);
        } else {
          setScheduleList([]);
          setSelectedScheduleId(null);
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchSchedules();
  }, [activityId, dateStr]);

  // 초기 예약 카운트 반영
  useEffect(() => {
    if (reservationCount) {
      setTabCounts(reservationCount);
    }
  }, [reservationCount]);

  // 활성 탭 상태의 예약 목록 조회
  useEffect(() => {
    if (!selectedScheduleId) return;

    const fetchReservations = async () => {
      try {
        const data = await myActivitiesService.getReservations({
          activityId,
          scheduleId: selectedScheduleId,
          status: activeTab,
        });
        setReservations(data.reservations);
      } catch (e) {
        console.error(e);
      }
    };

    fetchReservations();
  }, [selectedScheduleId, activeTab]);

  const handleUpdateReservation = async (
    reservationId: number,
    status: 'confirmed' | 'declined'
  ) => {
    try {
      await myActivitiesService.updateReservation({ activityId, reservationId }, { status });

      // 현재 탭이 'pending'일 때 목록에서 제거
      const updated = reservations.filter(r => r.id !== reservationId);
      setReservations(updated);

      // 탭 카운트 반영
      setTabCounts(prev => ({
        ...prev,
        pending: prev.pending - 1,
        [status]: prev[status] + 1,
      }));

      onRefreshDashboard();
    } catch (e) {
      console.error(`[ERROR] 예약 상태 변경 실패:`, e);
    }
  };

  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalHeader}>
        <h3>{`${year}년 ${month}월 ${day}일`}</h3>
        <button onClick={onClose}>✕</button>
      </div>

      <div className={styles.tabContainer}>
        {STATUS_TABS.map(status => (
          <button
            key={status}
            className={activeTab === status ? styles.activeTab : ''}
            onClick={() => setActiveTab(status)}
          >
            {status === 'pending' ? '예약' : status === 'confirmed' ? '승인' : '거절'}{' '}
            {tabCounts[status]}
          </button>
        ))}
      </div>

      <div className={styles.modalSection}>
        <strong>예약 시간</strong>
        <select
          value={selectedScheduleId?.toString() ?? ''}
          onChange={e => setSelectedScheduleId(Number(e.target.value))}
        >
          {scheduleList.map(schedule => (
            <option key={schedule.scheduleId} value={schedule.scheduleId.toString()}>
              {schedule.startTime} - {schedule.endTime}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.modalSection}>
        <strong>예약 내역</strong>
        {reservations.length === 0 ? (
          <p style={{ color: '#999' }}>예약 내역이 없습니다.</p>
        ) : (
          reservations.map(res => (
            <div key={res.id} className={styles.reservationItem}>
              <div>
                <div>닉네임: {res.nickname}</div>
                <div>인원: {res.headCount}명</div>
              </div>
              {activeTab === 'pending' ? (
                <div className={styles.actionButtons}>
                  <button onClick={() => handleUpdateReservation(res.id, 'confirmed')}>
                    승인하기
                  </button>
                  <button onClick={() => handleUpdateReservation(res.id, 'declined')}>
                    거절하기
                  </button>
                </div>
              ) : (
                <div className={styles.statusTag}>
                  {activeTab === 'confirmed' ? (
                    <span className={styles.confirmed}>예약 승인</span>
                  ) : (
                    <span className={styles.declined}>예약 거절</span>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
