'use client';

import { useRouter } from 'next/navigation';

import { useAppDispatch } from '@/store/store';
import { clearAuth } from '@/store/features/AuthSlice';
import styles from './UserMenu.module.css';

type UserMenuProps = {
  userName: string;
  userEmail: string;
  onClose: () => void;
};

export default function UserMenu({
  userName,
  userEmail,
  onClose,
}: UserMenuProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleProfileClick = () => {
    router.push('/courses/profile');
    onClose();
  };

  const handleLogout = () => {
    dispatch(clearAuth());
    onClose();
    router.push('/courses/main');
  };

  return (
    <div className={styles.dropdownMenu}>
      <div className={styles.dropdownHeader}>
        <p className={styles.dropdownUserName}>{userName || 'Пользователь'}</p>
        <p className={styles.dropdownUserEmail}>{userEmail}</p>
      </div>

      <button
        className={styles.dropdownProfileButton}
        onClick={handleProfileClick}
      >
        Мой профиль
      </button>
      <button className={styles.dropdownLogoutButton} onClick={handleLogout}>
        Выйти
      </button>
    </div>
  );
}
