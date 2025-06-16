import { useFormContext, Controller } from 'react-hook-form';

import MyExperiencesHeader from '@/components/my-experiences-header/MyExperiencesHeader';
import Input from '@/components/input/Input';

import ArrowDownIcon from '@/assets/icons/icon_alt arrow_down.svg?react';

import styles from './GeneralInfoSection.module.css';
import { useRef, useState } from 'react';
import Dropdown from '../dropdown/Dropdown';
import clsx from 'clsx';
import useDaumPostcode from '@/hooks/useDaumPostcode';
import type { GeneralInfoFormValues } from '../../schema/schema';

const GeneralInfoSection = () => {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext<GeneralInfoFormValues>();

  const CATEGORY_OPTIONS = ['문화 · 예술', '식음료', '스포츠', '투어', '관광', '웰빙'];

  const [showDropdown, setShowDropdown] = useState(false);

  const [sdkOpen, setSdkOpen] = useState(false);

  const handleClickDropdown = () => {
    setShowDropdown(prev => !prev);
  };

  const loaded = useDaumPostcode();
  const [addr, setAddr] = useState('');
  const detailRef = useRef<HTMLInputElement | null>(null);

  const openPostcode = () => {
    if (!loaded) return;

    setSdkOpen(true);

    const container = document.getElementById('postcode-modal');
    if (!container) return;

    new window.daum.Postcode({
      oncomplete: data => {
        const selected = data.roadAddress || data.jibunAddress;
        setAddr(selected);
        setValue('address', selected, { shouldValidate: true });
        detailRef.current?.focus();
        setSdkOpen(false);
      },
      width: container.clientWidth,
      height: container.clientHeight,
    }).embed(container);
  };

  return (
    <div className={styles.formFields}>
      <MyExperiencesHeader title="내 체험 등록" />
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
            <div className={styles.categoryLable}>카테고리</div>
            <div
              role="button"
              tabIndex={-1}
              aria-invalid={!!errors.category}
              className={clsx(
                styles.category,
                field.value && styles.selected,
                errors.category && styles.error
              )}
              onClick={handleClickDropdown}
              {...field}
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
          value={addr}
          readOnly
          onClick={openPostcode}
          style={{ cursor: 'pointer' }}
        />
        <div
          className={styles.sdkWrapper}
          style={{ display: sdkOpen ? 'flex' : 'none' }}
          onClick={() => setSdkOpen(false)}
        >
          <div id="postcode-modal" className={styles.sdk} onClick={e => e.stopPropagation()}></div>
        </div>
      </div>
    </div>
  );
};

export default GeneralInfoSection;
