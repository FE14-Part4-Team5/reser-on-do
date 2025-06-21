import { useImageUploadSection } from '@/hooks/useImageUploadSection';

import PlusIcon from '@/assets/icons/icon_plus.svg?react';
import DeleteIcon from '@/assets/icons/icon_delete.svg?react';

import clsx from 'clsx';
import styles from './ImageUploadSection.module.css';

const ImageUploadSection = ({
  title,
  description,
  inputName,
  maxCount,
  isRequired,
  initialPreviews,
  onRemoveInitial,
}: ImageUploadSectionProps) => {
  const { previews, fileInputRef, handleFileChange, handleIconClick, handleRemoveImage, error } =
    useImageUploadSection({
      inputName,
      maxCount,
      initialPreviews,
      onRemoveInitial,
      isRequired,
    });
  return (
    <div className={styles.bannerImageSection}>
      <div className={styles.bannerImageSectionTitle}>{title}</div>
      <div className={styles.bannerImageAddWrapper}>
        <div
          onClick={handleIconClick}
          className={clsx(styles.bannerImageAdd, isRequired && error && styles.error)}
        >
          <PlusIcon className={styles.plusIcon} />
        </div>
        {previews.map(({ id, url }, i) => (
          <div key={id} className={styles.bannerImagePreviewWrapper}>
            <img src={url} alt={`미리보기 이미지 ${i + 1}`} className={styles.bannerImagePreview} />
            <button
              type="button"
              onClick={() => handleRemoveImage(id)}
              className={styles.imageDeleteButton}
            >
              <DeleteIcon className={styles.imageDeleteButtonIcon} />
            </button>
          </div>
        ))}
      </div>
      <input
        type="file"
        accept="image/png, image/jpeg, image/jpg"
        multiple={maxCount > 1}
        ref={fileInputRef}
        onChange={handleFileChange}
        hidden
      />
      {isRequired && error && <div className={styles.errorMessage}>{error.message}</div>}
      <div className={styles.bannerDescription}>{description}</div>
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
  initialPreviews?: Preview[];
  onRemoveInitial?: (imageId: string) => void;
};

interface Preview {
  id: string;
  file: File | null;
  url: string;
  imageId?: string;
}
