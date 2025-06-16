import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { activitiesService } from '@/apis/activities';
import type { GetActivitiesParams, GetActivitiesResponse } from '@/types/api/activitiesType';

// 체험 리스트 조회
export const useGetActivitiesQuery = (params: Omit<GetActivitiesParams, 'method'>) => {
  const queryParams: GetActivitiesParams = {
    ...params,
    method: 'offset',
  };
  return useQuery<GetActivitiesResponse>({
    queryKey: ['activities', queryParams],
    queryFn: () => activitiesService.getActivities(queryParams),
    staleTime: 1000 * 60,
  });
};

// 인기 있는 체험 조회
interface UsePopularActivitiesInfiniteQueryParams {
  size?: number;
  sort?: GetActivitiesParams['sort'];
}

export const usePopularActivitiesInfiniteQuery = ({
  size = 6,
  sort = 'most_reviewed',
}: UsePopularActivitiesInfiniteQueryParams = {}) => {
  return useInfiniteQuery({
    queryKey: ['popularActivities', sort, size],
    queryFn: async ({ pageParam }) => {
      const params: GetActivitiesParams = {
        method: 'cursor',
        sort,
        size,
      };
      if (typeof pageParam === 'number' && pageParam > 0) {
        params.cursorId = pageParam;
      }
      return activitiesService.getActivities(params);
    },
    getNextPageParam: lastPage => lastPage.activities.at(-1)?.id ?? undefined,
    initialPageParam: 0,
  });
};
