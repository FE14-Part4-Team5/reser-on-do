import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersService } from '@/apis/users';
import type {
  GetMeResponse,
  PatchMeRequest,
  PatchMeResponse,
  CreateImageUrlRequest,
  CreateImageUrlResponse,
} from '@/types/api/usersType';

// 내 정보 조회
export const useMyProfileQuery = () => {
  return useSuspenseQuery<GetMeResponse>({
    queryKey: ['myProfile'],
    queryFn: () => usersService.getMe(),
  });
};

// 내 정보 수정
export const useUpdateMyProfileMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<PatchMeResponse, Error, PatchMeRequest>({
    mutationFn: async (body: PatchMeRequest) => {
      return usersService.updateMe(body);
    },
    onSuccess: body => {
      console.log(`쿼리-저장 완료: ${body.nickname} ${body.profileImageUrl}`);
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
    },
    onError: () => {
      console.log('쿼리-저장 실패');
    },
  });
};

// 프로필 이미지 URL 생성
export const useCreateImageUrlMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<CreateImageUrlResponse, Error, CreateImageUrlRequest>({
    mutationFn: async (body: CreateImageUrlRequest) => {
      return usersService.createProfileImageUrl(body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
    },
    onError: () => {
      console.error('이미지 URL 생성 실패');
    },
  });
};
