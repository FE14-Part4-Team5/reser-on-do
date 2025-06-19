import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMyProfileQuery } from '@/hooks/useMyProfile';
import { myReservationsService } from '@/apis/myReservations';
import SideNavigation from '@/components/side-navigation/SideNavigation';
import { LoadingSideNavigation } from '../my-experiences/components/loading/Loading';
import styles from './ReservationListPage.module.css';
import ReservationCard from '../../components/reservation-card/ReservationCard';
import Modal from '../../components/modal/modal';
import WarningIcon from '../../assets/icons/modalwarning.svg';
import Button from '../../components/Button/Button';
import emptyImg from '@/assets/images/img_empty.png';
import type { MyReservation } from '@/types/api/myReservationsType';
import { useQuery, useMutation } from '@tanstack/react-query';

// // const handleProfileImageUpload = (file: File) => {
// //   console.log('이미지 업로드:', file);
// // };

// const ReservationList: React.FC = () => {
//   const [activeState, setActiveState] = useState<string | null>(null);
//   const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
//   const [selectedReservation, setSelectedReservation] = useState<MyReservation | null>(null);
//   const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

//   const navigate = useNavigate();
//   const { data: userData } = useMyProfileQuery();

//   // 예약 목록 조회 API 호출
//   const {
//     data: reservationsData,
//     // isLoading,
//     refetch,
//   } = useQuery({
//     queryKey: ['myReservations'],
//     queryFn: () => myReservationsService.getMyReservations({}),
//   });

//   // 예약 취소 API 호출
//   const cancelReservationMutation = useMutation({
//     mutationFn: (reservationId: number) =>
//       myReservationsService.updateMyReservation({ reservationId }),
//     onSuccess: () => {
//       refetch(); // 예약 목록 갱신
//       setIsCancelModalOpen(false);
//     },
//     onError: error => {
//       console.error('예약 취소 실패:', error);
//     },
//   });

//   // 예약 취소 핸들러
//   const handleCancelReservation = (reservationId: number) => {
//     cancelReservationMutation.mutate(reservationId);
//   };

    const { rating, content } = payload;

    createReviewMutation.mutate({
      reservationId: selectedReservation.id,
      teamId: selectedReservation.teamId,
      rating,
      content,
    });
  };

  const reservations = reservationsData?.reservations || [];

  // 메인페이지 이동
  const handleExploreClick = () => {
    navigate('/');
  };

  const handleBadgeClick = (state: ReservationStatus) => {
    // 현재 선택된 상태와 동일한 배지를 클릭하면 선택 해제
    if (activeState === state) {
      setActiveState(undefined);
    } else {
      setActiveState(state);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.navigationWrapper}>
        {userData ? (
          <SideNavigation defaultImage={userData.profileImageUrl as string} />
        ) : (
          <LoadingSideNavigation />
        )}
      </div>

      <div className={styles.contentWrapper}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>예약 내역</h1>
          <p className={styles.subtitle}>예약내역 변경 및 취소할 수 있습니다.</p>
          {reservations.length > 0 ? (
            <>
              <div className={styles.badgeWrapper}>
                <div
                  className={`${styles.badgeCommon} ${
                    activeState === 'pending' ? styles.active : ''
                  }`}
                  onClick={() => handleBadgeClick('pending')}
                >
                  <span className={styles.labelCommon1}>예약 완료</span>
                </div>
                <div
                  className={`${styles.badgeCommon} ${
                    activeState === 'confirmed' ? styles.active : ''
                  }`}
                  onClick={() => handleBadgeClick('confirmed')}
                >
                  <span className={styles.labelCommon1}>예약 승인</span>
                </div>
                <div
                  className={`${styles.badgeCommon} ${
                    activeState === 'declined' ? styles.active : ''
                  }`}
                  onClick={() => handleBadgeClick('declined')}
                >
                  <span className={styles.labelCommon1}>예약 거절</span>
                </div>
                <div
                  className={`${styles.badgeCommon} ${
                    activeState === 'canceled' ? styles.active : ''
                  }`}
                  onClick={() => handleBadgeClick('canceled')}
                >
                  <span className={styles.labelCommon1}>예약 취소</span>
                </div>
                <div
                  className={`${styles.badgeCommon} ${
                    activeState === 'completed' ? styles.active : ''
                  }`}
                  onClick={() => handleBadgeClick('completed')}
                >
                  <span className={styles.labelCommon1}>체험 완료</span>
                </div>
              </div>
              <div className={styles.cardContainer}>
                {reservations
                  .filter(reservation => !activeState || reservation.status === activeState)
                  .map((reservation, index) => (
                    <ReservationCard
                      key={index}
                      activity={reservation.activity}
                      status={reservation.status}
                      date={reservation.date}
                      dateDot="•"
                      startTime={reservation.startTime}
                      timedash="-"
                      endTime={reservation.endTime}
                      currencySymbol="₩"
                      totalPrice={reservation.totalPrice}
                      headCount={reservation.headCount}
                      headCountUnit="명"
                      reviewSubmitted={reservation.reviewSubmitted}
                      cancelReservationButton={
                        <Button
                          variant="ghost"
                          isActive={true}
                          onClick={() => {
                            setSelectedReservation(reservation);
                            setIsCancelModalOpen(true);
                          }}
                          className={styles.cancelButton}
                          style={{ color: 'var(--gray-800)' }}
                        >
                          예약 취소
                        </Button>
                      }
                      editReservationButton={<div></div>}
                      reviewSubmittedButton={
                        <Button
                          variant="primary"
                          isActive={true}
                          className={styles.reviewButton}
                          style={{ color: 'var(--color-white)' }}
                          onClick={() => {
                            setSelectedReservation(reservation);
                            setIsReviewModalOpen(true);
                          }}
                        >
                          후기 작성
                        </Button>
                      }
                    />
                  ))}
              </div>
            </>
          ) : (
            <div className={styles.emptyState}>
              <img src={emptyImg} alt="아직 예약한 체험이 없어요" />
              <p>아직 예약한 체험이 없어요</p>
              <Button
                variant="primary"
                isActive={true}
                className={styles.exploreButton}
                onClick={handleExploreClick}
              >
                둘러보기
              </Button>
            </div>
          )}
        </div>

        {/* 후기 작성 모달 */}
        <Modal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          isThird={true}
          onActionClick={handleReviewSubmit}
        >
          <div className={styles.modalHeader}>
            <h3>{selectedReservation?.activity.title}</h3>
            <p>
              {`${selectedReservation?.date} / ${selectedReservation?.startTime} - ${selectedReservation?.endTime} (${selectedReservation?.headCount}명)`}
            </p>
          </div>
        </Modal>

        {/* 예약 취소 모달 */}
        <Modal
          isOpen={isCancelModalOpen}
          onClose={() => setIsCancelModalOpen(false)}
          isSecondary={true}
          onActionClick={() => handleCancelReservation(selectedReservation?.id as number)}
        >
          <img src={WarningIcon} className={styles.warningIcon} alt="warning" />
          <h2>예약을 취소하시겠습니까? </h2>
        </Modal>
      </div>
    </div>
  );
};

export default ReservationList;
