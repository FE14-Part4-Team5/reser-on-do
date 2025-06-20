import styles from './MainLoadingUI.module.css';

const MainLoadingUI = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {/* 배너 */}
        <div className={`${styles.banner} ${styles.skeleton}`}></div>

        {/* 검색 영역 */}
        <div className={styles.searchContainer}>
          <div className={styles.searchExplaination}>무엇을 체험하고 싶으신가요?</div>
          <div className={`${styles.search} ${styles.skeleton}`}>
            <div className={styles.searchButton}></div>
          </div>
        </div>

        {/* 인기 체험 */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>🔥 인기 체험</div>
          <PopularCardLoadingUI />
        </div>

        {/* 모든 체험 */}
        <div className={styles.section}>
          <div className={styles.cardsHeader}>
            <div className={styles.cardsHeaderTop}>
              <div className={styles.sectionTitle}>🛼 모든 체험</div>
              <div className={`${styles.dropdown} ${styles.skeleton}`}></div>
            </div>
            <div className={styles.category}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={`${styles.categoryItem} ${styles.skeleton}`}></div>
              ))}
            </div>
          </div>

          {/* 전체 체험 카드 */}
          <MainCardLoadingUI />
          {/* 페이지네이션 */}
          <div className={`${styles.pagination} ${styles.skeleton}`}></div>
        </div>
      </div>
    </div>
  );
};
export const PopularCardLoadingUI = () => {
  return (
    <div className={styles.popularCard}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className={styles.card}>
          <div className={`${styles.image} ${styles.skeleton}`}></div>
          <div className={styles.cardText}>
            <div className={`${styles.title} ${styles.skeleton}`}></div>
            <div className={`${styles.rating} ${styles.skeleton}`}></div>
            <div className={`${styles.price} ${styles.skeleton}`}></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const MainCardLoadingUI = () => {
  return (
    <div className={styles.mainCard}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className={styles.card}>
          <div className={`${styles.image} ${styles.skeleton}`}></div>
          <div className={styles.cardText}>
            <div className={`${styles.title} ${styles.skeleton}`}></div>
            <div className={`${styles.rating} ${styles.skeleton}`}></div>
            <div className={`${styles.price} ${styles.skeleton}`}></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MainLoadingUI;
