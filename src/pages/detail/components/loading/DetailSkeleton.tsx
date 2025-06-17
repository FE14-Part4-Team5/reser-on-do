import styles from './DetailSkeleton.module.css';

const DetailSkeleton = () => {
  return (
    <div className={styles.wrapper}>
      <div className={`${styles.imageBlock}`}>
        <div className={`${styles.mainImage} ${styles.skeleton}`} />
        <div className={styles.subImages}>
          <div className={`${styles.subImage} ${styles.skeleton}`} />
          <div className={`${styles.subImage} ${styles.skeleton}`} />
        </div>
      </div>

      <div className={styles.card}>
        <div className={`${styles.cardLine} ${styles.skeleton}`} />
        <div className={`${styles.cardTitle} ${styles.skeleton}`} />
        <div className={`${styles.cardMeta} ${styles.skeleton}`} />
      </div>

      <div className={styles.description}>
        <div className={`${styles.textLine} ${styles.skeleton}`} />
        <div className={`${styles.textLine} ${styles.skeleton}`} />
        <div className={`${styles.textLine} ${styles.skeleton}`} />
      </div>

      <div className={`${styles.map} ${styles.skeleton}`} />
      <div className={`${styles.calendar} ${styles.skeleton}`} />
    </div>
  );
};

export default DetailSkeleton;
