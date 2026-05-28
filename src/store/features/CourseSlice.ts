import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CourseType } from '@/sharedTypes/sharedTypes';
import {
  WorkoutType,
  CourseProgressType,
  WorkoutProgressType,
} from '@/services/workouts/workoutsApi';

type CourseState = {
  allCourses: CourseType[];
  selectedCourses: CourseType[];
  courseProgress: Record<string, CourseProgressType>;
  selectedWorkout: WorkoutType | null;
  workoutProgress: WorkoutProgressType | null;

  isLoading: boolean;
  error: string | null;
  isSelectWorkoutOpen: boolean;
  selectedCourseIdForModal: string | null;
};

const initialState: CourseState = {
  allCourses: [],
  selectedCourses: [],
  courseProgress: {},
  selectedWorkout: null,
  workoutProgress: null,
  isLoading: false,
  error: null,
  isSelectWorkoutOpen: false,
  selectedCourseIdForModal: null,
};

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    setAllCourses: (state, action: PayloadAction<CourseType[]>) => {
      state.allCourses = action.payload;
    },
    setSelectedCourses: (state, action: PayloadAction<CourseType[]>) => {
      state.selectedCourses = action.payload;
    },
    addSelectedCourse: (state, action: PayloadAction<CourseType>) => {
      if (!state.selectedCourses.some((c) => c._id === action.payload._id)) {
        state.selectedCourses.push(action.payload);
      }
    },

    setCourseProgress: (
      state,
      action: PayloadAction<{ courseId: string; data: CourseProgressType }>,
    ) => {
      state.courseProgress[action.payload.courseId] = action.payload.data;
    },
    setWorkoutProgress: (state, action: PayloadAction<WorkoutProgressType>) => {
      state.workoutProgress = action.payload;
    },

    setSelectedWorkout: (state, action: PayloadAction<WorkoutType>) => {
      state.selectedWorkout = action.payload;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    openSelectWorkoutModal: (state, action: PayloadAction<string>) => {
      state.isSelectWorkoutOpen = true;
      state.selectedCourseIdForModal = action.payload;
    },
    closeSelectWorkoutModal: (state) => {
      state.isSelectWorkoutOpen = false;
      state.selectedCourseIdForModal = null;
    },

    clearCourses: (state) => {
      state.selectedCourses = [];
      state.courseProgress = {};
      state.selectedWorkout = null;
    },
  },
});

export const {
  setAllCourses,
  setSelectedCourses,
  addSelectedCourse,
  setCourseProgress,
  setWorkoutProgress,
  setSelectedWorkout,
  setLoading,
  setError,
  openSelectWorkoutModal,
  closeSelectWorkoutModal,
  clearCourses,
} = courseSlice.actions;

export const courseSliceReducer = courseSlice.reducer;
