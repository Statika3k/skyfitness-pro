'use client';

import classNames from 'classnames';
import Link from 'next/link';
import styles from './signin.module.css';
import Image from 'next/image';
import { ChangeEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { useAppDispatch } from '@/store/store';
import { setToken, setUser, setUserName } from '@/store/features/AuthSlice';
import {
  signIn,
  getUserInfo,
  SignInResponse,
  UserInfo,
} from '@/services/auth/authApi';

export default function Signin() {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setErrorMessage('');
  };

  const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setErrorMessage('');
  };

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password.trim()) {
      return setErrorMessage('Заполните все поля');
    }

    setIsLoading(true);

    signIn({ email, password })
      .then((res: SignInResponse) => {
        dispatch(setToken(res.token));

        return getUserInfo(res.token);
      })
      .then((userInfo: UserInfo) => {
        dispatch(setUser(userInfo));
        localStorage.setItem('user', JSON.stringify(userInfo));

        const userName = userInfo?.email
          ? userInfo.email.split('@')[0]
          : 'User';
        dispatch(setUserName(userName));

        return router.push('/courses/main');
      })
      .catch((error: unknown) => {
        console.error('Auth error:', error);

        if (error instanceof AxiosError) {
          if (error.response) {
            console.log('Error response:', error.response.data);
            setErrorMessage(error.response.data.message || 'Ошибка входа');
          } else if (error.request) {
            setErrorMessage('Нет ответа от сервера. Проверьте интернет.');
          } else {
            setErrorMessage('Неизвестная ошибка. Попробуйте позже.');
          }
        } else {
          setErrorMessage('Произошла ошибка. Попробуйте позже.');
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <Link href="/courses/main" className={styles.modal__logo}>
        <Image
          src="/images/logo.png"
          alt="SkyFitnessPro"
          width={220}
          height={35}
          priority
        />
      </Link>

      <input
        className={classNames(styles.modal__input, styles.login)}
        type="email"
        name="email"
        placeholder="Эл. почта"
        value={email}
        onChange={onChangeEmail}
        disabled={isLoading}
        autoComplete="email"
      />

      <input
        className={classNames(styles.modal__input, styles.password)}
        type="password"
        name="password"
        placeholder="Пароль"
        value={password}
        onChange={onChangePassword}
        disabled={isLoading}
        autoComplete="current-password"
      />

      {errorMessage && (
        <div className={styles.errorContainer}>{errorMessage}</div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        onClick={onSubmit}
        className={classNames(styles.modal__btnEnter, {
          [styles.buttonDisabled]: isLoading,
        })}
      >
        {isLoading ? 'Вход...' : 'Войти'}
      </button>

      <Link
        href="/auth/signup"
        className={styles.modal__btnSignup}
        tabIndex={isLoading ? -1 : undefined}
      >
        Зарегистрироваться
      </Link>
    </>
  );
}
