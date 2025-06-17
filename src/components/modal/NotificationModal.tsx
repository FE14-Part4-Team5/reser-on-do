import { useState } from 'react';

import IconDelete from '@/assets/icons/icon_delete.svg?react';

import { getTimeAgo } from '@/utils/datetime';

import styles from './NotificationModal.module.css';

// [임시 데이터] 실제 API 연결 전까지 사용됨 - 이후 삭제 필요
export const mockNotificationPages = [
  {
    cursorId: 1,
    totalCount: 2,
    notifications: [
      {
        id: 201,
        teamId: '14-5',
        userId: 1,
        content: '함께하면 즐거운 스트릿 댄스 (2023-01-14 15:00~18:00) 예약이 승인되었습니다.',
        createdAt: new Date(Date.now() - 1000 * 60 * 1).toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
      },
      {
        id: 202,
        teamId: '14-5',
        userId: 1,
        content: '함께하면 즐거운 스트릿 댄스 (2023-01-14 15:00~18:00) 예약이 거절되었습니다.',
        createdAt: new Date(Date.now() - 1000 * 60 * 7).toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
      },
    ],
  },
];

const NotificationModal = () => {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  const notificationList = mockNotificationPages?.flatMap(page => page.notifications) || [];
  const totalCount = mockNotificationPages[0]?.totalCount ?? notificationList.length;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <p className={styles.title}>알림 {totalCount}개</p>
        <button onClick={() => setVisible(false)} className={styles.closeButton}>
          <IconDelete />
        </button>
      </div>

      <div className={styles.list}>
        {notificationList.map(noti => {
          const isApproved = noti.content.includes('승인');
          const isRejected = noti.content.includes('거절');

          return (
            <div key={noti.id} className={styles.notification}>
              <div className={styles.topRow}>
                <span>{isApproved ? '예약 승인' : isRejected ? '예약 거절' : '알림'}</span>
                <span className={styles.timeAgo}>{getTimeAgo(noti.createdAt)}</span>
              </div>
              <div className={styles.description}>
                <div>{noti.content.replace(/예약이 (승인|거절)되었습니다\./, '')}</div>
                <div>
                  예약이{' '}
                  <span className={isApproved ? styles.textApproved : styles.textRejected}>
                    {isApproved ? '승인' : '거절'}
                  </span>
                  되었어요.
                </div>
              </div>
            </div>
          );
        })}
        <div className={styles.loadMoreTrigger}></div>
      </div>
    </div>
  );
};

export default NotificationModal;

export type Notification = {
  id: number;
  teamId: string;
  userId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type NotificationResponse = {
  cursorId: number;
  notifications: Notification[];
  totalCount: number;
};
