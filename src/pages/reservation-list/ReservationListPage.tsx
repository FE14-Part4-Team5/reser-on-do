import { useMyProfileQuery } from '@/hooks/useMyProfile';
import SideNavigation from '@/components/side-navigation/SideNavigation';
import { LoadingSideNavigation } from '../my-experiences/components/loading/Loading';
import styles from './ReservationListPage.module.css';
import profileImg from '@/assets/icons/profile_size=lg.svg';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReservationCard from '../../components/reservation-card/ReservationCard';
import Modal from '../../components/modal/modal';
import WarningIcon from '../../assets/icons/modalwarning.svg';
import Button from '../../components/Button/Button';
import emptyImg from '@/assets/images/img_empty.png';
import { getReservations, cancelReservation } from './components/loading/reservationlist';
import type { MyReservation } from '@/types/api/myReservationsType';

const handleProfileImageUpload = (file: File) => {
  console.log('이미지 업로드:', file);
};

const ReservationList: React.FC = () => {
  const [activeState, setActiveState] = useState<string | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<MyReservation | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  // const [isLoading, setIsLoading] = useState(true);
  const [reservations, setReservations] = useState<MyReservation[]>([]);
  const navigate = useNavigate();
  const { data: userData } = useMyProfileQuery();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        // setIsLoading(true);
        const response = await getReservations('14-5');
        setReservations(response.reservations);
      } catch (error) {
        console.error('예약 목록 조회 실패:', error);
      } finally {
        // setIsLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const handleCancelReservation = async (reservationId: number) => {
    try {
      await cancelReservation('14-5', reservationId);
      // 예약 목록 다시 불러오기
      const response = await getReservations('14-5');
      setReservations(response.reservations);
      setIsCancelModalOpen(false);
    } catch (error) {
      console.error('예약 취소 실패:', error);
    }
  };

  const handleExploreClick = () => {
    navigate('/');
  };

  const handleBadgeClick = (state: string) => {
    // 현재 선택된 상태와 동일한 배지를 클릭하면 선택 해제
    if (activeState === state) {
      setActiveState(null);
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
                  .filter(reservation => activeState === null || reservation.status === activeState)
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
                      editReservationButton={
                        <Button
                          variant="secondary"
                          isActive={true}
                          className={styles.editButton}
                          style={{ color: 'var(--gray-600)' }}
                        >
                          예약 변경
                        </Button>
                      }
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
