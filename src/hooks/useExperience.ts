import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import { activitiesService } from '@/apis/activities';
import { myActivitiesService } from '@/apis/myActivities';

export interface SubImage {
  id: number;
  imageUrl: string;
}

export interface Schedule {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
}

export interface ExperienceResponse {
  id: number;
  userId: number;
  title: string;
  description: string;
  category: string;
  price: number;
  address: string;
  bannerImageUrl: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  subImages: SubImage[];
  schedules: Schedule[];
}

export interface ReserveExperiencePayload {
  scheduleId: number;
  headCount: number;
}

export interface Review {
  id: number;
  user: {
    profileImageUrl: string;
    nickname: string;
    id: number;
  };
  activityId: number;
  rating: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewResponse {
  averageRating: number;
  totalCount: number;
  reviews: Review[];
}

export const useExperienceDetail = (activityId: number) => {
  return useQuery<ExperienceResponse>({
    queryKey: ['experienceDetail', activityId],
    queryFn: () => activitiesService.getActivityId({ activityId }),
  });
};

export const useReserveExperience = (activityId: number) => {
  return useMutation({
    mutationFn: (payload: ReserveExperiencePayload) =>
      activitiesService.createReservations({ activityId }, payload),
  });
};

export const useDeleteExperience = (activityId: number) => {
  return useMutation({
    mutationFn: () => myActivitiesService.deleteActivity({ activityId }),
  });
};

export const useExperienceReviews = (activityId: number, page = 1, size = 3) => {
  return useQuery<ReviewResponse>({
    queryKey: ['experienceReviews', activityId, page, size],
    queryFn: () => activitiesService.getReviews({ activityId, page, size }),
    placeholderData: keepPreviousData,
  });
};
