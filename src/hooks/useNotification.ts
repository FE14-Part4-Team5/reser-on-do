import { useMutation, useInfiniteQuery } from '@tanstack/react-query';
import { myNotificationsService } from '@/apis/myNotifications';
import type { NotificationResponse } from '@/components/modal/NotificationModal';

export const useInfiniteNotification = (size = 10) => {
  return useInfiniteQuery<NotificationResponse, Error>({
    queryKey: ['notifications'],
    queryFn: ({ pageParam }) =>
      myNotificationsService.getMyNotifications({
        cursorId: pageParam as number,
        size,
      }),
    getNextPageParam: lastPage =>
      lastPage.notifications.length > 0 ? lastPage.cursorId : undefined,
    initialPageParam: undefined,
  });
};

export const useDeleteNotification = () => {
  return useMutation({
    mutationFn: (notificationId: number) =>
      myNotificationsService.deleteNotification({ notificationId }),
  });
};
