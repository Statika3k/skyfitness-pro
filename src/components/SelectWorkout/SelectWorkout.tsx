'use client';

import { useEffect, useState } from 'react';
import styles from './SelectWorkout.module.css';
import {
  CourseProgressType,
  WorkoutProgressType,
} from '@/services/workouts/workoutsApi';

export type WorkoutItem = {
  _id: string;
  name: string;
  courseName?: string;
  day?: number;
};

type SelectWorkoutProps = {
  courseId: string;
  token: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectWorkout: (workoutId: string) => void;
};

export default function SelectWorkout({
  courseId,
  token,
  isOpen,
  onClose,
  onSelectWorkout,
}: SelectWorkoutProps) {
  const [workouts, setWorkouts] = useState<WorkoutItem[]>([]);
  const [completedWorkouts, setCompletedWorkouts] = useState<Set<string>>(
    new Set(),
  );
  const [selectedWorkout, setSelectedWorkout] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !courseId || !token) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);

        const response = await fetch(
          `/api/fitness/courses/${courseId}/workouts`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.ok) {
          const workoutsData: WorkoutItem[] = await response.json();
          setWorkouts(workoutsData);
        } else {
          console.warn('Failed to fetch workouts:', response.status);
        }

        const progressResponse = await fetch(
          `/api/fitness/users/me/progress?courseId=${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (progressResponse.ok) {
          const progressData: CourseProgressType =
            await progressResponse.json();

          if (
            progressData?.workoutsProgress &&
            Array.isArray(progressData.workoutsProgress)
          ) {
            const completedIds = new Set<string>(
              progressData.workoutsProgress
                .filter((wp: WorkoutProgressType) => wp?.workoutCompleted)
                .map((wp: WorkoutProgressType) => wp?.workoutId)
                .filter((id): id is string => id !== undefined),
            );
            setCompletedWorkouts(completedIds);
          } else {
            console.warn('Unexpected progress data format:', progressData);
            setCompletedWorkouts(new Set());
          }
        } else {
          console.warn('Failed to fetch progress:', progressResponse.status);
          setCompletedWorkouts(new Set());
        }
      } catch (error) {
        console.error('Error fetching workouts:', error);
        setWorkouts([]);
        setCompletedWorkouts(new Set());
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isOpen, courseId, token]);

  const handleStart = () => {
    if (selectedWorkout) {
      onSelectWorkout(selectedWorkout);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Выберите тренировку</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.workoutsList}>
          {isLoading ? (
            <div className={styles.loading}>Загрузка...</div>
          ) : (
            workouts.map((workout) => {
              const isCompleted = completedWorkouts.has(workout._id);
              const isSelected = selectedWorkout === workout._id;

              return (
                <div
                  key={workout._id}
                  className={`${styles.workoutItem} ${isSelected ? styles.selected : ''}`}
                  onClick={() => setSelectedWorkout(workout._id)}
                >
                  <div className={styles.workoutIcon}>
                    {isCompleted ? (
                      <div className={styles.checkmark}>✓</div>
                    ) : (
                      <div className={styles.radio} />
                    )}
                  </div>
                  <div className={styles.workoutInfo}>
                    <h3 className={styles.workoutName}>{workout.name}</h3>
                    {workout.courseName && (
                      <p className={styles.workoutCourse}>
                        {workout.courseName}
                      </p>
                    )}
                    {workout.day && (
                      <p className={styles.workoutDay}>/ {workout.day} день</p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <button
          className={`${styles.startButton} ${!selectedWorkout ? styles.disabled : ''}`}
          onClick={handleStart}
          disabled={!selectedWorkout}
        >
          Начать
        </button>
      </div>
    </div>
  );
}
