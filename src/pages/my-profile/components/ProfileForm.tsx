import clsx from 'clsx';
import { useFormContext } from 'react-hook-form';
import styles from './ProfileForm.module.css';
import Input from '@/components/input/Input';
import Button from '@/components/button/Button';
import MyExperiencesHeader from '@/components/my-experiences-header/MyExperiencesHeader';
import { useFormChangeChecker } from '@/hooks/useFormChangeChecker';
import type { MyProfileFormValues } from '@/hooks/useMyProfileUpdateForm';
import type { GetMeResponse } from '@/types/api/usersType';

interface MyProfileFormProps {
  onClick: () => void;
  onSubmit: (data: MyProfileFormValues) => void;
  userData?: GetMeResponse;
  isProfileChanged: boolean;
}

const ProfileForm = ({ onClick, onSubmit, userData, isProfileChanged }: MyProfileFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useFormContext<MyProfileFormValues>();
  const isFormChanged = useFormChangeChecker(userData);

  return (
    <div className={styles.userInfoContainer}>
      <MyExperiencesHeader title="내 정보" subTitle="닉네임과 비밀번호를 수정하실 수있습니다." />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.inputWrapper}>
          <Input
            autoComplete="off"
            title="닉네임"
            placeholder={userData?.nickname || ''}
            isError={!!errors.nickname}
            errorMessage={errors.nickname?.message}
            {...register('nickname')}
          />
        </div>
        <div className={styles.inputWrapper}>
          <Input title="이메일" autoComplete="email" placeholder={userData?.email || ''} disabled />
        </div>
        <div className={styles.inputWrapper}>
          <Input
            type="password"
            autoComplete="new-password"
            title="비밀번호"
            placeholder="8자 이상 입력해주세요"
            isError={!!errors.newPassword}
            errorMessage={errors.newPassword?.message}
            showEyeIcon={true}
            {...register('newPassword')}
          />
        </div>
        <div className={styles.inputWrapper}>
          <Input
            type="password"
            autoComplete="new-password"
            title="비밀번호 확인"
            placeholder="비밀번호를 한번 더 입력해주세요"
            isError={!!errors.newConfirmPassword}
            errorMessage={errors.newConfirmPassword?.message}
            showEyeIcon={true}
            {...register('newConfirmPassword')}
          />
        </div>
        <div className={styles.formButtomWrapper}>
          <Button
            type="button"
            isActive={true}
            onClick={onClick}
            variant="secondary"
            className={clsx(styles.cancleButton, styles.commonProfileButton)}
          >
            취소하기
          </Button>
          <Button
            type="submit"
            isActive={(isFormChanged || isProfileChanged) && isValid}
            variant="primary"
            className={clsx(styles.submitButton, styles.commonProfileButton)}
          >
            저장하기
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
