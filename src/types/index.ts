
export enum EMuscleGroupType {
  Nenhum,
  Panturrilha,
  Quadríceps,
  PosteriorDePerna,
  Abdômen,
  Costas,
  Peito,
  Trapézio,
  Ombro,
  Bíceps,
  Tríceps,
  Antebraço
}

export interface User {
  token: string;
  username: string;
  email: string;
  role: string;
  userId: string;
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroupType: EMuscleGroupType;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkoutSet {
  weight: number;
  reps: number;
}

export interface WorkoutExercise {
  exerciseId: string;
  exerciseName: string;
  muscleGroupType: EMuscleGroupType;
  muscleGroupTypeDescription: string,
  sets: WorkoutSet[];
}

export interface Workout {
  id: string;
  date: Date;
  exercises: WorkoutExercise[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedResponse<T> {
  total: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  items: T[];
}
