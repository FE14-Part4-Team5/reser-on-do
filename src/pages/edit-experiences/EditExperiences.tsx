import { useParams } from 'react-router-dom';
import {
  useForm,
  FormProvider,
  type SubmitHandler,
  type SubmitErrorHandler,
  type Resolver,
} from 'react-hook-form';
import styles from './EditExperiences.module.css';
import { generalInfoSchema, type GeneralInfoFormValues } from '../add-experiences/schema/schema';

import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { activitiesService } from '@/apis/activities';
import GeneralInfoSection from '../add-experiences/components/general-info-section/GeneralInfoSection';
import ScheduleSection from '../add-experiences/components/schedule-section/ScheduleSection';
import ImageUploadSection from '../add-experiences/components/image-upload-section/ImageUploadSection';
import Button from '@/components/Button/Button';
import { myActivitiesService } from '@/apis/myActivities';
import { useEffect, useState } from 'react';
import type { UpdateActivityResponse } from '@/types/api/myActivitiesType';

interface Preview {
  id: string;
  file: File | null;
  url: string;
  imageId?: string;
}

const EditExperiences = () => {
  const [initialData, setInitialData] = useState<UpdateActivityResponse | null>(null);
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
  const [removedBannerImageId, setRemovedBannerImageId] = useState<string | null>(null);

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
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { handleSubmit, setFocus } = methods;

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
      const existingBannerUrl = bannerInitialPreview?.url;
      let bannerToAdd: string | undefined;
      if (bannerInitialPreview) {
        if (data.bannerImageUrl !== existingBannerUrl) {
          if (removedBannerImageId === null) {
            setRemovedBannerImageId(bannerInitialPreview.imageId || null);
          }
          bannerToAdd = data.bannerImageUrl;
        }
      } else {
        bannerToAdd = data.bannerImageUrl;
      }
      const payload = {
        title: data.title,
        category: data.category,
        description: data.description,
        price: data.price,
        address: data.address,
        schedules: data.schedules,
        subImageIdsToRemove: removedSubImageIds,
        subImageUrlsToAdd: newSubUrls,
        bannerImageIdToRemove: removedBannerImageId ? [removedBannerImageId] : [],
        bannerImageUrlToAdd: bannerToAdd || undefined,
      };
      const response = await myActivitiesService.updateActivity(
        { activityId: activityIdNum },
        payload
      );
      console.log('체험 수정 성공', response);
      navigate(`/detail/${response.id}`, { state: { updated: Date.now() } });
    } catch (error) {
      console.error('체험 등록 중 오류:', error);
      // TODO: 사용자에게 오류 알림 UI 표시
    }
  };
  const onError: SubmitErrorHandler<GeneralInfoFormValues> = errors => {
    console.log('유효성 실패:', errors);
    if (errors.category) setFocus('category');
  };

  useEffect(() => {
    if (!id) return;
    const activityIdNum = Number(id);
    activitiesService
      .getActivityId({ activityId: activityIdNum })
      .then(data => {
        setInitialData(data);
        methods.reset({
          title: data.title,
          category: data.category,
          description: data.description,
          price: data.price,
          address: data.address,
          schedules: data.schedules.map(s => ({
            date: s.date,
            startTime: s.startTime,
            endTime: s.endTime,
          })),
          bannerImageUrl: data.bannerImageUrl,
          subImageUrls: data.subImages.map(img => img.imageUrl),
        });
        const subPreviews = data.subImages.map(img => ({
          id: img.id,
          file: null,
          url: img.imageUrl,
          imageId: img.id,
        }));
        setSubInitialPreviews(subPreviews);
        const bannerPrev = data.bannerImageUrl
          ? {
              id: String(data.bannerImageId || data.id),
              file: null,
              url: data.bannerImageUrl,
              imageId: String(data.bannerImageId || data.id),
            }
          : null;
        setBannerInitialPreview(bannerPrev);
      })
      .catch(err => console.error(err));
  }, [id, methods]);

  return (
    <FormProvider {...methods}>
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
          onRemoveInitial={(imageId: string) => setRemovedBannerImageId(imageId)}
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
