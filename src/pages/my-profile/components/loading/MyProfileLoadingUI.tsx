import styles from './MyProfileLoadingUI.module.css';
import MyExperiencesHeader from '@/components/my-experiences-header/MyExperiencesHeader';
import { LoadingSideNavigation } from '@/pages/my-experiences/components/loading/Loading';

const MyProfileLoadingUI = () => {
  return (
    <div className={styles.container}>
      <LoadingSideNavigation />

      <div className={styles.formContainer}>
        <MyExperiencesHeader title="내 정보" subTitle="닉네임과 비밀번호를 수정하실 수있습니다." />
        <div className={styles.form}>
          <div className={styles.inputform}>
            <div className={styles.inputWrapper}>
              <label className={styles.label}>닉네임</label>
              <div className={`${styles.input} ${styles.skeleton}`}></div>
            </div>
            <div className={styles.inputWrapper}>
              <label className={styles.label}>이메일</label>
              <div className={`${styles.input} ${styles.skeleton}`}></div>
            </div>
            <div className={styles.inputWrapper}>
              <label className={styles.label}>비밀번호</label>
              <div className={`${styles.input} ${styles.skeleton}`}></div>
            </div>
            <div className={styles.inputWrapper}>
              <label className={styles.label}>비밀번호 확인</label>
              <div className={`${styles.input} ${styles.skeleton}`}></div>
            </div>
          </div>
          <button className={`${styles.button} ${styles.skeleton}`} disabled></button>
        </div>
      </div>
    </div>
  );
};

export default MyProfileLoadingUI;
