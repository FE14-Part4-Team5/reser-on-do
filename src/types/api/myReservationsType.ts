import type { ReservationBase, ReservationActivitySummary } from './sharedType';

/*GET my-reservations, 내 예약 리스트 조회*/
export interface MyReservationsParams {
  teamId?: string;
  cursorId?: number;
  size?: number;
  status: ReservationBase['status'];
}

export interface MyReservation extends ReservationBase {
  activity: ReservationActivitySummary;
}

export interface GetMyReservationsResponse {
  cursorId: number;
  reservations: MyReservation[];
  totalCount: number;
}

/*PATCH reservationId, 내 예약 수정(취소)*/
export interface UpdateMyReservationParams {
  teamId?: string;
  reservationId: number;
}

export interface UpdateMyReservationRequest {
  status: 'canceled';
}

export interface UpdateMyReservationResponse extends ReservationBase {
  activityId: number;
}

/*POST reviews, 내 예약 리뷰 작성*/
export interface CreateMyReservationReviewParams {
  teamId: string;
  reservationId: number;
}

export interface CreateMyReservationReviewRequest {
  rating: number;
  content: string;
}

export interface CreateMyReservationReviewResponse {
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  content: string;
  rating: number;
  userId: number;
  activityId: number;
  teamId: string;
  id: number;
}
