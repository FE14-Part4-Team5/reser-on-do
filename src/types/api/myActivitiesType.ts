import type {
  Category,
  ActivityBase,
  ActivitySubImage,
  ActivityScheduleWithTime,
  ReservationStatus,
  BaseEntity,
} from './sharedType';

/*GET my-activities, 내 체험 리스트 조회*/
export interface MyActivitiesParams {
  teamId?: string;
  cursorId?: number;
  size?: number;
}

export type MyActivity = ActivityBase;

export interface MyActivitiesResponse {
  cursorId: number;
  totalCount: number;
  activities: MyActivity[];
}

/*GET reservation-dashboard, 내 체험 월별 예약 현황 조회*/
export interface ReservationDashboardParams {
  teamId: string;
  activityId: number;
  year: string;
  month: string;
}

export interface ReservationsWithDashboard {
  completed: number;
  confirmed: number;
  pending: number;
}

export interface ReservationDashboardResponse {
  date: string;
  reservations: ReservationsWithDashboard;
}

/*GET reserved-schedule, 날짜별 예약 상태 요약*/
export interface ReservedScheduleParams {
  teamId: string;
  activityId: number;
  date: string;
}

export interface ReservedScheduleWithCount {
  declined: number;
  confirmed: number;
  pending: number;
}

export interface ReservedScheduleResponse {
  scheduleId: number;
  startTime: string;
  endTime: string;
  count: ReservedScheduleWithCount;
}

/*GET reservations, 시간대별 예약 내역*/
export interface ReservationsParams {
  teamId: string;
  activityId: number;
  cursorId?: number;
  size?: number;
  scheduleId: number;
  status: ReservationStatus;
}

export interface ReservationDetail extends BaseEntity {
  nickname: string;
  userId: number;
  teamId: string;
  activityId: number;
  scheduleId: number;
  status: string;
  reviewSubmitted: boolean;
  totalPrice: number;
  headCount: number;
  date: string;
  startTime: string;
  endTime: string;
}

export interface GetReservationsResponse {
  cursorId: number;
  totalCount: number;
  reservations: ReservationDetail[];
  message: string;
}

/*PATCH 예약 상태 변경*/
export interface UpdateReservationParams {
  teamId: string;
  activityId: number;
  reservationId: number;
}

export interface UpdateReservationRequest {
  status: ReservationStatus;
}

export interface UpdateReservationResponse extends ReservationDetail {
  message: string;
}

/*DELETE activityId, 내 체험 삭제*/
export interface DeleteActivityParams {
  teamId?: string;
  activityId: number;
}

/*PATCH activityId, 내 체험 수정*/
export interface UpdateActivityParams {
  teamId: string;
  activityId: number;
}

export interface ScheduleToAdd {
  date: string;
  startTime: string;
  endTime: string;
}

export interface UpdateActivityRequest {
  title: string;
  category: Category;
  description: string;
  price: number;
  address: string;
  bannerImageUrl: string;
  subImageIdsToRemove: number[];
  subImageUrlsToAdd: string[];
  scheduleIdsToRemove: number[];
  schedulesToAdd: ScheduleToAdd[];
}

export interface UpdateActivityResponse extends ActivityBase {
  subImages: ActivitySubImage[];
  schedules: ActivityScheduleWithTime[];
}
