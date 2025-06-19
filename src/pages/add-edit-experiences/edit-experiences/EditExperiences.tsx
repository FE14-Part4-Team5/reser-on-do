import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useForm,
  FormProvider,
  type SubmitHandler,
  type SubmitErrorHandler,
  type Resolver,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { generalInfoSchema, type GeneralInfoFormValues } from '../schema/schema';
import ConfirmModal from '@/components/modal/ConfirmModal';
import GeneralInfoSection from '../components/general-info-section/GeneralInfoSection';
import ScheduleSection from '../components/schedule-section/ScheduleSection';
import ImageUploadSection from '../components/image-upload-section/ImageUploadSection';
import Button from '@/components/button/Button';

import { activitiesService } from '@/apis/activities';
import { myActivitiesService } from '@/apis/myActivities';

import { useToast } from '@/hooks/useToast';
import useBackBlocker from '@/hooks/useBackBlocker';

import type { UpdateActivityRequest } from '@/types/api/myActivitiesType';

import IconEarth from '@/assets/icons/logo_earth.svg';
import IconError from '@/assets/icons/modalwarning.svg';

import styles from './EditExperiences.module.css';

const EditExperiences = () => {
  const [subInitialPreviews, setSubInitialPreviews] = useState<
    { id: string; file: File | null; url: string; imageId?: string }[]
  >([]);
  const [bannerInitialPreview, setBannerInitialPreview] = useState<{
    id: string;
    file: File | null;
    url: string;
    imageId?: string;
  } | null>(null);
  const [removedSubImageIds, setRemovedSubImageIds] = useState<string[]>([]);

  const methods = useForm<GeneralInfoFormValues>({
    resolver: zodResolver(generalInfoSchema) as Resolver<GeneralInfoFormValues>,
    defaultValues: {
      title: '',
      category: undefined,
      description: '',
      price: undefined,
      address: '',
      schedules: [] as { id?: number; date: string; startTime: string; endTime: string }[],
      scheduleIdsToRemove: [] as number[],
      bannerImageUrl: '',
      subImageUrls: [],
    },
    mode: 'onBlur',
    criteriaMode: 'all',
  });
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { handleSubmit, setFocus } = methods;
  const { showToast } = useToast();

  const onValid: SubmitHandler<GeneralInfoFormValues> = async data => {
    try {
      if (!id) return;
      const activityIdNum = Number(id);
      if (isNaN(activityIdNum)) {
        console.error('유효하지 않은 activityId:', id);
        return;
      }
      const existingSubUrls = subInitialPreviews.map(p => p.url);
      const newSubUrls = data.subImageUrls.filter(url => !existingSubUrls.includes(url));
      const schedulesToAdd = (data.schedules || [])
        .filter(item => item.id === undefined)
        .map(({ date, startTime, endTime }) => ({ date, startTime, endTime }));
      const scheduleIdsToRemove = (data.scheduleIdsToRemove || []).map(id => Number(id));
      const payload: UpdateActivityRequest = {
        title: data.title,
        category: data.category,
        description: data.description,
        price: data.price,
        address: data.address,
        bannerImageUrl: data.bannerImageUrl,
        schedulesToAdd,
        scheduleIdsToRemove,
        subImageIdsToRemove: removedSubImageIds.map(id => Number(id)),
        subImageUrlsToAdd: newSubUrls,
      };
      const response = await myActivitiesService.updateActivity(
        { activityId: activityIdNum },
        payload
      );
      navigate(`/detail/${response.id}`, { state: { updated: Date.now() } });
      showToast({
        label: '체험 수정 성공!',
        iconSrc: IconEarth,
      });
    } catch {
      showToast({
        label: '체험 수정을 실패했어요.',
        iconSrc: IconError,
        style: { color: 'pink' },
      });
    }
  };
  const onError: SubmitErrorHandler<GeneralInfoFormValues> = errors => {
    if (errors.category) setFocus('category');
  };

  useEffect(() => {
    const activityIdNum = Number(id);
    activitiesService
      .getActivityId({ activityId: activityIdNum })
      .then(data => {
        methods.reset({
          title: data.title,
          category: data.category,
          description: data.description,
          price: data.price,
          address: data.address,
          schedules: data.schedules.map(s => ({
            id: s.id,
            date: s.date,
            startTime: s.startTime,
            endTime: s.endTime,
          })),
          scheduleIdsToRemove: [],
          bannerImageUrl: data.bannerImageUrl,
          subImageUrls: data.subImages.map(img => img.imageUrl),
        });
        const subPreviews = data.subImages.map(img => ({
          id: String(img.id),
          file: null,
          url: img.imageUrl,
          imageId: String(img.id),
        }));
        setSubInitialPreviews(subPreviews);
        const bannerPrev = data.bannerImageUrl
          ? {
              id: String(data.id),
              file: null,
              url: data.bannerImageUrl,
            }
          : null;
        setBannerInitialPreview(bannerPrev);
      })
      .catch(err => console.error(err));
  }, [id, methods]);

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
        <GeneralInfoSection title="내 체험 수정" />
        <ScheduleSection />
        <ImageUploadSection
          title="배너이미지"
          description="* 배너이미지는 최대 1개 등록할 수 있습니다."
          inputName="bannerImageUrl"
          maxCount={1}
          isRequired={true}
          initialPreviews={bannerInitialPreview ? [bannerInitialPreview] : []}
        />
        <ImageUploadSection
          title="소개이미지"
          description="* 소개이미지는 최대 4개 등록할 수 있습니다."
          inputName="subImageUrls"
          maxCount={4}
          isRequired={false}
          initialPreviews={subInitialPreviews}
          onRemoveInitial={(imageId: string) => setRemovedSubImageIds(prev => [...prev, imageId])}
        />
        <div className={styles.buttonWrapper}>
          <Button
            type="submit"
            isActive={true}
            style={{ padding: '1.25rem 3.694rem', fontWeight: 'bold' }}
          >
            수정하기
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default EditExperiences;
