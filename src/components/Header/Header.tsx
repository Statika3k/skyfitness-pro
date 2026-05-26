'use client';

import Link from 'next/link';
import styles from './header.module.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/store';
import { setToken, setUser, setUserName } from '@/store/features/AuthSlice';
import UserMenu from '../UserMenu/UserMenu';

export default function Header() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { token, userName, user } = useAppSelector((state) => state.auth);
  const [showDropdown, setShowDropdown] = useState(false);  

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUserName = localStorage.getItem('userName');
    const storedUserStr = localStorage.getItem('user');

    if (storedToken && !token) {
      dispatch(setToken(storedToken));
    }

    if (storedUserName && !userName) {
      dispatch(setUserName(storedUserName));
    }

    if (storedUserStr && !user) {
      try {
        const parsedUser = JSON.parse(storedUserStr);
        dispatch(setUser(parsedUser));
      } catch (e) {
        console.error('Ошибка парсинга данных пользователя', e);
      }
    }
  }, [dispatch, token, userName, user]);

  const userEmail = user?.email || '';

  const handleLoginClick = () => {
    router.push('/auth/signin');
  };

  const handleToggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleCloseDropdown = () => {
    setShowDropdown(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerGroup}>
        <Link className={styles.logoLink} href="/courses/main">
          <Image
            width={220}
            height={35}
            src="/images/logo.png"
            alt="Логотип SkyFitnessPro"
            className={styles.logoImage}
            priority
          />
        </Link>
        <p className={styles.logoText}>Онлайн-тренировки для занятий дома</p>
      </div>

      {token ? (
        <div className={styles.userMenu}>
          <div className={styles.userButton} onClick={handleToggleDropdown}>
            <div className={styles.userAvatar}>
              <Image
                src="/images/UserIcon.svg"
                alt="Аватар"
                width={42}
                height={42}
              />
            </div>
            <span className={styles.userName}>
              {userName || 'Пользователь'}
            </span>
            <span className={styles.dropdownArrow}>
              {showDropdown ? '▲' : '▼'}
            </span>
          </div>

          {showDropdown && (
            <UserMenu
              userName={userName || ''}
              userEmail={userEmail}
              onClose={handleCloseDropdown}
            />
          )}
        </div>
      ) : (
        <button
          className={styles.loginButton}
          onClick={handleLoginClick}
          type="button"
        >
          <span className={styles.buttonText}>Войти</span>
        </button>
      )}
    </header>
  );
}
