import styles from './Banner.module.css';

interface BannerProps {
  bannerImg: string;
  bannerTitle: string;
  bannerDescription: string;
}
const Banner = ({ bannerImg, bannerTitle, bannerDescription }: BannerProps) => {
  return (
    <>
      <img src={bannerImg} alt="배너 이미지" className={styles.bannerImg} />
      <div className={styles.overlay}></div>
      <div className={styles.bannerTextWrapper}>
        <p className={styles.bannerTitle}>{bannerTitle}</p>
        <p className={styles.bannerDescription}>{bannerDescription}</p>
      </div>
    </>
  );
};

export default Banner;
