'use client';

import { useState } from 'react'; 
import styles from './ProgressModal.module.css';
import { WorkoutType } from '@/services/workouts/workoutsApi';

type ProgressModalProps = {
  workout: WorkoutType;
  currentProgress: number[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (progressData: number[]) => void;
};

export default function ProgressModal({
  workout,
  currentProgress,
  isOpen,
  onClose,
  onSave,
}: ProgressModalProps) {
  const [progressData, setProgressData] = useState<number[]>(currentProgress);

  const handleInputChange = (index: number, value: string) => {
    const newValue = parseInt(value, 10) || 0;
    const newData = [...progressData];
    newData[index] = Math.max(0, newValue);
    setProgressData(newData);
  };

  const handleSave = () => {
    onSave(progressData);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>Мой прогресс</h2>
        
        <div className={styles.exercisesList}>
          {workout.exercises.map((exercise, index) => (
            <div key={exercise._id} className={styles.exerciseItem}>
              <label className={styles.exerciseLabel}>
                Сколько раз вы сделали {exercise.name.toLowerCase()}?
              </label>
              <input
                type="number"
                min="0"
                value={progressData[index] || 0}
                onChange={(e) => handleInputChange(index, e.target.value)}
                className={styles.input}
                placeholder="0"
              />
            </div>
          ))}
        </div>

        <button className={styles.saveButton} onClick={handleSave}>
          Сохранить
        </button>
      </div>
    </div>
  );
}