export type DailyDurationInMinutes = {
  from: number;
  to: number;
};

export type CourseType = {
  _id: string;
  nameRU: string;
  nameEN: string;
  description: string;
  directions: string[];
  fitting: string[];
  difficulty: 'начальный' | 'средний' | 'сложный';
  durationInDays: number;
  dailyDurationInMinutes: DailyDurationInMinutes;
  workouts: string[];  
};

export type AddCourseResponse = {
  message: string;
};