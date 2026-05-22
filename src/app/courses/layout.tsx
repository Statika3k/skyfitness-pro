import { ReactNode } from 'react';
import styles from './layout.module.css';
import Header from '@/components/Header/Header';
import ReduxProvider from '@/store/ReduxProvider';

interface CoursesLayoutProps {
  children: ReactNode;
}

export default function CoursesLayout({ children }: CoursesLayoutProps) {
  return (
    <ReduxProvider>
    <div className={styles.layoutWrapper}>
      <div className={styles.layoutContainer}>
        <Header />
        <main>{children}</main>
      </div>
    </div>
    </ReduxProvider>
  );
}