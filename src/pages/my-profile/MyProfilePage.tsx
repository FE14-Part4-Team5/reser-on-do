import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FormProvider } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import {
  useMyProfileQuery,
  useCreateImageUrlMutation,
  useUpdateMyProfileMutation,
} from '@/hooks/useMyProfile';
import { useMyProfileUpdateForm, type MyProfileFormValues } from '@/hooks/useMyProfileUpdateForm';
import useViewPortSize from '@/hooks/useViewPortSize';
import SideNavigation from '@/components/side-navigation/SideNavigation';
import ProfileForm from './components/profile-form/ProfileForm';
import defaultProfileImg from '@/assets/icons/profile_size=lg.svg';
import styles from './MyProfilePage.module.css';
import { useAuthStore } from '@/stores/useAuthStore';
import { useToast } from '@/hooks/useToast';
import IconEarth from '@/assets/icons/logo_earth.svg';
import IconWarning from '@/assets/icons/modalwarning.svg';
import { LoadingSideNavigation } from '../my-experiences/components/loading/Loading';

const MyProfilePage = () => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const { viewportSize } = useViewPortSize();
  const { showToast } = useToast();
  const [isEdit, setIsEdit] = useState(false);
  const { data: userData } = useMyProfileQuery();
  const [profileImage, setProfileImage] = useState(userData?.profileImageUrl || '');
  const isProfileChanged = !!profileImage && profileImage !== userData?.profileImageUrl;
  const { mutate: updateMutate } = useUpdateMyProfileMutation();
  const { mutate: createMutate } = useCreateImageUrlMutation();
  const methods = useMyProfileUpdateForm();
  const { setNickname, setProfileImageUrl } = useAuthStore();

  useEffect(() => {
    if (location.pathname === '/my-profile' && viewportSize === 'mobile') {
      setIsEdit(false);
    } else {
      setIsEdit(true);
    }
  }, [location.pathname, viewportSize]);

  const handleCancelUpdate = () => {
    setIsEdit(prev => !prev);
  };

  const handleProfileSubmit = async (data: MyProfileFormValues) => {
    updateMutate(
      {
        nickname: data.nickname,
        newPassword: data.newPassword,
        profileImageUrl: profileImage,
      },
      {
        onSuccess: async () => {
          showToast({
            label: '수정 성공!',
            iconSrc: IconEarth,
          });

          await queryClient.invalidateQueries({ queryKey: ['myProfile'] });
          if (data.nickname !== undefined && data.nickname !== '') setNickname(data.nickname);
          if (profileImage !== undefined) setProfileImageUrl(profileImage);
          methods.reset({
            nickname: '',
            newPassword: '',
            newConfirmPassword: '',
          });
          setIsEdit(prev => !prev);
        },
        onError: () => {
          showToast({
            label: '수정 실패!',
            iconSrc: IconWarning,
            style: { color: 'pink' },
          });
          console.error();
        },
      }
    );
  };

  const handleProfileImageUpload = (file: File) => {
    createMutate(
      { image: file },
      {
        onSuccess: data => {
          console.log('이미지 Url 바꾸기 성공');
          setProfileImage(data.profileImageUrl);
        },
        onError: () => {
          console.error();
        },
      }
    );
  };

  return (
    <FormProvider {...methods}>
      <div className={styles.container}>
        {(viewportSize !== 'mobile' || !isEdit) && (
          <div className={styles.sideNavigationWrapper}>
            {userData ? (
              <SideNavigation
                defaultImage={userData?.profileImageUrl || defaultProfileImg}
                onImageUpload={handleProfileImageUpload}
                onNavItemClick={() => setIsEdit(true)}
              />
            ) : (
              <LoadingSideNavigation />
            )}
          </div>
        )}
        {(viewportSize !== 'mobile' || isEdit) && (
          <div className={styles.profileFormWrapper}>
            <ProfileForm
              onClick={handleCancelUpdate}
              onSubmit={handleProfileSubmit}
              userData={userData}
              isProfileChanged={isProfileChanged}
            />
          </div>
        )}
      </div>
    </FormProvider>
  );
};
export default MyProfilePage;
