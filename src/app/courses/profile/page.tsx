'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './page.module.css';
import { useAppSelector, useAppDispatch } from '@/store/store';
import { clearAuth, setUser } from '@/store/features/AuthSlice';
import { getUserInfo } from '@/services/auth/authApi';
import { CourseType } from '@/sharedTypes/sharedTypes';
import { getAllCourses } from '@/services/courses/coursesApi';

type CourseProgress = {
  courseId: string;
  courseCompleted: boolean;
  workoutsProgress: Array<{
    workoutId: string;
    workoutCompleted: boolean;
    progressData: number[];
  }>;
};

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, token, userName } = useAppSelector((state) => state.auth);

  const [courses, setCourses] = useState<CourseType[]>([]);
  const [courseProgress, setCourseProgress] = useState<
    Record<string, CourseProgress>
  >({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      router.push('/auth/signin');
      return;
    }

    const fetchData = async () => {
      try {
        const userInfo = await getUserInfo(token);
        dispatch(setUser(userInfo));
        localStorage.setItem('user', JSON.stringify(userInfo));

        const allCourses = await getAllCourses();
        const userCourses = allCourses.filter((course) =>
          userInfo.selectedCourses.includes(course._id),
        );

        setCourses(userCourses);

        const progressPromises = userCourses.map(async (course) => {
          const response = await fetch(
            `/api/fitness/users/me/progress?courseId=${course._id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          if (response.ok) {
            const progress: CourseProgress = await response.json();
            setCourseProgress((prev) => ({ ...prev, [course._id]: progress }));
          }
        });

        await Promise.all(progressPromises);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token, router, dispatch]);

  const handleLogout = () => {
    dispatch(clearAuth());
    router.push('/courses/main');
  };

  const calculateCourseProgress = (courseId: string): number => {
    const progress = courseProgress[courseId];
    if (
      !progress ||
      !progress.workoutsProgress ||
      progress.workoutsProgress.length === 0
    ) {
      return 0;
    }

    const completedWorkouts = progress.workoutsProgress.filter(
      (wp) => wp.workoutCompleted,
    ).length;

    const course = courses.find((c) => c._id === courseId);
    if (!course || course.workouts.length === 0) {
      return 0;
    }

    return Math.round((completedWorkouts / course.workouts.length) * 100);
  };

  const getCourseStatus = (
    courseId: string,
  ): 'not-started' | 'in-progress' | 'completed' => {
    const progress = calculateCourseProgress(courseId);
    if (progress === 0) return 'not-started';
    if (progress === 100) return 'completed';
    return 'in-progress';
  };

  const handleStartCourse = (courseId: string) => {
    router.push(`/courses/workouts/${courseId}`);
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      const response = await fetch(
        `/api/fitness/users/me/courses/${courseId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        setCourses(courses.filter((c) => c._id !== courseId));
      }
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <p>Загрузка профиля...</p>
      </div>
    );
  }

  return (
    <div className={styles.profilePage}>
      <section className={styles.profileSection}>
        <div className={styles.profileCard}>
          <div className={styles.avatarWrapper}>
            <div className={styles.avatarPlaceholder}>
              <Image
                src="/images/UserIconProfil.svg"
                alt="Аватар"
                width={197}
                height={197}
              />
            </div>
          </div>

          <div className={styles.profileInfo}>
            <h1 className={styles.userName}>{userName || 'Пользователь'}</h1>
            <p className={styles.userLogin}>Логин: {user?.email || ''}</p>
            <button className={styles.logoutButton} onClick={handleLogout}>
              Выйти
            </button>
          </div>
        </div>
      </section>

      <section className={styles.coursesSection}>
        <h2 className={styles.sectionTitle}>Мои курсы</h2>

        {courses.length === 0 ? (
          <div className={styles.noCourses}>
            <p>У вас пока нет добавленных курсов</p>
            <button
              className={styles.browseButton}
              onClick={() => router.push('/courses/main')}
            >
              Перейти к каталогу
            </button>
          </div>
        ) : (
          <div className={styles.coursesGrid}>
            {courses.map((course) => {
              const progress = calculateCourseProgress(course._id);
              const status = getCourseStatus(course._id);

              return (
                <div key={course._id} className={styles.courseCard}>
                  <div className={styles.courseImageWrapper}>
                    <Image
                      src={`/images/${course.nameEN.toLowerCase()}.jpg`}
                      alt={course.nameRU}
                      width={320}
                      height={200}
                      className={styles.courseImage}
                    />
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDeleteCourse(course._id)}
                      aria-label="Удалить курс"
                    >
                      −
                    </button>
                  </div>

                  <div className={styles.courseContent}>
                    <h3 className={styles.courseTitle}>{course.nameRU}</h3>

                    <div className={styles.courseMeta}>
                      <span className={styles.metaItem}>
                        📅 {course.durationInDays} дней
                      </span>
                      <span className={styles.metaItem}>
                        ⏱ {course.dailyDurationInMinutes.from}-
                        {course.dailyDurationInMinutes.to} мин/день
                      </span>
                    </div>

                    <div className={styles.courseDifficulty}>
                      <span className={styles.difficultyLabel}>Сложность</span>
                      <span className={styles.difficultyValue}>
                        {course.difficulty === 'начальный' && 'Легкий'}
                        {course.difficulty === 'средний' && 'Средний'}
                        {course.difficulty === 'сложный' && 'Сложный'}
                      </span>
                    </div>

                    <div className={styles.progressWrapper}>
                      <div className={styles.progressBar}>
                        <div
                          className={styles.progressFill}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className={styles.progressText}>
                        Прогресс {progress}%
                      </span>
                    </div>

                    <button
                      className={`${styles.actionButton} ${styles[`button-${status}`]}`}
                      onClick={() => handleStartCourse(course._id)}
                    >
                      {status === 'not-started' && 'Начать тренировки'}
                      {status === 'in-progress' && 'Продолжить'}
                      {status === 'completed' && 'Начать заново'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
