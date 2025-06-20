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

  // 탭 상태에 따라 예약 목록 가져오기
  useEffect(() => {
    if (!selectedScheduleId) return;
    fetchReservationsForTab(selectedScheduleId, activeTab);
  }, [selectedScheduleId, activeTab]);

  const fetchReservationsForTab = async (scheduleId: number, status: StatusType) => {
    try {
      const data = await myActivitiesService.getReservations({
        activityId,
        scheduleId,
        status,
      });
      setReservations(data.reservations);
    } catch (e) {
      console.error(`[ERROR] 예약 목록 조회 실패:`, e);
    }
  };

  const fetchCountsForAllStatuses = async (scheduleId: number) => {
    const counts: Record<StatusType, number> = {
      pending: 0,
      confirmed: 0,
      declined: 0,
    };

    try {
      await Promise.all(
        STATUS_TABS.map(async status => {
          const data = await myActivitiesService.getReservations({
            activityId,
            scheduleId,
            status,
          });
          counts[status] = data.reservations.length;
        })
      );

      setTabCounts(counts);
    } catch (e) {
      console.error('[ERROR] 예약 카운트 조회 실패:', e);
    }
  };

  const handleUpdateReservation = async (
    reservationId: number,
    status: 'confirmed' | 'declined'
  ) => {
    try {
      await myActivitiesService.updateReservation({ activityId, reservationId }, { status });

      // 예약 목록 다시 가져오기
      if (selectedScheduleId) {
        await fetchReservationsForTab(selectedScheduleId, activeTab);
        await fetchCountsForAllStatuses(selectedScheduleId);
      }

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
            {
              {
                pending: '예약',
                confirmed: '승인',
                declined: '거절',
              }[status]
            }{' '}
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
                  {
                    {
                      confirmed: <span className={styles.confirmed}>예약 승인</span>,
                      declined: <span className={styles.declined}>예약 거절</span>,
                      completed: <span className={styles.completed}>예약 완료</span>,
                    }[activeTab]
                  }
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
