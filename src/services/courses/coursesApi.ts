import { CourseType } from '@/sharedTypes/sharedTypes';
import axios from 'axios';
import { BASE_URL } from './constants';

export const getAllCourses = (): Promise<CourseType[]> => {
  return axios(`${BASE_URL}/courses`).then((res) => {
    return res.data;
  });
};

export const addUserCourse = (
  token: string,
  courseId: string,
): Promise<{ message: string }> => {
  return axios
    .post(
      `${BASE_URL}/users/me/courses`,
      { courseId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': '',
        },
      },
    )
    .then((res) => res.data);
};
