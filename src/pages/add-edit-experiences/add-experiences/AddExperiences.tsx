import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

import GeneralInfoSection from '../components/general-info-section/GeneralInfoSection';
import ScheduleSection from '../components/schedule-section/ScheduleSection';
import ConfirmModal from '@/components/modal/ConfirmModal';
import ImageUploadSection from '../components/image-upload-section/ImageUploadSection';
import Button from '@/components/Button/Button';
import { generalInfoSchema } from '../schema/schema';

import { activitiesService } from '@/apis/activities';

import useBackBlocker from '@/hooks/useBackBlocker';
import { useToast } from '@/hooks/useToast';

import type { SubmitHandler, SubmitErrorHandler, Resolver } from 'react-hook-form';
import type { GeneralInfoFormValues } from '../schema/schema';

import IconEarth from '@/assets/icons/logo_earth.svg';
import IconError from '@/assets/icons/modalwarning.svg';

import styles from './AddExperiences.module.css';

const AddExperiences = () => {
  const methods = useForm<GeneralInfoFormValues>({
    resolver: zodResolver(generalInfoSchema) as Resolver<GeneralInfoFormValues>,
    defaultValues: {
      title: '',
      category: undefined,
      description: '',
      price: undefined,
      address: '',
      schedules: [] as { date: string; startTime: string; endTime: string }[],
      bannerImageUrl: '',
      subImageUrls: [],
    },
    mode: 'onBlur',
    criteriaMode: 'all',
  });
  const { handleSubmit, setFocus } = methods;
  const navigate = useNavigate();
  const { showToast } = useToast();
  const onValid: SubmitHandler<GeneralInfoFormValues> = async data => {
    try {
      const response = await activitiesService.createActivity(data);
      navigate(`/detail/${response.id}`);
      showToast({
        label: '체험 등록 성공!',
        iconSrc: IconEarth,
      });
    } catch {
      showToast({
        label: '체험 등록에 실패했어요.',
        iconSrc: IconError,
        style: { color: 'pink' },
      });
    }
  };
  const onError: SubmitErrorHandler<GeneralInfoFormValues> = errors => {
    if (errors.category) setFocus('category');
  };

  const { isModalOpen, closeModal, confirmNavigation } = useBackBlocker();

  return (
    <FormProvider {...methods}>
      {isModalOpen && (
        <ConfirmModal
          text="저장되지 않았습니다. 정말 뒤로 가시겠습니까?"
          cancelText="아니요"
          confirmText="네"
          onConfirm={confirmNavigation}
          onClose={closeModal}
        />
      )}
      <form onSubmit={handleSubmit(onValid, onError)} className={styles.root}>
        <GeneralInfoSection title="내 체험 등록" />
        <ScheduleSection />
        <ImageUploadSection
          title="배너이미지"
          description="* 배너이미지는 최대 1개 등록할 수 있습니다."
          inputName="bannerImageUrl"
          maxCount={1}
          isRequired={true}
        />
        <ImageUploadSection
          title="소개이미지"
          description="* 소개이미지는 최대 4개 등록할 수 있습니다."
          inputName="subImageUrls"
          maxCount={4}
          isRequired={false}
        />
        <div className={styles.buttonWrapper}>
          <Button
            type="submit"
            isActive={true}
            style={{ padding: '1.25rem 3.694rem', fontWeight: 'bold' }}
          >
            등록하기
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default AddExperiences;
