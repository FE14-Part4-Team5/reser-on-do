import { useRef, useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';

import MyExperiencesHeader from '@/components/my-experiences-header/MyExperiencesHeader';
import Input from '@/components/input/Input';
import Dropdown from '../dropdown/Dropdown';

import useDaumPostcode from '@/hooks/useDaumPostcode';

import type { GeneralInfoFormValues } from '../../schema/schema';

import ArrowDownIcon from '@/assets/icons/icon_alt arrow_down.svg?react';

import clsx from 'clsx';
import styles from './GeneralInfoSection.module.css';

const GeneralInfoSection = ({ title }: { title: string }) => {
  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<GeneralInfoFormValues>();
  const [showDropdown, setShowDropdown] = useState(false);
  const [sdkOpen, setSdkOpen] = useState(false);
  const watchedAddress = watch('address');
  const handleClickDropdown = () => {
    setShowDropdown(prev => !prev);
  };

  const postcodeRef = useRef<HTMLDivElement | null>(null);
  const loaded = useDaumPostcode();
  const detailRef = useRef<HTMLInputElement | null>(null);
  const openPostcode = () => {
    if (!loaded) return;
    setSdkOpen(true);
    const container = postcodeRef.current;
    if (!container) return;

    new window.daum.Postcode({
      oncomplete: data => {
        const selected = data.roadAddress || data.jibunAddress;
        setValue('address', selected, { shouldValidate: true });
        detailRef.current?.focus();
        setSdkOpen(false);
      },
      width: '100%',
      height: '100%',
    }).embed(container);
  };

  return (
    <div className={styles.formFields}>
      <MyExperiencesHeader title={title} />
      <div className={styles.input}>
        <Input
          {...register('title')}
          type="text"
          name="title"
          title="제목"
          placeholder="제목을 입력해 주세요"
          isError={!!errors.title}
          errorMessage={errors.title?.message}
        />
      </div>
      <Controller
        name="category"
        control={control}
        render={({ field }) => (
          <div>
            <div className={styles.categoryLabel}>카테고리</div>
            <div
              role="button"
              tabIndex={-1}
              aria-invalid={!!errors.category}
              className={clsx(
                styles.category,
                field.value && styles.selected,
                errors.category && styles.error
              )}
              ref={field.ref}
              onClick={handleClickDropdown}
            >
              <div
                className={clsx(styles.categoryPlaceholder, {
                  [styles.selected]: !!field.value,
                })}
              >
                {field.value || '카테고리를 선택해 주세요'}
              </div>
              <ArrowDownIcon />
              {showDropdown && (
                <Dropdown
                  options={CATEGORY_OPTIONS}
                  selected={field.value}
                  onSelect={option => {
                    field.onChange(option);
                    setShowDropdown(false);
                  }}
                />
              )}
            </div>
            {errors.category && (
              <div className={styles.errorMessage}>{errors.category.message}</div>
            )}
          </div>
        )}
      />
      <div>
        <label htmlFor="description" className={styles.descriptionLabel}>
          설명
        </label>
        <textarea
          {...register('description')}
          name="description"
          id="description"
          placeholder="체험에 대한 설명을 입력해 주세요"
          className={clsx(styles.description, errors.description && styles.error)}
        />
        {errors.description && (
          <div className={styles.errorMessage}>{errors.description?.message}</div>
        )}
      </div>
      <div className={styles.input}>
        <Input
          {...register('price')}
          isError={!!errors.price}
          errorMessage={errors.price?.message}
          name="price"
          title="가격"
          placeholder="체험 금액을 입력해 주세요"
        />
      </div>
      <div className={styles.input}>
        <Input
          {...register('address')}
          isError={!!errors.address}
          errorMessage={errors.address?.message}
          name="address"
          title="주소"
          placeholder="주소를 입력해 주세요"
          value={watchedAddress}
          readOnly
          role="button"
          aria-label="주소 검색 열기"
          onClick={openPostcode}
        />
        <div
          className={styles.sdkWrapper}
          style={{ display: sdkOpen ? 'flex' : 'none' }}
          onClick={() => setSdkOpen(false)}
        >
          <div
            id="postcode-modal"
            ref={postcodeRef}
            className={styles.sdk}
            onClick={e => e.stopPropagation()}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default GeneralInfoSection;

const CATEGORY_OPTIONS = ['문화 · 예술', '식음료', '스포츠', '투어', '관광', '웰빙'];
