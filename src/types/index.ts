
export enum MuscleGroup {
  CHEST = "Peito",
  BACK = "Costas",
  LEGS = "Pernas",
  SHOULDERS = "Ombros",
  ARMS = "Braços",
  ABS = "Abdômen",
  FULL_BODY = "Corpo Inteiro",
  CARDIO = "Cardio"
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
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
  muscleGroup: MuscleGroup;
  sets: WorkoutSet[];
}

export interface Workout {
  id: string;
  date: Date;
  exercises: WorkoutExercise[];
  createdAt: Date;
  updatedAt: Date;
}
