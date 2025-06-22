import styles from './Login.module.css';
import Input from '@/components/Input/Input';
import Button from '@/components/Button/Button';
import { Link } from 'react-router-dom';
import ReserOnDoLogomb from '@/assets/icons/ReserOnDoLogomb.svg';
import ReserOnDoLogo from '@/assets/icons/ReserOnDoLogo.svg';
import KakaoIcon from '@/assets/icons/icon_kakao.svg';

interface LoginProps {
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
  onOauthLogin?: () => void;
  emailError?: string;
  passwordError?: string;
  onEmailBlur?: () => void;
  onPasswordBlur?: () => void;
  isFormValid?: boolean;
}

const Login = ({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onOauthLogin,
  emailError = '',
  passwordError = '',
  onEmailBlur,
  onPasswordBlur,
  isFormValid = true,
}: LoginProps) => {
  return (
    <form
      className={styles.loginContainer}
      onSubmit={e => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <Link to="/">
        <img src={ReserOnDoLogo} alt="로고" className={styles.logoDesktop} />
        <img src={ReserOnDoLogomb} alt="로고" className={styles.logoMobile} />
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
          title="비밀번호"
          type="password"
          isError={!!passwordError}
          errorMessage={passwordError}
          placeholder="비밀번호를 입력해 주세요"
          value={password}
          onChange={e => onPasswordChange(e.target.value)}
          showEyeIcon={true}
          onBlur={onPasswordBlur}
        />
      </div>
      <Button type="submit" className={styles.loginButton} isActive={isFormValid}>
        로그인하기
      </Button>
      <div className={styles.loginDivider}>
        <span className={styles.dividerText}>or</span>
      </div>
      <Button
        variant="secondary"
        icon={<img src={KakaoIcon} alt="카카오 아이콘" width={24} height={24} />}
        onClick={onOauthLogin}
        isActive={true}
        className={styles.kakaoButton}
      >
        카카오 로그인
      </Button>
      <div className={styles.signupContainer}>
        회원이 아니신가요?
        <Link to="/signup" className={styles.signupLink}>
          회원가입하기
        </Link>
      </div>
    </form>
  );
};

export default Login;
