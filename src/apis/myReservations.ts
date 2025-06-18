import axiosInstance from '@/apis/axiosInstance';
import * as MyReservationsType from '@/types/api/myReservationsType';
import { AxiosError } from 'axios';

/* 내 예약 리스트 조회 */
const getMyReservations = async (
  params: MyReservationsType.MyReservationsParams
): Promise<MyReservationsType.GetMyReservationsResponse> => {
  try {
    const response = await axiosInstance.get<MyReservationsType.GetMyReservationsResponse>(
      '/my-reservations',
      { params }
    );
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    console.error('내 예약 리스트 조회 실패:', err);
    throw new Error(err.response?.data?.message || '내 예약 리스트 조회 중 오류가 발생했습니다.');
  }
};

/* 내 예약 수정(취소) */
const updateMyReservation = async (
  params: MyReservationsType.UpdateMyReservationParams
): Promise<MyReservationsType.UpdateMyReservationResponse> => {
  try {
    const { reservationId } = params;
    const response = await axiosInstance.patch<MyReservationsType.UpdateMyReservationResponse>(
      `/my-reservations/${reservationId}`,
      { status: 'canceled' }
    );
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    console.error('내 예약 수정(취소) 실패:', err);
    throw new Error(err.response?.data?.message || '내 예약 수정(취소) 중 오류가 발생했습니다.');
  }
};

/* 내 예약 리뷰 작성 */
const createMyReservationReview = async (
  params: MyReservationsType.CreateMyReservationReviewParams
): Promise<MyReservationsType.CreateMyReservationReviewResponse> => {
  try {
    const { reservationId } = params;

    const response = await axiosInstance.post<MyReservationsType.CreateMyReservationReviewResponse>(
      `/my-reservations/${reservationId}/reviews`,
      {}
    );

    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    console.error('내 예약 리뷰 작성 실패:', err);
    throw new Error(err.response?.data?.message || '내 예약 리뷰 작성 중 오류가 발생했습니다.');
  }
};

export const myReservationsService = {
  getMyReservations,
  updateMyReservation,
  createMyReservationReview,
};
