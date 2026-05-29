import { courseSliceReducer } from './CourseSlice';
import {
  setSelectedCourses,
  addSelectedCourse,
  setCourseProgress,
  openSelectWorkoutModal,
  closeSelectWorkoutModal,
  clearCourses,
  setLoading,
  setError,
} from './CourseSlice';
import { CourseType } from '@/sharedTypes/sharedTypes';
import { CourseProgressType } from '@/services/workouts/workoutsApi';

describe('CourseSlice', () => {
  const mockCourse: CourseType = {
    _id: 'course-1',
    nameRU: 'Йога',
    nameEN: 'Yoga',
    description: 'Описание',
    directions: ['Растяжка'],
    fitting: ['Для новичков'],
    difficulty: 'начальный',
    durationInDays: 25,
    dailyDurationInMinutes: { from: 20, to: 50 },
    workouts: ['workout-1', 'workout-2'],
  };

  it('должен возвращать начальное состояние при undefined state', () => {
    const state = courseSliceReducer(undefined, { type: 'unknown' });
    expect(state.selectedCourses).toEqual([]);
    expect(state.allCourses).toEqual([]);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('setSelectedCourses: должен установить выбранные курсы', () => {
    const state = courseSliceReducer(
      undefined,
      setSelectedCourses([mockCourse]),
    );
    expect(state.selectedCourses).toHaveLength(1);
    expect(state.selectedCourses[0]._id).toBe('course-1');
  });

  it('addSelectedCourse: должен добавить курс, если его ещё нет', () => {
    const state = courseSliceReducer(
      undefined,
      addSelectedCourse(mockCourse),
    );
    expect(state.selectedCourses).toHaveLength(1);
  });

  it('addSelectedCourse: не должен дублировать курс', () => {
    const stateWithCourse = courseSliceReducer(
      undefined,
      setSelectedCourses([mockCourse]),
    );
    const state = courseSliceReducer(
      stateWithCourse,
      addSelectedCourse(mockCourse),
    );
    expect(state.selectedCourses).toHaveLength(1);
  });

  it('setCourseProgress: должен сохранить прогресс по курсу', () => {
    const progressData: CourseProgressType = {
      courseId: 'course-1',
      courseCompleted: false,
      workoutsProgress: [
        {
          workoutId: 'workout-1',
          workoutCompleted: true,
          progressData: [10, 15, 20],
        },
      ],
    };

    const state = courseSliceReducer(
      undefined,
      setCourseProgress({ courseId: 'course-1', data: progressData }),
    );
    expect(state.courseProgress['course-1']).toEqual(progressData);
  });

  it('openSelectWorkoutModal: должен открыть модалку и сохранить courseId', () => {
    const state = courseSliceReducer(
      undefined,
      openSelectWorkoutModal('course-1'),
    );
    expect(state.isSelectWorkoutOpen).toBe(true);
    expect(state.selectedCourseIdForModal).toBe('course-1');
  });

  it('closeSelectWorkoutModal: должен закрыть модалку и очистить courseId', () => {
    const openState = courseSliceReducer(
      undefined,
      openSelectWorkoutModal('course-1'),
    );
    const closedState = courseSliceReducer(
      openState,
      closeSelectWorkoutModal(),
    );
    expect(closedState.isSelectWorkoutOpen).toBe(false);
    expect(closedState.selectedCourseIdForModal).toBeNull();
  });

  it('clearCourses: должен очистить данные о курсах', () => {
    const populatedState = courseSliceReducer(undefined, setSelectedCourses([mockCourse]));
    const clearedState = courseSliceReducer(populatedState, clearCourses());
    expect(clearedState.selectedCourses).toHaveLength(0);
    expect(clearedState.courseProgress).toEqual({});
    expect(clearedState.selectedWorkout).toBeNull();
  });

  it('setLoading: должен изменить состояние загрузки', () => {
    const state = courseSliceReducer(undefined, setLoading(true));
    expect(state.isLoading).toBe(true);
  });

  it('setError: должен установить ошибку', () => {
    const state = courseSliceReducer(undefined, setError('Test error'));
    expect(state.error).toBe('Test error');
  });
});