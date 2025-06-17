import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';

import styles from './DetailPage.module.css';

import IconStar from '@/assets/icons/icon_star.svg?react';
import IconMap from '@/assets/icons/icon_map.svg?react';
import IconMore from '@/assets/icons/icon_more.svg?react';

import Reservation from '@/components/reservation/Reservation';
import ReviewCard from '@/pages/detail/components/ReviewCard';
import Pagination from '@/components/Pagination/Pagination';
import Modal from '@/components/modal/modal';
import DetailSkeleton from './components/loading/DetailSkeleton';

import { useAuthStore } from '@/stores/useAuthStore';

import {
  useExperienceDetail,
  useReserveExperience,
  useDeleteExperience,
  useExperienceReviews,
} from '@/hooks/useExperience';

declare global {
  interface Window {
    kakao: any;
  }
}

const DetailPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const userId = useAuthStore(state => state.userId);

  const KAKAO_MAP_KEY = import.meta.env.VITE_KAKAO_MAP_KEY;

  const {
    data: experience,
    isLoading: isDetailLoading,
    isError: isDetailError,
  } = useExperienceDetail(Number(id));
  const {
    data: reviews,
    isLoading: isReviewLoading,
    isError: isReviewError,
  } = useExperienceReviews(Number(id), currentPage, 3);

  const { mutate: reserveExperience } = useReserveExperience(Number(id));
  const { mutate: deleteExperience } = useDeleteExperience(Number(id));

  const handleReserve = ({ scheduleId, headCount }: { scheduleId: number; headCount: number }) => {
    reserveExperience(
      { scheduleId, headCount },
      {
        onSuccess: response => {
          console.log('예약 성공:', response);
          setIsModalOpen(true);
        },
      }
    );
  };

  const handleDelete = () => {
    deleteExperience(undefined, {
      onSuccess: response => {
        console.log('삭제 성공:', response);
        navigate('/');
      },
    });
  };

  const onLoadKakaoMap = (address: string) => {
    const container = document.getElementById('map') as HTMLElement;
    const geocoder = new window.kakao.maps.services.Geocoder();

    geocoder.addressSearch(address, function (result: any, status: any) {
      if (status === window.kakao.maps.services.Status.OK) {
        const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
        const map = new window.kakao.maps.Map(container, {
          center: coords,
          level: 2,
        });

        new window.kakao.maps.Marker({
          map,
          position: coords,
        });
      } else {
        console.error('주소를 좌표로 변환할 수 없습니다.');
      }
    });
  };

  useEffect(() => {
    if (!experience?.address) return;

    const loadMap = () => onLoadKakaoMap(experience.address);

    if (window.kakao && window.kakao.maps) {
      loadMap();
    } else {
      if (!document.querySelector(`script[src*="dapi.kakao.com"]`)) {
        const script = document.createElement('script');
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_KEY}&libraries=services&autoload=false`;
        script.onload = () => {
          if (window.kakao?.maps?.load) {
            window.kakao.maps.load(loadMap);
          } else {
            console.error('카카오 맵 로더를 찾을 수 없습니다.');
          }
        };
        document.head.appendChild(script);
      } else {
        const checkKakaoLoaded = setInterval(() => {
          if (window.kakao && window.kakao.maps) {
            clearInterval(checkKakaoLoaded);
            loadMap();
          }
        }, 100);
      }
    }
  }, [experience]);

  if (isDetailLoading || isReviewLoading || !experience || !reviews) {
    return <DetailSkeleton />;
  }
  if (isDetailError) throw new Error('체험 상세 정보를 불러오는 중 에러 발생');
  if (isReviewError) throw new Error('리뷰를 불러오는 중 에러 발생');

  return (
    <div className={styles.experienceDetail}>
      <div className={styles.wrapper}>
        <div className={styles.images}>
          <img src={experience.bannerImageUrl} className={styles.mainImage} />
          {experience.subImages?.length > 0 && (
            <div className={styles.subImages}>
              {experience.subImages.map(img => (
                <div key={img.id} className={styles.subImageWrapper}>
                  <img src={img.imageUrl} alt="서브 이미지" className={styles.subImage} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.card}>
          <div className={styles.category}>{experience.category}</div>
          <div className={styles.titleRow}>
            <h3 className={styles.title}>{experience.title}</h3>
            {userId === experience.userId && (
              <div className={styles.menu}>
                <IconMore
                  width={28}
                  height={28}
                  className={styles.iconMore}
                  onClick={() => setMenuOpen(!menuOpen)}
                />
                {menuOpen && (
                  <ul className={styles.menuList}>
                    <li onClick={() => navigate(`/edit-experiences/${id}`)}>수정하기</li>
                    <li onClick={handleDelete}>삭제하기</li>
                  </ul>
                )}
              </div>
            )}
          </div>

          <div className={styles.meta}>
            <div className={styles.rating}>
              <IconStar className={styles.starIcon} />
              <span>
                {experience.rating.toFixed(1)} ({experience.reviewCount})
              </span>
            </div>
            <div className={styles.address}>
              <IconMap width={16} height={16} />
              {experience.address}
            </div>
          </div>
        </div>

        <div className={styles.descriptionBox}>
          <h3 className={styles.title}>체험 설명</h3>
          <p className={styles.text}>{experience.description}</p>
        </div>

        <section className={styles.locationBox}>
          <h3 className={styles.title}>오시는 길</h3>
          <p className={styles.text}>{experience.address}</p>
          <div className={styles.mapWrapper}>
            <div id="map" style={{ width: '100%', height: '100%' }}></div>
          </div>
        </section>

        <section className={styles.reviewBox}>
          <h3 className={styles.title}>
            체험 후기<span className={styles.reviewCount}>{experience.reviewCount}개</span>
          </h3>
          <div className={styles.reviewSummary}>
            <div className={styles.reviewScore}>{experience.rating}</div>
            <div className={styles.reviewSatisfaction}>만족도</div>
            <div className={styles.reviewStars}>
              <IconStar className={styles.starIcon} />
              <span>{experience.reviewCount} 후기</span>
            </div>
          </div>
          <div className={styles.reviewList}>
            {reviews.reviews.map(review => (
              <ReviewCard
                key={review.id}
                name={review.user.nickname}
                date={new Date(review.createdAt).toLocaleDateString('ko-KR')}
                rating={review.rating}
                content={review.content}
              />
            ))}
          </div>
          <div className={styles.paginationWrapper}>
            <Pagination totalItems={experience.reviewCount} itemsPerPage={3} />
          </div>
        </section>
        <section className={styles.calendarWrapper}>
          <div className={userId === experience.userId ? styles.invisibleBox : ''}>
            <Reservation
              price={experience.price}
              schedules={experience.schedules}
              onReserve={handleReserve}
            />
          </div>
        </section>
      </div>
      {isModalOpen && (
        <Modal isOpen onClose={() => setIsModalOpen(false)}>
          <p className={styles.modalText}>예약이 완료되었습니다.</p>
        </Modal>
      )}
    </div>
  );
};

export default DetailPage;
