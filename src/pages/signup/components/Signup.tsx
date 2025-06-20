import styles from './Signup.module.css';
import Input from '../../../components/input/Input';
import Button from '@/components/button/Button';
import { Link } from 'react-router-dom';
import Logo_horizontal from '@/assets/icons/logo_horizontal.svg';
import KakaoIcon from '@/assets/icons/icon_kakao.svg';
import Logo_mobile from '@/assets/icons/logo_earth.svg';

interface SignupProps {
  email: string;
  nickname: string;
  password: string;
  confirmPassword: string;
  onEmailChange: (value: string) => void;
  onNicknameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onSubmit: () => void;
  onOauthSignup?: () => void;
  emailError?: string;
  nicknameError?: string;
  passwordError?: string;
  confirmPasswordError?: string;
  onEmailBlur?: () => void;
  onNicknameBlur?: () => void;
  onPasswordBlur?: () => void;
  onConfirmPasswordBlur?: () => void;
  isFormValid?: boolean;
}

const Signup = ({
  email,
  nickname,
  password,
  confirmPassword,
  onEmailChange,
  onNicknameChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
  onOauthSignup,
  emailError = '',
  nicknameError = '',
  passwordError = '',
  confirmPasswordError = '',
  onEmailBlur,
  onNicknameBlur,
  onPasswordBlur,
  onConfirmPasswordBlur,
  isFormValid = true,
}: SignupProps) => {
  return (
    <div className={styles.signupContainer}>
      <Link to="/">
        <img src={Logo_horizontal} alt="로고" className={styles.logoDesktop} />
        <img src={Logo_mobile} alt="로고" className={styles.logoMobile} />
      </Link>
      <div className={styles.inputWrapper}>
        <Input
          title="이메일"
          type="email"
          isError={!!emailError}
          errorMessage={emailError}
          placeholder="이메일을 입력해 주세요"
          value={email}
          onChange={e => onEmailChange(e.target.value)}
          onBlur={onEmailBlur}
        />
      </div>
      <div className={styles.inputWrapper}>
        <Input
          title="닉네임"
          type="text"
          isError={!!nicknameError}
          errorMessage={nicknameError}
          placeholder="닉네임을 입력해 주세요"
          value={nickname}
          onChange={e => onNicknameChange(e.target.value)}
          onBlur={onNicknameBlur}
        />
      </div>
      <div className={styles.inputWrapper}>
        <Input
          title="비밀번호"
          type="password"
          isError={!!passwordError}
          errorMessage={passwordError}
          placeholder="비밀번호를 입력해 주세요"
          value={password}
          onChange={e => onPasswordChange(e.target.value)}
          onBlur={onPasswordBlur}
          showEyeIcon={true}
        />
      </div>
      <div className={styles.inputWrapper}>
        <Input
          title="비밀번호 확인"
          type="password"
          isError={!!confirmPasswordError}
          errorMessage={confirmPasswordError}
          placeholder="비밀번호를 다시 입력해 주세요"
          value={confirmPassword}
          onChange={e => onConfirmPasswordChange(e.target.value)}
          onBlur={onConfirmPasswordBlur}
          showEyeIcon={true}
        />
      </div>
      <Button
        className={styles.signupButton}
        isActive={isFormValid}
        type="submit"
        onClick={onSubmit}
      >
        회원가입하기
      </Button>
      <div className={styles.signupDivider}>
        <span className={styles.dividerText}>SNS 계정으로 회원가입하기</span>
      </div>
      <Button
        variant="secondary"
        icon={<img src={KakaoIcon} alt="카카오 아이콘" width={24} height={24} />}
        onClick={onOauthSignup}
        isActive={true}
        className={styles.kakaoButton}
      >
        카카오 회원가입
      </Button>
      <div className={styles.loginContainer}>
        회원이신가요?
        <Link to="/login" className={styles.loginLink}>
          로그인하기
        </Link>
      </div>
    </div>
  );
};

export default Signup;
