import styles from './page.module.css';
import CourseList from '@/components/CourseList/CourseList';

export default function MainPage() {
  return (
    <div className={styles.mainScroll}>
      <CourseList />
    </div>
  );
}