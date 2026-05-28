'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './page.module.css';
import { useAppSelector, useAppDispatch } from '@/store/store';
import { clearAuth } from '@/store/features/AuthSlice';
import {
  setSelectedCourses,
  setCourseProgress,
  openSelectWorkoutModal,
  closeSelectWorkoutModal,
  setLoading,
  setError,
} from '@/store/features/CourseSlice';
import { getUserInfo } from '@/services/auth/authApi';
import { getAllCourses } from '@/services/courses/coursesApi';
import { CourseType } from '@/sharedTypes/sharedTypes';
import SelectWorkout from '@/components/SelectWorkout/SelectWorkout';
import { WorkoutProgressType } from '@/services/workouts/workoutsApi';

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { token, userName, user } = useAppSelector((state) => state.auth);
  const {
    selectedCourses,
    courseProgress,
    isSelectWorkoutOpen,
    selectedCourseIdForModal,
  } = useAppSelector((state) => state.courses);

  useEffect(() => {
    if (!token) {
      router.push('/auth/signin');
      return;
    }

    const fetchData = async () => {
      dispatch(setLoading(true));
      try {
        const userInfo = await getUserInfo(token);
        const allCourses = await getAllCourses();
        const userCourses = allCourses.filter((course: CourseType) =>
          userInfo.selectedCourses.includes(course._id),
        );

        dispatch(setSelectedCourses(userCourses));

        const progressPromises = userCourses.map(async (course) => {
          try {
            const response = await fetch(
              `/api/fitness/users/me/progress?courseId=${course._id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );
            if (response.ok) {
              const progressData = await response.json();
              dispatch(
                setCourseProgress({ courseId: course._id, data: progressData }),
              );
            }
          } catch (err) {
            console.error(
              `Error fetching progress for course ${course._id}:`,
              err,
            );
          }
        });

        await Promise.all(progressPromises);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        dispatch(setError('Ошибка загрузки данных'));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchData();
  }, [token, router, dispatch]);

  const handleLogout = () => {
    dispatch(clearAuth());
    router.push('/courses/main');
  };

  const handleStartCourse = (courseId: string) => {
    dispatch(openSelectWorkoutModal(courseId));
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
        const updatedCourses = selectedCourses.filter(
          (c) => c._id !== courseId,
        );
        dispatch(setSelectedCourses(updatedCourses));
      }
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const calculateCourseProgress = (courseId: string): number => {
  const progress = courseProgress[courseId];
  
  const course = selectedCourses.find((c) => c._id === courseId);
  if (!course || !course.workouts || course.workouts.length === 0) {
    return 0;
  }
  
  const totalWorkouts = course.workouts.length; 
  
  if (!progress?.workoutsProgress) {
    return 0;
  }
  
  const completedWorkouts = progress.workoutsProgress.filter(
    (wp: WorkoutProgressType) => wp.workoutCompleted
  ).length;
  
  return Math.round((completedWorkouts / totalWorkouts) * 100);
};

  const getCourseStatus = (
    courseId: string,
  ): 'not-started' | 'in-progress' | 'completed' => {
    const progress = calculateCourseProgress(courseId);
    if (progress === 0) return 'not-started';
    if (progress === 100) return 'completed';
    return 'in-progress';
  };

  const handleSelectWorkout = (workoutId: string) => {
    if (selectedCourseIdForModal) {
      router.push(
        `/courses/workout/${workoutId}?courseId=${selectedCourseIdForModal}`,
      );
      dispatch(closeSelectWorkoutModal());
    }
  };

  return (
    <div className={styles.profilePage}>
      <h1 className={styles.pageTitle}>Профиль</h1>

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
            <h2 className={styles.userName}>{userName || 'Пользователь'}</h2>
            <p className={styles.userLogin}>Логин: {user?.email || ''}</p>
            <button className={styles.logoutButton} onClick={handleLogout}>
              Выйти
            </button>
          </div>
        </div>
      </section>

      <section className={styles.coursesSection}>
        <h2 className={styles.sectionTitle}>Мои курсы</h2>

        {selectedCourses.length === 0 ? (
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
            {selectedCourses.map((course) => {
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
                      <Image
                        width={32}
                        height={32}
                        src="/images/minus.svg"
                        alt="Удалить курс"
                      />
                    </button>
                  </div>

                  <div className={styles.courseContent}>
                    <h3 className={styles.courseTitle}>{course.nameRU}</h3>

                    <div className={styles.courseMeta}>
                      <div className={styles.metaItem}>
                        <Image
                          width={18}
                          height={18}
                          src="/images/calendar.svg"
                          alt=""
                        />
                        <span>{course.durationInDays} дней</span>
                      </div>
                      <div className={styles.metaItem}>
                        <Image
                          width={18}
                          height={18}
                          src="/images/watch.svg"
                          alt=""
                        />
                        <span>
                          {course.dailyDurationInMinutes.from}-
                          {course.dailyDurationInMinutes.to} мин/день
                        </span>
                      </div>
                    </div>

                    <div className={styles.courseDifficulty}>
                      <Image
                        width={18}
                        height={18}
                        src="/images/level.svg"
                        alt=""
                      />
                      <span>Сложность</span>                      
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
                      className={styles.actionButton}
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

      {token && selectedCourseIdForModal && (
        <SelectWorkout
          courseId={selectedCourseIdForModal}
          token={token}
          isOpen={isSelectWorkoutOpen}
          onClose={() => dispatch(closeSelectWorkoutModal())}
          onSelectWorkout={handleSelectWorkout}
        />
      )}
    </div>
  );
}
