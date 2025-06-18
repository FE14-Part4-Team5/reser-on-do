import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyprofile } from '@/pages/my-experiences/example/example';
import { usersService } from '@/apis/users';
import type {
  GetMeResponse,
  PatchMeRequest,
  PatchMeResponse,
  CreateImageUrlRequest,
  CreateImageUrlResponse,
} from '@/types/api/usersType';

export const useMyProfile = (teamId: string) => {
  return useSuspenseQuery<GetMeResponse>({
    queryKey: ['myProfile', teamId],
    queryFn: () => getMyprofile(teamId),
  });
};

// // 내 정보 조회(수정)
// 위의 쿼리 다른 분들도 사용하고 있는 이유로 임의로 지우거나 수정할수가 없어서 따로 만듭니다:)
// 아래부분으로 수정할 것 다 수정되면 나중에 위의 쿼리는 삭제하겠습니다!
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
