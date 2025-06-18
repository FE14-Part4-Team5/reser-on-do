import type { NotificationBase } from './sharedType';

/*GET my-notifications, 내 알림 리스트 조회*/
export interface MyNotificationsParams {
  teamId?: string;
  cursorId?: number;
  size?: number;
}

export type Notifications = NotificationBase;

export interface GetMyNotificationsResponse {
  cursorId: number;
  notifications: Notifications[];
  totalCount: number;
}

/*DELETE notificationId, 내 알림 삭제*/
export interface DeleteNotificationParams {
  teamId?: string;
  notificationId: number;
}
