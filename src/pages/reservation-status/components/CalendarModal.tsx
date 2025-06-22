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
}: Props) => {
  const [scheduleList, setScheduleList] = useState<MyActivitiesType.ReservedScheduleResponse[]>([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<StatusType>('pending');
  const [isLoading, setIsLoading] = useState(false);
  const [allReservationsByStatus, setAllReservationsByStatus] = useState<
    Record<StatusType, MyActivitiesType.ReservationDetail[]>
  >({
    pending: [],
    confirmed: [],
    declined: [],
  });
  const [filteredReservationsByStatus, setFilteredReservationsByStatus] = useState<
    Record<StatusType, MyActivitiesType.ReservationDetail[]>
  >({
    pending: [],
    confirmed: [],
    declined: [],
  });

  const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setIsLoading(true);
        const data = await myActivitiesService.getReservedSchedule({ activityId, date: dateStr });
        const list = Array.isArray(data) ? data : [data];
        setScheduleList(list);
        if (list.length > 0) {
          setSelectedScheduleId(list[0].scheduleId);
        }
        await fetchAllReservationsForAllSchedules(list.map(s => s.scheduleId));
      } catch (e) {
        console.error(e);
        setScheduleList([]);
        setSelectedScheduleId(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedules();
  }, [activityId, dateStr]);

  const fetchAllReservationsForAllSchedules = async (scheduleIds: number[]) => {
    const entries = await Promise.all(
      STATUS_TABS.map(async status => {
        const all = await Promise.all(
          scheduleIds.map(scheduleId =>
            myActivitiesService
              .getReservations({ activityId, scheduleId, status })
              .then(res => res.reservations)
          )
        );
        return [status, all.flat()] as const;
      })
    );

    const result = Object.fromEntries(entries) as Record<
      StatusType,
      MyActivitiesType.ReservationDetail[]
    >;
    setAllReservationsByStatus(result);
    setFilteredReservationsByStatus(filterReservations(result, selectedScheduleId));
  };

  const filterReservations = (
    all: Record<StatusType, MyActivitiesType.ReservationDetail[]>,
    scheduleId: number | null
  ) => {
    if (!scheduleId) return { pending: [], confirmed: [], declined: [] };
    return {
      pending: all.pending.filter(r => r.scheduleId === scheduleId),
      confirmed: all.confirmed.filter(r => r.scheduleId === scheduleId),
      declined: all.declined.filter(r => r.scheduleId === scheduleId),
    };
  };

  useEffect(() => {
    setFilteredReservationsByStatus(
      filterReservations(allReservationsByStatus, selectedScheduleId)
    );
  }, [selectedScheduleId, allReservationsByStatus]);

  const handleUpdateReservation = async (
    reservationId: number,
    status: 'confirmed' | 'declined'
  ) => {
    try {
      setIsLoading(true);
      await myActivitiesService.updateReservation({ activityId, reservationId }, { status });
      if (scheduleList.length > 0) {
        await fetchAllReservationsForAllSchedules(scheduleList.map(s => s.scheduleId));
        onRefreshDashboard();
      }
    } catch (e) {
      console.error(`[ERROR] 예약 상태 변경 실패:`, e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalHeader}>
        <h3>{`${year}년 ${month}월 ${day}일`}</h3>
        <button onClick={onClose}>✕</button>
      </div>

      {isLoading ? (
        <div className={styles.spinner}>
          <div className={styles.spinnerCircle}></div>
        </div>
      ) : (
        <>
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
                {allReservationsByStatus[status].length}
              </button>
            ))}
          </div>

          <div className={`${styles.modalSection} ${styles.splitSection}`}>
            <div className={styles.leftBlock}>
              <div className={styles.modalText}>예약 시간</div>
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

            <div className={styles.rightBlock}>
              <div className={styles.modalText}>예약 내역</div>
              {filteredReservationsByStatus[activeTab].length === 0 ? (
                <p style={{ color: '#999' }}>예약 내역이 없습니다.</p>
              ) : (
                filteredReservationsByStatus[activeTab].map(res => (
                  <div key={res.id} className={styles.reservationItem}>
                    <div className={styles.infoItem}>
                      <span className={styles.label}>닉네임</span>
                      <span className={styles.label}>인원</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.value}>{res.nickname}</span>
                      <span className={styles.value}>{res.headCount}명</span>
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
                          }[activeTab]
                        }
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
