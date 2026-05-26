import { CourseType } from '@/sharedTypes/sharedTypes';
import { Course } from '@/types';

const COURSE_COLORS: Record<string, string> = {
  'Йога': '#ffc700',
  'Стретчинг': '#2491d2',
  'Фитнес': '#f7a012',
  'Степ-аэробика': '#ff7e65',
  'Бодифлекс': '#7d458c',
};

export const mapApiCourseToUI = (course: CourseType): Course => {
  return {
    id: course._id,
    title: course.nameRU,
    duration: course.durationInDays 
      ? `${course.durationInDays} дней` 
      : '25 дней',
    timePerDay: course.dailyDurationInMinutes 
      ? `${course.dailyDurationInMinutes.from}-${course.dailyDurationInMinutes.to} мин/день`
      : '20-50 мин/день',
    
    difficulty: course.difficulty === 'начальный' ? 'easy' 
      : course.difficulty === 'средний' ? 'medium' 
      : 'hard',
      
    imageUrl: course.nameEN 
      ? `/images/${course.nameEN.toLowerCase()}.jpg`
      : '/images/default-course.jpg',
      
    color: COURSE_COLORS[course.nameRU] || '#bcec30',
  };
};