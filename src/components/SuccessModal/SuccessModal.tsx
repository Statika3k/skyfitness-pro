'use client';

import Image from 'next/image';
import styles from './SuccessModal.module.css';

type SuccessModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>Ваш прогресс засчитан!</h2>
        
        <div className={styles.checkmarkContainer}>
          <div className={styles.checkmark}>
            <Image
              src="/images/checkmark.svg"
              alt="Галочка"
              width={80}
              height={80}
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}