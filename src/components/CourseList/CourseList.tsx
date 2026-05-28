'use client';

import styles from './CourseList.module.css';
import CourseCard from '../CourseCard/CourseCard';
import Image from 'next/image';
import { useEffect } from 'react';
import { getAllCourses } from '@/services/courses/coursesApi';
import { mapApiCourseToUI } from '@/utils/helpers';
import { useAppDispatch, useAppSelector } from '@/store/store';
import {
  setAllCourses,
  setError,
  setLoading,
} from '@/store/features/CourseSlice';
import { Course } from '@/types';

export default function CourseList() {
  const dispatch = useAppDispatch();
  const { allCourses, isLoading, error } = useAppSelector(
    (state) => state.courses,
  );

  useEffect(() => {
    const fetchCourses = async () => {
      dispatch(setLoading(true));
      try {
        const apiCourses = await getAllCourses();
        dispatch(setAllCourses(apiCourses));
        dispatch(setError(null));
      } catch (error) {
        console.error('Error loading courses:', error);
        dispatch(setError('Не удалось загрузить курсы'));
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchCourses();
  }, [dispatch]);

  const uiCourses: Course[] = allCourses.map(mapApiCourseToUI);

  if (isLoading) return <div className={styles.loading}>Загрузка...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div id="top" className={styles.courseList}>
      <div className={styles.listHeader}>
        <h1 className={styles.listTitle}>
          Начните заниматься спортом и улучшите качество жизни
        </h1>
        <div className={styles.sloganBlock}>
          <div className={styles.sloganText}>
            <Image
              width={288}
              height={120}
              src="/images/Title-pic.svg"
              alt="Измени своё тело!"
            />
          </div>
        </div>
      </div>

      <div className={styles.coursesGrid}>
        {uiCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      <a
        href="#top"
        className={styles.scrollToTopButton}
        onClick={(e) => {
          e.preventDefault();
          document
            .getElementById('top')
            ?.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        Наверх ↑
      </a>
    </div>
  );
}
