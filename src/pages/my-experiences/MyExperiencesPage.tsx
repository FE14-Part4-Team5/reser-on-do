import { useState } from 'react';
import { Link } from 'react-router-dom';

import SideNavigation from '@/components/side-navigation/SideNavigation';
import { LoadingSideNavigation } from './components/loading/Loading';
import MyExperiencesHeader from '@/components/my-experiences-header/MyExperiencesHeader';
import MyExperiencesCardList from './components/my-experiences-card-list/MyExperiencesCardList';
import Modal from '../../components/modal/ConfirmModal';
import MyExperiencesButton from './components/my-experiences-button/MyExperiencesButton';
import type { MyExperienceCardProps } from '@/components/my-experience-card/MyExperienceCard';

import { myActivitiesService } from '@/apis/myActivities';

import { useInfiniteMyActivities } from '@/hooks/useInfiniteMyActivities';
import { useMyProfileQuery } from '@/hooks/useMyProfile';
import { useToast } from '@/hooks/useToast';

import IconEarth from '@/assets/icons/logo_earth.svg';
import IconError from '@/assets/icons/modalwarning.svg';

import styles from './MyExperiencesPage.module.css';

const MyExperiences = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activityId, setActivityId] = useState<number | null>(null);

  const handleOpen = (id: number) => {
    setActivityId(id);
    setIsModalOpen(true);
  };

  const { showToast } = useToast();

  const handleConfirmDelete = async () => {
    try {
      if (activityId === null) return;
      await myActivitiesService.deleteActivity({ teamId: '14-5', activityId });
      refetch();
      showToast({
        label: '체험 삭제 성공!',
        iconSrc: IconEarth,
      });
    } catch {
      showToast({
        label: '체험 삭제 실패!',
        iconSrc: IconError,
        style: { color: 'pink' },
      });
    } finally {
      setIsModalOpen(false);
    }
  };

  const { data: userData } = useMyProfileQuery();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useInfiniteMyActivities(
    { size: 5 }
  );

  const activities = data?.pages.flatMap(page => page.activities) ?? [];
  const cardItems: MyExperienceCardProps[] = activities.map(activity => ({
    id: activity.id,
    title: activity.title,
    rating: activity.rating,
    reviewCount: activity.reviewCount,
    price: activity.price,
    bannerImageUrl: activity.bannerImageUrl,
    priceUnit: '/인',
    currencySymbol: '₩',
    editButton: <MyExperiencesButton variant="edit">수정하기</MyExperiencesButton>,
    deleteButton: <MyExperiencesButton variant="delete">삭제하기</MyExperiencesButton>,
  }));

  return (
    <div className={styles.myExperiences}>
      <div className={styles.sideNavigation}>
        {userData ? (
          <SideNavigation defaultImage={userData.profileImageUrl as string} />
        ) : (
          <LoadingSideNavigation />
        )}
      </div>
      <div>
        <MyExperiencesHeader
          title="내 체험 관리"
          subTitle="체험을 등록하거나 수정 및 삭제가 가능합니다."
          className="columnRowContents"
        >
          <Link to={'/add-experiences'}>
            <button className={styles.button}>체험 등록하기</button>
          </Link>
        </MyExperiencesHeader>
        <MyExperiencesCardList
          userActivities={{ activities: cardItems }}
          onLoadMore={fetchNextPage}
          hasMore={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onDeleteClick={handleOpen}
        />
      </div>
      {isModalOpen && activityId !== null && (
        <Modal
          onConfirm={handleConfirmDelete}
          onClose={() => setIsModalOpen(false)}
          text="등록한 체험을 삭제하시겠어요?"
          cancelText="아니오"
          confirmText="삭제하기"
        />
      )}
    </div>
  );
};

export default MyExperiences;
