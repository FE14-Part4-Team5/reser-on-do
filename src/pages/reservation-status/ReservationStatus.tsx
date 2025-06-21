import SideNavigation from '@/components/side-navigation/SideNavigation';
import styles from './ReservationStatus.module.css';
import profileImg from '@/assets/icons/profile_size=lg.svg';
import { Calendar } from './components/Calendar';
import { useEffect, useState } from 'react';
import { myActivitiesService } from '@/apis/myActivities';
import * as MyActivitiesType from '@/types/api/myActivitiesType';

const ReservationStatus = () => {
  const [activityList, setActivityList] = useState<MyActivitiesType.MyActivity[]>([]);
  const [selectedActivityId, setSelectedActivityId] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedActivityId(Number(e.target.value));
  };

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await myActivitiesService.getMyActivities({});
        setActivityList(data.activities);
        if (data.activities.length > 0) {
          setSelectedActivityId(data.activities[0].id);
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchActivities();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.navContainer}>
        <SideNavigation defaultImage={profileImg} />
      </div>
      <div className={styles.calendarWrapper}>
        <div className={styles.header}>
          <div className={styles.title}>예약 현황</div>
          <div className={styles.explanation}>
            내 체험에 예약된 내역들을 한 눈에 확인할 수 있습니다.
          </div>
          <div className={styles.dropdownContainer}>
            <select
              className={styles.dropdown}
              value={selectedActivityId ?? ''}
              onChange={handleChange}
            >
              {activityList.map(activity => (
                <option key={activity.id} value={activity.id}>
                  {activity.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Calendar selectedActivityId={selectedActivityId} />
      </div>
    </div>
  );
};

export default ReservationStatus;
