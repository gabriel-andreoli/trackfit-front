import { EMuscleGroupType } from ".";

export interface ExerciseResult extends Result<string> {
  name: string;
  muscleGroupType: EMuscleGroupType;
  muscleGroupTypeDescription: string;
}

export interface Result<TKey> {
  id: TKey | null;
  createdAt: string | null;
}