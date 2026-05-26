'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './page.module.css';
import { useAppSelector } from '@/store/store';
import { getCourseById, addUserCourse } from '@/services/courses/coursesApi';
import { CourseType } from '@/sharedTypes/sharedTypes';
import { mapApiCourseToUI } from '@/utils/helpers';
import { Course } from '@/types';

export default function CoursePage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAppSelector((state) => state.auth);

  const [course, setCourse] = useState<CourseType | null>(null);
  const [uiCourse, setUiCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCourseAdded, setIsCourseAdded] = useState(false);

  useEffect(() => {
    const courseId = params.id as string;
    if (!courseId) return;

    const fetchCourse = async () => {
      try {
        setIsLoading(true);
        const courseData = await getCourseById(courseId);
        setCourse(courseData);
        setUiCourse(mapApiCourseToUI(courseData));
        setError(null);
      } catch (err) {
        console.error('Error fetching course:', err);
        setError('Не удалось загрузить курс');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [params.id]);

  const handleAddCourse = async () => {
    if (!token || !course) {
      router.push('/auth/signin');
      return;
    }

    try {
      await addUserCourse(token, course._id);
      setIsCourseAdded(true);
      alert('Курс успешно добавлен!');
    } catch (err) {
      console.error('Error adding course:', err);
      alert('Не удалось добавить курс');
    }
  };

  if (isLoading) {
    return <div className={styles.loading}>Загрузка курса...</div>;
  }

  if (error || !course || !uiCourse) {
    return (
      <div className={styles.error}>
        <p>{error || 'Курс не найден'}</p>
        <button onClick={() => router.push('/courses/main')}>
          Вернуться к каталогу
        </button>
      </div>
    );
  }

  return (
    <div className={styles.coursePage}>
      <header
        className={styles.header}
        style={{ backgroundColor: uiCourse.color }}
      >
        <h1 className={styles.title}>{course.nameRU}</h1>
        <div className={styles.headerImageWrapper}>
          <Image
            src={uiCourse.imageUrl}
            alt={course.nameRU}
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
            {course.fitting?.map((text: string, index: number) => (
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
            {course.directions?.map((dir: string, index: number) => (
              <div key={index} className={styles.directionItem}>
                <span className={styles.directionIcon}>✦</span>
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

            {token ? (
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
                >
                  Добавить курс
                </button>
              )
            ) : (
              <button
                className={styles.primaryButton}
                onClick={() => router.push('/auth/signin')}
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
