import { Link } from 'react-router-dom';

import MyExperiencesHeader from '@/components/my-experiences-header/MyExperiencesHeader';

import styles from './LoadingUI.module.css';

const LoadingUI = () => {
  return (
    <div>
      <div className={styles.loading}>
        <LoadingSideNavigation />
        <div className={styles.mockHeaderContents}>
          <MyExperiencesHeader
            title="내 체험 관리"
            subTitle="체험을 등록하거나 수정 및 삭제가 가능합니다."
            className="columnRowContents"
          >
            <Link to={'/add-experiences'}>
              <button className={styles.button}>체험 등록하기</button>
            </Link>
          </MyExperiencesHeader>
          <div className={styles.mockContentsWrapper}>
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className={styles.mockContents}>
                <div>
                  <div className={styles.mockTitle}></div>
                  <div className={styles.mockRating}></div>
                  <div className={styles.mockPay}></div>
                  <div className={styles.mockButton}></div>
                </div>
                <div className={styles.mockImage}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const LoadingSideNavigation = () => {
  return (
    <div className={styles.mockSideNavigationWrapper}>
      <div className={styles.mockSideNavigation}>
        <div className={styles.mockSideNavigationImage} />
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className={styles.mockSideNavigationContents} />
        ))}
      </div>
    </div>
  );
};

export default LoadingUI;
