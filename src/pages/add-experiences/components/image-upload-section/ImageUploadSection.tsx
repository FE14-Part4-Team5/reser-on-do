import { useRef, useState } from 'react';

import { activitiesService } from '@/apis/activities';

import PlusIcon from '@/assets/icons/icon_plus.svg?react';
import DeleteIcon from '@/assets/icons/icon_delete.svg?react';

import styles from './ImageUploadSection.module.css';
import { useFormContext } from 'react-hook-form';
import type { GeneralInfoFormValues } from '../../schema/schema';
import clsx from 'clsx';

interface Preview {
  id: string;
  file: File;
  url: string;
}
const ImageUploadSection = ({
  title,
  description,
  inputName,
  maxCount,
  isRequired,
}: ImageUploadSectionProps) => {
  const [previews, setPreviews] = useState<Preview[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    setValue,
    formState: { errors },
  } = useFormContext<GeneralInfoFormValues>();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    const remainingSlots = maxCount - previews.length;
    const validFiles = fileArray.slice(0, remainingSlots);

    const newPreviews = await Promise.all(
      validFiles.map(async file => {
        const id = `${file.name}-${file.size}-${Date.now()}`;
        const { activityImageUrl } = await activitiesService.getActivityImageUrl({ image: file });
        return { id, file, url: activityImageUrl };
      })
    );

    setPreviews(prev => [...prev, ...newPreviews]);

    if (inputName === 'bannerImageUrl') {
      setValue(inputName, newPreviews[0]?.url ?? '', {
        shouldValidate: true,
      });
    } else if (inputName === 'subImageUrls') {
      const newFiles = newPreviews.map(p => p.file);
      setValue(inputName, newFiles, {
        shouldValidate: true,
      });
    }

    e.target.value = '';
  };

  const handleIconClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = (id: string) => {
    const newPreviews = previews.filter(p => p.id !== id);
    setPreviews(newPreviews);

    const newFiles = newPreviews.map(p => p.file);
    setValue(inputName as keyof GeneralInfoFormValues, newFiles, {
      shouldValidate: true,
    });
  };

  return (
    <div className={styles.bannerImageSection}>
      <div className={styles.bannerImageSectionTitle}>{title}</div>
      <div className={styles.bannerImageAddWrapper}>
        <div
          onClick={handleIconClick}
          className={clsx(
            styles.bannerImageAdd,
            isRequired && errors?.bannerImageUrl && styles.error
          )}
        >
          <PlusIcon className={styles.plusIcon} />
        </div>
        {previews.map(({ id, url }, i) => (
          <div key={id} className={styles.bannerImagePreviewWrapper}>
            <img src={url} alt={`미리보기 이미지 ${i + 1}`} className={styles.bannerImagePreview} />
            <button onClick={() => handleRemoveImage(id)} className={styles.imageDeleteButton}>
              <DeleteIcon className={styles.imageDeleteButtonIcon} />
            </button>
          </div>
        ))}
      </div>
      <input
        type="file"
        accept="image/*"
        multiple={maxCount > 1}
        name={inputName}
        ref={fileInputRef}
        onChange={handleFileChange}
        hidden
      />
      <div className={styles.bannerDescription}>{description}</div>
      {isRequired && errors?.bannerImageUrl && (
        <div className={styles.errorMessage}>{errors.bannerImageUrl.message}</div>
      )}
    </div>
  );
};

export default ImageUploadSection;

type ImageUploadSectionProps = {
  title: string;
  description: string;
  inputName: string;
  maxCount: number;
  isRequired: boolean;
};
