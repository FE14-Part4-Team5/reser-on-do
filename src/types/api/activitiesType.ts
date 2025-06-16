import type {
  Category,
  ActivityBase,
  ActivitySchedule,
  ActivityScheduleWithId,
  ActivityScheduleWithTime,
  ActivitySubImage,
  ReviewWithUser,
  ReservationBase,
} from './sharedType';

/*GET activities, 체험 리스트 조회*/
export interface GetActivitiesParams {
  teamId: string;
  method: 'offset' | 'cursor';
  cursorId?: number;
  category?: Category;
  keyword?: string;
  sort?: 'most_reviewed' | 'price_asc' | 'price_desc' | 'latest';
  page?: number;
  size?: number;
}

export type Activity = ActivityBase;

export interface GetActivitiesResponse {
  cursorId: number;
  totalCount: number;
  activities: Activity[];
}

/*POST activities, 체험 등록*/
export interface CreateActivityParams {
  teamId: string;
}

export interface CreateActivityRequest {
  title: string;
  category: Category;
  description: string;
  address: string;
  price: number;
  schedules: ActivitySchedule[];
  bannerImageUrl: string;
  subImageUrls: string[];
}

export interface CreateActivityResponse extends ActivityBase {
  subImages: ActivitySubImage[];
  schedules: ActivityScheduleWithTime[];
}

/*GET activityId, 체험 상세 조회*/
export interface GetActivityIdParams {
  teamId?: string;
  activityId: number;
}

export interface GetActivityIdResponse extends ActivityBase {
  subImages: ActivitySubImage[];
  schedules: ActivityScheduleWithId[];
}

/*GET available-schedule, 체험 예약 가능일 조회*/
export interface GetAvailableScheduleParams {
  teamId: string;
  activityId: number;
  year: string;
  month: string;
}

export type GetAvailableScheduleResponse = ActivityScheduleWithTime[];

/*GET reviews, 체험 리뷰 조회*/
export interface GetReviewsParams {
  teamId?: string;
  activityId: number;
  page?: number;
  size?: number;
}

export interface Review {
  id: number;
  user: ReviewWithUser;
  activityId: number;
  rating: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetReviewsResponse {
  averageRating: number;
  totalCount: number;
  reviews: Review[];
}

/*POST reservations, 체험 예약 신청*/
export interface CreateReservationParams {
  teamId?: string;
  activityId: number;
}

export interface CreateReservationRequest {
  scheduleId: number;
  headCount: number;
}

export type CreateReservationResponse = ReservationBase;

/*POST activities image, 체험 이미지 URL 생성*/
export interface CreateActivityImageParams {
  teamId: string;
}

export interface CreateActivityImageRequest {
  image: File;
}

export interface CreateActivityImageResponse {
  activityImageUrl: string;
}
