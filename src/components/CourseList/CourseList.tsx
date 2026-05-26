'use client';

import styles from './CourseList.module.css';
import CourseCard from '../CourseCard/CourseCard';
import { Course } from '@/types';
import Image from 'next/image';


const coursesData: Course[] = [
  {
    id: 1,
    title: 'Йога',
    duration: '25 дней',
    timePerDay: '20-50 мин/день',
    difficulty: 'easy', 
    imageUrl: '/images/yoga.jpg',
    color: '#ffc700',
  },
  {
    id: 2,
    title: 'Стретчинг',
    duration: '25 дней',
    timePerDay: '20-50 мин/день',
    difficulty: 'medium',
    imageUrl: '/images/stretching.jpg',
    color: '#2491d2',
  },
  {
    id: 3,
    title: 'Фитнес',
    duration: '25 дней',
    timePerDay: '20-50 мин/день',
    difficulty: 'hard',
    imageUrl: '/images/fitnes.jpg',
    color: '#f7a012',
  },
  {
    id: 4,
    title: 'Степ-аэробика',
    duration: '25 дней',
    timePerDay: '20-50 мин/день',
    difficulty: 'medium',
    imageUrl: '/images/step.jpg',
    color: '#ff7e65',
  },
  {
    id: 5,
    title: 'Бодифлекс',
    duration: '25 дней',
    timePerDay: '20-50 мин/день',
    difficulty: 'easy',
    imageUrl: '/images/bodyflex.jpg',
    color: '#7d458c',
  },
];

export default function CourseList() {
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
        {coursesData.map((course) => (
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