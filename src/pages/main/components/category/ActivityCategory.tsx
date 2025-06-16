import clsx from 'clsx';
import styles from './ActivityCategory.module.css';
import { useState } from 'react';
import Button from '@/components/Button/Button';
import useViewPortSize from '@/hooks/useViewPortSize';
import type { Category } from '@/types/api/sharedType';
import { CATEGORY_LIST } from './CategoryList';

interface ActivityCategoryProps {
  onSelectCategory: (category: Category | null) => void;
}

const ActivityCategory = ({ onSelectCategory }: ActivityCategoryProps) => {
  const { viewportSize } = useViewPortSize();
  const [selectCategory, setSelectCategory] = useState<Category | null>(null);

  const handleCategoryClick = (category: Category) => {
    const newCategory = selectCategory === category ? null : category;
    setSelectCategory(newCategory);
    console.log(`선택된 카테고리 : ${category}`);
    onSelectCategory(newCategory);
  };

  const isSelected = (category: Category) => selectCategory === category;

  return (
    <div
      className={clsx(styles.categoryWrapper, viewportSize !== 'desktop' && styles.mobileScroll)}
    >
      {CATEGORY_LIST.map(({ key, label, icon: CategoryIcon }) => (
        <Button
          key={key}
          type="button"
          isActive={true}
          variant="secondary"
          icon={
            <CategoryIcon
              className={clsx(styles.btnIcon, {
                [styles.active]: isSelected(key),
              })}
            />
          }
          className={clsx(styles.category, {
            [styles.active]: isSelected(key),
          })}
          onClick={() => handleCategoryClick(key)}
        >
          {label}
        </Button>
      ))}
    </div>
  );
};

export default ActivityCategory;
