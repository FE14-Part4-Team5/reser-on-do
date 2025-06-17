export type Category = '문화 · 예술' | '식음료' | '스포츠' | '투어' | '관광' | '웰빙';
export type ReservationStatus = 'pending' | 'confirmed' | 'declined' | 'canceled' | 'completed';

export interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserSummary extends BaseEntity {
  email: string;
  nickname: string;
  profileImageUrl?: string;
}

export interface ActivityBase extends BaseEntity {
  userId: number;
  title: string;
  description: string;
  category: Category;
  price: number;
  address: string;
  bannerImageUrl: string;
  rating: number;
  reviewCount: number;
}

export interface ActivitySubImage {
  imageUrl: string;
  id: number;
}

export interface ScheduleTime {
  id: number;
  startTime: string;
  endTime: string;
}

export interface ActivityScheduleBase {
  date: string;
}

export interface ActivitySchedule extends ActivityScheduleBase {
  startTime: string;
  endTime: string;
}

export interface ActivityScheduleWithTime extends ActivityScheduleBase {
  times: ScheduleTime[];
}

export interface ActivityScheduleWithId extends ActivitySchedule {
  id: number;
}

export interface ReservationBase extends BaseEntity {
  teamId: string;
  userId: number;
  scheduleId: number;
  status: ReservationStatus;
  reviewSubmitted: boolean;
  totalPrice: number;
  headCount: number;
  date: string;
  startTime: string;
  endTime: string;
}

export interface ReservationActivitySummary {
  id: number;
  title: string;
  bannerImageUrl: string;
}

export interface ReviewWithUser {
  profileImageUrl: string;
  nickname: string;
  id: number;
}

export interface ErrorResponse {
  message: string;
}

export interface NotificationBase extends BaseEntity {
  teamId: string;
  userId: number;
  content: string;
  deletedAt: string;
}

export interface OAuthApp extends BaseEntity {
  teamId: string;
  appKey: string;
  provider: 'google' | 'kakao';
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface ProfileImageResponse {
  profileImageUrl: string;
}

export interface UpdateProfileRequest {
  nickname?: string;
  profileImageUrl?: string;
  newPassword?: string;
}

export interface CreateImageRequest {
  image: File;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse extends TokenPair {
  user: UserSummary;
}

export type TokenResponse = TokenPair;

export interface SignUpRequest {
  email: string;
  nickname: string;
  password: string;
}

export type SignUpResponse = UserSummary;
export type GetMeResponse = UserSummary;
export type PatchMeResponse = UserSummary;

export interface OAuthSignupProviderRequest {
  nickname: string;
  redirectUri?: string;
  token: string;
}

export interface OAuthSigninProviderRequest {
  redirectUri?: string;
  token: string;
}

export interface OAuthSigninProviderResponse extends TokenPair {
  user: UserSummary;
}

export interface OAuthSignupProviderResponse extends TokenPair {
  user: UserSummary;
}

export interface CreateMyReservationReviewRequest {
  rating: number;
  content: string;
}

export interface CreateMyReservationReviewResponse extends BaseEntity {
  deletedAt: string;
  content: string;
  rating: number;
  userId: number;
  activityId: number;
  teamId: string;
}
