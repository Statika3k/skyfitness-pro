'use client';

import styles from './CourseList.module.css';
import CourseCard from '../CourseCard/CourseCard';
import { Course } from '@/types';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getAllCourses } from '@/services/courses/coursesApi';
import { mapApiCourseToUI } from '@/utils/helpers';


export default function CourseList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const apiCourses = await getAllCourses();        
        const uiCourses = apiCourses.map(mapApiCourseToUI);
        setCourses(uiCourses);
        setError(null);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Не удалось загрузить курсы. Попробуйте позже.');
        setCourses([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <p>Загрузка курсов...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Попробовать снова</button>
      </div>
    );
  }

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
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
      
      <a
        href="#top"
        className={styles.scrollToTopButton}
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('top')?.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        Наверх ↑
      </a>
    </div>
  );
}