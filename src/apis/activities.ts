import axiosInstance from '@/apis/axiosInstance';
import { AxiosError } from 'axios';
import * as ActivitiesType from '@/types/api/activitiesType';

/*체험 리스트 조회*/
const getActivities = async (
  params: ActivitiesType.GetActivitiesParams
): Promise<ActivitiesType.GetActivitiesResponse> => {
  try {
    const response = await axiosInstance.get<ActivitiesType.GetActivitiesResponse>('/activities', {
      params,
      headers: {
        'x-require-auth': 'false',
      },
    });
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    console.error('체험 리스트 조회 실패:', err);
    throw new Error(err.response?.data?.message || '체험 리스트 조회 중 오류가 발생했습니다.');
  }
};

/*체험 등록*/
const createActivity = async (
  body: ActivitiesType.CreateActivityRequest
): Promise<ActivitiesType.CreateActivityResponse> => {
  try {
    const response = await axiosInstance.post<ActivitiesType.CreateActivityResponse>(
      '/activities',
      body
    );
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    console.error('체험 등록 실패:', err);
    throw new Error(err.response?.data?.message || '체험 등록 중 오류가 발생했습니다.');
  }
};

/*체험 상세 조회*/
const getActivityId = async (
  params: ActivitiesType.GetActivityIdParams
): Promise<ActivitiesType.GetActivityIdResponse> => {
  try {
    const { activityId } = params;
    const response = await axiosInstance.get<ActivitiesType.GetActivityIdResponse>(
      `/activities/${activityId}`
    );
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    console.error('체험 상세 조회 실패:', err);
    throw new Error(err.response?.data?.message || '체험 상세 조회 중 오류가 발생했습니다.');
  }
};

/*체험 예약 가능일 조회*/
const getActivityAvailableSchedule = async (
  params: ActivitiesType.GetAvailableScheduleParams
): Promise<ActivitiesType.GetAvailableScheduleResponse> => {
  try {
    const { activityId, ...query } = params;
    const response = await axiosInstance.get<ActivitiesType.GetAvailableScheduleResponse>(
      `/activities/${activityId}/available-schedule`,
      { params: query }
    );
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    console.error('체험 예약 가능일 조회 실패:', err);
    throw new Error(err.response?.data?.message || '체험 예약 가능일 조회 중 오류가 발생했습니다.');
  }
};

/*체험 리뷰 조회*/
const getReviews = async (
  params: ActivitiesType.GetReviewsParams
): Promise<ActivitiesType.GetReviewsResponse> => {
  try {
    const { activityId, ...query } = params;
    const response = await axiosInstance.get<ActivitiesType.GetReviewsResponse>(
      `/activities/${activityId}/reviews`,
      { params: query }
    );
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    console.error('체험 리뷰 조회 실패:', err);
    throw new Error(err.response?.data?.message || '체험 리뷰 조회 중 오류가 발생했습니다.');
  }
};

/*체험 예약 신청*/
const createReservations = async (
  params: ActivitiesType.CreateReservationParams,
  body: ActivitiesType.CreateReservationRequest
): Promise<ActivitiesType.CreateReservationResponse> => {
  try {
    const { activityId } = params;
    const response = await axiosInstance.post<ActivitiesType.CreateReservationResponse>(
      `/activities/${activityId}/reservations`,
      body
    );
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    console.error('체험 예약 신청 실패:', err);
    throw err.response?.data?.message || '체험 예약 신청 중 오류가 발생했습니다.';
  }
};

/*체험 이미지 URL 생성*/
const getActivityImageUrl = async (
  body: ActivitiesType.CreateActivityImageRequest
): Promise<ActivitiesType.CreateActivityImageResponse> => {
  try {
    const formData = new FormData();
    formData.append('image', body.image);

    const response = await axiosInstance.post<ActivitiesType.CreateActivityImageResponse>(
      '/activities/image',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    console.error('체험 이미지 URL 생성 실패:', err);
    throw new Error(err.response?.data?.message || '체험 이미지 URL 생성 중 오류가 발생했습니다.');
  }
};

export const activitiesService = {
  getActivities,
  createActivity,
  getActivityId,
  getActivityAvailableSchedule,
  getReviews,
  createReservations,
  getActivityImageUrl,
};
