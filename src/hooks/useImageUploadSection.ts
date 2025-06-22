import { activitiesService } from '@/apis/activities';
import type { GeneralInfoFormValues } from '@/pages/add-edit-experiences/schema/schema';
import { resizeImage } from '@/utils/resizeImage';
import { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';

export const useImageUploadSection = ({
  inputName,
  initialPreviews,
  maxCount,
  onRemoveInitial,
}: UseImageUploadSectionProps) => {
  const [previews, setPreviews] = useState<Preview[]>(initialPreviews ?? []);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastSyncedUrlsRef = useRef<string[]>([]);
  const isInitialLoadRef = useRef(true);

  const {
    setValue,
    formState: { errors },
    watch,
  } = useFormContext<GeneralInfoFormValues>();

  const watchedValue = watch(inputName as keyof GeneralInfoFormValues);

  useEffect(() => {
    if (!isInitialLoadRef.current) {
      return;
    }
    if (initialPreviews && initialPreviews.length > 0) {
      const initialUrls = initialPreviews.map(p => p.url);
      const sameAsLast =
        lastSyncedUrlsRef.current.length === initialUrls.length &&
        lastSyncedUrlsRef.current.every((u, idx) => u === initialUrls[idx]);
      if (!sameAsLast) {
        setPreviews(initialPreviews);
        setValue(inputName as keyof GeneralInfoFormValues, initialUrls, {
          shouldValidate: true,
          shouldDirty: false,
        });
        lastSyncedUrlsRef.current = initialUrls;
      }
      isInitialLoadRef.current = false;
    }
  }, [initialPreviews, inputName, setValue]);

  useEffect(() => {
    let deriveUrls: string[] = [];
    if (typeof watchedValue === 'string' && watchedValue) {
      deriveUrls = [watchedValue];
    } else if (isStringArray(watchedValue)) {
      deriveUrls = watchedValue;
    } else {
      deriveUrls = [];
    }
    if (deriveUrls.length === 0) {
      if (lastSyncedUrlsRef.current.length > 0) {
        setPreviews([]);
        lastSyncedUrlsRef.current = [];
      }
      return;
    }
    const isSame =
      deriveUrls.length === lastSyncedUrlsRef.current.length &&
      deriveUrls.every((u, idx) => u === lastSyncedUrlsRef.current[idx]);
    if (!isSame) {
      setPreviews(prevPreviews => {
        const initPreviews: Preview[] = deriveUrls.map(url => {
          const existing = prevPreviews.find(p => p.url === url);
          return existing ? existing : { id: `${url}-init`, file: null, url };
        });
        return initPreviews;
      });
      lastSyncedUrlsRef.current = deriveUrls;
    }
  }, [watchedValue]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    const remainingSlots = maxCount - previews.length;
    const validFiles = fileArray.slice(0, remainingSlots);

    const compressedFiles = await Promise.all(validFiles.map(file => resizeImage(file)));

    const newPreviews = await Promise.all(
      compressedFiles.map(async file => {
        const id = `${file.name}-${file.size}-${Date.now()}`;
        const { activityImageUrl } = await activitiesService.getActivityImageUrl({ image: file });
        return { id, file, url: activityImageUrl };
      })
    );

    if (inputName === 'bannerImageUrl') {
      setPreviews(prev => [...prev, ...newPreviews]);
      setValue(inputName, newPreviews[0]?.url ?? '', {
        shouldValidate: true,
      });
    } else if (inputName === 'subImageUrls') {
      const updated = [...previews, ...newPreviews];
      setPreviews(updated);
      const updatedUrls = updated.map(p => p.url);
      setValue(inputName as keyof GeneralInfoFormValues, updatedUrls, { shouldValidate: true });
      return;
    }
    e.target.value = '';
  };

  const handleIconClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = (id: string) => {
    const removedPreview = previews.find(p => p.id === id);
    if (removedPreview) {
      if (removedPreview.file === null && removedPreview.imageId && onRemoveInitial) {
        onRemoveInitial(removedPreview.imageId);
      }
    }
    const newPreviews = previews.filter(p => p.id !== id);
    if (inputName === 'bannerImageUrl') {
      setPreviews([]);
      setValue(inputName as keyof GeneralInfoFormValues, '', {
        shouldValidate: true,
        shouldDirty: true,
      });
    } else {
      setPreviews(newPreviews);
      const newUrls = newPreviews.map(p => p.url);
      setValue(inputName as keyof GeneralInfoFormValues, newUrls, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };
  return {
    previews,
    fileInputRef,
    handleFileChange,
    handleRemoveImage,
    handleIconClick,
    error: errors?.[inputName as keyof typeof errors],
  };
};

type UseImageUploadSectionProps = {
  inputName: string;
  maxCount: number;
  isRequired: boolean;
  initialPreviews?: Preview[];
  onRemoveInitial?: (imageId: string) => void;
};

interface Preview {
  id: string;
  file: File | null;
  url: string;
  imageId?: string;
}

const isStringArray = (value: unknown): value is string[] => {
  return Array.isArray(value) && value.every(item => typeof item === 'string');
};
