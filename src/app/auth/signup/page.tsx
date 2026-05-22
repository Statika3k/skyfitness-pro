'use client';

import classNames from 'classnames';
import Link from 'next/link';
import styles from './signup.module.css';
import Image from 'next/image';
import { ChangeEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import { signUp } from '@/services/auth/authApi';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
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

  const onChangeRepeatPassword = (e: ChangeEvent<HTMLInputElement>) => {
    setRepeatPassword(e.target.value);
    setErrorMessage('');
  };
  
  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 6) {
      return 'Пароль должен содержать не менее 6 символов';
    }
    const specialChars = (pwd.match(/[^a-zA-Z0-9]/g) || []).length;
    if (specialChars < 2) {
      return 'Пароль должен содержать не менее 2 спецсимволов';
    }
    if (!/[A-Z]/.test(pwd)) {
      return 'Пароль должен содержать как минимум одну заглавную букву';
    }
    return null;
  };

  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password.trim() || !repeatPassword.trim()) {
      return setErrorMessage('Необходимо заполнить все поля');
    }

    if (password.trim() !== repeatPassword.trim()) {
      return setErrorMessage('Пароли не совпадают');
    }

    // Валидация пароля на клиенте
    const passwordError = validatePassword(password);
    if (passwordError) {
      return setErrorMessage(passwordError);
    }

    setIsLoading(true);

    try {
      await signUp({ email, password });      
      router.push('/auth/signin');
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {          
          setErrorMessage(error.response.data.message || 'Ошибка регистрации');
        } else if (error.request) {
          setErrorMessage('Отсутствует интернет. Попробуйте позже');
        }
      } else {
        setErrorMessage('Неизвестная ошибка. Попробуйте позже');
      }
    } finally {
      setIsLoading(false);
    }
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
        className={styles.modal__input}
        type="password"
        name="password"
        placeholder="Пароль"
        value={password}
        onChange={onChangePassword}
        disabled={isLoading}
        autoComplete="new-password"
      />

      <input
        className={styles.modal__input}
        type="password"
        name="repeatPassword"
        placeholder="Повторите пароль"
        value={repeatPassword}
        onChange={onChangeRepeatPassword}
        disabled={isLoading}
        autoComplete="new-password"
      />

      {errorMessage && (
        <div className={styles.errorContainer}>{errorMessage}</div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        onClick={onSubmit}
        className={classNames(styles.modal__btnSignupEnt, {
          [styles.buttonDisabled]: isLoading,
        })}
      >
        {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
      </button>

      <Link
        href="/auth/signin"
        className={styles.modal__btnSignin}
        tabIndex={isLoading ? -1 : undefined}
      >
        Войти
      </Link>
    </>
  );
}