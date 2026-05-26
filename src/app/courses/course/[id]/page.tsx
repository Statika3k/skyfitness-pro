'use client';

import Image from 'next/image';
import styles from './page.module.css';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/store';
import { addUserCourse } from '@/services/courses/coursesApi';

// Временные данные курса (позже будут приходить из API)
const courseData = {
  id: '1',
  title: 'Йога',
  color: '#ffc700',
  imageUrl: '/images/yoga.jpg',
  fitting: [
    'Давно хотели попробовать йогу, но не решались начать',
    'Хотите укрепить позвоночник, избавиться от болей в спине и суставах',
    'Ищете активность, полезную для тела и души',
  ],
  directions: [
    'Йога для новичков',
    'Классическая йога',
    'Кундалини-йога',
    'Йогатерапия',
    'Хатха-йога',
    'Аштанга-йога',
  ],
};

export default function CoursePage() {
  const router = useRouter();
  const params = useParams();
  const { token } = useAppSelector((state) => state.auth);

  const [isCourseAdded, setIsCourseAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleAddCourse = async () => {
    if (!token) {
      router.push('/auth/signin');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      await addUserCourse(token, params.id as string);
      setIsCourseAdded(true);
    } catch (error) {
      console.error('Error adding course:', error);
      setErrorMessage('Не удалось добавить курс. Попробуйте позже.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginClick = () => {
    router.push('/auth/signin');
  };

  return (
    <div className={styles.coursePage}>
      <header
        className={styles.header}
        style={{ backgroundColor: courseData.color }}
      >
        <h1 className={styles.title}>{courseData.title}</h1>
        <div className={styles.headerImageWrapper}>
          <Image
            src={courseData.imageUrl}
            alt={courseData.title}
            fill
            className={styles.headerImage}
            priority
          />
        </div>
      </header>

      <main className={styles.mainContent}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Подойдет для вас, если:</h2>
          <div className={styles.fittingGrid}>
            {courseData.fitting.map((text, index) => (
              <div key={index} className={styles.fittingCard}>
                <span className={styles.cardNumber}>{index + 1}</span>
                <p className={styles.cardText}>{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Направления</h2>
          <div className={styles.directionsBlock}>
            {courseData.directions.map((dir, index) => (
              <div key={index} className={styles.directionItem}>
                <span className={styles.directionIcon}>
                  <Image
                    src="/images/Star.svg"
                    alt="star"
                    width={24}
                    height={24}
                  />
                </span>
                <span className={styles.directionText}>{dir}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.actionBlock}>
          <div className={styles.actionContent}>
            <h2 className={styles.actionTitle}>
              Начните путь <br /> к новому телу
            </h2>
            <ul className={styles.benefitsList}>
              <li>проработка всех групп мышц</li>
              <li>тренировка суставов</li>
              <li>улучшение циркуляции крови</li>
              <li>упражнения заряжают бодростью</li>
              <li>помогают противостоять стрессам</li>
            </ul>

            {errorMessage && (
              <p className={styles.errorMessage}>{errorMessage}</p>
            )}

            {!!token ? (
              isCourseAdded ? (
                <button
                  className={styles.primaryButton}
                  disabled
                  style={{ background: '#cccccc', cursor: 'not-allowed' }}
                >
                  Курс добавлен ✓
                </button>
              ) : (
                <button
                  className={styles.primaryButton}
                  onClick={handleAddCourse}
                  disabled={isLoading}
                >
                  {isLoading ? 'Добавление...' : 'Добавить курс'}
                </button>
              )
            ) : (
              <button
                className={styles.primaryButton}
                onClick={handleLoginClick}
              >
                Войдите, чтобы добавить курс
              </button>
            )}
          </div>

          <div className={styles.actionVisuals}>
            <Image
              src="/images/Vector.png"
              alt="Декоративная черная линия"
              width={54}
              height={46}
              className={styles.blackVector}
              priority
            />
            <Image
              src="/images/VectorGreen.png"
              alt="Декоративная зеленая линия"
              width={670}
              height={390}
              className={styles.greenVector}
              priority
            />
            <Image
              src="/images/runner.png"
              alt="Бегун"
              width={515}
              height={568}
              className={styles.runnerImage}
              priority
            />
          </div>
        </section>
      </main>
    </div>
  );
}
