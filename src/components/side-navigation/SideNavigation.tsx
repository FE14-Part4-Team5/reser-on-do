import { useMyProfileQuery } from '@/hooks/useMyProfile';
import ProfileImageUploader from './parts/ProfileImageUploader';
import SideNavItem from './parts/SideNavItem';

import styles from './SideNavigation.module.css';

const SideNavigation = ({ defaultImage, onImageUpload, onNavItemClick }: SideNavigationProps) => {
  const { data: myProfile } = useMyProfileQuery();

  return (
    <aside>
      <div className={styles.navigationCard}>
        <ProfileImageUploader
          defaultImage={myProfile?.profileImageUrl || defaultImage}
          onImageUpload={onImageUpload}
        />
        <SideNavItem onNavItemClick={onNavItemClick} />
      </div>
    </aside>
  );
};

export default SideNavigation;

type SideNavigationProps = {
  defaultImage: string;
  onImageUpload?: (file: File) => void;
  onNavItemClick?: () => void;
};
