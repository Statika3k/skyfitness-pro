import { mapApiCourseToUI } from './helpers';
import { CourseType } from '@/sharedTypes/sharedTypes';

describe('mapApiCourseToUI', () => {
  const mockApiCourse: CourseType = {
    _id: '12345',
    nameRU: 'Йога',
    nameEN: 'Yoga',
    description: 'Описание курса йоги для новичков',
    durationInDays: 25, 
    dailyDurationInMinutes: { from: 20, to: 50 },
    difficulty: 'начальный',
    fitting: ['Текст 1', 'Текст 2'],
    directions: ['Направление 1'],
    workouts: [],
  };

  it('должна корректно преобразовывать данные из API в формат UI', () => {
    const result = mapApiCourseToUI(mockApiCourse);

    expect(result).not.toBeNull();
    expect(result.id).toBe('12345');
    expect(result.title).toBe('Йога');
    expect(result.duration).toBe('25 дней');
    expect(result.timePerDay).toBe('20-50 мин/день');
    expect(result.difficulty).toBe('easy');
    expect(result.imageUrl).toBe('/images/yoga.jpg');
  });

  it('должна преобразовывать сложность "средний" в "medium"', () => {
    const mediumCourse: CourseType = {
      ...mockApiCourse,
      difficulty: 'средний' as const,
    };
    
    const result = mapApiCourseToUI(mediumCourse);
    expect(result.difficulty).toBe('medium');
  });
});