export interface Course {
  id: number;
  title: string;
  duration: string;
  timePerDay: string;
  difficulty: 'easy' | 'medium' | 'hard';
  imageUrl: string;
  color: string;
}