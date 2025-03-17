
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Exercise, Workout, MuscleGroup } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from './AuthContext';

// Sample initial data
const initialExercises: Exercise[] = [
  {
    id: '1',
    name: 'Supino Reto',
    muscleGroup: MuscleGroup.CHEST,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Agachamento',
    muscleGroup: MuscleGroup.LEGS,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    name: 'Barra Fixa',
    muscleGroup: MuscleGroup.BACK,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

interface DataContextType {
  exercises: Exercise[];
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
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    // Load data from localStorage when user is authenticated
    if (user) {
      const storedExercises = localStorage.getItem(`exercises-${user.id}`);
      const storedWorkouts = localStorage.getItem(`workouts-${user.id}`);
      
      if (storedExercises) {
        setExercises(JSON.parse(storedExercises));
      } else {
        // Use initial data for demo purposes
        setExercises(initialExercises);
        localStorage.setItem(`exercises-${user.id}`, JSON.stringify(initialExercises));
      }
      
      if (storedWorkouts) {
        // Parse dates from JSON
        const parsedWorkouts = JSON.parse(storedWorkouts);
        parsedWorkouts.forEach((workout: any) => {
          workout.date = new Date(workout.date);
          workout.createdAt = new Date(workout.createdAt);
          workout.updatedAt = new Date(workout.updatedAt);
        });
        setWorkouts(parsedWorkouts);
      } else {
        setWorkouts([]);
      }
    } else {
      // Clear data when user logs out
      setExercises([]);
      setWorkouts([]);
    }
  }, [user]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`exercises-${user.id}`, JSON.stringify(exercises));
    }
  }, [exercises, user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`workouts-${user.id}`, JSON.stringify(workouts));
    }
  }, [workouts, user]);

  const addExercise = (exercise: Omit<Exercise, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newExercise: Exercise = {
      ...exercise,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setExercises(prev => [...prev, newExercise]);
    toast({
      title: "Exercício adicionado",
      description: `${newExercise.name} foi adicionado com sucesso.`
    });
  };

  const updateExercise = (id: string, exercise: Partial<Omit<Exercise, 'id' | 'createdAt' | 'updatedAt'>>) => {
    setExercises(prev => 
      prev.map(ex => 
        ex.id === id 
          ? { ...ex, ...exercise, updatedAt: new Date() } 
          : ex
      )
    );
    toast({
      title: "Exercício atualizado",
      description: "As alterações foram salvas com sucesso."
    });
  };

  const deleteExercise = (id: string) => {
    const exerciseName = exercises.find(ex => ex.id === id)?.name;
    setExercises(prev => prev.filter(ex => ex.id !== id));
    toast({
      title: "Exercício removido",
      description: exerciseName ? `${exerciseName} foi removido.` : "O exercício foi removido."
    });
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
    const workoutDate = workouts.find(w => w.id === id)?.date.toLocaleDateString();
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
