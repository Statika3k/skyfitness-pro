import axios from 'axios';

const BASE_URL = '/api/fitness';

export type SignInData = {
  email: string;
  password: string;
};

export type SignUpData = {
  email: string;
  password: string;
};

export type SignInResponse = {
  token: string;
};

export type SignUpResponse = {
  message: string;
};

export type UserInfo = {
  email: string;
  selectedCourses: string[];
};

type GetUserApiResponse = {
  user: UserInfo;
};

export const signUp = async (data: SignUpData): Promise<SignUpResponse> => {
  const response = await axios.post(`${BASE_URL}/auth/register`, data, {
    headers: {
      'Content-Type': '',
    },
  });
  return response.data;
};

export const signIn = async (data: SignInData): Promise<SignInResponse> => {
  const response = await axios.post(`${BASE_URL}/auth/login`, data, {
    headers: {
      'Content-Type': '',
    },
  });
  return response.data;
};

export const getUserInfo = async (token: string): Promise<UserInfo> => {
  const response = await axios.get<GetUserApiResponse>(`${BASE_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': '',
    },
  });
  return response.data.user;
};
