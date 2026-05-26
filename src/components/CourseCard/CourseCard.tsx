import Image from 'next/image';
import styles from './CourseCard.module.css';
import Link from 'next/link';

interface Course {
  id: number;
  title: string;
  duration: string;
  timePerDay: string;
  difficulty: 'easy' | 'medium' | 'hard';
  imageUrl: string;
  color: string;
}

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Link href={`/courses/course/${course.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
    <div className={styles.card}>
      <div className={styles.cardImageContainer}>
        <Image
          width={360}
          height={325}
          className={styles.cardImage}
          src={course.imageUrl}
          alt={course.title}
          priority
        />
        <button className={styles.addButton} aria-label="Добавить курс">
          <Image
            width={32}
            height={32}
            src="/images/plus.svg"
            alt="Добавить курс"
          />
        </button>
      </div>

      <div className={styles.cardInfo}>
        <h3 className={styles.cardTitle}>{course.title}</h3>

        <div className={styles.cardParams}>
          <div className={styles.paramItem}>
            <Image width={18} height={18} src="/images/calendar.svg" alt="" />
            <span>{course.duration}</span>
          </div>
          <div className={styles.paramItem}>
            <Image width={18} height={18} src="/images/watch.svg" alt="" />
            <span>{course.timePerDay}</span>
          </div>
          <div className={styles.paramItem}>
            <Image width={18} height={18} src="/images/level.svg" alt="" />
            <span>Сложность</span>
          </div>
        </div>
      </div>
    </div>
    </Link>
  );
}
