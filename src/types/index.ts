export interface Course {
  id: string;
  title: string;
  duration: string;
  timePerDay: string;
  difficulty: 'easy' | 'medium' | 'hard';
  imageUrl: string;
  color: string;
}