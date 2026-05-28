import axios from 'axios';
import { BASE_URL } from '../courses/constants';


export type ExerciseType = {
  _id: string;
  name: string;
  quantity: number;
};

export type WorkoutType = {
  _id: string;
  name: string;
  video: string;
  exercises: ExerciseType[];
};

export type WorkoutProgressType = {
  workoutId: string;
  workoutCompleted: boolean;
  progressData: number[];
};

export type CourseProgressType = {
  courseId: string;
  courseCompleted: boolean;
  workoutsProgress: WorkoutProgressType[];
};

export const getWorkoutById = (
  workoutId: string,
  token: string,
): Promise<WorkoutType> => {
  return axios
    .get(`${BASE_URL}/workouts/${workoutId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': '',
      },
    })
    .then((res) => res.data);
};

export const getWorkoutProgress = (
  courseId: string,
  workoutId: string,
  token: string,
): Promise<WorkoutProgressType> => {
  return axios
    .get(
      `${BASE_URL}/users/me/progress?courseId=${courseId}&workoutId=${workoutId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': '',
        },
      },
    )
    .then((res) => res.data);
};

export const saveWorkoutProgress = (
  courseId: string,
  workoutId: string,
  progressData: number[],
  token: string,
): Promise<{ message: string }> => {
  return axios
    .patch(
      `${BASE_URL}/courses/${courseId}/workouts/${workoutId}`,
      { progressData },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': '',
        },
      },
    )
    .then((res) => res.data);
};

export const resetWorkoutProgress = (
  courseId: string,
  workoutId: string,
  token: string,
): Promise<{ message: string }> => {
  return axios
    .patch(
      `${BASE_URL}/courses/${courseId}/workouts/${workoutId}/reset`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': '',
        },
      },
    )
    .then((res) => res.data);
};

export const getCourseProgress = (
  courseId: string,
  token: string
): Promise<CourseProgressType> => {
  return axios.get(`${BASE_URL}/users/me/progress?courseId=${courseId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': '',
    },
  }).then((res) => res.data);
};
