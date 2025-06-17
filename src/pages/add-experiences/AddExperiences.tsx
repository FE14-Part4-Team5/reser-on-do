import Button from '@/components/Button/Button';

import { useForm, FormProvider } from 'react-hook-form';
import type { FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { generalInfoSchema } from './schema/schema';
import type { GeneralInfoFormValues } from './schema/schema';

import GeneralInfoSection from './components/general-info-section/GeneralInfoSection';
import ScheduleSection from './components/schedule-section/ScheduleSection';

import styles from './AddExperiences.module.css';
import ImageUploadSection from './components/image-upload-section/ImageUploadSection';
import { activitiesService } from '@/apis/activities';
import { useNavigate } from 'react-router-dom';

const AddExperiences = () => {
  const methods = useForm<GeneralInfoFormValues>({
    resolver: zodResolver(generalInfoSchema),
    defaultValues: {
      title: '',
      category: undefined,
      description: '',
      price: undefined,
      address: '',
      schedules: [] as { date: string; startTime: string; endTime: string }[],
      bannerImageUrl: '',
      subImageUrls: [] as File[],
    },
    mode: 'onBlur',
    criteriaMode: 'all',
  });
  const { handleSubmit, setFocus } = methods;
  const navigate = useNavigate();
  const onValid = async (data: GeneralInfoFormValues) => {
    try {
      const response = await activitiesService.createActivity(data);
      console.log('체험 등록 성공:', response);
      // 성공 시 이동 또는 알림 처리, 예: 목록 페이지로 리디렉트
      navigate('/my-experiences');
    } catch (error) {
      console.error('체험 등록 중 오류:', error);
      // TODO: 사용자에게 오류 알림 UI 표시
    }
  };
  const onError = (errors: FieldErrors<GeneralInfoFormValues>) => {
    console.log('유효성 실패:', errors);
    if (errors.category) setFocus('category');
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onValid, onError)} className={styles.root}>
        <GeneralInfoSection />
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
