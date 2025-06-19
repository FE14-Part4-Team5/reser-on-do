import * as MyActivitiesType from '@/types/api/myActivitiesType';
import axiosInstance from '@/apis/axiosInstance';
import { AxiosError } from 'axios';

/*내 체험 리스트 조회*/
const getMyActivities = async (
  params: MyActivitiesType.MyActivitiesParams
): Promise<MyActivitiesType.MyActivitiesResponse> => {
  try {
    const { ...query } = params;
    const response = await axiosInstance.get<MyActivitiesType.MyActivitiesResponse>(
      `/my-activities`,
      {
        params: query,
      }
    );

    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    console.error('내 체험 리스트 조회 실패:', err);
    throw new Error(err.response?.data?.message || '내 체험 리스트 조회 중 오류가 발생했습니다.');
  }
};

/*내 체험 월별 예약 현황 조회*/
const getReservationDashboard = async (
  params: MyActivitiesType.ReservationDashboardParams
): Promise<MyActivitiesType.ReservationDashboardResponse[]> => {
  try {
    const { activityId, ...query } = params;
    const response = await axiosInstance.get<MyActivitiesType.ReservationDashboardResponse[]>(
      `/my-activities/${activityId}/reservation-dashboard`,
      {
        params: query,
      }
    );

    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    console.error('내 체험 월별 예약 현황 조회 실패:', err);
    throw new Error(
      err.response?.data?.message || '내 체험 월별 예약 현황 조회 중 오류가 발생했습니다.'
    );
  }
};

/*내 체험 날짜별 예약 정보(신청, 승인, 거절)가 있는 스케줄 조회*/
const getReservedSchedule = async (
  params: MyActivitiesType.ReservedScheduleParams
): Promise<MyActivitiesType.ReservedScheduleResponse> => {
  try {
    const { activityId, ...query } = params;
    const response = await axiosInstance.get<MyActivitiesType.ReservedScheduleResponse>(
      `/my-activities/${activityId}/reserved-schedule`,
      {
        params: query,
      }
    );

    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    console.error('내 체험 날짜별 예약 정보 조회 실패:', err);
    throw new Error(
      err.response?.data?.message || '내 체험 날짜별 예약 정보 조회 중 오류가 발생했습니다.'
    );
  }
};

/*내 체험 예약 시간대별 예약 내역 조회*/
const getReservations = async (
  params: MyActivitiesType.ReservationsParams
): Promise<MyActivitiesType.GetReservationsResponse> => {
  try {
    const { activityId, ...query } = params;
    const response = await axiosInstance.get<MyActivitiesType.GetReservationsResponse>(
      `/my-activities/${activityId}/reservations`,
      {
        params: query,
      }
    );

    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    console.error('내 체험 예약 시간대별 예약 내역 조회 실패:', err);
    throw new Error(
      err.response?.data?.message || '내 체험 예약 시간대별 예약 내역 조회 중 오류가 발생했습니다.'
    );
  }
};

/*내 체험 예약 상태(승인, 거절) 업데이트*/
const updateReservation = async (
  params: MyActivitiesType.UpdateReservationParams,
  body: MyActivitiesType.UpdateReservationRequest
): Promise<MyActivitiesType.UpdateReservationResponse> => {
  try {
    const { activityId, reservationId } = params;

    const response = await axiosInstance.patch<MyActivitiesType.UpdateReservationResponse>(
      `/my-activities/${activityId}/reservations/${reservationId}`,
      body
    );

    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    console.error('내 체험 예약 상태 업데이트 실패:', err);
    throw new Error(
      err.response?.data?.message || '내 체험 예약 상태 업데이트 중 오류가 발생했습니다.'
    );
  }
};

/*내 체험 삭제*/
const deleteActivity = async (params: MyActivitiesType.DeleteActivityParams): Promise<void> => {
  try {
    const { activityId } = params;
    await axiosInstance.delete(`/my-activities/${activityId}`);
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    console.error('내 체험 삭제 실패:', err);
    throw err.response?.data?.message || '내 체험 삭제 중 오류가 발생했습니다.';
  }
};

/*내 체험 수정*/
const updateActivity = async (
  params: MyActivitiesType.UpdateActivityParams,
  body: MyActivitiesType.UpdateActivityRequest
): Promise<MyActivitiesType.UpdateActivityResponse> => {
  try {
    const { activityId } = params;
    const response = await axiosInstance.patch<MyActivitiesType.UpdateActivityResponse>(
      `/my-activities/${activityId}`,
      body
    );

    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    console.error('내 체험 수정 실패:', err);
    throw new Error(err.response?.data?.message || '내 체험 수정 중 오류가 발생했습니다.');
  }
};

export const myActivitiesService = {
  getMyActivities,
  getReservationDashboard,
  getReservedSchedule,
  getReservations,
  updateReservation,
  deleteActivity,
  updateActivity,
};
