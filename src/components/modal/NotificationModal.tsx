import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import IconDelete from '@/assets/icons/icon_delete.svg?react';

import { getTimeAgo } from '@/utils/datetime';

import styles from './NotificationModal.module.css';

import { useInfiniteNotification, useDeleteNotification } from '@/hooks/useNotification';

import { useQueryClient } from '@tanstack/react-query';

interface NotificationModalProps {
  onClose: () => void;
}

const NotificationModal = ({ onClose }: NotificationModalProps) => {
  // const [visible, setVisible] = useState(true);

  const queryClient = useQueryClient();
  const { ref: loadMoreRef, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } =
    useInfiniteNotification();
  const { mutate: deleteNotification } = useDeleteNotification();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage]);

  // if (!visible) return null;

  const notificationList = data?.pages.flatMap(page => page.notifications) || [];
  const totalCount = data?.pages[0]?.totalCount ?? notificationList.length;

  const handleDelete = (notificationId: number) => {
    deleteNotification(notificationId, {
      onSuccess: response => {
        console.log('알림 삭제 성공:', response);
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      },
    });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <p className={styles.title}>알림 {isLoading || isError ? 0 : totalCount}개</p>
        <button onClick={onClose} className={styles.closeButton}>
          <IconDelete />
        </button>
      </div>
      {isLoading ? (
        <div className={styles.centered}>알람을 불러오는 중...</div>
      ) : isError ? (
        <div className={styles.centered}>알람을 불러오는 중 오류가 발생했어요</div>
      ) : (
        <>
          <div className={styles.list}>
            {notificationList.map(noti => {
              const isApproved = noti.content.includes('승인');
              const isRejected = noti.content.includes('거절');

              return (
                <div
                  key={noti.id}
                  className={styles.notification}
                  onClick={() => handleDelete(noti.id)}
                >
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
            <div ref={loadMoreRef} className={styles.loadMoreTrigger}></div>
            {isFetchingNextPage && (
              <div className={styles.bounceLoader}>
                <div className={styles.bounceDot}></div>
                <div className={styles.bounceDot}></div>
                <div className={styles.bounceDot}></div>
              </div>
            )}
          </div>
        </>
      )}
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
