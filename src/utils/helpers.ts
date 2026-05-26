import { CourseType } from '@/sharedTypes/sharedTypes';
import { Course } from '@/types';

export const mapApiCourseToUI = (course: CourseType): Course => {
  return {
    id: parseInt(course._id, 10), 
    title: course.nameRU,
    duration: `${course.durationInDays} дней`, 
    timePerDay: `${course.dailyDurationInMinutes.from}-${course.dailyDurationInMinutes.to} мин/день`,
    
    
    difficulty: course.difficulty === 'начальный' ? 'easy' 
      : course.difficulty === 'средний' ? 'medium' 
      : 'hard',
      
    imageUrl: `/images/${course.nameEN.toLowerCase()}.jpg`, 
    color: '#ffc700', 
  };
};