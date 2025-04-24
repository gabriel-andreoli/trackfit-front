
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Exercise, Workout, EMuscleGroupType } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from './AuthContext';
import { workoutService } from '@/services/workoutService';
import { exerciseService } from '@/services/exerciseService';
import { ExerciseResult } from '@/types/DTOs';

interface DataContextType {
  exercises: ExerciseResult[];
  workouts: Workout[];
  addExercise: (exercise: Omit<Exercise, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateExercise: (id: string, exercise: Partial<Omit<Exercise, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteExercise: (id: string) => void;
  addWorkout: (workout: Omit<Workout, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateWorkout: (id: string, workout: Partial<Omit<Workout, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteWorkout: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [exercises, setExercises] = useState<ExerciseResult[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [actionRefresh, setActionRefresh] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const storedExercises = await exerciseService.getExercises();
          const storedWorkouts = await workoutService.getWorkouts();
          
          if (storedExercises) {
            setExercises(storedExercises.items);
          } else {
            setExercises([]);
          }
          
          if (storedWorkouts) {
            setWorkouts(storedWorkouts.items);
          } else {
            setWorkouts([]);
          }
        } catch (error) {
        }
      } else {
        setExercises([]);
        setWorkouts([]);
      }
    };
  
    fetchData();
  }, [user, actionRefresh]);

  const addExercise = (exercise: Omit<Exercise, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newExercise: ExerciseResult = {
      ...exercise
    };
    
    setExercises(prev => [...prev, newExercise]);
    toast({
      title: "Exercício adicionado",
      description: `${newExercise.name} foi adicionado com sucesso.`
    });
    setActionRefresh(!actionRefresh);
  };

  const updateExercise = (id: string, exercise: Partial<Omit<Exercise, 'id' | 'createdAt' | 'updatedAt'>>) => {
    if(exercises){
      exerciseService.updateExercise(id, exercise);
      toast({
        title: "Exercício atualizado",
        description: "As alterações foram salvas com sucesso."
      });
      setActionRefresh(!actionRefresh);
    }
  };

  const deleteExercise = (id: string) => {
    let exerciseName = "";
    if(exercises){
      let exerciseToDelete = exercises.find(ex => ex.id === id);
      if(exerciseToDelete){
        exerciseName = exerciseToDelete.name;
        exerciseService.deleteExercise(id);
        setExercises(prev => prev.filter(ex => ex.id !== id));
        toast({
          title: "Exercício removido",
          description: exerciseName ? `${exerciseName} foi removido.` : "O exercício foi removido."
        });
        setActionRefresh(!actionRefresh);
      }
    }
  };

  const addWorkout = (workout: Omit<Workout, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newWorkout: Workout = {
      ...workout,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setWorkouts(prev => [...prev, newWorkout]);
    toast({
      title: "Treino registrado",
      description: `Treino de ${newWorkout.date.toLocaleDateString()} adicionado com sucesso.`
    });
  };

  const updateWorkout = (id: string, workout: Partial<Omit<Workout, 'id' | 'createdAt' | 'updatedAt'>>) => {
    setWorkouts(prev => 
      prev.map(w => 
        w.id === id 
          ? { ...w, ...workout, updatedAt: new Date() } 
          : w
      )
    );
    toast({
      title: "Treino atualizado",
      description: "As alterações foram salvas com sucesso."
    });
  };

  const deleteWorkout = (id: string) => {
    let workoutDate = "";
    if(workouts){
      workoutDate = workouts.find(w => w.id === id)?.date.toLocaleDateString();
    }
    setWorkouts(prev => prev.filter(w => w.id !== id));
    toast({
      title: "Treino removido",
      description: workoutDate ? `Treino de ${workoutDate} foi removido.` : "O treino foi removido."
    });
  };

  return (
    <DataContext.Provider 
      value={{ 
        exercises, 
        workouts, 
        addExercise, 
        updateExercise, 
        deleteExercise,
        addWorkout,
        updateWorkout,
        deleteWorkout
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
