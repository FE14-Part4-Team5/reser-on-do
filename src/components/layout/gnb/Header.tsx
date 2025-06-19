import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import styles from './Header.module.css';
import smallLogo from '@/assets/icons/logo_earth.svg';
import gnbLogo from '@/assets/icons/logo_vertical.svg';
import NotiIcon from '@/assets/icons/icon_bell.svg?react';
import profileImg from '@/assets/icons/profile_size=lg.svg';
import { useAuthStore } from '@/stores/useAuthStore';
import { useInfiniteNotification } from '@/hooks/useNotification';
import NotificationModal from '@/components/modal/NotificationModal';
import { useQueryClient } from '@tanstack/react-query';

const Header = () => {
  const queryClient = useQueryClient();
  const {
    userId,
    userNickname,
    userProfileImage,
    clearTokens,
    clearUserId,
    clearNickname,
    clearProfileImageUrl,
  } = useAuthStore();
  const isLoggedIn = !!userId;
  const [isNoticeClick, setIsNoticeClick] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hasNewNoti, setHasNewNoti] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { data } = useInfiniteNotification();

  useEffect(() => {
    const totalCount = data?.pages?.[0]?.totalCount ?? 0;
    setHasNewNoti(totalCount > 0);
  }, [data]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isDropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleNoticeClick = () => {
    const totalCount = data?.pages?.[0]?.totalCount ?? 0;
    setIsNoticeClick(prev => !prev);
    if (!isNoticeClick && totalCount === 0) {
      setHasNewNoti(false);
    }
  };

  const handleDropdownToggle = () => {
    console.log(userId, userNickname, userProfileImage);
    setIsDropdownOpen(prev => !prev);
  };

  const handleLogout = () => {
    clearTokens();
    clearUserId();
    clearNickname();
    clearProfileImageUrl();
    queryClient.removeQueries({ queryKey: ['myProfile'] });
    navigate('/login');
  };

  return (
    <div className={styles.container}>
      <div className={styles.gnbLogo}>
        <Link to="/" type="button" onClick={handleLogoClick}>
          <picture>
            <source srcSet={gnbLogo} media="(min-width:768px)" />
            <img src={smallLogo} alt="logo" className={styles.gnbLogoIcon} />
          </picture>
        </Link>
      </div>

      {!isLoggedIn ? (
        <div className={styles.authWrapper}>
          <Link to="/login" className={styles.authButton}>
            로그인
          </Link>
          <Link to="/signup" className={styles.authButton}>
            회원가입
          </Link>
        </div>
      ) : (
        <div className={styles.userContainer}>
          <div className={styles.noticeWrapper}>
            <NotiIcon
              className={clsx(styles.notice, {
                [styles.newNoti]: hasNewNoti,
                [styles.active]: isNoticeClick,
              })}
              type="button"
              onClick={handleNoticeClick}
            />
            {isNoticeClick && <NotificationModal onClose={() => setIsNoticeClick(false)} />}
          </div>
          <div className={styles.divider}></div>
          <div className={styles.userWrapper} ref={dropdownRef}>
            <button className={styles.user} type="button" onClick={handleDropdownToggle}>
              <div className={styles.userProfile}>
                <img
                  src={userProfileImage || profileImg}
                  alt="프로필"
                  className={styles.userProfileIcon}
                />
              </div>

              {userNickname}
            </button>
            <div className={clsx(styles.dropdownMenu, isDropdownOpen && styles.open)}>
              <button
                onClick={() => {
                  navigate('/my-profile');
                  setIsDropdownOpen(false);
                }}
                className={styles.dropdownItem}
              >
                마이페이지
              </button>
              <button type="button" className={styles.dropdownItem} onClick={handleLogout}>
                로그아웃
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
