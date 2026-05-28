'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import styles from './Workout.module.css';
import { useAppSelector } from '@/store/store';
import {
  getWorkoutById,
  getWorkoutProgress,
  saveWorkoutProgress,
  WorkoutType,
} from '@/services/workouts/workoutsApi';
import ProgressModal from '../ProgressModal/ProgressModal';
import SuccessModal from '../SuccessModal/SuccessModal';

export default function Workout() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { token } = useAppSelector((state) => state.auth);

  const [workout, setWorkout] = useState<WorkoutType | null>(null);
  const [progressData, setProgressData] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const workoutId = params.id as string;
  const courseId = searchParams.get('courseId');

  useEffect(() => {
    if (!token || !workoutId || !courseId) {
      router.push('/courses/profile');
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);

        const workoutData = await getWorkoutById(workoutId, token);
        setWorkout(workoutData);

        const progress = await getWorkoutProgress(courseId, workoutId, token);
        setProgressData(
          progress.progressData ||
            new Array(workoutData.exercises.length).fill(0),
        );

        setError(null);
      } catch (err) {
        console.error('Error fetching workout data:', err);
        setError('Не удалось загрузить тренировку');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [workoutId, courseId, token, router]);

  const handleProgressChange = (index: number, value: string) => {
    const newValue = parseInt(value, 10) || 0;
    const newData = [...progressData];
    newData[index] = newValue;
    setProgressData(newData);
  };

  const handleOpenProgressModal = () => {
    setIsProgressModalOpen(true);
  };

  const handleSaveProgressFromModal = async (modalProgressData: number[]) => {
    if (!token || !courseId || !workoutId || !workout) return;

    try {
      setIsSaving(true);
      setIsProgressModalOpen(false);

      await saveWorkoutProgress(courseId, workoutId, modalProgressData, token);

      setProgressData(modalProgressData);

      setIsSuccessModalOpen(true);

      setTimeout(() => {
        setIsSuccessModalOpen(false);
      }, 2000);
    } catch (err) {
      console.error('Error saving progress:', err);
      alert('Не удалось сохранить прогресс');
      setIsProgressModalOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetProgress = async () => {
    if (!token || !courseId || !workoutId) return;

    if (confirm('Вы уверены, что хотите сбросить весь прогресс?')) {
      try {
        const { resetWorkoutProgress } =
          await import('@/services/workouts/workoutsApi');
        await resetWorkoutProgress(courseId, workoutId, token);
        setProgressData(new Array(workout?.exercises.length || 0).fill(0));
        alert('Прогресс сброшен');
      } catch (err) {
        console.error('Error resetting progress:', err);
        alert('Не удалось сбросить прогресс');
      }
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <p>Загрузка тренировки...</p>
      </div>
    );
  }

  if (error || !workout) {
    return (
      <div className={styles.error}>
        <p>{error || 'Тренировка не найдена'}</p>
        <button onClick={() => router.push('/courses/profile')}>
          Вернуться к профилю
        </button>
      </div>
    );
  }

  const getYouTubeId = (url: string): string => {
    const patterns = [
      /embed\/([a-zA-Z0-9_-]+)/,
      /watch\?v=([a-zA-Z0-9_-]+)/,
      /youtu\.be\/([a-zA-Z0-9_-]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }

    return url;
  };

  const videoId = getYouTubeId(workout.video);

  return (
    <div className={styles.workout}>
      <div className={styles.videoContainer}>
        <div className={styles.videoWrapper}>
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title={workout.name}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className={styles.videoFrame}
          />
        </div>
      </div>

      <div className={styles.progressBlock}>
        <h2 className={styles.blockTitle}>{workout.name}</h2>

        <div className={styles.exercisesGrid}>
          {workout.exercises.map((exercise, index) => (
            <div key={exercise._id} className={styles.exerciseCard}>
              <p className={styles.exerciseName}>{exercise.name}</p>
              <div className={styles.progressInput}>
                <input
                  type="number"
                  min="0"
                  value={progressData[index] || 0}
                  onChange={(e) => handleProgressChange(index, e.target.value)}
                  className={styles.input}
                  placeholder="0"
                  readOnly
                />
                <span className={styles.inputLabel}>
                  из {exercise.quantity}
                </span>
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{
                    width: `${Math.min(
                      ((progressData[index] || 0) / exercise.quantity) * 100,
                      100,
                    )}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className={styles.actions}>
          <button
            className={styles.saveButton}
            onClick={handleOpenProgressModal}
            disabled={isSaving}
          >
            {isSaving ? 'Сохранение...' : 'Заполнить свой прогресс'}
          </button>
          <button className={styles.resetButton} onClick={handleResetProgress}>
            Сбросить прогресс
          </button>
        </div>
      </div>
      {workout && (
        <ProgressModal
          key={isProgressModalOpen ? 'open' : 'closed'} 
          workout={workout}
          currentProgress={progressData}
          isOpen={isProgressModalOpen}
          onClose={() => setIsProgressModalOpen(false)}
          onSave={handleSaveProgressFromModal}
        />
      )}

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      />
    </div>
  );
}
