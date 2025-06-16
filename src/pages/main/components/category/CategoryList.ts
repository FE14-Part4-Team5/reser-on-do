import type { FC } from 'react';
import type { Category } from '@/types/api/sharedType';
import ArtIcon from '@/assets/icons/icon_art.svg?react';
import FoodIcon from '@/assets/icons/icon_food.svg?react';
import SportIcon from '@/assets/icons/icon_sport.svg?react';
import TourIcon from '@/assets/icons/icon_tour.svg?react';
import BusIcon from '@/assets/icons/icon_bus.svg?react';
import WellbingIcon from '@/assets/icons/icon_wellbeing.svg?react';

export const CATEGORY_LIST: CategoryItemProps[] = [
  { key: '문화 · 예술', title: '🎵 문화 · 예술', label: '문화예술', icon: ArtIcon },
  { key: '식음료', title: '🍜 식음료', label: '식음료', icon: FoodIcon },
  { key: '스포츠', title: '🏀 스포츠', label: '스포츠', icon: SportIcon },
  { key: '투어', title: '🏙️ 투어', label: '투어', icon: TourIcon },
  { key: '관광', title: '🚌 관광', label: '관광', icon: BusIcon },
  { key: '웰빙', title: '🍃 웰빙', label: '웰빙', icon: WellbingIcon },
];

export interface CategoryItemProps {
  key: Category;
  title?: string;
  label: string;
  icon: FC<React.SVGProps<SVGSVGElement>>;
}
